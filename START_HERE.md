# 🚀 COMMENCER ICI

## Installation Automatique (Recommandé)

### Windows

Double-cliquez sur `setup.bat` ou exécutez:

```bash
setup.bat
```

### Linux / macOS

Exécutez:

```bash
chmod +x setup.sh
./setup.sh
```

---

## Installation Manuelle (Étape par Étape)

### Windows

```bash
# 1. Créer l'environnement virtuel
python -m venv venv

# 2. Activer l'environnement virtuel
venv\Scripts\activate

# 3. Installer les dépendances
pip install -r requirements.txt

# 4. Appliquer les migrations
python manage.py migrate

# 5. Initialiser les données
python manage.py init_data

# 6. Lancer le serveur
python manage.py runserver
```

### Linux / macOS

```bash
# 1. Créer l'environnement virtuel
python3 -m venv venv

# 2. Activer l'environnement virtuel
source venv/bin/activate

# 3. Installer les dépendances
pip install -r requirements.txt

# 4. Appliquer les migrations
python manage.py migrate

# 5. Initialiser les données
python manage.py init_data

# 6. Lancer le serveur
python manage.py runserver
```

---

## Accès

Une fois le serveur lancé:

### Admin
- **URL**: `http://localhost:8000/mwoloboss/`
- **Username**: `admin`
- **Password**: `admin123`

### API
- **URL**: `http://localhost:8000/api/`
- **Docs**: `http://localhost:8000/api/docs/`

---

## Configuration

### Base de Données MySQL
- **Database**: `mwoloenerysystems`
- **User**: `root`
- **Password**: `14041999No@`
- **Host**: `localhost`
- **Port**: `3306`

### Fichier .env
Le fichier `.env` est déjà configuré avec les credentials MySQL.

---

## Prochaines Étapes

1. ✅ Installation complétée
2. 📖 Lire `README.md` pour la vue d'ensemble
3. 🔧 Consulter `API_DOCUMENTATION.md` pour les endpoints
4. 🧪 Lancer les tests: `pytest`
5. 🚀 Développer le frontend

---

## Commandes Utiles

### Réactiver l'Environnement Virtuel

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/macOS:**
```bash
source venv/bin/activate
```

### Lancer les Tests

```bash
pytest
```

### Lancer Celery

```bash
celery -A config worker -l info
```

### Créer un Superadmin

```bash
python manage.py createsuperuser
```

### Exporter les Données

```bash
python manage.py dumpdata > backup.json
```

---

## Troubleshooting

### Erreur: "python: command not found"

Utiliser `python3`:
```bash
python3 -m venv venv
```

### Erreur: "No module named 'django'"

L'environnement virtuel n'est pas activé. Vérifier que vous voyez `(venv)` au début du terminal.

### Erreur: "Access denied for user 'root'"

Vérifier le mot de passe MySQL dans `.env`:
```
DB_PASSWORD=14041999No@
```

### Erreur: "Unknown database 'mwoloenerysystems'"

Créer la base de données MySQL:
```bash
mysql -u root -p14041999No@ -e "CREATE DATABASE mwoloenerysystems CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

---

## Documentation

- `INSTALLATION_COMPLETE.md` - Guide d'installation complet
- `README.md` - Vue d'ensemble du projet
- `QUICKSTART.md` - Démarrage rapide (5 min)
- `GETTING_STARTED.md` - Guide détaillé
- `API_DOCUMENTATION.md` - Documentation API
- `MYSQL_SETUP.md` - Configuration MySQL
- `FAQ.md` - Questions fréquentes

---

## Support

Pour toute question:
1. Consulter la documentation
2. Vérifier la FAQ
3. Ouvrir une issue

---

**Bon développement! 🎉**
