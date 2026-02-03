# 🏗️ Architecture Mwolo Energy Systems

## Vue d'ensemble

Le projet est organisé en **4 applications distinctes** pour une séparation claire des responsabilités, une meilleure sécurité et un scaling indépendant.

```
mwolo-energy-systems/
├── backend/                    # Django API (port 8000)
├── frontend-public/            # Site vitrine + Espace client (port 3000)
├── frontend-staff/             # Portail employé (port 3001)
├── frontend-agency/            # Outils agence - bornes/écrans (port 3002)
└── shared/                     # Code partagé (copié manuellement)
```

---

## 📊 Tableau récapitulatif

| Application | Port | Utilisateurs | Accès | URL Production |
|-------------|------|--------------|-------|----------------|
| **Backend API** | 8000 | Toutes les apps | API REST | api.mwolo.energy |
| **Frontend Public** | 3000 | Clients & Visiteurs | Internet | www.mwolo.energy |
| **Frontend Staff** | 3001 | Employés & Admins | Intranet/VPN | staff.mwolo.energy |
| **Frontend Agency** | 3002 | Bornes & Écrans | Réseau local agence | agency.mwolo.energy |

---

## 🌐 Frontend Public (Port 3000)

### Description
Site web public avec espace client intégré. Accessible à tous sur internet.

### Pages
```
/                    → Page d'accueil
/about               → À propos
/services            → Nos services
/agencies            → Liste des agences
/appointments        → Prise de rendez-vous en ligne
/news                → Actualités / Blog
/contact             → Formulaire de contact
/login               → Connexion client
/register            → Inscription client
/client/*            → Espace client (authentifié)
  /client/dashboard  → Tableau de bord
  /client/invoices   → Mes factures
  /client/payments   → Historique paiements
  /client/profile    → Mon profil
```

### Sécurité
- Authentification JWT pour l'espace client
- Seuls les utilisateurs avec `role: 'client'` peuvent se connecter
- Redirige les employés vers le portail staff

---

## 👔 Frontend Staff (Port 3001)

### Description
Portail interne pour les employés et administrateurs. Peut être protégé par VPN en production.

### Pages
```
/                    → Page de connexion staff
/dashboard           → Tableau de bord principal

# Espace Personnel
/profile             → Mon profil
/schedule            → Mes horaires
/payslips            → Fiches de paie
/badge               → Mon badge QR

# Pointage
/clock-in            → Pointage entrée/sortie
/attendance          → Historique présences

# Outils Agence (pour agents)
/counter             → Interface guichet
/walk-in             → Prise RDV sur place

# Administration (super_admin)
/employees           → Gestion employés
/agencies            → Gestion agences
/clients             → Gestion CRM
/billing             → Facturation
```

### Sécurité
- Authentification JWT
- Seuls `role: 'employe'` ou `role: 'super_admin'` peuvent se connecter
- Tokens séparés (`mwolo_staff_*`) de l'app client
- Peut être protégé par IP whitelist ou VPN

---

## 🏢 Frontend Agency (Port 3002)

### Description
Application dédiée aux écrans et bornes en agence. Optimisée pour:
- Bornes tactiles (kiosk)
- Écrans d'affichage (moniteur)
- PC agents de guichet

### Pages
```
/                    → Sélection agence + choix d'outil
/kiosk               → Borne de prise de ticket
/monitor             → Écran d'affichage file d'attente
/counter             → Interface agent de guichet
/appointments        → Prise de RDV sur place
```

### Sécurité
- Pas d'authentification utilisateur classique
- Configuration agence stockée localement
- Activation des outils par badge employé
- Idéalement sur réseau local isolé en agence

### Optimisations
- CSS adapté aux grands écrans (TV 1080p, 4K)
- Mode tactile pour les bornes
- Désactivation du zoom et scroll pour les bornes
- Auto-refresh des données en temps réel

---

## 🔧 Backend Django (Port 8000)

### Endpoints principaux
```
/api/auth/           → Authentification (login, register, me)
/api/cms/            → Contenu (pages, blog, services, testimonials)
/api/agencies/       → Agences
/api/hr/             → RH (employés, planning, pointage, paie)
/api/crm/            → Clients
/api/billing/        → Facturation
/api/operations/     → File d'attente, rendez-vous
/api/support/        → Tickets support
/admin/              → Interface Django Admin
```

