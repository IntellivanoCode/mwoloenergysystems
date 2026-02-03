from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone
from datetime import date, timedelta

from .models import ServiceType, Counter, TimeSlot, Appointment, QueueTicket, DailyQueueStats
from .serializers import (
    ServiceTypeSerializer, CounterSerializer, TimeSlotSerializer,
    AppointmentSerializer, AppointmentCreateSerializer,
    QueueTicketSerializer, QueueTicketCreateSerializer,
    DailyQueueStatsSerializer
)


class ServiceTypeViewSet(viewsets.ModelViewSet):
    """API pour les types de services"""
    queryset = ServiceType.objects.filter(is_active=True)
    serializer_class = ServiceTypeSerializer
    permission_classes = [AllowAny]  # Public pour permettre la prise de RDV
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['name', 'created_at']


class CounterViewSet(viewsets.ModelViewSet):
    """API pour les guichets"""
    queryset = Counter.objects.all()
    serializer_class = CounterSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['agency', 'status', 'is_active']
    search_fields = ['name']
    ordering_fields = ['number', 'created_at']
    
    @action(detail=False, methods=['get'])
    def by_agency(self, request):
        """Récupérer les guichets d'une agence spécifique"""
        agency_id = request.query_params.get('agency')
        if not agency_id:
            return Response({'error': 'agency parameter required'}, status=400)
        
        counters = self.get_queryset().filter(agency_id=agency_id, is_active=True)
        serializer = self.get_serializer(counters, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def call_next(self, request, pk=None):
        """Appeler le prochain ticket dans la file"""
        counter = self.get_object()
        
        # Vérifier que l'agent est autorisé
        if counter.current_agent != request.user:
            return Response({'error': 'Vous n\'êtes pas affecté à ce guichet'}, status=403)
        
        # Compléter le ticket en cours s'il y en a un
        if counter.current_ticket:
            old_ticket = counter.current_ticket
            old_ticket.status = 'completed'
            old_ticket.completed_at = timezone.now()
            old_ticket.save()
        
        # Trouver le prochain ticket
        next_ticket = QueueTicket.objects.filter(
            agency=counter.agency,
            date=date.today(),
            status='waiting',
            service__in=counter.services.all()
        ).order_by('priority', 'created_at').first()
        
        if not next_ticket:
            counter.current_ticket = None
            counter.status = 'available'
            counter.save()
            return Response({'message': 'Aucun ticket en attente', 'counter': self.get_serializer(counter).data})
        
        # Appeler le ticket
        next_ticket.status = 'called'
        next_ticket.called_at = timezone.now()
        next_ticket.counter = counter
        next_ticket.served_by = request.user
        next_ticket.save()
        
        counter.current_ticket = next_ticket
        counter.status = 'busy'
        counter.save()
        
        return Response({
            'message': f'Ticket {next_ticket.ticket_number} appelé',
            'ticket': QueueTicketSerializer(next_ticket).data,
            'counter': self.get_serializer(counter).data
        })
    
    @action(detail=True, methods=['post'])
    def start_service(self, request, pk=None):
        """Démarrer le service pour le ticket appelé"""
        counter = self.get_object()
        
        if not counter.current_ticket:
            return Response({'error': 'Aucun ticket assigné'}, status=400)
        
        ticket = counter.current_ticket
        ticket.status = 'serving'
        ticket.served_at = timezone.now()
        ticket.save()
        
        return Response({
            'message': 'Service démarré',
            'ticket': QueueTicketSerializer(ticket).data
        })
    
    @action(detail=True, methods=['post'])
    def complete_service(self, request, pk=None):
        """Terminer le service"""
        counter = self.get_object()
        
        if not counter.current_ticket:
            return Response({'error': 'Aucun ticket assigné'}, status=400)
        
        ticket = counter.current_ticket
        ticket.status = 'completed'
        ticket.completed_at = timezone.now()
        ticket.save()
        
        counter.current_ticket = None
        counter.status = 'available'
        counter.save()
        
        return Response({
            'message': 'Service terminé',
            'counter': self.get_serializer(counter).data
        })
    
    @action(detail=True, methods=['post'])
    def mark_no_show(self, request, pk=None):
        """Marquer le client comme absent"""
        counter = self.get_object()
        
        if not counter.current_ticket:
            return Response({'error': 'Aucun ticket assigné'}, status=400)
        
        ticket = counter.current_ticket
        ticket.status = 'no_show'
        ticket.completed_at = timezone.now()
        ticket.save()
        
        counter.current_ticket = None
        counter.status = 'available'
        counter.save()
        
        return Response({
            'message': 'Client marqué absent',
            'counter': self.get_serializer(counter).data
        })


class TimeSlotViewSet(viewsets.ModelViewSet):
    """API pour les créneaux horaires"""
    queryset = TimeSlot.objects.filter(is_active=True)
    serializer_class = TimeSlotSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['agency', 'day_of_week']
    ordering_fields = ['day_of_week', 'start_time']
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def available(self, request):
        """Récupérer les créneaux disponibles pour une agence et une date"""
        agency_id = request.query_params.get('agency')
        date_str = request.query_params.get('date')
        
        if not agency_id or not date_str:
            return Response({'error': 'agency and date parameters required'}, status=400)
        
        from datetime import datetime
        try:
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=400)
        
        day_of_week = target_date.weekday()
        
        slots = self.get_queryset().filter(
            agency_id=agency_id,
            day_of_week=day_of_week,
            is_active=True
        )
        
        # Vérifier la disponibilité de chaque créneau
        available_slots = []
        for slot in slots:
            existing_count = Appointment.objects.filter(
                agency_id=agency_id,
                date=target_date,
                time__gte=slot.start_time,
                time__lt=slot.end_time,
                status__in=['pending', 'confirmed']
            ).count()
            
            if existing_count < slot.max_appointments:
                slot_data = self.get_serializer(slot).data
                slot_data['available_spots'] = slot.max_appointments - existing_count
                available_slots.append(slot_data)
        
        return Response(available_slots)


