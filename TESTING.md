# Guide de Test

## Framework de Test

### Pytest
```bash
# Installation
pip install pytest pytest-django pytest-cov

# Lancer les tests
pytest
pytest -v
pytest --cov=.
```

### Django Test
```bash
# Lancer les tests Django
python manage.py test
python manage.py test app_name
```

## Structure des Tests

```
tests/
├── __init__.py
├── conftest.py
├── test_auth.py
├── test_billing.py
├── test_crm.py
├── test_hr.py
└── test_permissions.py
```

## Fixtures

### Fixtures Pytest
```python
# tests/conftest.py
@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def authenticated_user(db):
    return User.objects.create_user(
        username='testuser',
        password='testpass123'
    )
```

### Utiliser les Fixtures
```python
def test_login(api_client):
    response = api_client.post('/api/auth/login/', {
        'username': 'testuser',
        'password': 'testpass123'
    })
    assert response.status_code == 200
```

## Tests Unitaires

### Tester les Modèles
```python
@pytest.mark.django_db
class TestClient:
    def test_create_client(self):
        client = Client.objects.create(
            first_name='Jean',
            last_name='Dupont',
            email='jean@example.com',
            nif='123456789',
            nationality='Congolaise',
            date_of_birth='1990-01-01',
            place_of_birth='Kinshasa',
            country=country,
            province=province,
            commune=commune,
            territory=territory,
            address='123 Rue Test',
            agency=agency
        )
        assert client.first_name == 'Jean'
        assert client.last_name == 'Dupont'
```

### Tester les Serializers
```python
def test_client_serializer():
    data = {
        'first_name': 'Jean',
        'last_name': 'Dupont',
        'email': 'jean@example.com',
        'nif': '123456789',
        'nationality': 'Congolaise',
        'date_of_birth': '1990-01-01',
        'place_of_birth': 'Kinshasa',
        'country': country.id,
        'province': province.id,
        'commune': commune.id,
        'territory': territory.id,
        'address': '123 Rue Test',
        'agency': agency.id,
    }
    serializer = ClientSerializer(data=data)
    assert serializer.is_valid()
```

## Tests d'Intégration

### Tester l'API
```python
@pytest.mark.django_db
class TestClientAPI:
    def test_list_clients(self, authenticated_client):
        response = authenticated_client.get('/api/crm/clients/')
        assert response.status_code == 200
        assert 'results' in response.data
    
    def test_create_client(self, authenticated_client):
        data = {
            'first_name': 'Jean',
            'last_name': 'Dupont',
            'email': 'jean@example.com',
            'nif': '123456789',
            'nationality': 'Congolaise',
            'date_of_birth': '1990-01-01',
            'place_of_birth': 'Kinshasa',
            'country': country.id,
            'province': province.id,
            'commune': commune.id,
            'territory': territory.id,
            'address': '123 Rue Test',
            'agency': agency.id,
        }
        response = authenticated_client.post('/api/crm/clients/', data)
        assert response.status_code == 201
```

## Tests de Permissions

### Tester les Permissions
```python
@pytest.mark.django_db
class TestPermissions:
    def test_client_cannot_access_hr(self, api_client):
        # Créer un client
        client_user = User.objects.create_user(
            username='client',
            password='password',
            role='client'
        )
        api_client.force_authenticate(user=client_user)
        
        # Essayer d'accéder à HR
        response = api_client.get('/api/hr/employees/')
        assert response.status_code == 403
    
    def test_rh_can_access_hr(self, api_client):
        # Créer un RH
        rh_user = User.objects.create_user(
            username='rh',
            password='password',
            role='rh'
        )
        api_client.force_authenticate(user=rh_user)
        
        # Accéder à HR
        response = api_client.get('/api/hr/employees/')
        assert response.status_code == 200
```

## Tests de Validation

### Tester la Validation
```python
@pytest.mark.django_db
class TestValidation:
    def test_invalid_nif(self, authenticated_client):
        data = {
            'first_name': 'Jean',
            'last_name': 'Dupont',
            'email': 'jean@example.com',
            'nif': 'invalid',  # NIF invalide
            'nationality': 'Congolaise',
            'date_of_birth': '1990-01-01',
            'place_of_birth': 'Kinshasa',
            'country': country.id,
            'province': province.id,
            'commune': commune.id,
            'territory': territory.id,
            'address': '123 Rue Test',
            'agency': agency.id,
        }
        response = authenticated_client.post('/api/crm/clients/', data)
        assert response.status_code == 400
        assert 'nif' in response.data
```

