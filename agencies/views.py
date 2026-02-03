from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Agency
from .serializers import AgencySerializer

class AgencyViewSet(viewsets.ModelViewSet):
    queryset = Agency.objects.filter(is_active=True)
    serializer_class = AgencySerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = Agency.objects.all()
        
        # Filtrer par province si fourni
        province_id = self.request.query_params.get('province')
        if province_id:
            queryset = queryset.filter(province_id=province_id)
        
        # Filtrer par territoire si fourni
        territory_id = self.request.query_params.get('territory')
        if territory_id:
            queryset = queryset.filter(territory_id=territory_id)
        
        # Filtrer par statut
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset
    
    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def public_list(self, request):
        """Liste publique des agences pour le site vitrine"""
        agencies = Agency.objects.filter(is_active=True).select_related(
            'province', 'territory', 'manager'
        )
        serializer = self.get_serializer(agencies, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_province(self, request):
        """Récupérer les agences par province"""
        province_id = request.query_params.get('province_id')
        if not province_id:
            return Response({'error': 'province_id requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        agencies = Agency.objects.filter(province_id=province_id, is_active=True)
        serializer = self.get_serializer(agencies, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def details(self, request, pk=None):
        """Récupérer les détails complets d'une agence"""
        agency = self.get_object()
        serializer = self.get_serializer(agency)
        return Response(serializer.data)
