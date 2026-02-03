from rest_framework import permissions
from .models import Permission as PermissionModel

class HasModulePermission(permissions.BasePermission):
    """Vérifier si l'utilisateur a la permission pour un module"""
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Super admin a accès à tout
        if request.user.role == 'super_admin':
            return True
        
        # Déterminer le module et l'action
        module = self.get_module(view)
        action = self.get_action(request)
        
        if not module or not action:
            return True
        
        # Vérifier la permission
        return PermissionModel.objects.filter(
            role=request.user.role,
            module=module,
            action=action
        ).exists()
    
    def get_module(self, view):
        """Extraire le module de la vue"""
        if hasattr(view, 'module'):
            return view.module
        return None
    
    def get_action(self, request):
        """Extraire l'action de la requête"""
        if request.method == 'GET':
            return 'read'
        elif request.method == 'POST':
            return 'create'
        elif request.method in ['PUT', 'PATCH']:
            return 'update'
        elif request.method == 'DELETE':
            return 'delete'
        return None

class IsOwnerOrAdmin(permissions.BasePermission):
    """Vérifier si l'utilisateur est propriétaire ou admin"""
    
    def has_object_permission(self, request, view, obj):
        if request.user.role in ['super_admin', 'admin']:
            return True
        
        # Vérifier si l'utilisateur est propriétaire
        if hasattr(obj, 'user') and obj.user == request.user:
            return True
        
        return False
