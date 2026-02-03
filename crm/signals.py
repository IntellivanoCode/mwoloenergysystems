"""
Signals pour la liaison automatique User-Client dans le CRM.
"""

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()


def link_user_to_client(user):
    """
    Lie intelligemment un utilisateur à un profil client existant ou en crée un nouveau.
    
    Logique de liaison:
    1. Si l'utilisateur a déjà un profil client lié, on ne fait rien
    2. Sinon, on cherche un client avec le même email
    3. Si pas de correspondance email, on cherche par téléphone
    4. Si pas de correspondance, on crée un nouveau profil client
    """
    from .models import Client
    
    # Ignorer les super-admins et employés
    if user.role in ['super_admin', 'employe']:
        return None
    
    # Vérifier si l'utilisateur a déjà un client lié
    try:
        if hasattr(user, 'client_profile') and user.client_profile:
            return user.client_profile
    except Client.DoesNotExist:
        pass
    
    # Chercher un client existant par email
    client = None
    if user.email:
        client = Client.objects.filter(email__iexact=user.email, user__isnull=True).first()
    
    # Si pas trouvé par email, chercher par téléphone
    if not client and user.phone:
        client = Client.objects.filter(phone=user.phone, user__isnull=True).first()
    
    if client:
        # Lier le client existant à l'utilisateur
        client.user = user
        client.save(update_fields=['user'])
        return client
    else:
        # Créer un nouveau profil client pour l'utilisateur
        from geo.models import Country, Commune
        
        # Obtenir le pays par défaut (RDC)
        default_country = Country.objects.filter(code='CD').first()
        if not default_country:
            default_country = Country.objects.first()
        
        # Créer le client
        new_client = Client.objects.create(
            user=user,
            first_name=user.first_name or user.username,
            last_name=user.last_name or '',
            email=user.email or '',
            phone=user.phone or '',
            status='actif',
        )
        return new_client


@receiver(post_save, sender=User)
def auto_link_client(sender, instance, created, raw=False, **kwargs):
    """
    Signal post_save pour lier automatiquement un utilisateur à un client.
    Se déclenche à la création d'un nouvel utilisateur client.
    
    Note: raw=True est passé pendant loaddata, donc on ignore ces cas
    pour éviter de créer des clients en double.
    """
    # Ignorer pendant loaddata (raw=True)
    if raw:
        return
    
    if created and instance.role == 'client':
        link_user_to_client(instance)


def sync_all_client_users():
    """
    Utilitaire pour synchroniser tous les utilisateurs clients existants
    avec des profils clients.
    
    Usage:
        from crm.signals import sync_all_client_users
        sync_all_client_users()
    """
    from .models import Client
    
    users = User.objects.filter(role='client')
    linked_count = 0
    created_count = 0
    
    for user in users:
        # Vérifier si déjà lié
        has_client = Client.objects.filter(user=user).exists()
        
        if not has_client:
            result = link_user_to_client(user)
            if result:
                # Vérifier si c'était une liaison ou une création
                if result.date_inscription and result.date_inscription != user.date_joined.date():
                    linked_count += 1
                else:
                    created_count += 1
    
    return {
        'total_users': users.count(),
        'linked': linked_count,
        'created': created_count,
    }
