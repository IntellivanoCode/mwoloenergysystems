from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.utils import timezone
from .models import Employee, LeaveType, Leave, Attendance, Payroll, EmployeeBadge, BadgeScanLog
from .serializers import (
    EmployeeSerializer, LeaveTypeSerializer, LeaveSerializer, 
    AttendanceSerializer, PayrollSerializer, KeyStaffSerializer,
    EmployeeBadgeSerializer, BadgeScanLogSerializer, BadgeScanRequestSerializer
)

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.filter(status='actif')
    serializer_class = EmployeeSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = Employee.objects.all()
        
        # Filtrer par agence
        agency_id = self.request.query_params.get('agency')
        if agency_id:
            queryset = queryset.filter(agency_id=agency_id)
        
        # Filtrer par statut
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filtrer par département
        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(department=department)
        
        return queryset.order_by('last_name', 'first_name')

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        employee = getattr(request.user, 'employee', None)
        if not employee:
            return Response({'detail': 'Profil employé introuvable.'}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(employee)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_agency(self, request):
        """Récupérer les employés par agence"""
        agency_id = request.query_params.get('agency_id')
        if not agency_id:
            return Response({'error': 'agency_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        employees = Employee.objects.filter(agency_id=agency_id, status='actif')
        serializer = self.get_serializer(employees, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def key_staff(self, request):
        """Récupérer le personnel clé marqué pour affichage public"""
        employees = Employee.objects.filter(
            status='actif',
            is_key_staff=True
        ).order_by('agency', 'position')
        serializer = KeyStaffSerializer(employees, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def team(self, request):
        """Récupérer toute l'équipe visible publiquement (personnel clé uniquement)"""
        employees = Employee.objects.filter(
            status='actif',
            is_key_staff=True
        ).order_by('position', 'last_name')
        serializer = KeyStaffSerializer(employees, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def validate_badge(self, request):
        """Valider un badge employé simplement (sans signature cryptographique)"""
        badge_code = request.data.get('badge_code', '')
        
        if not badge_code:
            return Response({
                'valid': False,
                'error': 'Code badge requis'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Chercher le badge (status='actif' en français)
        try:
            badge = EmployeeBadge.objects.select_related('employee', 'employee__agency').get(
                badge_code=badge_code,
                status='actif'
            )
        except EmployeeBadge.DoesNotExist:
            return Response({
                'valid': False,
                'error': 'Badge invalide ou inactif'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Vérifier si le badge est valide (non expiré)
        if not badge.is_valid():
            return Response({
                'valid': False,
                'error': 'Badge expiré'
            }, status=status.HTTP_403_FORBIDDEN)
        
        employee = badge.employee
        return Response({
            'valid': True,
            'employee_name': f"{employee.first_name} {employee.last_name}",
            'employee_id': str(employee.id),
            'agency_id': str(employee.agency_id) if employee.agency_id else None,
            'agency_name': employee.agency.name if employee.agency else None,
            'position': employee.position,
            'badge_status': badge.status,
        })

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def badge_login(self, request):
        """Connexion par badge - retourne un token JWT"""
        from rest_framework_simplejwt.tokens import RefreshToken
        
        badge_code = request.data.get('badge_code', '')
        
        if not badge_code:
            return Response({
                'error': 'Code badge requis'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Chercher le badge (status='actif' en français)
        try:
            badge = EmployeeBadge.objects.select_related('employee', 'employee__user', 'employee__agency').get(
                badge_code=badge_code,
                status='actif'
            )
        except EmployeeBadge.DoesNotExist:
            return Response({
                'error': 'Badge invalide ou inactif'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if not badge.is_valid():
            return Response({
                'error': 'Badge expiré'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        employee = badge.employee
        user = employee.user
        
        if not user:
            return Response({
                'error': 'Aucun compte utilisateur associé à cet employé'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Générer les tokens JWT
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': str(user.id),
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'role': user.role,
            },
            'employee': {
                'id': str(employee.id),
                'position': employee.position,
                'agency_id': str(employee.agency_id) if employee.agency_id else None,
                'agency_name': employee.agency.name if employee.agency else None,
            }
        })


class LeaveTypeViewSet(viewsets.ModelViewSet):
    queryset = LeaveType.objects.all()
    serializer_class = LeaveTypeSerializer
    permission_classes = [AllowAny]


class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='me')
    def me(self, request):
        employee = getattr(request.user, 'employee', None)
        if not employee:
            return Response([], status=status.HTTP_200_OK)
        attendances = self.get_queryset().filter(employee=employee).order_by('-date')
        serializer = self.get_serializer(attendances, many=True)
        return Response(serializer.data)


class PayrollViewSet(viewsets.ModelViewSet):
    queryset = Payroll.objects.all()
    serializer_class = PayrollSerializer
    permission_classes = [IsAuthenticated]


class EmployeeBadgeViewSet(viewsets.ModelViewSet):
    """Gestion des badges employés"""
    queryset = EmployeeBadge.objects.all()
    serializer_class = EmployeeBadgeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = EmployeeBadge.objects.select_related('employee', 'employee__agency')
        
        # Filtrer par agence
        agency_id = self.request.query_params.get('agency')
        if agency_id:
            queryset = queryset.filter(employee__agency_id=agency_id)
        
        # Filtrer par statut
        badge_status = self.request.query_params.get('status')
        if badge_status:
            queryset = queryset.filter(status=badge_status)
        
        return queryset
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_badge(self, request):
        """Récupérer le badge de l'employé connecté"""
        employee = getattr(request.user, 'employee', None)
        if not employee:
            return Response({'detail': 'Profil employé introuvable.'}, status=status.HTTP_404_NOT_FOUND)
        
        badge = EmployeeBadge.objects.filter(employee=employee).first()
        if not badge:
            return Response({'detail': 'Badge non attribué.'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(badge)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def regenerate(self, request, pk=None):
        """Régénérer le code QR d'un badge"""
        badge = self.get_object()
        import secrets
        badge.qr_secret = secrets.token_hex(32)
        badge.save(update_fields=['qr_secret'])
        serializer = self.get_serializer(badge)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def create_for_employee(self, request):
        """Créer un badge pour un employé"""
        employee_id = request.data.get('employee_id')
        if not employee_id:
            return Response({'error': 'employee_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            employee = Employee.objects.get(id=employee_id)
        except Employee.DoesNotExist:
            return Response({'error': 'Employé introuvable'}, status=status.HTTP_404_NOT_FOUND)
        
        # Vérifier si un badge existe déjà
        existing = EmployeeBadge.objects.filter(employee=employee).first()
        if existing:
            return Response({'error': 'Un badge existe déjà pour cet employé', 'badge': EmployeeBadgeSerializer(existing).data}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Créer le badge
        badge = EmployeeBadge.objects.create(
            employee=employee,
            can_activate_monitor=employee.can_view_monitor,
            can_use_kiosk=True,
        )
        serializer = self.get_serializer(badge)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BadgeScanView(APIView):
    """API publique pour scanner les badges (bornes, moniteurs)"""
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = BadgeScanRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        # Trouver le badge
        try:
            badge = EmployeeBadge.objects.select_related('employee', 'employee__agency').get(
                badge_code=data['badge_code']
            )
        except EmployeeBadge.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Badge invalide',
                'result': 'invalid'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Vérifier la signature
        if not badge.verify_scan(data['signature']):
            BadgeScanLog.objects.create(
                badge=badge,
                agency_id=data['agency_id'],
                scan_type=data['scan_type'],
                result='invalid',
                ip_address=self.get_client_ip(request),
                device_info=data.get('device_info', ''),
                notes='Signature invalide'
            )
            return Response({
                'success': False,
                'error': 'Signature invalide',
                'result': 'invalid'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Vérifier si le badge est valide
        if not badge.is_valid():
            BadgeScanLog.objects.create(
                badge=badge,
                agency_id=data['agency_id'],
                scan_type=data['scan_type'],
                result='expired',
                ip_address=self.get_client_ip(request),
                device_info=data.get('device_info', ''),
                notes=f'Badge {badge.status}'
            )
            return Response({
                'success': False,
                'error': 'Badge expiré ou désactivé',
                'result': 'expired'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Vérifier l'accès à l'agence
        if not badge.can_access_agency(data['agency_id']):
            BadgeScanLog.objects.create(
                badge=badge,
                agency_id=data['agency_id'],
                scan_type=data['scan_type'],
                result='denied',
                ip_address=self.get_client_ip(request),
                device_info=data.get('device_info', ''),
                notes='Accès agence refusé'
            )
            return Response({
                'success': False,
                'error': 'Accès non autorisé à cette agence',
                'result': 'denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Vérifications spécifiques selon le type de scan
        scan_type = data['scan_type']
        
        if scan_type == 'monitor' and not badge.can_activate_monitor:
            BadgeScanLog.objects.create(
                badge=badge,
                agency_id=data['agency_id'],
                scan_type=scan_type,
                result='denied',
                ip_address=self.get_client_ip(request),
                device_info=data.get('device_info', ''),
                notes='Non autorisé à activer le moniteur'
            )
            return Response({
                'success': False,
                'error': 'Non autorisé à activer le moniteur',
                'result': 'denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        if scan_type == 'kiosk' and not badge.can_use_kiosk:
            BadgeScanLog.objects.create(
                badge=badge,
                agency_id=data['agency_id'],
                scan_type=scan_type,
                result='denied',
                ip_address=self.get_client_ip(request),
                device_info=data.get('device_info', ''),
                notes='Non autorisé à utiliser la borne'
            )
            return Response({
                'success': False,
                'error': 'Non autorisé à utiliser cette borne',
                'result': 'denied'
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Enregistrer le scan réussi
        from agencies.models import Agency
        try:
            agency = Agency.objects.get(id=data['agency_id'])
        except Agency.DoesNotExist:
            agency = None
        
        badge.record_scan(agency)
        
        BadgeScanLog.objects.create(
            badge=badge,
            agency_id=data['agency_id'],
            scan_type=scan_type,
            result='success',
            ip_address=self.get_client_ip(request),
            device_info=data.get('device_info', '')
        )
        
        # Si c'est un pointage présence, créer/màj l'attendance
        if scan_type == 'presence':
            self.handle_presence_scan(badge, agency)
        
        return Response({
            'success': True,
            'result': 'success',
            'employee': {
                'name': str(badge.employee),
                'number': badge.employee.employee_number,
                'position': badge.employee.get_position_display(),
                'agency': badge.employee.agency.name,
            },
            'badge': {
                'code': badge.badge_code,
                'can_activate_monitor': badge.can_activate_monitor,
                'can_use_kiosk': badge.can_use_kiosk,
            },
            'permissions': {
                'dashboards': badge.employee.get_accessible_dashboards(),
                'can_manage_queue': badge.employee.can_manage_queue,
            }
        })
    
    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            return x_forwarded_for.split(',')[0]
        return request.META.get('REMOTE_ADDR')
    
    def handle_presence_scan(self, badge, agency):
        """Gérer le pointage de présence"""
        today = timezone.now().date()
        current_time = timezone.now().time()
        
        attendance, created = Attendance.objects.get_or_create(
            employee=badge.employee,
            date=today,
            defaults={
                'check_in': current_time,
                'status': 'present' if current_time.hour < 9 else 'retard'
            }
        )
        
        if not created and not attendance.check_out:
            # C'est la sortie
            attendance.check_out = current_time
            attendance.save(update_fields=['check_out'])


class BadgeScanLogViewSet(viewsets.ReadOnlyModelViewSet):
    """Consultation des logs de scan"""
    queryset = BadgeScanLog.objects.all()
    serializer_class = BadgeScanLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = BadgeScanLog.objects.select_related('badge', 'badge__employee', 'agency')
        
        # Filtrer par agence
        agency_id = self.request.query_params.get('agency')
        if agency_id:
            queryset = queryset.filter(agency_id=agency_id)
        
        # Filtrer par badge
        badge_id = self.request.query_params.get('badge')
        if badge_id:
            queryset = queryset.filter(badge_id=badge_id)
        
        # Filtrer par type
        scan_type = self.request.query_params.get('type')
        if scan_type:
            queryset = queryset.filter(scan_type=scan_type)
        
        # Filtrer par date
        date = self.request.query_params.get('date')
        if date:
            queryset = queryset.filter(scanned_at__date=date)
        
        return queryset.order_by('-scanned_at')[:100]  # Limiter à 100
