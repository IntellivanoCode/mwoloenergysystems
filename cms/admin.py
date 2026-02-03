from django.contrib import admin
from .models import Page, BlogPost, Service, Testimonial, Partner, Gallery, GalleryImage, Lead, SiteSettings, JobOffer, FAQ, Advantage, NewsletterSubscriber, JobApplication, TeamMember

@admin.register(JobOffer)
class JobOfferAdmin(admin.ModelAdmin):
    list_display = ('title', 'department', 'location', 'status', 'is_featured', 'deadline')
    list_filter = ('status', 'is_featured', 'department', 'deadline')
    search_fields = ('title', 'department', 'location')
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        ('Poste', {
            'fields': ('title', 'slug', 'department', 'location', 'contract_type')
        }),
        ('Description', {
            'fields': ('description', 'requirements', 'benefits')
        }),
        ('Salaire', {
            'fields': ('salary_min', 'salary_max', 'currency')
        }),
        ('Gestion', {
            'fields': ('status', 'deadline', 'is_featured', 'order')
        }),
    )

@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'is_published', 'updated_at')
    list_filter = ('is_published', 'updated_at')
    search_fields = ('title', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        ('Contenu', {
            'fields': ('title', 'slug', 'content')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'og_image'),
            'classes': ('collapse',)
        }),
        ('Publication', {
            'fields': ('is_published',)
        }),
    )

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'is_published', 'published_at')
    list_filter = ('is_published', 'published_at')
    search_fields = ('title', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    fieldsets = (
        ('Contenu', {
            'fields': ('title', 'slug', 'excerpt', 'content', 'featured_image', 'featured_video_url')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description'),
            'classes': ('collapse',)
        }),
        ('Publication', {
            'fields': ('is_published', 'published_at')
        }),
    )

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('title',)
    fieldsets = (
        ('Informations', {
            'fields': ('title', 'description')
        }),
        ('Icône', {
            'fields': ('icon_svg', 'icon_url'),
            'description': 'Ajouter soit un SVG soit une URL d\'icône'
        }),
        ('Gestion', {
            'fields': ('order', 'is_active')
        }),
    )

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('author_name', 'author_title', 'rating', 'status', 'is_active', 'order')
    list_filter = ('is_active', 'status', 'rating')
    search_fields = ('author_name', 'client_code')
    list_editable = ('status', 'is_active')
    fieldsets = (
        ('Client', {
            'fields': ('client_code',)
        }),
        ('Auteur', {
            'fields': ('author_name', 'author_title', 'author_image', 'author_image_url')
        }),
        ('Contenu', {
            'fields': ('content', 'rating')
        }),
        ('Gestion', {
            'fields': ('status', 'is_active', 'order')
        }),
    )

@admin.register(Partner)
class PartnerAdmin(admin.ModelAdmin):
    list_display = ('name', 'order', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)
    fieldsets = (
        ('Informations', {
            'fields': ('name', 'description', 'website')
        }),
        ('Logo', {
            'fields': ('logo', 'logo_url'),
            'description': 'Ajouter soit un fichier soit une URL'
        }),
        ('Gestion', {
            'fields': ('order', 'is_active')
        }),
    )

class GalleryImageInline(admin.TabularInline):
    model = GalleryImage
    extra = 1

@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ('title', 'updated_at')
    search_fields = ('title',)
    inlines = [GalleryImageInline]

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'is_contacted', 'created_at')
    list_filter = ('is_contacted', 'created_at')
    search_fields = ('first_name', 'last_name', 'email')
    readonly_fields = ('created_at',)

