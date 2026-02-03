# Instructions de Migration - Phase 4

## Étapes pour appliquer les changements

### 1. Créer les migrations Django

```bash
cd mwolo-energy-systems
python manage.py makemigrations cms
```

Cela créera une migration pour le nouveau modèle `JobOffer`.

### 2. Appliquer les migrations

```bash
python manage.py migrate
```

### 3. Peupler les données par défaut

```bash
python manage.py populate_data
```

Cela créera les services, témoignages, partenaires et articles par défaut.

### 4. Créer des offres d'emploi (optionnel)

Vous pouvez créer des offres d'emploi via l'admin Django:

```
http://localhost:8000/mwoloboss/cms/joboffer/
```

Ou via la ligne de commande:

```python
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

### 5. Mettre à jour les paramètres du site

Allez dans l'admin Django et mettez à jour les paramètres du site:

```
http://localhost:8000/mwoloboss/cms/sitesettings/
```

Ajoutez:
- `hero_background_url`: URL d'une image de fond
- `hero_video_url`: URL d'une vidéo (optionnel)

### 6. Redémarrer les serveurs

```bash
# Terminal 1 - Backend
python manage.py runserver

# Terminal 2 - Frontend
npm run dev
```

### 7. Vérifier les changements

Visitez:
- http://localhost:3000 - Home page avec nouvelles couleurs
- http://localhost:3000/careers - Page Carrières
- http://localhost:3000/register - Formulaire d'inscription avec post-nom
- http://localhost:8000/mwoloboss/ - Admin Django

## Fichiers modifiés

### Backend
- `cms/models.py` - Ajout du modèle `JobOffer`
- `cms/admin.py` - Enregistrement du modèle dans l'admin

### Frontend
- `frontend/src/app/page.tsx` - Nouvelles couleurs et synchronisation
- `frontend/src/app/careers/page.tsx` - Nouvelle page Carrières
- `frontend/src/app/register/page.tsx` - Ajout du post-nom
- `frontend/src/components/Header.tsx` - Lien Carrières et nouvelles couleurs

## Vérification

### Checklist de vérification

- [ ] Migrations créées et appliquées
- [ ] Données par défaut peuplées
- [ ] Offres d'emploi créées
- [ ] Paramètres du site mis à jour
- [ ] Serveurs redémarrés
- [ ] Home page affiche les nouvelles couleurs
- [ ] Page Carrières fonctionne
- [ ] Formulaire d'inscription affiche le post-nom
- [ ] Header affiche le lien Carrières
- [ ] Pas d'erreurs dans la console

## Dépannage

### Erreur: "No changes detected"

Si vous recevez cette erreur lors de `makemigrations`, assurez-vous que:
1. Le fichier `cms/models.py` a été modifié
2. L'application `cms` est dans `INSTALLED_APPS`
3. Vous êtes dans le bon répertoire

### Erreur: "Table already exists"

Si vous recevez cette erreur lors de `migrate`, essayez:

```bash
python manage.py migrate cms --fake-initial
```

### Erreur: "JobOffer matching query does not exist"

Si vous recevez cette erreur, assurez-vous que:
1. Les migrations ont été appliquées
2. Les données ont été peuplées
3. L'API endpoint est correct

## Rollback

Si vous devez revenir en arrière:

```bash
# Voir l'historique des migrations
python manage.py showmigrations cms

# Revenir à une migration précédente
python manage.py migrate cms 0001_initial
```

## Support

Pour toute question ou problème:
- Email: support@mwolo.energy
- Téléphone: +243 123 456 789
- Adresse: Kinshasa, RDC
