from django.apps import apps
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    agency_name = serializers.CharField(source='agency.name', read_only=True)
    agency_code = serializers.CharField(source='agency.code', read_only=True)
    # Infos employé si disponibles
    employee_number = serializers.SerializerMethodField()
    position = serializers.SerializerMethodField()
    position_display = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    department_display = serializers.SerializerMethodField()
    accessible_dashboards = serializers.SerializerMethodField()
    can_manage_queue = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'post_name',
            'phone',
            'role',
            'agency',
            'agency_name',
            'agency_code',
            # Infos employé
            'employee_number',
            'position',
            'position_display',
            'department',
            'department_display',
            'accessible_dashboards',
            'can_manage_queue',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_employee_number(self, obj):
        if hasattr(obj, 'employee') and obj.employee:
            return obj.employee.employee_number
        return None
    
    def get_position(self, obj):
        if hasattr(obj, 'employee') and obj.employee:
            return obj.employee.position
        return None
    
    def get_position_display(self, obj):
        if hasattr(obj, 'employee') and obj.employee:
            return obj.employee.get_position_display_full()
        return None
    
    def get_department(self, obj):
        if hasattr(obj, 'employee') and obj.employee:
            return obj.employee.department
        return None
    
    def get_department_display(self, obj):
        if hasattr(obj, 'employee') and obj.employee:
            return obj.employee.get_department_display()
        return None
    
    def get_accessible_dashboards(self, obj):
        if obj.role == 'super_admin':
            return ['admin', 'rh', 'comptabilite', 'commercial', 'operations', 'support', 'it', 'employee']
        if hasattr(obj, 'employee') and obj.employee:
            return obj.employee.get_accessible_dashboards()
        if obj.role == 'client':
            return ['client']
        return ['employee']
    
    def get_can_manage_queue(self, obj):
        if obj.role == 'super_admin':
            return True
        if hasattr(obj, 'employee') and obj.employee:
            return obj.employee.can_manage_queue
        return False


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    agency = serializers.UUIDField(required=True)  # Agence obligatoire

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'post_name', 'email', 'phone', 'password', 'agency']
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Cet email est déjà utilisé.")
        return value.lower()
    
    def validate_agency(self, value):
        if not value:
            raise serializers.ValidationError("L'agence est obligatoire.")
        Agency = apps.get_model('agencies', 'Agency')
        if not Agency.objects.filter(id=value, is_active=True).exists():
            raise serializers.ValidationError("Agence introuvable ou inactive.")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        email = validated_data.pop('email')
        agency_id = validated_data.pop('agency', None)

        Agency = apps.get_model('agencies', 'Agency')
        agency = Agency.objects.filter(id=agency_id, is_active=True).first()

        # Créer l'utilisateur
        user = User(
            username=email,
            email=email,
            role='client',
            **validated_data,
        )
        user.password = make_password(password)
        user.agency = agency
        user.save()
        
        # Créer automatiquement le profil Client dans le CRM
        Client = apps.get_model('crm', 'Client')
        Client.objects.create(
            user=user,
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            post_name=validated_data.get('post_name', ''),
            email=email,
            phone=validated_data.get('phone', ''),
            agency=agency,
            status='prospect'
        )
        
        return user


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        if not email or not password:
            raise serializers.ValidationError("L'email et le mot de passe sont obligatoires.")

        try:
            user = User.objects.get(email__iexact=email.strip())
        except User.DoesNotExist:
            user = None

        if user:
            attrs['username'] = user.username

        data = super().validate(attrs)
        token_user = getattr(self, 'user', user)
        if token_user:
            user_serializer = UserSerializer(token_user)
            data.update({
                'user': user_serializer.data,
                'role': token_user.role,
            })

        return data
