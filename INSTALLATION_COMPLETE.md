# Installation Complète - Mwolo Energy Systems

## Commandes Complètes (Copier-Coller)

### Windows

```bash
# 1. Créer l'environnement virtuel
python -m venv venv

# 2. Activer l'environnement virtuel
venv\Scripts\activate

# 3. Installer les dépendances
pip install -r requirements.txt

# 4. Appliquer les migrations
python manage.py migrate

# 5. Initialiser les données
python manage.py init_data

# 6. Lancer le serveur
python manage.py runserver
```

### Linux / macOS

```bash
# 1. Créer l'environnement virtuel
python3 -m venv venv

# 2. Activer l'environnement virtuel
source venv/bin/activate

# 3. Installer les dépendances
pip install -r requirements.txt

# 4. Appliquer les migrations
python manage.py migrate

# 5. Initialiser les données
python manage.py init_data

# 6. Lancer le serveur
python manage.py runserver
```

## Étape par Étape

### Étape 1: Créer l'Environnement Virtuel

**Windows:**
```bash
python -m venv venv
```

**Linux/macOS:**
```bash
python3 -m venv venv
```

### Étape 2: Activer l'Environnement Virtuel

**Windows:**
```bash
venv\Scripts\activate
```

Vous devriez voir `(venv)` au début de votre terminal.

**Linux/macOS:**
```bash
source venv/bin/activate
```

Vous devriez voir `(venv)` au début de votre terminal.

### Étape 3: Installer les Dépendances

```bash
pip install -r requirements.txt
```

Cela va installer:
- Django 4.2.11
- Django REST Framework
- Jazzmin
- MySQLclient
- Redis
- Celery
- Et autres dépendances

### Étape 4: Appliquer les Migrations

```bash
python manage.py migrate
```

Cela va créer les tables dans la base de données MySQL.

### Étape 5: Initialiser les Données

```bash
python manage.py init_data
```

Cela va créer:
- Les rôles et permissions
- Un superadmin (admin/admin123)
- Les données géographiques de la RDC

### Étape 6: Lancer le Serveur

```bash
python manage.py runserver
```

Le serveur va démarrer sur `http://localhost:8000`

## Accès

### Admin
- **URL**: `http://localhost:8000/mwoloboss/`
- **Username**: `admin`
- **Password**: `admin123`

### API
- **URL**: `http://localhost:8000/api/`
- **Docs**: `http://localhost:8000/api/docs/`

## Vérification

### Vérifier que l'environnement est activé

Vous devriez voir `(venv)` au début de votre terminal:
```
(venv) C:\Users\username\mwolo-energy-systems>
```

### Vérifier la version de Python

```bash
python --version
```

Devrait afficher Python 3.10 ou supérieur.

### Vérifier Django

```bash
python manage.py check
```

Devrait afficher "System check identified no issues".

### Vérifier la Connexion MySQL

```bash
python manage.py dbshell
```

Devrait se connecter à la base de données MySQL.

## Désactiver l'Environnement Virtuel

Quand vous avez terminé:

```bash
deactivate
```

## Réactiver l'Environnement Virtuel

Pour relancer le serveur plus tard:

**Windows:**
```bash
venv\Scripts\activate
python manage.py runserver
```

**Linux/macOS:**
```bash
source venv/bin/activate
python manage.py runserver
```

## Troubleshooting

### Erreur: "python: command not found"

Utiliser `python3` au lieu de `python`:
```bash
python3 -m venv venv
```

### Erreur: "No module named 'django'"

L'environnement virtuel n'est pas activé. Vérifier que vous voyez `(venv)` au début du terminal.

### Erreur: "Access denied for user 'root'"

Vérifier le mot de passe dans `.env`:
```
DB_PASSWORD=14041999No@
```

### Erreur: "Unknown database 'mwoloenerysystems'"

Créer la base de données MySQL:
```bash
mysql -u root -p14041999No@ -e "CREATE DATABASE mwoloenerysystems CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Erreur: "Port already in use"

Utiliser un autre port:
```bash
python manage.py runserver 8001
```

## Configuration MySQL

### Credentials
- **Database**: `mwoloenerysystems`
- **User**: `root`
- **Password**: `14041999No@`
- **Host**: `localhost`
- **Port**: `3306`

### Vérifier la Connexion

```bash
mysql -u root -p14041999No@ -h localhost
```

## Commandes Utiles

### Créer un Superadmin

```bash
python manage.py createsuperuser
```

### Lancer les Tests

```bash
pytest
```

### Lancer Celery

```bash
celery -A config worker -l info
```

### Lancer Celery Beat

```bash
celery -A config beat -l info
```

### Exporter les Données

```bash
python manage.py dumpdata > backup.json
```

### Importer les Données

```bash
python manage.py loaddata backup.json
```

### Vider la Base de Données

```bash
python manage.py flush
```

### Réinitialiser les Données

```bash
python manage.py flush --no-input
python manage.py init_data
```

## Fichiers Importants

- `.env` - Variables d'environnement (credentials MySQL)
- `requirements.txt` - Dépendances Python
- `manage.py` - Commandes Django
- `config/settings.py` - Configuration Django
- `config/urls.py` - URLs (admin changée en `/mwoloboss/`)

## Documentation

- `README.md` - Vue d'ensemble
- `QUICKSTART.md` - Démarrage rapide
- `GETTING_STARTED.md` - Guide complet
- `API_DOCUMENTATION.md` - API endpoints
- `MYSQL_SETUP.md` - Configuration MySQL
- `NEXT_STEPS.md` - Prochaines étapes

## Support

Pour toute question:
1. Consulter la documentation
2. Vérifier la FAQ
3. Ouvrir une issue

---

**Bon développement! 🚀**
