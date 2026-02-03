from rest_framework import serializers
from .models import Employee, LeaveType, Leave, Attendance, Payroll, EmployeeBadge, BadgeScanLog


class EmployeeBadgeSerializer(serializers.ModelSerializer):
    """Serializer pour les badges employés"""
    employee_name = serializers.CharField(source='employee.__str__', read_only=True)
    employee_number = serializers.CharField(source='employee.employee_number', read_only=True)
    agency_name = serializers.CharField(source='employee.agency.name', read_only=True)
    qr_data = serializers.SerializerMethodField()
    is_valid = serializers.SerializerMethodField()
    
    class Meta:
        model = EmployeeBadge
        fields = [
            'id', 'employee', 'employee_name', 'employee_number', 'agency_name',
            'badge_code', 'status', 'issued_date', 'expiry_date',
            'can_access_all_agencies', 'can_activate_monitor', 'can_use_kiosk',
            'last_scan_at', 'last_scan_agency', 'scan_count',
            'qr_data', 'is_valid', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'badge_code', 'qr_data', 'is_valid', 'scan_count', 'created_at', 'updated_at']
    
    def get_qr_data(self, obj):
        return obj.generate_qr_data()
    
    def get_is_valid(self, obj):
        return obj.is_valid()


class BadgeScanLogSerializer(serializers.ModelSerializer):
    """Serializer pour les logs de scan"""
    badge_code = serializers.CharField(source='badge.badge_code', read_only=True)
    employee_name = serializers.CharField(source='badge.employee.__str__', read_only=True)
    agency_name = serializers.CharField(source='agency.name', read_only=True)
    
    class Meta:
        model = BadgeScanLog
        fields = [
            'id', 'badge', 'badge_code', 'employee_name', 'agency', 'agency_name',
            'scan_type', 'result', 'scanned_at', 'ip_address', 'device_info', 'notes'
        ]
        read_only_fields = ['id', 'scanned_at']


class BadgeScanRequestSerializer(serializers.Serializer):
    """Serializer pour les requêtes de scan de badge"""
    badge_code = serializers.CharField(max_length=100)
    signature = serializers.CharField(max_length=16)
    agency_id = serializers.UUIDField()
    scan_type = serializers.ChoiceField(choices=BadgeScanLog.SCAN_TYPES)
    device_info = serializers.CharField(max_length=200, required=False, allow_blank=True)


class EmployeeSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_phone = serializers.CharField(source='user.phone', read_only=True)
    agency_name = serializers.CharField(source='agency.name', read_only=True)
    nationality_name = serializers.CharField(source='nationality.name', read_only=True)
    
    class Meta:
        model = Employee
        fields = [
            'id', 'user', 'user_email', 'user_phone', 'agency', 'agency_name',
            'first_name', 'last_name', 'post_name', 'nationality', 'nationality_name',
            'date_of_birth', 'place_of_birth', 'nif', 'employee_number', 'position',
            'department', 'contract_type', 'hire_date', 'status', 'base_salary',
            'is_key_staff', 'photo', 'photo_url', 'bio', 'linkedin_url',
            'emergency_contact_name', 'emergency_contact_phone', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'employee_number', 'created_at', 'updated_at']


class KeyStaffSerializer(serializers.ModelSerializer):
    """Serializer pour l'affichage public de l'équipe clé"""
    agency_name = serializers.CharField(source='agency.name', read_only=True)
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    
    class Meta:
        model = Employee
        fields = [
            'id', 'full_name', 'first_name', 'last_name', 'position', 'department',
            'agency_name', 'photo', 'photo_url', 'bio', 'linkedin_url'
        ]


class LeaveTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveType
        fields = ['id', 'name', 'days_per_year']
        read_only_fields = ['id']


class LeaveSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    leave_type_name = serializers.CharField(source='leave_type.name', read_only=True)
    
    class Meta:
        model = Leave
        fields = [
            'id', 'employee', 'employee_name', 'leave_type', 'leave_type_name',
            'start_date', 'end_date', 'reason', 'status', 'approved_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    
    class Meta:
        model = Attendance
        fields = ['id', 'employee', 'employee_name', 'date', 'check_in', 'check_out', 'status', 'notes']
        read_only_fields = ['id']


class PayrollSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    
    class Meta:
        model = Payroll
        fields = [
            'id', 'employee', 'employee_name', 'month', 'base_salary', 'bonuses',
            'deductions', 'net_salary', 'pdf_file', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
