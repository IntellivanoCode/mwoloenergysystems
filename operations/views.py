from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils import timezone
from django.db.models import Avg, Count, F
from django.db.models.functions import Now
from .models import Equipment, Meter, MeterReading, Intervention
from .serializers import (
    EquipmentSerializer, MeterSerializer, MeterReadingSerializer, 
    InterventionSerializer
)

class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = Equipment.objects.all()
        
        # Filtrer par site
        site_id = self.request.query_params.get('site')
        if site_id:
            queryset = queryset.filter(site_id=site_id)
        
        # Filtrer par type
        equipment_type = self.request.query_params.get('type')
        if equipment_type:
            queryset = queryset.filter(equipment_type=equipment_type)
        
        # Filtrer par statut
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def by_site(self, request):
        """Récupérer les équipements par site"""
        site_id = request.query_params.get('site_id')
        if not site_id:
            return Response({'error': 'site_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        equipment = Equipment.objects.filter(site_id=site_id)
        serializer = self.get_serializer(equipment, many=True)
        return Response(serializer.data)


class MeterViewSet(viewsets.ModelViewSet):
    queryset = Meter.objects.all()
    serializer_class = MeterSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Récupérer les compteurs actifs"""
        meters = Meter.objects.filter(status='actif', service_active=True)
        serializer = self.get_serializer(meters, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def deactivate_service(self, request, pk=None):
        """Désactiver le service d'un compteur"""
        meter = self.get_object()
        meter.deactivate_service()
        serializer = self.get_serializer(meter)
        return Response(serializer.data)


class MeterReadingViewSet(viewsets.ModelViewSet):
    queryset = MeterReading.objects.all()
    serializer_class = MeterReadingSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = MeterReading.objects.all()
        
        # Filtrer par compteur
        meter_id = self.request.query_params.get('meter')
        if meter_id:
            queryset = queryset.filter(meter_id=meter_id)
        
        return queryset.order_by('-reading_date')
    
    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Récupérer les derniers relevés"""
        meter_id = request.query_params.get('meter_id')
        if not meter_id:
            return Response({'error': 'meter_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        reading = MeterReading.objects.filter(meter_id=meter_id).latest('reading_date')
        serializer = self.get_serializer(reading)
        return Response(serializer.data)


class InterventionViewSet(viewsets.ModelViewSet):
    queryset = Intervention.objects.all()
    serializer_class = InterventionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = Intervention.objects.all()
        
        # Filtrer par site
        site_id = self.request.query_params.get('site')
        if site_id:
            queryset = queryset.filter(site_id=site_id)
        
        # Filtrer par statut
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filtrer par assigné
        assigned_to = self.request.query_params.get('assigned_to')
        if assigned_to:
            queryset = queryset.filter(assigned_to_id=assigned_to)
        
        return queryset.order_by('-scheduled_date')
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Récupérer les interventions en attente"""
        interventions = Intervention.objects.filter(status__in=['planifiee', 'en_cours']).order_by('scheduled_date')
        serializer = self.get_serializer(interventions, many=True)
        return Response(serializer.data)
