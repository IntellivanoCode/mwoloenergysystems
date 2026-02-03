# 🚀 Guide de Déploiement - Mwolo Energy Systems

## Prérequis

- Compte GitHub (https://github.com/IntellivanoCode/mwoloenergysystems)
- Compte Railway (pour la base de données MySQL)
- Compte Render.com (pour le déploiement)

## Architecture de Déploiement

```
┌─────────────────────────────────────────────────────────────────┐
│                        RENDER.COM                                │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  mwolo-api   │  │ mwolo-public │  │ mwolo-staff  │          │
│  │  (Django)    │  │  (Next.js)   │  │  (Next.js)   │          │
│  │  :8000       │  │  :3000       │  │  :3001       │          │
│  └──────┬───────┘  └──────────────┘  └──────────────┘          │
│         │                                                        │
│  ┌──────┴───────────────────────────────────────────────────┐   │
│  │                                                           │   │
│  │            ┌───────────────────────────────────┐          │   │
│  │            │           Railway                  │          │   │
│  │            │         MySQL Database             │          │   │
│  │            │   tramway.proxy.rlwy.net:27306    │          │   │
│  │            └───────────────────────────────────┘          │   │
│  │                                                           │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────┐                                               │
│  │ mwolo-agency │                                               │
│  │  (Next.js)   │                                               │
│  │  :3002       │                                               │
│  └──────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
```

## URLs de Production

| Service | URL |
|---------|-----|
| API Django | https://mwolo-api.onrender.com |
| Portail Public | https://mwolo-public.onrender.com |
| Dashboard Staff | https://mwolo-staff.onrender.com |
| Dashboard Agence | https://mwolo-agency.onrender.com |

## 1. Configuration Railway MySQL (Déjà fait ✅)

La base de données est configurée sur Railway :

```
Host: tramway.proxy.rlwy.net
Port: 27306
Database: railway
User: root
Password: ILFgwOOalwrGnIIKPdZFGWjeotsUrLQh
```

**URL de connexion:**
```
mysql://root:ILFgwOOalwrGnIIKPdZFGWjeotsUrLQh@tramway.proxy.rlwy.net:27306/railway
```

## 2. Déploiement sur Render.com

### Étape 1: Connecter le dépôt GitHub

1. Allez sur https://render.com et connectez-vous
2. Cliquez sur "New" → "Blueprint"
3. Connectez votre dépôt GitHub: `IntellivanoCode/mwoloenergysystems`
4. Render détectera automatiquement le fichier `render.yaml`

### Étape 2: Variables d'environnement

Pour le service **mwolo-api**, configurez ces variables:

```env
# Base de données
DATABASE_URL=mysql://root:ILFgwOOalwrGnIIKPdZFGWjeotsUrLQh@tramway.proxy.rlwy.net:27306/railway

# Django
DJANGO_SETTINGS_MODULE=config.settings_production
SECRET_KEY=votre-cle-secrete-production-ici
DEBUG=False
ALLOWED_HOSTS=mwolo-api.onrender.com,.onrender.com

# CORS
CORS_ALLOWED_ORIGINS=https://mwolo-public.onrender.com,https://mwolo-staff.onrender.com,https://mwolo-agency.onrender.com
```

Pour les services **Frontend** (public, staff, agency):

```env
NEXT_PUBLIC_API_URL=https://mwolo-api.onrender.com
```

### Étape 3: Lancer le déploiement

1. Render va automatiquement:
   - Installer les dépendances (`pip install -r requirements_production.txt`)
   - Collecter les fichiers statiques
   - Exécuter les migrations
   - Démarrer le serveur gunicorn

## 3. Commandes de Build

### Backend (Django)
```bash
pip install -r requirements_production.txt
python manage.py collectstatic --noinput
python manage.py migrate
```

### Frontend (Next.js)
```bash
npm install
npm run build
npm start
```

## 4. Fichiers de Configuration Créés

- `render.yaml` - Configuration Render Blueprint
- `Procfile` - Commande de démarrage pour Render/Heroku
- `build.sh` - Script de build
- `config/settings_production.py` - Settings Django production
- `requirements_production.txt` - Dépendances production
- `.python-version` - Version Python (3.11.6)

## 5. Vérification Post-Déploiement

1. **API Health Check:**
   ```
   curl https://mwolo-api.onrender.com/api/health/
   ```
   Réponse attendue: `{"status": "ok", "database": "connected"}`

2. **Admin Django:**
   ```
   https://mwolo-api.onrender.com/admin/
   ```
   Login: admin@mwolo.energy / Admin123!

3. **Frontends:**
   - https://mwolo-public.onrender.com - Page d'accueil publique
   - https://mwolo-staff.onrender.com - Dashboard employés
   - https://mwolo-agency.onrender.com - Dashboard agences

## 6. Applications Mobiles

Les applications mobiles utilisent ces configurations:

### Production
```typescript
API_URL: 'https://mwolo-api.onrender.com'
```

### Commandes Expo
```bash
# Démarrer en mode développement
cd mobile-client && npx expo start

# Build pour production
npx expo build:android
npx expo build:ios
```

## 7. Maintenance

### Logs
```bash
# Voir les logs Render
render logs --service mwolo-api
```

### Base de données
```bash
# Accès MySQL direct
mysql -h tramway.proxy.rlwy.net -P 27306 -u root -p railway
```

### Migrations
Les migrations sont exécutées automatiquement au déploiement via `build.sh`.

## 8. Dépannage

### Erreur de connexion MySQL
Vérifiez que `cryptography` est installé:
```bash
pip install cryptography
```

### Erreurs CORS
Assurez-vous que les domaines frontend sont dans `CORS_ALLOWED_ORIGINS`.

### Erreur 502 Bad Gateway
Vérifiez les logs Render pour les erreurs de démarrage.

---

## Contacts

- **Développement:** IntellivanoCode
- **Dépôt:** https://github.com/IntellivanoCode/mwoloenergysystems
- **Production:** https://mwolo-api.onrender.com
