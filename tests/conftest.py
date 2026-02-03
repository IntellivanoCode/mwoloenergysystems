import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

@pytest.fixture
def api_client():
    """Fixture pour le client API"""
    return APIClient()

@pytest.fixture
def authenticated_user(db):
    """Fixture pour un utilisateur authentifié"""
    user = User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123',
        role='employe'
    )
    return user

@pytest.fixture
def authenticated_client(api_client, authenticated_user):
    """Fixture pour un client API authentifié"""
    api_client.force_authenticate(user=authenticated_user)
    return api_client
