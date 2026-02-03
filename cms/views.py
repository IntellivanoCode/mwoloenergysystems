from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Page, BlogPost, Service, Testimonial, Partner, Gallery, GalleryImage, Lead, SiteSettings, JobOffer, FAQ, Advantage, NewsletterSubscriber, JobApplication, TeamMember
from .serializers import (
    PageSerializer, BlogPostSerializer, ServiceSerializer, TestimonialSerializer, TestimonialSubmitSerializer,
    PartnerSerializer, GallerySerializer, LeadSerializer, SiteSettingsSerializer, JobOfferSerializer,
    FAQSerializer, AdvantageSerializer, NewsletterSubscriberSerializer, NewsletterSubscribeSerializer,
    JobApplicationSerializer, JobApplicationSubmitSerializer, TeamMemberSerializer
)


class PublicStatsView(APIView):
    """Statistiques publiques pour le site vitrine (sans authentification)"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        from agencies.models import Agency
        from crm.models import Client
        from hr.models import Employee
        
        return Response({
            'total_clients': Client.objects.count() or 150,
            'total_agencies': Agency.objects.filter(is_active=True).count() or 12,
            'total_employees': Employee.objects.filter(status='actif').count() or 85,
            'years_experience': 5,
        })


class JobOfferViewSet(viewsets.ModelViewSet):
    queryset = JobOffer.objects.filter(status='ouvert').order_by('-posted_date')
    serializer_class = JobOfferSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return JobOffer.objects.all().order_by('-posted_date')
        return JobOffer.objects.filter(status='ouvert').order_by('-posted_date')
    
    @action(detail=False, methods=['get'])
    def by_department(self, request):
        department = request.query_params.get('department')
        if department:
            queryset = self.get_queryset().filter(department=department)
        else:
            queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[AllowAny])
    def apply(self, request, slug=None):
        """Soumettre une candidature pour une offre d'emploi"""
        job_offer = self.get_object()
        
        data = request.data.copy()
        data['job_offer'] = job_offer.id
        
        serializer = JobApplicationSubmitSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Votre candidature a été soumise avec succès. Nous vous contacterons bientôt.'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JobApplicationViewSet(viewsets.ModelViewSet):
    """API pour gérer les candidatures (administration)"""
    queryset = JobApplication.objects.all().order_by('-created_at')
    serializer_class = JobApplicationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = JobApplication.objects.all().order_by('-created_at')
        job_id = self.request.query_params.get('job_offer')
        if job_id:
            queryset = queryset.filter(job_offer_id=job_id)
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset


class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.filter(is_published=True)
    serializer_class = PageSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Page.objects.all()
        return Page.objects.filter(is_published=True)


class BlogPostViewSet(viewsets.ModelViewSet):
    queryset = BlogPost.objects.filter(is_published=True).order_by('-published_at')
    serializer_class = BlogPostSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return BlogPost.objects.all().order_by('-published_at')
        return BlogPost.objects.filter(is_published=True).order_by('-published_at')


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.filter(is_active=True).order_by('order')
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]


