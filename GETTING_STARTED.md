# Guide de Démarrage - Mwolo Energy Systems

## Installation Rapide

### 1. Cloner le projet
```bash
git clone <repo-url>
cd mwolo-energy-systems
```

### 2. Créer l'environnement virtuel
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 3. Installer les dépendances
```bash
pip install -r requirements.txt
```

### 4. Configurer l'environnement
```bash
cp .env.example .env
# Éditer .env si nécessaire (par défaut SQLite pour le développement)
```

### 5. Créer les migrations
```bash
python manage.py migrate
```

### 6. Initialiser les données
```bash
python manage.py init_data
```

Cela va créer:
- Les rôles et permissions de base
- Un superadmin (admin/admin123)
- Les données géographiques de la RDC

### 7. Lancer le serveur
```bash
python manage.py runserver
```

L'application est maintenant accessible à:
- Admin: http://localhost:8000/admin/
- API: http://localhost:8000/api/
- Docs: http://localhost:8000/api/docs/

## Premiers Pas

### 1. Se connecter à l'admin
- URL: http://localhost:8000/admin/
- Username: `admin`
- Password: `admin123`

### 2. Créer une agence
1. Aller dans "Agences" → "Agences"
2. Cliquer sur "Ajouter une agence"
3. Remplir les informations:
   - Nom: "Agence Kinshasa"
   - Territoire: Sélectionner un territoire
   - Adresse: "123 Rue Test"
   - Téléphone: "+243123456789"
   - Email: "agency@example.com"
4. Sauvegarder

### 3. Créer un client
1. Aller dans "CRM" → "Clients"
2. Cliquer sur "Ajouter un client"
3. Remplir les informations personnelles
4. Sélectionner l'agence créée
5. Sauvegarder

### 4. Créer une facture
1. Aller dans "Facturation" → "Factures"
2. Cliquer sur "Ajouter une facture"
3. Sélectionner le client
4. Remplir les montants
5. Sauvegarder

### 5. Tester l'API
```bash
# Obtenir un token
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'

# Utiliser le token pour accéder à l'API
curl -X GET http://localhost:8000/api/crm/clients/ \
  -H "Authorization: Bearer <token>"
```

## Structure du Projet

```
mwolo-energy-systems/
├── config/              # Configuration Django
├── accounts/            # Gestion des utilisateurs
├── geo/                 # Géographie
├── agencies/            # Agences
├── hr/                  # RH
├── crm/                 # Clients
├── billing/             # Facturation
├── operations/          # Opérations
├── support/             # Support
├── cms/                 # CMS
├── core/                # Utilitaires
├── tests/               # Tests
├── manage.py
├── requirements.txt
├── .env.example
├── README.md
├── API_DOCUMENTATION.md
└── DEPLOYMENT.md
```

## Commandes Utiles

### Créer un superadmin
```bash
python manage.py createsuperuser
```

### Créer les migrations
```bash
python manage.py makemigrations
```

### Appliquer les migrations
```bash
python manage.py migrate
```

### Charger les données initiales
```bash
python manage.py init_data
```

### Lancer les tests
```bash
pytest
```

### Lancer les tests avec couverture
```bash
pytest --cov=.
```

### Lancer Celery (dans un autre terminal)
```bash
celery -A config worker -l info
```

### Lancer Celery Beat (pour les tâches planifiées)
```bash
celery -A config beat -l info
```

## Configuration PostgreSQL (Optionnel)

Si vous voulez utiliser PostgreSQL au lieu de SQLite:

### 1. Installer PostgreSQL
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql
```

### 2. Créer la base de données
```bash
sudo -u postgres createdb mwolo_db
sudo -u postgres createuser mwolo_user
sudo -u postgres psql -c "ALTER USER mwolo_user WITH PASSWORD 'password';"
sudo -u postgres psql -c "ALTER ROLE mwolo_user SET client_encoding TO 'utf8';"
sudo -u postgres psql -c "ALTER ROLE mwolo_user SET default_transaction_isolation TO 'read committed';"
sudo -u postgres psql -c "ALTER ROLE mwolo_user SET default_transaction_deferrable TO on;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE mwolo_db TO mwolo_user;"
```

### 3. Configurer .env
```
DB_ENGINE=django.db.backends.postgresql
DB_NAME=mwolo_db
DB_USER=mwolo_user
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
```

### 4. Installer le driver PostgreSQL
```bash
pip install psycopg2-binary
```

### 5. Exécuter les migrations
```bash
python manage.py migrate
```

## Configuration Redis (Optionnel)

Pour utiliser Celery avec Redis:

### 1. Installer Redis
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS
brew install redis
```

### 2. Démarrer Redis
```bash
# Ubuntu/Debian
sudo systemctl start redis-server

# macOS
redis-server
```

### 3. Configurer .env
```
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

## Troubleshooting

### Erreur: "ModuleNotFoundError: No module named 'django'"
```bash
# Assurez-vous que l'environnement virtuel est activé
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Erreur: "django.db.utils.OperationalError: no such table"
```bash
# Exécuter les migrations
python manage.py migrate
```

### Erreur: "ConnectionRefusedError" (PostgreSQL)
```bash
# Vérifier que PostgreSQL est en cours d'exécution
sudo systemctl status postgresql

# Vérifier les paramètres de connexion dans .env
```

### Erreur: "ConnectionRefusedError" (Redis)
```bash
# Vérifier que Redis est en cours d'exécution
redis-cli ping

# Démarrer Redis
redis-server
```

## Prochaines Étapes

1. Lire la [Documentation API](API_DOCUMENTATION.md)
2. Lire le [Guide de Déploiement](DEPLOYMENT.md)
3. Développer le frontend Next.js
4. Intégrer les paiements mobiles
5. Ajouter les tests

## Support

Pour toute question, consultez:
- [README.md](README.md)
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- [DEPLOYMENT.md](DEPLOYMENT.md)
