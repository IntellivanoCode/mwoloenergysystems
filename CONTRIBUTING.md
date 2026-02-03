# Guide de Contribution

## Code de Conduite

Nous nous engageons à fournir un environnement accueillant et inclusif pour tous les contributeurs.

### Comportement Attendu
- Respecter les autres contributeurs
- Accepter les critiques constructives
- Se concentrer sur ce qui est meilleur pour la communauté
- Montrer de l'empathie envers les autres membres

### Comportement Inacceptable
- Harcèlement ou discrimination
- Insultes ou commentaires offensants
- Attaques personnelles
- Spam ou contenu non pertinent

## Comment Contribuer

### 1. Fork le Repo
```bash
git clone https://github.com/your-username/mwolo-energy-systems.git
cd mwolo-energy-systems
```

### 2. Créer une Branche
```bash
git checkout -b feature/your-feature-name
```

### 3. Faire les Modifications
- Suivre le style de code
- Ajouter des tests
- Mettre à jour la documentation

### 4. Commiter les Modifications
```bash
git add .
git commit -m "feat: description de la modification"
```

### 5. Pousser la Branche
```bash
git push origin feature/your-feature-name
```

### 6. Créer une Pull Request
- Décrire les modifications
- Référencer les issues
- Ajouter des screenshots si pertinent

## Style de Code

### Python
```python
# ✅ BON
def get_client_by_id(client_id):
    """Récupérer un client par ID"""
    return Client.objects.get(id=client_id)

# ❌ MAUVAIS
def getClientById(clientId):
    return Client.objects.get(id=clientId)
```

### Nommage
- Variables: `snake_case`
- Classes: `PascalCase`
- Constantes: `UPPER_CASE`
- Fonctions: `snake_case`

### Docstrings
```python
def create_invoice(client, period_start, period_end):
    """
    Créer une facture pour un client.
    
    Args:
        client: Instance de Client
        period_start: Date de début de la période
        period_end: Date de fin de la période
    
    Returns:
        Instance d'Invoice créée
    
    Raises:
        ValueError: Si les dates sont invalides
    """
    pass
```

### Imports
```python
# ✅ BON
from django.db import models
from rest_framework import serializers

# ❌ MAUVAIS
import django
import rest_framework
```

## Tests

### Ajouter des Tests
```python
@pytest.mark.django_db
def test_create_invoice():
    """Tester la création d'une facture"""
    invoice = Invoice.objects.create(...)
    assert invoice.id is not None
```

### Couverture Minimale
- 80% de couverture globale
- 100% pour les modèles critiques
- 100% pour les permissions

### Lancer les Tests
```bash
pytest
pytest --cov=.
```

## Documentation

### Mettre à Jour la Documentation
- README.md
- API_DOCUMENTATION.md
- Docstrings du code
- Commentaires explicatifs

### Format Markdown
```markdown
# Titre

## Sous-titre

### Sous-sous-titre

- Point 1
- Point 2

1. Étape 1
2. Étape 2

\`\`\`python
code_example()
\`\`\`
```

## Commits

### Message de Commit
```
feat: ajouter la fonctionnalité X
fix: corriger le bug Y
docs: mettre à jour la documentation
style: formater le code
refactor: refactoriser le module X
test: ajouter des tests pour X
chore: mettre à jour les dépendances
```

### Format
```
<type>: <description courte>

<description longue si nécessaire>

Fixes #123
```

## Pull Request

### Titre
```
feat: ajouter la fonctionnalité X
```

### Description
```markdown
## Description
Décrire les modifications

## Type de Changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Comment Tester
1. Étape 1
2. Étape 2

## Checklist
- [ ] Tests ajoutés
- [ ] Documentation mise à jour
- [ ] Pas de breaking changes
- [ ] Code formaté
```

## Processus de Révision

### Avant la Fusion
- [ ] Tests passent
- [ ] Couverture > 80%
- [ ] Pas de conflits
- [ ] Approuvé par au moins 1 reviewer
- [ ] Documentation à jour

### Après la Fusion
- [ ] Branche supprimée
- [ ] Issue fermée
- [ ] Changelog mis à jour

## Branches

### Nommage
- `feature/description` - Nouvelle fonctionnalité
- `fix/description` - Correction de bug
- `docs/description` - Documentation
- `refactor/description` - Refactorisation
- `test/description` - Tests

### Protection
- `main` - Production
- `develop` - Développement
- `staging` - Staging

## Releases

### Versioning
- Utiliser Semantic Versioning (MAJOR.MINOR.PATCH)
- v1.0.0 - Release majeure
- v1.1.0 - Nouvelle fonctionnalité
- v1.0.1 - Bug fix

### Changelog
```markdown
# v1.1.0 (2026-02-15)

## Features
- Ajouter la fonctionnalité X
- Ajouter la fonctionnalité Y

## Bug Fixes
- Corriger le bug X
- Corriger le bug Y

## Breaking Changes
- Supprimer l'endpoint X
```

## Outils

### Linting
```bash
# Installer
pip install flake8 black isort

# Linter
flake8 .

# Formater
black .
isort .
```

### Type Checking
```bash
# Installer
pip install mypy

# Vérifier
mypy .
```

### Pre-commit Hooks
```bash
# Installer
pip install pre-commit

# Configurer
pre-commit install

# Lancer
pre-commit run --all-files
```

## Ressources

### Documentation
- [Django Contributing](https://docs.djangoproject.com/en/4.2/internals/contributing/)
- [GitHub Contributing](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions)
- [Semantic Versioning](https://semver.org/)

### Outils
- [Git](https://git-scm.com/)
- [GitHub](https://github.com/)
- [Pytest](https://docs.pytest.org/)
- [Black](https://black.readthedocs.io/)

## Questions?

- Ouvrir une issue
- Discuter dans les discussions
- Contacter l'équipe

## Merci!

Merci de contribuer à Mwolo Energy Systems! 🎉
