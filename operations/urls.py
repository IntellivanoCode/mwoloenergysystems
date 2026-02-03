from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EquipmentViewSet, MeterViewSet, MeterReadingViewSet, 
    InterventionViewSet
)

router = DefaultRouter()
router.register(r'equipment', EquipmentViewSet, basename='equipment')
router.register(r'meters', MeterViewSet, basename='meter')
router.register(r'readings', MeterReadingViewSet, basename='reading')
router.register(r'interventions', InterventionViewSet, basename='intervention')

urlpatterns = [
    path('', include(router.urls)),
]
