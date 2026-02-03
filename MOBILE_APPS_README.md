# 📱 Applications Mobiles Mwolo Energy Systems

Ce dossier contient les deux applications mobiles pour le système Mwolo Energy :

## 1. 📲 Application Client (`mobile-client`)
Application pour les **clients** de Mwolo Energy Systems.

### Fonctionnalités
- ✅ Connexion / Inscription
- ✅ Tableau de bord avec résumé du compte
- ✅ Consultation des factures
- ✅ Paiement en ligne
- ✅ Recherche d'agences proches (GPS)
- ✅ Prise de rendez-vous
- ✅ Support / Tickets
- ✅ Gestion du profil

### Plateformes cibles
- **Android** ✅
- **iOS** ✅

---

## 2. 👔 Application Staff (`mobile-staff`)
Application pour les **employés** de Mwolo Energy Systems.

### Fonctionnalités
- ✅ Connexion sécurisée employé
- ✅ Tableau de bord temps réel
- ✅ Gestion de la file d'attente
- ✅ Appel du prochain client
- ✅ Gestion des rendez-vous
- ✅ Recherche clients
- ✅ Encaissement
- ✅ Tickets support

### Plateformes cibles
- **Android** ✅
- **Windows** (via Electron - à implémenter)

---

## 🚀 Installation et Lancement

### Prérequis
1. **Node.js** (v18 ou supérieur)
2. **npm** ou **yarn**
3. **Expo CLI** : `npm install -g expo-cli`
4. **Émulateur Android** (BlueStacks, Android Studio, etc.) ou appareil physique

### Lancer l'application Client

```bash
# Aller dans le dossier
cd mobile-client

# Installer les dépendances
npm install

# Lancer l'application
npx expo start
```

### Lancer l'application Staff

```bash
# Aller dans le dossier
cd mobile-staff

# Installer les dépendances
npm install

# Lancer l'application
npx expo start
```

---

## 📱 Tester sur BlueStacks (Android)

1. **Installer BlueStacks** : https://www.bluestacks.com/
2. **Activer ADB** dans BlueStacks (Paramètres > Avancés > Android Debug Bridge)
3. **Lancer Expo** : `npx expo start`
4. **Appuyer sur `a`** pour lancer sur Android

Alternative : Scanner le QR code avec l'app **Expo Go** sur votre téléphone.

---

## 🍎 Tester sur iOS

### Option 1 : Expo Go (sans Mac)
1. Télécharger **Expo Go** sur l'App Store
2. Scanner le QR code affiché par `npx expo start`

### Option 2 : Simulateur iOS (Mac requis)
```bash
npx expo start --ios
```

---

## 🔧 Configuration API

Les deux applications se connectent au backend Django. Modifier l'URL dans :
- `mobile-client/src/config/api.ts`
- `mobile-staff/src/config/api.ts`

```typescript
// Pour émulateur Android (localhost)
BASE_URL: 'http://10.0.2.2:8000'

// Pour appareil physique (utiliser l'IP locale)
BASE_URL: 'http://192.168.x.x:8000'

// Production
BASE_URL: 'https://api.mwoloenergy.com'
```

---

## 📦 Build pour Production

### Android APK
```bash
npx expo build:android -t apk
```

### Android App Bundle (Play Store)
```bash
npx expo build:android -t app-bundle
```

### iOS (Mac requis)
```bash
npx expo build:ios
```

### Avec EAS Build (Recommandé)
```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter à Expo
eas login

# Build Android
eas build --platform android

# Build iOS
eas build --platform ios
```

---

## 📁 Structure des Projets

```
mobile-client/                 # App Client
├── App.tsx                    # Point d'entrée
├── app.json                   # Configuration Expo
├── src/
│   ├── config/
│   │   ├── api.ts            # Configuration API
│   │   └── theme.ts          # Thème et couleurs
│   ├── contexts/
│   │   └── AuthContext.tsx   # Contexte d'authentification
│   ├── navigation/
│   │   └── AppNavigation.tsx # Navigation principale
│   ├── screens/
│   │   ├── auth/             # Écrans d'authentification
│   │   └── main/             # Écrans principaux
│   └── services/
│       └── api.ts            # Service API

mobile-staff/                  # App Staff
├── App.tsx
├── app.json
├── src/
│   ├── config/
│   ├── contexts/
│   │   └── StaffAuthContext.tsx
│   ├── navigation/
│   │   └── StaffAppNavigation.tsx
│   ├── screens/
│   │   ├── auth/
│   │   └── main/
│   └── services/
│       └── api.ts
```

---

## 🎨 Thèmes

### Application Client
- **Couleur primaire** : Cyan (#0EA5E9)
- **Design** : Moderne, épuré, orienté grand public

### Application Staff
- **Couleur primaire** : Bleu foncé (#1E40AF)
- **Design** : Professionnel, efficace, orienté productivité

---

## 🔐 Sécurité

- Tokens JWT stockés dans **SecureStore** (chiffré)
- Refresh token automatique
- Déconnexion automatique en cas d'expiration
- HTTPS en production

---

## 📞 Support

Pour toute question technique :
- Email : support@mwoloenergy.com
- Documentation API : `/API_DOCUMENTATION.md`
