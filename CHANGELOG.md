# Changelog

Tous les changements notables de ce projet seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Structure Django complète
- 10 modules (accounts, geo, agencies, hr, crm, billing, operations, support, cms, core)
- Authentification JWT
- RBAC avec 8 rôles
- Audit logs
- Admin Jazzmin
- API DRF
- Docker support
- Tests de base

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A

## [0.1.0] - 2026-02-01

### Added
- Initialisation du projet
- Structure de base Django
- Modèles de données pour tous les modules
- Admin Jazzmin configuré
- API DRF de base
- Authentification JWT
- Permissions RBAC
- Audit logs
- Docker et Docker Compose
- Documentation complète
- Tests de base
- Fixtures de données initiales

### Features
- Gestion des utilisateurs avec rôles
- Géographie (Pays, Provinces, Communes, Territoires)
- Agences géolocalisées
- Module RH complet
- Gestion des clients
- Facturation avec paiements
- Opérations et compteurs
- Support clients
- CMS pour le site vitrine
- Tâches asynchrones avec Celery

### Documentation
- README.md
- GETTING_STARTED.md
- API_DOCUMENTATION.md
- DEPLOYMENT.md
- CONFIGURATION.md
- SECURITY.md
- PERFORMANCE.md
- TESTING.md
- CONTRIBUTING.md
- DEVELOPMENT_NOTES.md
- MANAGEMENT_COMMANDS.md
- FIXTURES.md
- PROJECT_SUMMARY.md

## Versions Futures

### v0.2.0 (Q1 2026)
- [ ] Tests unitaires complets
- [ ] Frontend Next.js (début)
- [ ] Intégration paiements mobiles
- [ ] Liaison compteurs IoT

### v0.3.0 (Q2 2026)
- [ ] Frontend Next.js (suite)
- [ ] Portail employés
- [ ] Portail clients
- [ ] Site vitrine

### v0.4.0 (Q3 2026)
- [ ] Optimisations performances
- [ ] Monitoring et logging
- [ ] Documentation complète
- [ ] Déploiement production

### v1.0.0 (Q4 2026)
- [ ] Release production
- [ ] Support utilisateurs
- [ ] Maintenance et améliorations

## Notes

### Conventions de Versioning
- MAJOR: Changements incompatibles
- MINOR: Nouvelles fonctionnalités compatibles
- PATCH: Corrections de bugs

### Branches
- `main`: Production (releases)
- `develop`: Développement
- `feature/*`: Nouvelles fonctionnalités
- `fix/*`: Corrections de bugs

### Processus de Release
1. Créer une branche `release/v0.x.0`
2. Mettre à jour le CHANGELOG
3. Mettre à jour la version
4. Créer une PR
5. Merger dans `main` et `develop`
6. Créer un tag Git
7. Créer une release GitHub

## Contributeurs

- Équipe de développement Mwolo Energy Systems

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.
