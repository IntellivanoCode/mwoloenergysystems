#!/usr/bin/env bash
# Mwolo Energy Systems - Build Script for Render
# Ce script est exécuté à chaque déploiement

set -o errexit  # Exit on error

echo "🔧 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements_production.txt

echo "📦 Collecting static files..."
python manage.py collectstatic --no-input

echo "🗃️ Running database migrations..."
python manage.py migrate --no-input

echo "👤 Creating superuser if not exists..."
python manage.py shell -c "
from accounts.models import User
if not User.objects.filter(email='admin@mwolo.energy').exists():
    User.objects.create_superuser(
        email='admin@mwolo.energy',
        password='MwoloAdmin2026!',
        first_name='Admin',
        last_name='Mwolo',
        role='admin'
    )
    print('Superuser created: admin@mwolo.energy')
else:
    print('Superuser already exists')
"

echo "🌱 Loading initial data if empty..."
python manage.py shell -c "
from agencies.models import Agency
from cms.models import Service
if not Agency.objects.exists():
    print('Loading initial agencies...')
    Agency.objects.create(
        name='Agence Centrale Kinshasa',
        code='KIN-001',
        address='123 Avenue de la Paix',
        city='Kinshasa',
        phone='+243 123 456 789',
        is_active=True
    )
if not Service.objects.exists():
    print('Loading initial services...')
    Service.objects.create(
        name='Installation Solaire',
        slug='installation-solaire',
        description='Installation de panneaux solaires',
        icon='sun',
        is_active=True
    )
print('Initial data loaded')
"

echo "✅ Build completed successfully!"
