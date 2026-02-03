from django.db import models
from django.conf import settings
from geo.models import Country, Province, Commune, Territory, Nationality
from agencies.models import Agency
import uuid

class Client(models.Model):
    STATUS_CHOICES = [
        ('prospect', 'Prospect'),
        ('actif', 'Actif'),
        ('suspendu', 'Suspendu'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Lien avec l'utilisateur (optionnel, pour les clients auto-enregistrés)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='client_profile',
        verbose_name="Utilisateur associé"
    )
    
    # Identité
    first_name = models.CharField(max_length=100, verbose_name="Prénom")
    last_name = models.CharField(max_length=100, verbose_name="Nom")
    post_name = models.CharField(max_length=100, blank=True, verbose_name="Post-nom")
    nationality = models.ForeignKey(Nationality, on_delete=models.PROTECT, null=True, blank=True, verbose_name="Nationalité")
    date_of_birth = models.DateField(null=True, blank=True, verbose_name="Date de naissance")
    place_of_birth = models.CharField(max_length=200, blank=True, verbose_name="Lieu de naissance")
    nif = models.CharField(max_length=50, blank=True, unique=False, verbose_name="NIF")
    
    # Contact
    email = models.EmailField(unique=True, verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    
    # Adresse (tous optionnels pour permettre l'inscription simple)
    country = models.ForeignKey(Country, on_delete=models.PROTECT, null=True, blank=True, verbose_name="Pays")
    province = models.ForeignKey(Province, on_delete=models.PROTECT, null=True, blank=True, verbose_name="Province")
    commune = models.ForeignKey(Commune, on_delete=models.PROTECT, null=True, blank=True, verbose_name="Commune")
    territory = models.ForeignKey(Territory, on_delete=models.PROTECT, null=True, blank=True, verbose_name="Territoire")
    address = models.TextField(blank=True, verbose_name="Adresse")
    
    # Agence
    agency = models.ForeignKey(Agency, on_delete=models.PROTECT, null=True, blank=True, related_name='clients', verbose_name="Agence")
    
    # Statut
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='prospect', verbose_name="Statut")
    tags = models.CharField(max_length=500, blank=True, verbose_name="Tags", help_text="Séparés par des virgules")
    
    # Photo
    photo = models.ImageField(upload_to='clients/photos/', blank=True, null=True, verbose_name="Photo")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = 'Client'
        verbose_name_plural = 'Clients'
        ordering = ['last_name', 'first_name']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Site(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='sites', verbose_name="Client")
    
    name = models.CharField(max_length=200, verbose_name="Nom")
    reference = models.CharField(max_length=100, unique=True, verbose_name="Référence")
    
    # Adresse
    country = models.ForeignKey(Country, on_delete=models.PROTECT, verbose_name="Pays")
    province = models.ForeignKey(Province, on_delete=models.PROTECT, verbose_name="Province")
    commune = models.ForeignKey(Commune, on_delete=models.PROTECT, verbose_name="Commune")
    territory = models.ForeignKey(Territory, on_delete=models.PROTECT, verbose_name="Territoire")
    address = models.TextField(verbose_name="Adresse")
    
    # Contact sur site
    contact_name = models.CharField(max_length=200, blank=True, verbose_name="Nom du contact")
    contact_phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone du contact")
    
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = 'Site client'
        verbose_name_plural = 'Sites clients'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} ({self.client.last_name})"


class Contract(models.Model):
    CONTRACT_TYPES = [
        ('mensuel', 'Mensuel'),
        ('consommation', 'Consommation'),
        ('forfait', 'Forfait'),
    ]
    
    STATUS_CHOICES = [
        ('actif', 'Actif'),
        ('inactif', 'Inactif'),
        ('suspendu', 'Suspendu'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='contracts', verbose_name="Client")
    site = models.ForeignKey(Site, on_delete=models.CASCADE, related_name='contracts', verbose_name="Site")
    
    contract_type = models.CharField(max_length=20, choices=CONTRACT_TYPES, verbose_name="Type de contrat")
    start_date = models.DateField(verbose_name="Date de début")
    end_date = models.DateField(null=True, blank=True, verbose_name="Date de fin")
    
    rate = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Tarif")
    currency = models.CharField(max_length=3, default='USD', verbose_name="Devise")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='actif', verbose_name="Statut")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = 'Contrat'
        verbose_name_plural = 'Contrats'
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.client} - {self.contract_type}"
