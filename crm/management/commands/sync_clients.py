"""
Commande pour synchroniser les utilisateurs avec les profils clients CRM.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Synchronise les utilisateurs clients avec les profils clients CRM'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Affiche ce qui serait fait sans effectuer de modifications',
        )
        parser.add_argument(
            '--user-id',
            type=int,
            help='ID utilisateur spécifique à synchroniser',
        )

    def handle(self, *args, **options):
        from crm.models import Client
        from crm.signals import link_user_to_client
        
        dry_run = options.get('dry_run', False)
        user_id = options.get('user_id')
        
        if dry_run:
            self.stdout.write(self.style.WARNING('=== MODE DRY-RUN ==='))
        
        # Obtenir les utilisateurs à traiter
        if user_id:
            users = User.objects.filter(id=user_id, role='client')
        else:
            users = User.objects.filter(role='client')
        
        total = users.count()
        linked = 0
        created = 0
        skipped = 0
        errors = 0
        
        self.stdout.write(f'\n📊 Utilisateurs clients à traiter: {total}')
        self.stdout.write('=' * 50)
        
        for user in users:
            try:
                # Vérifier si déjà lié
                has_client = Client.objects.filter(user=user).exists()
                
                if has_client:
                    skipped += 1
                    self.stdout.write(f'⏭️  {user.username}: déjà lié')
                    continue
                
                # Chercher correspondance par email
                existing_by_email = None
                if user.email:
                    existing_by_email = Client.objects.filter(
                        email__iexact=user.email, 
                        user__isnull=True
                    ).first()
                
                # Chercher correspondance par téléphone
                existing_by_phone = None
                if user.telephone and not existing_by_email:
                    existing_by_phone = Client.objects.filter(
                        telephone=user.telephone,
                        user__isnull=True
                    ).first()
                
                if existing_by_email:
                    if dry_run:
                        self.stdout.write(
                            f'🔗 {user.username}: serait lié au client {existing_by_email.numero_client} (email)'
                        )
                    else:
                        existing_by_email.user = user
                        existing_by_email.save(update_fields=['user'])
                        self.stdout.write(self.style.SUCCESS(
                            f'✅ {user.username}: lié au client {existing_by_email.numero_client} (email)'
                        ))
                    linked += 1
                    
                elif existing_by_phone:
                    if dry_run:
                        self.stdout.write(
                            f'🔗 {user.username}: serait lié au client {existing_by_phone.numero_client} (tél)'
                        )
                    else:
                        existing_by_phone.user = user
                        existing_by_phone.save(update_fields=['user'])
                        self.stdout.write(self.style.SUCCESS(
                            f'✅ {user.username}: lié au client {existing_by_phone.numero_client} (tél)'
                        ))
                    linked += 1
                    
                else:
                    if dry_run:
                        self.stdout.write(
                            f'➕ {user.username}: profil client serait créé'
                        )
                    else:
                        result = link_user_to_client(user)
                        if result:
                            self.stdout.write(self.style.SUCCESS(
                                f'✅ {user.username}: nouveau client créé ({result.numero_client})'
                            ))
                        else:
                            self.stdout.write(self.style.WARNING(
                                f'⚠️  {user.username}: impossible de créer (non client?)'
                            ))
                    created += 1
                    
            except Exception as e:
                errors += 1
                self.stdout.write(self.style.ERROR(
                    f'❌ {user.username}: erreur - {str(e)}'
                ))
        
        # Résumé
        self.stdout.write('\n' + '=' * 50)
        self.stdout.write(self.style.SUCCESS('\n📋 RÉSUMÉ:'))
        self.stdout.write(f'   Total traités: {total}')
        self.stdout.write(f'   Déjà liés (ignorés): {skipped}')
        self.stdout.write(f'   Liés à existants: {linked}')
        self.stdout.write(f'   Nouveaux créés: {created}')
        if errors:
            self.stdout.write(self.style.ERROR(f'   Erreurs: {errors}'))
        
        if dry_run:
            self.stdout.write(self.style.WARNING(
                '\n⚠️  Mode dry-run: aucune modification effectuée'
            ))
            self.stdout.write('   Relancez sans --dry-run pour appliquer')
