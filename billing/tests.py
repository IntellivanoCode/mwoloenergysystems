from django.test import TestCase
from datetime import date

from django.conf import settings

from django.db.models.signals import post_save

from accounts.models import User
from geo.models import Country, Province, Commune, Territory, Nationality
from agencies.models import Agency
from crm.models import Client, Site
from billing.models import Invoice, InvoiceLine, Payment
from billing.serializers import InvoiceSerializer, PaymentSerializer
from billing.signals import invoice_post_save, payment_post_save


class BillingSerializerTests(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        settings.CELERY_TASK_ALWAYS_EAGER = True
        settings.CELERY_TASK_EAGER_PROPAGATES = True
        post_save.disconnect(invoice_post_save, sender=Invoice)
        post_save.disconnect(payment_post_save, sender=Payment)

    @classmethod
    def tearDownClass(cls):
        post_save.connect(invoice_post_save, sender=Invoice)
        post_save.connect(payment_post_save, sender=Payment)
        super().tearDownClass()

    def setUp(self):
        country = Country.objects.create(code='CD', name='RDC')
        province, _ = Province.objects.get_or_create(country=country, code='KIN', defaults={'name': 'Kinshasa'})
        commune, _ = Commune.objects.get_or_create(province=province, code='KIN-1', defaults={'name': 'Funa'})
        territory, _ = Territory.objects.get_or_create(commune=commune, code='KIN-T1', defaults={'name': 'Ngaliema'})
        nationality, _ = Nationality.objects.get_or_create(country=country, name='Congolaise')

        agency = Agency.objects.create(
            name='Agence Test',
            province=province,
            territory=territory,
            address='123 Rue Test',
            phone='+243 123 456 789',
            email='agence@test.mwolo',
        )

        self.user = User.objects.create_user(
            username='client-test',
            email='client@test.mwolo',
            password='testpass123',
            first_name='Test',
            last_name='Client',
            role='client',
            agency=agency,
        )

        self.client = Client.objects.create(
            first_name='Test',
            last_name='Client',
            nationality=nationality,
            date_of_birth=date(1990, 1, 1),
            place_of_birth='Kinshasa',
            nif='123456789',
            email='client@test.mwolo',
            phone='+243 987 654 321',
            country=country,
            province=province,
            commune=commune,
            territory=territory,
            address='Rue Principale',
            agency=agency,
            status='actif',
        )

        self.site = Site.objects.create(
            client=self.client,
            name='Siège',
            reference='SI-0001',
            country=country,
            province=province,
            commune=commune,
            territory=territory,
            address='Bâtiment A',
        )

        self.invoice = Invoice.objects.create(
            invoice_number='MES-2026-0001',
            client=self.client,
            site=self.site,
            period_start=date(2026, 1, 1),
            period_end=date(2026, 1, 31),
            currency='USD',
            subtotal=1000,
            tax_amount=200,
            total=1200,
            status='envoyee',
            created_by=self.user,
        )

        InvoiceLine.objects.create(
            invoice=self.invoice,
            description='Consommation électrique',
            quantity=500,
            unit_price=2.0,
            discount=0,
            total=1000,
        )

        self.payment = Payment.objects.create(
            invoice=self.invoice,
            reference='PAY-0001',
            amount=400,
            method='mobile_money',
            status='confirmed',
            mobile_operator='mpesa',
            mobile_number='+243 111 222 333',
            transaction_id='TRAN-123',
            payment_date=date.today(),
            created_by=self.user,
        )

    def test_payment_serializer_includes_mobile_fields(self):
        serializer = PaymentSerializer(self.payment)
        data = serializer.data
        self.assertEqual(data['mobile_operator'], 'mpesa')
        self.assertEqual(data['mobile_number'], '+243 111 222 333')
        self.assertEqual(data['transaction_id'], 'TRAN-123')

    def test_invoice_serializer_reports_balance(self):
        serializer = InvoiceSerializer(self.invoice)
        data = serializer.data
        self.assertEqual(data['amount_paid'], 400)
        self.assertEqual(data['balance'], 800)
        self.assertTrue(len(data['payments']) >= 1)
