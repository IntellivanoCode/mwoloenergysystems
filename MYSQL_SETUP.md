# Configuration MySQL

## Credentials

- **Database**: `mwoloenerysystems`
- **User**: `root`
- **Password**: `14041999No@`
- **Host**: `localhost`
- **Port**: `3306`

## Installation

### 1. Installer mysqlclient

```bash
pip install mysqlclient
```

### 2. Vérifier la Connexion

```bash
mysql -u root -p14041999No@ -h localhost
```

### 3. Créer la Base de Données (si nécessaire)

```sql
CREATE DATABASE mwoloenerysystems CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Appliquer les Migrations

```bash
python manage.py migrate
```

### 5. Initialiser les Données

```bash
python manage.py init_data
```

## Configuration Django

Le fichier `.env` est déjà configuré avec:

```
DB_ENGINE=django.db.backends.mysql
DB_NAME=mwoloenerysystems
DB_USER=root
DB_PASSWORD=14041999No@
DB_HOST=localhost
DB_PORT=3306
```

## Accès Admin

- **URL**: `http://localhost:8000/mwoloboss/`
- **Username**: `admin`
- **Password**: `admin123`

## Troubleshooting

### Erreur: "No module named 'MySQLdb'"

```bash
pip install mysqlclient
```

### Erreur: "Access denied for user 'root'"

Vérifier le mot de passe dans `.env`:
```
DB_PASSWORD=14041999No@
```

### Erreur: "Unknown database 'mwoloenerysystems'"

Créer la base de données:
```sql
CREATE DATABASE mwoloenerysystems CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Commandes Utiles

```bash
# Lancer le serveur
python manage.py runserver

# Créer les migrations
python manage.py makemigrations

# Appliquer les migrations
python manage.py migrate

# Initialiser les données
python manage.py init_data

# Créer un superadmin
python manage.py createsuperuser

# Lancer les tests
pytest
```

## Sécurité

⚠️ **IMPORTANT**: Ne pas commiter le fichier `.env` avec les credentials!

Ajouter à `.gitignore`:
```
.env
.env.local
```

Pour la production, utiliser des variables d'environnement sécurisées.
