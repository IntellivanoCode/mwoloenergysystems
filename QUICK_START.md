# 🚀 Démarrage rapide - Mwolo Energy Systems

## ⚡ En 5 minutes

### Prérequis
- Python 3.10+
- Node.js 18+
- MySQL 8.0+
- Git

---

## 1️⃣ Backend Django (Terminal 1)

```bash
# Aller dans le dossier
cd mwolo-energy-systems

# Créer et activer le venv
python -m venv venv
venv\Scripts\activate  # Windows
# ou
source venv/bin/activate  # Linux/Mac

# Installer les dépendances
pip install -r requirements.txt

# Appliquer les migrations
python manage.py migrate

# Initialiser les données
python manage.py init_data

# Démarrer le serveur
python manage.py runserver
```

✅ Backend prêt sur http://localhost:8000

---

## 2️⃣ Frontend Next.js (Terminal 2)

```bash
# Aller dans le dossier frontend
cd mwolo-energy-systems/frontend

# Installer les dépendances
npm install

# Démarrer le serveur
npm run dev
```

✅ Frontend prêt sur http://localhost:3000

---

## 🔑 Identifiants de connexion

### Admin Django
- **URL** : http://localhost:8000/mwoloboss/
- **Utilisateur** : admin
- **Mot de passe** : admin123

### API Documentation
- **URL** : http://localhost:8000/api/docs/

---

## 📱 Accès au site

### Site Vitrine
- **Accueil** : http://localhost:3000/
- **À propos** : http://localhost:3000/about
- **Services** : http://localhost:3000/services
- **Contact** : http://localhost:3000/contact

### Authentification
- **Connexion** : http://localhost:3000/login
- **Inscription** : http://localhost:3000/register

### Dashboard
- **Dashboard** : http://localhost:3000/dashboard

---

## 🎯 Premiers pas

### 1. Créer un client
1. Aller sur http://localhost:3000/register
2. Remplir le formulaire
3. Cliquer sur "S'inscrire"

### 2. Se connecter
1. Aller sur http://localhost:3000/login
2. Entrer les identifiants
3. Cliquer sur "Se connecter"

### 3. Accéder au dashboard
1. Après connexion, vous êtes redirigé vers le dashboard
2. Voir les statistiques et actions rapides

### 4. Gérer les données
1. Aller sur http://localhost:8000/mwoloboss/
2. Se connecter avec admin/admin123
3. Gérer tous les modules

---

## 🔧 Commandes utiles

### Django
```bash
# Créer un nouvel utilisateur
python manage.py createsuperuser

# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Collecter les fichiers statiques
python manage.py collectstatic

# Vider le cache
python manage.py clear_cache

# Lancer les tests
python manage.py test
```

### Frontend
```bash
# Build pour la production
npm run build

# Lancer en production
npm start

# Linting
npm run lint

# Linting avec fix
npm run lint -- --fix
```

---

## 📊 Structure des données

### Modules disponibles
1. **Accounts** - Utilisateurs et permissions
2. **Geo** - Géographie (pays, provinces, communes)
3. **Agencies** - Agences
4. **HR** - Ressources humaines
5. **CRM** - Gestion des clients
6. **Billing** - Facturation
7. **Operations** - Opérations
8. **Support** - Support client
9. **CMS** - Gestion de contenu
10. **Core** - Paramètres système

---

## 🐛 Dépannage

### Le backend ne démarre pas
```bash
# Vérifier que MySQL est en cours d'exécution
# Vérifier les migrations
python manage.py migrate

# Vérifier les dépendances
pip install -r requirements.txt
```

### Le frontend ne démarre pas
```bash
# Vérifier que Node.js est installé
node --version

# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Erreur de connexion à la base de données
```bash
# Vérifier les credentials dans .env
# Vérifier que MySQL est en cours d'exécution
# Vérifier le port 3306
```

---

## 📚 Documentation complète

- `PROJECT_COMPLETE.md` - Vue d'ensemble complète
- `DJANGO_SETUP_COMPLETE.md` - Configuration Django
- `FRONTEND_SETUP.md` - Configuration Frontend
- `API_DOCUMENTATION.md` - Documentation API
- `DEPLOYMENT.md` - Déploiement en production

---

## 🎉 Vous êtes prêt !

Commencez à développer et à explorer Mwolo Energy Systems.

Pour toute question, consultez la documentation ou contactez le support.

---

**Dernière mise à jour** : 2026-02-01
**Version** : 1.0.0
