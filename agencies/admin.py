from django.contrib import admin
from .models import Agency

@admin.register(Agency)
class AgencyAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'province', 'territory', 'manager', 'is_active')
    list_filter = ('is_active', 'province', 'territory__commune__province__country', 'created_at')
    search_fields = ('code', 'name', 'email', 'phone')
    readonly_fields = ('code', 'created_at', 'updated_at')
    fieldsets = (
        ('Informations générales', {
            'fields': ('code', 'name', 'province', 'territory', 'address')
        }),
        ('Contact', {
            'fields': ('phone', 'email')
        }),
        ('Localisation GPS (pour les cartes)', {
            'fields': ('latitude', 'longitude'),
            'description': 'Coordonnées GPS pour afficher l\'agence sur la carte. Ex: Kinshasa = -4.441931, 15.266293'
        }),
        ('Médias', {
            'fields': ('background_image', 'background_image_url', 'icon_svg'),
            'classes': ('collapse',)
        }),
        ('Gestion', {
            'fields': ('manager', 'is_active')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        # Filtrer les territoires en fonction de la province sélectionnée
        if obj:
            form.base_fields['territory'].queryset = obj.province.communes.all().first().territories.all() if obj.province.communes.exists() else form.base_fields['territory'].queryset
        return form
