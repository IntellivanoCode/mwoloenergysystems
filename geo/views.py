from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Country, Nationality, Province, Commune, Territory
from .serializers import CountrySerializer, NationalitySerializer, ProvinceSerializer, CommuneSerializer, TerritorySerializer

class CountryViewSet(viewsets.ModelViewSet):
    queryset = Country.objects.all()
    serializer_class = CountrySerializer
    permission_classes = [AllowAny]


class NationalityViewSet(viewsets.ModelViewSet):
    queryset = Nationality.objects.all()
    serializer_class = NationalitySerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def by_country(self, request):
        """Récupérer les nationalités par pays"""
        country_id = request.query_params.get('country_id')
        if country_id:
            nationalities = Nationality.objects.filter(country_id=country_id)
        else:
            nationalities = Nationality.objects.all()
        serializer = self.get_serializer(nationalities, many=True)
        return Response(serializer.data)


class ProvinceViewSet(viewsets.ModelViewSet):
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def by_country(self, request):
        """Récupérer les provinces par pays"""
        country_id = request.query_params.get('country_id')
        if country_id:
            provinces = Province.objects.filter(country_id=country_id)
        else:
            provinces = Province.objects.all()
        serializer = self.get_serializer(provinces, many=True)
        return Response(serializer.data)


class CommuneViewSet(viewsets.ModelViewSet):
    queryset = Commune.objects.all()
    serializer_class = CommuneSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def by_province(self, request):
        """Récupérer les communes par province"""
        province_id = request.query_params.get('province_id')
        if province_id:
            communes = Commune.objects.filter(province_id=province_id)
        else:
            communes = Commune.objects.all()
        serializer = self.get_serializer(communes, many=True)
        return Response(serializer.data)


class TerritoryViewSet(viewsets.ModelViewSet):
    queryset = Territory.objects.all()
    serializer_class = TerritorySerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def by_commune(self, request):
        """Récupérer les territoires par commune"""
        commune_id = request.query_params.get('commune_id')
        if commune_id:
            territories = Territory.objects.filter(commune_id=commune_id)
        else:
            territories = Territory.objects.all()
        serializer = self.get_serializer(territories, many=True)
        return Response(serializer.data)
