# FAQ - Questions Fréquemment Posées

## Installation et Configuration

### Q: Comment installer le projet?
A: Suivez le guide [GETTING_STARTED.md](GETTING_STARTED.md)

### Q: Quelle version de Python est requise?
A: Python 3.10 ou supérieur

### Q: Puis-je utiliser SQLite en production?
A: Non, utilisez PostgreSQL en production

### Q: Comment configurer PostgreSQL?
A: Voir [CONFIGURATION.md](CONFIGURATION.md)

### Q: Comment configurer Redis?
A: Voir [CONFIGURATION.md](CONFIGURATION.md)

## Développement

### Q: Comment lancer le serveur?
A: `python manage.py runserver`

### Q: Comment créer les migrations?
A: `python manage.py makemigrations`

### Q: Comment appliquer les migrations?
A: `python manage.py migrate`

### Q: Comment initialiser les données?
A: `python manage.py init_data`

### Q: Comment lancer les tests?
A: `pytest` ou `python manage.py test`

### Q: Comment lancer Celery?
A: `celery -A config worker -l info`

### Q: Comment lancer Celery Beat?
A: `celery -A config beat -l info`

## API

### Q: Comment obtenir un token JWT?
A: `POST /api/auth/login/` avec username et password

### Q: Comment utiliser le token?
A: Ajouter `Authorization: Bearer <token>` dans les headers

### Q: Comment renouveler le token?
A: `POST /api/auth/refresh/` avec le refresh token

### Q: Où trouver la documentation API?
A: `http://localhost:8000/api/docs/`

### Q: Comment filtrer les résultats?
A: `GET /api/crm/clients/?status=actif&agency=123`

### Q: Comment rechercher?
A: `GET /api/crm/clients/?search=dupont`

### Q: Comment trier?
A: `GET /api/crm/clients/?ordering=-created_at`

### Q: Comment paginer?
A: `GET /api/crm/clients/?page=1&page_size=20`

## Permissions

### Q: Quels sont les rôles disponibles?
A: Super Admin, Admin, RH, Comptable, Opérations, Agent Commercial, Employé, Client

### Q: Comment ajouter une permission?
A: Utiliser l'admin Jazzmin ou créer une instance de Permission

### Q: Comment vérifier les permissions?
A: Les permissions sont vérifiées automatiquement par les viewsets

### Q: Comment créer un rôle personnalisé?
A: Ajouter un nouveau rôle dans User.ROLE_CHOICES et créer les permissions

## Facturation

### Q: Comment créer une facture?
A: `POST /api/billing/invoices/` avec les données requises

### Q: Comment générer le PDF?
A: Le PDF est généré automatiquement lors de la validation

### Q: Comment enregistrer un paiement?
A: `POST /api/billing/payments/` avec les données du paiement

### Q: Comment les relances sont-elles envoyées?
A: Automatiquement par Celery selon le planning

### Q: Comment modifier une facture?
A: Seules les factures en brouillon peuvent être modifiées

## RH

### Q: Comment créer un employé?
A: `POST /api/hr/employees/` avec les données requises

### Q: Comment gérer les congés?
A: `POST /api/hr/leaves/` pour demander un congé

### Q: Comment approuver un congé?
A: Utiliser l'admin Jazzmin ou l'API

### Q: Comment enregistrer une présence?
A: `POST /api/hr/attendance/` avec la date et le statut

### Q: Comment générer un bulletin de paie?
A: `POST /api/hr/payroll/` avec les données du mois

## CRM

### Q: Comment créer un client?
A: `POST /api/crm/clients/` avec les données requises

### Q: Comment créer un site client?
A: `POST /api/crm/sites/` avec les données du site

### Q: Comment créer un contrat?
A: `POST /api/crm/contracts/` avec les données du contrat

### Q: Comment filtrer les clients par agence?
A: `GET /api/crm/clients/?agency=123`

## Opérations

### Q: Comment créer un équipement?
A: `POST /api/operations/equipment/` avec les données requises

### Q: Comment créer un compteur?
A: `POST /api/operations/meters/` avec les données du compteur

### Q: Comment enregistrer un relevé?
A: `POST /api/operations/meter-readings/` avec la valeur du relevé

### Q: Comment désactiver le service?
A: Appeler `meter.deactivate_service()` ou utiliser l'API

## Support

### Q: Comment créer un ticket?
A: `POST /api/support/tickets/` avec le sujet et la description

