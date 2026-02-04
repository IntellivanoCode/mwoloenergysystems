from django.contrib import admin
from .models import Employee, LeaveType, Leave, Attendance, Payroll, EmployeeBadge, BadgeScanLog


@admin.register(EmployeeBadge)
class EmployeeBadgeAdmin(admin.ModelAdmin):
    list_display = ('badge_code', 'employee', 'status', 'issued_date', 'expiry_date', 'scan_count')
    list_filter = ('status', 'issued_date', 'can_access_all_agencies')
    search_fields = ('badge_code', 'employee__first_name', 'employee__last_name', 'employee__employee_number')
    readonly_fields = ('badge_code', 'qr_secret', 'scan_count', 'last_scan_at', 'last_scan_agency', 'created_at', 'updated_at')
    raw_id_fields = ('employee',)
    fieldsets = (
        ('Badge', {
            'fields': ('employee', 'badge_code', 'qr_secret', 'status', 'issued_date', 'expiry_date')
        }),
        ('Permissions', {
            'fields': ('can_access_all_agencies', 'can_activate_monitor', 'can_use_kiosk')
        }),
        ('Statistiques', {
            'fields': ('scan_count', 'last_scan_at', 'last_scan_agency'),
            'classes': ('collapse',)
        }),
        ('Métadonnées', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('employee', 'employee__agency', 'last_scan_agency')


@admin.register(BadgeScanLog)
class BadgeScanLogAdmin(admin.ModelAdmin):
    list_display = ('badge', 'scan_type', 'agency', 'scanned_at', 'success')
    list_filter = ('scan_type', 'success', 'scanned_at', 'agency')
    search_fields = ('badge__badge_code', 'badge__employee__first_name', 'badge__employee__last_name')
    readonly_fields = ('badge', 'scan_type', 'agency', 'scanned_at', 'success', 'ip_address', 'user_agent')
    date_hierarchy = 'scanned_at'

    def has_add_permission(self, request):
        return False  # Les logs ne peuvent pas être créés manuellement

    def has_change_permission(self, request, obj=None):
        return False  # Les logs ne peuvent pas être modifiés


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('employee_number', 'first_name', 'last_name', 'position', 'agency', 'status', 'is_key_staff')
    list_filter = ('status', 'contract_type', 'agency', 'hire_date', 'is_key_staff')
    search_fields = ('employee_number', 'first_name', 'last_name', 'nif', 'email')
    readonly_fields = ('employee_number', 'created_at', 'updated_at')
    list_editable = ('is_key_staff',)
    fieldsets = (
        ('Identité', {
            'fields': ('user', 'first_name', 'last_name', 'post_name', 'nationality', 'date_of_birth', 'place_of_birth', 'nif')
        }),
        ('Professionnel', {
            'fields': ('employee_number', 'position', 'department', 'contract_type', 'hire_date', 'status', 'agency')
        }),
        ('Salaire', {
            'fields': ('base_salary',),
            'classes': ('collapse',)
        }),
        ('Affichage public (Page Équipe)', {
            'fields': ('is_key_staff', 'photo', 'photo_url', 'bio', 'linkedin_url'),
            'description': 'Cochez "Personnel clé" pour afficher cette personne sur la page Équipe du site'
        }),
        ('Contact urgence', {
            'fields': ('emergency_contact_name', 'emergency_contact_phone'),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(LeaveType)
class LeaveTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'days_per_year')

@admin.register(Leave)
class LeaveAdmin(admin.ModelAdmin):
    list_display = ('employee', 'leave_type', 'start_date', 'end_date', 'status')
    list_filter = ('status', 'leave_type', 'start_date')
    search_fields = ('employee__first_name', 'employee__last_name')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('employee', 'date', 'status', 'check_in', 'check_out')
    list_filter = ('status', 'date')
    search_fields = ('employee__first_name', 'employee__last_name')

@admin.register(Payroll)
class PayrollAdmin(admin.ModelAdmin):
    list_display = ('employee', 'month', 'base_salary', 'bonuses', 'deductions', 'net_salary')
    list_filter = ('month',)
    search_fields = ('employee__first_name', 'employee__last_name')
    readonly_fields = ('created_at',)
