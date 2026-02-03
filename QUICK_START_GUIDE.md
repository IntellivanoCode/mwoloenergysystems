# 🚀 Guide de Démarrage Rapide - Mwolo Energy Systems

## ⚡ Démarrage en 3 Étapes

### 1️⃣ Démarrer le Backend Django
```bash
cd mwolo-energy-systems
python manage.py runserver 0.0.0.0:8000
```
✅ Backend disponible à: http://localhost:8000

### 2️⃣ Démarrer le Frontend Next.js
```bash
cd mwolo-energy-systems/frontend
npm run dev
```
✅ Frontend disponible à: http://localhost:3000

### 3️⃣ Ouvrir le Site
Ouvrir votre navigateur et aller à: **http://localhost:3000**

---

## 📍 URLs Importantes

| Service | URL | Description |
|---------|-----|-------------|
| Site Web | http://localhost:3000 | Site vitrine public |
| API Backend | http://localhost:8000/api | API REST |
| Admin Django | http://localhost:8000/mwoloboss/ | Panneau d'administration |
| API Docs | http://localhost:8000/api/docs/ | Documentation Swagger |

---

## 🔑 Identifiants Admin

```
Email: admin@mwolo.energy
Password: (défini lors de la création du superuser)
```

Pour créer un superuser:
```bash
python manage.py createsuperuser
```

---

## 📊 Pages du Site

### Site Vitrine (Public)
- **Accueil** `/` - Services, témoignages, partenaires
- **Agences** `/agencies` - Liste des agences
- **Équipe** `/equipment` - Responsables clés
- **Carrières** `/careers` - Offres d'emploi
- **Actualités** `/news` - Articles de blog
- **À Propos** `/about` - Informations sur l'entreprise
- **Contact** `/contact` - Formulaire de contact
- **Services** `/services` - Détails des services

### Authentification
- **Inscription** `/register` - Créer un compte
- **Connexion** `/login` - Se connecter

### Dashboards (Protégés)
- **Dashboard Client** `/dashboard` - Espace client
- **Dashboard Employé** `/employee-dashboard` - Espace employé
- **Dashboard Admin** `/admin-dashboard` - Espace administrateur

---

## 🔧 Commandes Utiles

### Gestion de la Base de Données
```bash
# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Peupler les données par défaut
python manage.py populate_data

# Vider la base de données
python manage.py flush
```

### Gestion des Utilisateurs
```bash
# Créer un superuser
python manage.py createsuperuser

# Changer le mot de passe d'un utilisateur
python manage.py changepassword username
```

### Tests
```bash
# Exécuter les tests
python manage.py test

# Exécuter les tests avec coverage
coverage run --source='.' manage.py test
coverage report
```

---

## 🌐 API Endpoints Publics

Tous les endpoints suivants sont accessibles sans authentification:

```
GET  /api/cms/settings/current/      - Paramètres du site
GET  /api/cms/services/              - Services
GET  /api/cms/testimonials/          - Témoignages
GET  /api/cms/partners/              - Partenaires
GET  /api/cms/blog/                  - Articles de blog
GET  /api/cms/job-offers/            - Offres d'emploi
GET  /api/agencies/                  - Agences
GET  /api/hr/employees/key_staff/    - Responsables clés
POST /api/cms/leads/                 - Soumettre un formulaire de contact
```

---

## 🔐 Authentification

### Obtenir un Token JWT
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

### Utiliser le Token
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/protected-endpoint/
```

---

## 📱 Responsive Design

Le site est optimisé pour:
- ✅ Mobile (< 640px)
- ✅ Tablet (640px - 1024px)
- ✅ Desktop (> 1024px)

Testez sur différentes résolutions avec les DevTools du navigateur.

---

## 🎨 Personnalisation

### Changer les Couleurs
Modifier `frontend/src/app/globals.css` ou les classes Tailwind dans les fichiers `.tsx`

### Changer le Logo
Remplacer l'image dans `frontend/public/` et mettre à jour les références

### Changer le Contenu
Modifier les données via l'admin Django: http://localhost:8000/mwoloboss/

---

## 🐛 Dépannage

### Erreur: Port déjà utilisé
```bash
# Trouver le processus utilisant le port
lsof -i :8000  # Linux/Mac
netstat -ano | findstr :8000  # Windows

# Tuer le processus
kill -9 PID  # Linux/Mac
taskkill /PID PID /F  # Windows
```

### Erreur: Base de données non trouvée
```bash
# Créer la base de données
python manage.py migrate
python manage.py populate_data
```

### Erreur: Module non trouvé
```bash
# Réinstaller les dépendances
pip install -r requirements.txt
npm install
```

### Erreur: 401 Unauthorized
- Vérifier que Django est redémarré après les changements de settings.py
- Vérifier que le token JWT est valide
- Vérifier que l'endpoint n'est pas protégé

---

## 📚 Documentation Complète

Pour plus de détails, consultez:
- `README.md` - Vue d'ensemble du projet
- `CONFIGURATION.md` - Configuration détaillée
- `API_DOCUMENTATION.md` - Documentation API complète
- `DEPLOYMENT.md` - Guide de déploiement
- `TESTING.md` - Guide de test

---

## 🚀 Déploiement en Production

Voir `DEPLOYMENT.md` pour les instructions complètes.

Résumé:
1. Configurer les variables d'environnement
2. Configurer la base de données de production
3. Collecter les fichiers statiques: `python manage.py collectstatic`
4. Configurer le serveur web (Nginx/Apache)
5. Configurer le serveur d'application (Gunicorn/uWSGI)
6. Configurer SSL/TLS
7. Configurer les sauvegardes

---

## 📞 Support

Pour toute question ou problème:
1. Vérifier la documentation
2. Consulter les logs: `python manage.py runserver` affiche les erreurs
3. Vérifier la console du navigateur (F12)
4. Consulter les issues GitHub

---

**Bon développement! 🎉**
