# Mwolo Energy Systems - Script de démarrage complet
# Lance Django + 3 applications Next.js

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  MWOLO ENERGY SYSTEMS - DÉMARRAGE  " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$basePath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Vérifier que nous sommes dans le bon dossier
if (-not (Test-Path "$basePath\manage.py")) {
    Write-Host "Erreur: Exécutez ce script depuis le dossier mwolo-energy-systems" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Démarrage des services..." -ForegroundColor Yellow
Write-Host ""

# 1. Backend Django (Port 8000)
Write-Host "🐍 Django API (Port 8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath'; .\venv\Scripts\Activate.ps1; python manage.py runserver 8000"
Start-Sleep -Seconds 2

# 2. Frontend Public (Port 3000)
Write-Host "🌐 Frontend Public (Port 3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\frontend-public'; npm run dev"
Start-Sleep -Seconds 2

# 3. Frontend Staff (Port 3001)
Write-Host "👔 Frontend Staff (Port 3001)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\frontend-staff'; npm run dev"
Start-Sleep -Seconds 2

# 4. Frontend Agency (Port 3002)
Write-Host "🏢 Frontend Agency (Port 3002)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\frontend-agency'; npm run dev"

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  SERVICES LANCÉS                    " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  API Django:        http://localhost:8000" -ForegroundColor White
Write-Host "  Site Public:       http://localhost:3000" -ForegroundColor White
Write-Host "  Portail Employé:   http://localhost:3001" -ForegroundColor White
Write-Host "  Outils Agence:     http://localhost:3002" -ForegroundColor White
Write-Host "  Django Admin:      http://localhost:8000/admin" -ForegroundColor White
Write-Host ""
Write-Host "Appuyez sur une touche pour ouvrir le navigateur..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Ouvrir les URLs dans le navigateur
Start-Process "http://localhost:3000"