### Q: Comment ajouter un message?
A: `POST /api/support/tickets/{id}/message/` avec le message

### Q: Comment joindre un fichier?
A: Utiliser le formulaire multipart avec le fichier

### Q: Comment fermer un ticket?
A: Changer le statut à "fermé"

## CMS

### Q: Comment créer une page?
A: Utiliser l'admin Jazzmin ou `POST /api/cms/pages/`

### Q: Comment créer un article?
A: Utiliser l'admin Jazzmin ou `POST /api/cms/posts/`

### Q: Comment ajouter une image?
A: Utiliser le champ image dans l'admin

### Q: Comment créer un lead?
A: `POST /api/cms/leads/` avec les données du formulaire

## Déploiement

### Q: Comment déployer en production?
A: Voir [DEPLOYMENT.md](DEPLOYMENT.md)

### Q: Comment utiliser Docker?
A: `docker-compose up -d`

### Q: Comment configurer Nginx?
A: Voir [DEPLOYMENT.md](DEPLOYMENT.md)

### Q: Comment configurer SSL?
A: Utiliser Certbot: `sudo certbot --nginx -d your-domain.com`

### Q: Comment sauvegarder la base de données?
A: `pg_dump -U postgres mwolo_db > backup.sql`

### Q: Comment restaurer la base de données?
A: `psql -U postgres mwolo_db < backup.sql`

## Sécurité

### Q: Comment changer le SECRET_KEY?
A: Générer une nouvelle clé et la mettre dans .env

### Q: Comment activer 2FA?
A: À implémenter avec django-otp

### Q: Comment vérifier les vulnérabilités?
A: `safety check`

### Q: Comment configurer le firewall?
A: Voir [SECURITY.md](SECURITY.md)

### Q: Comment monitorer la sécurité?
A: Utiliser Sentry ou New Relic

## Performance

### Q: Comment optimiser les performances?
A: Voir [PERFORMANCE.md](PERFORMANCE.md)

### Q: Comment utiliser le caching?
A: Utiliser Redis avec Django cache framework

### Q: Comment profiler le code?
A: Utiliser Django Debug Toolbar ou cProfile

### Q: Comment tester les performances?
A: Utiliser Apache Bench ou Wrk

### Q: Comment monitorer les performances?
A: Utiliser New Relic ou Prometheus

## Tests

### Q: Comment lancer les tests?
A: `pytest` ou `python manage.py test`

### Q: Comment générer un rapport de couverture?
A: `pytest --cov=. --cov-report=html`

### Q: Quelle est la couverture cible?
A: Minimum 80% de couverture globale

### Q: Comment ajouter des tests?
A: Voir [TESTING.md](TESTING.md)

## Troubleshooting

### Q: Erreur "ModuleNotFoundError: No module named 'django'"
A: Installer les dépendances: `pip install -r requirements.txt`

### Q: Erreur "django.db.utils.OperationalError: no such table"
A: Exécuter les migrations: `python manage.py migrate`

### Q: Erreur "ConnectionRefusedError" (PostgreSQL)
A: Vérifier que PostgreSQL est en cours d'exécution

### Q: Erreur "ConnectionRefusedError" (Redis)
A: Vérifier que Redis est en cours d'exécution

### Q: Erreur "Port already in use"
A: Utiliser un autre port: `python manage.py runserver 8001`

### Q: Erreur "Permission denied"
A: Vérifier les permissions des fichiers

## Support

### Q: Où trouver de l'aide?
A: Consulter la documentation ou ouvrir une issue

### Q: Comment signaler un bug?
A: Ouvrir une issue avec une description détaillée

### Q: Comment proposer une fonctionnalité?
A: Ouvrir une issue avec la description de la fonctionnalité

### Q: Comment contribuer?
A: Voir [CONTRIBUTING.md](CONTRIBUTING.md)

## Ressources

### Q: Où trouver la documentation Django?
A: https://docs.djangoproject.com/

### Q: Où trouver la documentation DRF?
A: https://www.django-rest-framework.org/

### Q: Où trouver la documentation Celery?
A: https://docs.celeryproject.org/

### Q: Où trouver la documentation PostgreSQL?
A: https://www.postgresql.org/docs/

### Q: Où trouver la documentation Redis?
A: https://redis.io/docs/

## Autres Questions?

Si vous avez d'autres questions, n'hésitez pas à:
- Consulter la documentation
- Ouvrir une issue
- Contacter l'équipe de développement
