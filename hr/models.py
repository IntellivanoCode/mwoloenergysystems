from django.db import models
from accounts.models import User
from agencies.models import Agency
from geo.models import Nationality
import uuid
import hashlib
import secrets


class EmployeeBadge(models.Model):
    """
    Badge employé avec QR code pour:
    - Accès au dashboard commun (si habilité)
    - Allumer le moniteur file d'attente (selon agence)
    - Accès à la borne ticket
    - Enregistrement des présences
    """
    BADGE_STATUS = [
        ('actif', 'Actif'),
        ('suspendu', 'Suspendu'),
        ('perdu', 'Perdu'),
        ('annule', 'Annulé'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.OneToOneField('Employee', on_delete=models.CASCADE, related_name='badge', verbose_name="Employé")
    
    # Code unique du badge (pour le QR)
    badge_code = models.CharField(max_length=100, unique=True, editable=False, verbose_name="Code badge")
    qr_secret = models.CharField(max_length=64, editable=False, verbose_name="Secret QR")
    
    # Statut et validité
    status = models.CharField(max_length=20, choices=BADGE_STATUS, default='actif', verbose_name="Statut")
    issued_date = models.DateField(auto_now_add=True, verbose_name="Date d'émission")
    expiry_date = models.DateField(null=True, blank=True, verbose_name="Date d'expiration")
    
    # Permissions spéciales (au-delà du poste)
    can_access_all_agencies = models.BooleanField(default=False, verbose_name="Accès toutes agences")
    can_activate_monitor = models.BooleanField(default=True, verbose_name="Peut activer moniteur")
    can_use_kiosk = models.BooleanField(default=True, verbose_name="Peut utiliser borne")
    
    # Métadonnées
    last_scan_at = models.DateTimeField(null=True, blank=True, verbose_name="Dernier scan")
    last_scan_agency = models.ForeignKey(Agency, on_delete=models.SET_NULL, null=True, blank=True, 
                                         related_name='last_badge_scans', verbose_name="Dernière agence scannée")
    scan_count = models.PositiveIntegerField(default=0, verbose_name="Nombre de scans")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = 'Badge employé'
        verbose_name_plural = 'Badges employés'
    
    def save(self, *args, **kwargs):
        if not self.badge_code:
            # Générer un code badge unique basé sur l'employé
            emp_id = str(self.employee_id) if self.employee_id else str(uuid.uuid4())
            self.badge_code = f"MWO-{hashlib.sha256(emp_id.encode()).hexdigest()[:12].upper()}"
        if not self.qr_secret:
            self.qr_secret = secrets.token_hex(32)
        super().save(*args, **kwargs)
    
    def generate_qr_data(self):
        """Génère les données pour le QR code"""
        import json
        data = {
            'badge': self.badge_code,
            'emp': str(self.employee.employee_number),
            'agency': str(self.employee.agency_id),
            'sig': hashlib.sha256(f"{self.badge_code}{self.qr_secret}".encode()).hexdigest()[:16]
        }
        return json.dumps(data)
    
    def verify_scan(self, signature):
        """Vérifie si le scan est valide"""
        expected_sig = hashlib.sha256(f"{self.badge_code}{self.qr_secret}".encode()).hexdigest()[:16]
        return signature == expected_sig
    
    def record_scan(self, agency=None):
        """Enregistre un scan du badge"""
        from django.utils import timezone
        self.last_scan_at = timezone.now()
        self.last_scan_agency = agency
        self.scan_count += 1
        self.save(update_fields=['last_scan_at', 'last_scan_agency', 'scan_count'])
    
    def is_valid(self):
        """Vérifie si le badge est valide"""
        from django.utils import timezone
        if self.status != 'actif':
            return False
        if self.expiry_date and self.expiry_date < timezone.now().date():
            return False
        return True
    
    def can_access_agency(self, agency):
        """Vérifie si le badge peut accéder à une agence"""
        if self.can_access_all_agencies:
            return True
        return str(self.employee.agency_id) == str(agency.id if hasattr(agency, 'id') else agency)
    
    def __str__(self):
        return f"Badge {self.badge_code} - {self.employee}"


class BadgeScanLog(models.Model):
    """Journal des scans de badge"""
    SCAN_TYPES = [
        ('presence', 'Pointage présence'),
        ('monitor', 'Activation moniteur'),
        ('kiosk', 'Accès borne'),
        ('dashboard', 'Accès dashboard'),
        ('door', 'Accès porte'),
        ('other', 'Autre'),
    ]
    
    SCAN_RESULTS = [
        ('success', 'Succès'),
        ('denied', 'Refusé'),
        ('expired', 'Expiré'),
        ('invalid', 'Invalide'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    badge = models.ForeignKey(EmployeeBadge, on_delete=models.CASCADE, related_name='scan_logs', verbose_name="Badge")
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, verbose_name="Agence")
    
    scan_type = models.CharField(max_length=20, choices=SCAN_TYPES, verbose_name="Type de scan")
    result = models.CharField(max_length=20, choices=SCAN_RESULTS, verbose_name="Résultat")
    
    scanned_at = models.DateTimeField(auto_now_add=True, verbose_name="Scanné le")
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name="Adresse IP")
    device_info = models.CharField(max_length=200, blank=True, verbose_name="Info appareil")
    
    notes = models.TextField(blank=True, verbose_name="Notes")
    
    class Meta:
        verbose_name = 'Log de scan badge'
        verbose_name_plural = 'Logs de scans badges'
        ordering = ['-scanned_at']
    
    def __str__(self):
        return f"{self.badge.badge_code} @ {self.agency.code} - {self.scan_type} ({self.result})"


class Employee(models.Model):
    """
    Modèle Employé - La différenciation des accès se fait par le POSTE et DÉPARTEMENT
    """
    CONTRACT_TYPES = [
        ('cdd', 'CDD'),
        ('cdi', 'CDI'),
        ('consultant', 'Consultant'),
        ('stage', 'Stage'),
    ]
    
    STATUS_CHOICES = [
        ('actif', 'Actif'),
        ('suspendu', 'Suspendu'),
        ('sorti', 'Sorti'),
        ('conge', 'En congé'),
    ]
    
    # Types de postes standardisés pour déterminer les accès aux dashboards
    POSITION_TYPES = [
        # Direction
        ('directeur_general', 'Directeur Général'),
        ('directeur_adjoint', 'Directeur Adjoint'),
        ('directeur_agence', 'Directeur d\'Agence'),
        
        # Management
        ('manager', 'Manager'),
        ('chef_departement', 'Chef de Département'),
        ('superviseur', 'Superviseur'),
        
        # Ressources Humaines
        ('responsable_rh', 'Responsable RH'),
        ('assistant_rh', 'Assistant RH'),
        
        # Comptabilité / Finance
        ('responsable_comptable', 'Responsable Comptable'),
        ('comptable', 'Comptable'),
        ('caissier', 'Caissier'),
        
        # Commercial
        ('responsable_commercial', 'Responsable Commercial'),
        ('agent_commercial', 'Agent Commercial'),
        ('conseiller_client', 'Conseiller Client'),
        
        # Opérations / Technique
        ('responsable_operations', 'Responsable Opérations'),
        ('technicien', 'Technicien'),
        ('installateur', 'Installateur'),
        
        # Support / Guichet
        ('responsable_support', 'Responsable Support'),
        ('agent_guichet', 'Agent de Guichet'),
        ('agent_support', 'Agent Support'),
        
        # IT
        ('responsable_it', 'Responsable IT'),
        ('developpeur', 'Développeur'),
        ('administrateur_systeme', 'Administrateur Système'),
        
        # Autres
        ('stagiaire', 'Stagiaire'),
        ('autre', 'Autre'),
    ]
    
    # Départements
    DEPARTMENT_TYPES = [
        ('direction', 'Direction'),
        ('rh', 'Ressources Humaines'),
        ('comptabilite', 'Comptabilité & Finance'),
        ('commercial', 'Commercial'),
        ('operations', 'Opérations'),
        ('support', 'Support Client'),
        ('it', 'Informatique'),
        ('logistique', 'Logistique'),
        ('autre', 'Autre'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee', verbose_name="Utilisateur")
    agency = models.ForeignKey(Agency, on_delete=models.PROTECT, related_name='employees', verbose_name="Agence")
    
    # Identité
    first_name = models.CharField(max_length=100, verbose_name="Prénom")
    last_name = models.CharField(max_length=100, verbose_name="Nom")
    post_name = models.CharField(max_length=100, blank=True, verbose_name="Post-nom")
    nationality = models.ForeignKey(Nationality, on_delete=models.PROTECT, verbose_name="Nationalité")
    date_of_birth = models.DateField(verbose_name="Date de naissance")
    place_of_birth = models.CharField(max_length=200, verbose_name="Lieu de naissance")
    nif = models.CharField(max_length=50, unique=True, verbose_name="NIF")
    
    # Professionnel - CHAMPS CLÉS POUR LES ACCÈS
    employee_number = models.CharField(max_length=20, unique=True, verbose_name="Numéro d'employé")
    position = models.CharField(max_length=50, choices=POSITION_TYPES, default='autre', verbose_name="Poste")
    position_custom = models.CharField(max_length=100, blank=True, verbose_name="Poste personnalisé")
    department = models.CharField(max_length=50, choices=DEPARTMENT_TYPES, default='autre', verbose_name="Département")
    contract_type = models.CharField(max_length=20, choices=CONTRACT_TYPES, verbose_name="Type de contrat")
    hire_date = models.DateField(verbose_name="Date d'embauche")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='actif', verbose_name="Statut")
    
    # Salaire (confidentiel)
    base_salary = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, verbose_name="Salaire de base")
    
    # Affichage public
    is_key_staff = models.BooleanField(default=False, verbose_name="Personnel clé (afficher sur le site)")
    photo = models.ImageField(upload_to='hr/employees/', blank=True, null=True, verbose_name="Photo")
    photo_url = models.URLField(blank=True, null=True, verbose_name="URL photo")
    bio = models.TextField(blank=True, verbose_name="Biographie")
    linkedin_url = models.URLField(blank=True, null=True, verbose_name="LinkedIn")
    
    # Contact urgence
    emergency_contact_name = models.CharField(max_length=200, blank=True, verbose_name="Nom du contact d'urgence")
    emergency_contact_phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone du contact d'urgence")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = 'Employé'
        verbose_name_plural = 'Employés'
        ordering = ['last_name', 'first_name']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.employee_number})"
    
    def get_position_display_full(self):
        """Retourne le poste avec le personnalisé si disponible"""
        if self.position == 'autre' and self.position_custom:
            return self.position_custom
        return self.get_position_display()
    
    # Méthodes pour déterminer les accès aux dashboards selon le poste
    @property
    def is_direction(self):
        """Est un membre de la direction"""
        return self.position in ['directeur_general', 'directeur_adjoint', 'directeur_agence']
    
    @property
    def is_manager(self):
        """Est un manager ou responsable"""
        return self.position in ['manager', 'chef_departement', 'superviseur'] or self.is_direction
    
    @property
    def has_rh_access(self):
        """A accès au dashboard RH"""
        return self.department == 'rh' or self.position in ['responsable_rh', 'assistant_rh'] or self.is_direction
    
    @property
    def has_comptabilite_access(self):
        """A accès au dashboard comptabilité"""
        return self.department == 'comptabilite' or self.position in ['responsable_comptable', 'comptable', 'caissier'] or self.is_direction
    
    @property
    def has_commercial_access(self):
        """A accès au dashboard commercial"""
        return self.department == 'commercial' or self.position in ['responsable_commercial', 'agent_commercial', 'conseiller_client'] or self.is_direction
    
    @property
    def has_operations_access(self):
        """A accès au dashboard opérations"""
        return self.department == 'operations' or self.position in ['responsable_operations', 'technicien', 'installateur'] or self.is_direction
    
    @property
    def has_support_access(self):
        """A accès au dashboard support/guichet"""
        return self.department == 'support' or self.position in ['responsable_support', 'agent_guichet', 'agent_support'] or self.is_direction
    
    @property
    def has_it_access(self):
        """A accès au dashboard IT"""
        return self.department == 'it' or self.position in ['responsable_it', 'developpeur', 'administrateur_systeme'] or self.is_direction
    
    @property
    def can_manage_queue(self):
        """Peut gérer les files d'attente (guichet)"""
        return self.position in ['agent_guichet', 'agent_support', 'conseiller_client', 'caissier', 'responsable_support'] or self.is_manager
    
    @property
    def can_view_monitor(self):
        """Peut voir le moniteur de file d'attente"""
        return self.has_support_access or self.is_manager
    
    def get_accessible_dashboards(self):
        """Retourne la liste des dashboards accessibles"""
        dashboards = ['employee']  # Tous les employés ont accès au dashboard employé
        
        if self.is_direction:
            dashboards.extend(['admin', 'rh', 'comptabilite', 'commercial', 'operations', 'support', 'it'])
        else:
            if self.has_rh_access:
                dashboards.append('rh')
            if self.has_comptabilite_access:
                dashboards.append('comptabilite')
            if self.has_commercial_access:
                dashboards.append('commercial')
            if self.has_operations_access:
                dashboards.append('operations')
            if self.has_support_access:
                dashboards.append('support')
            if self.has_it_access:
                dashboards.append('it')
        
        return list(set(dashboards))


