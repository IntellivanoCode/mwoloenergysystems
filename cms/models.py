from django.db import models
from django.utils.text import slugify
import uuid

class Page(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    title = models.CharField(max_length=300, verbose_name="Titre")
    slug = models.SlugField(unique=True, verbose_name="Slug")
    content = models.TextField(verbose_name="Contenu")
    
    meta_title = models.CharField(max_length=300, blank=True, verbose_name="Titre SEO")
    meta_description = models.CharField(max_length=500, blank=True, verbose_name="Description SEO")
    og_image = models.ImageField(upload_to='cms/og_images/', blank=True, null=True, verbose_name="Image OG")
    
    is_published = models.BooleanField(default=False, verbose_name="Publié")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = 'Page'
        verbose_name_plural = 'Pages'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class BlogPost(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    title = models.CharField(max_length=300, verbose_name="Titre")
    slug = models.SlugField(unique=True, verbose_name="Slug")
    content = models.TextField(verbose_name="Contenu")
    excerpt = models.CharField(max_length=500, blank=True, verbose_name="Résumé")
    
    featured_image = models.ImageField(upload_to='cms/blog_images/', blank=True, null=True, verbose_name="Image principale")
    featured_image_url = models.URLField(blank=True, null=True, verbose_name="URL image principale")
    featured_video_url = models.URLField(blank=True, null=True, verbose_name="URL vidéo (YouTube/Vimeo)")
    
    meta_title = models.CharField(max_length=300, blank=True, verbose_name="Titre SEO")
    meta_description = models.CharField(max_length=500, blank=True, verbose_name="Description SEO")
    
    is_published = models.BooleanField(default=False, verbose_name="Publié")
    published_at = models.DateTimeField(null=True, blank=True, verbose_name="Date de publication")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = 'Article'
        verbose_name_plural = 'Articles'
        ordering = ['-published_at', '-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class Service(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    title = models.CharField(max_length=300, verbose_name="Titre")
    description = models.TextField(verbose_name="Description")
    icon_svg = models.TextField(blank=True, verbose_name="Icône SVG", help_text="Code SVG complet")
    icon_url = models.URLField(blank=True, null=True, verbose_name="URL icône")
    
    order = models.IntegerField(default=0, verbose_name="Ordre")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = 'Service'
        verbose_name_plural = 'Services'
        ordering = ['order']
    
    def __str__(self):
        return self.title


class Testimonial(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('approved', 'Approuvé'),
        ('rejected', 'Rejeté'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Lien avec client (optionnel)
    client_code = models.CharField(max_length=50, blank=True, verbose_name="Code client")
    
    author_name = models.CharField(max_length=200, verbose_name="Nom de l'auteur")
    author_title = models.CharField(max_length=200, blank=True, verbose_name="Titre/Poste")
    author_image = models.ImageField(upload_to='cms/testimonials/', blank=True, null=True, verbose_name="Photo")
    author_image_url = models.URLField(blank=True, null=True, verbose_name="URL photo")
    
    content = models.TextField(verbose_name="Témoignage")
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)], default=5, verbose_name="Note")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Statut")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    order = models.IntegerField(default=0, verbose_name="Ordre")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    
    class Meta:
        verbose_name = 'Témoignage'
        verbose_name_plural = 'Témoignages'
        ordering = ['order']
    
    def __str__(self):
        return self.author_name


class Partner(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    name = models.CharField(max_length=200, verbose_name="Nom du partenaire")
    logo = models.ImageField(upload_to='cms/partners/', blank=True, null=True, verbose_name="Logo")
    logo_url = models.URLField(blank=True, null=True, verbose_name="URL du logo")
    website = models.URLField(blank=True, null=True, verbose_name="Site web")
    description = models.TextField(blank=True, verbose_name="Description")
    
    order = models.IntegerField(default=0, verbose_name="Ordre")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    
    class Meta:
        verbose_name = 'Partenaire'
        verbose_name_plural = 'Partenaires'
        ordering = ['order']
    
    def __str__(self):
        return self.name


class Gallery(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    title = models.CharField(max_length=300, verbose_name="Titre")
    description = models.TextField(blank=True, verbose_name="Description")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = 'Galerie'
        verbose_name_plural = 'Galeries'
    
    def __str__(self):
        return self.title


class GalleryImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    gallery = models.ForeignKey(Gallery, on_delete=models.CASCADE, related_name='images', verbose_name="Galerie")
    
    image = models.ImageField(upload_to='cms/gallery/', verbose_name="Image")
    image_url = models.URLField(blank=True, null=True, verbose_name="URL image")
    title = models.CharField(max_length=300, blank=True, verbose_name="Titre")
    description = models.TextField(blank=True, verbose_name="Description")
    
    order = models.IntegerField(default=0, verbose_name="Ordre")
    
    class Meta:
        verbose_name = 'Image de galerie'
        verbose_name_plural = 'Images de galerie'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.gallery.title} - {self.title}"


class Lead(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    first_name = models.CharField(max_length=100, verbose_name="Prénom")
    last_name = models.CharField(max_length=100, verbose_name="Nom")
    email = models.EmailField(verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    
    subject = models.CharField(max_length=300, verbose_name="Sujet")
    message = models.TextField(verbose_name="Message")
    
    is_contacted = models.BooleanField(default=False, verbose_name="Contacté")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    
    class Meta:
        verbose_name = 'Lead'
        verbose_name_plural = 'Leads'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class JobOffer(models.Model):
    STATUS_CHOICES = [
        ('ouvert', 'Ouvert'),
        ('fermé', 'Fermé'),
        ('archivé', 'Archivé'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    title = models.CharField(max_length=300, verbose_name="Titre du poste")
    slug = models.SlugField(unique=True, verbose_name="Slug")
    description = models.TextField(verbose_name="Description du poste")
    requirements = models.TextField(verbose_name="Exigences")
    benefits = models.TextField(verbose_name="Avantages")
    
    department = models.CharField(max_length=200, verbose_name="Département")
    location = models.CharField(max_length=200, verbose_name="Localisation")
    contract_type = models.CharField(max_length=100, verbose_name="Type de contrat")
    salary_min = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, verbose_name="Salaire minimum")
    salary_max = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, verbose_name="Salaire maximum")
    currency = models.CharField(max_length=3, default='USD', verbose_name="Devise")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ouvert', verbose_name="Statut")
    posted_date = models.DateTimeField(auto_now_add=True, verbose_name="Date de publication")
    deadline = models.DateField(verbose_name="Date limite de candidature")
    
    is_featured = models.BooleanField(default=False, verbose_name="En vedette")
    order = models.IntegerField(default=0, verbose_name="Ordre")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = 'Offre d\'emploi'
        verbose_name_plural = 'Offres d\'emploi'
        ordering = ['-posted_date']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class JobApplication(models.Model):
    """Candidatures pour les offres d'emploi"""
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('reviewed', 'Examinée'),
        ('interview', 'Entretien'),
        ('hired', 'Embauché'),
        ('rejected', 'Rejetée'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    job_offer = models.ForeignKey(JobOffer, on_delete=models.CASCADE, related_name='applications', verbose_name="Offre d'emploi")
    
    first_name = models.CharField(max_length=100, verbose_name="Prénom")
    post_name = models.CharField(max_length=100, blank=True, verbose_name="Post-nom")
    last_name = models.CharField(max_length=100, verbose_name="Nom")
    email = models.EmailField(verbose_name="Email")
    phone = models.CharField(max_length=20, verbose_name="Téléphone")
    
    cover_letter = models.TextField(verbose_name="Lettre de motivation")
    cv_file = models.FileField(upload_to='cms/applications/', blank=True, null=True, verbose_name="CV (PDF)")
    cv_url = models.URLField(blank=True, null=True, verbose_name="Lien vers CV (LinkedIn, Drive, etc.)")
    
    linkedin_url = models.URLField(blank=True, null=True, verbose_name="LinkedIn")
    portfolio_url = models.URLField(blank=True, null=True, verbose_name="Portfolio")
    
    expected_salary = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True, verbose_name="Prétention salariale")
    availability = models.CharField(max_length=100, blank=True, verbose_name="Disponibilité")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Statut")
    notes = models.TextField(blank=True, verbose_name="Notes internes")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Candidature le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = 'Candidature'
        verbose_name_plural = 'Candidatures'
        ordering = ['-created_at']
    
    def __str__(self):
        full_name = f"{self.first_name} {self.post_name} {self.last_name}".replace("  ", " ").strip()
        return f"{full_name} - {self.job_offer.title}"


class SiteSettings(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    company_name = models.CharField(max_length=200, default="Mwolo Energy Systems", verbose_name="Nom de l'entreprise")
    company_slogan = models.CharField(max_length=300, default="L'énergie de demain, aujourd'hui", verbose_name="Slogan")
    company_description = models.TextField(blank=True, verbose_name="Description de l'entreprise")
    company_logo = models.ImageField(upload_to='cms/logo/', blank=True, null=True, verbose_name="Logo")
    company_logo_url = models.URLField(blank=True, null=True, verbose_name="URL du logo")
    
    email = models.EmailField(verbose_name="Email")
    phone = models.CharField(max_length=20, verbose_name="Téléphone")
    address = models.TextField(verbose_name="Adresse")
    
    facebook_url = models.URLField(blank=True, null=True, verbose_name="Facebook")
    twitter_url = models.URLField(blank=True, null=True, verbose_name="Twitter")
    linkedin_url = models.URLField(blank=True, null=True, verbose_name="LinkedIn")
    instagram_url = models.URLField(blank=True, null=True, verbose_name="Instagram")
    youtube_url = models.URLField(blank=True, null=True, verbose_name="YouTube")
    whatsapp_number = models.CharField(max_length=20, blank=True, verbose_name="Numéro WhatsApp")
    
    google_maps_embed = models.TextField(blank=True, verbose_name="Google Maps Embed", help_text="Code d'intégration Google Maps")
    
    # ========== HÉRO SECTION (Page d'accueil) ==========
    hero_title = models.CharField(max_length=300, default="Solutions énergétiques pour l'Afrique", verbose_name="Titre héro")
    hero_highlight_word = models.CharField(max_length=100, default="énergétiques", verbose_name="Mot à mettre en évidence", help_text="Ce mot aura un dégradé de couleur")
    hero_subtitle = models.TextField(default="Mwolo Energy Systems vous accompagne dans votre transition énergétique avec des solutions électriques et solaires innovantes et durables.", verbose_name="Sous-titre héro")
    hero_background_url = models.URLField(blank=True, null=True, verbose_name="URL fond héro")
    hero_video_url = models.URLField(blank=True, null=True, verbose_name="URL vidéo héro")
    hero_cta_text = models.CharField(max_length=50, default="Nos services", verbose_name="Texte bouton principal")
    hero_cta_secondary_text = models.CharField(max_length=50, default="Nous contacter", verbose_name="Texte bouton secondaire")
    
    # ========== SECTION SERVICES ==========
    services_section_title = models.CharField(max_length=200, default="Nos Services", verbose_name="Titre section services")
    services_section_subtitle = models.TextField(default="Des solutions complètes pour répondre à tous vos besoins en électricité et énergie solaire", verbose_name="Sous-titre section services")
    
    # ========== SECTION CTA ==========
    cta_title = models.CharField(max_length=300, default="Prêt pour une énergie fiable ?", verbose_name="Titre section CTA")
    cta_subtitle = models.TextField(default="Prenez rendez-vous avec nos experts pour une étude gratuite de votre projet.", verbose_name="Sous-titre CTA")
    cta_button_text = models.CharField(max_length=50, default="Prendre rendez-vous", verbose_name="Texte bouton CTA")
    cta_secondary_text = models.CharField(max_length=50, default="Trouver une agence", verbose_name="Texte bouton secondaire CTA")
    
    # ========== SECTION ÉQUIPE ==========
    team_section_title = models.CharField(max_length=200, default="Notre Équipe", verbose_name="Titre section équipe")
    team_section_subtitle = models.TextField(default="Des experts passionnés au service de votre transition énergétique", verbose_name="Sous-titre section équipe")
    show_team_section = models.BooleanField(default=True, verbose_name="Afficher section équipe")
    
    # ========== SECTION TÉMOIGNAGES ==========
    testimonials_section_title = models.CharField(max_length=200, default="Ce que disent nos clients", verbose_name="Titre section témoignages")
    show_testimonials_section = models.BooleanField(default=True, verbose_name="Afficher section témoignages")
    
    # ========== FONDS D'ÉCRAN ==========
    login_background_url = models.URLField(blank=True, null=True, verbose_name="URL fond page connexion client")
    register_background_url = models.URLField(blank=True, null=True, verbose_name="URL fond page inscription")
    
    # ========== PORTAIL EMPLOYÉ ==========
    portal_background_url = models.URLField(blank=True, null=True, verbose_name="URL fond portail employé")
    portal_logo_url = models.URLField(blank=True, null=True, verbose_name="URL logo portail")
    portal_primary_color = models.CharField(max_length=7, default='#0891b2', verbose_name="Couleur primaire portail", help_text="Code hex ex: #0891b2")
    portal_secondary_color = models.CharField(max_length=7, default='#2563eb', verbose_name="Couleur secondaire portail", help_text="Code hex ex: #2563eb")
    portal_welcome_message = models.CharField(max_length=200, default='Bienvenue sur votre espace de travail', verbose_name="Message d'accueil portail")
    portal_announcement = models.TextField(blank=True, verbose_name="Annonce portail", help_text="Message affiché sur le portail employé")
    
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = 'Paramètres du site'
        verbose_name_plural = 'Paramètres du site'
    
    def __str__(self):
        return self.company_name


class FAQ(models.Model):
    """Questions fréquemment posées"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    question = models.CharField(max_length=500, verbose_name="Question")
    answer = models.TextField(verbose_name="Réponse")
    
    category = models.CharField(max_length=100, blank=True, verbose_name="Catégorie", help_text="Ex: Général, Facturation, Installation...")
    
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    order = models.IntegerField(default=0, verbose_name="Ordre")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = 'FAQ'
        verbose_name_plural = 'FAQs'
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return self.question[:80]


class TeamMember(models.Model):
    """Membres de l'équipe affichés sur le site vitrine"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    first_name = models.CharField(max_length=100, verbose_name="Prénom")
    post_name = models.CharField(max_length=100, blank=True, verbose_name="Post-nom")
    last_name = models.CharField(max_length=100, verbose_name="Nom")
    
    position = models.CharField(max_length=200, verbose_name="Poste/Fonction")
    department = models.CharField(max_length=200, blank=True, verbose_name="Département")
    bio = models.TextField(blank=True, verbose_name="Biographie courte")
    
    photo = models.ImageField(upload_to='cms/team/', blank=True, null=True, verbose_name="Photo")
    photo_url = models.URLField(blank=True, null=True, verbose_name="URL de la photo")
    
    email = models.EmailField(blank=True, verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Téléphone")
    linkedin_url = models.URLField(blank=True, null=True, verbose_name="LinkedIn")
    twitter_url = models.URLField(blank=True, null=True, verbose_name="Twitter")
    
    is_featured = models.BooleanField(default=False, verbose_name="En vedette", help_text="Affiché sur la page d'accueil")
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    order = models.IntegerField(default=0, verbose_name="Ordre d'affichage")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = 'Membre de l\'équipe'
        verbose_name_plural = 'Membres de l\'équipe'
        ordering = ['order', 'last_name']
    
    def __str__(self):
        full_name = f"{self.first_name} {self.post_name} {self.last_name}".replace("  ", " ").strip()
        return f"{full_name} - {self.position}"
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.post_name} {self.last_name}".replace("  ", " ").strip()


class Advantage(models.Model):
    """Pourquoi nous choisir - Avantages"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    title = models.CharField(max_length=200, verbose_name="Titre")
    description = models.TextField(verbose_name="Description")
    
    # Icône SVG ou nom d'icône
    icon_name = models.CharField(max_length=50, blank=True, verbose_name="Nom de l'icône", help_text="Ex: zap, shield, smartphone, globe")
    icon_svg = models.TextField(blank=True, verbose_name="SVG personnalisé", help_text="Code SVG complet de l'icône")
    
    color = models.CharField(max_length=50, default='cyan', verbose_name="Couleur", help_text="Ex: cyan, emerald, orange, purple")
    
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    order = models.IntegerField(default=0, verbose_name="Ordre")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    
    class Meta:
        verbose_name = 'Avantage'
        verbose_name_plural = 'Avantages (Pourquoi nous choisir)'
        ordering = ['order']
    
    def __str__(self):
        return self.title


class NewsletterSubscriber(models.Model):
    """Abonnés à la newsletter"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    email = models.EmailField(unique=True, verbose_name="Email")
    name = models.CharField(max_length=200, blank=True, verbose_name="Nom")
    
    is_active = models.BooleanField(default=True, verbose_name="Actif")
    subscribed_at = models.DateTimeField(auto_now_add=True, verbose_name="Inscrit le")
    unsubscribed_at = models.DateTimeField(null=True, blank=True, verbose_name="Désinscrit le")
    
    # Token pour désinscription
    unsubscribe_token = models.CharField(max_length=100, unique=True, verbose_name="Token de désinscription")
    
    class Meta:
        verbose_name = 'Abonné newsletter'
        verbose_name_plural = 'Abonnés newsletter'
        ordering = ['-subscribed_at']
    
    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        if not self.unsubscribe_token:
            self.unsubscribe_token = str(uuid.uuid4())
        super().save(*args, **kwargs)
