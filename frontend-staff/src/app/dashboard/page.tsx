'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAccessToken, getCurrentUser, clearTokens, UserData } from '@/lib/api';

export default function StaffDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push('/');
      return;
    }

    const userData = getCurrentUser();
    if (!userData || userData.role === 'client') {
      clearTokens();
      router.push('/');
      return;
    }

    setUser(userData);
    setLoading(false);

    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [router]);

  const handleLogout = () => {
    clearTokens();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement...</p>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === 'super_admin';

  // Sections du portail
  const personalSection = [
    { href: '/profile', icon: '👤', name: 'Mon Profil', desc: 'Informations personnelles', color: 'from-cyan-500 to-blue-600' },
    { href: '/schedule', icon: '📅', name: 'Mes Horaires', desc: 'Planning & congés', color: 'from-green-500 to-emerald-600' },
    { href: '/payslips', icon: '💰', name: 'Fiches de Paie', desc: 'Bulletins de salaire', color: 'from-amber-500 to-orange-600' },
    { href: '/badge', icon: '🎫', name: 'Mon Badge', desc: 'QR Code & accès', color: 'from-purple-500 to-pink-600' },
  ];

  const attendanceSection = [
    { href: '/clock-in', icon: '⏰', name: 'Pointage', desc: 'Entrée / Sortie', color: 'from-green-500 to-teal-600', large: true },
    { href: '/attendance', icon: '📊', name: 'Historique', desc: 'Mes présences', color: 'from-slate-500 to-slate-700' },
  ];

  const agencyTools = [
    { href: '/counter', icon: '🖥️', name: 'Mon Guichet', desc: 'Interface agent de guichet', color: 'from-indigo-500 to-purple-600' },
    { href: '/walk-in', icon: '📆', name: 'RDV sur Place', desc: 'Prise de rendez-vous client', color: 'from-green-500 to-teal-600' },
  ];

  const adminSection = [
    { href: '/clients', icon: '👥', name: 'Clients', desc: 'Gestion CRM', color: 'from-blue-500 to-indigo-600' },
    { href: '/invoices', icon: '📄', name: 'Factures', desc: 'Gestion facturation', color: 'from-emerald-500 to-green-600' },
    { href: '/payments', icon: '💳', name: 'Paiements', desc: 'Encaissements', color: 'from-amber-500 to-orange-600' },
    { href: '/appointments', icon: '📅', name: 'RDV', desc: 'Rendez-vous', color: 'from-cyan-500 to-blue-600' },
    { href: '/support', icon: '🎫', name: 'Support', desc: 'Tickets clients', color: 'from-pink-500 to-rose-600' },
    { href: '/employees', icon: '👔', name: 'Employés', desc: 'Gestion RH', color: 'from-teal-500 to-green-600' },
    { href: '/agencies', icon: '🏢', name: 'Agences', desc: 'Réseau agences', color: 'from-purple-500 to-indigo-600' },
    { href: '/reports', icon: '📊', name: 'Rapports', desc: 'Statistiques', color: 'from-red-500 to-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-white">Portail Employé</h1>
                <p className="text-xs text-slate-400">{currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-white font-medium">{user?.first_name} {user?.last_name}</p>
                <p className="text-xs text-indigo-400">{isAdmin ? 'Administrateur' : 'Employé'}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.first_name?.charAt(0)}
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-lg transition text-slate-400 hover:text-white"
                title="Déconnexion"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Bonjour, {user?.first_name} 👋
          </h2>
          <p className="text-slate-400">Bienvenue sur votre espace personnel</p>
        </div>

        {/* Espace Personnel */}
        <section className="mb-10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-sm">👤</span>
            Espace Personnel
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {personalSection.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition`}>
                  {item.icon}
                </div>
                <p className="text-white font-medium">{item.name}</p>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Pointage */}
        <section className="mb-10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-sm">⏰</span>
            Pointage & Présence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attendanceSection.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition group ${item.large ? 'md:col-span-1' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-white font-medium text-lg">{item.name}</p>
                    <p className="text-slate-500">{item.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Outils Agence */}
        <section className="mb-10">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-sm">🏢</span>
            Outils Agence
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agencyTools.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-white font-medium text-lg">{item.name}</p>
                    <p className="text-slate-500">{item.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <p className="text-slate-500 text-sm mt-3">
            💡 Les outils de borne et moniteur sont accessibles sur l'application <a href="http://localhost:3002" className="text-cyan-400 hover:underline">Agence</a>
          </p>
        </section>

        {/* Admin Section */}
        {isAdmin && (
          <section className="mb-10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-8 h-8 bg-gradient-to-br from-amber-500 to-red-600 rounded-lg flex items-center justify-center text-sm">⚙️</span>
              Administration
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {adminSection.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition group"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition`}>
                    {item.icon}
                  </div>
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </Link>
              ))}
            </div>
            <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <p className="text-amber-400 text-sm">
                🔐 Accès Django Admin : <a href="http://localhost:8000/admin/" target="_blank" className="underline hover:text-amber-300">localhost:8000/admin/</a>
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
