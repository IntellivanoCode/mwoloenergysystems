"""
Commande pour peupler les données initiales de l'application.
Usage: python manage.py setup_initial_data
"""
from django.core.management.base import BaseCommand
from django.db import transaction
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Peuple la base de données avec les données initiales'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Forcer la recréation des données même si elles existent',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE('🚀 Configuration des données initiales...'))
        
        with transaction.atomic():
            self.setup_geo_data()
            self.setup_agencies()
            self.setup_service_types()
            self.setup_time_slots()
            self.setup_counters()
            self.setup_cms_data()
            self.setup_test_users()
            self.link_users_to_clients()
        
        self.stdout.write(self.style.SUCCESS('✅ Données initiales configurées avec succès!'))

    def setup_geo_data(self):
        """Configuration des données géographiques"""
        from geo.models import Country, Nationality, Province, Commune, Territory
        
        self.stdout.write('  📍 Configuration des données géographiques...')
        
        # RDC
        rdc, _ = Country.objects.get_or_create(
            code='CD',
            defaults={'name': 'République Démocratique du Congo'}
        )
        
        # Nationalité (utilise country et name comme clés uniques)
        Nationality.objects.get_or_create(
            country=rdc,
            name='Congolaise (RDC)'
        )
        
        # Provinces principales
        provinces_data = [
            ('KIN', 'Kinshasa'),
            ('LUA', 'Lualaba'),
            ('HKA', 'Haut-Katanga'),
            ('SKA', 'Sud-Kivu'),
            ('NKA', 'Nord-Kivu'),
            ('KOR', 'Kongo-Central'),
            ('EQU', 'Équateur'),
            ('KAS', 'Kasaï'),
        ]
        
        for code, name in provinces_data:
            prov, _ = Province.objects.get_or_create(
                code=code,
                country=rdc,
                defaults={'name': name}
            )
            
            # Communes pour Kinshasa
            if code == 'KIN':
                communes_kin = [
                    ('GOMBE', 'Gombe'), ('NGALI', 'Ngaliema'), ('BARUMB', 'Barumbu'),
                    ('KINTAM', 'Kintambo'), ('LIMETE', 'Limete'), ('MATETE', 'Matete'),
                    ('NDJILI', 'N\'djili'), ('MASINA', 'Masina'), ('KALAMU', 'Kalamu'),
                    ('BANDAL', 'Bandalungwa'), ('LINGWA', 'Lingwala'),
                ]
                for comm_code, comm_name in communes_kin:
                    Commune.objects.get_or_create(
                        code=comm_code,
                        province=prov,
                        defaults={'name': comm_name}
                    )
                    # Créer un territoire pour chaque commune
                    from geo.models import Territory
                    commune = Commune.objects.get(code=comm_code, province=prov)
                    Territory.objects.get_or_create(
                        code=f'T-{comm_code}',
                        commune=commune,
                        defaults={'name': f'Centre {comm_name}'}
                    )
        
        self.stdout.write(self.style.SUCCESS('    ✓ Données géographiques OK'))

    def setup_agencies(self):
        """Configuration des agences"""
        from agencies.models import Agency
        from geo.models import Province, Commune, Territory
        
        self.stdout.write('  🏢 Configuration des agences...')
        
        kinshasa = Province.objects.filter(code='KIN').first()
        
        # Obtenir ou créer un territoire pour les agences
        gombe = Commune.objects.filter(code='GOMBE', province=kinshasa).first()
        limete = Commune.objects.filter(code='LIMETE', province=kinshasa).first()
        ngali = Commune.objects.filter(code='NGALI', province=kinshasa).first()
        
        # Territoires (créés dans setup_geo_data)
        territory_gombe = Territory.objects.filter(commune=gombe).first() if gombe else None
        territory_limete = Territory.objects.filter(commune=limete).first() if limete else None
        territory_ngali = Territory.objects.filter(commune=ngali).first() if ngali else None
        
        agencies_data = [
            ('MWOLO-KIN-001', 'Agence Gombe', 'Boulevard du 30 Juin, Gombe', True, territory_gombe),
            ('MWOLO-KIN-002', 'Agence Limete', 'Avenue des Poids Lourds, Limete', True, territory_limete),
            ('MWOLO-KIN-003', 'Agence Ngaliema', 'Avenue de la Libération, Ngaliema', True, territory_ngali),
        ]
        
        for code, name, address, is_active, territory in agencies_data:
            if territory:
                Agency.objects.get_or_create(
                    code=code,
                    defaults={
                        'name': name,
                        'address': address,
                        'is_active': is_active,
                        'province': kinshasa,
                        'territory': territory,
                        'phone': '+243 800 000 000',
                        'email': f'{code.lower().replace("-", "")}@mwolo.energy',
                    }
                )
        
        self.stdout.write(self.style.SUCCESS('    ✓ Agences OK'))

    def setup_service_types(self):
        """Configuration des types de services pour rendez-vous"""
        from appointments.models import ServiceType
        
        self.stdout.write('  📋 Configuration des types de services...')
        
        services_data = [
            ('NOUV_ABO', 'Nouvel abonnement', 'Souscription à un nouvel abonnement électrique', 45, 'bolt', 'blue'),
            ('MODIF_ABO', 'Modification d\'abonnement', 'Modification de la puissance ou du type d\'abonnement', 30, 'edit', 'green'),
            ('RESIL_ABO', 'Résiliation', 'Résiliation de contrat d\'abonnement', 20, 'times-circle', 'red'),
            ('RECLA', 'Réclamation', 'Dépôt et traitement de réclamation', 30, 'exclamation-triangle', 'orange'),
            ('PAIEMENT', 'Paiement facture', 'Paiement de facture au guichet', 15, 'credit-card', 'emerald'),
            ('INFO', 'Information', 'Demande d\'information générale', 15, 'info-circle', 'cyan'),
            ('TECH', 'Intervention technique', 'Planification d\'intervention technique', 30, 'tools', 'purple'),
            ('DEVIS', 'Demande de devis', 'Établissement d\'un devis pour installation', 45, 'file-invoice', 'indigo'),
            ('REAB', 'Réabonnement', 'Réactivation d\'un abonnement suspendu', 30, 'sync', 'teal'),
            ('DOC', 'Retrait de documents', 'Retrait de factures, attestations, etc.', 10, 'file-alt', 'slate'),
        ]
        
        for code, name, desc, duration, icon, color in services_data:
            ServiceType.objects.get_or_create(
                code=code,
                defaults={
                    'name': name,
                    'description': desc,
                    'estimated_duration': duration,
                    'icon': icon,
                    'color': color,
                    'is_active': True,
                }
            )
        
        self.stdout.write(self.style.SUCCESS('    ✓ Types de services OK'))

    def setup_time_slots(self):
        """Configuration des créneaux horaires"""
        from appointments.models import TimeSlot
        from agencies.models import Agency
        from datetime import time
        
        self.stdout.write('  ⏰ Configuration des créneaux horaires...')
        
        # Créneaux pour chaque agence, du lundi au vendredi
        agencies = Agency.objects.filter(is_active=True)
        
        time_slots_data = [
            (time(8, 0), time(10, 0), 15),
            (time(10, 0), time(12, 0), 15),
            (time(14, 0), time(16, 0), 15),
            (time(16, 0), time(17, 0), 10),
        ]
        
        for agency in agencies:
            for day in range(5):  # Lundi à Vendredi
                for start, end, max_appt in time_slots_data:
                    TimeSlot.objects.get_or_create(
                        agency=agency,
                        day_of_week=day,
                        start_time=start,
                        end_time=end,
                        defaults={
                            'max_appointments': max_appt,
                            'is_active': True,
                        }
                    )
            
            # Samedi matin seulement
            TimeSlot.objects.get_or_create(
                agency=agency,
                day_of_week=5,
                start_time=time(8, 0),
                end_time=time(12, 0),
                defaults={
                    'max_appointments': 20,
                    'is_active': True,
                }
            )
        
        self.stdout.write(self.style.SUCCESS('    ✓ Créneaux horaires OK'))

    def setup_counters(self):
        """Configuration des guichets"""
        from appointments.models import Counter, ServiceType
        from agencies.models import Agency
        
        self.stdout.write('  🎫 Configuration des guichets...')
        
        agencies = Agency.objects.filter(is_active=True)
        all_services = ServiceType.objects.filter(is_active=True)
        
        # Services par type de guichet
        service_groups = {
            'Accueil': ['INFO', 'DOC'],
            'Abonnements': ['NOUV_ABO', 'MODIF_ABO', 'RESIL_ABO', 'REAB'],
            'Caisse': ['PAIEMENT'],
            'Réclamations': ['RECLA', 'TECH'],
            'Commercial': ['DEVIS', 'INFO'],
        }
        
        for agency in agencies:
            counter_num = 1
            for name, service_codes in service_groups.items():
                counter, created = Counter.objects.get_or_create(
                    agency=agency,
                    number=counter_num,
                    defaults={
                        'name': name,
                        'status': 'closed',
                        'is_active': True,
                    }
                )
                
                if created:
                    services = ServiceType.objects.filter(code__in=service_codes)
                    counter.services.set(services)
                
                counter_num += 1
        
        self.stdout.write(self.style.SUCCESS('    ✓ Guichets OK'))

    def setup_cms_data(self):
        """Configuration des données CMS"""
        from cms.models import Service, SiteSettings, FAQ, Advantage
        
        self.stdout.write('  📰 Configuration des données CMS...')
        
        # Services affichés sur le site
        cms_services = [
            ('Installation électrique', 'Installation complète de systèmes électriques résidentiels et commerciaux', 1),
            ('Énergie solaire', 'Solutions photovoltaïques pour l\'autonomie énergétique', 2),
            ('Maintenance', 'Services de maintenance préventive et corrective', 3),
            ('Audit énergétique', 'Analyse et optimisation de votre consommation', 4),
            ('Groupe électrogène', 'Installation et maintenance de groupes électrogènes', 5),
            ('Climatisation', 'Installation de systèmes de climatisation', 6),
        ]
        
        for title, desc, order in cms_services:
            Service.objects.get_or_create(
                title=title,
                defaults={
                    'description': desc,
                    'order': order,
                    'is_active': True,
                }
            )
        
        # Paramètres du site
        SiteSettings.objects.get_or_create(
            pk='00000000-0000-0000-0000-000000000001',
            defaults={
                'company_name': 'Mwolo Energy Systems',
                'company_description': 'Leader en solutions énergétiques durables en RDC',
                'email': 'contact@mwolo.energy',
                'phone': '+243 800 000 000',
                'address': 'Boulevard du 30 Juin, Gombe, Kinshasa, RDC',
                'portal_welcome_message': 'Bienvenue sur votre espace de travail',
                'portal_primary_color': '#0891b2',
                'portal_secondary_color': '#2563eb',
            }
        )
        
        # FAQs
        faqs = [
            ('Comment souscrire à un abonnement ?', 'Vous pouvez souscrire en ligne via notre site, par téléphone, ou en vous rendant dans l\'une de nos agences.', 'Abonnement'),
            ('Quels sont les modes de paiement acceptés ?', 'Nous acceptons les paiements en espèces, par mobile money (M-Pesa, Airtel Money, Orange Money), et par virement bancaire.', 'Paiement'),
            ('Comment signaler une panne ?', 'Contactez notre service client au +243 800 000 000 ou utilisez notre formulaire en ligne. Notre équipe interviendra dans les plus brefs délais.', 'Support'),
            ('Quels sont les délais d\'installation ?', 'Les délais varient selon le type d\'installation. En général, comptez 3-5 jours ouvrables pour une installation standard.', 'Installation'),
        ]
        
        for question, answer, category in faqs:
            FAQ.objects.get_or_create(
                question=question,
                defaults={
                    'answer': answer,
                    'category': category,
                    'is_active': True,
                }
            )
        
        # Avantages
        advantages = [
            ('Expertise locale', 'Plus de 5 ans d\'expérience en RDC', 'award', 'cyan', 1),
            ('Service 24/7', 'Assistance disponible à tout moment', 'clock', 'emerald', 2),
            ('Prix compétitifs', 'Les meilleurs tarifs du marché', 'tag', 'amber', 3),
            ('Équipe qualifiée', 'Techniciens certifiés et formés', 'users', 'blue', 4),
        ]
        
        for title, desc, icon, color, order in advantages:
            Advantage.objects.get_or_create(
                title=title,
                defaults={
                    'description': desc,
                    'icon_name': icon,
                    'color': color,
                    'order': order,
                    'is_active': True,
                }
            )
        
        self.stdout.write(self.style.SUCCESS('    ✓ Données CMS OK'))

    def setup_test_users(self):
        """Création d'utilisateurs de test"""
        from hr.models import Employee
        from agencies.models import Agency
        from geo.models import Nationality
        from datetime import date
        
        self.stdout.write('  👤 Configuration des utilisateurs de test...')
        
        agency = Agency.objects.first()
        nationality = Nationality.objects.first()
        
        # Super Admin
        admin, created = User.objects.get_or_create(
            email='admin@mwolo.energy',
            defaults={
                'username': 'admin',
                'first_name': 'Admin',
                'last_name': 'Système',
                'role': 'super_admin',
                'is_staff': True,
                'is_superuser': True,
                'is_active': True,
            }
        )
        if created:
            admin.set_password('Admin@2024')
            admin.save()
            self.stdout.write(f'    → Créé: admin@mwolo.energy (mot de passe: Admin@2024)')
        
        # Employés de test
        employees_data = [
            ('jean.directeur@mwolo.energy', 'jean.directeur', 'Jean', 'Directeur', 'directeur_general', 'direction', 'EMP001'),
            ('marie.rh@mwolo.energy', 'marie.rh', 'Marie', 'RH', 'responsable_rh', 'rh', 'EMP002'),
            ('paul.comptable@mwolo.energy', 'paul.comptable', 'Paul', 'Comptable', 'comptable', 'comptabilite', 'EMP003'),
            ('alice.guichet@mwolo.energy', 'alice.guichet', 'Alice', 'Guichet', 'agent_guichet', 'support', 'EMP004'),
            ('bob.technicien@mwolo.energy', 'bob.technicien', 'Bob', 'Technicien', 'technicien', 'operations', 'EMP005'),
        ]
        
        for email, username, first, last, position, department, emp_num in employees_data:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': username,
                    'first_name': first,
                    'last_name': last,
                    'role': 'employe',
                    'is_staff': False,
                    'is_active': True,
                }
            )
            if created:
                user.set_password('Employe@2024')
                user.save()
                
                # Créer le profil employé
                if agency and nationality:
                    Employee.objects.get_or_create(
                        user=user,
                        defaults={
                            'agency': agency,
                            'first_name': first,
                            'last_name': last,
                            'nationality': nationality,
                            'date_of_birth': date(1990, 1, 1),
                            'place_of_birth': 'Kinshasa',
                            'nif': f'NIF-{emp_num}',
                            'employee_number': emp_num,
                            'position': position,
                            'department': department,
                            'contract_type': 'cdi',
                            'hire_date': date(2023, 1, 1),
                            'status': 'actif',
                        }
                    )
                
                self.stdout.write(f'    → Créé: {email} (mot de passe: Employe@2024)')
        
        # Client de test
        client_user, created = User.objects.get_or_create(
            email='client@test.com',
            defaults={
                'username': 'client.test',
                'first_name': 'Client',
                'last_name': 'Test',
                'role': 'client',
                'is_staff': False,
                'is_active': True,
            }
        )
        if created:
            client_user.set_password('Client@2024')
            client_user.save()
            self.stdout.write(f'    → Créé: client@test.com (mot de passe: Client@2024)')
        
        self.stdout.write(self.style.SUCCESS('    ✓ Utilisateurs de test OK'))

    def link_users_to_clients(self):
        """Lier automatiquement les utilisateurs clients à leurs profils CRM"""
        from crm.models import Client
        
        self.stdout.write('  🔗 Liaison utilisateurs-clients...')
        
        # Trouver tous les utilisateurs avec rôle client sans profil CRM
        client_users = User.objects.filter(role='client', client_profile__isnull=True)
        
        linked_count = 0
        created_count = 0
        
        for user in client_users:
            # Chercher un client CRM par email
            client = Client.objects.filter(email__iexact=user.email).first()
            
            if client and not client.user:
                # Lier le client existant
                client.user = user
                client.save(update_fields=['user'])
                linked_count += 1
            elif not client:
                # Créer un nouveau profil client
                Client.objects.create(
                    user=user,
                    first_name=user.first_name or 'Prénom',
                    last_name=user.last_name or 'Nom',
                    email=user.email,
                    phone=user.phone or '',
                    status='actif',
                )
                created_count += 1
        
        if linked_count:
            self.stdout.write(f'    → {linked_count} utilisateurs liés à des clients existants')
        if created_count:
            self.stdout.write(f'    → {created_count} nouveaux profils clients créés')
        
        self.stdout.write(self.style.SUCCESS('    ✓ Liaison utilisateurs-clients OK'))