class AppointmentViewSet(viewsets.ModelViewSet):
    """API pour les rendez-vous"""
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [AllowAny]  # Permettre aux non-inscrits de prendre RDV
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['agency', 'service', 'status', 'date']
    search_fields = ['client_name', 'client_phone', 'confirmation_code']
    ordering_fields = ['date', 'time', 'created_at']
    
    def get_serializer_class(self):
        if self.action == 'create':
            return AppointmentCreateSerializer
        return AppointmentSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if hasattr(user, 'role') and user.role in ['admin', 'manager', 'operations']:
                return Appointment.objects.all()
            return Appointment.objects.filter(user=user)
        return Appointment.objects.none()
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def check(self, request):
        """Vérifier un rendez-vous par code de confirmation"""
        code = request.query_params.get('code')
        phone = request.query_params.get('phone')
        
        if not code:
            return Response({'error': 'code parameter required'}, status=400)
        
        appointments = Appointment.objects.filter(confirmation_code=code.upper())
        
        if phone:
            appointments = appointments.filter(client_phone=phone)
        
        appointment = appointments.first()
        
        if not appointment:
            return Response({'error': 'Rendez-vous introuvable'}, status=404)
        
        return Response(AppointmentSerializer(appointment).data)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_appointments(self, request):
        """Récupérer les rendez-vous de l'utilisateur connecté"""
        appointments = Appointment.objects.filter(user=request.user).order_by('-date', '-time')
        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Annuler un rendez-vous"""
        appointment = self.get_object()
        
        if appointment.status in ['completed', 'cancelled']:
            return Response({'error': 'Ce rendez-vous ne peut pas être annulé'}, status=400)
        
        appointment.status = 'cancelled'
        appointment.cancelled_at = timezone.now()
        appointment.cancellation_reason = request.data.get('reason', '')
        appointment.save()
        
        return Response({
            'message': 'Rendez-vous annulé',
            'appointment': self.get_serializer(appointment).data
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def confirm(self, request, pk=None):
        """Confirmer un rendez-vous (agent)"""
        appointment = self.get_object()
        
        if appointment.status != 'pending':
            return Response({'error': 'Ce rendez-vous ne peut pas être confirmé'}, status=400)
        
        appointment.status = 'confirmed'
        appointment.confirmed_at = timezone.now()
        appointment.save()
        
        return Response({
            'message': 'Rendez-vous confirmé',
            'appointment': self.get_serializer(appointment).data
        })
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def convert_to_ticket(self, request, pk=None):
        """Convertir un rendez-vous en ticket de file d'attente"""
        appointment = self.get_object()
        
        if appointment.queue_ticket:
            return Response({
                'error': 'Un ticket existe déjà pour ce rendez-vous',
                'ticket': QueueTicketSerializer(appointment.queue_ticket).data
            }, status=400)
        
        # Créer le ticket
        ticket = QueueTicket.objects.create(
            agency=appointment.agency,
            service=appointment.service,
            client_name=appointment.client_name,
            client_phone=appointment.client_phone,
            user=appointment.user,
            priority='priority'  # Les RDV sont prioritaires
        )
        
        appointment.queue_ticket = ticket
        appointment.status = 'in_progress'
        appointment.save()
        
        return Response({
            'message': 'Ticket créé',
            'ticket': QueueTicketSerializer(ticket).data,
            'appointment': self.get_serializer(appointment).data
        })


