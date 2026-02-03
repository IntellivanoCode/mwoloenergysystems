from rest_framework import serializers
from .models import Page, BlogPost, Service, Testimonial, Partner, Gallery, GalleryImage, Lead, SiteSettings, JobOffer, FAQ, Advantage, NewsletterSubscriber, JobApplication, TeamMember

class JobOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobOffer
        fields = ['id', 'title', 'slug', 'description', 'requirements', 'benefits', 'department', 'location', 'contract_type', 'salary_min', 'salary_max', 'currency', 'status', 'deadline', 'is_featured', 'order', 'posted_date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'posted_date', 'created_at', 'updated_at']

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = ['id', 'title', 'slug', 'content', 'meta_title', 'meta_description', 'og_image', 'is_published', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class BlogPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'content', 'excerpt', 'featured_image', 'featured_image_url', 'featured_video_url', 'meta_title', 'meta_description', 'is_published', 'published_at', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'title', 'description', 'icon_svg', 'icon_url', 'order', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ['id', 'client_code', 'author_name', 'author_title', 'author_image', 'author_image_url', 'content', 'rating', 'status', 'is_active', 'order', 'created_at']
        read_only_fields = ['id', 'created_at']


class TestimonialSubmitSerializer(serializers.ModelSerializer):
    """Serializer pour la soumission de témoignages par les clients"""
    class Meta:
        model = Testimonial
        fields = ['client_code', 'author_name', 'author_title', 'content', 'rating']
    
    def create(self, validated_data):
        # Les témoignages soumis sont en attente de modération
        validated_data['status'] = 'pending'
        validated_data['is_active'] = False
        return super().create(validated_data)


class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = ['id', 'name', 'logo', 'logo_url', 'website', 'description', 'order', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ['id', 'image', 'image_url', 'title', 'description', 'order']
        read_only_fields = ['id']


class GallerySerializer(serializers.ModelSerializer):
    images = GalleryImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Gallery
        fields = ['id', 'title', 'description', 'images', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = ['id', 'first_name', 'last_name', 'email', 'phone', 'subject', 'message', 'is_contacted', 'created_at']
        read_only_fields = ['id', 'created_at']


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = [
            'id', 'company_name', 'company_slogan', 'company_description', 'company_logo', 'company_logo_url', 
            'email', 'phone', 'address', 
            'facebook_url', 'twitter_url', 'linkedin_url', 'instagram_url', 'youtube_url', 'whatsapp_number',
            'google_maps_embed', 
            # Héro section
            'hero_title', 'hero_highlight_word', 'hero_subtitle', 'hero_background_url', 'hero_video_url',
            'hero_cta_text', 'hero_cta_secondary_text',
            # Section services
            'services_section_title', 'services_section_subtitle',
            # Section CTA
            'cta_title', 'cta_subtitle', 'cta_button_text', 'cta_secondary_text',
            # Section équipe
            'team_section_title', 'team_section_subtitle', 'show_team_section',
            # Section témoignages
            'testimonials_section_title', 'show_testimonials_section',
            # Fonds d'écran
            'login_background_url', 'register_background_url',
            'updated_at'
        ]
        read_only_fields = ['id', 'updated_at']


class TeamMemberSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = TeamMember
        fields = [
            'id', 'first_name', 'post_name', 'last_name', 'full_name',
            'position', 'department', 'bio',
            'photo', 'photo_url',
            'email', 'phone', 'linkedin_url', 'twitter_url',
            'is_featured', 'is_active', 'order',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'full_name', 'created_at', 'updated_at']


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'category', 'is_active', 'order', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class AdvantageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advantage
        fields = ['id', 'title', 'description', 'icon_name', 'icon_svg', 'color', 'is_active', 'order', 'created_at']
        read_only_fields = ['id', 'created_at']


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['id', 'email', 'name', 'is_active', 'subscribed_at']
        read_only_fields = ['id', 'subscribed_at']


class NewsletterSubscribeSerializer(serializers.ModelSerializer):
    """Serializer pour l'inscription à la newsletter"""
    class Meta:
        model = NewsletterSubscriber
        fields = ['email', 'name']


class JobApplicationSerializer(serializers.ModelSerializer):
    job_offer_title = serializers.CharField(source='job_offer.title', read_only=True)
    
    class Meta:
        model = JobApplication
        fields = [
            'id', 'job_offer', 'job_offer_title', 'first_name', 'post_name', 'last_name', 
            'email', 'phone', 'cover_letter', 'cv_file', 'cv_url',
            'linkedin_url', 'portfolio_url', 'expected_salary', 'availability',
            'status', 'created_at'
        ]
        read_only_fields = ['id', 'status', 'created_at']


class JobApplicationSubmitSerializer(serializers.ModelSerializer):
    """Serializer pour la soumission de candidatures"""
    class Meta:
        model = JobApplication
        fields = [
            'job_offer', 'first_name', 'post_name', 'last_name', 'email', 'phone',
            'cover_letter', 'cv_file', 'cv_url', 'linkedin_url', 'portfolio_url',
            'expected_salary', 'availability'
        ]
    
    def create(self, validated_data):
        validated_data['status'] = 'pending'
        return super().create(validated_data)
