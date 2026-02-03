from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, SiteViewSet, ContractViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet, basename='client')
router.register(r'sites', SiteViewSet, basename='site')
router.register(r'contracts', ContractViewSet, basename='contract')

urlpatterns = router.urls