class QueueTicketViewSet(viewsets.ModelViewSet):
    """API pour les tickets de file d'attente"""
    queryset = QueueTicket.objects.all()
    serializer_class = QueueTicketSerializer
    permission_classes = [AllowAny]  # Permettre la prise de ticket sans inscription
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['agency', 'service', 'date', 'counter']  # status géré manuellement
    search_fields = ['ticket_number', 'client_name', 'client_phone']
    ordering_fields = ['created_at', 'priority', 'queue_position']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtrer par statut (peut être multiple: waiting,called)
        status_param = self.request.query_params.get('status')
        if status_param:
            statuses = [s.strip() for s in status_param.split(',')]
            queryset = queryset.filter(status__in=statuses)
        
        # Filtrer par date du jour par défaut si pas de date spécifiée
        date_param = self.request.query_params.get('date')
        if not date_param:
            queryset = queryset.filter(date=date.today())
        
        return queryset.order_by('priority', 'created_at')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return QueueTicketCreateSerializer
        return QueueTicketSerializer
    
    def create(self, request, *args, **kwargs):
        """Créer un ticket et retourner les données complètes"""
        serializer = QueueTicketCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        ticket = serializer.save()
        
        # Retourner les données complètes avec QueueTicketSerializer
        response_serializer = QueueTicketSerializer(ticket)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def display(self, request):
        """Endpoint pour l'affichage public des files d'attente (écran moniteur)"""
        agency_id = request.query_params.get('agency')
        
        if not agency_id:
            return Response({'error': 'agency parameter required'}, status=400)
        
        from agencies.models import Agency
        try:
            agency = Agency.objects.get(id=agency_id, is_active=True)
        except Agency.DoesNotExist:
            return Response({'error': 'Agence introuvable'}, status=404)
        
        today = date.today()
        
        # Guichets actifs
        counters = Counter.objects.filter(
            agency=agency,
            is_active=True,
            status__in=['available', 'busy']
        ).select_related('current_ticket', 'current_agent')
        
        # Tickets en attente
        waiting_tickets = QueueTicket.objects.filter(
            agency=agency,
            date=today,
            status='waiting'
        ).order_by('priority', 'created_at')[:20]
        
        # Tickets appelés (5 derniers)
        called_tickets = QueueTicket.objects.filter(
            agency=agency,
            date=today,
            status__in=['called', 'serving']
        ).order_by('-called_at')[:5]
        
        # Stats
        total_waiting = QueueTicket.objects.filter(
            agency=agency,
            date=today,
            status='waiting'
        ).count()
        
        avg_wait = 15  # TODO: Calculer à partir des données réelles
        
        return Response({
            'agency_name': agency.name,
            'current_datetime': timezone.now(),
            'counters': CounterSerializer(counters, many=True).data,
            'waiting_tickets': QueueTicketSerializer(waiting_tickets, many=True).data,
            'called_tickets': QueueTicketSerializer(called_tickets, many=True).data,
            'total_waiting': total_waiting,
            'avg_wait_time': avg_wait
        })
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def check(self, request):
        """Vérifier le statut d'un ticket"""
        ticket_number = request.query_params.get('ticket')
        agency_id = request.query_params.get('agency')
        
        if not ticket_number:
            return Response({'error': 'ticket parameter required'}, status=400)
        
        filters = {'ticket_number': ticket_number.upper(), 'date': date.today()}
        if agency_id:
            filters['agency_id'] = agency_id
        
        ticket = QueueTicket.objects.filter(**filters).first()
        
        if not ticket:
            return Response({'error': 'Ticket introuvable'}, status=404)
        
        # Calculer la position actuelle
        if ticket.status == 'waiting':
            position = QueueTicket.objects.filter(
                agency=ticket.agency,
                date=ticket.date,
                status='waiting',
                created_at__lt=ticket.created_at
            ).count() + 1
        else:
            position = 0
        
        data = QueueTicketSerializer(ticket).data
        data['current_position'] = position
        
        return Response(data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Annuler un ticket"""
        ticket = self.get_object()
        
        if ticket.status not in ['waiting', 'called']:
            return Response({'error': 'Ce ticket ne peut pas être annulé'}, status=400)
        
        ticket.status = 'cancelled'
        ticket.completed_at = timezone.now()
        ticket.save()
        
        return Response({
            'message': 'Ticket annulé',
            'ticket': self.get_serializer(ticket).data
        })
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def call_next(self, request):
        """Appeler le prochain ticket (utilisé par frontend-agency guichet)"""
        agency_id = request.data.get('agency')
        counter_id = request.data.get('counter')
        counter_name = request.data.get('counter_name', f'Guichet {counter_id}')
        
        if not agency_id or not counter_id:
            return Response(
                {'error': 'agency et counter requis'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        today = date.today()
        
        # Trouver le prochain ticket en attente (prioritaire d'abord)
        next_ticket = QueueTicket.objects.filter(
            agency_id=agency_id,
            status='waiting',
            date=today
        ).order_by('priority', 'created_at').first()
        
        if not next_ticket:
            return Response(
                {'message': 'Aucun ticket en attente'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Mettre à jour le ticket
        next_ticket.status = 'called'
        next_ticket.called_at = timezone.now()
        # Stocker le counter_id dans notes puisque counter est un ForeignKey
        next_ticket.notes = f"Guichet: {counter_name} (ID: {counter_id})"
        next_ticket.save()
        
        # Préparer la réponse avec les champs attendus par le frontend
        response_data = self.get_serializer(next_ticket).data
        response_data['counter'] = counter_id
        response_data['counter_name'] = counter_name
        
        return Response(response_data)
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def complete(self, request, pk=None):
        """Marquer un ticket comme terminé"""
        ticket = self.get_object()
        ticket.status = 'completed'
        ticket.completed_at = timezone.now()
        ticket.save()
        
        return Response({
            'message': 'Ticket terminé',
            'ticket': self.get_serializer(ticket).data
        })
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def recall(self, request, pk=None):
        """Rappeler un ticket (client absent momentanément)"""
        ticket = self.get_object()
        ticket.called_at = timezone.now()  # Réinitialiser l'heure d'appel
        ticket.save()
        
        return Response({
            'message': 'Ticket rappelé',
            'ticket': self.get_serializer(ticket).data
        })
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def no_show(self, request, pk=None):
        """Marquer comme absent"""
        ticket = self.get_object()
        ticket.status = 'no_show'
        ticket.completed_at = timezone.now()
        ticket.save()
        
        return Response({
            'message': 'Client marqué absent',
            'ticket': self.get_serializer(ticket).data
        })
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def transfer(self, request, pk=None):
        """Transférer à un autre guichet"""
        ticket = self.get_object()
        new_counter = request.data.get('counter')
        counter_name = request.data.get('counter_name', f'Guichet {new_counter}')
        
        if not new_counter:
            return Response(
                {'error': 'counter requis'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        ticket.notes = f"Transféré au {counter_name} (ID: {new_counter})"
        ticket.status = 'waiting'  # Remettre en attente
        ticket.called_at = None
        ticket.save()
        
        return Response({
            'message': f'Ticket transféré au {counter_name}',
            'ticket': self.get_serializer(ticket).data
        })
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def stats(self, request):
        """Statistiques de la file d'attente pour le moniteur"""
        agency_id = request.query_params.get('agency')
        
        if not agency_id:
            return Response(
                {'error': 'agency requis'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        today = date.today()
        tickets_today = QueueTicket.objects.filter(
            agency_id=agency_id,
            date=today
        )
        
        # Compter par statut
        waiting_count = tickets_today.filter(status='waiting').count()
        serving_count = tickets_today.filter(status__in=['called', 'serving']).count()
        completed_count = tickets_today.filter(status='completed').count()
        
        # Calculer le temps d'attente moyen (en minutes)
        completed_with_times = tickets_today.filter(
            status='completed',
            called_at__isnull=False
        )
        
        if completed_with_times.exists():
            wait_times = []
            for t in completed_with_times:
                if t.called_at and t.created_at:
                    wait_time = (t.called_at - t.created_at).total_seconds() / 60
                    wait_times.append(wait_time)
            average_wait_time = sum(wait_times) / len(wait_times) if wait_times else 0
        else:
            average_wait_time = 0
        
        return Response({
            'waiting_count': waiting_count,
            'serving_count': serving_count,
            'completed_today': completed_count,
            'average_wait_time': round(average_wait_time, 1),
            'total_today': tickets_today.count(),
        })


class DailyQueueStatsViewSet(viewsets.ReadOnlyModelViewSet):
    """API pour les statistiques des files d'attente"""
    queryset = DailyQueueStats.objects.all()
    serializer_class = DailyQueueStatsSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['agency', 'date']
    ordering_fields = ['date']
