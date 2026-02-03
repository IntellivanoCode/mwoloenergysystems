# Démarrage Rapide - 5 Minutes

## 1. Installation (2 min)

```bash
# Créer l'environnement virtuel
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt
```

## 2. Configuration (1 min)

```bash
# Copier le fichier .env
cp .env.example .env
```

## 3. Base de Données (1 min)

```bash
# Créer les migrations
python manage.py migrate

# Initialiser les données
python manage.py init_data
```

## 4. Lancer le Serveur (1 min)

```bash
# Démarrer Django
python manage.py runserver
```

## Accès

- **Admin**: http://localhost:8000/admin/
  - Username: `admin`
  - Password: `admin123`

- **API**: http://localhost:8000/api/
- **Docs**: http://localhost:8000/api/docs/

## Prochaines Étapes

1. Lire [README.md](README.md)
2. Lire [GETTING_STARTED.md](GETTING_STARTED.md)
3. Consulter [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
4. Lancer les tests: `pytest`

## Commandes Utiles

```bash
# Créer un superadmin
python manage.py createsuperuser

# Lancer les tests
pytest

# Lancer Celery
celery -A config worker -l info

# Lancer Celery Beat
celery -A config beat -l info

# Lancer avec Docker
docker-compose up -d
```

## Troubleshooting

### Erreur: "ModuleNotFoundError: No module named 'django'"
```bash
pip install -r requirements.txt
```

### Erreur: "no such table"
```bash
python manage.py migrate
```

### Erreur: "Port already in use"
```bash
python manage.py runserver 8001
```

## Besoin d'Aide?

- Consulter [FAQ.md](FAQ.md)
- Lire [GETTING_STARTED.md](GETTING_STARTED.md)
- Ouvrir une issue

---

**Bon développement! 🚀**