class TestimonialViewSet(viewsets.ModelViewSet):
    queryset = Testimonial.objects.filter(is_active=True, status='approved').order_by('order')
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Testimonial.objects.all().order_by('order')
        return Testimonial.objects.filter(is_active=True, status='approved').order_by('order')
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def submit(self, request):
        """Soumission de témoignage par un client"""
        serializer = TestimonialSubmitSerializer(data=request.data)
        if serializer.is_valid():
            # Vérifier si le code client existe (optionnel - si billing app a un Client model)
            client_code = serializer.validated_data.get('client_code', '')
            if client_code:
                # Tenter de vérifier le code client dans la base
                try:
                    from billing.models import Client
                    client = Client.objects.filter(code=client_code).first()
                    if client:
                        # Pré-remplir le nom depuis les informations client
                        serializer.validated_data['author_name'] = serializer.validated_data.get('author_name') or f"{client.first_name} {client.last_name}"
                except:
                    pass  # Si le module billing n'existe pas, continuer sans vérification
            
            serializer.save()
            return Response({
                'success': True,
                'message': 'Votre témoignage a été soumis et sera publié après modération.'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.filter(is_active=True).order_by('order')
    serializer_class = PartnerSerializer
    permission_classes = [AllowAny]


class GalleryViewSet(viewsets.ModelViewSet):
    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer
    permission_classes = [AllowAny]


class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    
    def get_permissions(self):
        """Seule la création est publique, le reste nécessite une authentification"""
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['get'])
    def current(self, request):
        settings = SiteSettings.objects.first()
        if not settings:
            settings = SiteSettings.objects.create(
                company_name="Mwolo Energy Systems",
                company_description="Solutions énergétiques modernes pour l'Afrique",
                email="info@mwolo.energy",
                phone="+243 123 456 789",
                address="Kinshasa, République Démocratique du Congo"
            )
        serializer = self.get_serializer(settings)
        return Response(serializer.data)


class FAQViewSet(viewsets.ModelViewSet):
    """API pour les questions fréquemment posées"""
    queryset = FAQ.objects.filter(is_active=True).order_by('order')
    serializer_class = FAQSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = FAQ.objects.filter(is_active=True).order_by('order')
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset
    
    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Liste des catégories de FAQ"""
        categories = FAQ.objects.filter(is_active=True).values_list('category', flat=True).distinct()
        return Response(list(filter(None, categories)))


class AdvantageViewSet(viewsets.ModelViewSet):
    """API pour la section 'Pourquoi nous choisir'"""
    queryset = Advantage.objects.filter(is_active=True).order_by('order')
    serializer_class = AdvantageSerializer
    permission_classes = [AllowAny]


class TeamMemberViewSet(viewsets.ModelViewSet):
    """API pour les membres de l'équipe"""
    queryset = TeamMember.objects.filter(is_active=True).order_by('order', 'last_name')
    serializer_class = TeamMemberSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        queryset = TeamMember.objects.filter(is_active=True).order_by('order', 'last_name')
        
        # Filtrer par featured (pour la page d'accueil)
        featured = self.request.query_params.get('featured')
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)
        
        # Filtrer par département
        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(department__icontains=department)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Récupère les membres en vedette pour la page d'accueil"""
        members = TeamMember.objects.filter(is_active=True, is_featured=True).order_by('order')[:6]
        serializer = self.get_serializer(members, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def departments(self, request):
        """Liste des départements"""
        departments = TeamMember.objects.filter(is_active=True).values_list('department', flat=True).distinct()
        return Response(list(filter(None, departments)))


class NewsletterViewSet(viewsets.ModelViewSet):
    """API pour la gestion des abonnés newsletter"""
    queryset = NewsletterSubscriber.objects.filter(is_active=True)
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def subscribe(self, request):
        """Inscription à la newsletter"""
        email = request.data.get('email')
        name = request.data.get('name', '')
        
        if not email:
            return Response({'error': 'Email requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Vérifier si déjà inscrit
        existing = NewsletterSubscriber.objects.filter(email=email).first()
        if existing:
            if existing.is_active:
                return Response({'message': 'Vous êtes déjà inscrit à notre newsletter.'}, status=status.HTTP_200_OK)
            else:
                # Réactiver l'abonnement
                existing.is_active = True
                existing.unsubscribed_at = None
                existing.save()
                return Response({'message': 'Votre abonnement a été réactivé.'}, status=status.HTTP_200_OK)
        
        # Créer nouvel abonné
        serializer = NewsletterSubscribeSerializer(data={'email': email, 'name': name})
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Merci pour votre inscription à notre newsletter!'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def unsubscribe(self, request):
        """Désinscription de la newsletter"""
        token = request.data.get('token')
        if not token:
            return Response({'error': 'Token requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        subscriber = NewsletterSubscriber.objects.filter(unsubscribe_token=token).first()
        if subscriber:
            from django.utils import timezone
            subscriber.is_active = False
            subscriber.unsubscribed_at = timezone.now()
            subscriber.save()
            return Response({'message': 'Vous avez été désinscrit de notre newsletter.'})
        return Response({'error': 'Token invalide'}, status=status.HTTP_404_NOT_FOUND)
