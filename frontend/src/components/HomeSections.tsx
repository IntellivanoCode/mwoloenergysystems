'use client';

import { useEffect, useState, ReactNode } from 'react';
import { apiCall } from '@/lib/api';

interface SiteSettings {
  id?: string;
  company_name: string;
  company_description: string;
  company_logo?: string;
  company_logo_url?: string;
  email: string;
  phone: string;
  address: string;
  facebook_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  google_maps_embed?: string;
  hero_background_url?: string;
  hero_video_url?: string;
}

interface Stats {
  total_clients: number;
  total_agencies: number;
  total_employees: number;
  years_experience: number;
}

// Section Statistiques animée
export function StatsSection() {
  const [stats, setStats] = useState<Stats>({
    total_clients: 0,
    total_agencies: 0,
    total_employees: 0,
    years_experience: 5,
  });
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Utiliser l'endpoint public pour les statistiques (sans auth)
        const res = await apiCall<Stats>('/cms/public-stats/');
        if (res.data) {
          setStats(res.data);
        }
      } catch (error) {
        // Valeurs par défaut si erreur
        setStats({
          total_clients: 150,
          total_agencies: 12,
          total_employees: 85,
          years_experience: 5,
        });
      }
    };

    loadStats();
    
    // Déclencher l'animation après un court délai
    const timer = setTimeout(() => setAnimated(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const statsData = [
    { 
      label: 'Clients satisfaits', 
      value: stats.total_clients, 
      suffix: '+',
      iconType: 'users',
      color: 'from-cyan-500 to-blue-600'
    },
    { 
      label: 'Agences actives', 
      value: stats.total_agencies, 
      suffix: '',
      iconType: 'building',
      color: 'from-green-500 to-emerald-600'
    },
    { 
      label: 'Employés dévoués', 
      value: stats.total_employees, 
      suffix: '+',
      iconType: 'briefcase',
      color: 'from-purple-500 to-indigo-600'
    },
    { 
      label: "Années d'expérience", 
      value: stats.years_experience, 
      suffix: '+',
      iconType: 'star',
      color: 'from-orange-500 to-red-600'
    },
  ];

  // Icônes SVG
  const icons: Record<string, ReactNode> = {
    users: <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    building: <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    briefcase: <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    star: <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-cyan-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Notre Impact en Chiffres
          </h2>
          <p className="text-xl text-slate-300">
            Des résultats concrets qui parlent d'eux-mêmes
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${stat.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {icons[stat.iconType]}
              </div>
              <div className="text-5xl md:text-6xl font-bold text-white mb-2 tabular-nums">
                {animated ? (
                  <CountUp end={stat.value} suffix={stat.suffix} />
                ) : (
                  `0${stat.suffix}`
                )}
              </div>
              <p className="text-lg text-slate-300 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Composant d'animation de compteur
function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [end]);

  return <>{count}{suffix}</>;
}

// Section "Pourquoi nous choisir" - Chargement dynamique depuis Django
export function WhyChooseUsSection() {
  const [advantages, setAdvantages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Avantages par défaut (fallback)
  const defaultFeatures = [
    {
      iconType: 'bolt',
      title: 'Technologie de Pointe',
      description: 'Solutions IoT et compteurs intelligents pour un monitoring en temps réel de votre consommation.',
      color: 'cyan',
    },
    {
      iconType: 'shield',
      title: 'Sécurité Garantie',
      description: 'Systèmes de protection avancés et conformité aux normes internationales de sécurité.',
      color: 'green',
    },
    {
      iconType: 'phone',
      title: 'Support 24/7',
      description: 'Une équipe dédiée disponible à tout moment pour répondre à vos besoins.',
      color: 'blue',
    },
    {
      iconType: 'money',
      title: 'Tarifs Compétitifs',
      description: 'Des solutions adaptées à tous les budgets avec une transparence totale sur les coûts.',
      color: 'purple',
    },
    {
      iconType: 'globe',
      title: 'Présence Nationale',
      description: 'Un réseau d\'agences couvrant tout le territoire pour être au plus près de vous.',
      color: 'orange',
    },
    {
      iconType: 'chart',
      title: 'Analyses Détaillées',
      description: 'Tableaux de bord personnalisés et rapports pour optimiser votre consommation.',
      color: 'red',
    },
  ];

  useEffect(() => {
    const loadAdvantages = async () => {
      try {
        const response = await apiCall<any>('/cms/advantages/');
        const data = response.data?.results || response.data || [];
        if (data.length > 0) {
          setAdvantages(data.map((adv: any) => ({
            iconType: adv.icon_name || 'bolt',
            title: adv.title,
            description: adv.description,
            color: adv.color || 'cyan',
            iconSvg: adv.icon_svg,
          })));
        } else {
          setAdvantages(defaultFeatures);
        }
      } catch (error) {
        setAdvantages(defaultFeatures);
      } finally {
        setLoading(false);
      }
    };
    loadAdvantages();
  }, []);

  const features = advantages.length > 0 ? advantages : defaultFeatures;

  // Icônes SVG
  const icons: Record<string, ReactNode> = {
    bolt: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    zap: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    shield: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
    phone: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    smartphone: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
    money: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    coins: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    globe: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    chart: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  };

  const colorClasses: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
    cyan: { bg: 'bg-cyan-50', border: 'border-cyan-500', text: 'text-cyan-600', iconBg: 'bg-cyan-500' },
    green: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-600', iconBg: 'bg-green-500' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-500', text: 'text-emerald-600', iconBg: 'bg-emerald-500' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-600', iconBg: 'bg-blue-500' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-600', iconBg: 'bg-purple-500' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-600', iconBg: 'bg-orange-500' },
    red: { bg: 'bg-red-50', border: 'border-red-500', text: 'text-red-600', iconBg: 'bg-red-500' },
  };

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold mb-4">
            Nos Avantages
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Pourquoi choisir Mwolo Energy ?
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Nous combinons expertise locale et technologies innovantes pour vous offrir le meilleur service énergétique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color] || colorClasses.cyan;
            return (
              <div
                key={feature.title}
                className={`group p-8 rounded-2xl border-2 border-transparent hover:border-l-4 ${colors.border} ${colors.bg} hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer`}
              >
                <div className={`w-16 h-16 rounded-xl ${colors.iconBg} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform`}>
                  {icons[feature.iconType]}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-cyan-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Section Newsletter - Design moderne avec icône SVG
export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const response = await apiCall<any>('/cms/newsletter/subscribe/', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      
      if (response.data?.success || response.data?.message) {
        setStatus('success');
        setMessage(response.data.message || 'Merci pour votre inscription !');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        throw new Error('Erreur lors de l\'inscription');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Erreur lors de l\'inscription. Veuillez réessayer.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <section className="py-20 px-4 bg-slate-900 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Icône SVG */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white mb-6 shadow-lg shadow-cyan-500/30">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Restez informé de nos actualités
        </h2>
        <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
          Inscrivez-vous à notre newsletter pour recevoir les dernières nouvelles, offres spéciales et conseils pour optimiser votre consommation énergétique.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            required
            className="flex-1 px-6 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent focus:outline-none transition"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {status === 'loading' ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi...
              </>
            ) : status === 'success' ? (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Inscrit !
              </>
            ) : (
              <>S'inscrire</>
            )}
          </button>
        </form>

        {status === 'success' && (
          <p className="mt-4 text-green-400 font-medium flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {message || 'Merci pour votre inscription !'}
          </p>
        )}
        
        {status === 'error' && (
          <p className="mt-4 text-red-400 font-medium flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {message || 'Une erreur est survenue'}
          </p>
        )}
      </div>
    </section>
  );
}

// Section FAQ - Chargement dynamique depuis Django
export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<Array<{question: string; answer: string}>>([]);
  const [loading, setLoading] = useState(true);

  // FAQs par défaut (fallback)
  const defaultFaqs = [
    {
      question: "Comment puis-je devenir client de Mwolo Energy ?",
      answer: "Vous pouvez vous inscrire directement sur notre site web ou vous rendre dans l'une de nos agences avec vos documents d'identité. Notre équipe vous guidera dans toutes les démarches."
    },
    {
      question: "Quels sont les modes de paiement acceptés ?",
      answer: "Nous acceptons les paiements par mobile money (M-Pesa, Airtel Money, Orange Money), les virements bancaires, et les paiements en espèces dans nos agences."
    },
    {
      question: "Comment puis-je suivre ma consommation ?",
      answer: "Connectez-vous à votre espace client sur notre site web ou application mobile pour accéder à votre tableau de bord avec toutes vos statistiques de consommation en temps réel."
    },
    {
      question: "Que faire en cas de panne ou d'urgence ?",
      answer: "Notre support est disponible 24/7. Appelez notre numéro d'urgence ou utilisez le chat en ligne. Nos équipes techniques interviendront dans les plus brefs délais."
    },
    {
      question: "Proposez-vous des solutions pour les entreprises ?",
      answer: "Oui, nous offrons des solutions sur mesure pour les entreprises : comptage industriel, optimisation énergétique, contrats personnalisés et support dédié."
    },
  ];

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const response = await apiCall<any>('/cms/faqs/');
        const data = response.data?.results || response.data || [];
        if (data.length > 0) {
          setFaqs(data.map((faq: any) => ({
            question: faq.question,
            answer: faq.answer,
          })));
        } else {
          setFaqs(defaultFaqs);
        }
      } catch (error) {
        setFaqs(defaultFaqs);
      } finally {
        setLoading(false);
      }
    };
    loadFaqs();
  }, []);

  const displayFaqs = faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <section className="py-24 px-4 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold mb-4">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Questions fréquentes
          </h2>
          <p className="text-xl text-slate-600">
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        <div className="space-y-4">
          {displayFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-slate-50 transition"
              >
                <span className="text-lg font-semibold text-slate-900 pr-8">
                  {faq.question}
                </span>
                <span className={`text-2xl text-cyan-600 transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                <p className="px-8 pb-6 text-slate-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { StatsSection as default };
