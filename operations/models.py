from django.db import models
from crm.models import Site
from accounts.models import User
import uuid

class Equipment(models.Model):
    TYPES = [
        ('compteur', 'Compteur'),
        ('transformateur', 'Transformateur'),
        ('disjoncteur', 'Disjoncteur'),
        ('autre', 'Autre'),
    ]
    
    STATUS_CHOICES = [
        ('actif', 'Actif'),
        ('inactif', 'Inactif'),
        ('maintenance', 'Maintenance'),
        ('defaillant', 'Défaillant'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='equipments')
    
    equipment_type = models.CharField(max_length=20, choices=TYPES)
    serial_number = models.CharField(max_length=100, unique=True)
    reference = models.CharField(max_length=100)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='actif')
    installation_date = models.DateField()
    last_maintenance = models.DateField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Équipement'
        verbose_name_plural = 'Équipements'
        ordering = ['site', 'equipment_type']
    
    def __str__(self):
        return f"{self.serial_number} - {self.get_equipment_type_display()}"


class Meter(models.Model):
    STATUS_CHOICES = [
        ('actif', 'Actif'),
        ('inactif', 'Inactif'),
        ('defaillant', 'Défaillant'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    equipment = models.OneToOneField(Equipment, on_delete=models.CASCADE, related_name='meter')
    
    meter_number = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='actif')
    
    # Liaison avec le système de service
    service_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Compteur'
        verbose_name_plural = 'Compteurs'
    
    def __str__(self):
        return f"Compteur {self.meter_number}"
    
    def deactivate_service(self):
        """Désactiver le service du client"""
        self.service_active = False
        self.status = 'inactif'
        self.save()


class MeterReading(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    meter = models.ForeignKey(Meter, on_delete=models.CASCADE, related_name='readings')
    
    reading_date = models.DateField()
    reading_value = models.DecimalField(max_digits=12, decimal_places=2)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Relevé de compteur'
        verbose_name_plural = 'Relevés de compteur'
        unique_together = ('meter', 'reading_date')
        ordering = ['-reading_date']
    
    def __str__(self):
        return f"{self.meter.meter_number} - {self.reading_date}"


class Intervention(models.Model):
    TYPES = [
        ('maintenance', 'Maintenance'),
        ('reparation', 'Réparation'),
        ('installation', 'Installation'),
        ('inspection', 'Inspection'),
    ]
    
    STATUS_CHOICES = [
        ('planifiee', 'Planifiée'),
        ('en_cours', 'En cours'),
        ('completee', 'Complétée'),
        ('annulee', 'Annulée'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='interventions')
    
    intervention_type = models.CharField(max_length=20, choices=TYPES)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planifiee')
    
    scheduled_date = models.DateField()
    completed_date = models.DateField(null=True, blank=True)
    
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='interventions')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Intervention'
        verbose_name_plural = 'Interventions'
        ordering = ['-scheduled_date']
    
    def __str__(self):
        return f"{self.get_intervention_type_display()} - {self.site.name}"