### Sécurité
- JWT Bearer tokens
- CORS configuré pour les 3 frontends
- Rate limiting recommandé
- SSL obligatoire en production

---

## 🚀 Commandes de développement

### Lancer toutes les applications

```powershell
# Terminal 1 - Backend Django
cd mwolo-energy-systems
.\venv\Scripts\Activate.ps1
python manage.py runserver 8000

# Terminal 2 - Frontend Public
cd frontend-public
npm install
npm run dev    # Port 3000

# Terminal 3 - Frontend Staff
cd frontend-staff
npm install
npm run dev    # Port 3001

# Terminal 4 - Frontend Agency
cd frontend-agency
npm install
npm run dev    # Port 3002
```

### Script de démarrage complet (à créer)
```powershell
# start-all.ps1
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mwolo-energy-systems; .\venv\Scripts\Activate.ps1; python manage.py runserver 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mwolo-energy-systems\frontend-public; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mwolo-energy-systems\frontend-staff; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd mwolo-energy-systems\frontend-agency; npm run dev"
```

---

## 🌍 Configuration Production

### Variables d'environnement

```env
# frontend-public/.env.production
NEXT_PUBLIC_API_URL=https://api.mwolo.energy/api

# frontend-staff/.env.production
NEXT_PUBLIC_API_URL=https://api.mwolo.energy/api

# frontend-agency/.env.production
NEXT_PUBLIC_API_URL=https://api.mwolo.energy/api
```

### Architecture de déploiement recommandée

```
                    ┌─────────────────┐
                    │   Load Balancer │
                    │   (Cloudflare)  │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ www.mwolo.    │   │ staff.mwolo.  │   │ agency.mwolo. │
│ (Vercel/AWS)  │   │ (Vercel/VPN)  │   │ (Local/Edge)  │
└───────────────┘   └───────────────┘   └───────────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                             ▼
                    ┌───────────────┐
                    │  Django API   │
                    │  (AWS/GCP)    │
                    └───────────────┘
                             │
                             ▼
                    ┌───────────────┐
                    │    MySQL      │
                    │   Database    │
                    └───────────────┘
```

---

## 📁 Structure des dossiers

### Frontend Public
```
frontend-public/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Homepage
│   │   ├── login/page.tsx        # Connexion client
│   │   ├── register/page.tsx     # Inscription
│   │   ├── client/               # Espace client
│   │   ├── services/             # Pages services
│   │   └── ...
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── lib/
│       └── api.ts                # API client-focused
├── package.json
└── next.config.ts
```

### Frontend Staff
```
frontend-staff/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Login staff
│   │   ├── dashboard/page.tsx    # Portail principal
│   │   ├── profile/              # Profil employé
│   │   ├── schedule/             # Planning
│   │   ├── clock-in/             # Pointage
│   │   └── ...
│   └── lib/
│       └── api.ts                # API staff-focused
├── package.json
└── next.config.ts
```

### Frontend Agency
```
frontend-agency/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Sélection agence
│   │   ├── kiosk/page.tsx        # Borne ticket
│   │   ├── monitor/page.tsx      # Écran affichage
│   │   ├── counter/page.tsx      # Guichet agent
│   │   └── appointments/page.tsx # RDV sur place
│   └── lib/
│       └── api.ts                # API agency-focused
├── package.json
└── next.config.ts
```

---

## 🔄 Synchronisation du code partagé

Le dossier `shared/` contient le code commun. Pour synchroniser:

```powershell
# Copier api.ts vers toutes les apps
Copy-Item shared\lib\api.ts frontend-public\src\lib\api.ts
Copy-Item shared\lib\api.ts frontend-staff\src\lib\api.ts
Copy-Item shared\lib\api.ts frontend-agency\src\lib\api.ts
```

**Note**: Chaque app a sa propre version d'api.ts avec des fonctions spécifiques à son contexte.

---

## ✅ Avantages de cette architecture

1. **Sécurité** - Isolation des données sensibles (staff/agency séparés du public)
2. **Performance** - Bundles JS plus petits, chargement plus rapide
3. **Scalabilité** - Scaling indépendant selon la charge
4. **Maintenance** - Code organisé par domaine métier
5. **Déploiement** - Mises à jour indépendantes sans affecter les autres apps
6. **Équipe** - Développeurs peuvent travailler sur des apps différentes

---

## 📞 Support

Pour toute question sur l'architecture:
- Voir la documentation Django dans `/docs/`
- Contacter l'équipe technique
