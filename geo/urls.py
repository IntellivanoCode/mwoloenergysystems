from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CountryViewSet, NationalityViewSet, ProvinceViewSet, CommuneViewSet, TerritoryViewSet

router = DefaultRouter()
router.register(r'countries', CountryViewSet, basename='country')
router.register(r'nationalities', NationalityViewSet, basename='nationality')
router.register(r'provinces', ProvinceViewSet, basename='province')
router.register(r'communes', CommuneViewSet, basename='commune')
router.register(r'territories', TerritoryViewSet, basename='territory')

urlpatterns = [
    path('', include(router.urls)),
]
