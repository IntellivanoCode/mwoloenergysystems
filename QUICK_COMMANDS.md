# Commandes Rapides

## Installation Complète (Copier-Coller)

### Windows - Copier tout d'un coup:

```bash
python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt && python manage.py migrate && python manage.py init_data && python manage.py runserver
```

### Linux/macOS - Copier tout d'un coup:

```bash
python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && python manage.py migrate && python manage.py init_data && python manage.py runserver
```

---

## Commandes Individuelles

### 1. Créer l'Environnement Virtuel

**Windows:**
```bash
python -m venv venv
```

**Linux/macOS:**
```bash
python3 -m venv venv
```

### 2. Activer l'Environnement Virtuel

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/macOS:**
```bash
source venv/bin/activate
```

### 3. Installer les Dépendances

```bash
pip install -r requirements.txt
```

### 4. Appliquer les Migrations

```bash
python manage.py migrate
```

### 5. Initialiser les Données

```bash
python manage.py init_data
```

### 6. Lancer le Serveur

```bash
python manage.py runserver
```

---

## Commandes de Développement

### Lancer les Tests

```bash
pytest
```

### Lancer les Tests avec Couverture

```bash
pytest --cov=.
```

### Lancer Celery

```bash
celery -A config worker -l info
```

### Lancer Celery Beat

```bash
celery -A config beat -l info
```

### Créer un Superadmin

```bash
python manage.py createsuperuser
```

### Créer les Migrations

```bash
python manage.py makemigrations
```

### Vérifier la Configuration

```bash
python manage.py check
```

### Accéder à la Console Django

```bash
python manage.py shell
```

---

## Commandes de Base de Données

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
python manage.py flush --no-input && python manage.py init_data
```

### Accéder à la Base de Données

```bash
python manage.py dbshell
```

---

## Commandes MySQL

### Vérifier la Connexion

```bash
mysql -u root -p14041999No@ -h localhost
```

### Créer la Base de Données

```bash
mysql -u root -p14041999No@ -e "CREATE DATABASE mwoloenerysystems CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Supprimer la Base de Données

```bash
mysql -u root -p14041999No@ -e "DROP DATABASE mwoloenerysystems;"
```

### Sauvegarder la Base de Données

```bash
mysqldump -u root -p14041999No@ mwoloenerysystems > backup.sql
```

### Restaurer la Base de Données

```bash
mysql -u root -p14041999No@ mwoloenerysystems < backup.sql
```

---

## Commandes Docker

### Construire l'Image

```bash
docker-compose build
```

### Lancer les Services

```bash
docker-compose up -d
```

### Arrêter les Services

```bash
docker-compose down
```

### Voir les Logs

```bash
docker-compose logs -f web
```

### Exécuter une Commande

```bash
docker-compose exec web python manage.py migrate
```

---

## Commandes Utiles

### Désactiver l'Environnement Virtuel

```bash
deactivate
```

### Vérifier la Version de Python

```bash
python --version
```

### Vérifier la Version de Django

```bash
python manage.py --version
```

### Lister les Apps Installées

```bash
python manage.py shell -c "from django.apps import apps; print([app.name for app in apps.get_app_configs()])"
```

### Vérifier les Permissions

```bash
python manage.py shell -c "from accounts.models import Permission; print(Permission.objects.count())"
```

---

## Raccourcis

### Réactiver et Lancer le Serveur

**Windows:**
```bash
venv\Scripts\activate && python manage.py runserver
```

**Linux/macOS:**
```bash
source venv/bin/activate && python manage.py runserver
```

### Réactiver et Lancer les Tests

**Windows:**
```bash
venv\Scripts\activate && pytest
```

**Linux/macOS:**
```bash
source venv/bin/activate && pytest
```

### Réactiver et Lancer Celery

**Windows:**
```bash
venv\Scripts\activate && celery -A config worker -l info
```

**Linux/macOS:**
```bash
source venv/bin/activate && celery -A config worker -l info
```

---

## Accès

### Admin
- URL: `http://localhost:8000/mwoloboss/`
- Username: `admin`
- Password: `admin123`

### API
- URL: `http://localhost:8000/api/`
- Docs: `http://localhost:8000/api/docs/`

---

## Configuration

### Credentials MySQL
- Database: `mwoloenerysystems`
- User: `root`
- Password: `14041999No@`
- Host: `localhost`
- Port: `3306`

---

**Bon développement! 🚀**
