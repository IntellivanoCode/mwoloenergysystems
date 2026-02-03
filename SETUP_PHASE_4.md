# Configuration Phase 4 - Instructions Complètes

## ⚠️ IMPORTANT - À FAIRE DANS CET ORDRE

### Étape 1: Appliquer les migrations

```bash
cd mwolo-energy-systems
python manage.py migrate cms
```

Cela créera:
- Table `cms_joboffer` pour les offres d'emploi
- Colonnes `hero_background_url` et `hero_video_url` dans `cms_sitesettings`

### Étape 2: Peupler les données par défaut

```bash
python manage.py populate_data
```

Cela créera:
- Services
- Témoignages
- Partenaires
- Articles de blog
- Paramètres du site

### Étape 3: Créer des offres d'emploi (optionnel)

Via l'admin Django:
```
http://localhost:8000/mwoloboss/cms/joboffer/
```

Ou via la ligne de commande:

```bash
python manage.py shell

from cms.models import JobOffer
from datetime import datetime, timedelta

JobOffer.objects.create(
    title="Ingénieur Logiciel",
    slug="ingenieur-logiciel",
    description="Nous recherchons un ingénieur logiciel expérimenté...",
    requirements="5+ ans d'expérience en Python et Django...",
    benefits="Salaire compétitif, assurance maladie, télétravail...",
    department="Développement",
    location="Kinshasa",
    contract_type="CDI",
    salary_min=2000,
    salary_max=3500,
    currency="USD",
    status="ouvert",
    deadline=datetime.now() + timedelta(days=30),
    is_featured=True,
    order=1
)
```

### Étape 4: Redémarrer les serveurs

```bash
# Terminal 1 - Backend
python manage.py runserver

# Terminal 2 - Frontend
npm run dev
```

### Étape 5: Vérifier les changements

Visitez:
- http://localhost:3000 - Home page
- http://localhost:3000/careers - Page Carrières
- http://localhost:3000/register - Inscription avec post-nom
- http://localhost:8000/mwoloboss/cms/joboffer/ - Admin Carrières
- http://localhost:8000/api/cms/job-offers/ - API Carrières (publique)
- http://localhost:8000/api/cms/settings/current/ - Paramètres du site (publique)

## ✅ Vérifications

- [ ] Migrations appliquées sans erreur
- [ ] Données peuplées
- [ ] Admin Django affiche JobOffer
- [ ] API endpoints accessibles (sans authentification)
- [ ] Home page charge les paramètres du site
- [ ] Page Carrières affiche les offres
- [ ] Formulaire d'inscription affiche le post-nom
- [ ] Pas d'erreurs 401 dans la console

## 🔧 Dépannage

### Erreur: "Unknown column"

Si vous recevez cette erreur, assurez-vous que:
1. La migration a été appliquée: `python manage.py migrate cms`
2. La base de données a été mise à jour

### Erreur: "404 Not Found" sur /api/cms/job-offers/

Si vous recevez cette erreur, assurez-vous que:
1. Les URLs ont été mises à jour dans `cms/urls.py`
2. Le serveur Django a été redémarré

### Erreur: "401 Unauthorized" sur les endpoints

Les endpoints CMS doivent être publics (AllowAny). Vérifiez que:
1. `permission_classes = [AllowAny]` est défini dans les viewsets
2. Les vues CMS ont été mises à jour

## 📝 Fichiers modifiés

- `cms/models.py` - Ajout du modèle JobOffer
- `cms/migrations/0003_joboffer_sitesettings_hero.py` - Migration
- `cms/admin.py` - Enregistrement de JobOffer
- `cms/views.py` - Ajout de JobOfferViewSet
- `cms/serializers.py` - Ajout de JobOfferSerializer
- `cms/urls.py` - Ajout de la route job-offers
- `frontend/src/app/careers/page.tsx` - Page Carrières
- `frontend/src/app/register/page.tsx` - Post-nom ajouté
- `frontend/src/components/Header.tsx` - Lien Carrières

## 🚀 Prochaines étapes

1. Ajouter les informations GPS aux agences
2. Créer un endpoint pour les témoignages publics
3. Ajouter les fonds d'images à toutes les pages
4. Tester la synchronisation complète

## Support

Email: support@mwolo.energy
Téléphone: +243 123 456 789
