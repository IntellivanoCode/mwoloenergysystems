from rest_framework import serializers
from .models import Client, Site, Contract

class ClientSerializer(serializers.ModelSerializer):
    agency_name = serializers.CharField(source='agency.name', read_only=True)
    agency_code = serializers.CharField(source='agency.code', read_only=True)

    class Meta:
        model = Client
        fields = [
            'id',
            'first_name',
            'last_name',
            'post_name',
            'nationality',
            'date_of_birth',
            'place_of_birth',
            'nif',
            'email',
            'phone',
            'country',
            'province',
            'commune',
            'territory',
            'address',
            'agency',
            'agency_name',
            'agency_code',
            'status',
            'tags',
            'photo',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at']

class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ['id', 'client', 'name', 'reference', 'country', 'province', 'commune', 'territory', 'address', 'contact_name', 'contact_phone', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = ['id', 'client', 'site', 'contract_type', 'start_date', 'end_date', 'rate', 'currency', 'status', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']
