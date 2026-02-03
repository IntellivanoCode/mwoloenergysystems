# Actions Prioritaires - Mwolo Energy Systems
## Ce qui manque et comment le compléter

**Date**: 2026-02-01

---

## 🎯 RÉSUMÉ EXÉCUTIF

**Conformité globale**: ~75%

**Ce qui est fait** ✅:
- Tous les modèles Django (100%)
- Structure complète du projet (100%)
- Système de permissions et audit (100%)
- Admin Jazzmin configuré (100%)

**Ce qui manque** 🔴:
- Intégration paiements mobiles (0%)
- Liaison compteur IoT (0%)
- Génération PDF (0%)
- Tâches Celery concrètes (0%)
- Frontend fonctionnel (30%)

---

## 🔴 ACTIONS CRITIQUES (À FAIRE EN PRIORITÉ)

### 1. Ajouter Support Paiements Mobiles

**Fichier**: `mwolo-energy-systems/billing/models.py`

**Action**: Ajouter ces champs au modèle `Payment`:

```python
class Payment(models.Model):
    # ... champs existants ...
    
    # NOUVEAUX CHAMPS À AJOUTER
    mobile_operator = models.CharField(
        max_length=20,
        choices=[
            ('mpesa', 'M-Pesa'),
            ('airtel', 'Airtel Money'),
            ('vodacom', 'Vodacom M-Pesa'),
            ('orange', 'Orange Money'),
        ],
        blank=True,
        null=True,
        verbose_name="Opérateur mobile"
    )
    mobile_number = models.CharField(
        max_length=20,
        blank=True,
        verbose_name="Numéro mobile"
    )
    transaction_id = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="ID Transaction"
    )
```

**Commandes après modification**:
```bash
cd mwolo-energy-systems
python manage.py makemigrations billing
python manage.py migrate billing
```

---

### 2. Implémenter Génération PDF Factures

**Fichier à créer**: `mwolo-energy-systems/billing/pdf_generator.py`

```python
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from django.conf import settings
import os

def generate_invoice_pdf(invoice):
    """Générer le PDF d'une facture"""
    filename = f"invoice_{invoice.invoice_number}.pdf"
    filepath = os.path.join(settings.MEDIA_ROOT, 'invoices', filename)
    
    # Créer le répertoire si nécessaire
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    # Créer le document
    doc = SimpleDocTemplate(filepath, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()
    
    # En-tête
    elements.append(Paragraph("MWOLO ENERGY SYSTEMS", styles['Title']))
    elements.append(Spacer(1, 0.5*cm))
    elements.append(Paragraph(f"Facture N°: {invoice.invoice_number}", styles['Heading2']))
    elements.append(Spacer(1, 0.5*cm))
    
    # Informations client
    client_info = f"""
    <b>Client:</b> {invoice.client.first_name} {invoice.client.last_name}<br/>
    <b>Email:</b> {invoice.client.email}<br/>
    <b>Téléphone:</b> {invoice.client.phone}<br/>
    <b>Période:</b> {invoice.period_start} - {invoice.period_end}
    """
    elements.append(Paragraph(client_info, styles['Normal']))
    elements.append(Spacer(1, 1*cm))
    
    # Tableau des lignes
    data = [['Description', 'Quantité', 'Prix Unit.', 'Remise', 'Total']]
    for line in invoice.lines.all():
        data.append([
            line.description,
            str(line.quantity),
            f"{line.unit_price} {invoice.currency}",
            f"{line.discount} {invoice.currency}",
            f"{line.total} {invoice.currency}"
        ])
    
    # Totaux
    data.append(['', '', '', 'Sous-total:', f"{invoice.subtotal} {invoice.currency}"])
    data.append(['', '', '', 'Taxes:', f"{invoice.tax_amount} {invoice.currency}"])
    data.append(['', '', '', 'TOTAL:', f"{invoice.total} {invoice.currency}"])
    
    table = Table(data, colWidths=[8*cm, 2*cm, 3*cm, 3*cm, 3*cm])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    elements.append(table)
    
    # Construire le PDF
    doc.build(elements)
    
    return filepath


def generate_receipt_pdf(payment):
    """Générer le PDF d'un reçu de paiement"""
    filename = f"receipt_{payment.reference}.pdf"
    filepath = os.path.join(settings.MEDIA_ROOT, 'receipts', filename)
    
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    doc = SimpleDocTemplate(filepath, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()
    
    # En-tête
    elements.append(Paragraph("MWOLO ENERGY SYSTEMS", styles['Title']))
    elements.append(Spacer(1, 0.5*cm))
    elements.append(Paragraph("REÇU DE PAIEMENT", styles['Heading2']))
    elements.append(Spacer(1, 1*cm))
    
    # Informations paiement
    payment_info = f"""
    <b>Référence:</b> {payment.reference}<br/>
    <b>Facture:</b> {payment.invoice.invoice_number}<br/>
    <b>Client:</b> {payment.invoice.client.first_name} {payment.invoice.client.last_name}<br/>
    <b>Montant:</b> {payment.amount} {payment.invoice.currency}<br/>
    <b>Méthode:</b> {payment.get_method_display()}<br/>
    <b>Date:</b> {payment.payment_date}<br/>
    <b>Statut:</b> {payment.get_status_display()}
    """
    elements.append(Paragraph(payment_info, styles['Normal']))
    
    doc.build(elements)
    
    return filepath
```

