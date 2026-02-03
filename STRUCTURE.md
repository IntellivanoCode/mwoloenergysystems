# Structure du Projet

## Arborescence Complète

```
mwolo-energy-systems/
│
├── config/                          # Configuration Django
│   ├── __init__.py
│   ├── settings.py                  # Settings principaux
│   ├── settings_dev.py              # Settings développement
│   ├── settings_prod.py             # Settings production
│   ├── settings_test.py             # Settings tests
│   ├── urls.py                      # URLs principales
│   ├── wsgi.py                      # WSGI application
│   └── celery.py                    # Configuration Celery
│
├── accounts/                        # Gestion des utilisateurs
│   ├── migrations/
│   ├── management/
│   │   └── commands/
│   │       └── init_data.py         # Initialiser les données
│   ├── models.py                    # User, Permission, AuditLog
│   ├── views.py                     # Vues API
│   ├── serializers.py               # Serializers
│   ├── urls.py                      # URLs
│   ├── admin.py                     # Admin Jazzmin
│   ├── permissions.py               # Permissions personnalisées
│   ├── apps.py
│   └── tests.py
│
├── geo/                             # Géographie
│   ├── migrations/
│   ├── models.py                    # Country, Province, Commune, Territory
│   ├── views.py                     # Vues API
│   ├── serializers.py               # Serializers
│   ├── urls.py                      # URLs
│   ├── admin.py                     # Admin Jazzmin
│   ├── apps.py
│   └── tests.py
│
├── agencies/                        # Agences
│   ├── migrations/
│   ├── models.py                    # Agency
│   ├── views.py                     # Vues API
│   ├── serializers.py               # Serializers
│   ├── urls.py                      # URLs
│   ├── admin.py                     # Admin Jazzmin
│   ├── apps.py
│   └── tests.py
│
├── hr/                              # Ressources Humaines
│   ├── migrations/
│   ├── models.py                    # Employee, Leave, Attendance, Payroll
│   ├── views.py                     # Vues API
│   ├── serializers.py               # Serializers
│   ├── urls.py                      # URLs
│   ├── admin.py                     # Admin Jazzmin
│   ├── apps.py
│   └── tests.py
│
├── crm/                             # Gestion des Clients
│   ├── migrations/
│   ├── models.py                    # Client, Site, Contract
│   ├── views.py                     # Vues API
│   ├── serializers.py               # Serializers
│   ├── urls.py                      # URLs
│   ├── admin.py                     # Admin Jazzmin
│   ├── apps.py
│   └── tests.py
│
├── billing/                         # Facturation
│   ├── migrations/
│   ├── models.py                    # Invoice, Payment, Reminder
│   ├── views.py                     # Vues API
│   ├── serializers.py               # Serializers
│   ├── urls.py                      # URLs
│   ├── admin.py                     # Admin Jazzmin
│   ├── tasks.py                     # Tâches Celery
│   ├── apps.py
│   └── tests.py
│
├── operations/                      # Opérations
│   ├── migrations/
│   ├── models.py                    # Equipment, Meter, Intervention
│   ├── views.py                     # Vues API
│   ├── serializers.py               # Serializers
│   ├── urls.py                      # URLs
│   ├── admin.py                     # Admin Jazzmin
│   ├── apps.py
│   └── tests.py
│
├── support/                         # Support Clients
│   ├── migrations/
│   ├── models.py                    # Ticket, TicketMessage
│   ├── views.py                     # Vues API
│   ├── serializers.py               # Serializers
│   ├── urls.py                      # URLs
│   ├── admin.py                     # Admin Jazzmin
│   ├── apps.py
│   └── tests.py
│
├── cms/                             # Contenu (CMS)
│   ├── migrations/
│   ├── models.py                    # Page, BlogPost, Service, Lead
│   ├── views.py                     # Vues API
│   ├── serializers.py               # Serializers
│   ├── urls.py                      # URLs
│   ├── admin.py                     # Admin Jazzmin
│   ├── apps.py
│   └── tests.py
│
├── core/                            # Utilitaires
│   ├── migrations/
│   ├── models.py                    # SystemParameter, Document
│   ├── views.py                     # Vues API
│   ├── serializers.py               # Serializers
│   ├── admin.py                     # Admin Jazzmin
│   ├── apps.py
│   └── tests.py
│
├── tests/                           # Tests
│   ├── __init__.py
│   ├── conftest.py                  # Fixtures Pytest
│   ├── test_auth.py                 # Tests authentification
│   ├── test_billing.py              # Tests facturation
│   └── ...
│
├── templates/                       # Templates Django (optionnel)
│   └── ...
│
├── media/                           # Fichiers uploadés
│   ├── users/
│   ├── clients/
│   ├── invoices/
│   └── ...
│
├── staticfiles/                     # Fichiers statiques collectés
│   └── ...
│
├── logs/                            # Fichiers de log
│   ├── django.log
│   ├── celery.log
│   └── ...
│
├── .env.example                     # Template variables d'environnement
├── .env.production                  # Variables production
├── .gitignore                       # Fichiers à ignorer
├── manage.py                        # Commandes Django
├── requirements.txt                 # Dépendances Python
├── pytest.ini                       # Configuration Pytest
├── gunicorn_config.py               # Configuration Gunicorn
├── docker-compose.yml               # Configuration Docker Compose
├── Dockerfile                       # Image Docker
│
├── README.md                        # Documentation générale
├── GETTING_STARTED.md               # Guide de démarrage
├── API_DOCUMENTATION.md             # Documentation API
├── DEPLOYMENT.md                    # Guide de déploiement
├── CONFIGURATION.md                 # Guide de configuration
├── SECURITY.md                      # Guide de sécurité
├── PERFORMANCE.md                   # Guide de performance
├── TESTING.md                       # Guide de test
├── CONTRIBUTING.md                  # Guide de contribution
├── DEVELOPMENT_NOTES.md             # Notes de développement
├── MANAGEMENT_COMMANDS.md           # Commandes de gestion
├── FIXTURES.md                      # Données initiales
├── PROJECT_SUMMARY.md               # Résumé du projet
├── STRUCTURE.md                     # Cette structure
├── CHANGELOG.md                     # Historique des changements
├── FAQ.md                           # Questions fréquentes
└── LICENSE                          # Licence MIT
```

