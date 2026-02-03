"""
Signaux Django pour automatiser les actions sur les factures et paiements
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Invoice, Payment
from .tasks import (
    generate_invoice_pdf_task,
    generate_receipt_pdf_task,
    check_unpaid_invoices,
    activate_service_for_payment,
    send_payment_confirmation
)


@receiver(post_save, sender=Invoice)
def invoice_post_save(sender, instance, created, **kwargs):
    """Actions après sauvegarde d'une facture"""
    
    # Générer le PDF si la facture est validée et n'a pas encore de PDF
    if instance.status == 'validee' and not instance.pdf_file:
        generate_invoice_pdf_task.delay(str(instance.id))
    
    # Vérifier les factures impayées si la facture est envoyée
    if instance.status == 'envoyee':
        # Planifier la vérification dans 1 minute
        check_unpaid_invoices.apply_async(countdown=60)


@receiver(post_save, sender=Payment)
def payment_post_save(sender, instance, created, **kwargs):
    """Actions après sauvegarde d'un paiement"""
    
    # Générer le reçu PDF si le paiement est confirmé et n'a pas encore de PDF
    if instance.status == 'confirmed' and not instance.receipt_pdf:
        generate_receipt_pdf_task.delay(str(instance.id))
        
        # Envoyer confirmation par email
        send_payment_confirmation.delay(str(instance.id))
        
        # Vérifier si le service doit être réactivé
        activate_service_for_payment.delay(str(instance.id))
        
        # Mettre à jour le statut de la facture
        invoice = instance.invoice
        total_paid = sum(
            p.amount for p in invoice.payments.filter(status='confirmed')
        )
        
        if total_paid >= invoice.total:
            invoice.status = 'payee'
        elif total_paid > 0:
            invoice.status = 'partiellement_payee'
        
        invoice.save()
