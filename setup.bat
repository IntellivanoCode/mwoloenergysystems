@echo off
REM Script d'installation pour Windows

echo ========================================
echo Mwolo Energy Systems - Installation
echo ========================================
echo.

REM 1. Créer l'environnement virtuel
echo [1/6] Création de l'environnement virtuel...
python -m venv venv
if errorlevel 1 (
    echo Erreur: Impossible de créer l'environnement virtuel
    pause
    exit /b 1
)
echo OK
echo.

REM 2. Activer l'environnement virtuel
echo [2/6] Activation de l'environnement virtuel...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo Erreur: Impossible d'activer l'environnement virtuel
    pause
    exit /b 1
)
echo OK
echo.

REM 3. Installer les dépendances
echo [3/6] Installation des dépendances...
pip install -r requirements.txt
if errorlevel 1 (
    echo Erreur: Impossible d'installer les dépendances
    pause
    exit /b 1
)
echo OK
echo.

REM 4. Appliquer les migrations
echo [4/6] Application des migrations...
python manage.py migrate
if errorlevel 1 (
    echo Erreur: Impossible d'appliquer les migrations
    pause
    exit /b 1
)
echo OK
echo.

REM 5. Initialiser les données
echo [5/6] Initialisation des données...
python manage.py init_data
if errorlevel 1 (
    echo Erreur: Impossible d'initialiser les données
    pause
    exit /b 1
)
echo OK
echo.

REM 6. Lancer le serveur
echo [6/6] Lancement du serveur...
echo.
echo ========================================
echo Installation terminée!
echo ========================================
echo.
echo Admin: http://localhost:8000/mwoloboss/
echo Username: admin
echo Password: admin123
echo.
echo API: http://localhost:8000/api/
echo Docs: http://localhost:8000/api/docs/
echo.
echo Lancement du serveur...
echo.

python manage.py runserver

pause
