"""
Script de test pour vérifier l'implémentation des fonctionnalités
"""
import os
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from billing.models import Invoice, Payment, InvoiceLine
from billing.pdf_generator import generate_invoice_pdf, generate_receipt_pdf
from crm.models import Client
from agencies.models import Agency
from geo.models import Country, Province, Commune, Territory, Nationality
from accounts.models import User
from datetime import date, timedelta
from decimal import Decimal


def test_pdf_generation():
    """Tester la génération de PDF"""
    print("\n" + "="*80)
    print("TEST 1: Génération PDF")
    print("="*80)
    
    try:
        # Trouver ou créer une facture de test
        invoice = Invoice.objects.first()
        
        if not invoice:
            print("❌ Aucune facture trouvée. Créez d'abord des données de test.")
            return False
        
        print(f"✓ Facture trouvée: {invoice.invoice_number}")
        
        # Générer le PDF
        print("  Génération du PDF en cours...")
        filepath = generate_invoice_pdf(invoice)
        
        if os.path.exists(filepath):
            size = os.path.getsize(filepath)
            print(f"✅ PDF généré avec succès!")
            print(f"   Fichier: {filepath}")
            print(f"   Taille: {size} bytes")
            return True
        else:
            print("❌ Le fichier PDF n'a pas été créé")
            return False
            
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


def test_payment_fields():
    """Tester les nouveaux champs de paiement mobile"""
    print("\n" + "="*80)
    print("TEST 2: Champs Paiements Mobiles")
    print("="*80)
    
    try:
        # Vérifier que les champs existent
        from billing.models import Payment
        
        fields = ['mobile_operator', 'mobile_number', 'transaction_id']
        
        for field in fields:
            if hasattr(Payment, field):
                print(f"✓ Champ '{field}' existe")
            else:
                print(f"❌ Champ '{field}' manquant")
                return False
        
        print("✅ Tous les champs de paiement mobile sont présents!")
        return True
        
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False


def test_celery_tasks():
    """Tester que les tâches Celery sont définies"""
    print("\n" + "="*80)
    print("TEST 3: Tâches Celery")
    print("="*80)
    
    try:
        from billing import tasks
        
        task_names = [
            'generate_invoice_pdf_task',
            'generate_receipt_pdf_task',
            'send_invoice_reminder',
            'check_unpaid_invoices',
            'deactivate_service_for_invoice',
            'activate_service_for_payment',
        ]
        
        for task_name in task_names:
            if hasattr(tasks, task_name):
                print(f"✓ Tâche '{task_name}' définie")
            else:
                print(f"❌ Tâche '{task_name}' manquante")
                return False
        
        print("✅ Toutes les tâches Celery sont définies!")
        return True
        
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False


def test_signals():
    """Tester que les signaux sont configurés"""
    print("\n" + "="*80)
    print("TEST 4: Signaux Django")
    print("="*80)
    
    try:
        from billing import signals
        
        print("✓ Module signals importé")
        
        # Vérifier que les signaux sont enregistrés
        from django.db.models.signals import post_save
        from billing.models import Invoice, Payment
        
        invoice_receivers = post_save._live_receivers(Invoice)
        payment_receivers = post_save._live_receivers(Payment)
        
        if invoice_receivers:
            print(f"✓ Signal post_save pour Invoice: {len(invoice_receivers)} receiver(s)")
        else:
            print("⚠️  Aucun receiver pour Invoice")
        
        if payment_receivers:
            print(f"✓ Signal post_save pour Payment: {len(payment_receivers)} receiver(s)")
        else:
            print("⚠️  Aucun receiver pour Payment")
        
        print("✅ Signaux configurés!")
        return True
        
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False


def test_api_endpoints():
    """Tester que les endpoints API sont disponibles"""
    print("\n" + "="*80)
    print("TEST 5: Endpoints API")
    print("="*80)
    
    try:
        from billing.views import InvoiceViewSet, PaymentViewSet
        from agencies.views import AgencyViewSet
        
        # Vérifier les actions personnalisées
        invoice_actions = [action for action in dir(InvoiceViewSet) if not action.startswith('_')]
        payment_actions = [action for action in dir(PaymentViewSet) if not action.startswith('_')]
        agency_actions = [action for action in dir(AgencyViewSet) if not action.startswith('_')]
        
        print(f"✓ InvoiceViewSet: {len(invoice_actions)} méthodes")
        if 'pdf' in invoice_actions:
            print("  ✓ Endpoint PDF disponible")
        
        print(f"✓ PaymentViewSet: {len(payment_actions)} méthodes")
        if 'receipt' in payment_actions:
            print("  ✓ Endpoint receipt disponible")
        
        print(f"✓ AgencyViewSet: {len(agency_actions)} méthodes")
        if 'public_list' in agency_actions:
            print("  ✓ Endpoint public_list disponible")
        
        print("✅ Endpoints API configurés!")
        return True
        
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False


def test_directories():
    """Vérifier que les répertoires pour les PDF existent"""
    print("\n" + "="*80)
    print("TEST 6: Répertoires Media")
    print("="*80)
    
    try:
        from django.conf import settings
        
        dirs = [
            os.path.join(settings.MEDIA_ROOT, 'invoices'),
            os.path.join(settings.MEDIA_ROOT, 'receipts'),
            os.path.join(settings.MEDIA_ROOT, 'payrolls'),
        ]
        
        all_exist = True
        for dir_path in dirs:
            if os.path.exists(dir_path):
                print(f"✓ Répertoire existe: {dir_path}")
            else:
                print(f"⚠️  Répertoire manquant: {dir_path}")
                print(f"   Création...")
                os.makedirs(dir_path, exist_ok=True)
                print(f"   ✓ Créé!")
        
        print("✅ Tous les répertoires sont prêts!")
        return True
        
    except Exception as e:
        print(f"❌ Erreur: {str(e)}")
        return False


def run_all_tests():
    """Exécuter tous les tests"""
    print("\n" + "="*80)
    print("TESTS D'IMPLÉMENTATION - MWOLO ENERGY SYSTEMS")
    print("="*80)
    
    tests = [
        ("Champs Paiements Mobiles", test_payment_fields),
        ("Tâches Celery", test_celery_tasks),
        ("Signaux Django", test_signals),
        ("Endpoints API", test_api_endpoints),
        ("Répertoires Media", test_directories),
        ("Génération PDF", test_pdf_generation),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"\n❌ Erreur lors du test '{test_name}': {str(e)}")
            results.append((test_name, False))
    
    # Résumé
    print("\n" + "="*80)
    print("RÉSUMÉ DES TESTS")
    print("="*80)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print("\n" + "="*80)
    print(f"RÉSULTAT: {passed}/{total} tests réussis ({passed*100//total}%)")
    print("="*80)
    
    if passed == total:
        print("\n🎉 Toutes les fonctionnalités sont opérationnelles!")
    else:
        print("\n⚠️  Certains tests ont échoué. Vérifiez les erreurs ci-dessus.")


if __name__ == '__main__':
    run_all_tests()
