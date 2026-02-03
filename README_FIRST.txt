================================================================================
MWOLO ENERGY SYSTEMS - LIRE D'ABORD
================================================================================

BIENVENUE! 🎉

Ce fichier contient les informations essentielles pour démarrer.

================================================================================
DÉMARRAGE RAPIDE (5 MINUTES)
================================================================================

1. INSTALLATION AUTOMATIQUE (Recommandé)

   Windows:
   - Double-cliquez sur "setup.bat"
   OU
   - Exécutez: setup.bat

   Linux/macOS:
   - Exécutez: chmod +x setup.sh && ./setup.sh

2. INSTALLATION MANUELLE

   Windows:
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py init_data
   python manage.py runserver

   Linux/macOS:
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py init_data
   python manage.py runserver

3. ACCÈS

   Admin: http://localhost:8000/mwoloboss/
   Username: admin
   Password: admin123

   API: http://localhost:8000/api/
   Docs: http://localhost:8000/api/docs/

================================================================================
FICHIERS IMPORTANTS À LIRE
================================================================================

1. START_HERE.md
   - Guide de démarrage complet
   - Installation automatique et manuelle
   - Troubleshooting

2. INSTALLATION_COMPLETE.md
   - Instructions détaillées étape par étape
   - Vérifications
   - Commandes utiles

3. QUICK_COMMANDS.md
   - Commandes rapides à copier-coller
   - Raccourcis
   - Commandes de développement

4. README.md
   - Vue d'ensemble du projet
   - Stack technique
   - Structure

5. API_DOCUMENTATION.md
   - Documentation des endpoints API
   - Exemples d'utilisation

================================================================================
CONFIGURATION
================================================================================

Base de Données MySQL:
- Database: mwoloenerysystems
- User: root
- Password: 14041999No@
- Host: localhost
- Port: 3306

Fichier .env:
- Déjà configuré avec les credentials MySQL
- Ne pas commiter ce fichier!

Admin URL:
- Changée de /admin/ à /mwoloboss/

================================================================================
COMMANDES ESSENTIELLES
================================================================================

Créer l'environnement virtuel:
  python -m venv venv (Windows)
  python3 -m venv venv (Linux/macOS)

Activer l'environnement virtuel:
  venv\Scripts\activate (Windows)
  source venv/bin/activate (Linux/macOS)

Installer les dépendances:
  pip install -r requirements.txt

Appliquer les migrations:
  python manage.py migrate

Initialiser les données:
  python manage.py init_data

Lancer le serveur:
  python manage.py runserver

Lancer les tests:
  pytest

Lancer Celery:
  celery -A config worker -l info

================================================================================
TROUBLESHOOTING
================================================================================

Erreur: "python: command not found"
→ Utiliser python3 au lieu de python

Erreur: "No module named 'django'"
→ L'environnement virtuel n'est pas activé
→ Vérifier que vous voyez (venv) au début du terminal

Erreur: "Access denied for user 'root'"
→ Vérifier le mot de passe MySQL dans .env

Erreur: "Unknown database 'mwoloenerysystems'"
→ Créer la base de données MySQL

Erreur: "Port already in use"
→ Utiliser un autre port: python manage.py runserver 8001

================================================================================
STRUCTURE DU PROJET
================================================================================

mwolo-energy-systems/
├── config/              # Configuration Django
├── accounts/            # Gestion des utilisateurs
├── geo/                 # Géographie
├── agencies/            # Agences
├── hr/                  # RH
├── crm/                 # Clients
├── billing/             # Facturation
├── operations/          # Opérations
├── support/             # Support
├── cms/                 # CMS
├── core/                # Utilitaires
├── tests/               # Tests
├── .env                 # Variables d'environnement
├── requirements.txt     # Dépendances
├── manage.py            # Commandes Django
├── setup.bat            # Installation Windows
├── setup.sh             # Installation Linux/macOS
└── [Documentation]      # Fichiers .md

================================================================================
MODULES
================================================================================

1. Accounts - Gestion des utilisateurs et permissions
2. Geo - Géographie (Pays, Provinces, Communes, Territoires)
3. Agencies - Agences géolocalisées
4. HR - Ressources Humaines
5. CRM - Gestion des clients
6. Billing - Facturation et paiements
7. Operations - Opérations et compteurs
8. Support - Support clients
9. CMS - Contenu du site vitrine
10. Core - Utilitaires

================================================================================
PROCHAINES ÉTAPES
================================================================================

1. ✅ Lire START_HERE.md
2. ✅ Exécuter setup.bat (Windows) ou setup.sh (Linux/macOS)
3. ✅ Accéder à http://localhost:8000/mwoloboss/
4. ✅ Lire README.md pour la vue d'ensemble
5. ✅ Consulter API_DOCUMENTATION.md pour les endpoints
6. ✅ Lancer les tests: pytest
7. ✅ Développer le frontend

================================================================================
SUPPORT
================================================================================

Documentation:
- START_HERE.md
- INSTALLATION_COMPLETE.md
- QUICK_COMMANDS.md
- README.md
- API_DOCUMENTATION.md
- FAQ.md

Pour toute question:
1. Consulter la documentation
2. Vérifier la FAQ
3. Ouvrir une issue

================================================================================
CREDENTIALS
================================================================================

Admin:
- Username: admin
- Password: admin123

MySQL:
- User: root
- Password: 14041999No@
- Database: mwoloenerysystems

================================================================================
URLS
================================================================================

Admin: http://localhost:8000/mwoloboss/
API: http://localhost:8000/api/
Docs: http://localhost:8000/api/docs/

================================================================================
BON DÉVELOPPEMENT! 🚀
================================================================================

Merci d'utiliser Mwolo Energy Systems!

Pour commencer, lisez START_HERE.md ou exécutez setup.bat (Windows) / setup.sh (Linux/macOS)

================================================================================
