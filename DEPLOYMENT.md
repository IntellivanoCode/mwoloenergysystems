# Guide de Déploiement - Mwolo Energy Systems

## Déploiement Local avec Docker

### Prérequis
- Docker
- Docker Compose

### Étapes

1. Cloner le repo
```bash
git clone <repo-url>
cd mwolo-energy-systems
```

2. Créer le fichier .env
```bash
cp .env.example .env
# Éditer .env avec vos paramètres
```

3. Lancer les services
```bash
docker-compose up -d
```

4. Exécuter les migrations
```bash
docker-compose exec web python manage.py migrate
```

5. Initialiser les données
```bash
docker-compose exec web python manage.py init_data
```

6. Créer un superadmin (optionnel)
```bash
docker-compose exec web python manage.py createsuperuser
```

7. Accéder à l'application
- Admin: http://localhost:8000/admin/
- API: http://localhost:8000/api/
- Docs: http://localhost:8000/api/docs/

## Déploiement en Production

### Prérequis
- Serveur Linux (Ubuntu 20.04+)
- PostgreSQL 12+
- Redis 6+
- Nginx
- Certbot (pour SSL)

### Installation

1. Installer les dépendances système
```bash
sudo apt-get update
sudo apt-get install -y python3.11 python3.11-venv python3-pip \
  postgresql postgresql-contrib redis-server nginx certbot python3-certbot-nginx
```

2. Créer un utilisateur pour l'application
```bash
sudo useradd -m -s /bin/bash mwolo
sudo su - mwolo
```

3. Cloner le repo
```bash
git clone <repo-url>
cd mwolo-energy-systems
```

4. Créer l'environnement virtuel
```bash
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn
```

5. Configurer les variables d'environnement
```bash
cp .env.example .env
nano .env
# Configurer pour la production
```

6. Exécuter les migrations
```bash
python manage.py migrate
python manage.py init_data
python manage.py collectstatic --noinput
```

7. Créer un service systemd pour Gunicorn
```bash
sudo nano /etc/systemd/system/mwolo-web.service
```

Contenu:
```ini
[Unit]
Description=Mwolo Energy Systems Web Service
After=network.target

[Service]
Type=notify
User=mwolo
WorkingDirectory=/home/mwolo/mwolo-energy-systems
Environment="PATH=/home/mwolo/mwolo-energy-systems/venv/bin"
ExecStart=/home/mwolo/mwolo-energy-systems/venv/bin/gunicorn \
  --workers 4 \
  --bind unix:/home/mwolo/mwolo-energy-systems/gunicorn.sock \
  config.wsgi:application

[Install]
WantedBy=multi-user.target
```

8. Créer un service systemd pour Celery
```bash
sudo nano /etc/systemd/system/mwolo-celery.service
```

Contenu:
```ini
[Unit]
Description=Mwolo Energy Systems Celery Service
After=network.target

[Service]
Type=forking
User=mwolo
WorkingDirectory=/home/mwolo/mwolo-energy-systems
Environment="PATH=/home/mwolo/mwolo-energy-systems/venv/bin"
ExecStart=/home/mwolo/mwolo-energy-systems/venv/bin/celery -A config worker \
  --loglevel=info \
  --logfile=/home/mwolo/mwolo-energy-systems/logs/celery.log \
  --pidfile=/home/mwolo/mwolo-energy-systems/celery.pid

[Install]
WantedBy=multi-user.target
```

9. Démarrer les services
```bash
sudo systemctl daemon-reload
sudo systemctl start mwolo-web
sudo systemctl start mwolo-celery
sudo systemctl enable mwolo-web
sudo systemctl enable mwolo-celery
```

10. Configurer Nginx
```bash
sudo nano /etc/nginx/sites-available/mwolo
```

Contenu:
```nginx
upstream mwolo {
    server unix:/home/mwolo/mwolo-energy-systems/gunicorn.sock fail_timeout=0;
}

server {
    listen 80;
    server_name your-domain.com;

    client_max_body_size 100M;

    location /static/ {
        alias /home/mwolo/mwolo-energy-systems/staticfiles/;
    }

    location /media/ {
        alias /home/mwolo/mwolo-energy-systems/media/;
    }

    location / {
        proxy_pass http://mwolo;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

11. Activer le site Nginx
```bash
sudo ln -s /etc/nginx/sites-available/mwolo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

12. Configurer SSL avec Certbot
```bash
sudo certbot --nginx -d your-domain.com
```

## Sauvegarde et Maintenance

### Sauvegarde de la base de données
```bash
pg_dump -U postgres mwolo_db > backup_$(date +%Y%m%d).sql
```

### Restauration
```bash
psql -U postgres mwolo_db < backup_20260201.sql
```

### Logs
```bash
# Logs Gunicorn
tail -f /var/log/mwolo/gunicorn.log

# Logs Celery
tail -f /home/mwolo/mwolo-energy-systems/logs/celery.log

# Logs Nginx
tail -f /var/log/nginx/error.log
```

## Monitoring

### Vérifier le statut des services
```bash
sudo systemctl status mwolo-web
sudo systemctl status mwolo-celery
```

### Redémarrer les services
```bash
sudo systemctl restart mwolo-web
sudo systemctl restart mwolo-celery
```

## Mise à Jour

1. Arrêter les services
```bash
sudo systemctl stop mwolo-web mwolo-celery
```

2. Mettre à jour le code
```bash
cd /home/mwolo/mwolo-energy-systems
git pull origin main
```

3. Installer les nouvelles dépendances
```bash
source venv/bin/activate
pip install -r requirements.txt
```

4. Exécuter les migrations
```bash
python manage.py migrate
```

5. Collecter les fichiers statiques
```bash
python manage.py collectstatic --noinput
```

6. Redémarrer les services
```bash
sudo systemctl start mwolo-web mwolo-celery
```

## Troubleshooting

### Erreur de connexion à la base de données
```bash
# Vérifier que PostgreSQL est en cours d'exécution
sudo systemctl status postgresql

# Vérifier les paramètres de connexion dans .env
```

### Erreur Celery
```bash
# Vérifier que Redis est en cours d'exécution
sudo systemctl status redis-server

# Vérifier les logs Celery
tail -f /home/mwolo/mwolo-energy-systems/logs/celery.log
```

### Erreur Nginx
```bash
# Vérifier la configuration
sudo nginx -t

# Vérifier les logs
tail -f /var/log/nginx/error.log
```
