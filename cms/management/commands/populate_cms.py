from django.core.management.base import BaseCommand
from cms.models import Service, Testimonial, Partner, SiteSettings, BlogPost, JobOffer
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = 'Peuple le CMS avec des données de test'

    def handle(self, *args, **kwargs):
        self.stdout.write('Création des données CMS...')

        # Site Settings
        settings, created = SiteSettings.objects.get_or_create(
            defaults={
                'company_name': 'Mwolo Energy Systems',
                'company_description': 'Solutions énergétiques intelligentes pour l\'Afrique. Gestion, distribution et facturation d\'énergie avec technologie de pointe.',
                'email': 'info@mwolo.energy',
                'phone': '+243 123 456 789',
                'address': 'Avenue de la Libération, Kinshasa, République Démocratique du Congo',
            }
        )
        self.stdout.write(f'✓ Settings: {"créé" if created else "existe"}')

        # Services
        services_data = [
            {
                'title': 'Distribution d\'énergie',
                'description': 'Gestion intelligente et fiable de la distribution d\'énergie électrique avec monitoring en temps réel et optimisation des flux.',
                'icon_svg': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
                'order': 1,
            },
            {
                'title': 'Facturation automatisée',
                'description': 'Système de facturation transparent et automatisé avec calcul précis, factures numériques et paiements en ligne.',
                'icon_svg': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>',
                'order': 2,
            },
            {
                'title': 'Support client 24/7',
                'description': 'Support technique disponible 24 heures sur 24, 7 jours sur 7 avec chat en direct, tickets de support et base de connaissances.',
                'icon_svg': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
                'order': 3,
            },
            {
                'title': 'Maintenance préventive',
                'description': 'Maintenance régulière pour assurer la fiabilité des équipements avec inspections, alertes préventives et rapports détaillés.',
                'icon_svg': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
                'order': 4,
            },
            {
                'title': 'Gestion des clients',
                'description': 'Plateforme complète de gestion des clients et des contrats avec profils, historique des transactions et gestion des contrats.',
                'icon_svg': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
                'order': 5,
            },
            {
                'title': 'Rapports et analytics',
                'description': 'Tableaux de bord détaillés et rapports d\'analyse avec dashboards personnalisés, exports de données et prévisions.',
                'icon_svg': '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>',
                'order': 6,
            },
        ]

        for service_data in services_data:
            service, created = Service.objects.get_or_create(
                title=service_data['title'],
                defaults=service_data
            )
            self.stdout.write(f'  Service: {service.title} {"✓" if created else "existe"}')

        # Testimonials
        testimonials_data = [
            {
                'author_name': 'Jean Mukendi',
                'author_title': 'Directeur Général, Entreprise ABC',
                'content': 'Mwolo Energy a transformé notre gestion énergétique. Le système est fiable, transparent et facile à utiliser. Nous recommandons vivement!',
                'rating': 5,
                'order': 1,
            },
            {
                'author_name': 'Marie Kabongo',
                'author_title': 'Responsable Technique, Société XYZ',
                'content': 'Excellent service client et support technique réactif. La plateforme est intuitive et les rapports sont très détaillés.',
                'rating': 5,
                'order': 2,
            },
            {
                'author_name': 'Pierre Tshisekedi',
                'author_title': 'Chef de Projet, Organisation DEF',
                'content': 'La facturation automatisée nous a fait gagner un temps précieux. Le système de paiement mobile est très pratique pour nos clients.',
                'rating': 4,
                'order': 3,
            },
        ]

        for testimonial_data in testimonials_data:
            testimonial, created = Testimonial.objects.get_or_create(
                author_name=testimonial_data['author_name'],
                defaults=testimonial_data
            )
            self.stdout.write(f'  Testimonial: {testimonial.author_name} {"✓" if created else "existe"}')

        # Partners
        partners_data = [
            {'name': 'SNEL', 'description': 'Société Nationale d\'Électricité', 'order': 1},
            {'name': 'Vodacom', 'description': 'Opérateur télécom', 'order': 2},
            {'name': 'Airtel', 'description': 'Opérateur télécom', 'order': 3},
            {'name': 'Orange', 'description': 'Opérateur télécom', 'order': 4},
        ]

        for partner_data in partners_data:
            partner, created = Partner.objects.get_or_create(
                name=partner_data['name'],
                defaults=partner_data
            )
            self.stdout.write(f'  Partner: {partner.name} {"✓" if created else "existe"}')

        # Blog Posts
        posts_data = [
            {
                'title': 'Lancement de notre nouveau système de paiement mobile',
                'slug': 'lancement-paiement-mobile',
                'excerpt': 'Nous sommes fiers d\'annoncer l\'intégration complète des paiements mobiles M-Pesa, Airtel Money et Orange Money.',
                'content': 'Mwolo Energy Systems franchit une nouvelle étape dans la digitalisation des services énergétiques en RDC. Notre nouveau système de paiement mobile permet à nos clients de payer leurs factures en quelques clics depuis leur téléphone.\n\nLes avantages:\n- Paiement instantané 24/7\n- Confirmation immédiate\n- Historique complet\n- Sécurité renforcée\n\nDisponible dès maintenant sur M-Pesa, Airtel Money et Orange Money.',
                'is_published': True,
                'published_at': datetime.now() - timedelta(days=5),
            },
            {
                'title': 'Expansion de notre réseau: 5 nouvelles agences',
                'slug': 'expansion-reseau-agences',
                'excerpt': 'Mwolo Energy continue son expansion avec l\'ouverture de 5 nouvelles agences à travers le pays.',
                'content': 'Dans notre mission de rendre l\'énergie accessible à tous, nous sommes heureux d\'annoncer l\'ouverture de 5 nouvelles agences dans les provinces de Kinshasa, Kongo Central, Kwilu, Kasaï et Haut-Katanga.\n\nChaque agence est équipée pour:\n- Accueillir les nouveaux clients\n- Gérer les contrats\n- Fournir un support technique\n- Traiter les paiements\n\nVenez nous rendre visite!',
                'is_published': True,
                'published_at': datetime.now() - timedelta(days=15),
            },
            {
                'title': 'Maintenance programmée: 15 février 2026',
                'slug': 'maintenance-fevrier-2026',
                'excerpt': 'Une maintenance de nos systèmes est prévue le 15 février de 2h à 6h du matin.',
                'content': 'Chers clients,\n\nNous effectuerons une maintenance de nos systèmes informatiques le dimanche 15 février 2026 de 2h à 6h du matin.\n\nPendant cette période:\n- Le site web sera temporairement indisponible\n- Les paiements en ligne seront suspendus\n- Le service client sera limité\n\nNous nous excusons pour la gêne occasionnée et vous remercions de votre compréhension.',
                'is_published': True,
                'published_at': datetime.now() - timedelta(days=2),
            },
        ]

        for post_data in posts_data:
            post, created = BlogPost.objects.get_or_create(
                slug=post_data['slug'],
                defaults=post_data
            )
            self.stdout.write(f'  Blog Post: {post.title} {"✓" if created else "existe"}')

        # Job Offers
        jobs_data = [
            {
                'title': 'Ingénieur Électrique Senior',
                'slug': 'ingenieur-electrique-senior',
                'description': 'Nous recherchons un ingénieur électrique expérimenté pour superviser nos opérations techniques.',
                'requirements': '- Diplôme d\'ingénieur électrique\n- 5+ ans d\'expérience\n- Maîtrise des systèmes de distribution\n- Compétences en gestion d\'équipe',
                'benefits': '- Salaire compétitif\n- Assurance santé\n- Formation continue\n- Environnement dynamique',
                'department': 'Opérations',
                'location': 'Kinshasa',
                'contract_type': 'CDI',
                'salary_min': 2000,
                'salary_max': 3500,
                'currency': 'USD',
                'deadline': datetime.now().date() + timedelta(days=30),
                'is_featured': True,
                'status': 'ouvert',
            },
            {
                'title': 'Comptable',
                'slug': 'comptable',
                'description': 'Rejoignez notre équipe financière en tant que comptable.',
                'requirements': '- Licence en comptabilité\n- 3+ ans d\'expérience\n- Maîtrise des logiciels comptables\n- Rigueur et précision',
                'benefits': '- Package attractif\n- Assurance\n- Congés payés\n- Évolution de carrière',
                'department': 'Finance',
                'location': 'Kinshasa',
                'contract_type': 'CDI',
                'salary_min': 1200,
                'salary_max': 2000,
                'currency': 'USD',
                'deadline': datetime.now().date() + timedelta(days=45),
                'is_featured': False,
                'status': 'ouvert',
            },
            {
                'title': 'Agent Commercial',
                'slug': 'agent-commercial',
                'description': 'Développez notre portefeuille clients en tant qu\'agent commercial.',
                'requirements': '- Diplôme en commerce/marketing\n- 2+ ans d\'expérience en vente\n- Excellent relationnel\n- Permis de conduire',
                'benefits': '- Salaire + commissions\n- Véhicule de fonction\n- Formation\n- Primes sur objectifs',
                'department': 'Commercial',
                'location': 'Lubumbashi',
                'contract_type': 'CDI',
                'salary_min': 800,
                'salary_max': 1500,
                'currency': 'USD',
                'deadline': datetime.now().date() + timedelta(days=20),
                'is_featured': True,
                'status': 'ouvert',
            },
        ]

        for job_data in jobs_data:
            job, created = JobOffer.objects.get_or_create(
                slug=job_data['slug'],
                defaults=job_data
            )
            self.stdout.write(f'  Job Offer: {job.title} {"✓" if created else "existe"}')

        self.stdout.write(self.style.SUCCESS('\n✅ Données CMS créées avec succès!'))