@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ('Entreprise', {
            'fields': ('company_name', 'company_slogan', 'company_description', 'company_logo', 'company_logo_url')
        }),
        ('Contact', {
            'fields': ('email', 'phone', 'address', 'whatsapp_number')
        }),
        ('Réseaux sociaux', {
            'fields': ('facebook_url', 'twitter_url', 'linkedin_url', 'instagram_url', 'youtube_url'),
            'classes': ('collapse',)
        }),
        ('🏠 Section Héro (Page d\'accueil)', {
            'fields': ('hero_title', 'hero_highlight_word', 'hero_subtitle', 'hero_cta_text', 'hero_cta_secondary_text', 'hero_background_url', 'hero_video_url'),
            'description': 'Textes et images de la section principale de la page d\'accueil'
        }),
        ('📋 Section Services', {
            'fields': ('services_section_title', 'services_section_subtitle'),
        }),
        ('📢 Section CTA (Appel à l\'action)', {
            'fields': ('cta_title', 'cta_subtitle', 'cta_button_text', 'cta_secondary_text'),
        }),
        ('👥 Section Équipe', {
            'fields': ('team_section_title', 'team_section_subtitle', 'show_team_section'),
        }),
        ('💬 Section Témoignages', {
            'fields': ('testimonials_section_title', 'show_testimonials_section'),
        }),
        ('🖼️ Fonds d\'écran', {
            'fields': ('login_background_url', 'register_background_url'),
            'description': 'URLs pour les images de fond des pages connexion/inscription'
        }),
        ('Google Maps', {
            'fields': ('google_maps_embed',),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'position', 'department', 'is_featured', 'is_active', 'order')
    list_filter = ('is_active', 'is_featured', 'department')
    search_fields = ('first_name', 'post_name', 'last_name', 'position')
    list_editable = ('is_featured', 'is_active', 'order')
    fieldsets = (
        ('Identité', {
            'fields': ('first_name', 'post_name', 'last_name')
        }),
        ('Poste', {
            'fields': ('position', 'department', 'bio')
        }),
        ('Photo', {
            'fields': ('photo', 'photo_url'),
            'description': 'Ajouter soit un fichier soit une URL'
        }),
        ('Contact', {
            'fields': ('email', 'phone', 'linkedin_url', 'twitter_url'),
            'classes': ('collapse',)
        }),
        ('Affichage', {
            'fields': ('is_featured', 'is_active', 'order'),
            'description': 'Les membres "En vedette" apparaîtront sur la page d\'accueil'
        }),
    )
    
    def full_name(self, obj):
        return obj.full_name
    full_name.short_description = 'Nom complet'


@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('question', 'category', 'is_active', 'order')
    list_filter = ('is_active', 'category')
    search_fields = ('question', 'answer')
    list_editable = ('is_active', 'order')
    fieldsets = (
        ('Question/Réponse', {
            'fields': ('question', 'answer')
        }),
        ('Organisation', {
            'fields': ('category', 'order')
        }),
        ('Gestion', {
            'fields': ('is_active',)
        }),
    )


@admin.register(Advantage)
class AdvantageAdmin(admin.ModelAdmin):
    list_display = ('title', 'icon_name', 'color', 'is_active', 'order')
    list_filter = ('is_active', 'color')
    search_fields = ('title', 'description')
    list_editable = ('is_active', 'order')
    fieldsets = (
        ('Contenu', {
            'fields': ('title', 'description')
        }),
        ('Icône', {
            'fields': ('icon_name', 'icon_svg', 'color'),
            'description': 'Utiliser icon_name (zap, shield, smartphone, globe, coins) ou fournir un SVG personnalisé'
        }),
        ('Gestion', {
            'fields': ('is_active', 'order')
        }),
    )


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'is_active', 'subscribed_at', 'unsubscribed_at')
    list_filter = ('is_active', 'subscribed_at')
    search_fields = ('email', 'name')
    list_editable = ('is_active',)
    readonly_fields = ('subscribed_at', 'unsubscribed_at', 'unsubscribe_token')


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('get_full_name', 'job_offer', 'email', 'phone', 'status', 'created_at')
    list_filter = ('status', 'job_offer', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'phone')
    list_editable = ('status',)
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('Candidat', {
            'fields': ('first_name', 'last_name', 'email', 'phone')
        }),
        ('Poste', {
            'fields': ('job_offer',)
        }),
        ('Documents', {
            'fields': ('cover_letter', 'cv_file', 'cv_url', 'linkedin_url', 'portfolio_url')
        }),
        ('Informations complémentaires', {
            'fields': ('expected_salary', 'availability')
        }),
        ('Statut', {
            'fields': ('status', 'notes')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
    get_full_name.short_description = 'Nom complet'
