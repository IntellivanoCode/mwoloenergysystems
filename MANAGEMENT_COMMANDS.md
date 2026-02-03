# Commandes de Gestion Django

## Commandes Intégrées

### Initialisation

#### Initialiser les données
```bash
python manage.py init_data
```
Crée:
- Les rôles et permissions
- Un superadmin (admin/admin123)
- Les données géographiques de la RDC

#### Créer un superadmin
```bash
python manage.py createsuperuser
```

#### Créer un utilisateur
```bash
python manage.py shell
```
```python
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.create_user(
    username='username',
    email='email@example.com',
    password='password',
    role='employe'
)
```

### Migrations

#### Créer les migrations
```bash
python manage.py makemigrations
```

#### Appliquer les migrations
```bash
python manage.py migrate
```

#### Afficher l'état des migrations
```bash
python manage.py showmigrations
```

#### Revenir à une migration précédente
```bash
python manage.py migrate app_name 0001
```

### Données

#### Exporter les données
```bash
python manage.py dumpdata > backup.json
python manage.py dumpdata app_name > app_backup.json
```

#### Importer les données
```bash
python manage.py loaddata backup.json
python manage.py loaddata app_backup.json
```

#### Supprimer toutes les données
```bash
python manage.py flush
```

#### Supprimer les données et réinitialiser
```bash
python manage.py flush --no-input
python manage.py init_data
```

### Développement

#### Lancer le serveur
```bash
python manage.py runserver
python manage.py runserver 0.0.0.0:8000
```

#### Lancer la console Django
```bash
python manage.py shell
```

#### Lancer la console IPython (si installé)
```bash
python manage.py shell_plus
```

#### Vérifier la configuration
```bash
python manage.py check
```

#### Afficher les URLs
```bash
python manage.py show_urls
```

### Fichiers Statiques

#### Collecter les fichiers statiques
```bash
python manage.py collectstatic
python manage.py collectstatic --noinput
```

#### Nettoyer les fichiers statiques
```bash
python manage.py collectstatic --clear
```

### Admin

#### Créer un cache pour l'admin
```bash
python manage.py createcachetable
```

#### Vider le cache
```bash
python manage.py shell
```
```python
from django.core.cache import cache
cache.clear()
```

### Tests

#### Lancer les tests
```bash
python manage.py test
python manage.py test app_name
python manage.py test app_name.tests.TestClass
```

#### Lancer les tests avec couverture
```bash
coverage run --source='.' manage.py test
coverage report
coverage html
```

#### Lancer pytest
```bash
pytest
pytest -v
pytest --cov=.
```

### Maintenance

#### Vérifier les problèmes
```bash
python manage.py check
python manage.py check --deploy
```

#### Optimiser la base de données
```bash
python manage.py dbshell
```
```sql
VACUUM ANALYZE;
```

#### Nettoyer les sessions expirées
```bash
python manage.py clearsessions
```

#### Nettoyer les fichiers temporaires
```bash
python manage.py shell
```
```python
import os
from django.conf import settings
for file in os.listdir(settings.MEDIA_ROOT):
    if file.startswith('temp_'):
        os.remove(os.path.join(settings.MEDIA_ROOT, file))
```

## Commandes Personnalisées

### init_data
```bash
python manage.py init_data
```
Initialise les données de base du système.

## Commandes Celery

### Lancer le worker
```bash
celery -A config worker -l info
```

### Lancer le beat (tâches planifiées)
```bash
celery -A config beat -l info
```

### Lancer les deux ensemble
```bash
celery -A config worker -B -l info
```

### Vérifier les tâches
```bash
celery -A config inspect active
celery -A config inspect scheduled
```

### Purger les tâches
```bash
celery -A config purge
```

## Commandes Docker

### Construire l'image
```bash
docker-compose build
```

### Lancer les services
```bash
docker-compose up -d
```

### Arrêter les services
```bash
docker-compose down
```

### Voir les logs
```bash
docker-compose logs -f web
docker-compose logs -f celery
```

### Exécuter une commande
```bash
docker-compose exec web python manage.py migrate
docker-compose exec web python manage.py init_data
```

### Accéder à la console
```bash
docker-compose exec web python manage.py shell
```

## Commandes Utiles

### Vérifier la version de Django
```bash
python manage.py --version
```

### Afficher l'aide
```bash
python manage.py help
python manage.py help command_name
```

### Lister les apps installées
```bash
python manage.py shell
```
```python
from django.apps import apps
for app in apps.get_app_configs():
    print(app.name)
```

### Vérifier les permissions
```bash
python manage.py shell
```
```python
from accounts.models import Permission
for perm in Permission.objects.all():
    print(f"{perm.role} - {perm.module} - {perm.action}")
```

### Vérifier les utilisateurs
```bash
python manage.py shell
```
```python
from django.contrib.auth import get_user_model
User = get_user_model()
for user in User.objects.all():
    print(f"{user.username} - {user.role}")
```

## Troubleshooting

### Erreur: "No such table"
```bash
python manage.py migrate
```

### Erreur: "ModuleNotFoundError"
```bash
pip install -r requirements.txt
```

### Erreur: "Connection refused"
```bash
# Vérifier que PostgreSQL/Redis est en cours d'exécution
sudo systemctl status postgresql
sudo systemctl status redis-server
```

### Erreur: "Permission denied"
```bash
# Vérifier les permissions des fichiers
chmod -R 755 /path/to/project
```

### Erreur: "Port already in use"
```bash
# Utiliser un autre port
python manage.py runserver 8001
```

## Bonnes Pratiques

1. Toujours exécuter les migrations avant de démarrer
2. Toujours tester les migrations en développement
3. Toujours sauvegarder la base de données avant les migrations
4. Toujours utiliser les fixtures pour les données de test
5. Toujours vérifier la configuration avec `check --deploy`
6. Toujours utiliser les variables d'environnement pour les secrets
7. Toujours documenter les commandes personnalisées
8. Toujours tester les commandes avant la production