**Fichier à modifier**: `mwolo-energy-systems/billing/views.py`

Ajouter cette méthode dans le ViewSet des factures:

```python
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import FileResponse
from .pdf_generator import generate_invoice_pdf

class InvoiceViewSet(viewsets.ModelViewSet):
    # ... code existant ...
    
    @action(detail=True, methods=['get'])
    def pdf(self, request, pk=None):
        """Générer et télécharger le PDF de la facture"""
        invoice = self.get_object()
        
        # Générer le PDF si pas déjà fait
        if not invoice.pdf_file:
            filepath = generate_invoice_pdf(invoice)
            invoice.pdf_file = filepath
            invoice.save()
        
        # Retourner le fichier
        return FileResponse(
            open(invoice.pdf_file.path, 'rb'),
            content_type='application/pdf',
            as_attachment=True,
            filename=f"facture_{invoice.invoice_number}.pdf"
        )
```

**Installation requise**:
```bash
pip install reportlab
pip freeze > requirements.txt
```

---

### 3. Créer Tâches Celery

**Fichier**: `mwolo-energy-systems/billing/tasks.py`

**Remplacer le contenu par**:

```python
from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Invoice, Reminder
from .pdf_generator import generate_invoice_pdf, generate_receipt_pdf
from operations.models import Meter

@shared_task
def generate_invoice_pdf_task(invoice_id):
    """Générer le PDF d'une facture de manière asynchrone"""
    try:
        invoice = Invoice.objects.get(id=invoice_id)
        filepath = generate_invoice_pdf(invoice)
        invoice.pdf_file = filepath
        invoice.save()
        return f"PDF généré: {filepath}"
    except Invoice.DoesNotExist:
        return f"Facture {invoice_id} introuvable"


@shared_task
def send_invoice_reminder(invoice_id, reminder_type):
    """Envoyer une relance pour une facture impayée"""
    try:
        invoice = Invoice.objects.get(id=invoice_id)
        
        # Vérifier si la relance n'a pas déjà été envoyée
        if Reminder.objects.filter(invoice=invoice, reminder_type=reminder_type).exists():
            return f"Relance {reminder_type} déjà envoyée"
        
        # Créer la relance
        Reminder.objects.create(invoice=invoice, reminder_type=reminder_type)
        
        # TODO: Envoyer email/SMS
        # send_email(invoice.client.email, ...)
        # send_sms(invoice.client.phone, ...)
        
        return f"Relance {reminder_type} envoyée pour facture {invoice.invoice_number}"
    except Invoice.DoesNotExist:
        return f"Facture {invoice_id} introuvable"


@shared_task
def check_unpaid_invoices():
    """Vérifier les factures impayées et envoyer des relances"""
    today = timezone.now().date()
    
    # Factures impayées
    unpaid_invoices = Invoice.objects.filter(
        status__in=['envoyee', 'partiellement_payee']
    )
    
    for invoice in unpaid_invoices:
        days_overdue = (today - invoice.period_end).days
        
        # Relance J+3
        if days_overdue >= 3 and not Reminder.objects.filter(
            invoice=invoice, reminder_type='j3'
        ).exists():
            send_invoice_reminder.delay(str(invoice.id), 'j3')
        
        # Relance J+7
        elif days_overdue >= 7 and not Reminder.objects.filter(
            invoice=invoice, reminder_type='j7'
        ).exists():
            send_invoice_reminder.delay(str(invoice.id), 'j7')
        
        # Relance J+14 + désactivation service
        elif days_overdue >= 14:
            if not Reminder.objects.filter(
                invoice=invoice, reminder_type='j14'
            ).exists():
                send_invoice_reminder.delay(str(invoice.id), 'j14')
            
            # Désactiver le service
            deactivate_service_for_invoice.delay(str(invoice.id))
    
    return f"Vérification terminée: {unpaid_invoices.count()} factures impayées"


@shared_task
def deactivate_service_for_invoice(invoice_id):
    """Désactiver le service client pour facture impayée"""
    try:
        invoice = Invoice.objects.get(id=invoice_id)
        
        # Trouver le compteur du site
        if invoice.site:
            meters = Meter.objects.filter(
                equipment__site=invoice.site,
                service_active=True
            )
            
            for meter in meters:
                meter.deactivate_service()
                # TODO: Envoyer commande au compteur IoT
                # send_iot_command(meter.meter_number, 'DEACTIVATE')
            
            return f"Service désactivé pour {meters.count()} compteur(s)"
        
        return "Aucun site associé à la facture"
    except Invoice.DoesNotExist:
        return f"Facture {invoice_id} introuvable"
```

