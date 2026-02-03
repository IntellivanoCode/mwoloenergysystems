# TODO Frontend - Mwolo Energy Systems

## 🎯 RÉSUMÉ

Le frontend existe mais est **très basique**. Il faut:
1. Créer les dashboards par rôle (RH, Comptable, Opérations, Commercial)
2. Rendre tout le contenu dynamique (CMS)
3. Améliorer le design (moderne, professionnel)
4. Ajouter les fonctionnalités manquantes

**Estimation**: 6-10 jours de développement

---

## 📋 CHECKLIST COMPLÈTE

### 1. DASHBOARDS PAR RÔLE (PRIORITÉ 1) 🔴

#### Dashboard RH (`/rh-dashboard`)
- [ ] Vue d'ensemble RH
  - [ ] Nombre total d'employés
  - [ ] Employés actifs/inactifs
  - [ ] Congés en attente
  - [ ] Présences du jour
- [ ] Gestion employés
  - [ ] Liste employés avec filtres
  - [ ] Ajouter/modifier/supprimer employé
  - [ ] Voir détails employé
- [ ] Gestion congés
  - [ ] Liste demandes de congés
  - [ ] Approuver/rejeter congés
  - [ ] Calendrier des congés
- [ ] Gestion présences
  - [ ] Pointages du jour
  - [ ] Historique présences
  - [ ] Rapports d'assiduité
- [ ] Gestion paie
  - [ ] Générer bulletins de paie
  - [ ] Télécharger PDF bulletins
  - [ ] Historique paie

#### Dashboard Comptable (`/comptable-dashboard`)
- [ ] Vue d'ensemble financière
  - [ ] Revenus du mois
  - [ ] Factures impayées
  - [ ] Paiements reçus
  - [ ] Graphiques revenus
- [ ] Gestion factures
  - [ ] Liste factures avec filtres
  - [ ] Créer facture
  - [ ] Valider/envoyer facture
  - [ ] Télécharger PDF facture
  - [ ] Annuler facture
- [ ] Gestion paiements
  - [ ] Liste paiements
  - [ ] Enregistrer paiement
  - [ ] Confirmer paiement
  - [ ] Télécharger reçu PDF
  - [ ] Paiements mobiles (M-Pesa, Airtel)
- [ ] Rapports financiers
  - [ ] Rapport mensuel
  - [ ] Rapport annuel
  - [ ] Export Excel/CSV
  - [ ] Graphiques revenus/dépenses

#### Dashboard Opérations (`/operations-dashboard`)
- [ ] Vue d'ensemble opérations
  - [ ] Équipements actifs
  - [ ] Compteurs actifs
  - [ ] Interventions en cours
  - [ ] Alertes maintenance
- [ ] Gestion équipements
  - [ ] Liste équipements
  - [ ] Ajouter/modifier équipement
  - [ ] Historique maintenance
  - [ ] Statut équipements
- [ ] Gestion compteurs
  - [ ] Liste compteurs
  - [ ] Relevés compteurs
  - [ ] Désactiver/activer service
  - [ ] Alertes compteurs
- [ ] Gestion interventions
  - [ ] Liste interventions
  - [ ] Planifier intervention
  - [ ] Assigner technicien
  - [ ] Clôturer intervention
- [ ] Carte interactive
  - [ ] Voir équipements sur carte
  - [ ] Voir interventions sur carte

#### Dashboard Agent Commercial (`/commercial-dashboard`)
- [ ] Vue d'ensemble commercial
  - [ ] Nombre de clients
  - [ ] Prospects
  - [ ] Contrats actifs
  - [ ] Objectifs de vente
- [ ] Gestion clients
  - [ ] Liste clients avec filtres
  - [ ] Ajouter/modifier client
  - [ ] Voir détails client
  - [ ] Historique client
- [ ] Gestion contrats
  - [ ] Liste contrats
  - [ ] Créer contrat
  - [ ] Renouveler contrat
  - [ ] Résilier contrat
- [ ] Gestion sites
  - [ ] Liste sites clients
  - [ ] Ajouter site
  - [ ] Voir équipements du site
- [ ] Rapports commerciaux
  - [ ] Rapport de ventes
  - [ ] Objectifs vs réalisations
  - [ ] Graphiques

---

### 2. CONTENU DYNAMIQUE CMS (PRIORITÉ 1) 🔴

#### Page d'accueil (`/`)
- [x] Services dynamiques (fait partiellement)
- [x] Témoignages dynamiques (fait partiellement)
- [x] Partenaires dynamiques (fait partiellement)
- [ ] Hero dynamique (image/vidéo de fond)
- [ ] Statistiques dynamiques
- [ ] Actualités récentes

#### Page À propos (`/about`)
- [ ] Contenu dynamique depuis CMS
- [ ] Histoire de l'entreprise
- [ ] Mission/Vision/Valeurs
- [ ] Équipe (photos + bios)
- [ ] Chiffres clés

#### Page Services (`/services`)
- [ ] Liste services dynamique
- [ ] Détails service
- [ ] Images/icônes
- [ ] Tarifs (optionnel)

#### Page Actualités (`/news`)
- [ ] Liste articles dynamique
- [ ] Filtres (catégories, dates)
- [ ] Page détail article
- [ ] Images featured
- [ ] Partage social

