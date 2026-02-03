from django.contrib import admin
from .models import Employee, LeaveType, Leave, Attendance, Payroll

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
