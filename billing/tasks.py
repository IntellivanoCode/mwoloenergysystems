from celery import shared_task
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta
from .models import Invoice, Reminder, Payment
from .pdf_generator import generate_invoice_pdf, generate_receipt_pdf, generate_payroll_pdf
from operations.models import Meter
from hr.models import Payroll


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
    except Exception as e:
        return f"Erreur lors de la génération du PDF: {str(e)}"


@shared_task
def generate_receipt_pdf_task(payment_id):
    """Générer le PDF d'un reçu de paiement de manière asynchrone"""
    try:
        payment = Payment.objects.get(id=payment_id)
        filepath = generate_receipt_pdf(payment)
        payment.receipt_pdf = filepath
        payment.save()
        return f"Reçu PDF généré: {filepath}"
    except Payment.DoesNotExist:
        return f"Paiement {payment_id} introuvable"
    except Exception as e:
        return f"Erreur lors de la génération du reçu: {str(e)}"


@shared_task
def generate_payroll_pdf_task(payroll_id):
    """Générer le PDF d'un bulletin de paie de manière asynchrone"""
    try:
        payroll = Payroll.objects.get(id=payroll_id)
        filepath = generate_payroll_pdf(payroll)
        payroll.pdf_file = filepath
        payroll.save()
        return f"Bulletin de paie PDF généré: {filepath}"
    except Payroll.DoesNotExist:
        return f"Bulletin de paie {payroll_id} introuvable"
    except Exception as e:
        return f"Erreur lors de la génération du bulletin: {str(e)}"


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
        
        # Envoyer l'email
        subject = f"Relance facture {invoice.invoice_number}"
        message = f"""
Bonjour {invoice.client.first_name} {invoice.client.last_name},

Nous vous rappelons que la facture {invoice.invoice_number} 
d'un montant de {invoice.total} {invoice.currency} 
n'a pas encore été payée.

Période: {invoice.period_start} au {invoice.period_end}
Montant dû: {invoice.total} {invoice.currency}

Veuillez procéder au paiement dès que possible pour éviter 
toute interruption de service.

Cordialement,
Mwolo Energy Systems
        """
        
        send_mail(
            subject,
            message,
            'noreply@mwolo.energy',
            [invoice.client.email],
            fail_silently=False,
        )
        
        # TODO: Envoyer SMS si numéro disponible
        # send_sms(invoice.client.phone, message)
        
        return f"Relance {reminder_type} envoyée pour facture {invoice.invoice_number}"
    except Invoice.DoesNotExist:
        return f"Facture {invoice_id} introuvable"
    except Exception as e:
        return f"Erreur lors de l'envoi de la relance: {str(e)}"


@shared_task
def check_unpaid_invoices():
    """Vérifier les factures impayées et envoyer des relances"""
    today = timezone.now().date()
    
    # Factures impayées
    unpaid_invoices = Invoice.objects.filter(
        status__in=['envoyee', 'partiellement_payee']
    )
    
    relances_sent = 0
    services_deactivated = 0
    
    for invoice in unpaid_invoices:
        days_overdue = (today - invoice.period_end).days
        
        # Relance J+3
        if days_overdue >= 3 and not Reminder.objects.filter(
            invoice=invoice, reminder_type='j3'
        ).exists():
            send_invoice_reminder.delay(str(invoice.id), 'j3')
            relances_sent += 1
        
        # Relance J+7
        elif days_overdue >= 7 and not Reminder.objects.filter(
            invoice=invoice, reminder_type='j7'
        ).exists():
            send_invoice_reminder.delay(str(invoice.id), 'j7')
            relances_sent += 1
        
        # Relance J+14 + désactivation service
        elif days_overdue >= 14:
            if not Reminder.objects.filter(
                invoice=invoice, reminder_type='j14'
            ).exists():
                send_invoice_reminder.delay(str(invoice.id), 'j14')
                relances_sent += 1
            
            # Désactiver le service
            result = deactivate_service_for_invoice.delay(str(invoice.id))
            if result:
                services_deactivated += 1
    
    return f"Vérification terminée: {unpaid_invoices.count()} factures impayées, {relances_sent} relances envoyées, {services_deactivated} services désactivés"


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
            
            deactivated_count = 0
            for meter in meters:
                meter.deactivate_service()
                deactivated_count += 1
                
                # TODO: Envoyer commande au compteur IoT
                # send_iot_command(meter.meter_number, 'DEACTIVATE')
                
                # Envoyer notification au client
                send_mail(
                    "Service désactivé - Facture impayée",
                    f"""
Bonjour {invoice.client.first_name} {invoice.client.last_name},

Votre service a été désactivé en raison du non-paiement de la facture {invoice.invoice_number}.

Montant dû: {invoice.total} {invoice.currency}

Veuillez procéder au paiement pour réactiver votre service.

Cordialement,
Mwolo Energy Systems
                    """,
                    'noreply@mwolo.energy',
                    [invoice.client.email],
                    fail_silently=True,
                )
            
            return f"Service désactivé pour {deactivated_count} compteur(s)"
        
        return "Aucun site associé à la facture"
    except Invoice.DoesNotExist:
        return f"Facture {invoice_id} introuvable"
    except Exception as e:
        return f"Erreur lors de la désactivation du service: {str(e)}"


