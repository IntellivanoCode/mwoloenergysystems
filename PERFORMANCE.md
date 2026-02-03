# Guide de Performance

## Optimisations Appliquées

### 1. Indexes de Base de Données
```python
# Indexes sur les champs de recherche
class Meta:
    indexes = [
        models.Index(fields=['user', '-timestamp']),
        models.Index(fields=['module', '-timestamp']),
    ]
```

### 2. Pagination
```python
# Pagination par défaut
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}
```

### 3. Select Related et Prefetch Related
```python
# Éviter les requêtes N+1
invoices = Invoice.objects.select_related('client').prefetch_related('lines')
```

### 4. Caching avec Redis
```python
from django.core.cache import cache

# Mettre en cache
cache.set('key', value, timeout=3600)

# Récupérer du cache
value = cache.get('key')
```

### 5. Tâches Asynchrones avec Celery
```python
# Tâches longues en arrière-plan
@shared_task
def generate_invoice_pdf(invoice_id):
    # Génération PDF
    pass
```

## Optimisations à Appliquer

### 1. Compression Gzip
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### 2. Caching HTTP
```python
# Cache les réponses GET
from django.views.decorators.cache import cache_page

@cache_page(60 * 15)  # 15 minutes
def get_clients(request):
    pass
```

### 3. CDN pour les Fichiers Statiques
```python
# Utiliser CloudFront ou Cloudflare
STATIC_URL = 'https://cdn.your-domain.com/static/'
```

### 4. Lazy Loading des Images
```html
<!-- Charger les images à la demande -->
<img src="image.jpg" loading="lazy" />
```

### 5. Minification des Assets
```bash
# Utiliser Webpack ou Gulp
npm install --save-dev webpack webpack-cli
```

## Monitoring de Performance

### 1. Django Debug Toolbar
```python
# Développement uniquement
INSTALLED_APPS += ['debug_toolbar']
MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
```

### 2. New Relic
```python
# Monitoring en production
pip install newrelic
newrelic-admin run-program gunicorn config.wsgi:application
```

### 3. Sentry
```python
# Error tracking
import sentry_sdk
sentry_sdk.init(dsn="your-sentry-dsn")
```

### 4. Prometheus
```python
# Métriques
pip install prometheus-client
```

## Optimisations de Base de Données

### 1. Indexes
```sql
-- Créer des indexes
CREATE INDEX idx_client_email ON crm_client(email);
CREATE INDEX idx_invoice_status ON billing_invoice(status);
```

### 2. Partitioning
```sql
-- Partitionner les grandes tables
CREATE TABLE billing_invoice_2026_01 PARTITION OF billing_invoice
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
```

### 3. Vacuum et Analyze
```sql
-- Optimiser la base de données
VACUUM ANALYZE;
```

### 4. Connection Pooling
```python
# Utiliser PgBouncer
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'HOST': 'pgbouncer.localhost',
        'PORT': 6432,
    }
}
```

## Optimisations d'API

### 1. Sparse Fieldsets
```
GET /api/clients/?fields=id,name,email
```

### 2. Filtering
```
GET /api/clients/?status=actif&agency=123
```

### 3. Sorting
```
GET /api/clients/?ordering=-created_at
```

### 4. Pagination
```
GET /api/clients/?page=1&page_size=50
```

## Optimisations Frontend

### 1. Code Splitting
```javascript
// Charger les modules à la demande
const module = await import('./module.js');
```

### 2. Tree Shaking
```javascript
// Utiliser les imports nommés
import { function } from 'module';
```

### 3. Lazy Loading
```javascript
// Charger les composants à la demande
const Component = lazy(() => import('./Component'));
```

### 4. Image Optimization
```bash
# Optimiser les images
npm install --save-dev imagemin
```

## Benchmarking

### 1. Apache Bench
```bash
# Tester la performance
ab -n 1000 -c 10 http://localhost:8000/api/clients/
```

### 2. Wrk
```bash
# Tester avec plusieurs threads
wrk -t4 -c100 -d30s http://localhost:8000/api/clients/
```

### 3. Locust
```bash
# Tests de charge
pip install locust
locust -f locustfile.py
```

## Profiling

### 1. Django Silk
```python
# Profiler les requêtes
pip install django-silk
INSTALLED_APPS += ['silk']
MIDDLEWARE += ['silk.middleware.SilkyMiddleware']
```

### 2. cProfile
```python
# Profiler le code
import cProfile
cProfile.run('function()')
```

### 3. Memory Profiler
```python
# Profiler la mémoire
pip install memory-profiler
@profile
def function():
    pass
```

## Optimisations Celery

### 1. Worker Configuration
```python
# Augmenter les workers
celery -A config worker -c 4 -l info
```

### 2. Task Routing
```python
# Router les tâches
CELERY_TASK_ROUTES = {
    'billing.tasks.*': {'queue': 'billing'},
    'hr.tasks.*': {'queue': 'hr'},
}
```

### 3. Task Compression
```python
# Compresser les messages
CELERY_TASK_COMPRESSION = 'gzip'
```

## Optimisations Redis

### 1. Memory Management
```
maxmemory 256mb
maxmemory-policy allkeys-lru
```

### 2. Persistence
```
save 900 1
save 300 10
save 60 10000
```

### 3. Replication
```
slaveof master-ip 6379
```

## Checklist de Performance

### Développement
- [ ] Utiliser Django Debug Toolbar
- [ ] Profiler le code
- [ ] Tester les requêtes N+1
- [ ] Vérifier les indexes
- [ ] Tester les performances

### Production
- [ ] Monitoring activé
- [ ] Caching configuré
- [ ] CDN configuré
- [ ] Compression activée
- [ ] Indexes optimisés
- [ ] Connection pooling activé
- [ ] Celery configuré
- [ ] Redis configuré
- [ ] Benchmarking effectué
- [ ] Alertes configurées

## Ressources

### Documentation
- [Django Performance](https://docs.djangoproject.com/en/4.2/topics/performance/)
- [PostgreSQL Performance](https://www.postgresql.org/docs/current/performance.html)
- [Redis Performance](https://redis.io/docs/management/optimization/)

### Outils
- [Django Debug Toolbar](https://django-debug-toolbar.readthedocs.io/)
- [New Relic](https://newrelic.com/)
- [Sentry](https://sentry.io/)
- [Prometheus](https://prometheus.io/)

### Communautés
- [Django Performance](https://docs.djangoproject.com/en/4.2/topics/performance/)
- [PostgreSQL Performance](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Redis Performance](https://redis.io/docs/management/optimization/)
