'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

// ==================== INTERFACES ====================
interface SiteSettings {
  company_name: string;
  company_slogan: string;
  hero_title: string;
  hero_highlight_word: string;
  hero_subtitle: string;
  hero_cta_text: string;
  hero_cta_secondary_text: string;
  hero_background_url?: string;
  services_section_title: string;
  services_section_subtitle: string;
  cta_title: string;
  cta_subtitle: string;
  cta_button_text: string;
  cta_secondary_text: string;
  team_section_title: string;
  team_section_subtitle: string;
  show_team_section: boolean;
  testimonials_section_title: string;
  show_testimonials_section: boolean;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon_svg?: string;
  is_active: boolean;
}

interface TeamMember {
  id: string;
  full_name: string;
  position: string;
  photo_url?: string;
  photo?: string;
  linkedin_url?: string;
}

interface Testimonial {
  id: string;
  author_name: string;
  author_title: string;
  author_image_url?: string;
  content: string;
  rating: number;
}

interface Stats {
  total_clients: number;
  total_agencies: number;
  total_employees: number;
  years_experience: number;
}

// ==================== ICÔNES SVG PROFESSIONNELLES ====================
const Icons = {
  // Énergie / Électricité
  bolt: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  // Soleil / Solaire
  sun: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  // Outils / Maintenance
  tool: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  // Ampoule / Conseil
  lightbulb: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  // Compteur électrique
  meter: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  // Paiement
  payment: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  // Arrow right
  arrowRight: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  ),
  // Star
  star: (
    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
  // User
  user: (
    <svg className="w-full h-full text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  // Quote
  quote: (
    <svg className="w-8 h-8 text-cyan-400/30" fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  ),
};

// Mapping des noms d'icônes vers les composants
const getServiceIcon = (title: string) => {
  const titleLower = title.toLowerCase();
  if (titleLower.includes('solaire') || titleLower.includes('solar')) return Icons.sun;
  if (titleLower.includes('électri') || titleLower.includes('electric')) return Icons.bolt;
  if (titleLower.includes('maintenance') || titleLower.includes('install') || titleLower.includes('technique')) return Icons.tool;
  if (titleLower.includes('conseil') || titleLower.includes('audit')) return Icons.lightbulb;
  if (titleLower.includes('compteur') || titleLower.includes('meter')) return Icons.meter;
  if (titleLower.includes('paiement') || titleLower.includes('facture')) return Icons.payment;
  return Icons.bolt; // Default
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function HomePage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, servicesRes, teamRes, testimonialsRes, statsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/cms/settings/current/`),
          fetch(`${API_BASE_URL}/cms/services/`),
          fetch(`${API_BASE_URL}/cms/team/featured/`),
          fetch(`${API_BASE_URL}/cms/testimonials/`),
          fetch(`${API_BASE_URL}/cms/public-stats/`),
        ]);

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          setSettings(data);
        }

        if (servicesRes.ok) {
          const data = await servicesRes.json();
          const servicesList = Array.isArray(data) ? data : data.results || [];
          setServices(servicesList.slice(0, 6));
        }

        if (teamRes.ok) {
          const data = await teamRes.json();
          setTeam(Array.isArray(data) ? data : data.results || []);
        }

        if (testimonialsRes.ok) {
          const data = await testimonialsRes.json();
          const list = Array.isArray(data) ? data : data.results || [];
          setTestimonials(list.slice(0, 3));
        }

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Erreur de chargement:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Valeurs par défaut
  const defaultSettings: SiteSettings = {
    company_name: 'Mwolo Energy Systems',
    company_slogan: "L'énergie de demain, aujourd'hui",
    hero_title: "Solutions énergétiques pour l'Afrique",
    hero_highlight_word: 'énergétiques',
    hero_subtitle: "Mwolo Energy Systems vous accompagne dans votre transition énergétique avec des solutions électriques et solaires innovantes et durables.",
    hero_cta_text: 'Nos services',
    hero_cta_secondary_text: 'Nous contacter',
    services_section_title: 'Nos Services',
    services_section_subtitle: 'Des solutions complètes pour répondre à tous vos besoins en électricité et énergie solaire',
    cta_title: 'Prêt pour une énergie fiable ?',
    cta_subtitle: 'Prenez rendez-vous avec nos experts pour une étude gratuite de votre projet.',
    cta_button_text: 'Prendre rendez-vous',
    cta_secondary_text: 'Trouver une agence',
    team_section_title: 'Notre Équipe',
    team_section_subtitle: 'Des experts passionnés au service de votre transition énergétique',
    show_team_section: true,
    testimonials_section_title: 'Ce que disent nos clients',
    show_testimonials_section: true,
  };

  const s = settings || defaultSettings;

  // Fonction pour mettre en évidence un mot
  const highlightWord = (text: string, word: string) => {
    if (!word) return text;
    const parts = text.split(new RegExp(`(${word})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === word.toLowerCase() 
        ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{part}</span>
        : part
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Chargement...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* ==================== HERO SECTION ==================== */}
        <section 
          className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden"
          style={s.hero_background_url ? { backgroundImage: `url(${s.hero_background_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
        >
          {!s.hero_background_url && (
            <>
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
              <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
            </>
          )}
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-6">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  {s.company_slogan}
                </span>
                <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {highlightWord(s.hero_title, s.hero_highlight_word)}
                </h1>
                <p className="text-xl text-slate-300 mb-8 max-w-xl">
                  {s.hero_subtitle}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/services" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition transform hover:-translate-y-1">
                    {s.hero_cta_text}
                  </Link>
                  <Link href="/contact" className="px-8 py-4 bg-white/10 backdrop-blur text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition">
                    {s.hero_cta_secondary_text}
                  </Link>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="w-full h-96 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-3xl backdrop-blur border border-white/10 flex items-center justify-center">
                    <svg className="w-48 h-48 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SERVICES SECTION ==================== */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">{s.services_section_title}</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                {s.services_section_subtitle}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.length > 0 ? services.map((service) => (
                <div key={service.id} className="p-8 bg-slate-50 rounded-2xl hover:shadow-xl transition group">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition">
                    {service.icon_svg ? (
                      <div dangerouslySetInnerHTML={{ __html: service.icon_svg }} className="w-10 h-10" />
                    ) : (
                      getServiceIcon(service.title)
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition">{service.title}</h3>
                  <p className="text-slate-600">{service.description}</p>
                </div>
              )) : (
                // Fallback services
                [
                  { title: 'Électricité Générale', desc: 'Installation et maintenance de réseaux électriques pour particuliers et entreprises' },
                  { title: 'Énergie Solaire', desc: 'Panneaux solaires haute performance et solutions photovoltaïques' },
                  { title: 'Maintenance', desc: 'Service après-vente et maintenance préventive de vos installations' },
                ].map((item, idx) => (
                  <div key={idx} className="p-8 bg-slate-50 rounded-2xl hover:shadow-xl transition group">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition">
                      {idx === 0 ? Icons.bolt : idx === 1 ? Icons.sun : Icons.tool}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition">{item.title}</h3>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                ))
              )}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/services" className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition">
                Voir tous nos services
                {Icons.arrowRight}
              </Link>
            </div>
          </div>
        </section>

        {/* ==================== STATS SECTION ==================== */}
        {stats && (
          <section className="py-16 bg-slate-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: 'Clients satisfaits', value: stats.total_clients },
                  { label: 'Agences', value: stats.total_agencies },
                  { label: 'Employés', value: stats.total_employees },
                  { label: "Années d'expérience", value: stats.years_experience },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-4xl md:text-5xl font-bold text-white mb-2">
                      {stat.value}<span className="text-cyan-400">+</span>
                    </p>
                    <p className="text-slate-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ==================== TEAM SECTION ==================== */}
        {s.show_team_section && team.length > 0 && (
          <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{s.team_section_title}</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                  {s.team_section_subtitle}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {team.map((member) => (
                  <div key={member.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition group">
                    <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                      {member.photo_url || member.photo ? (
                        <img 
                          src={member.photo_url || member.photo} 
                          alt={member.full_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-12">
                          {Icons.user}
                        </div>
                      )}
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{member.full_name}</h3>
                      <p className="text-cyan-600">{member.position}</p>
                      {member.linkedin_url && (
                        <a 
                          href={member.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-4 text-slate-500 hover:text-cyan-600 transition"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link href="/about#equipe" className="inline-flex items-center gap-2 text-cyan-600 font-semibold hover:text-cyan-700 transition">
                  Découvrir notre équipe
                  {Icons.arrowRight}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ==================== CTA SECTION ==================== */}
        <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">{s.cta_title}</h2>
            <p className="text-cyan-100 mb-8 max-w-2xl mx-auto">
              {s.cta_subtitle}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/appointments" className="px-8 py-4 bg-white text-cyan-600 font-semibold rounded-xl hover:shadow-lg transition">
                {s.cta_button_text}
              </Link>
              <Link href="/agencies" className="px-8 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition">
                {s.cta_secondary_text}
              </Link>
            </div>
          </div>
        </section>

        {/* ==================== TESTIMONIALS SECTION ==================== */}
        {s.show_testimonials_section && testimonials.length > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{s.testimonials_section_title}</h2>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-slate-50 rounded-2xl p-8 relative">
                    <div className="absolute top-6 right-6">
                      {Icons.quote}
                    </div>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < testimonial.rating ? 'text-amber-400' : 'text-slate-300'}>
                          {Icons.star}
                        </span>
                      ))}
                    </div>
                    <p className="text-slate-600 mb-6 italic">&ldquo;{testimonial.content}&rdquo;</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.author_image_url ? (
                          <img src={testimonial.author_image_url} alt={testimonial.author_name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          testimonial.author_name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{testimonial.author_name}</p>
                        <p className="text-sm text-slate-500">{testimonial.author_title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
