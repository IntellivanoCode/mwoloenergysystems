from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Permission, AuditLog

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informations supplémentaires', {'fields': ('role', 'phone', 'post_name', 'photo', 'is_active_user')}),
    )
    list_display = ('username', 'get_full_name', 'post_name', 'role', 'email', 'is_active')
    list_filter = ('role', 'is_active', 'created_at')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'post_name')
    ordering = ('-created_at',)

@admin.register(Permission)
class PermissionAdmin(admin.ModelAdmin):
    list_display = ('role', 'module', 'action')
    list_filter = ('role', 'module', 'action')
    search_fields = ('role', 'module')

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'module', 'object_repr', 'timestamp')
    list_filter = ('action', 'module', 'timestamp')
    search_fields = ('user__username', 'object_repr', 'module')
    readonly_fields = ('user', 'action', 'module', 'object_id', 'object_repr', 'changes', 'ip_address', 'timestamp')
    
    def has_add_permission(self, request):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return False
