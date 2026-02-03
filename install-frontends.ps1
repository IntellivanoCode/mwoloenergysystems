# Installation des dépendances pour les 3 applications frontend
# Exécutez ce script une seule fois après avoir cloné le projet

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  MWOLO - INSTALLATION FRONTENDS    " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$basePath = Split-Path -Parent $MyInvocation.MyCommand.Path

# Vérifier Node.js
$nodeVersion = node --version 2>$null
if (-not $nodeVersion) {
    Write-Host "❌ Node.js n'est pas installé!" -ForegroundColor Red
    Write-Host "   Installez Node.js 18+ depuis https://nodejs.org" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green

# 1. Frontend Public
Write-Host ""
Write-Host "📦 Installation frontend-public..." -ForegroundColor Yellow
Set-Location "$basePath\frontend-public"
if (Test-Path "package.json") {
    npm install
    Write-Host "✅ frontend-public installé" -ForegroundColor Green
} else {
    Write-Host "❌ package.json manquant dans frontend-public" -ForegroundColor Red
}

# 2. Frontend Staff
Write-Host ""
Write-Host "📦 Installation frontend-staff..." -ForegroundColor Yellow
Set-Location "$basePath\frontend-staff"
if (Test-Path "package.json") {
    npm install
    Write-Host "✅ frontend-staff installé" -ForegroundColor Green
} else {
    Write-Host "❌ package.json manquant dans frontend-staff" -ForegroundColor Red
}

# 3. Frontend Agency
Write-Host ""
Write-Host "📦 Installation frontend-agency..." -ForegroundColor Yellow
Set-Location "$basePath\frontend-agency"
if (Test-Path "package.json") {
    npm install
    Write-Host "✅ frontend-agency installé" -ForegroundColor Green
} else {
    Write-Host "❌ package.json manquant dans frontend-agency" -ForegroundColor Red
}

# Retour au dossier racine
Set-Location $basePath

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  INSTALLATION TERMINÉE             " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pour démarrer tous les services, exécutez:" -ForegroundColor White
Write-Host "  .\start-all.ps1" -ForegroundColor Green
Write-Host ""