## Tests de Performance

### Tester les Performances
```python
import time

@pytest.mark.django_db
def test_list_clients_performance(authenticated_client):
    # Créer 1000 clients
    for i in range(1000):
        Client.objects.create(...)
    
    # Mesurer le temps
    start = time.time()
    response = authenticated_client.get('/api/crm/clients/')
    end = time.time()
    
    # Vérifier que c'est rapide
    assert (end - start) < 1.0  # Moins d'1 seconde
```

## Tests de Sécurité

### Tester la Sécurité
```python
@pytest.mark.django_db
class TestSecurity:
    def test_sql_injection(self, authenticated_client):
        # Essayer une injection SQL
        response = authenticated_client.get("/api/crm/clients/?search='; DROP TABLE crm_client; --")
        assert response.status_code == 200
        # Vérifier que la table existe toujours
        assert Client.objects.count() > 0
    
    def test_xss_protection(self, authenticated_client):
        # Essayer une injection XSS
        data = {
            'first_name': '<script>alert("XSS")</script>',
            'last_name': 'Dupont',
            'email': 'jean@example.com',
            'nif': '123456789',
            'nationality': 'Congolaise',
            'date_of_birth': '1990-01-01',
            'place_of_birth': 'Kinshasa',
            'country': country.id,
            'province': province.id,
            'commune': commune.id,
            'territory': territory.id,
            'address': '123 Rue Test',
            'agency': agency.id,
        }
        response = authenticated_client.post('/api/crm/clients/', data)
        assert response.status_code == 201
        # Vérifier que le script n'est pas exécuté
        assert '<script>' not in response.data['first_name']
```

## Couverture de Test

### Générer un Rapport de Couverture
```bash
# Générer le rapport
pytest --cov=. --cov-report=html

# Ouvrir le rapport
open htmlcov/index.html
```

### Cible de Couverture
- Minimum 80% de couverture globale
- 100% pour les modèles critiques
- 100% pour les permissions
- 100% pour l'authentification

## Mocking

### Mocker les Dépendances Externes
```python
from unittest.mock import patch

@patch('billing.tasks.send_mail')
def test_send_invoice_reminder(mock_send_mail):
    # Appeler la fonction
    send_invoice_reminder_email(invoice_id, 'j3')
    
    # Vérifier que send_mail a été appelé
    mock_send_mail.assert_called_once()
```

## Tests Asynchrones

### Tester les Tâches Celery
```python
@pytest.mark.django_db
def test_send_reminders_task():
    # Créer une facture
    invoice = Invoice.objects.create(...)
    
    # Appeler la tâche
    send_reminders.delay('j3')
    
    # Vérifier que la relance a été créée
    assert Reminder.objects.filter(invoice=invoice, reminder_type='j3').exists()
```

## Tests d'Intégration Continue

### GitHub Actions
```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: 3.11
      - run: pip install -r requirements.txt
      - run: pytest --cov=.
```

## Checklist de Test

### Avant le Déploiement
- [ ] Tests unitaires passent
- [ ] Tests d'intégration passent
- [ ] Tests de permissions passent
- [ ] Tests de validation passent
- [ ] Tests de sécurité passent
- [ ] Couverture > 80%
- [ ] Pas de warnings
- [ ] Pas de erreurs

### Après le Déploiement
- [ ] Tests de fumée passent
- [ ] Monitoring actif
- [ ] Logs vérifiés
- [ ] Performance acceptable
- [ ] Pas d'erreurs en production

## Ressources

### Documentation
- [Pytest Documentation](https://docs.pytest.org/)
- [Django Testing](https://docs.djangoproject.com/en/4.2/topics/testing/)
- [Django REST Framework Testing](https://www.django-rest-framework.org/api-guide/testing/)

### Outils
- [Pytest](https://docs.pytest.org/)
- [Coverage.py](https://coverage.readthedocs.io/)
- [Factory Boy](https://factoryboy.readthedocs.io/)
- [Faker](https://faker.readthedocs.io/)

### Communautés
- [Pytest Community](https://docs.pytest.org/)
- [Django Testing](https://docs.djangoproject.com/en/4.2/topics/testing/)
- [Python Testing](https://docs.python.org/3/library/unittest.html)
