from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator
import uuid

class User(AbstractUser):
    """
    Modèle utilisateur simplifié avec 3 rôles principaux:
    - client: Clients externes de l'entreprise
    - employe: Tous les employés (la différence se fait par le POSTE dans Employee)
    - super_admin: Administrateur système (accès total)
    """
    ROLE_CHOICES = [
        ('super_admin', 'Super Administrateur'),
        ('employe', 'Employé'),
        ('client', 'Client'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='client', verbose_name="Rôle")
    phone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Téléphone")
    post_name = models.CharField(max_length=100, blank=True, null=True, verbose_name="Post-nom")
    photo = models.ImageField(upload_to='users/photos/', blank=True, null=True, verbose_name="Photo")
    agency = models.ForeignKey(
        'agencies.Agency',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='users',
        verbose_name="Agence"
    )
    is_active_user = models.BooleanField(default=True, verbose_name="Actif")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"
    
    @property
    def is_employee(self):
        return self.role == 'employe'
    
    @property
    def is_client(self):
        return self.role == 'client'
    
    @property
    def is_super_admin(self):
        return self.role == 'super_admin'
    
    def get_employee_position(self):
        """Retourne le poste de l'employé si c'est un employé"""
        if hasattr(self, 'employee') and self.employee:
            return self.employee.position
        return None
    
    def get_employee_department(self):
        """Retourne le département de l'employé si c'est un employé"""
        if hasattr(self, 'employee') and self.employee:
            return self.employee.department
        return None


class Permission(models.Model):
    MODULES = [
        ('core', 'Core'),
        ('geo', 'Géographie'),
        ('accounts', 'Comptes'),
        ('hr', 'RH'),
        ('crm', 'CRM'),
        ('billing', 'Facturation'),
        ('operations', 'Opérations'),
        ('support', 'Support'),
        ('cms', 'CMS'),
        ('agencies', 'Agences'),
    ]
    
    ACTIONS = [
        ('create', 'Créer'),
        ('read', 'Lire'),
        ('update', 'Modifier'),
        ('delete', 'Supprimer'),
        ('export', 'Exporter'),
        ('approve', 'Approuver'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    module = models.CharField(max_length=20, choices=MODULES, verbose_name="Module")
    action = models.CharField(max_length=20, choices=ACTIONS, verbose_name="Action")
    role = models.CharField(max_length=20, choices=User.ROLE_CHOICES, verbose_name="Rôle")
    
    class Meta:
        unique_together = ('module', 'action', 'role')
        verbose_name = 'Permission'
        verbose_name_plural = 'Permissions'
    
    def __str__(self):
        return f"{self.role} - {self.module} - {self.action}"


class AuditLog(models.Model):
    ACTION_CHOICES = [
        ('create', 'Créer'),
        ('update', 'Modifier'),
        ('delete', 'Supprimer'),
        ('approve', 'Approuver'),
        ('reject', 'Rejeter'),
        ('export', 'Exporter'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, verbose_name="Utilisateur")
    action = models.CharField(max_length=20, choices=ACTION_CHOICES, verbose_name="Action")
    module = models.CharField(max_length=50, verbose_name="Module")
    object_id = models.CharField(max_length=255, verbose_name="ID Objet")
    object_repr = models.CharField(max_length=255, verbose_name="Objet")
    changes = models.JSONField(default=dict, blank=True, verbose_name="Changements")
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name="Adresse IP")
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="Date/Heure")
    
    class Meta:
        ordering = ['-timestamp']
        verbose_name = 'Journal d\'audit'
        verbose_name_plural = 'Journaux d\'audit'
        indexes = [
            models.Index(fields=['user', '-timestamp']),
            models.Index(fields=['module', '-timestamp']),
        ]
    
    def __str__(self):
        return f"{self.user} - {self.action} - {self.object_repr}"
