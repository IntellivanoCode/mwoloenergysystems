# 🚀 DÉMARRER MAINTENANT - Mwolo Energy Systems

## ⚡ En 3 étapes

### Étape 1 : Backend Django (Terminal 1)

```bash
cd mwolo-energy-systems

# Activer le venv
venv\Scripts\activate  # Windows
# ou
source venv/bin/activate  # Linux/Mac

# Démarrer le serveur
python manage.py runserver
```

✅ Backend prêt sur http://localhost:8000

### Étape 2 : Frontend Next.js (Terminal 2)

```bash
cd mwolo-energy-systems/frontend

# Démarrer le serveur
npm run dev
```

✅ Frontend prêt sur http://localhost:3000

### Étape 3 : Accéder au site

- **Site vitrine** : http://localhost:3000/
- **Admin** : http://localhost:8000/mwoloboss/
- **API Docs** : http://localhost:8000/api/docs/

---

## 🔑 Identifiants

| Rôle | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |

---

## 📱 Pages à tester

### Site Vitrine
- http://localhost:3000/ - Accueil (dynamique)
- http://localhost:3000/agencies - Agences
- http://localhost:3000/equipment - Responsables clés
- http://localhost:3000/news - Actualités
- http://localhost:3000/about - À propos
- http://localhost:3000/services - Services
- http://localhost:3000/contact - Contact

### Authentification
- http://localhost:3000/login - Connexion
- http://localhost:3000/register - Inscription
- http://localhost:3000/dashboard - Dashboard

### Admin
- http://localhost:8000/mwoloboss/ - Admin Django

---

## 🎯 Premiers tests

### Test 1 : Ajouter un service
1. Aller sur http://localhost:8000/mwoloboss/
2. CMS → Services → Ajouter
3. Remplir le formulaire
4. Sauvegarder
5. Aller sur http://localhost:3000/
6. Vérifier que le service apparaît

### Test 2 : Ajouter une agence
1. Admin → Agences → Ajouter
2. Remplir le formulaire
3. Sauvegarder
4. Aller sur http://localhost:3000/agencies
5. Vérifier que l'agence apparaît

### Test 3 : S'inscrire
1. Aller sur http://localhost:3000/register
2. Remplir le formulaire
3. S'inscrire
4. Vérifier que l'utilisateur est créé en admin
5. Se connecter et accéder au dashboard

---

## 📊 Données à ajouter

### Services (Admin → CMS → Services)
```
1. Distribution d'énergie
2. Facturation automatisée
3. Support 24/7
4. Maintenance préventive
5. Monitoring en temps réel
```

### Partenaires (Admin → CMS → Partenaires)
```
1. Partenaire 1
2. Partenaire 2
3. Partenaire 3
```

### Articles (Admin → CMS → Articles)
```
1. Actualité 1
2. Actualité 2
3. Actualité 3
```

### Agences (Admin → Agences)
```
1. Kinshasa - Centre
2. Kinshasa - Ouest
3. Kasai - Centre
```

### Responsables (Admin → HR → Employés)
```
Position = "Directeur" ou "Responsable" ou "Chef"
```

---

## 🔍 Vérifier l'API

```bash
# Services
curl http://localhost:8000/api/cms/services/

# Articles
curl http://localhost:8000/api/cms/blog/

# Partenaires
curl http://localhost:8000/api/cms/partners/

# Agences
curl http://localhost:8000/api/agencies/

# Responsables clés
curl http://localhost:8000/api/hr/employees/key_staff/
```

---

## 🐛 Dépannage rapide

### Le frontend ne charge pas les données
```bash
# Vérifier que le backend est en cours d'exécution
# Vérifier la console du navigateur (F12)
# Vérifier que l'API retourne les données
```

### Erreur de migration
```bash
python manage.py migrate
```

### Erreur de dépendances
```bash
pip install -r requirements.txt
npm install
```

---

## 📚 Documentation

- `FINAL_SUMMARY.md` - Résumé complet
- `PHASE_2_COMPLETE.md` - Améliorations Phase 2
- `TEST_GUIDE.md` - Guide de test détaillé
- `PROJECT_COMPLETE.md` - Vue d'ensemble

---

## ✅ Checklist

- [ ] Backend démarre sans erreur
- [ ] Frontend démarre sans erreur
- [ ] Admin accessible
- [ ] Site vitrine charge
- [ ] API fonctionne
- [ ] Services s'affichent
- [ ] Agences s'affichent
- [ ] Responsables s'affichent
- [ ] Inscription fonctionne
- [ ] Connexion fonctionne

---

## 🎉 Vous êtes prêt !

Commencez à explorer et à tester Mwolo Energy Systems.

Amusez-vous ! 🚀

---

**Date** : 2026-02-01
**Version** : 2.0.0