@shared_task
def activate_service_for_payment(payment_id):
    """Réactiver le service client après paiement"""
    try:
        payment = Payment.objects.get(id=payment_id)
        
        if payment.status != 'confirmed':
            return "Paiement non confirmé"
        
        invoice = payment.invoice
        
        # Vérifier si la facture est maintenant payée
        total_paid = sum(p.amount for p in invoice.payments.filter(status='confirmed'))
        
        if total_paid >= invoice.total:
            invoice.status = 'payee'
            invoice.save()
            
            # Réactiver le service
            if invoice.site:
                meters = Meter.objects.filter(
                    equipment__site=invoice.site,
                    service_active=False
                )
                
                activated_count = 0
                for meter in meters:
                    meter.service_active = True
                    meter.status = 'actif'
                    meter.save()
                    activated_count += 1
                    
                    # TODO: Envoyer commande au compteur IoT
                    # send_iot_command(meter.meter_number, 'ACTIVATE')
                
                # Envoyer notification au client
                send_mail(
                    "Service réactivé",
                    f"""
Bonjour {invoice.client.first_name} {invoice.client.last_name},

Votre service a été réactivé suite au paiement de la facture {invoice.invoice_number}.

Montant payé: {payment.amount} {invoice.currency}

Merci de votre confiance.

Cordialement,
Mwolo Energy Systems
                    """,
                    'noreply@mwolo.energy',
                    [invoice.client.email],
                    fail_silently=True,
                )
                
                return f"Service réactivé pour {activated_count} compteur(s)"
        
        return "Facture partiellement payée, service non réactivé"
    except Payment.DoesNotExist:
        return f"Paiement {payment_id} introuvable"
    except Exception as e:
        return f"Erreur lors de la réactivation du service: {str(e)}"


@shared_task
def send_payment_confirmation(payment_id):
    """Envoyer une confirmation de paiement par email"""
    try:
        payment = Payment.objects.get(id=payment_id)
        
        if payment.status != 'confirmed':
            return "Paiement non confirmé"
        
        invoice = payment.invoice
        
        subject = f"Confirmation de paiement - {payment.reference}"
        message = f"""
Bonjour {invoice.client.first_name} {invoice.client.last_name},

Nous avons bien reçu votre paiement.

Référence: {payment.reference}
Facture: {invoice.invoice_number}
Montant: {payment.amount} {invoice.currency}
Méthode: {payment.get_method_display()}
Date: {payment.payment_date}

Votre reçu est disponible en pièce jointe.

Merci de votre confiance.

Cordialement,
Mwolo Energy Systems
        """
        
        send_mail(
            subject,
            message,
            'noreply@mwolo.energy',
            [invoice.client.email],
            fail_silently=False,
        )
        
        return f"Confirmation de paiement envoyée pour {payment.reference}"
    except Payment.DoesNotExist:
        return f"Paiement {payment_id} introuvable"
    except Exception as e:
        return f"Erreur lors de l'envoi de la confirmation: {str(e)}"
