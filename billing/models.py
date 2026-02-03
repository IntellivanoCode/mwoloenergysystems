from django.db import models
from crm.models import Client, Site
from accounts.models import User
import uuid

class Invoice(models.Model):
    STATUS_CHOICES = [
        ('brouillon', 'Brouillon'),
        ('validee', 'Validée'),
        ('envoyee', 'Envoyée'),
        ('partiellement_payee', 'Partiellement payée'),
        ('payee', 'Payée'),
        ('annulee', 'Annulée'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice_number = models.CharField(max_length=50, unique=True)
    
    client = models.ForeignKey(Client, on_delete=models.PROTECT, related_name='invoices')
    site = models.ForeignKey(Site, on_delete=models.SET_NULL, null=True, blank=True)
    
    period_start = models.DateField()
    period_end = models.DateField()
    
    currency = models.CharField(max_length=3, default='USD')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='brouillon')
    
    pdf_file = models.FileField(upload_to='invoices/', null=True, blank=True)
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_invoices')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Facture'
        verbose_name_plural = 'Factures'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['client', '-created_at']),
            models.Index(fields=['status', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.invoice_number} - {self.client.last_name}"


class InvoiceLine(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='lines')
    
    description = models.CharField(max_length=500)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    
    class Meta:
        verbose_name = 'Ligne de facture'
        verbose_name_plural = 'Lignes de facture'
    
    def __str__(self):
        return f"{self.invoice.invoice_number} - {self.description}"


class Payment(models.Model):
    METHODS = [
        ('cash', 'Espèces'),
        ('virement', 'Virement'),
        ('mobile_money', 'Mobile Money'),
        ('carte', 'Carte'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('confirmed', 'Confirmé'),
        ('failed', 'Échoué'),
    ]
    
    MOBILE_OPERATORS = [
        ('mpesa', 'M-Pesa'),
        ('airtel', 'Airtel Money'),
        ('vodacom', 'Vodacom M-Pesa'),
        ('orange', 'Orange Money'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')
    
    reference = models.CharField(max_length=100, unique=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    method = models.CharField(max_length=20, choices=METHODS)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Champs pour paiements mobiles
    mobile_operator = models.CharField(
        max_length=20,
        choices=MOBILE_OPERATORS,
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
    
    payment_date = models.DateField()
    receipt_pdf = models.FileField(upload_to='receipts/', null=True, blank=True)
    
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_payments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Paiement'
        verbose_name_plural = 'Paiements'
        ordering = ['-payment_date']
        indexes = [
            models.Index(fields=['invoice', '-payment_date']),
            models.Index(fields=['status', '-payment_date']),
        ]
    
    def __str__(self):
        return f"{self.reference} - {self.amount}"


class Reminder(models.Model):
    REMINDER_TYPES = [
        ('j3', 'J+3'),
        ('j7', 'J+7'),
        ('j14', 'J+14'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='reminders')
    
    reminder_type = models.CharField(max_length=10, choices=REMINDER_TYPES)
    sent_date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Relance'
        verbose_name_plural = 'Relances'
        unique_together = ('invoice', 'reminder_type')
    
    def __str__(self):
        return f"{self.invoice.invoice_number} - {self.reminder_type}"
