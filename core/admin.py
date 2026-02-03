from django.contrib import admin
from .models import SystemParameter, Document

@admin.register(SystemParameter)
class SystemParameterAdmin(admin.ModelAdmin):
    list_display = ('key', 'value', 'description')
    search_fields = ('key', 'description')

@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('document_type', 'related_object_type', 'uploaded_at')
    list_filter = ('document_type', 'uploaded_at')
    search_fields = ('related_object_id', 'related_object_type')
    readonly_fields = ('uploaded_at',)
