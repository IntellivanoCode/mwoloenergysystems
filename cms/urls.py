from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PageViewSet, BlogPostViewSet, ServiceViewSet, TestimonialViewSet,
    PartnerViewSet, GalleryViewSet, LeadViewSet, SiteSettingsViewSet, JobOfferViewSet,
    FAQViewSet, AdvantageViewSet, NewsletterViewSet, JobApplicationViewSet, PublicStatsView,
    TeamMemberViewSet
)

router = DefaultRouter()
router.register(r'pages', PageViewSet, basename='page')
router.register(r'blog', BlogPostViewSet, basename='blog')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'partners', PartnerViewSet, basename='partner')
router.register(r'galleries', GalleryViewSet, basename='gallery')
router.register(r'leads', LeadViewSet, basename='lead')
router.register(r'settings', SiteSettingsViewSet, basename='settings')
router.register(r'job-offers', JobOfferViewSet, basename='job-offer')
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'advantages', AdvantageViewSet, basename='advantage')
router.register(r'newsletter', NewsletterViewSet, basename='newsletter')
router.register(r'job-applications', JobApplicationViewSet, basename='job-application')
router.register(r'team', TeamMemberViewSet, basename='team')

urlpatterns = [
    path('public-stats/', PublicStatsView.as_view(), name='public-stats'),
    path('', include(router.urls)),
]
