# Mwolo Energy Systems

Plateforme web complète pour la gestion d'une entreprise d'énergie avec site vitrine, back-office employés et portail clients.

## Stack Technique

- **Backend**: Django 4.2 + Django REST Framework
- **Admin**: Jazzmin
- **Base de données**: PostgreSQL
- **Cache/Queue**: Redis + Celery
- **Frontend**: Next.js (à développer)
- **Auth**: JWT (SimpleJWT)

## Installation

### Prérequis

- Python 3.10+
- PostgreSQL 12+
- Redis 6+
- Node.js 18+ (pour le frontend)

### Setup Backend

1. Cloner le repo et créer un environnement virtuel:
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. Installer les dépendances:
```bash
pip install -r requirements.txt
```

3. Configurer les variables d'environnement:
```bash
cp .env.example .env
# Éditer .env avec vos paramètres
```

4. Créer les migrations et la base de données:
```bash
python manage.py migrate
```

5. Créer un superadmin:
```bash
python manage.py createsuperuser
```

6. Charger les données initiales (géographie):
```bash
python manage.py loaddata geo_data  # À créer
```

7. Lancer le serveur:
```bash
python manage.py runserver
```

L'admin Jazzmin est accessible à: `http://localhost:8000/admin/`

## Structure du Projet

```
mwolo-energy-systems/
├── config/              # Configuration Django
├── accounts/            # Gestion des utilisateurs et permissions
├── geo/                 # Géographie (Pays, Provinces, Communes, Territoires)
├── agencies/            # Agences
├── hr/                  # Ressources Humaines
├── crm/                 # Gestion des clients
├── billing/             # Facturation et paiements
├── operations/          # Opérations (équipements, compteurs)
├── support/             # Support clients (tickets)
├── cms/                 # Contenu du site vitrine
├── core/                # Utilitaires et configurations globales
└── manage.py
```

## Modules Principaux

### Accounts
- Gestion des utilisateurs avec rôles (Super Admin, Admin, RH, Comptable, etc.)
- Permissions par module et action
- Audit logs de toutes les actions sensibles

### Geo
- Hiérarchie: Pays → Provinces → Communes → Territoires
- Validation des dépendances

### Agencies
- Agences géolocalisées
- Codes auto-générés
- Responsables assignés

### HR
- Dossiers employés complets
- Gestion des congés avec workflow
- Présences et pointages
- Bulletins de paie

### CRM
- Gestion des clients
- Sites/installations clients
- Contrats et abonnements

### Billing
- Factures avec statuts
- Paiements partiels
- Relances automatiques
- Génération PDF

### Operations
- Gestion des équipements
- Compteurs avec liaison service
- Relevés de compteur
- Interventions de maintenance

### Support
- Tickets clients
- Messages et pièces jointes
- Priorités et assignation

### CMS
- Pages dynamiques
- Blog/Actualités
- Services
- Galeries
- Témoignages
- Leads (formulaire contact)

## API Endpoints

### Auth
- `POST /api/auth/login/` - Connexion
- `POST /api/auth/refresh/` - Renouveler token
- `POST /api/auth/logout/` - Déconnexion

### Geo
- `GET /api/geo/countries/`
- `GET /api/geo/provinces/?country=ID`
- `GET /api/geo/communes/?province=ID`
- `GET /api/geo/territories/?commune=ID`

### HR
- `GET/POST /api/hr/employees/`
- `GET/PUT /api/hr/employees/{id}/`
- `POST /api/hr/leaves/`
- `POST /api/hr/leaves/{id}/approve/`

### CRM
- `GET/POST /api/crm/clients/`
- `GET/POST /api/crm/sites/`

### Billing
- `GET/POST /api/billing/invoices/`
- `POST /api/billing/invoices/{id}/validate/`
- `GET /api/billing/invoices/{id}/pdf/`
- `POST /api/billing/payments/`

### Support
- `GET/POST /api/support/tickets/`
- `POST /api/support/tickets/{id}/message/`

### CMS
- `GET /api/cms/pages/?slug=...`
- `GET /api/cms/posts/`

## Sécurité

- JWT avec refresh tokens
- RBAC (Role-Based Access Control)
- Audit logs obligatoires
- Validation serveur stricte
- CORS configuré

## Déploiement

### Docker

```bash
docker-compose up -d
```

Voir `docker-compose.yml` pour la configuration.

## Tâches Celery

- Génération PDF factures
- Relances automatiques (email/SMS)
- Rapports
- Notifications

## Prochaines Étapes

1. Créer les serializers DRF
2. Implémenter les viewsets et permissions
3. Développer le frontend Next.js
4. Intégrer les paiements mobiles (MPSA, Airtel Money)
5. Implémenter la liaison compteurs IoT
6. Ajouter les tests

## Support

Pour toute question, contactez l'équipe de développement.
