from django.contrib import admin
from .models import Equipment, Meter, MeterReading, Intervention

@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('serial_number', 'equipment_type', 'site', 'status')
    list_filter = ('equipment_type', 'status', 'installation_date')
    search_fields = ('serial_number', 'reference', 'site__name')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Meter)
class MeterAdmin(admin.ModelAdmin):
    list_display = ('meter_number', 'equipment', 'status', 'service_active')
    list_filter = ('status', 'service_active')
    search_fields = ('meter_number', 'equipment__serial_number')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(MeterReading)
class MeterReadingAdmin(admin.ModelAdmin):
    list_display = ('meter', 'reading_date', 'reading_value')
    list_filter = ('reading_date',)
    search_fields = ('meter__meter_number',)
    readonly_fields = ('created_at',)

@admin.register(Intervention)
class InterventionAdmin(admin.ModelAdmin):
    list_display = ('site', 'intervention_type', 'status', 'scheduled_date', 'assigned_to')
    list_filter = ('intervention_type', 'status', 'scheduled_date')
    search_fields = ('site__name', 'description')
    readonly_fields = ('created_at', 'updated_at')
