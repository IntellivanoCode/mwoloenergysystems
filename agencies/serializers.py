from rest_framework import serializers
from .models import Agency
from geo.serializers import TerritorySerializer, ProvinceSerializer

class AgencySerializer(serializers.ModelSerializer):
    territory_details = TerritorySerializer(source='territory', read_only=True)
    province_details = ProvinceSerializer(source='province', read_only=True)
    manager_name = serializers.CharField(source='manager.get_full_name', read_only=True)
    
    class Meta:
        model = Agency
        fields = [
            'id', 'code', 'name', 'province', 'province_details', 'territory', 'territory_details',
            'address', 'phone', 'email', 'manager', 'manager_name', 
            'latitude', 'longitude',
            'background_image', 'background_image_url', 'icon_svg',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'code', 'created_at', 'updated_at']
