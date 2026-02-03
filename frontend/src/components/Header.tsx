'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { clearTokens, getAccessToken, apiCall } from '@/lib/api';
import { User, getDashboardUrl, ROLE_LABELS, ROLE_COLORS, UserRole } from '@/lib/auth';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Vérifier l'authentification
    const checkAuth = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          const response = await apiCall<User>('/auth/me/');
          if (response.data) {
            setUser(response.data);
          }
        } catch (error) {
          console.error('Erreur auth:', error);
        }
      }
      setLoading(false);
    };

    checkAuth();

    // Effet de scroll
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    clearTokens();
    setUser(null);
    window.location.href = '/';
  };

  const getDashboard = () => {
    if (user?.role) {
      return getDashboardUrl(user.role as UserRole);
    }
    return '/dashboard';
  };

  const navLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/about', label: 'À propos' },
    { href: '/services', label: 'Services' },
    { href: '/agencies', label: 'Agences' },
    { href: '/appointments', label: 'Rendez-vous' },
    { href: '/team', label: 'Équipe' },
    { href: '/careers', label: 'Carrières' },
    { href: '/news', label: 'Actualités' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-white shadow-md'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-lg">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl text-slate-900 block leading-tight">Mwolo Energy</span>
                <span className="text-xs text-slate-500">Solutions énergétiques</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-slate-600 hover:text-cyan-600 transition font-medium rounded-lg hover:bg-cyan-50"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Section - Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {user.first_name?.charAt(0) || 'U'}
                    </div>
                    <div className="text-left hidden xl:block">
                      <p className="font-semibold text-slate-900 text-sm leading-tight">
                        {user.first_name} {user.last_name?.charAt(0)}.
                      </p>
                      <p className={`text-xs ${ROLE_COLORS[user.role as UserRole]?.text || 'text-slate-500'}`}>
                        {ROLE_LABELS[user.role as UserRole] || user.role}
                      </p>
                    </div>
                    <svg className={`w-5 h-5 text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="font-semibold text-slate-900">{user.first_name} {user.last_name}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                        <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[user.role as UserRole]?.bg || 'bg-slate-100'} ${ROLE_COLORS[user.role as UserRole]?.text || 'text-slate-700'}`}>
                          {ROLE_LABELS[user.role as UserRole] || user.role}
                        </span>
                      </div>
                      
                      <Link
                        href={getDashboard()}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition"
                      >
                        <span className="text-lg">📊</span>
                        <span className="font-medium text-slate-700">Mon tableau de bord</span>
                      </Link>
                      
                      <div className="border-t border-slate-100 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-50 transition text-red-600"
                        >
                          <span className="text-lg">🚪</span>
                          <span className="font-medium">Déconnexion</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-5 py-2.5 text-cyan-600 font-semibold hover:bg-cyan-50 rounded-xl transition"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-cyan-500/30 transition transform hover:-translate-y-0.5"
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-slate-700 transition-all origin-left ${isOpen ? 'rotate-45 translate-x-px' : ''}`}></span>
                <span className={`w-full h-0.5 bg-slate-700 transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-full h-0.5 bg-slate-700 transition-all origin-left ${isOpen ? '-rotate-45 translate-x-px' : ''}`}></span>
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
          <div className="bg-white border-t border-slate-100 px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-slate-700 hover:bg-cyan-50 hover:text-cyan-600 rounded-xl font-medium transition"
              >
                {link.label}
              </Link>
            ))}
            
            <div className="border-t border-slate-100 pt-4 mt-4 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                      {user.first_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{user.first_name} {user.last_name}</p>
                      <p className={`text-sm ${ROLE_COLORS[user.role as UserRole]?.text || 'text-slate-500'}`}>
                        {ROLE_LABELS[user.role as UserRole] || user.role}
                      </p>
                    </div>
                  </div>
                  <Link
                    href={getDashboard()}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-cyan-600 bg-cyan-50 rounded-xl font-semibold text-center"
                  >
                    📊 Mon tableau de bord
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-red-600 bg-red-50 rounded-xl font-semibold"
                  >
                    🚪 Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-cyan-600 border-2 border-cyan-600 rounded-xl font-semibold text-center"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold text-center"
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer pour compenser le header fixe */}
      <div className="h-20"></div>

      {/* Overlay pour fermer le menu user */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </>
  );
}
