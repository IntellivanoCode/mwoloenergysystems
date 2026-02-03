import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from crm.models import Client
from billing.models import Invoice
from geo.models import Country, Province, Commune, Territory
from agencies.models import Agency

User = get_user_model()

@pytest.mark.django_db
class TestBilling:
    
    def setup_method(self):
        self.client = APIClient()
        
        # Créer un utilisateur
        self.user = User.objects.create_user(
            username='comptable',
            email='comptable@example.com',
            password='testpass123',
            role='comptable'
        )
        
        # Créer la géographie
        self.country = Country.objects.create(name='RDC', code='CD')
        self.province = Province.objects.create(country=self.country, name='Kinshasa', code='KIN')
        self.commune = Commune.objects.create(province=self.province, name='Gombe', code='GOM')
        self.territory = Territory.objects.create(commune=self.commune, name='Gombe', code='GOM')
        
        # Créer une agence
        self.agency = Agency.objects.create(
            name='Agence Kinshasa',
            territory=self.territory,
            address='123 Rue Test',
            phone='+243123456789',
            email='agency@example.com'
        )
        
        # Créer un client
        self.client_obj = Client.objects.create(
            first_name='Jean',
            last_name='Dupont',
            nationality='Congolaise',
            date_of_birth='1990-01-01',
            place_of_birth='Kinshasa',
            nif='123456789',
            email='client@example.com',
            phone='+243123456789',
            country=self.country,
            province=self.province,
            commune=self.commune,
            territory=self.territory,
            address='456 Rue Client',
            agency=self.agency
        )
        
        # Authentifier
        self.client.force_authenticate(user=self.user)
    
    def test_create_invoice(self):
        """Tester la création d'une facture"""
        response = self.client.post('/api/billing/invoices/', {
            'client': str(self.client_obj.id),
            'period_start': '2026-01-01',
            'period_end': '2026-01-31',
            'currency': 'USD',
            'subtotal': '1000.00',
            'tax_amount': '100.00',
            'total': '1100.00',
            'status': 'brouillon'
        })
        assert response.status_code == status.HTTP_201_CREATED
        assert 'invoice_number' in response.data
    
    def test_list_invoices(self):
        """Tester la liste des factures"""
        response = self.client.get('/api/billing/invoices/')
        assert response.status_code == status.HTTP_200_OK
