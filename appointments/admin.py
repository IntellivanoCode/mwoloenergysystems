from django.contrib import admin
from .models import ServiceType, Counter, TimeSlot, Appointment, QueueTicket, DailyQueueStats


@admin.register(ServiceType)
class ServiceTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'estimated_duration', 'is_active', 'color']
    list_filter = ['is_active', 'color']
    search_fields = ['name', 'code', 'description']
    ordering = ['name']


@admin.register(Counter)
class CounterAdmin(admin.ModelAdmin):
    list_display = ['number', 'agency', 'name', 'status', 'current_agent', 'is_active']
    list_filter = ['agency', 'status', 'is_active']
    search_fields = ['name', 'agency__name']
    filter_horizontal = ['services']
    ordering = ['agency', 'number']


@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ['agency', 'day_of_week', 'start_time', 'end_time', 'max_appointments', 'is_active']
    list_filter = ['agency', 'day_of_week', 'is_active']
    ordering = ['agency', 'day_of_week', 'start_time']


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['confirmation_code', 'client_name', 'agency', 'service', 'date', 'time', 'status']
    list_filter = ['agency', 'service', 'status', 'date']
    search_fields = ['confirmation_code', 'client_name', 'client_phone', 'client_email']
    ordering = ['-date', '-time']
    readonly_fields = ['confirmation_code', 'created_at', 'updated_at']
    date_hierarchy = 'date'


@admin.register(QueueTicket)
class QueueTicketAdmin(admin.ModelAdmin):
    list_display = ['ticket_number', 'agency', 'service', 'client_name', 'status', 'priority', 'counter', 'created_at']
    list_filter = ['agency', 'service', 'status', 'priority', 'date']
    search_fields = ['ticket_number', 'client_name', 'client_phone']
    ordering = ['-created_at']
    readonly_fields = ['ticket_number', 'created_at']
    date_hierarchy = 'date'


@admin.register(DailyQueueStats)
class DailyQueueStatsAdmin(admin.ModelAdmin):
    list_display = ['agency', 'date', 'total_tickets', 'completed_tickets', 'avg_wait_time']
    list_filter = ['agency', 'date']
    ordering = ['-date']
    date_hierarchy = 'date'
