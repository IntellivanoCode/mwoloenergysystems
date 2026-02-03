'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { validateBadge, setEmployeeBadge, getAgencyId, setAgencyConfig } from '@/lib/api';

interface AuthGuardProps {
  children: React.ReactNode;
  requireCounter?: boolean;
}

export default function AuthGuard({ children, requireCounter = false }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authMethod, setAuthMethod] = useState<'badge' | 'code' | 'qr' | null>(null);
  
  // Form states
  const [badgeCode, setBadgeCode] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [error, setError] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  
  // Counter setup (pour guichet)
  const [counterName, setCounterName] = useState('');
  const [showCounterSetup, setShowCounterSetup] = useState(false);

  useEffect(() => {
    // Vérifier si l'agence est configurée
    const agencyId = getAgencyId();
    if (!agencyId) {
      router.push('/');
      return;
    }
    
    // Vérifier si déjà authentifié (badge stocké)
    const storedBadge = localStorage.getItem('mwolo_employee_badge');
    if (storedBadge) {
      // Valider le badge stocké
      validateStoredBadge(storedBadge);
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const validateStoredBadge = async (badge: string) => {
    const result = await validateBadge(badge);
    if (result.data?.valid) {
      setEmployeeName(result.data.employee_name);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  };

  const handleBadgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await validateBadge(badgeCode);
    
    if (result.error || !result.data?.valid) {
      setError('Badge invalide ou non reconnu');
      setIsLoading(false);
      return;
    }

    setEmployeeBadge(badgeCode);
    setEmployeeName(result.data.employee_name);
    
    if (requireCounter) {
      setShowCounterSetup(true);
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  };

  const handleEmployeeCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Valider le code employé (format: EMP-XXXX ou numéro matricule)
    const result = await validateBadge(employeeCode);
    
    if (result.error || !result.data?.valid) {
      setError('Code employé invalide');
      setIsLoading(false);
      return;
    }

    setEmployeeBadge(employeeCode);
    setEmployeeName(result.data.employee_name);
    
    if (requireCounter) {
      setShowCounterSetup(true);
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  };

  const handleCounterSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterName.trim()) return;
    
    const agencyId = getAgencyId();
    const counterId = `counter-${Date.now()}`;
    
    setAgencyConfig({
      agency_id: agencyId!,
      agency_name: '',
      agency_code: '',
      counter_id: counterId,
      counter_name: counterName,
    });
    
    setIsAuthenticated(true);
    setShowCounterSetup(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('mwolo_employee_badge');
    localStorage.removeItem('mwolo_counter_id');
    setIsAuthenticated(false);
    setEmployeeName('');
    setBadgeCode('');
    setEmployeeCode('');
  };

  // Scanner QR (simulé)
  const handleQRScan = useCallback(() => {
    // En production, utiliser une vraie lib de scan QR
    setError('Scanner QR non disponible - utilisez le badge ou le code employé');
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Vérification...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="relative">
        {/* Barre d'info employé */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-sm border-b border-white/10 px-4 py-2">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{employeeName}</p>
                <p className="text-slate-400 text-xs">Connecté</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
        <div className="pt-14">
          {children}
        </div>
      </div>
    );
  }

  // Setup du guichet
  if (showCounterSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Configuration du Guichet</h2>
              <p className="text-slate-400 mt-2">Bienvenue {employeeName}</p>
            </div>
            
            <form onSubmit={handleCounterSetup} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Nom du guichet</label>
                <input
                  type="text"
                  value={counterName}
                  onChange={(e) => setCounterName(e.target.value)}
                  placeholder="Ex: Guichet 1, Caisse A..."
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl text-white font-medium transition-all"
              >
                Commencer
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Page d'authentification
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Mwolo Energy Systems</h1>
          <p className="text-slate-400 mt-2">Authentification requise</p>
        </div>

        {/* Méthodes d'auth */}
        {!authMethod ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            <h2 className="text-xl font-semibold text-white text-center mb-6">Comment souhaitez-vous vous identifier ?</h2>
            
            <div className="space-y-3">
              <button
                onClick={() => setAuthMethod('badge')}
                className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Badge employé</p>
                  <p className="text-slate-400 text-sm">Scanner ou entrer votre code badge</p>
                </div>
              </button>

              <button
                onClick={() => setAuthMethod('code')}
                className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Numéro employé</p>
                  <p className="text-slate-400 text-sm">Entrer votre matricule ou code</p>
                </div>
              </button>

              <button
                onClick={() => setAuthMethod('qr')}
                className="w-full flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Scanner QR Code</p>
                  <p className="text-slate-400 text-sm">Scanner votre badge QR</p>
                </div>
              </button>
            </div>

            <button
              onClick={() => router.push('/')}
              className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 transition-all"
            >
              Retour à l'accueil
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
            {/* Badge Auth */}
            {authMethod === 'badge' && (
              <form onSubmit={handleBadgeSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Badge Employé</h2>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Code badge</label>
                  <input
                    type="text"
                    value={badgeCode}
                    onChange={(e) => setBadgeCode(e.target.value)}
                    placeholder="Scannez ou entrez le code"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:border-green-500 focus:outline-none text-center text-2xl tracking-widest"
                    autoFocus
                    required
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 rounded-xl text-white font-medium transition-all"
                >
                  {isLoading ? 'Vérification...' : 'Valider'}
                </button>
              </form>
            )}

            {/* Employee Code Auth */}
            {authMethod === 'code' && (
              <form onSubmit={handleEmployeeCodeSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Numéro Employé</h2>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Matricule ou code employé</label>
                  <input
                    type="text"
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    placeholder="EMP-0001 ou matricule"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none text-center text-lg"
                    autoFocus
                    required
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 rounded-xl text-white font-medium transition-all"
                >
                  {isLoading ? 'Vérification...' : 'Valider'}
                </button>
              </form>
            )}

            {/* QR Scanner */}
            {authMethod === 'qr' && (
              <div className="text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-4">Scanner QR Code</h2>
                
                <div className="w-48 h-48 bg-white/5 border-2 border-dashed border-white/20 rounded-2xl mx-auto flex items-center justify-center mb-4">
                  <p className="text-slate-500 text-sm">Zone de scan</p>
                </div>

                {error && (
                  <p className="text-red-400 text-sm mb-4">{error}</p>
                )}

                <button
                  onClick={handleQRScan}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-xl text-white font-medium transition-all"
                >
                  Scanner
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setAuthMethod(null);
                setError('');
              }}
              className="w-full mt-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              ← Choisir une autre méthode
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
