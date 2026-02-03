from django.contrib import admin
from .models import Client, Site, Contract

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('last_name', 'first_name', 'email', 'agency', 'status')
    list_filter = ('status', 'agency', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'nif', 'phone')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Identité', {
            'fields': ('first_name', 'last_name', 'post_name', 'nationality', 'date_of_birth', 'place_of_birth', 'nif')
        }),
        ('Contact', {
            'fields': ('email', 'phone')
        }),
        ('Adresse', {
            'fields': ('country', 'province', 'commune', 'territory', 'address')
        }),
        ('Gestion', {
            'fields': ('agency', 'status', 'tags', 'photo')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = ('name', 'reference', 'client', 'is_active')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'reference', 'client__last_name')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Contract)
class ContractAdmin(admin.ModelAdmin):
    list_display = ('client', 'site', 'contract_type', 'start_date', 'status')
    list_filter = ('status', 'contract_type', 'start_date')
    search_fields = ('client__last_name', 'site__name')
    readonly_fields = ('created_at', 'updated_at')