class LeaveType(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, verbose_name="Nom")
    days_per_year = models.IntegerField(default=20, verbose_name="Jours par an")
    
    class Meta:
        verbose_name = 'Type de congé'
        verbose_name_plural = 'Types de congés'
    
    def __str__(self):
        return self.name


class Leave(models.Model):
    STATUS_CHOICES = [
        ('demande', 'Demandé'),
        ('approuve', 'Approuvé'),
        ('rejete', 'Rejeté'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leaves', verbose_name="Employé")
    leave_type = models.ForeignKey(LeaveType, on_delete=models.PROTECT, verbose_name="Type de congé")
    start_date = models.DateField(verbose_name="Date de début")
    end_date = models.DateField(verbose_name="Date de fin")
    reason = models.TextField(blank=True, verbose_name="Motif")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='demande', verbose_name="Statut")
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_leaves', verbose_name="Approuvé par")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = 'Congé'
        verbose_name_plural = 'Congés'
        ordering = ['-start_date']
    
    def __str__(self):
        return f"{self.employee} - {self.leave_type} ({self.start_date})"


class Attendance(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendances', verbose_name="Employé")
    date = models.DateField(verbose_name="Date")
    check_in = models.TimeField(null=True, blank=True, verbose_name="Arrivée")
    check_out = models.TimeField(null=True, blank=True, verbose_name="Départ")
    status = models.CharField(max_length=20, choices=[
        ('present', 'Présent'),
        ('absent', 'Absent'),
        ('retard', 'Retard'),
        ('conge', 'Congé'),
    ], verbose_name="Statut")
    notes = models.TextField(blank=True, verbose_name="Notes")
    
    class Meta:
        verbose_name = 'Présence'
        verbose_name_plural = 'Présences'
        unique_together = ('employee', 'date')
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.employee} - {self.date} ({self.status})"


class Payroll(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='payrolls', verbose_name="Employé")
    month = models.DateField(verbose_name="Mois")
    base_salary = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Salaire de base")
    bonuses = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="Primes")
    deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="Retenues")
    net_salary = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Salaire net")
    pdf_file = models.FileField(upload_to='payrolls/', null=True, blank=True, verbose_name="Fichier PDF")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    
    class Meta:
        verbose_name = 'Bulletin de paie'
        verbose_name_plural = 'Bulletins de paie'
        unique_together = ('employee', 'month')
        ordering = ['-month']
    
    def __str__(self):
        return f"{self.employee} - {self.month.strftime('%B %Y')}"
