# Guide de démarrage complet - Mwolo Energy Systems

## Prérequis

- Python 3.10+
- Node.js 18+
- MySQL 8.0+
- Git

## Installation et démarrage

### 1. Backend Django

#### Étape 1: Activer l'environnement virtuel
```bash
cd mwolo-energy-systems

# Windows
venv\Scripts\activate

# Linux/macOS
source venv/bin/activate
```

#### Étape 2: Installer les dépendances
```bash
pip install -r requirements.txt
```

#### Étape 3: Configurer la base de données
Vérifier que `.env` contient les bonnes credentials MySQL:
```
DB_ENGINE=django.db.backends.mysql
DB_NAME=mwoloenerysystems
DB_USER=root
DB_PASSWORD=14041999No@
DB_HOST=localhost
DB_PORT=3306
```

#### Étape 4: Appliquer les migrations
```bash
python manage.py migrate
```

#### Étape 5: Peupler les données par défaut
```bash
python manage.py populate_data
```

#### Étape 6: Créer un superutilisateur (optionnel)
```bash
python manage.py createsuperuser
```

#### Étape 7: Démarrer le serveur Django
```bash
python manage.py runserver
```

Le serveur Django sera accessible à: `http://localhost:8000`
L'admin sera accessible à: `http://localhost:8000/mwoloboss/`

### 2. Frontend Next.js

#### Étape 1: Accéder au dossier frontend
```bash
cd frontend
```

#### Étape 2: Installer les dépendances
```bash
npm install
```

#### Étape 3: Configurer les variables d'environnement
Créer/vérifier le fichier `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

#### Étape 4: Démarrer le serveur de développement
```bash
npm run dev
```

Le frontend sera accessible à: `http://localhost:3000`

## Accès aux applications

### Site Vitrine
- **URL**: http://localhost:3000
- **Pages**:
  - Accueil: `/`
  - À propos: `/about`
  - Services: `/services`
  - Agences: `/agencies`
  - Équipe: `/equipment`
  - Actualités: `/news`
  - Contact: `/contact`

### Tableaux de bord
- **Client**: http://localhost:3000/dashboard
- **Employé**: http://localhost:3000/employee-dashboard
- **Administrateur**: http://localhost:3000/admin-dashboard

### Admin Django
- **URL**: http://localhost:8000/mwoloboss/
- **Identifiants**: admin / admin123

## Données de test

### Utilisateurs par défaut

#### Admin
- Email: admin@mwolo.energy
- Mot de passe: admin123
- Rôle: Administrateur

#### Client
- Email: client@mwolo.energy
- Mot de passe: client123
- Rôle: Client

#### Employé
- Email: employee@mwolo.energy
- Mot de passe: employee123
- Rôle: Employé

### Données peuplées
- 5 services
- 4 témoignages
- 4 partenaires
- 4 articles de blog
- Paramètres du site

## Commandes utiles

### Django

```bash
# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Peupler les données
python manage.py populate_data

# Initialiser les données de base
python manage.py init_data

# Créer un superutilisateur
python manage.py createsuperuser

# Lancer les tests
python manage.py test

# Lancer le serveur
python manage.py runserver

# Lancer Celery (pour les tâches asynchrones)
celery -A config worker -l info
```

### Frontend

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Construire pour la production
npm run build

# Lancer la version production
npm run start

# Linter le code
npm run lint
```

## Dépannage

### Erreur de connexion à la base de données
- Vérifier que MySQL est en cours d'exécution
- Vérifier les credentials dans `.env`
- Vérifier que la base de données existe

### Erreur CORS
- Vérifier que `CORS_ALLOWED_ORIGINS` est configuré dans Django
- Vérifier que le frontend utilise la bonne URL API

### Erreur d'authentification
- Vérifier que le token JWT est valide
- Vérifier que l'utilisateur existe en base de données
- Vérifier les logs du navigateur (F12)

### Erreur de chargement des données
- Vérifier que les endpoints Django sont accessibles
- Vérifier que les données existent en base de données
- Vérifier les logs du serveur Django

## Architecture

```
mwolo-energy-systems/
├── config/                 # Configuration Django
├── accounts/              # Module utilisateurs
├── agencies/              # Module agences
├── billing/               # Module facturation
├── cms/                   # Module CMS
├── core/                  # Module core
├── crm/                   # Module CRM
├── geo/                   # Module géographie
├── hr/                    # Module RH
├── operations/            # Module opérations
├── support/               # Module support
├── frontend/              # Application Next.js
│   ├── src/
│   │   ├── app/          # Pages
│   │   ├── components/   # Composants
│   │   └── lib/          # Utilitaires
│   └── package.json
├── manage.py
├── requirements.txt
└── README.md
```

## Environnements

### Développement
```bash
# Backend
python manage.py runserver

# Frontend
npm run dev
```

### Production
```bash
# Backend
gunicorn config.wsgi:application --bind 0.0.0.0:8000

# Frontend
npm run build && npm run start
```

## Documentation

- **Backend**: Voir `API_DOCUMENTATION.md`
- **Frontend**: Voir `frontend/README.md`
- **Tableaux de bord**: Voir `DASHBOARDS_GUIDE.md`
- **Configuration**: Voir `CONFIGURATION.md`
- **Déploiement**: Voir `DEPLOYMENT.md`

## Support

Pour toute question ou problème:
- Email: support@mwolo.energy
- Téléphone: +243 123 456 789
- Adresse: Kinshasa, RDC

## Licence

Voir `LICENSE` pour plus de détails.
