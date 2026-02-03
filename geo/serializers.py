from rest_framework import serializers
from .models import Country, Nationality, Province, Commune, Territory

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name', 'code', 'created_at']
        read_only_fields = ['id', 'created_at']


class NationalitySerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source='country.name', read_only=True)
    
    class Meta:
        model = Nationality
        fields = ['id', 'country', 'country_name', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProvinceSerializer(serializers.ModelSerializer):
    country_name = serializers.CharField(source='country.name', read_only=True)
    
    class Meta:
        model = Province
        fields = ['id', 'country', 'country_name', 'name', 'code', 'created_at']
        read_only_fields = ['id', 'created_at']


class CommuneSerializer(serializers.ModelSerializer):
    province_name = serializers.CharField(source='province.name', read_only=True)
    country_name = serializers.CharField(source='province.country.name', read_only=True)
    
    class Meta:
        model = Commune
        fields = ['id', 'province', 'province_name', 'country_name', 'name', 'code', 'created_at']
        read_only_fields = ['id', 'created_at']


class TerritorySerializer(serializers.ModelSerializer):
    commune_name = serializers.CharField(source='commune.name', read_only=True)
    province_name = serializers.CharField(source='commune.province.name', read_only=True)
    country_name = serializers.CharField(source='commune.province.country.name', read_only=True)
    
    class Meta:
        model = Territory
        fields = ['id', 'commune', 'commune_name', 'province_name', 'country_name', 'name', 'code', 'created_at']
        read_only_fields = ['id', 'created_at']
