from django.contrib import admin
from .models import Country, Nationality, Province, Commune, Territory

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'created_at')
    search_fields = ('name', 'code')
    ordering = ('name',)
    readonly_fields = ('created_at',)

@admin.register(Nationality)
class NationalityAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'created_at')
    list_filter = ('country',)
    search_fields = ('name',)
    ordering = ('country', 'name')
    readonly_fields = ('created_at',)

@admin.register(Province)
class ProvinceAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'code', 'created_at')
    list_filter = ('country',)
    search_fields = ('name', 'code')
    ordering = ('country', 'name')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Informations', {
            'fields': ('country', 'name', 'code')
        }),
        ('Dates', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

@admin.register(Commune)
class CommuneAdmin(admin.ModelAdmin):
    list_display = ('name', 'province', 'code', 'created_at')
    list_filter = ('province__country', 'province')
    search_fields = ('name', 'code')
    ordering = ('province', 'name')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Informations', {
            'fields': ('province', 'name', 'code')
        }),
        ('Dates', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

@admin.register(Territory)
class TerritoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'commune', 'code', 'created_at')
    list_filter = ('commune__province__country', 'commune__province', 'commune')
    search_fields = ('name', 'code')
    ordering = ('commune', 'name')
    readonly_fields = ('created_at',)
    fieldsets = (
        ('Informations', {
            'fields': ('commune', 'name', 'code')
        }),
        ('Dates', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
