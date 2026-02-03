from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import SystemParameter
from .serializers import SystemParameterSerializer

class SystemParameterViewSet(viewsets.ModelViewSet):
    queryset = SystemParameter.objects.all()
    serializer_class = SystemParameterSerializer
    permission_classes = [IsAuthenticated]
