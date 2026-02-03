'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  contract_type: string;
  description: string;
  requirements: string;
  status: string;
  deadline?: string;
}

const Icons = {
  briefcase: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  location: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  clock: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  users: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  growth: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  heart: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  star: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  arrowRight: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  ),
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/cms/job-offers/`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.results || [];
          // Filtrer seulement les offres ouvertes
          setJobs(list.filter((j: Job) => j.status === 'ouvert'));
        }
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const benefits = [
    { icon: Icons.users, title: 'Équipe dynamique', desc: 'Travaillez avec des professionnels passionnés' },
    { icon: Icons.growth, title: 'Évolution de carrière', desc: 'Des opportunités de croissance et de formation' },
    { icon: Icons.heart, title: 'Équilibre vie pro/perso', desc: 'Nous valorisons votre bien-être' },
    { icon: Icons.star, title: 'Impact positif', desc: 'Contribuez à la transition énergétique africaine' },
  ];

  // Exemple de postes si l'API ne retourne rien
  const defaultJobs: Job[] = [
    { 
      id: '1', 
      title: 'Technicien Électricien', 
      department: 'Technique', 
      location: 'Kinshasa', 
      contract_type: 'CDI',
      description: 'Nous recherchons un technicien électricien expérimenté pour rejoindre notre équipe d\'installation.',
      requirements: '3 ans d\'expérience minimum, Formation en électricité, Permis de conduire',
      status: 'ouvert'
    },
    { 
      id: '2', 
      title: 'Ingénieur Solaire', 
      department: 'Énergie Renouvelable', 
      location: 'Kinshasa', 
      contract_type: 'CDI',
      description: 'Rejoignez notre département solaire pour concevoir et superviser des installations photovoltaïques.',
      requirements: 'Diplôme d\'ingénieur, 2 ans d\'expérience en solaire, Maîtrise des logiciels de conception',
      status: 'ouvert'
    },
    { 
      id: '3', 
      title: 'Commercial Terrain', 
      department: 'Ventes', 
      location: 'Lubumbashi', 
      contract_type: 'CDI',
      description: 'Développez notre portefeuille client dans la région du Katanga.',
      requirements: 'Expérience en vente B2B, Excellent relationnel, Autonomie',
      status: 'ouvert'
    },
  ];

  const displayJobs = jobs.length > 0 ? jobs : defaultJobs;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl mb-8 shadow-2xl text-white">
              {Icons.briefcase}
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">Rejoignez notre équipe</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Construisez votre carrière chez Mwolo Energy Systems et participez à la révolution énergétique en Afrique.
            </p>
          </div>
        </section>

        {/* Pourquoi nous rejoindre */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Pourquoi nous rejoindre ?</h2>
            <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">
              Chez Mwolo Energy Systems, nous croyons que nos employés sont notre plus grande force.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-cyan-600">
                    {benefit.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 text-sm">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Offres d'emploi */}
        <section className="py-20 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-4">Nos offres d'emploi</h2>
            <p className="text-slate-600 text-center max-w-2xl mx-auto mb-12">
              Découvrez les opportunités qui correspondent à vos compétences et aspirations.
            </p>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {displayJobs.map((job) => (
                  <div key={job.id} className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition group">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-600 transition">{job.title}</h3>
                        <div className="flex flex-wrap gap-4 mt-2 text-slate-600 text-sm">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                            {job.department}
                          </span>
                          <span className="flex items-center gap-1">
                            {Icons.location}
                            {job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            {Icons.clock}
                            {job.contract_type}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-3">{job.description}</p>
                      </div>
                      <Link 
                        href={`/careers/apply/${job.id}?title=${encodeURIComponent(job.title)}&department=${encodeURIComponent(job.department)}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition whitespace-nowrap"
                      >
                        Postuler
                        {Icons.arrowRight}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 bg-gradient-to-r from-cyan-600 to-blue-700">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Vous ne trouvez pas votre poste idéal ?</h2>
            <p className="text-cyan-100 mb-8">
              Envoyez-nous une candidature spontanée, nous sommes toujours à la recherche de talents !
            </p>
            <Link 
              href="/careers/apply/spontaneous"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-cyan-600 font-semibold rounded-xl hover:shadow-lg transition"
            >
              Candidature spontanée
              {Icons.arrowRight}
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
