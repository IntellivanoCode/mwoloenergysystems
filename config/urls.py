from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# Health check endpoint pour les services de déploiement
def health_check(request):
    return JsonResponse({
        'status': 'healthy',
        'service': 'Mwolo Energy Systems API',
        'version': '1.0.0'
    })

urlpatterns = [
    # Health check (pour Render, Railway, etc.)
    path('api/health/', health_check, name='health-check'),
    path('health/', health_check, name='health'),
    
    path('mwoloboss/', admin.site.urls),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    
    # API Routes
    path('api/auth/', include('accounts.urls')),
    path('api/accounts/', include('accounts.urls')),
    path('api/hr/', include('hr.urls')),
    path('api/crm/', include('crm.urls')),
    path('api/billing/', include('billing.urls')),
    path('api/operations/', include('operations.urls')),
    path('api/support/', include('support.urls')),
    path('api/cms/', include('cms.urls')),
    path('api/appointments/', include('appointments.urls')),
]