## Modules Django

### 1. accounts (Comptes)
- Gestion des utilisateurs
- Rôles et permissions
- Audit logs
- Authentification JWT

### 2. geo (Géographie)
- Pays
- Provinces
- Communes
- Territoires

### 3. agencies (Agences)
- Agences géolocalisées
- Codes auto-générés
- Responsables

### 4. hr (RH)
- Employés
- Congés
- Présences
- Paie

### 5. crm (CRM)
- Clients
- Sites
- Contrats

### 6. billing (Facturation)
- Factures
- Paiements
- Relances

### 7. operations (Opérations)
- Équipements
- Compteurs
- Interventions

### 8. support (Support)
- Tickets
- Messages
- Pièces jointes

### 9. cms (Contenu)
- Pages
- Articles
- Services
- Leads

### 10. core (Utilitaires)
- Paramètres système
- Documents

## Fichiers de Configuration

### Django
- `config/settings.py` - Configuration principale
- `config/settings_dev.py` - Développement
- `config/settings_prod.py` - Production
- `config/settings_test.py` - Tests
- `config/urls.py` - URLs principales
- `config/wsgi.py` - WSGI application
- `config/celery.py` - Celery

### Environnement
- `.env.example` - Template
- `.env.production` - Production
- `.gitignore` - Fichiers à ignorer

### Docker
- `docker-compose.yml` - Services
- `Dockerfile` - Image

### Autres
- `requirements.txt` - Dépendances
- `pytest.ini` - Pytest
- `gunicorn_config.py` - Gunicorn
- `manage.py` - Commandes Django

## Documentation

### Guides
- `README.md` - Vue d'ensemble
- `GETTING_STARTED.md` - Démarrage rapide
- `DEPLOYMENT.md` - Déploiement
- `CONFIGURATION.md` - Configuration
- `SECURITY.md` - Sécurité
- `PERFORMANCE.md` - Performance
- `TESTING.md` - Tests
- `CONTRIBUTING.md` - Contribution

### Références
- `API_DOCUMENTATION.md` - API
- `MANAGEMENT_COMMANDS.md` - Commandes
- `FIXTURES.md` - Données
- `DEVELOPMENT_NOTES.md` - Notes
- `PROJECT_SUMMARY.md` - Résumé
- `STRUCTURE.md` - Structure
- `CHANGELOG.md` - Historique
- `FAQ.md` - Questions

## Fichiers Spéciaux

### Migrations
- Créées automatiquement par Django
- Stockées dans `app/migrations/`
- Appliquées avec `python manage.py migrate`

### Tests
- Stockés dans `tests/`
- Exécutés avec `pytest`
- Couverture avec `pytest --cov=.`

### Logs
- Stockés dans `logs/`
- Django: `logs/django.log`
- Celery: `logs/celery.log`

### Media
- Fichiers uploadés
- Stockés dans `media/`
- Organisés par type

### Static
- Fichiers statiques collectés
- Stockés dans `staticfiles/`
- Collectés avec `python manage.py collectstatic`

## Conventions de Nommage

### Fichiers
- `models.py` - Modèles
- `views.py` - Vues API
- `serializers.py` - Serializers
- `urls.py` - URLs
- `admin.py` - Admin
- `tests.py` - Tests
- `tasks.py` - Tâches Celery
- `permissions.py` - Permissions

### Dossiers
- `migrations/` - Migrations
- `management/` - Commandes
- `templates/` - Templates
- `static/` - Fichiers statiques
- `media/` - Fichiers uploadés
- `tests/` - Tests

## Hiérarchie des Dépendances

```
accounts (User)
    ↓
geo (Country, Province, Commune, Territory)
    ↓
agencies (Agency)
    ↓
hr (Employee)
crm (Client, Site, Contract)
    ↓
billing (Invoice, Payment)
operations (Equipment, Meter)
support (Ticket)
    ↓
cms (Page, BlogPost, Service, Lead)
core (SystemParameter, Document)
```

## Taille Estimée

- Code Python: ~5000 lignes
- Tests: ~1000 lignes
- Documentation: ~10000 lignes
- Configuration: ~500 lignes
- Total: ~16500 lignes

## Prochaines Étapes

1. Créer les migrations
2. Initialiser les données
3. Développer le frontend
4. Ajouter les tests
5. Déployer en production
