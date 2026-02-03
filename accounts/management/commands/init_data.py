from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Permission
from geo.models import Country, Province, Commune, Territory, Nationality

User = get_user_model()

class Command(BaseCommand):
    help = 'Initialiser les données de base du système'
    
    def handle(self, *args, **options):
        self.stdout.write('Initialisation des données...')
        
        # Créer les rôles et permissions
        self.create_permissions()
        
        # Créer un superadmin
        self.create_superadmin()
        
        # Créer les données géographiques (RDC)
        self.create_geography()
        
        self.stdout.write(self.style.SUCCESS('Données initialisées avec succès!'))
    
    def create_permissions(self):
        """Créer les permissions de base"""
        roles = ['super_admin', 'admin', 'rh', 'comptable', 'operations', 'agent_commercial', 'employe', 'client']
        modules = ['core', 'geo', 'accounts', 'hr', 'crm', 'billing', 'operations', 'support', 'cms', 'agencies']
        actions = ['create', 'read', 'update', 'delete', 'export', 'approve']
        
        # Super admin a toutes les permissions
        for module in modules:
            for action in actions:
                Permission.objects.get_or_create(
                    role='super_admin',
                    module=module,
                    action=action
                )
        
        # Admin a presque tout sauf les paramètres système
        for module in modules:
            if module != 'core':
                for action in actions:
                    Permission.objects.get_or_create(
                        role='admin',
                        module=module,
                        action=action
                    )
        
        # RH
        for action in ['create', 'read', 'update', 'delete', 'export', 'approve']:
            Permission.objects.get_or_create(role='rh', module='hr', action=action)
        for action in ['read']:
            Permission.objects.get_or_create(role='rh', module='crm', action=action)
        
        # Comptable
        for action in ['create', 'read', 'update', 'delete', 'export', 'approve']:
            Permission.objects.get_or_create(role='comptable', module='billing', action=action)
        for action in ['read']:
            Permission.objects.get_or_create(role='comptable', module='crm', action=action)
        
        # Opérations
        for action in ['create', 'read', 'update', 'delete']:
            Permission.objects.get_or_create(role='operations', module='operations', action=action)
        for action in ['read']:
            Permission.objects.get_or_create(role='operations', module='crm', action=action)
        
        # Agent commercial
        for action in ['create', 'read', 'update']:
            Permission.objects.get_or_create(role='agent_commercial', module='crm', action=action)
        for action in ['read']:
            Permission.objects.get_or_create(role='agent_commercial', module='billing', action=action)
        
        # Employé
        for action in ['read']:
            Permission.objects.get_or_create(role='employe', module='hr', action=action)
        
        # Client
        for action in ['read']:
            Permission.objects.get_or_create(role='client', module='billing', action=action)
            Permission.objects.get_or_create(role='client', module='support', action=action)
        
        self.stdout.write('Permissions créées')
    
    def create_superadmin(self):
        """Créer un superadmin par défaut"""
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@mwolo.energy',
                password='admin123',
                role='super_admin'
            )
            self.stdout.write('Superadmin créé (admin/admin123)')
    
    def create_geography(self):
        """Créer les données géographiques de la RDC"""
        # Créer le pays
        rdc, _ = Country.objects.get_or_create(
            code='CD',
            defaults={'name': 'République Démocratique du Congo'}
        )
        
        # Nationalités de la RDC
        nationalities = [
            'Congolaise',
            'Angolaise',
            'Camerounaise',
            'Centrafricaine',
            'Chadienne',
            'Équatorienne',
            'Gabonaise',
            'Guinéenne',
            'Ivoirienne',
            'Kenyane',
            'Malienne',
            'Mozambicaine',
            'Nigériane',
            'Ougandaise',
            'Rwandaise',
            'Sénégalaise',
            'Tanzanienne',
            'Togolaise',
            'Ougandaise',
            'Zambienne',
            'Zimbabwéenne',
        ]
        
        for nat in nationalities:
            Nationality.objects.get_or_create(
                country=rdc,
                name=nat
            )
        
        # Provinces de la RDC
        provinces_data = [
            ('KIN', 'Kinshasa'),
            ('KAS', 'Kasai'),
            ('KAT', 'Katanga'),
            ('KIV', 'Kivu'),
            ('BAN', 'Bandundu'),
            ('EQU', 'Équateur'),
            ('ORI', 'Orientale'),
            ('MAN', 'Maniema'),
        ]
        
        for code, name in provinces_data:
            Province.objects.get_or_create(
                country=rdc,
                code=code,
                defaults={'name': name}
            )
        
        self.stdout.write('Données géographiques créées')