**Fichier à créer**: `mwolo-energy-systems/config/celery_beat_schedule.py`

```python
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'check-unpaid-invoices-daily': {
        'task': 'billing.tasks.check_unpaid_invoices',
        'schedule': crontab(hour=9, minute=0),  # Tous les jours à 9h
    },
}
```

**Fichier à modifier**: `mwolo-energy-systems/config/settings.py`

Ajouter:
```python
from .celery_beat_schedule import CELERY_BEAT_SCHEDULE
```

---

### 4. Créer Signal pour Désactivation Automatique

**Fichier à créer**: `mwolo-energy-systems/billing/signals.py`

```python
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Invoice
from .tasks import check_unpaid_invoices

@receiver(post_save, sender=Invoice)
def invoice_status_changed(sender, instance, created, **kwargs):
    """Vérifier le statut de la facture et agir en conséquence"""
    if not created and instance.status == 'envoyee':
        # Planifier la vérification des relances
        check_unpaid_invoices.apply_async(countdown=60)  # Dans 1 minute
```

**Fichier à modifier**: `mwolo-energy-systems/billing/apps.py`

```python
from django.apps import AppConfig

class BillingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'billing'
    
    def ready(self):
        import billing.signals  # Importer les signaux
```

---

### 5. Ajouter Endpoint API pour Agences Publiques

**Fichier**: `mwolo-energy-systems/agencies/views.py`

Ajouter:

```python
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny

class AgencyViewSet(viewsets.ModelViewSet):
    # ... code existant ...
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public_list(self, request):
        """Liste publique des agences pour le site vitrine"""
        agencies = self.queryset.filter(is_active=True)
        serializer = self.get_serializer(agencies, many=True)
        return Response(serializer.data)
```

---

## ⚠️ ACTIONS IMPORTANTES (MOYEN TERME)

### 6. Compléter le Frontend Next.js

**Répertoire**: `mwolo-energy-systems/frontend/`

**Pages à créer/compléter**:

1. **Portail Employés** (`/employee-dashboard`):
   - Dashboard avec KPIs
   - Gestion clients (CRUD)
   - Gestion factures
   - Gestion paiements
   - Gestion tickets support

2. **Portail Clients** (`/dashboard`):
   - Mes factures
   - Mes paiements
   - Mes tickets
   - Mon profil

3. **Site Vitrine**:
   - Page agences (`/agencies`)
   - Formulaire inscription client
   - Pages CMS dynamiques

**Exemple de page agences** (`frontend/src/app/agencies/page.tsx`):

