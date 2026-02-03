# Résumé du Projet - Mwolo Energy Systems

## Vue d'ensemble

Mwolo Energy Systems est une plateforme web complète pour la gestion d'une entreprise d'énergie. Elle comprend:

- **Site vitrine dynamique** (CMS contrôlé depuis Django)
- **Back-office employés** (dashboard, RH, opérations, facturation)
- **Portail clients** (compte, factures, paiements, support)
- **Gestion complète** des rôles, permissions, audit et sécurité

## Architecture

### Backend
- Django 4.2 + Django REST Framework
- PostgreSQL (production) / SQLite (développement)
- Redis + Celery (tâches asynchrones)
- JWT (authentification)
- Jazzmin (admin interface)

### Frontend (À développer)
- Next.js (portail employés + clients + vitrine)
- Consomme l'API Django

### Infrastructure
- Docker + Docker Compose
- Nginx (reverse proxy)
- Gunicorn (application server)
- Certbot (SSL)

## Modules

### 1. Accounts (Comptes)
- Gestion des utilisateurs avec rôles
- Permissions par module et action
- Audit logs de toutes les actions sensibles
- Support JWT

**Rôles:**
- Super Admin
- Admin
- RH
- Comptable
- Opérations
- Agent Commercial
- Employé
- Client

### 2. Geo (Géographie)
- Hiérarchie: Pays → Provinces → Communes → Territoires
- Validation des dépendances
- Données initiales pour la RDC

### 3. Agencies (Agences)
- Agences géolocalisées
- Codes auto-générés
- Responsables assignés
- Lien avec les employés et clients

### 4. HR (Ressources Humaines)
- Dossiers employés complets
- Gestion des congés avec workflow
- Présences et pointages
- Bulletins de paie
- Évaluations (optionnel)

### 5. CRM (Gestion des Clients)
- Gestion des clients
- Sites/installations clients
- Contrats et abonnements
- Historique des interactions

### 6. Billing (Facturation)
- Factures avec statuts
- Paiements partiels
- Relances automatiques (Celery)
- Génération PDF
- Support des paiements mobiles

### 7. Operations (Opérations)
- Gestion des équipements
- Compteurs avec liaison service
- Relevés de compteur
- Interventions de maintenance
- Désactivation automatique du service

### 8. Support (Support Clients)
- Tickets clients
- Messages et pièces jointes
- Priorités et assignation
- Historique des interactions

### 9. CMS (Contenu)
- Pages dynamiques
- Blog/Actualités
- Services
- Galeries
- Témoignages
- Leads (formulaire contact)

### 10. Core (Utilitaires)
- Paramètres système
- Gestion des documents
- Configurations globales

## Fonctionnalités Clés

### Sécurité
- JWT avec refresh tokens
- RBAC (Role-Based Access Control)
- Audit logs obligatoires
- Validation serveur stricte
- CORS configuré
- SSL/TLS en production

### Performances
- Pagination sur toutes les listes
- Filtres et recherche
- Caching avec Redis
- Tâches asynchrones avec Celery
- Indexes sur les tables principales

### Scalabilité
- Architecture modulaire
- Séparation des responsabilités
- API RESTful
- Support du déploiement Docker
- Configuration pour production

### Intégrations
- Paiements mobiles (MPSA, Airtel Money, Vodacom)
- Compteurs IoT (liaison service)
- Email/SMS (Celery)
- Génération PDF (ReportLab, WeasyPrint)

## API Endpoints

### Auth
- `POST /api/auth/login/`
- `POST /api/auth/refresh/`

### Geo
- `GET /api/geo/countries/`
- `GET /api/geo/provinces/?country=ID`
- `GET /api/geo/communes/?province=ID`
- `GET /api/geo/territories/?commune=ID`

### Agencies
- `GET/POST /api/agencies/`
- `GET/PUT/PATCH/DELETE /api/agencies/{id}/`

### HR
- `GET/POST /api/hr/employees/`
- `GET/POST /api/hr/leaves/`
- `GET/POST /api/hr/attendance/`
- `GET/POST /api/hr/payroll/`

### CRM
- `GET/POST /api/crm/clients/`
- `GET/POST /api/crm/sites/`
- `GET/POST /api/crm/contracts/`

### Billing
- `GET/POST /api/billing/invoices/`
- `GET/POST /api/billing/payments/`

### Operations
- `GET/POST /api/operations/equipment/`
- `GET/POST /api/operations/meters/`
- `GET/POST /api/operations/interventions/`

### Support
- `GET/POST /api/support/tickets/`

### CMS
- `GET /api/cms/pages/`
- `GET /api/cms/posts/`
- `GET /api/cms/services/`
- `POST /api/cms/leads/`

## Tâches Celery

- Génération PDF factures
- Relances automatiques (email/SMS)
- Rapports
- Notifications
- Désactivation du service (compteur)

## Données Initiales

### Rôles et Permissions
- Super Admin (accès complet)
- Admin (accès complet sauf paramètres système)
- RH (module RH + lecture CRM)
- Comptable (facturation + lecture CRM)
- Opérations (opérations + lecture CRM)
- Agent Commercial (CRM + lecture facturation)
- Employé (lecture RH)
- Client (lecture facturation + support)

### Géographie (RDC)
- 1 Pays
- 8 Provinces
- Communes et Territoires (à compléter)

### Utilisateurs
- Superadmin (admin/admin123)

## Fichiers Importants

- `README.md` - Documentation générale
- `GETTING_STARTED.md` - Guide de démarrage
- `API_DOCUMENTATION.md` - Documentation API
- `DEPLOYMENT.md` - Guide de déploiement
- `FIXTURES.md` - Données initiales
- `requirements.txt` - Dépendances Python
- `.env.example` - Variables d'environnement
- `docker-compose.yml` - Configuration Docker
- `Dockerfile` - Image Docker
- `gunicorn_config.py` - Configuration Gunicorn

## Prochaines Étapes

### Phase 1 (Actuelle)
- ✅ Structure Django complète
- ✅ Modèles de données
- ✅ Admin Jazzmin
- ✅ API DRF de base
- ✅ Authentification JWT
- ✅ Permissions RBAC
- ✅ Audit logs
- ⏳ Tests unitaires

### Phase 2
- Frontend Next.js
- Portail employés
- Portail clients
- Site vitrine

### Phase 3
- Intégration paiements mobiles
- Liaison compteurs IoT
- Génération PDF avancée
- SMS/Email notifications

### Phase 4
- Optimisations performances
- Monitoring et logging
- Backup et disaster recovery
- Documentation complète

## Commandes Utiles

```bash
# Installation
pip install -r requirements.txt

# Migrations
python manage.py migrate
python manage.py init_data

# Développement
python manage.py runserver

# Tests
pytest

# Celery
celery -A config worker -l info
celery -A config beat -l info

# Docker
docker-compose up -d
docker-compose exec web python manage.py migrate
```

## Support et Documentation

- [README.md](README.md) - Documentation générale
- [GETTING_STARTED.md](GETTING_STARTED.md) - Guide de démarrage
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - Documentation API
- [DEPLOYMENT.md](DEPLOYMENT.md) - Guide de déploiement
- [FIXTURES.md](FIXTURES.md) - Données initiales

## Licence

À définir

## Contact

Pour toute question, contactez l'équipe de développement.
