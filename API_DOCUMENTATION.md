# Documentation API - Mwolo Energy Systems

## Base URL
```
http://localhost:8000/api/
```

## Authentication

Toutes les requêtes (sauf login et CMS public) nécessitent un JWT token.

### Login
```
POST /auth/login/
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "password"
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Refresh Token
```
POST /auth/refresh/
Content-Type: application/json

{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}

Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## Endpoints

### Géographie

#### Pays
```
GET /geo/countries/
GET /geo/countries/{id}/
```

#### Provinces
```
GET /geo/provinces/
GET /geo/provinces/?country={country_id}
GET /geo/provinces/{id}/
```

#### Communes
```
GET /geo/communes/
GET /geo/communes/?province={province_id}
GET /geo/communes/{id}/
```

#### Territoires
```
GET /geo/territories/
GET /geo/territories/?commune={commune_id}
GET /geo/territories/{id}/
```

### Agences

```
GET /agencies/
GET /agencies/{id}/
POST /agencies/
PUT /agencies/{id}/
PATCH /agencies/{id}/
DELETE /agencies/{id}/
```

### RH

#### Employés
```
GET /hr/employees/
GET /hr/employees/?agency={agency_id}&status=actif
GET /hr/employees/{id}/
POST /hr/employees/
PUT /hr/employees/{id}/
PATCH /hr/employees/{id}/
DELETE /hr/employees/{id}/
```

#### Congés
```
GET /hr/leaves/
GET /hr/leaves/?employee={employee_id}&status=demande
GET /hr/leaves/{id}/
POST /hr/leaves/
PUT /hr/leaves/{id}/
PATCH /hr/leaves/{id}/
DELETE /hr/leaves/{id}/
```

#### Présences
```
GET /hr/attendance/
GET /hr/attendance/?employee={employee_id}&date={date}
GET /hr/attendance/{id}/
POST /hr/attendance/
PUT /hr/attendance/{id}/
PATCH /hr/attendance/{id}/
DELETE /hr/attendance/{id}/
```

#### Paie
```
GET /hr/payroll/
GET /hr/payroll/?employee={employee_id}&month={month}
GET /hr/payroll/{id}/
POST /hr/payroll/
PUT /hr/payroll/{id}/
PATCH /hr/payroll/{id}/
DELETE /hr/payroll/{id}/
```

### CRM

#### Clients
```
GET /crm/clients/
GET /crm/clients/?agency={agency_id}&status=actif
GET /crm/clients/{id}/
POST /crm/clients/
PUT /crm/clients/{id}/
PATCH /crm/clients/{id}/
DELETE /crm/clients/{id}/
```

#### Sites
```
GET /crm/sites/
GET /crm/sites/?client={client_id}&is_active=true
GET /crm/sites/{id}/
POST /crm/sites/
PUT /crm/sites/{id}/
PATCH /crm/sites/{id}/
DELETE /crm/sites/{id}/
```

#### Contrats
```
GET /crm/contracts/
GET /crm/contracts/?client={client_id}&status=actif
GET /crm/contracts/{id}/
POST /crm/contracts/
PUT /crm/contracts/{id}/
PATCH /crm/contracts/{id}/
DELETE /crm/contracts/{id}/
```

### Facturation

#### Factures
```
GET /billing/invoices/
GET /billing/invoices/?client={client_id}&status=payee
GET /billing/invoices/{id}/
POST /billing/invoices/
PUT /billing/invoices/{id}/
PATCH /billing/invoices/{id}/
DELETE /billing/invoices/{id}/
```

#### Paiements
```
GET /billing/payments/
GET /billing/payments/?invoice={invoice_id}&status=confirmed
GET /billing/payments/{id}/
POST /billing/payments/
PUT /billing/payments/{id}/
PATCH /billing/payments/{id}/
DELETE /billing/payments/{id}/
```

### Opérations

#### Équipements
```
GET /operations/equipment/
GET /operations/equipment/?site={site_id}&status=actif
GET /operations/equipment/{id}/
POST /operations/equipment/
PUT /operations/equipment/{id}/
PATCH /operations/equipment/{id}/
DELETE /operations/equipment/{id}/
```

#### Compteurs
```
GET /operations/meters/
GET /operations/meters/?status=actif&service_active=true
GET /operations/meters/{id}/
POST /operations/meters/
PUT /operations/meters/{id}/
PATCH /operations/meters/{id}/
DELETE /operations/meters/{id}/
```

#### Interventions
```
GET /operations/interventions/
GET /operations/interventions/?site={site_id}&status=planifiee
GET /operations/interventions/{id}/
POST /operations/interventions/
PUT /operations/interventions/{id}/
PATCH /operations/interventions/{id}/
DELETE /operations/interventions/{id}/
```

### Support

#### Tickets
```
GET /support/tickets/
GET /support/tickets/?client={client_id}&status=ouvert
GET /support/tickets/{id}/
POST /support/tickets/
PUT /support/tickets/{id}/
PATCH /support/tickets/{id}/
DELETE /support/tickets/{id}/
```

### CMS (Public)

#### Pages
```
GET /cms/pages/
GET /cms/pages/?slug=accueil
GET /cms/pages/{slug}/
```

#### Articles
```
GET /cms/posts/
GET /cms/posts/{slug}/
```

#### Services
```
GET /cms/services/
GET /cms/services/{id}/
```

#### Leads (Formulaire contact)
```
POST /cms/leads/
{
  "first_name": "Jean",
  "last_name": "Dupont",
  "email": "jean@example.com",
  "phone": "+243123456789",
  "subject": "Demande d'information",
  "message": "Je souhaite avoir plus d'informations..."
}
```

## Filtrage et Recherche

### Filtrage
```
GET /api/crm/clients/?agency={agency_id}&status=actif
```

### Recherche
```
GET /api/crm/clients/?search=dupont
```

### Tri
```
GET /api/crm/clients/?ordering=-created_at
```

### Pagination
```
GET /api/crm/clients/?page=1&page_size=20
```

## Codes de Statut HTTP

- `200 OK` - Succès
- `201 Created` - Ressource créée
- `204 No Content` - Succès sans contenu
- `400 Bad Request` - Erreur de validation
- `401 Unauthorized` - Non authentifié
- `403 Forbidden` - Non autorisé
- `404 Not Found` - Ressource non trouvée
- `500 Internal Server Error` - Erreur serveur

## Erreurs

```json
{
  "detail": "Message d'erreur",
  "errors": {
    "field": ["Erreur de validation"]
  }
}
```

## Exemples

### Créer un client
```bash
curl -X POST http://localhost:8000/api/crm/clients/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jean",
    "last_name": "Dupont",
    "email": "jean@example.com",
    "phone": "+243123456789",
    "nif": "123456789",
    "nationality": "Congolaise",
    "date_of_birth": "1990-01-01",
    "place_of_birth": "Kinshasa",
    "country": "country_id",
    "province": "province_id",
    "commune": "commune_id",
    "territory": "territory_id",
    "address": "123 Rue Test",
    "agency": "agency_id",
    "status": "prospect"
  }'
```

### Créer une facture
```bash
curl -X POST http://localhost:8000/api/billing/invoices/ \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "client": "client_id",
    "period_start": "2026-01-01",
    "period_end": "2026-01-31",
    "currency": "USD",
    "subtotal": "1000.00",
    "tax_amount": "100.00",
    "total": "1100.00",
    "status": "brouillon"
  }'
```

## Documentation Interactive

Accédez à la documentation Swagger à:
```
http://localhost:8000/api/docs/
```

Accédez au schéma OpenAPI à:
```
http://localhost:8000/api/schema/
```
