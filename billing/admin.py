from django.contrib import admin
from .models import Invoice, InvoiceLine, Payment, Reminder

class InvoiceLineInline(admin.TabularInline):
    model = InvoiceLine
    extra = 1

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'client', 'total', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('invoice_number', 'client__last_name')
    readonly_fields = ('invoice_number', 'created_at', 'updated_at')
    inlines = [InvoiceLineInline]
    fieldsets = (
        ('Informations', {
            'fields': ('invoice_number', 'client', 'site', 'status')
        }),
        ('Période', {
            'fields': ('period_start', 'period_end')
        }),
        ('Montants', {
            'fields': ('currency', 'subtotal', 'tax_amount', 'total')
        }),
        ('Fichiers', {
            'fields': ('pdf_file',),
            'classes': ('collapse',)
        }),
        ('Dates', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('reference', 'invoice', 'amount', 'method', 'status', 'payment_date')
    list_filter = ('status', 'method', 'payment_date')
    search_fields = ('reference', 'invoice__invoice_number')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Reminder)
class ReminderAdmin(admin.ModelAdmin):
    list_display = ('invoice', 'reminder_type', 'sent_date')
    list_filter = ('reminder_type', 'sent_date')
    search_fields = ('invoice__invoice_number',)
    readonly_fields = ('sent_date',)
