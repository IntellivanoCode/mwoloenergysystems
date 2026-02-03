# Référence rapide - Mwolo Energy Systems

## Démarrage rapide

### Backend Django (Terminal 1)
```bash
cd mwolo-energy-systems
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/macOS
python manage.py runserver
```

### Frontend Next.js (Terminal 2)
```bash
cd mwolo-energy-systems/frontend
npm run dev
```

## URLs principales

### Site Vitrine
| Page | URL |
|------|-----|
| Accueil | http://localhost:3000 |
| À propos | http://localhost:3000/about |
| Services | http://localhost:3000/services |
| Agences | http://localhost:3000/agencies |
| Équipe | http://localhost:3000/equipment |
| Actualités | http://localhost:3000/news |
| Contact | http://localhost:3000/contact |
| Connexion | http://localhost:3000/login |
| Inscription | http://localhost:3000/register |

### Tableaux de bord
| Tableau | URL | Rôle |
|---------|-----|------|
| Client | http://localhost:3000/dashboard | Client |
| Employé | http://localhost:3000/employee-dashboard | Employé |
| Admin | http://localhost:3000/admin-dashboard | Administrateur |

### Admin Django
| Section | URL |
|---------|-----|
| Admin | http://localhost:8000/mwoloboss/ |
| API | http://localhost:8000/api/ |

## Identifiants de test

### Admin
```
Email: admin@mwolo.energy
Mot de passe: admin123
```

### Client
```
Email: client@mwolo.energy
Mot de passe: client123
```

### Employé
```
Email: employee@mwolo.energy
Mot de passe: employee123
```

## Commandes Django

```bash
# Migrations
python manage.py makemigrations
python manage.py migrate

# Données
python manage.py populate_data
python manage.py init_data

# Utilisateur
python manage.py createsuperuser

# Serveur
python manage.py runserver
python manage.py runserver 0.0.0.0:8000

# Tests
python manage.py test

# Shell
python manage.py shell
```

## Commandes Frontend

```bash
# Installation
npm install

# Développement
npm run dev

# Build
npm run build

# Production
npm run start

# Lint
npm run lint

# Format
npm run format
```

## Endpoints API principaux

### CMS
```
GET /api/cms/services/
GET /api/cms/testimonials/
GET /api/cms/partners/
GET /api/cms/blog/
GET /api/cms/settings/current/
```

### Clients
```
GET /api/crm/clients/
GET /api/crm/clients/me/
POST /api/crm/clients/
```

### Employés
```
GET /api/hr/employees/
GET /api/hr/employees/me/
GET /api/hr/attendance/
```

### Facturation
```
GET /api/billing/invoices/
GET /api/billing/invoices/{id}/
POST /api/billing/invoices/
```

### Agences
```
GET /api/agencies/agencies/
GET /api/agencies/agencies/{id}/
```

### Admin
```
GET /api/core/dashboard/stats/
GET /api/core/audit-logs/
```

## Variables d'environnement

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
DB_ENGINE=django.db.backends.mysql
DB_NAME=mwoloenerysystems
DB_USER=root
DB_PASSWORD=14041999No@
DB_HOST=localhost
DB_PORT=3306
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Fichiers importants

### Configuration
- `config/settings.py` - Configuration Django
- `config/urls.py` - URLs Django
- `frontend/next.config.ts` - Configuration Next.js
- `frontend/tsconfig.json` - Configuration TypeScript

### Modèles
- `accounts/models.py` - Utilisateurs
- `crm/models.py` - Clients
- `hr/models.py` - Employés
- `billing/models.py` - Facturation
- `cms/models.py` - CMS

### Vues
- `cms/views.py` - Vues CMS
- `crm/views.py` - Vues CRM
- `hr/views.py` - Vues HR
- `billing/views.py` - Vues Facturation

### Frontend
- `frontend/src/app/page.tsx` - Home page
- `frontend/src/app/dashboard/page.tsx` - Client dashboard
- `frontend/src/app/employee-dashboard/page.tsx` - Employee dashboard
- `frontend/src/app/admin-dashboard/page.tsx` - Admin dashboard
- `frontend/src/components/Header.tsx` - Header
- `frontend/src/components/Footer.tsx` - Footer
- `frontend/src/lib/api.ts` - API client

## Dépannage rapide

### Erreur de base de données
```bash
# Vérifier la connexion
python manage.py dbshell

# Réinitialiser les migrations
python manage.py migrate zero
python manage.py migrate
```

### Erreur CORS
```python
# Vérifier dans config/settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]
```

### Erreur d'authentification
```bash
# Vérifier le token
# Dans le navigateur: localStorage.getItem('access_token')

# Créer un nouvel utilisateur
python manage.py createsuperuser
```

### Erreur de module
```bash
# Réinstaller les dépendances
pip install -r requirements.txt --force-reinstall
npm install --force
```

## Logs et debugging

### Django
```bash
# Logs en temps réel
python manage.py runserver --verbosity 2

# Logs de la base de données
# Dans settings.py: LOGGING = {...}
```

### Frontend
```bash
# Ouvrir la console du navigateur
F12 ou Ctrl+Shift+I

# Vérifier les requêtes réseau
Onglet Network

# Vérifier les erreurs
Onglet Console
```

## Performance

### Django
```bash
# Profiler les requêtes
pip install django-silk

# Vérifier les requêtes N+1
# Utiliser select_related() et prefetch_related()
```

### Frontend
```bash
# Vérifier les performances
npm run build
npm run start

# Lighthouse
# Chrome DevTools > Lighthouse
```

## Déploiement

### Production Django
```bash
# Gunicorn
gunicorn config.wsgi:application --bind 0.0.0.0:8000

# Nginx
# Voir DEPLOYMENT.md
```

### Production Frontend
```bash
# Build
npm run build

# Vercel
vercel deploy

# Docker
docker build -t mwolo-frontend .
docker run -p 3000:3000 mwolo-frontend
```

## Documentation

- `README.md` - Vue d'ensemble
- `GETTING_STARTED.md` - Guide de démarrage
- `API_DOCUMENTATION.md` - Documentation API
- `DASHBOARDS_GUIDE.md` - Guide des tableaux de bord
- `CONFIGURATION.md` - Configuration
- `DEPLOYMENT.md` - Déploiement
- `RUN_EVERYTHING.md` - Guide complet
- `IMPROVEMENTS_SUMMARY.md` - Résumé des améliorations

## Ressources utiles

- Django: https://docs.djangoproject.com/
- DRF: https://www.django-rest-framework.org/
- Next.js: https://nextjs.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- TypeScript: https://www.typescriptlang.org/docs/

## Support

- Email: support@mwolo.energy
- Téléphone: +243 123 456 789
- Adresse: Kinshasa, RDC

---

**Dernière mise à jour**: Février 2026
**Version**: 3.0
