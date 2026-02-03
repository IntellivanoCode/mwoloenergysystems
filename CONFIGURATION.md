# Guide de Configuration

## Variables d'Environnement

### Fichiers de configuration
- `.env.example` - Template par défaut
- `.env` - Configuration locale (développement)
- `.env.production` - Configuration production

### Variables Principales

#### Django
```
DEBUG=True/False
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
```

#### Base de Données
```
DB_ENGINE=django.db.backends.postgresql
DB_NAME=mwolo_db
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
```

#### Redis
```
REDIS_URL=redis://localhost:6379/0
```

#### JWT
```
JWT_SECRET_KEY=your-jwt-secret
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_LIFETIME=3600
JWT_REFRESH_TOKEN_LIFETIME=604800
```

#### Email
```
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-password
DEFAULT_FROM_EMAIL=noreply@mwolo.energy
```

#### Stockage S3
```
USE_S3=False
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_STORAGE_BUCKET_NAME=bucket-name
AWS_S3_REGION_NAME=us-east-1
AWS_S3_ENDPOINT_URL=https://s3.amazonaws.com
```

#### Celery
```
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0
```

#### Paiements Mobiles
```
MPSA_API_KEY=your-key
AIRTEL_MONEY_API_KEY=your-key
VODACOM_API_KEY=your-key
```

#### Timezone
```
TIME_ZONE=Africa/Kinshasa
```

## Configuration Django

### Settings.py
Le fichier `config/settings.py` contient la configuration principale.

### Settings par Environnement
- `config/settings_dev.py` - Développement
- `config/settings_prod.py` - Production
- `config/settings_test.py` - Tests

### Utiliser un settings personnalisé
```bash
python manage.py runserver --settings=config.settings_dev
```

## Configuration Jazzmin

### Personnalisation
```python
JAZZMIN_SETTINGS = {
    'site_title': 'Mwolo Energy Systems',
    'site_header': 'Mwolo Energy Systems',
    'site_brand': 'Mwolo',
    'welcome_sign': 'Bienvenue à Mwolo Energy Systems',
    'copyright': 'Mwolo Energy Systems © 2026',
    'search_model': 'accounts.User',
    'user_avatar': None,
    'show_sidebar': True,
    'navigation_expanded': True,
}
```

## Configuration REST Framework

### Authentification
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}
```

### Permissions
```python
'DEFAULT_PERMISSION_CLASSES': [
    'rest_framework.permissions.IsAuthenticated',
],
```

### Filtrage
```python
'DEFAULT_FILTER_BACKENDS': [
    'django_filters.rest_framework.DjangoFilterBackend',
    'rest_framework.filters.SearchFilter',
    'rest_framework.filters.OrderingFilter',
],
```

### Pagination
```python
'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
'PAGE_SIZE': 20,
```

## Configuration CORS

### Origines autorisées
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:8000',
    'http://127.0.0.1:3000',
]
```

## Configuration Celery

### Broker et Backend
```python
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
```

### Tâches Planifiées
```python
CELERY_BEAT_SCHEDULE = {
    'send-reminders': {
        'task': 'billing.tasks.send_reminders',
        'schedule': crontab(hour=9, minute=0),
    },
}
```

## Configuration PostgreSQL

### Connexion
```
postgresql://user:password@localhost:5432/database
```

### Optimisations
```sql
-- Augmenter les connexions
max_connections = 200

-- Augmenter la mémoire partagée
shared_buffers = 256MB

-- Augmenter la mémoire de travail
work_mem = 16MB

-- Augmenter le cache effectif
effective_cache_size = 1GB
```

## Configuration Redis

### Connexion
```
redis://localhost:6379/0
```

### Optimisations
```
maxmemory 256mb
maxmemory-policy allkeys-lru
```

## Configuration Nginx

### Reverse Proxy
```nginx
upstream mwolo {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://mwolo;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Configuration Gunicorn

### Fichier de configuration
```python
bind = "0.0.0.0:8000"
workers = 4
worker_class = "sync"
timeout = 30
keepalive = 2
```

### Lancer Gunicorn
```bash
gunicorn config.wsgi:application --config gunicorn_config.py
```

## Configuration Docker

### docker-compose.yml
```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: mwolo_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

  web:
    build: .
    command: python manage.py runserver 0.0.0.0:8000
    volumes:
      - .:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
      - redis

  celery:
    build: .
    command: celery -A config worker -l info
    depends_on:
      - db
      - redis
```

## Configuration SSL/TLS

### Certbot
```bash
sudo certbot --nginx -d your-domain.com
```

### Configuration Nginx
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}
```

## Configuration Logging

### Fichier de log
```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': '/var/log/mwolo/django.log',
            'maxBytes': 1024 * 1024 * 15,
            'backupCount': 10,
        },
    },
    'root': {
        'handlers': ['file'],
        'level': 'INFO',
    },
}
```

## Configuration Monitoring

### Sentry (Error Tracking)
```python
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn="your-sentry-dsn",
    integrations=[DjangoIntegration()],
    traces_sample_rate=1.0,
)
```

### New Relic (Performance Monitoring)
```bash
pip install newrelic
newrelic-admin run-program gunicorn config.wsgi:application
```

## Checklist de Configuration

### Développement
- [ ] Créer `.env` à partir de `.env.example`
- [ ] Installer les dépendances
- [ ] Exécuter les migrations
- [ ] Initialiser les données
- [ ] Lancer le serveur

### Production
- [ ] Créer `.env.production`
- [ ] Configurer PostgreSQL
- [ ] Configurer Redis
- [ ] Configurer Nginx
- [ ] Configurer SSL/TLS
- [ ] Configurer les logs
- [ ] Configurer le monitoring
- [ ] Exécuter les migrations
- [ ] Collecter les fichiers statiques
- [ ] Lancer Gunicorn
- [ ] Lancer Celery
- [ ] Tester l'application

## Ressources

- [Django Settings](https://docs.djangoproject.com/en/4.2/topics/settings/)
- [Django REST Framework Configuration](https://www.django-rest-framework.org/api-guide/settings/)
- [Celery Configuration](https://docs.celeryproject.org/en/stable/userguide/configuration.html)
- [PostgreSQL Configuration](https://www.postgresql.org/docs/current/config-setting.html)
- [Redis Configuration](https://redis.io/docs/management/config/)
- [Nginx Configuration](https://nginx.org/en/docs/)