#### Page Agences (`/agencies`)
- [ ] Liste agences dynamique
- [ ] Carte interactive (Google Maps)
- [ ] Filtres par province/territoire
- [ ] Détails agence (horaires, contact)
- [ ] Formulaire contact agence

#### Page Carrières (`/careers`)
- [ ] Liste offres d'emploi dynamique
- [ ] Filtres (département, type contrat)
- [ ] Page détail offre
- [ ] Formulaire candidature
- [ ] Upload CV

#### Page Contact (`/contact`)
- [ ] Formulaire contact dynamique
- [ ] Enregistrement lead dans DB
- [ ] Email de confirmation
- [ ] Carte avec localisation
- [ ] Informations de contact dynamiques

---

### 3. FONCTIONNALITÉS (PRIORITÉ 2) ⚠️

#### Authentification
- [x] Login (fait)
- [x] Register (fait)
- [ ] Mot de passe oublié
- [ ] Vérification email
- [ ] 2FA (optionnel)

#### Gestion Factures (Client)
- [ ] Liste factures
- [ ] Télécharger PDF facture
- [ ] Payer facture
  - [ ] Carte bancaire
  - [ ] M-Pesa
  - [ ] Airtel Money
  - [ ] Vodacom M-Pesa
  - [ ] Orange Money
- [ ] Historique paiements
- [ ] Télécharger reçu PDF

#### Gestion Tickets Support
- [ ] Créer ticket
- [ ] Liste tickets
- [ ] Voir détail ticket
- [ ] Ajouter message
- [ ] Joindre fichiers
- [ ] Clôturer ticket

#### Visualisation Consommation
- [ ] Graphique consommation mensuelle
- [ ] Graphique consommation annuelle
- [ ] Comparaison périodes
- [ ] Export données

#### Notifications
- [ ] Notifications en temps réel
- [ ] Badge notifications
- [ ] Centre de notifications
- [ ] Marquer comme lu

---

### 4. DESIGN & UX (PRIORITÉ 2) ⚠️

#### Design Général
- [ ] Palette de couleurs cohérente
- [ ] Typographie professionnelle
- [ ] Espacements harmonieux
- [ ] Ombres et effets subtils

#### Composants
- [ ] Boutons modernes
- [ ] Cartes avec hover effects
- [ ] Formulaires stylisés
- [ ] Tables responsives
- [ ] Modals/Dialogs
- [ ] Toasts/Notifications
- [ ] Loading states
- [ ] Empty states

#### Animations
- [ ] Transitions fluides
- [ ] Animations d'entrée
- [ ] Hover effects
- [ ] Loading animations
- [ ] Skeleton loaders

#### Responsive
- [ ] Mobile (< 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (> 1024px)
- [ ] Menu mobile
- [ ] Navigation mobile

#### Graphiques
- [ ] Installer Chart.js ou Recharts
- [ ] Graphiques revenus
- [ ] Graphiques consommation
- [ ] Graphiques statistiques
- [ ] Graphiques interactifs

---

### 5. OPTIMISATIONS (PRIORITÉ 3) 💡

#### Performance
- [ ] Lazy loading images
- [ ] Code splitting
- [ ] Optimisation bundle
- [ ] Caching API
- [ ] Service Worker (PWA)

#### SEO
- [ ] Meta tags dynamiques
- [ ] Sitemap
- [ ] Robots.txt
- [ ] Open Graph
- [ ] Schema.org

#### Accessibilité
- [ ] ARIA labels
- [ ] Navigation clavier
- [ ] Contraste couleurs
- [ ] Alt text images
- [ ] Focus visible

---

## 🚀 PLAN D'ACTION RECOMMANDÉ

### Semaine 1: Dashboards
- Jour 1-2: Dashboard RH
- Jour 3-4: Dashboard Comptable
- Jour 5: Dashboard Opérations + Commercial

### Semaine 2: CMS & Fonctionnalités
- Jour 1-2: Toutes les pages CMS dynamiques
- Jour 3-4: Gestion factures + paiements
- Jour 5: Tickets support + notifications

### Semaine 3: Design & Optimisations
- Jour 1-2: Amélioration design général
- Jour 3: Graphiques et visualisations
- Jour 4: Responsive mobile
- Jour 5: Tests et corrections

---

## 📦 DÉPENDANCES À INSTALLER

```bash
npm install recharts  # Graphiques
npm install react-hot-toast  # Notifications
npm install @headlessui/react  # Composants UI
npm install @heroicons/react  # Icônes
npm install date-fns  # Manipulation dates
npm install react-hook-form  # Formulaires
npm install zod  # Validation
npm install @tanstack/react-query  # Gestion état API
```

---

## 💡 RECOMMANDATIONS

1. **Commencer par les dashboards** - C'est le plus important
2. **Utiliser des composants réutilisables** - Créer une librairie de composants
3. **Tester au fur et à mesure** - Ne pas attendre la fin
4. **Mobile-first** - Penser mobile dès le début
5. **Performance** - Optimiser les images et le code

---

## 📞 BESOIN D'AIDE?

Si tu veux que je t'aide à implémenter:
1. Dis-moi par quoi commencer (dashboard RH, Comptable, etc.)
2. Je créerai le code complet pour toi
3. Tu n'auras qu'à copier-coller

**Note**: Vu l'ampleur du travail, je recommande de commencer par les dashboards RH et Comptable car ce sont les plus critiques pour le business.
