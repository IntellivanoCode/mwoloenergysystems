from django.db import models
from django.conf import settings
from agencies.models import Agency
import uuid
from datetime import date, time, timedelta

class ServiceType(models.Model):
    """Types de services disponibles pour les rendez-vous"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, verbose_name="Nom du service")
    code = models.CharField(max_length=20, unique=True, verbose_name="Code")
    description = models.TextField(blank=True, verbose_name="Description")
    estimated_duration = models.PositiveIntegerField(default=30, verbose_name="Durée estimée (minutes)")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    icon = models.CharField(max_length=50, blank=True, verbose_name="Icône (classe)")
    color = models.CharField(max_length=20, default='blue', verbose_name="Couleur")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Type de service"
        verbose_name_plural = "Types de services"
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Counter(models.Model):
    """Guichets de service dans une agence"""
    STATUS_CHOICES = [
        ('available', 'Disponible'),
        ('busy', 'Occupé'),
        ('closed', 'Fermé'),
        ('break', 'Pause'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='counters', verbose_name="Agence")
    number = models.PositiveIntegerField(verbose_name="Numéro du guichet")
    name = models.CharField(max_length=50, blank=True, verbose_name="Nom personnalisé")
    services = models.ManyToManyField(ServiceType, related_name='counters', verbose_name="Services traités")
    
    # Agent affecté (optionnel)
    current_agent = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='assigned_counters',
        verbose_name="Agent actuel"
    )
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='closed', verbose_name="Statut")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    
    # Ticket en cours de traitement
    current_ticket = models.OneToOneField(
        'QueueTicket',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='serving_counter',
        verbose_name="Ticket en cours"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Guichet"
        verbose_name_plural = "Guichets"
        ordering = ['agency', 'number']
        unique_together = ['agency', 'number']
    
    def __str__(self):
        return f"Guichet {self.number} - {self.agency.name}"


class TimeSlot(models.Model):
    """Créneaux horaires disponibles pour les rendez-vous"""
    DAYS_OF_WEEK = [
        (0, 'Lundi'),
        (1, 'Mardi'),
        (2, 'Mercredi'),
        (3, 'Jeudi'),
        (4, 'Vendredi'),
        (5, 'Samedi'),
        (6, 'Dimanche'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='time_slots', verbose_name="Agence")
    day_of_week = models.PositiveSmallIntegerField(choices=DAYS_OF_WEEK, verbose_name="Jour de la semaine")
    start_time = models.TimeField(verbose_name="Heure de début")
    end_time = models.TimeField(verbose_name="Heure de fin")
    max_appointments = models.PositiveIntegerField(default=10, verbose_name="Nombre max de RDV")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    
    class Meta:
        verbose_name = "Créneau horaire"
        verbose_name_plural = "Créneaux horaires"
        ordering = ['day_of_week', 'start_time']
    
    def __str__(self):
        return f"{self.get_day_of_week_display()} {self.start_time} - {self.end_time}"


class Appointment(models.Model):
    """Rendez-vous client"""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('confirmed', 'Confirmé'),
        ('in_progress', 'En cours'),
        ('completed', 'Terminé'),
        ('cancelled', 'Annulé'),
        ('no_show', 'Absent'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Lien avec l'utilisateur (pour clients inscrits)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='appointments',
        verbose_name="Utilisateur"
    )
    
    # Informations client (pour clients non-inscrits)
    client_name = models.CharField(max_length=200, verbose_name="Nom du client")
    client_phone = models.CharField(max_length=20, verbose_name="Téléphone")
    client_email = models.EmailField(blank=True, verbose_name="Email")
    
    # Détails du RDV
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='appointments', verbose_name="Agence")
    service = models.ForeignKey(ServiceType, on_delete=models.PROTECT, related_name='appointments', verbose_name="Service")
    
    date = models.DateField(verbose_name="Date")
    time = models.TimeField(verbose_name="Heure")
    
    # Code de confirmation unique
    confirmation_code = models.CharField(max_length=10, unique=True, verbose_name="Code de confirmation")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Statut")
    notes = models.TextField(blank=True, verbose_name="Notes")
    
    # Suivi
    confirmed_at = models.DateTimeField(null=True, blank=True, verbose_name="Confirmé le")
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name="Terminé le")
    cancelled_at = models.DateTimeField(null=True, blank=True, verbose_name="Annulé le")
    cancellation_reason = models.TextField(blank=True, verbose_name="Raison d'annulation")
    
    # Agent qui a traité le RDV
    handled_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='handled_appointments',
        verbose_name="Traité par"
    )
    
    # Ticket de file d'attente associé
    queue_ticket = models.OneToOneField(
        'QueueTicket',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='appointment',
        verbose_name="Ticket de file"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Rendez-vous"
        verbose_name_plural = "Rendez-vous"
        ordering = ['date', 'time']
    
    def __str__(self):
        return f"RDV {self.confirmation_code} - {self.client_name}"
    
    def save(self, *args, **kwargs):
        if not self.confirmation_code:
            import random
            import string
            self.confirmation_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        super().save(*args, **kwargs)


class QueueTicket(models.Model):
    """Ticket de file d'attente"""
    STATUS_CHOICES = [
        ('waiting', 'En attente'),
        ('called', 'Appelé'),
        ('serving', 'En service'),
        ('completed', 'Terminé'),
        ('cancelled', 'Annulé'),
        ('no_show', 'Absent'),
    ]
    
    PRIORITY_CHOICES = [
        ('normal', 'Normal'),
        ('priority', 'Prioritaire'),
        ('vip', 'VIP'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='queue_tickets', verbose_name="Agence")
    service = models.ForeignKey(ServiceType, on_delete=models.PROTECT, related_name='queue_tickets', verbose_name="Service")
    
    # Numéro de ticket (ex: A001, B042)
    ticket_number = models.CharField(max_length=10, verbose_name="Numéro de ticket")
    
    # Informations client
    client_name = models.CharField(max_length=200, blank=True, verbose_name="Nom du client")
    client_phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    
    # Lien avec utilisateur (si connecté)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='queue_tickets',
        verbose_name="Utilisateur"
    )
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='waiting', verbose_name="Statut")
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal', verbose_name="Priorité")
    
    # Horodatage
    date = models.DateField(default=date.today, verbose_name="Date")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    called_at = models.DateTimeField(null=True, blank=True, verbose_name="Appelé le")
    served_at = models.DateTimeField(null=True, blank=True, verbose_name="Pris en charge le")
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name="Terminé le")
    
    # Guichet de traitement
    counter = models.ForeignKey(
        Counter,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tickets',
        verbose_name="Guichet"
    )
    
    # Agent qui traite le ticket
    served_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='served_tickets',
        verbose_name="Servi par"
    )
    
    # Temps d'attente estimé (en minutes)
    estimated_wait_time = models.PositiveIntegerField(null=True, blank=True, verbose_name="Temps d'attente estimé")
    
    # Position dans la file
    queue_position = models.PositiveIntegerField(default=0, verbose_name="Position dans la file")
    
    notes = models.TextField(blank=True, verbose_name="Notes")
    
    class Meta:
        verbose_name = "Ticket de file"
        verbose_name_plural = "Tickets de file"
        ordering = ['date', 'priority', 'created_at']
    
    def __str__(self):
        return f"Ticket {self.ticket_number} - {self.agency.name}"
    
    def save(self, *args, **kwargs):
        if not self.ticket_number:
            # Générer un numéro de ticket unique pour aujourd'hui et cette agence
            today = date.today()
            prefix = self.service.code[:1].upper() if self.service else 'X'
            
            # Trouver le dernier numéro pour ce préfixe aujourd'hui
            last_ticket = QueueTicket.objects.filter(
                agency=self.agency,
                date=today,
                ticket_number__startswith=prefix
            ).order_by('-ticket_number').first()
            
            if last_ticket:
                last_num = int(last_ticket.ticket_number[1:])
                new_num = last_num + 1
            else:
                new_num = 1
            
            self.ticket_number = f"{prefix}{new_num:03d}"
        
        super().save(*args, **kwargs)


