'use client';

import { useState, useEffect, useCallback } from 'react';

interface BadgeActivationProps {
  onActivated: () => void;
  title?: string;
  subtitle?: string;
  validBadges?: string[];
  validPins?: string[];
  storageKey?: string;
  showBackButton?: boolean;
  backButtonTaps?: number;
  onBackRequested?: () => void;
}

export function BadgeActivation({
  onActivated,
  title = "Activation requise",
  subtitle = "Veuillez scanner votre badge ou entrer votre code personnel",
  validBadges = [],
  validPins = ['1234', '0000', 'admin'],
  storageKey = 'badge_activated',
  showBackButton = true,
  backButtonTaps = 5,
  onBackRequested,
}: BadgeActivationProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [lastTap, setLastTap] = useState(0);

  // Vérifier si déjà activé
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const activated = sessionStorage.getItem(storageKey);
      if (activated === 'true') {
        onActivated();
      }
    }
  }, [storageKey, onActivated]);

  // Timer de verrouillage
  useEffect(() => {
    if (locked && lockTimer > 0) {
      const timer = setTimeout(() => setLockTimer(lockTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (locked && lockTimer === 0) {
      setLocked(false);
      setAttempts(0);
    }
  }, [locked, lockTimer]);

  // Bouton retour caché - tapotements multiples
  const handleHiddenTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTap < 500) {
      const newCount = tapCount + 1;
      setTapCount(newCount);
      if (newCount >= backButtonTaps) {
        setTapCount(0);
        onBackRequested?.();
      }
    } else {
      setTapCount(1);
    }
    setLastTap(now);
  }, [tapCount, lastTap, backButtonTaps, onBackRequested]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (locked) return;
    
    // Vérifier le PIN
    if (validPins.includes(pin) || validBadges.includes(pin)) {
      sessionStorage.setItem(storageKey, 'true');
      onActivated();
    } else {
      setError('Code invalide');
      setPin('');
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setLocked(true);
        setLockTimer(30);
        setError('Trop de tentatives. Veuillez patienter 30 secondes.');
      }
    }
  };

  const handleKeyPress = (key: string) => {
    if (locked) return;
    
    if (key === 'clear') {
      setPin('');
      setError('');
    } else if (key === 'back') {
      setPin(pin.slice(0, -1));
      setError('');
    } else if (pin.length < 10) {
      setPin(pin + key);
      setError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      {/* Zone de tap caché pour retour admin */}
      {showBackButton && (
        <div 
          className="fixed top-0 left-0 w-16 h-16 cursor-default"
          onClick={handleHiddenTap}
        />
      )}

      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/30">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Mwolo Energy Systems</h1>
          <p className="text-slate-400">{subtitle}</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur rounded-3xl border border-slate-700 p-8">
          <h2 className="text-xl font-bold text-white text-center mb-6">
            {title}
          </h2>

          {/* Badge Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-12 h-12 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
              </svg>
            </div>
          </div>

          {/* PIN Display */}
          <div className="mb-6">
            <div className="bg-slate-900 rounded-xl p-4 text-center">
              <div className="flex justify-center gap-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full transition-all ${
                      i < pin.length ? 'bg-cyan-500 scale-110' : 'bg-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-center text-sm">
              {error}
              {locked && (
                <span className="block mt-1 text-red-300">
                  Déverrouillage dans {lockTimer}s
                </span>
              )}
            </div>
          )}

          {/* Keypad */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleKeyPress(key)}
                  disabled={locked}
                  className={`p-5 rounded-xl font-bold text-xl transition-all ${
                    locked
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : key === 'clear' || key === 'back'
                      ? 'bg-slate-600 text-white hover:bg-slate-500 active:scale-95'
                      : 'bg-slate-700 text-white hover:bg-slate-600 active:scale-95'
                  }`}
                >
                  {key === 'clear' ? (
                    <span className="text-sm">CLR</span>
                  ) : key === 'back' ? (
                    <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                    </svg>
                  ) : (
                    key
                  )}
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={locked || pin.length === 0}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-xl transition-all hover:shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {locked ? `Verrouillé (${lockTimer}s)` : 'Valider'}
            </button>
          </form>

          {/* Instructions */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-sm text-slate-500 text-center">
              Approchez votre badge du lecteur ou entrez votre code personnel
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-sm mt-6">
          © {new Date().getFullYear()} Mwolo Energy Systems
        </p>
      </div>
    </div>
  );
}

// HOC pour protéger une page avec activation par badge
export function withBadgeProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: Partial<BadgeActivationProps>
) {
  return function ProtectedPage(props: P) {
    const [isActivated, setIsActivated] = useState(false);

    if (!isActivated) {
      return (
        <BadgeActivation
          {...options}
          onActivated={() => setIsActivated(true)}
        />
      );
    }

    return <WrappedComponent {...props} />;
  };
}
