#!/bin/bash

# Script d'installation pour Linux/macOS

echo "========================================"
echo "Mwolo Energy Systems - Installation"
echo "========================================"
echo ""

# 1. Créer l'environnement virtuel
echo "[1/6] Création de l'environnement virtuel..."
python3 -m venv venv
if [ $? -ne 0 ]; then
    echo "Erreur: Impossible de créer l'environnement virtuel"
    exit 1
fi
echo "OK"
echo ""

# 2. Activer l'environnement virtuel
echo "[2/6] Activation de l'environnement virtuel..."
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo "Erreur: Impossible d'activer l'environnement virtuel"
    exit 1
fi
echo "OK"
echo ""

# 3. Installer les dépendances
echo "[3/6] Installation des dépendances..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Erreur: Impossible d'installer les dépendances"
    exit 1
fi
echo "OK"
echo ""

# 4. Appliquer les migrations
echo "[4/6] Application des migrations..."
python manage.py migrate
if [ $? -ne 0 ]; then
    echo "Erreur: Impossible d'appliquer les migrations"
    exit 1
fi
echo "OK"
echo ""

# 5. Initialiser les données
echo "[5/6] Initialisation des données..."
python manage.py init_data
if [ $? -ne 0 ]; then
    echo "Erreur: Impossible d'initialiser les données"
    exit 1
fi
echo "OK"
echo ""

# 6. Lancer le serveur
echo "[6/6] Lancement du serveur..."
echo ""
echo "========================================"
echo "Installation terminée!"
echo "========================================"
echo ""
echo "Admin: http://localhost:8000/mwoloboss/"
echo "Username: admin"
echo "Password: admin123"
echo ""
echo "API: http://localhost:8000/api/"
echo "Docs: http://localhost:8000/api/docs/"
echo ""
echo "Lancement du serveur..."
echo ""

python manage.py runserver