class DailyQueueStats(models.Model):
    """Statistiques quotidiennes des files d'attente"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    agency = models.ForeignKey(Agency, on_delete=models.CASCADE, related_name='queue_stats', verbose_name="Agence")
    date = models.DateField(verbose_name="Date")
    
    total_tickets = models.PositiveIntegerField(default=0, verbose_name="Total tickets")
    completed_tickets = models.PositiveIntegerField(default=0, verbose_name="Tickets traités")
    cancelled_tickets = models.PositiveIntegerField(default=0, verbose_name="Tickets annulés")
    no_show_tickets = models.PositiveIntegerField(default=0, verbose_name="Absents")
    
    avg_wait_time = models.PositiveIntegerField(null=True, blank=True, verbose_name="Temps d'attente moyen (min)")
    avg_service_time = models.PositiveIntegerField(null=True, blank=True, verbose_name="Temps de service moyen (min)")
    
    peak_hour = models.TimeField(null=True, blank=True, verbose_name="Heure de pointe")
    peak_wait_time = models.PositiveIntegerField(null=True, blank=True, verbose_name="Temps d'attente en pointe (min)")
    
    class Meta:
        verbose_name = "Statistiques file d'attente"
        verbose_name_plural = "Statistiques files d'attente"
        unique_together = ['agency', 'date']
        ordering = ['-date']
    
    def __str__(self):
        return f"Stats {self.agency.name} - {self.date}"
