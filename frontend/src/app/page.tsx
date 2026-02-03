'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { StatsSection, WhyChooseUsSection, NewsletterSection, FAQSection } from '@/components/HomeSections';
import { apiCall } from '@/lib/api';

interface Service {
  id: string;
  title: string;
  description: string;
  icon_svg?: string;
  icon_url?: string;
}

interface Partner {
  id: string;
  name: string;
  logo?: string;
  logo_url?: string;
  website?: string;
}

interface Agency {
  id: string;
  name: string;
  code: string;
  province_details?: { name: string };
  territory_details?: { name: string };
  address: string;
  phone: string;
  email: string;
}

interface Testimonial {
  id: string;
  author_name: string;
  author_title: string;
  author_image?: string;
  content: string;
  rating: number;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  published_at: string;
  category_name?: string;
}

interface SiteSettings {
  company_name: string;
  company_description: string;
  hero_background_url?: string;
  hero_video_url?: string;
}

// Animation styles
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
`;

// Helper pour extraire les données paginées
function extractData<T>(data: T[] | { results: T[] } | any): T[] {
  if (Array.isArray(data)) return data;
  if (data?.results) return data.results;
  return [];
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesRes, partnersRes, testimonialsRes, settingsRes, agenciesRes, blogRes] = await Promise.all([
          apiCall<Service[] | { results: Service[] }>('/cms/services/'),
          apiCall<Partner[] | { results: Partner[] }>('/cms/partners/'),
          apiCall<Testimonial[] | { results: Testimonial[] }>('/cms/testimonials/'),
          apiCall<SiteSettings>('/cms/settings/current/'),
          apiCall<Agency[] | { results: Agency[] }>('/agencies/?is_active=true'),
          apiCall<BlogPost[] | { results: BlogPost[] }>('/cms/blog/'),
        ]);

        if (servicesRes.data) setServices(extractData<Service>(servicesRes.data).slice(0, 6));
        if (partnersRes.data) setPartners(extractData<Partner>(partnersRes.data));
        if (testimonialsRes.data) setTestimonials(extractData<Testimonial>(testimonialsRes.data));
        if (settingsRes.data) setSettings(settingsRes.data as SiteSettings);
        if (agenciesRes.data) setAgencies(extractData<Agency>(agenciesRes.data).slice(0, 3));
        if (blogRes.data) setBlogPosts(extractData<BlogPost>(blogRes.data).slice(0, 3));
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <style>{animationStyles}</style>
      <Header />

      {/* Hero Section */}
      <section 
        className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4 overflow-hidden"
        style={{
          backgroundImage: settings?.hero_background_url ? `url(${settings.hero_background_url})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-cyan-900/70"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-left">
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-400/30 rounded-full text-cyan-300 text-sm font-medium mb-6">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Leader en solutions énergétiques
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {settings?.company_name || 'Mwolo Energy'}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                  Systems
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-300 mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                {settings?.company_description || 'Solutions énergétiques intelligentes pour l\'Afrique. Gestion, distribution et facturation d\'énergie avec technologie de pointe.'}
              </p>
              
              <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Link
                  href="/register"
                  className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/30 transition-all transform hover:-translate-y-1 flex items-center gap-2"
                >
                  Commencer maintenant
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition backdrop-blur-sm"
                >
                  Nous contacter
                </Link>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <div>
                  <p className="text-3xl font-bold text-cyan-400">150+</p>
                  <p className="text-slate-400 text-sm">Clients actifs</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-cyan-400">{agencies.length || '12'}</p>
                  <p className="text-slate-400 text-sm">Agences</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-cyan-400">24/7</p>
                  <p className="text-slate-400 text-sm">Support</p>
                </div>
              </div>
            </div>
            
            {/* Right Content - Feature Cards */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { icon: 'bolt', title: 'Énergie Propre', desc: 'Solutions durables' },
                { icon: 'chart', title: 'Monitoring', desc: 'Temps réel' },
                { icon: 'card', title: 'Facturation', desc: 'Simplifiée' },
                { icon: 'shield', title: 'Sécurité', desc: 'Garantie' },
              ].map((feature, index) => (
                <div
                  key={feature.title}
                  className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:scale-105 animate-fade-in-up cursor-pointer"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className="w-12 h-12 mb-4 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    {feature.icon === 'bolt' && (
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    )}
                    {feature.icon === 'chart' && (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    )}
                    {feature.icon === 'card' && (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    )}
                    {feature.icon === 'shield' && (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    )}
                  </div>
                  <h3 className="font-bold text-white mb-1">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Services Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-4">
              Nos Services
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Solutions complètes pour la 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600"> gestion énergétique</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Des services adaptés à vos besoins pour une gestion optimale de votre consommation d'énergie
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-200 rounded-2xl h-64"></div>
                </div>
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 to-blue-600/0 group-hover:from-cyan-500/5 group-hover:to-blue-600/5 transition-all duration-300"></div>
                  
                  <div className="relative z-10">
                    <div className="mb-6">
                      {service.icon_svg ? (
                        <div
                          className="w-16 h-16 text-cyan-600 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-3 flex items-center justify-center group-hover:scale-110 transition-transform"
                          dangerouslySetInnerHTML={{ __html: service.icon_svg }}
                        />
                      ) : service.icon_url ? (
                        <img src={service.icon_url} alt={service.title} className="w-16 h-16 rounded-xl" />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold">
                          {service.title.charAt(0)}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-cyan-700 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-6 line-clamp-3">{service.description}</p>
                    
                    <Link 
                      href="/services" 
                      className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition group-hover:gap-3"
                    >
                      En savoir plus
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-xl text-slate-600">Aucun service disponible pour le moment</p>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-cyan-500/20 transition-all transform hover:-translate-y-1"
            >
              Voir tous nos services
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUsSection />

      {/* Agencies Section */}
      {agencies.length > 0 && (
        <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                Nos Agences
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Présents sur <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">tout le territoire</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Retrouvez nos équipes locales pour un service de proximité
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agencies.map((agency) => (
                <div
                  key={agency.id}
                  className="group relative p-8 bg-white rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-600"></div>
                  
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">{agency.name}</h3>
                      <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs font-medium mt-2">{agency.code}</span>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  {(agency.province_details?.name || agency.territory_details?.name) && (
                    <p className="text-sm text-slate-500 mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      {agency.province_details?.name} — {agency.territory_details?.name}
                    </p>
                  )}
                  
                  <div className="space-y-3">
                    <p className="text-slate-700 flex items-start gap-3">
                      <svg className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span>{agency.address}</span>
                    </p>
                    <p className="text-slate-700 flex items-center gap-3">
                      <svg className="w-5 h-5 text-cyan-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <a className="text-cyan-600 hover:underline" href={`tel:${agency.phone}`}>{agency.phone}</a>
                    </p>
                    <p className="text-slate-700 flex items-center gap-3">
                      <svg className="w-5 h-5 text-cyan-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a className="text-cyan-600 hover:underline truncate" href={`mailto:${agency.email}`}>{agency.email}</a>
                    </p>
                  </div>
                  
                  <Link
                    href="/agencies"
                    className="mt-6 inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition"
                  >
                    Voir les détails
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                href="/agencies"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-cyan-600 text-cyan-600 font-bold rounded-xl hover:bg-cyan-600 hover:text-white transition-all"
              >
                Voir toutes nos agences
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-24 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-medium mb-4">
                Témoignages
              </span>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Ce que nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">clients disent</span>
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Découvrez les expériences de ceux qui nous font confiance
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="relative p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="absolute top-6 right-6 text-cyan-500/20 text-6xl font-serif">"</div>
                  
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg">
                      {testimonial.author_name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-white">{testimonial.author_name}</p>
                      <p className="text-sm text-slate-400">{testimonial.author_title}</p>
                    </div>
                  </div>
                  
                  <div className="flex mb-4 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-slate-600'}`}
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  
                  <p className="text-slate-300 italic leading-relaxed">"{testimonial.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Section */}
      {blogPosts.length > 0 && (
        <section className="py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                Actualités
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Nos derniers <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">articles</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Restez informé des dernières nouvelles du secteur énergétique
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <article 
                  key={post.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100"
                >
                  <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-500">
                    {post.featured_image && (
                      <img 
                        src={post.featured_image} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {post.category_name && (
                      <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-purple-700">
                        {post.category_name}
                      </span>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <p className="text-sm text-slate-500 mb-2">
                      {new Date(post.published_at).toLocaleDateString('fr-FR', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-slate-600 mb-4 line-clamp-2">{post.excerpt}</p>
                    <Link 
                      href={`/news/${post.slug}`}
                      className="inline-flex items-center gap-2 text-purple-600 font-semibold hover:text-purple-700 transition"
                    >
                      Lire l'article
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-purple-500/20 transition-all transform hover:-translate-y-1"
              >
                Voir toutes les actualités
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Partners Section - Carousel horizontal défilant */}
      {partners.length > 0 && (
        <section className="py-24 px-4 bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                Partenaires
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Ils nous font <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-500">confiance</span>
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Nous collaborons avec les meilleurs acteurs du secteur
              </p>
            </div>
            
            {/* Carrousel défilant horizontal */}
            <div className="relative">
              {/* Gradient gauche */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
              {/* Gradient droit */}
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
              
              <div className="flex animate-scroll-x hover:pause-animation">
                {/* Double les partenaires pour un défilement infini */}
                {[...partners, ...partners, ...partners].map((partner, index) => {
                  const PartnerContent = (
                    <div className="w-40 h-24 p-4 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center border border-slate-200 hover:border-cyan-300">
                      {(partner.logo || partner.logo_url) ? (
                        <img
                          src={partner.logo || partner.logo_url}
                          alt={partner.name}
                          className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      ) : (
                        <p className="text-slate-600 font-semibold text-center text-sm group-hover:text-cyan-600 transition-colors">{partner.name}</p>
                      )}
                    </div>
                  );

                  return (
                    <div
                      key={`${partner.id}-${index}`}
                      className="flex-shrink-0 mx-4 group"
                    >
                      {partner.website ? (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Visiter le site de ${partner.name}`}
                          className="block"
                        >
                          {PartnerContent}
                        </a>
                      ) : (
                        PartnerContent
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* CSS pour l'animation */}
          <style jsx>{`
            @keyframes scroll-x {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(calc(-160px * ${partners.length} - 32px * ${partners.length}));
              }
            }
            .animate-scroll-x {
              animation: scroll-x ${partners.length * 3}s linear infinite;
            }
            .animate-scroll-x:hover {
              animation-play-state: paused;
            }
          `}</style>
        </section>
      )}

      {/* FAQ Section */}
      <FAQSection />

      {/* Newsletter Section */}
      <NewsletterSection />

      <Footer />
    </div>
  );
}
