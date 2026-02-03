# 🧪 Guide de test - Mwolo Energy Systems Phase 2

## 🚀 Démarrage rapide

### 1. Backend Django
```bash
cd mwolo-energy-systems
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
python manage.py migrate
python manage.py init_data
python manage.py runserver
```

**Admin** : http://localhost:8000/mwoloboss/
- Utilisateur : admin
- Mot de passe : admin123

### 2. Frontend Next.js
```bash
cd frontend
npm install
npm run dev
```

**Site** : http://localhost:3000/

---

## 📋 Checklist de test

### 1. Site Vitrine
- [ ] Accueil charge correctement
- [ ] Services s'affichent (depuis Django)
- [ ] Témoignages s'affichent
- [ ] Partenaires s'affichent
- [ ] Navigation fonctionne
- [ ] Footer complet

### 2. Pages dynamiques
- [ ] Page Agences charge les agences
- [ ] Sélection d'agence fonctionne
- [ ] Google Maps link fonctionne
- [ ] Page Équipements charge les responsables
- [ ] Informations complètes affichées
- [ ] Page Actualités charge les articles

### 3. Authentification
- [ ] Inscription fonctionne
- [ ] Post-nom sauvegardé
- [ ] Connexion fonctionne
- [ ] Dashboard accessible
- [ ] Déconnexion fonctionne

### 4. Admin Django
- [ ] CMS → Services accessible
- [ ] CMS → Articles accessible
- [ ] CMS → Partenaires accessible
- [ ] CMS → Témoignages accessible
- [ ] Agences → Liste accessible
- [ ] HR → Employés accessible

### 5. API REST
- [ ] GET /api/cms/services/ → retourne les services
- [ ] GET /api/cms/blog/ → retourne les articles
- [ ] GET /api/cms/partners/ → retourne les partenaires
- [ ] GET /api/agencies/ → retourne les agences
- [ ] GET /api/hr/employees/key_staff/ → retourne les responsables

---

## 🧪 Tests détaillés

### Test 1 : Ajouter un service
1. Aller sur http://localhost:8000/mwoloboss/
2. CMS → Services → Ajouter
3. Remplir le formulaire
4. Sauvegarder
5. Aller sur http://localhost:3000/
6. Vérifier que le service apparaît

### Test 2 : Ajouter un partenaire
1. Admin → CMS → Partenaires → Ajouter
2. Remplir le formulaire
3. Sauvegarder
4. Aller sur http://localhost:3000/
5. Vérifier que le partenaire apparaît

### Test 3 : Ajouter une agence
1. Admin → Agences → Ajouter
2. Remplir le formulaire
3. Sauvegarder
4. Aller sur http://localhost:3000/agencies
5. Vérifier que l'agence apparaît

### Test 4 : Ajouter un responsable
1. Admin → HR → Employés → Ajouter
2. Remplir le formulaire (position = "Directeur")
3. Sauvegarder
4. Aller sur http://localhost:3000/equipment
5. Vérifier que le responsable apparaît

### Test 5 : Ajouter un article
1. Admin → CMS → Articles → Ajouter
2. Remplir le formulaire
3. Publier
4. Aller sur http://localhost:3000/news
5. Vérifier que l'article apparaît

### Test 6 : Inscription client
1. Aller sur http://localhost:3000/register
2. Remplir le formulaire (inclure post-nom)
3. S'inscrire
4. Vérifier que l'utilisateur est créé en admin
5. Vérifier que le post-nom est sauvegardé

### Test 7 : Connexion et dashboard
1. Aller sur http://localhost:3000/login
2. Se connecter avec les identifiants créés
3. Vérifier que le dashboard s'affiche
4. Vérifier que les données sont synchronisées

---

## 🔍 Vérifications API

### Tester les endpoints avec curl

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

# Témoignages
curl http://localhost:8000/api/cms/testimonials/

# Paramètres du site
curl http://localhost:8000/api/cms/settings/current/
```

---

## 🐛 Dépannage

### Le frontend ne charge pas les données
1. Vérifier que le backend est en cours d'exécution
2. Vérifier que l'API est accessible
3. Vérifier la console du navigateur pour les erreurs
4. Vérifier que CORS est configuré

### Les données ne s'affichent pas
1. Vérifier que les données existent en admin
2. Vérifier que les données sont publiées (is_published=True)
3. Vérifier que l'API retourne les données
4. Vérifier que le frontend consomme l'API correctement

### Erreur de migration
1. Supprimer la base de données
2. Relancer les migrations
3. Relancer init_data

### Erreur d'authentification
1. Vérifier les identifiants
2. Vérifier que l'utilisateur existe
3. Vérifier que le JWT est configuré

---

## 📊 Données de test

### Services à ajouter
```
1. Distribution d'énergie
2. Facturation automatisée
3. Support 24/7
4. Maintenance préventive
5. Monitoring en temps réel
```

### Partenaires à ajouter
```
1. Partenaire 1
2. Partenaire 2
3. Partenaire 3
4. Partenaire 4
```

### Articles à ajouter
```
1. Actualité 1
2. Actualité 2
3. Actualité 3
```

### Agences à ajouter
```
1. Kinshasa - Centre
2. Kinshasa - Ouest
3. Kasai - Centre
```

### Responsables à ajouter
```
1. Directeur Général
2. Responsable RH
3. Responsable Opérations
4. Responsable Facturation
```

---

## ✅ Validation finale

- [ ] Tous les tests passent
- [ ] Aucune erreur en console
- [ ] Aucune erreur en backend
- [ ] Données synchronisées
- [ ] Design responsive
- [ ] Navigation fonctionne
- [ ] Authentification fonctionne
- [ ] API fonctionne
- [ ] Admin fonctionne

---

## 🎉 Résultat

Si tous les tests passent, le système est prêt pour :
- ✅ Production
- ✅ Utilisation
- ✅ Évolution

---

**Date** : 2026-02-01
**Version** : 2.0.0