```typescript
'use client';

import { useEffect, useState } from 'react';

interface Agency {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  province: {
    name: string;
  };
  territory: {
    name: string;
  };
}

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/agencies/public_list/')
      .then(res => res.json())
      .then(data => {
        setAgencies(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Nos Agences</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agencies.map(agency => (
          <div key={agency.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-2">{agency.name}</h2>
            <p className="text-gray-600 mb-2">Code: {agency.code}</p>
            <p className="text-gray-600 mb-2">
              {agency.province.name}, {agency.territory.name}
            </p>
            <p className="text-gray-600 mb-2">{agency.address}</p>
            <p className="text-gray-600 mb-2">📞 {agency.phone}</p>
            <p className="text-gray-600">✉️ {agency.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 7. Ajouter Validations Serveur

**Fichier**: `mwolo-energy-systems/crm/models.py`

Ajouter dans la classe `Client`:

```python
from django.core.exceptions import ValidationError

class Client(models.Model):
    # ... champs existants ...
    
    def clean(self):
        """Validations personnalisées"""
        super().clean()
        
        # Valider que la province appartient au pays
        if self.province.country != self.country:
            raise ValidationError({
                'province': 'La province ne correspond pas au pays sélectionné.'
            })
        
        # Valider que la commune appartient à la province
        if self.commune.province != self.province:
            raise ValidationError({
                'commune': 'La commune ne correspond pas à la province sélectionnée.'
            })
        
        # Valider que le territoire appartient à la commune
        if self.territory.commune != self.commune:
            raise ValidationError({
                'territory': 'Le territoire ne correspond pas à la commune sélectionnée.'
            })
    
    def save(self, *args, **kwargs):
        self.full_clean()  # Appeler les validations
        super().save(*args, **kwargs)
```

Faire de même pour `Site`, `Employee`, etc.

---

### 8. Ajouter Tests

**Fichier à créer**: `mwolo-energy-systems/tests/test_billing_pdf.py`

```python
import pytest
from billing.models import Invoice, InvoiceLine
from billing.pdf_generator import generate_invoice_pdf
from crm.models import Client
import os

@pytest.mark.django_db
def test_generate_invoice_pdf(client_fixture, invoice_fixture):
    """Tester la génération de PDF de facture"""
    filepath = generate_invoice_pdf(invoice_fixture)
    
    assert os.path.exists(filepath)
    assert filepath.endswith('.pdf')
    assert os.path.getsize(filepath) > 0
```

---

## 📋 CHECKLIST COMPLÈTE

### Backend
- [x] Modèles de données
- [x] Admin Jazzmin
- [x] Système de permissions
- [x] Audit logs
- [ ] Champs paiements mobiles
- [ ] Génération PDF
- [ ] Tâches Celery
- [ ] Signaux Django
- [ ] Validations serveur
- [ ] Tests complets

### API
- [x] Structure de base
- [x] Serializers
- [x] ViewSets
- [ ] Endpoint agences publiques
- [ ] Endpoint génération PDF
- [ ] Documentation API (Swagger)

### Frontend
- [x] Structure Next.js
- [ ] Portail employés
- [ ] Portail clients
- [ ] Site vitrine
- [ ] Page agences
- [ ] Formulaire inscription

### Intégrations
- [ ] API M-Pesa
- [ ] API Airtel Money
- [ ] API Vodacom M-Pesa
- [ ] Système IoT compteurs
- [ ] Email (SMTP)
- [ ] SMS

### Déploiement
- [x] Docker
- [x] Docker Compose
- [ ] Configuration production
- [ ] SSL/TLS
- [ ] Backup automatique

---

## 🚀 COMMANDES POUR DÉMARRER

```bash
# 1. Installer les dépendances
cd mwolo-energy-systems
pip install reportlab

# 2. Créer les migrations pour les nouveaux champs
python manage.py makemigrations

# 3. Appliquer les migrations
python manage.py migrate

# 4. Lancer le serveur
python manage.py runserver

# 5. Lancer Celery (dans un autre terminal)
celery -A config worker -l info

# 6. Lancer Celery Beat (dans un autre terminal)
celery -A config beat -l info

# 7. Lancer le frontend (dans un autre terminal)
cd frontend
npm run dev
```

---

## 📞 PROCHAINES ÉTAPES

1. **Aujourd'hui**: Ajouter champs paiements mobiles + migration
2. **Cette semaine**: Implémenter génération PDF
3. **Semaine prochaine**: Créer tâches Celery
4. **Dans 2 semaines**: Compléter frontend
5. **Dans 1 mois**: Intégrations externes (paiements, IoT)

---

**Note**: Ce document liste toutes les actions concrètes à prendre. Commencez par les actions critiques (1-5) avant de passer aux actions importantes (6-8).
