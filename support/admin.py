from django.contrib import admin
from .models import Ticket, TicketMessage, TicketAttachment

class TicketMessageInline(admin.TabularInline):
    model = TicketMessage
    extra = 0
    readonly_fields = ('author', 'created_at')

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ('id', 'client', 'subject', 'priority', 'status', 'created_at')
    list_filter = ('priority', 'status', 'created_at')
    search_fields = ('subject', 'client__last_name', 'description')
    readonly_fields = ('created_at', 'updated_at', 'resolved_at')
    inlines = [TicketMessageInline]

@admin.register(TicketMessage)
class TicketMessageAdmin(admin.ModelAdmin):
    list_display = ('ticket', 'author', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('ticket__id', 'author__username')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(TicketAttachment)
class TicketAttachmentAdmin(admin.ModelAdmin):
    list_display = ('message', 'file', 'uploaded_at')
    list_filter = ('uploaded_at',)
    search_fields = ('message__ticket__id',)
