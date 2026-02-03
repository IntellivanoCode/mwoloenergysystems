'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface Partner {
  id: string;
  name: string;
  logo_url?: string;
  logo?: string;
  website?: string;
  description?: string;
  category?: string;
}

const Icons = {
  handshake: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  globe: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  building: (
    <svg className="w-12 h-12 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  check: (
    <svg className="w-6 h-6 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  arrowRight: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  ),
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/cms/partners/`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.results || [];
          setPartners(list);
        }
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  // Partenaires par défaut si aucun n'est trouvé
  const defaultPartners: Partner[] = [
    { id: '1', name: 'SNEL', category: 'Institutionnel', description: 'Société Nationale d\'Électricité - Notre partenaire principal pour la distribution d\'énergie.' },
    { id: '2', name: 'Total Energies', category: 'Énergie', description: 'Partenariat pour les solutions d\'énergie solaire et les carburants.' },
    { id: '3', name: 'Schneider Electric', category: 'Technologie', description: 'Équipements électriques et solutions de gestion de l\'énergie.' },
    { id: '4', name: 'Orange Money', category: 'Paiement', description: 'Solutions de paiement mobile pour nos clients.' },
    { id: '5', name: 'Vodacom M-Pesa', category: 'Paiement', description: 'Partenaire pour les transactions mobiles.' },
    { id: '6', name: 'JinkoSolar', category: 'Solaire', description: 'Fournisseur de panneaux solaires haute qualité.' },
  ];

  const displayPartners = partners.length > 0 ? partners : defaultPartners;

  const partnershipBenefits = [
    'Accès à un réseau de distribution étendu en RDC',
    'Expertise technique reconnue dans le secteur énergétique',
    'Solutions innovantes et durables',
    'Équipe dédiée à la réussite de nos partenariats',
    'Opportunités de co-développement de projets',
  ];

  // Grouper par catégorie ou "Partenaires" si pas de catégorie
  const groupedPartners = displayPartners.reduce((acc, partner) => {
    const cat = partner.category || 'Nos Partenaires';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(partner);
    return acc;
  }, {} as Record<string, Partner[]>);

  const categories = Object.keys(groupedPartners);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section avec fond vidéo/image */}
        <section className="relative min-h-[50vh] flex items-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070" 
              alt="Partners background" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/85 to-slate-900/90"></div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative max-w-6xl mx-auto px-4 py-20 text-center z-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              Partenariats stratégiques
            </span>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Partenaires</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Ensemble, nous construisons l'avenir énergétique de l'Afrique grâce à des partenariats solides et durables.
            </p>
          </div>
        </section>

        {/* Statistiques */}
        <section className="py-12 px-4 -mt-16 relative z-20">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-600 mb-1">{displayPartners.length}</div>
                <div className="text-slate-600 text-sm">Partenaires actifs</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-600 mb-1">5+</div>
                <div className="text-slate-600 text-sm">Années de collaboration</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-600 mb-1">15+</div>
                <div className="text-slate-600 text-sm">Projets conjoints</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-600 mb-1">100%</div>
                <div className="text-slate-600 text-sm">Satisfaction</div>
              </div>
            </div>
          </div>
        </section>

        {/* Partenaires Grid */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-cyan-100 text-cyan-700 text-sm font-semibold rounded-full mb-4">
                RÉSEAU DE PARTENAIRES
              </span>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Ils nous font confiance</h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Des entreprises leaders dans leurs domaines qui partagent notre vision d'une énergie accessible à tous
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {categories.map(category => (
                  <div key={category} className="mb-16">
                    {categories.length > 1 && (
                      <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <span className="w-2 h-8 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></span>
                        {category}
                      </h3>
                    )}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {groupedPartners[category].map((partner) => (
                        <div 
                          key={partner.id} 
                          className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-300 transition-all duration-300 group"
                        >
                          <div className="w-20 h-20 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl flex items-center justify-center mb-4 mx-auto overflow-hidden border border-cyan-100">
                            {partner.logo_url || partner.logo ? (
                              <img 
                                src={partner.logo_url || partner.logo} 
                                alt={partner.name} 
                                className="w-full h-full object-contain p-2" 
                              />
                            ) : (
                              Icons.building
                            )}
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 text-center mb-2 group-hover:text-cyan-600 transition">
                            {partner.name}
                          </h4>
                          {partner.category && (
                            <span className="block text-xs text-cyan-600 text-center mb-2 font-medium">
                              {partner.category}
                            </span>
                          )}
                          {partner.description && (
                            <p className="text-slate-600 text-center text-sm line-clamp-2">{partner.description}</p>
                          )}
                          {partner.website && (
                            <div className="text-center mt-4">
                              <a 
                                href={partner.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 text-sm font-medium transition"
                              >
                                {Icons.globe}
                                Visiter le site
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}

            {!loading && displayPartners.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {Icons.building}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Partenaires en cours de chargement</h3>
                <p className="text-slate-600">Notre réseau de partenaires sera bientôt affiché.</p>
              </div>
            )}
          </div>
        </section>

        {/* Devenir Partenaire */}
        <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block px-4 py-1.5 bg-cyan-100 text-cyan-700 text-sm font-semibold rounded-full mb-4">
                  REJOIGNEZ-NOUS
                </span>
                <h2 className="text-4xl font-bold text-slate-900 mb-6">Devenez notre partenaire</h2>
                <p className="text-slate-600 mb-8 text-lg">
                  Vous souhaitez développer un partenariat avec Mwolo Energy Systems ? Nous sommes ouverts aux collaborations 
                  qui contribuent à notre mission d'apporter une énergie fiable et durable à tous.
                </p>
                <ul className="space-y-4 mb-8">
                  {partnershipBenefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {Icons.check}
                      <span className="text-slate-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/contact?subject=Proposition de partenariat"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition transform hover:-translate-y-1"
                >
                  Proposer un partenariat
                  {Icons.arrowRight}
                </Link>
              </div>
              
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-6 text-xl">Types de partenariats</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Distribution', desc: 'Devenez distributeur de nos services et produits', icon: '🏪' },
                    { title: 'Technologique', desc: 'Intégrez vos solutions à notre écosystème', icon: '💻' },
                    { title: 'Institutionnel', desc: 'Collaborez sur des projets d\'envergure nationale', icon: '🏛️' },
                    { title: 'Financier', desc: 'Participez au financement de projets énergétiques', icon: '💰' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-gradient-to-r from-slate-50 to-cyan-50/50 rounded-xl border border-slate-100 hover:border-cyan-200 transition">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h4 className="font-semibold text-slate-900">{item.title}</h4>
                          <p className="text-slate-600 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 to-blue-700"></div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-4xl mx-auto text-center z-10">
            <h2 className="text-4xl font-bold text-white mb-6">
              Prêt à collaborer avec nous ?
            </h2>
            <p className="text-xl text-cyan-100 mb-10 max-w-2xl mx-auto">
              Contactez notre équipe partenariats pour discuter des opportunités de collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="px-8 py-4 bg-white text-cyan-700 font-bold rounded-xl hover:bg-cyan-50 transition-all shadow-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Nous contacter
              </Link>
              <Link 
                href="/appointments" 
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Prendre rendez-vous
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
