from rest_framework import serializers
from .models import ServiceType, Counter, TimeSlot, Appointment, QueueTicket, DailyQueueStats


class ServiceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
        fields = '__all__'


class CounterSerializer(serializers.ModelSerializer):
    agency_name = serializers.CharField(source='agency.name', read_only=True)
    current_agent_name = serializers.SerializerMethodField()
    current_ticket_number = serializers.CharField(source='current_ticket.ticket_number', read_only=True)
    services_list = ServiceTypeSerializer(source='services', many=True, read_only=True)
    
    class Meta:
        model = Counter
        fields = [
            'id', 'agency', 'agency_name', 'number', 'name', 'services', 'services_list',
            'current_agent', 'current_agent_name', 'status', 'is_active',
            'current_ticket', 'current_ticket_number', 'created_at', 'updated_at'
        ]
    
    def get_current_agent_name(self, obj):
        if obj.current_agent:
            return f"{obj.current_agent.first_name} {obj.current_agent.last_name}"
        return None


class TimeSlotSerializer(serializers.ModelSerializer):
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)
    agency_name = serializers.CharField(source='agency.name', read_only=True)
    
    class Meta:
        model = TimeSlot
        fields = [
            'id', 'agency', 'agency_name', 'day_of_week', 'day_name',
            'start_time', 'end_time', 'max_appointments', 'is_active'
        ]


class AppointmentSerializer(serializers.ModelSerializer):
    agency_name = serializers.CharField(source='agency.name', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'user', 'client_name', 'client_phone', 'client_email',
            'agency', 'agency_name', 'service', 'service_name',
            'date', 'time', 'confirmation_code', 'status', 'status_display',
            'notes', 'confirmed_at', 'completed_at', 'cancelled_at',
            'cancellation_reason', 'handled_by', 'queue_ticket',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'confirmation_code', 'created_at', 'updated_at']


class AppointmentCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer un rendez-vous (clients inscrits ou non)"""
    
    class Meta:
        model = Appointment
        fields = [
            'client_name', 'client_phone', 'client_email',
            'agency', 'service', 'date', 'time', 'notes'
        ]
    
    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
            # Pré-remplir les infos du client avec les données de l'utilisateur
            if not validated_data.get('client_name'):
                validated_data['client_name'] = f"{request.user.first_name} {request.user.last_name}"
            if not validated_data.get('client_phone') and hasattr(request.user, 'phone'):
                validated_data['client_phone'] = request.user.phone or ''
            if not validated_data.get('client_email'):
                validated_data['client_email'] = request.user.email
        
        return super().create(validated_data)


class QueueTicketSerializer(serializers.ModelSerializer):
    agency_name = serializers.CharField(source='agency.name', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    service_color = serializers.CharField(source='service.color', read_only=True)
    counter_number = serializers.IntegerField(source='counter.number', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    served_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = QueueTicket
        fields = [
            'id', 'agency', 'agency_name', 'service', 'service_name', 'service_color',
            'ticket_number', 'client_name', 'client_phone', 'user',
            'status', 'status_display', 'priority', 'priority_display',
            'date', 'created_at', 'called_at', 'served_at', 'completed_at',
            'counter', 'counter_number', 'served_by', 'served_by_name',
            'estimated_wait_time', 'queue_position', 'notes'
        ]
        read_only_fields = ['id', 'ticket_number', 'created_at']
    
    def get_served_by_name(self, obj):
        if obj.served_by:
            return f"{obj.served_by.first_name} {obj.served_by.last_name}"
        return None


class QueueTicketCreateSerializer(serializers.ModelSerializer):
    """Serializer pour créer un ticket de file d'attente"""
    service_type = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = QueueTicket
        fields = ['agency', 'service', 'service_type', 'client_name', 'client_phone', 'priority']
        extra_kwargs = {
            'service': {'required': False},
        }
    
    def create(self, validated_data):
        request = self.context.get('request')
        
        # Gérer service_type (code string) -> service (ForeignKey)
        service_type_code = validated_data.pop('service_type', None)
        if service_type_code and not validated_data.get('service'):
            # Chercher le service par son code ou en créer un par défaut
            service = ServiceType.objects.filter(code__iexact=service_type_code).first()
            if not service:
                # Créer un service générique si non trouvé
                service, _ = ServiceType.objects.get_or_create(
                    code=service_type_code,
                    defaults={'name': service_type_code.capitalize(), 'estimated_duration': 15}
                )
            validated_data['service'] = service
        
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
            if not validated_data.get('client_name'):
                validated_data['client_name'] = f"{request.user.first_name} {request.user.last_name}"
            if not validated_data.get('client_phone') and hasattr(request.user, 'phone'):
                validated_data['client_phone'] = request.user.phone or ''
        
        # Calculer la position dans la file
        from django.utils import timezone
        today = timezone.now().date()
        waiting_count = QueueTicket.objects.filter(
            agency=validated_data['agency'],
            date=today,
            status='waiting'
        ).count()
        validated_data['queue_position'] = waiting_count + 1
        
        # Estimer le temps d'attente (durée moyenne * position)
        service = validated_data.get('service')
        if service:
            validated_data['estimated_wait_time'] = service.estimated_duration * validated_data['queue_position']
        else:
            validated_data['estimated_wait_time'] = 15 * validated_data['queue_position']
        
        return super().create(validated_data)


class DailyQueueStatsSerializer(serializers.ModelSerializer):
    agency_name = serializers.CharField(source='agency.name', read_only=True)
    
    class Meta:
        model = DailyQueueStats
        fields = '__all__'


class QueueDisplaySerializer(serializers.Serializer):
    """Serializer pour l'affichage public des files d'attente"""
    agency_name = serializers.CharField()
    current_datetime = serializers.DateTimeField()
    
    counters = CounterSerializer(many=True)
    waiting_tickets = QueueTicketSerializer(many=True)
    called_tickets = QueueTicketSerializer(many=True)
    
    total_waiting = serializers.IntegerField()
    avg_wait_time = serializers.IntegerField()
