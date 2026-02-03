# Guide des Tableaux de Bord - Mwolo Energy Systems

## Vue d'ensemble

Mwolo Energy Systems propose trois tableaux de bord professionnels et modernes pour différents rôles:

1. **Tableau de bord client** (`/dashboard`)
2. **Tableau de bord employé** (`/employee-dashboard`)
3. **Tableau de bord administrateur** (`/admin-dashboard`)

## 1. Tableau de Bord Client

**URL**: `/dashboard`

### Fonctionnalités

- **Statistiques clés**:
  - Consommation énergétique (kWh)
  - Facture actuelle à payer
  - Nombre de factures en attente
  - Nombre de factures payées
  - Moyenne de consommation quotidienne

- **Gestion des factures**:
  - Liste des 5 dernières factures
  - Statut de chaque facture (payée, en attente, en retard)
  - Montant et date d'échéance
  - Actions rapides (payer, télécharger)

- **Informations personnelles**:
  - Nom complet
  - Email
  - Téléphone
  - Agence associée

- **Actions rapides**:
  - Payer une facture
  - Voir la consommation
  - Créer un ticket de support
  - Paramètres du compte

### Données affichées

Les données sont chargées depuis les endpoints Django:
- `/crm/clients/me/` - Informations du client
- `/billing/invoices/` - Factures du client

## 2. Tableau de Bord Employé

**URL**: `/employee-dashboard`

### Fonctionnalités

- **Statistiques d'assiduité**:
  - Nombre de présences ce mois
  - Nombre d'absences ce mois
  - Nombre de retards ce mois
  - Total d'heures travaillées

- **Informations personnelles**:
  - Nom complet
  - Post-nom
  - Position
  - Département
  - Email
  - Téléphone

- **Historique d'assiduité**:
  - Tableau avec les 10 derniers enregistrements
  - Date, heure d'arrivée, heure de départ
  - Statut (Présent, Absent, Retard)

- **Actions rapides**:
  - Demander un congé
  - Soumettre un rapport
  - Contacter RH
  - Paramètres

- **Ressources**:
  - Politique d'entreprise
  - Formation et développement
  - Support IT
  - FAQ

### Données affichées

Les données sont chargées depuis les endpoints Django:
- `/hr/employees/me/` - Informations de l'employé
- `/hr/attendance/` - Historique d'assiduité

## 3. Tableau de Bord Administrateur

**URL**: `/admin-dashboard`

### Fonctionnalités

- **Métriques clés**:
  - Nombre total d'utilisateurs
  - Nombre de clients actifs
  - Nombre d'employés
  - Nombre d'agences
  - Revenus totaux
  - Tickets en attente
  - Services actifs
  - Santé du système (%)

- **Gestion du système**:
  - Accès rapide à la gestion des utilisateurs
  - Gestion des clients
  - Gestion des employés
  - Gestion des agences
  - Gestion de la facturation
  - Gestion du support

- **Actions administratives**:
  - Générer des rapports
  - Envoyer des notifications
  - Synchroniser les données
  - Paramètres système

- **Activité récente**:
  - Tableau des 10 dernières actions
  - Utilisateur, action, date, statut

### Données affichées

Les données sont chargées depuis les endpoints Django:
- `/core/dashboard/stats/` - Statistiques du système
- `/core/audit-logs/` - Logs d'audit

## Authentification

Tous les tableaux de bord nécessitent une authentification:

1. L'utilisateur doit être connecté (token JWT dans localStorage)
2. Si pas de token, redirection vers `/login`
3. Le token est envoyé dans l'en-tête `Authorization: Bearer {token}`

## Design et UX

### Caractéristiques de design

- **Responsive**: Adapté à tous les appareils (mobile, tablette, desktop)
- **Moderne**: Utilise Tailwind CSS avec gradients et ombres
- **Accessible**: Contraste suffisant, navigation au clavier
- **Performant**: Chargement optimisé des données

### Animations

- Fade-in au chargement
- Hover effects sur les cartes
- Transitions fluides
- Indicateurs de chargement

### Couleurs

- **Bleu**: Couleur primaire (actions, liens)
- **Vert**: Succès, présences
- **Rouge**: Alertes, absences
- **Jaune**: Avertissements, retards
- **Gris**: Texte, arrière-plans

## Intégration avec Django

### Endpoints requis

Pour que les tableaux de bord fonctionnent correctement, les endpoints Django suivants doivent être implémentés:

#### Client Dashboard
```
GET /api/crm/clients/me/
GET /api/billing/invoices/
```

#### Employee Dashboard
```
GET /api/hr/employees/me/
GET /api/hr/attendance/
```

#### Admin Dashboard
```
GET /api/core/dashboard/stats/
GET /api/core/audit-logs/
```

### Format des réponses

Les réponses doivent être en JSON avec la structure appropriée pour chaque endpoint.

## Développement futur

### Améliorations prévues

1. **Graphiques et charts**:
   - Graphiques de consommation
   - Graphiques de revenus
   - Graphiques d'assiduité

2. **Export de données**:
   - Export PDF des rapports
   - Export CSV des données
   - Export Excel

3. **Notifications en temps réel**:
   - WebSocket pour les mises à jour
   - Notifications push
   - Alertes système

4. **Personnalisation**:
   - Thèmes personnalisés
   - Widgets configurables
   - Préférences utilisateur

5. **Mobile app**:
   - Application React Native
   - Synchronisation offline
   - Notifications push

## Dépannage

### Problèmes courants

**Le tableau de bord ne charge pas**:
- Vérifier que l'utilisateur est connecté
- Vérifier que le token JWT est valide
- Vérifier les logs du navigateur (F12)

**Les données ne s'affichent pas**:
- Vérifier que les endpoints Django sont accessibles
- Vérifier que les données existent en base de données
- Vérifier les logs du serveur Django

**Erreurs de style**:
- Vérifier que Tailwind CSS est correctement configuré
- Vérifier que les fichiers CSS sont chargés
- Vider le cache du navigateur

## Support

Pour toute question ou problème, contactez:
- Email: support@mwolo.energy
- Téléphone: +243 123 456 789
- Adresse: Kinshasa, RDC
