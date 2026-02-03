# Fixtures et Données Initiales

## Charger les données initiales

```bash
python manage.py init_data
```

Cela va créer:
- Les rôles et permissions de base
- Un superadmin (admin/admin123)
- Les données géographiques de la RDC

## Données créées

### Rôles et Permissions

#### Super Admin
- Accès complet à tous les modules

#### Admin
- Accès complet sauf les paramètres système

#### RH
- Accès complet au module RH
- Lecture limitée du CRM

#### Comptable
- Accès complet à la facturation
- Lecture limitée du CRM

#### Opérations
- Accès complet aux opérations
- Lecture limitée du CRM

#### Agent Commercial
- Accès au CRM (créer, lire, modifier)
- Lecture limitée à la facturation

#### Employé
- Lecture du module RH

#### Client
- Lecture de la facturation
- Accès au support

### Géographie (RDC)

#### Pays
- République Démocratique du Congo (CD)

#### Provinces
- Kinshasa (KIN)
- Kasai (KAS)
- Katanga (KAT)
- Kivu (KIV)
- Bandundu (BAN)
- Équateur (EQU)
- Orientale (ORI)
- Maniema (MAN)

## Créer des fixtures personnalisées

### Exporter les données
```bash
python manage.py dumpdata geo > geo_data.json
python manage.py dumpdata accounts > accounts_data.json
```

### Importer les données
```bash
python manage.py loaddata geo_data.json
python manage.py loaddata accounts_data.json
```

## Données de test

### Créer un utilisateur de test
```bash
python manage.py shell
```

```python
from django.contrib.auth import get_user_model
User = get_user_model()

# Créer un employé
user = User.objects.create_user(
    username='employe1',
    email='employe1@example.com',
    password='password123',
    role='employe'
)

# Créer un client
user = User.objects.create_user(
    username='client1',
    email='client1@example.com',
    password='password123',
    role='client'
)

# Créer un RH
user = User.objects.create_user(
    username='rh1',
    email='rh1@example.com',
    password='password123',
    role='rh'
)
```

### Créer une agence de test
```python
from geo.models import Country, Province, Commune, Territory
from agencies.models import Agency

# Récupérer la géographie
country = Country.objects.get(code='CD')
province = Province.objects.get(code='KIN')
commune = Commune.objects.get(code='GOM')
territory = Territory.objects.get(code='GOM')

# Créer une agence
agency = Agency.objects.create(
    name='Agence Kinshasa',
    territory=territory,
    address='123 Rue Test',
    phone='+243123456789',
    email='agency@example.com'
)
```

### Créer un client de test
```python
from crm.models import Client

client = Client.objects.create(
    first_name='Jean',
    last_name='Dupont',
    nationality='Congolaise',
    date_of_birth='1990-01-01',
    place_of_birth='Kinshasa',
    nif='123456789',
    email='client@example.com',
    phone='+243123456789',
    country=country,
    province=province,
    commune=commune,
    territory=territory,
    address='456 Rue Client',
    agency=agency,
    status='actif'
)
```

### Créer une facture de test
```python
from billing.models import Invoice, InvoiceLine
from datetime import date

invoice = Invoice.objects.create(
    client=client,
    period_start=date(2026, 1, 1),
    period_end=date(2026, 1, 31),
    currency='USD',
    subtotal=1000.00,
    tax_amount=100.00,
    total=1100.00,
    status='brouillon'
)

# Ajouter une ligne
InvoiceLine.objects.create(
    invoice=invoice,
    description='Consommation électrique',
    quantity=100,
    unit_price=10.00,
    discount=0,
    total=1000.00
)
```

## Réinitialiser la base de données

### Supprimer toutes les données
```bash
python manage.py flush
```

### Réinitialiser et charger les données initiales
```bash
python manage.py flush --no-input
python manage.py init_data
```

## Sauvegarde et restauration

### Sauvegarder la base de données
```bash
python manage.py dumpdata > backup.json
```

### Restaurer la base de données
```bash
python manage.py loaddata backup.json
```

## Données de production

Pour la production, créez des fixtures avec les données réelles:

```bash
# Exporter les données
python manage.py dumpdata geo --indent 2 > fixtures/geo_data.json
python manage.py dumpdata accounts --indent 2 > fixtures/accounts_data.json

# Importer les données
python manage.py loaddata fixtures/geo_data.json
python manage.py loaddata fixtures/accounts_data.json
```
