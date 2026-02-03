from django.db import models
from geo.models import Territory, Province
from accounts.models import User
import uuid

class Agency(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=20, unique=True, verbose_name="Code")
    name = models.CharField(max_length=200, verbose_name="Nom")
    province = models.ForeignKey(Province, on_delete=models.PROTECT, related_name='agencies', verbose_name="Province")
    territory = models.ForeignKey(Territory, on_delete=models.PROTECT, related_name='agencies', verbose_name="Territoire")
    address = models.TextField(verbose_name="Adresse")
    phone = models.CharField(max_length=20, verbose_name="Téléphone")
    email = models.EmailField(verbose_name="Email")
    manager = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='managed_agencies', verbose_name="Responsable")
    
    # Coordonnées GPS pour les maps
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, verbose_name="Latitude", help_text="Ex: -4.441931 pour Kinshasa")
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, verbose_name="Longitude", help_text="Ex: 15.266293 pour Kinshasa")
    
    # Images et icônes
    background_image = models.ImageField(upload_to='agencies/backgrounds/', blank=True, null=True, verbose_name="Image de fond")
    background_image_url = models.URLField(blank=True, null=True, verbose_name="URL image de fond")
    icon_svg = models.TextField(blank=True, verbose_name="Icône SVG", help_text="Code SVG personnalisé pour l'agence")
    
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = 'Agence'
        verbose_name_plural = 'Agences'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.code})"
    
    def save(self, *args, **kwargs):
        if not self.code:
            import uuid
            self.code = f"AGE-{uuid.uuid4().hex[:8].upper()}"
        super().save(*args, **kwargs)
