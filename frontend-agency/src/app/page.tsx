'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getAgencies, setAgencyConfig, getAgencyId, isAuthenticated, getUser, logout } from '@/lib/api';

// ==================== ICÔNES SVG PROFESSIONNELLES ====================
const Icons = {
  // Borne Ticket
  ticket: (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
  ),
  
  // Moniteur / Écran TV
  monitor: (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  
  // Guichet / Ordinateur
  computer: (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      <circle cx="12" cy="9" r="2" strokeWidth={1.5} />
    </svg>
  ),
  
  // Calendrier / RDV
  calendar: (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  
  // Agence / Bâtiment
  building: (
    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  
  // Ampoule / Info
  lightbulb: (
    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  
  // Éclair / Logo
  bolt: (
    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  
  // Logout
  logout: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  
  // User
  user: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
};

interface Agency {
  id: string;
  name: string;
  code: string;
  address: string;
}

interface Tool {
  href: string;
  icon: React.ReactNode;
  name: string;
  desc: string;
  color: string;
  forScreen: string;
}

export default function AgencyHomePage() {
  const router = useRouter();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);

  useEffect(() => {
    // Vérifier l'authentification
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    // Charger l'utilisateur
    setUser(getUser());

    // Check if agency already configured
    const savedAgency = getAgencyId();
    if (savedAgency) {
      setSelectedAgency(savedAgency);
    }

    // Load agencies
    const loadAgencies = async () => {
      try {
        const result = await getAgencies();
        if (result.data) {
          setAgencies(result.data as Agency[]);
        } else if (result.error) {
          setError(result.message || 'Erreur de connexion au serveur');
        }
      } catch (err) {
        setError('Impossible de se connecter au serveur. Vérifiez que Django est en cours d\'exécution sur le port 8000.');
      }
      setLoading(false);
    };
    loadAgencies();
  }, []);

  const handleSelectAgency = (agency: Agency) => {
    setAgencyConfig({
      agency_id: agency.id,
      agency_name: agency.name,
      agency_code: agency.code,
    });
    setSelectedAgency(agency.id);
  };

  const tools: Tool[] = [
    {
      href: '/kiosk',
      icon: Icons.ticket,
      name: 'Borne Ticket',
      desc: 'Distribution de tickets pour la file d\'attente',
      color: 'from-pink-500 to-rose-600',
      forScreen: 'Borne tactile / Tablette'
    },
    {
      href: '/monitor',
      icon: Icons.monitor,
      name: 'Moniteur File',
      desc: 'Affichage des tickets appelés',
      color: 'from-cyan-500 to-blue-600',
      forScreen: 'Écran TV / Grand écran'
    },
    {
      href: '/counter',
      icon: Icons.computer,
      name: 'Guichet Agent',
      desc: 'Interface pour agent de guichet',
      color: 'from-indigo-500 to-purple-600',
      forScreen: 'PC Agent'
    },
    {
      href: '/appointments',
      icon: Icons.calendar,
      name: 'RDV sur Place',
      desc: 'Prise de rendez-vous client',
      color: 'from-green-500 to-teal-600',
      forScreen: 'Tablette / PC'
    },
    {
      href: '/register-client',
      icon: Icons.user,
      name: 'Inscription Client',
      desc: 'Enregistrer un nouveau client',
      color: 'from-emerald-500 to-green-600',
      forScreen: 'Tablette / PC'
    },
  ];

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement des agences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-6 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
              {Icons.bolt}
            </div>
            <div>
              <h1 className="font-bold text-xl text-white">Mwolo Energy Systems</h1>
              <p className="text-cyan-400 text-sm">Outils Agence</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {selectedAgency && (
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-sm">Agence:</span>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-medium">
                  {agencies.find(a => a.id === selectedAgency)?.name || 'Sélectionnée'}
                </span>
                <button
                  onClick={() => setSelectedAgency(null)}
                  className="text-slate-400 hover:text-white text-sm transition"
                >
                  Changer
                </button>
              </div>
            )}
            
            {/* User info & Logout */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/10">
              <div className="flex items-center gap-2 text-slate-300">
                {Icons.user}
                <span className="text-sm">
                  {user?.first_name} {user?.post_name || user?.last_name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                title="Déconnexion"
              >
                {Icons.logout}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Agency Selection */}
          {!selectedAgency ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Sélectionnez votre agence</h2>
              <p className="text-slate-400 mb-8">Cette configuration sera mémorisée pour cet appareil</p>
              
              {error ? (
                <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-xl mb-6">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-red-400 font-medium">Erreur de connexion</p>
                  </div>
                  <p className="text-red-300/80 text-sm">{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-sm transition"
                  >
                    Réessayer
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agencies.map((agency) => (
                    <button
                      key={agency.id}
                      onClick={() => handleSelectAgency(agency)}
                      className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 rounded-2xl transition text-left group"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-lg shadow-cyan-500/20">
                        {Icons.building}
                      </div>
                      <p className="text-white font-bold text-lg">{agency.name}</p>
                      <p className="text-slate-500 text-sm">{agency.code}</p>
                      <p className="text-slate-600 text-xs mt-2">{agency.address}</p>
                    </button>
                  ))}
                </div>
              )}

              {!error && agencies.length === 0 && (
                <div className="p-8 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-amber-400 font-medium">Aucune agence disponible</p>
                  </div>
                  <p className="text-amber-300/80 text-sm">
                    Vérifiez que le serveur Django est en cours d'exécution et que des agences sont configurées.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Tools Selection */
            <div>
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-white mb-2">Outils disponibles</h2>
                <p className="text-slate-400">Sélectionnez l'outil adapté à votre écran</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="p-8 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-3xl transition group"
                  >
                    <div className="flex items-start gap-5">
                      <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition shadow-lg`}>
                        {tool.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{tool.name}</h3>
                        <p className="text-slate-400 mb-3">{tool.desc}</p>
                        <span className="inline-block px-3 py-1 bg-white/10 text-slate-300 rounded-full text-xs">
                          {tool.forScreen}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Info */}
              <div className="mt-10 p-6 bg-slate-800/50 rounded-xl border border-white/5">
                <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                  {Icons.lightbulb}
                  Configuration des écrans
                </h4>
                <ul className="text-slate-400 text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    <span><strong className="text-slate-300">Borne Ticket</strong> : Tablette ou borne tactile à l'entrée de l'agence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    <span><strong className="text-slate-300">Moniteur File</strong> : Grand écran TV visible par les clients en attente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    <span><strong className="text-slate-300">Guichet Agent</strong> : PC de l'agent pour appeler les clients</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400">•</span>
                    <span><strong className="text-slate-300">RDV sur Place</strong> : Tablette ou PC pour prise de rendez-vous</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center text-slate-500 text-sm">
          © 2026 Mwolo Energy Systems — Outils de gestion agence
        </div>
      </footer>
    </div>
  );
}
