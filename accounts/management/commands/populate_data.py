from django.core.management.base import BaseCommand
from cms.models import Service, Testimonial, Partner, BlogPost, SiteSettings, JobOffer
from agencies.models import Agency
from geo.models import Country, Province, Commune, Territory, Nationality
from accounts.models import User
from hr.models import Employee
from django.utils import timezone
from datetime import date, timedelta
import uuid

class Command(BaseCommand):
    help = 'Peupler les données par défaut du site'
    
    def handle(self, *args, **options):
        self.stdout.write('Peuplement des données...')
        
        # Créer le pays
        self.stdout.write('Création du pays...')
        country, _ = Country.objects.get_or_create(
            code='CD',
            defaults={'name': 'République Démocratique du Congo'}
        )
        
        # Créer les provinces
        self.stdout.write('Création des provinces et territoires...')
        provinces_data = [
            {'name': 'Kinshasa', 'code': 'KIN'},
            {'name': 'Kasai', 'code': 'KAS'},
            {'name': 'Katanga', 'code': 'KAT'},
            {'name': 'Équateur', 'code': 'EQU'},
            {'name': 'Orientale', 'code': 'ORI'},
        ]
        
        provinces = {}
        for prov_data in provinces_data:
            prov, _ = Province.objects.get_or_create(
                country=country,
                code=prov_data['code'],
                defaults={'name': prov_data['name']}
            )
            provinces[prov_data['name']] = prov
        
        # Créer les communes et territoires
        communes_data = [
            {'name': 'Gombe', 'code': 'GOM', 'province': 'Kinshasa', 'territories': ['Gombe']},
            {'name': 'Kalamu', 'code': 'KAL', 'province': 'Kinshasa', 'territories': ['Kalamu']},
            {'name': 'Kasavubu', 'code': 'KAS', 'province': 'Kinshasa', 'territories': ['Kasavubu']},
            {'name': 'Kimbanseke', 'code': 'KIM', 'province': 'Kinshasa', 'territories': ['Kimbanseke']},
            {'name': 'Limete', 'code': 'LIM', 'province': 'Kinshasa', 'territories': ['Limete']},
            {'name': 'Lukunga', 'code': 'LUK', 'province': 'Kinshasa', 'territories': ['Lukunga']},
            {'name': 'Makala', 'code': 'MAK', 'province': 'Kinshasa', 'territories': ['Makala']},
            {'name': 'Maluku', 'code': 'MAL', 'province': 'Kinshasa', 'territories': ['Maluku']},
            {'name': 'Matete', 'code': 'MAT', 'province': 'Kinshasa', 'territories': ['Matete']},
            {'name': 'Ngaliema', 'code': 'NGA', 'province': 'Kinshasa', 'territories': ['Ngaliema']},
            {'name': 'Ngomba', 'code': 'NGO', 'province': 'Kinshasa', 'territories': ['Ngomba']},
            {'name': 'Ndjili', 'code': 'NDJ', 'province': 'Kinshasa', 'territories': ['Ndjili']},
            {'name': 'Selembao', 'code': 'SEL', 'province': 'Kinshasa', 'territories': ['Selembao']},
            {'name': 'Tshangu', 'code': 'TSH', 'province': 'Kinshasa', 'territories': ['Tshangu']},
        ]
        
        territories = {}
        for comm_data in communes_data:
            commune, _ = Commune.objects.get_or_create(
                province=provinces[comm_data['province']],
                code=comm_data['code'],
                defaults={'name': comm_data['name']}
            )
            
            for terr_name in comm_data['territories']:
                terr, _ = Territory.objects.get_or_create(
                    commune=commune,
                    code=terr_name[:3].upper(),
                    defaults={'name': terr_name}
                )
                territories[terr_name] = terr
        
        # Créer les nationalités
        self.stdout.write('Création des nationalités...')
        nationalities_data = [
            {'name': 'Congolaise'},
            {'name': 'Belge'},
            {'name': 'Française'},
            {'name': 'Camerounaise'},
            {'name': 'Ivoirienne'},
        ]
        
        nationalities = {}
        for nat_data in nationalities_data:
            nat, _ = Nationality.objects.get_or_create(
                country=country,
                name=nat_data['name']
            )
            nationalities[nat_data['name']] = nat
        
        # Créer les agences
        self.stdout.write('Création des agences...')
        agencies_data = [
            {
                'name': 'Agence Centrale Kinshasa',
                'territory': 'Gombe',
                'address': 'Avenue de la Paix, Gombe, Kinshasa',
                'phone': '+243 81 234 5678',
                'email': 'agence.gombe@mwolo.energy',
            },
            {
                'name': 'Agence Kalamu',
                'territory': 'Kalamu',
                'address': 'Boulevard du 30 Juin, Kalamu, Kinshasa',
                'phone': '+243 81 234 5679',
                'email': 'agence.kalamu@mwolo.energy',
            },
            {
                'name': 'Agence Kasavubu',
                'territory': 'Kasavubu',
                'address': 'Rue Kasavubu, Kasavubu, Kinshasa',
                'phone': '+243 81 234 5680',
                'email': 'agence.kasavubu@mwolo.energy',
            },
            {
                'name': 'Agence Limete',
                'territory': 'Limete',
                'address': 'Avenue Limete, Limete, Kinshasa',
                'phone': '+243 81 234 5681',
                'email': 'agence.limete@mwolo.energy',
            },
        ]
        
        agencies = {}
        for agency_data in agencies_data:
            territory = territories[agency_data['territory']]
            agency, _ = Agency.objects.get_or_create(
                name=agency_data['name'],
                defaults={
                    'territory': territory,
                    'province': territory.commune.province,
                    'address': agency_data['address'],
                    'phone': agency_data['phone'],
                    'email': agency_data['email'],
                    'is_active': True,
                }
            )
            agencies[agency_data['name']] = agency
        
        # Créer les utilisateurs et employés
        self.stdout.write('Création des employés...')
        employees_data = [
            {
                'first_name': 'Jean',
                'last_name': 'Kasongo',
                'post_name': 'Mwamba',
                'position': 'Directeur Général',
                'department': 'Direction',
                'agency': 'Agence Centrale Kinshasa',
                'email': 'jean.kasongo@mwolo.energy',
                'phone': '+243 81 111 1111',
                'nationality': 'Congolaise',
            },
            {
                'first_name': 'Marie',
                'last_name': 'Mbala',
                'post_name': 'Nkulu',
                'position': 'Responsable Opérations',
                'department': 'Opérations',
                'agency': 'Agence Centrale Kinshasa',
                'email': 'marie.mbala@mwolo.energy',
                'phone': '+243 81 111 1112',
                'nationality': 'Congolaise',
            },
            {
                'first_name': 'Pierre',
                'last_name': 'Mwangi',
                'post_name': 'Tshimanga',
                'position': 'Chef Technique',
                'department': 'Technique',
                'agency': 'Agence Centrale Kinshasa',
                'email': 'pierre.mwangi@mwolo.energy',
                'phone': '+243 81 111 1113',
                'nationality': 'Congolaise',
            },
            {
                'first_name': 'Sophie',
                'last_name': 'Mwamba',
                'post_name': 'Kasai',
                'position': 'Responsable Facturation',
                'department': 'Facturation',
                'agency': 'Agence Kalamu',
                'email': 'sophie.mwamba@mwolo.energy',
                'phone': '+243 81 111 1114',
                'nationality': 'Congolaise',
            },
            {
                'first_name': 'David',
                'last_name': 'Tshimanga',
                'post_name': 'Mwangi',
                'position': 'Manager Support',
                'department': 'Support Client',
                'agency': 'Agence Kasavubu',
                'email': 'david.tshimanga@mwolo.energy',
                'phone': '+243 81 111 1115',
                'nationality': 'Congolaise',
            },
            {
                'first_name': 'Amélie',
                'last_name': 'Nkulu',
                'post_name': 'Kasongo',
                'position': 'Superviseur Maintenance',
                'department': 'Maintenance',
                'agency': 'Agence Limete',
                'email': 'amelie.nkulu@mwolo.energy',
                'phone': '+243 81 111 1116',
                'nationality': 'Congolaise',
            },
        ]
        
        for emp_data in employees_data:
            # Créer l'utilisateur
            user, _ = User.objects.get_or_create(
                email=emp_data['email'],
                defaults={
                    'username': emp_data['email'].split('@')[0],
                    'first_name': emp_data['first_name'],
                    'last_name': emp_data['last_name'],
                    'post_name': emp_data['post_name'],
                    'phone': emp_data['phone'],
                    'is_active': True,
                }
            )
            
            # Créer l'employé
            Employee.objects.get_or_create(
                user=user,
                defaults={
                    'first_name': emp_data['first_name'],
                    'last_name': emp_data['last_name'],
                    'post_name': emp_data['post_name'],
                    'position': emp_data['position'],
                    'department': emp_data['department'],
                    'agency': agencies[emp_data['agency']],
                    'nationality': nationalities[emp_data['nationality']],
                    'date_of_birth': date(1990, 1, 1),
                    'place_of_birth': 'Kinshasa',
                    'nif': f"NIF{uuid.uuid4().hex[:8].upper()}",
                    'employee_number': f"EMP{uuid.uuid4().hex[:6].upper()}",
                    'hire_date': date.today() - timedelta(days=365),
                    'contract_type': 'cdi',
                    'status': 'actif',
                    'base_salary': 1500.00,
                }
            )
        
        # Créer les offres d'emploi
        self.stdout.write('Création des offres d\'emploi...')
        job_offers_data = [
            {
                'title': 'Ingénieur Électrique Senior',
                'department': 'Technique',
                'location': 'Kinshasa',
                'contract_type': 'CDI',
                'salary_min': 2500,
                'salary_max': 3500,
                'description': 'Nous recherchons un ingénieur électrique expérimenté pour rejoindre notre équipe technique. Vous serez responsable de la conception et de la maintenance des systèmes de distribution d\'énergie.',
                'requirements': '- Diplôme en génie électrique\n- 5+ ans d\'expérience\n- Connaissance des systèmes de distribution\n- Excellentes compétences en communication',
                'benefits': '- Salaire compétitif\n- Assurance maladie\n- Congés payés\n- Formation continue',
                'is_featured': True,
            },
            {
                'title': 'Développeur Full Stack',
                'department': 'IT',
                'location': 'Kinshasa',
                'contract_type': 'CDI',
                'salary_min': 2000,
                'salary_max': 3000,
                'description': 'Rejoignez notre équipe IT pour développer et maintenir nos applications web et mobiles. Vous travaillerez avec les dernières technologies.',
                'requirements': '- Diplôme en informatique ou domaine connexe\n- 3+ ans d\'expérience en développement\n- Maîtrise de Python, JavaScript, React\n- Expérience avec les bases de données',
                'benefits': '- Salaire compétitif\n- Télétravail possible\n- Équipement fourni\n- Environnement de travail moderne',
                'is_featured': True,
            },
            {
                'title': 'Responsable Facturation',
                'department': 'Facturation',
                'location': 'Kinshasa',
                'contract_type': 'CDI',
                'salary_min': 1500,
                'salary_max': 2200,
                'description': 'Gérez les processus de facturation et assurez la qualité des données. Vous superviserez une équipe de 3-4 personnes.',
                'requirements': '- Diplôme en comptabilité ou gestion\n- 3+ ans d\'expérience en facturation\n- Maîtrise d\'Excel et des systèmes de facturation\n- Excellentes compétences organisationnelles',
                'benefits': '- Salaire compétitif\n- Assurance maladie\n- Congés payés\n- Opportunités de carrière',
                'is_featured': False,
            },
            {
                'title': 'Technicien Maintenance',
                'department': 'Maintenance',
                'location': 'Kinshasa',
                'contract_type': 'CDI',
                'salary_min': 1200,
                'salary_max': 1800,
                'description': 'Effectuez la maintenance préventive et corrective des équipements de distribution d\'énergie. Travail sur le terrain et en atelier.',
                'requirements': '- Diplôme technique en électricité\n- 2+ ans d\'expérience en maintenance\n- Permis de conduire valide\n- Capacité à travailler en équipe',
                'benefits': '- Salaire compétitif\n- Équipement de sécurité fourni\n- Formation continue\n- Assurance maladie',
                'is_featured': False,
            },
            {
                'title': 'Agent Support Client',
                'department': 'Support Client',
                'location': 'Kinshasa',
                'contract_type': 'CDI',
                'salary_min': 1000,
                'salary_max': 1500,
                'description': 'Fournissez un support client de qualité via téléphone, email et chat. Résolvez les problèmes des clients et assurez leur satisfaction.',
                'requirements': '- Diplôme secondaire minimum\n- Excellentes compétences en communication\n- Maîtrise du français et de l\'anglais\n- Patience et empathie',
                'benefits': '- Salaire compétitif\n- Formation complète\n- Environnement de travail agréable\n- Opportunités d\'avancement',
                'is_featured': False,
            },
        ]
        
        for job_data in job_offers_data:
            JobOffer.objects.get_or_create(
                title=job_data['title'],
                defaults={
                    'description': job_data['description'],
                    'requirements': job_data['requirements'],
                    'benefits': job_data['benefits'],
                    'department': job_data['department'],
                    'location': job_data['location'],
                    'contract_type': job_data['contract_type'],
                    'salary_min': job_data['salary_min'],
                    'salary_max': job_data['salary_max'],
                    'currency': 'USD',
                    'status': 'ouvert',
                    'deadline': date.today() + timedelta(days=30),
                    'is_featured': job_data['is_featured'],
                }
            )
        
        # Créer les services avec des icônes SVG modernes
        self.stdout.write('Création des services...')
        services_data = [
            {
                'title': 'Distribution d\'énergie',
                'description': 'Gestion intelligente et fiable de la distribution d\'énergie électrique avec monitoring en temps réel et optimisation automatique',
                'icon_svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
                'order': 1,
            },
            {
                'title': 'Facturation automatisée',
                'description': 'Système de facturation transparent, automatisé et sécurisé avec paiements en ligne, rapports détaillés et historique complet',
                'icon_svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>',
                'order': 2,
            },
            {
                'title': 'Support 24/7',
                'description': 'Support client disponible 24 heures sur 24, 7 jours sur 7 pour tous vos besoins avec temps de réponse rapide',
                'icon_svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>',
                'order': 3,
            },
            {
                'title': 'Maintenance préventive',
                'description': 'Maintenance régulière et préventive pour assurer la fiabilité de vos équipements et minimiser les interruptions',
                'icon_svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>',
                'order': 4,
            },
            {
                'title': 'Monitoring en temps réel',
                'description': 'Surveillance en temps réel de votre consommation d\'énergie avec alertes automatiques et tableaux de bord intuitifs',
                'icon_svg': '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-2.16-2.66c-.44-.53-1.25-.53-1.69 0-.44.53-.44 1.39 0 1.92l3 3.67c.44.53 1.25.53 1.69 0l4-5.13c.44-.53.44-1.39 0-1.92-.44-.53-1.25-.53-1.69 0z"/></svg>',
                'order': 5,
            },
        ]
        
        for service_data in services_data:
            Service.objects.get_or_create(
                title=service_data['title'],
                defaults={
                    'description': service_data['description'],
                    'icon_svg': service_data['icon_svg'],
                    'order': service_data['order'],
                    'is_active': True,
                }
            )
        
        # Créer les témoignages
        self.stdout.write('Création des témoignages...')
        testimonials_data = [
            {
                'author_name': 'Jean Dupont',
                'author_title': 'Directeur Général, Entreprise XYZ',
                'content': 'Mwolo Energy Systems a transformé notre gestion énergétique. Les résultats sont impressionnants et nous avons réduit nos coûts de 30%!',
                'rating': 5,
            },
            {
                'author_name': 'Marie Mbala',
                'author_title': 'Responsable Opérations, Société ABC',
                'content': 'Un service professionnel et fiable. Je recommande vivement Mwolo Energy Systems à toutes les entreprises.',
                'rating': 5,
            },
            {
                'author_name': 'Pierre Kasongo',
                'author_title': 'Directeur Financier, Groupe DEF',
                'content': 'La facturation automatisée nous a fait gagner beaucoup de temps et d\'argent. Excellent support technique!',
                'rating': 4,
            },
            {
                'author_name': 'Sophie Mwamba',
                'author_title': 'Gestionnaire Énergie, Industrie GHI',
                'content': 'Le monitoring en temps réel nous permet de prendre des décisions rapides et efficaces pour optimiser notre consommation.',
                'rating': 5,
            },
        ]
        
        for testimonial_data in testimonials_data:
            Testimonial.objects.get_or_create(
                author_name=testimonial_data['author_name'],
                defaults={
                    'author_title': testimonial_data['author_title'],
                    'content': testimonial_data['content'],
                    'rating': testimonial_data['rating'],
                    'is_active': True,
                    'order': Testimonial.objects.count() + 1,
                }
            )
        
        # Créer les partenaires
        self.stdout.write('Création des partenaires...')
        partners_data = [
            {
                'name': 'TechEnergy Solutions',
                'description': 'Leader en solutions technologiques pour l\'énergie',
                'website': 'https://example.com',
            },
            {
                'name': 'Green Power Africa',
                'description': 'Expert en énergie renouvelable et durable',
                'website': 'https://example.com',
            },
            {
                'name': 'Logistics Plus',
                'description': 'Spécialiste en logistique et distribution',
                'website': 'https://example.com',
            },
            {
                'name': 'Energy Consulting Group',
                'description': 'Consultant en gestion d\'énergie et optimisation',
                'website': 'https://example.com',
            },
        ]
        
        for partner_data in partners_data:
            Partner.objects.get_or_create(
                name=partner_data['name'],
                defaults={
                    'description': partner_data['description'],
                    'website': partner_data['website'],
                    'is_active': True,
                    'order': Partner.objects.count() + 1,
                }
            )
        
        # Créer les articles
        self.stdout.write('Création des articles...')
        articles_data = [
            {
                'title': 'Comment optimiser votre consommation d\'énergie en 2026',
                'slug': 'optimiser-consommation-energie-2026',
                'excerpt': 'Découvrez les meilleures pratiques et technologies pour réduire votre consommation d\'énergie et vos coûts',
                'content': 'L\'optimisation de la consommation énergétique est devenue essentielle pour les entreprises modernes. Avec les solutions de Mwolo Energy Systems, vous pouvez monitorer votre consommation en temps réel et identifier les opportunités d\'économies. Nos experts recommandent une approche holistique combinant technologie, formation et bonnes pratiques.',
            },
            {
                'title': 'Les avantages de la facturation automatisée pour votre entreprise',
                'slug': 'avantages-facturation-automatisee',
                'excerpt': 'Apprenez comment la facturation automatisée peut améliorer votre efficacité opérationnelle et réduire les erreurs',
                'content': 'La facturation automatisée offre de nombreux avantages: réduction des erreurs manuelles, traitement plus rapide, meilleure traçabilité et conformité réglementaire. Mwolo Energy Systems propose une solution complète de facturation qui s\'intègre parfaitement à votre système existant.',
            },
            {
                'title': 'Mwolo Energy Systems : 5 ans d\'excellence et d\'innovation',
                'slug': 'mwolo-5-ans-excellence',
                'excerpt': 'Célébrez avec nous 5 années de service de qualité et découvrez nos projets futurs',
                'content': 'Depuis sa création, Mwolo Energy Systems s\'est engagée à fournir des solutions énergétiques de qualité supérieure. Avec plus de 500 clients satisfaits et une équipe de 50 experts, nous continuons à innover pour offrir les meilleures solutions du marché.',
            },
            {
                'title': 'Transition énergétique : le rôle des technologies intelligentes',
                'slug': 'transition-energetique-technologies',
                'excerpt': 'Explorez comment les technologies intelligentes facilitent la transition vers une énergie plus durable',
                'content': 'La transition énergétique est un enjeu majeur pour l\'Afrique. Les technologies intelligentes de gestion énergétique jouent un rôle crucial dans cette transformation. Mwolo Energy Systems aide les entreprises à adopter ces technologies pour un avenir plus durable.',
            },
        ]
        
        for article_data in articles_data:
            BlogPost.objects.get_or_create(
                slug=article_data['slug'],
                defaults={
                    'title': article_data['title'],
                    'excerpt': article_data['excerpt'],
                    'content': article_data['content'],
                    'is_published': True,
                    'published_at': timezone.now(),
                }
            )
        
        # Créer les paramètres du site
        self.stdout.write('Création des paramètres du site...')
        if not SiteSettings.objects.exists():
            SiteSettings.objects.create(
                company_name='Mwolo Energy Systems',
                company_description='Solutions énergétiques intelligentes pour l\'Afrique. Gestion, distribution et facturation d\'énergie avec technologie de pointe.',
                email='info@mwolo.energy',
                phone='+243 123 456 789',
                address='Kinshasa, République Démocratique du Congo',
                facebook_url='https://facebook.com/mwoloenergy',
                twitter_url='https://twitter.com/mwoloenergy',
                linkedin_url='https://linkedin.com/company/mwolo-energy',
                instagram_url='https://instagram.com/mwoloenergy',
            )
        
        self.stdout.write(self.style.SUCCESS('Données peuplées avec succès !'))
