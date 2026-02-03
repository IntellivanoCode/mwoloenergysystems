from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Client, Site, Contract
from .serializers import ClientSerializer, SiteSerializer, ContractSerializer

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['agency', 'status', 'email']
    search_fields = ['first_name', 'last_name', 'email', 'nif', 'phone']
    ordering_fields = ['last_name', 'first_name', 'created_at']

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        # D'abord chercher par le champ user (lien direct)
        client = self.get_queryset().filter(user=request.user).first()
        
        # Sinon chercher par email
        if not client:
            email = request.user.email
            client = self.get_queryset().filter(email__iexact=email).first()
            
            # Si trouvé par email, lier à l'utilisateur pour les prochaines fois
            if client and not client.user:
                client.user = request.user
                client.save(update_fields=['user'])
        
        if not client:
            return Response({
                'detail': 'Aucun profil client trouvé. Veuillez compléter votre inscription.',
                'user': {
                    'id': str(request.user.id),
                    'email': request.user.email,
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                    'post_name': getattr(request.user, 'post_name', ''),
                    'phone': getattr(request.user, 'phone', ''),
                    'role': getattr(request.user, 'role', 'client'),
                }
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = self.get_serializer(client)
        return Response(serializer.data)

class SiteViewSet(viewsets.ModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['client', 'is_active']
    search_fields = ['name', 'reference']
    ordering_fields = ['name', 'created_at']

class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()
    serializer_class = ContractSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['client', 'site', 'status', 'contract_type']
    ordering_fields = ['start_date', 'created_at']
