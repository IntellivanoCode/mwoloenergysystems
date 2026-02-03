from rest_framework import serializers
from .models import Equipment, Meter, MeterReading, Intervention

class EquipmentSerializer(serializers.ModelSerializer):
    site_name = serializers.CharField(source='site.name', read_only=True)
    
    class Meta:
        model = Equipment
        fields = [
            'id', 'site', 'site_name', 'equipment_type', 'serial_number', 'reference',
            'status', 'installation_date', 'last_maintenance', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MeterSerializer(serializers.ModelSerializer):
    equipment_serial = serializers.CharField(source='equipment.serial_number', read_only=True)
    site_name = serializers.CharField(source='equipment.site.name', read_only=True)
    
    class Meta:
        model = Meter
        fields = [
            'id', 'equipment', 'equipment_serial', 'site_name', 'meter_number',
            'status', 'service_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MeterReadingSerializer(serializers.ModelSerializer):
    meter_number = serializers.CharField(source='meter.meter_number', read_only=True)
    
    class Meta:
        model = MeterReading
        fields = ['id', 'meter', 'meter_number', 'reading_date', 'reading_value', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']


class InterventionSerializer(serializers.ModelSerializer):
    site_name = serializers.CharField(source='site.name', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.get_full_name', read_only=True)
    
    class Meta:
        model = Intervention
        fields = [
            'id', 'site', 'site_name', 'intervention_type', 'description', 'status',
            'scheduled_date', 'completed_date', 'assigned_to', 'assigned_to_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
