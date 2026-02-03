'use client';

import { useState, useEffect } from 'react';
import { getAgencyId, createQueueTicket, QueueTicket } from '@/lib/api';
import BackButton from '@/components/BackButton';

// ==================== ICÔNES SVG PROFESSIONNELLES ====================
const ServiceIcons = {
  payment: (
    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  subscription: (
    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  complaint: (
    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  technical: (
    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  other: (
    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
};

interface Service {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const SERVICES: Service[] = [
  { id: 'payment', name: 'Paiement de facture', icon: ServiceIcons.payment, color: 'from-green-500 to-emerald-600' },
  { id: 'subscription', name: 'Nouvel abonnement', icon: ServiceIcons.subscription, color: 'from-blue-500 to-indigo-600' },
  { id: 'complaint', name: 'Réclamation', icon: ServiceIcons.complaint, color: 'from-amber-500 to-orange-600' },
  { id: 'info', name: 'Renseignements', icon: ServiceIcons.info, color: 'from-cyan-500 to-blue-600' },
  { id: 'technical', name: 'Service technique', icon: ServiceIcons.technical, color: 'from-purple-500 to-pink-600' },
  { id: 'other', name: 'Autre demande', icon: ServiceIcons.other, color: 'from-slate-500 to-slate-700' },
];

type ViewMode = 'home' | 'ticket' | 'rdv' | 'success';

export default function KioskPage() {
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [ticketPrinted, setTicketPrinted] = useState<QueueTicket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pour le RDV
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [rdvConfirmation, setRdvConfirmation] = useState<string | null>(null);

  useEffect(() => {
    const id = getAgencyId();
    if (!id) {
      window.location.href = '/';
      return;
    }
    setAgencyId(id);

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Générer les créneaux horaires disponibles
  const getAvailableSlots = () => {
    const slots: string[] = [];
    for (let h = 8; h < 12; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`);
      slots.push(`${h.toString().padStart(2, '0')}:30`);
    }
    for (let h = 14; h < 17; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00`);
      slots.push(`${h.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  // Générer les prochains jours disponibles
  const getAvailableDates = () => {
    const dates: { value: string; label: string }[] = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() !== 0) { // Pas le dimanche
        dates.push({
          value: d.toISOString().split('T')[0],
          label: d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
        });
      }
    }
    return dates;
  };

  const handleSelectService = async (serviceId: string) => {
    if (!agencyId) return;
    
    setLoading(true);
    setError('');
    
    const result = await createQueueTicket({
      agency: agencyId,
      service_type: serviceId,
    });

    setLoading(false);

    if (result.error) {
      setError('Erreur lors de la création du ticket. Veuillez réessayer.');
      return;
    }

    if (result.data) {
      setTicketPrinted(result.data);
      setViewMode('success');
      setTimeout(() => {
        setTicketPrinted(null);
        setViewMode('home');
      }, 15000);
    }
  };

  const handleCreateRdv = async () => {
    if (!agencyId || !selectedService || !selectedDate || !selectedTime || !clientName) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError('');

    // Simuler la création de RDV (en attendant l'API)
    // TODO: Appeler l'API de création de RDV quand elle sera disponible
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Générer un code de confirmation
    const confirmCode = `RDV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setRdvConfirmation(confirmCode);
    setLoading(false);
    setViewMode('success');

    setTimeout(() => {
      resetRdvForm();
      setViewMode('home');
    }, 20000);
  };

  const resetRdvForm = () => {
    setSelectedService(null);
    setSelectedDate('');
    setSelectedTime('');
    setClientName('');
    setClientPhone('');
    setRdvConfirmation(null);
  };

  // ==================== ÉCRAN D'ACCUEIL ====================
  if (viewMode === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 flex flex-col">
        <header className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <BackButton />
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-white">Mwolo Energy Systems</h1>
                <p className="text-cyan-400">Bienvenue</p>
              </div>
            </div>
            <p className="text-4xl font-light text-white">
              {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-3xl text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Comment pouvons-nous vous aider ?
            </h2>
            <p className="text-cyan-300 text-xl mb-12">
              Choisissez une option
            </p>

            <div className="grid grid-cols-2 gap-8">
              {/* Option 1: Ticket immédiat */}
              <button
                onClick={() => setViewMode('ticket')}
                className="group p-8 bg-gradient-to-br from-green-500/20 to-emerald-600/20 hover:from-green-500/30 hover:to-emerald-600/30 border-2 border-green-500/30 hover:border-green-400 rounded-3xl transition-all transform hover:scale-105"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-green-500/25 transition-all">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Prendre un ticket</h3>
                <p className="text-green-300">Être servi aujourd'hui</p>
                <p className="text-slate-400 text-sm mt-2">Service immédiat</p>
              </button>

              {/* Option 2: Prendre RDV */}
              <button
                onClick={() => setViewMode('rdv')}
                className="group p-8 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 hover:from-blue-500/30 hover:to-indigo-600/30 border-2 border-blue-500/30 hover:border-blue-400 rounded-3xl transition-all transform hover:scale-105"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-all">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Prendre rendez-vous</h3>
                <p className="text-blue-300">Planifier une visite</p>
                <p className="text-slate-400 text-sm mt-2">Choisissez votre créneau</p>
              </button>
            </div>
          </div>
        </main>

        <footer className="p-4 bg-slate-900/50 border-t border-white/10">
          <p className="text-center text-slate-400">
            💡 Besoin d'aide ? Adressez-vous à l'accueil
          </p>
        </footer>
      </div>
    );
  }

  // ==================== ÉCRAN TICKET IMMÉDIAT ====================
  if (viewMode === 'ticket') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 flex flex-col">
        <header className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setViewMode('home')}
              className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Retour</span>
            </button>
            <h1 className="text-2xl font-bold text-white">Prendre un ticket</h1>
            <p className="text-2xl font-light text-white">
              {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-4xl">
            <h2 className="text-3xl font-bold text-white text-center mb-2">
              Sélectionnez le motif de votre visite
            </h2>
            <p className="text-cyan-300 text-center text-xl mb-10">
              Un ticket vous sera délivré
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-3 gap-6">
              {SERVICES.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleSelectService(service.id)}
                  disabled={loading}
                  className={`group relative p-6 rounded-2xl border-2 transition-all transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br ${service.color} border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl`}
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition">
                      {service.icon}
                    </div>
                    <span className="text-white font-semibold text-lg text-center">{service.name}</span>
                  </div>
                </button>
              ))}
            </div>

            {loading && (
              <div className="mt-8 text-center">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white">Création de votre ticket...</p>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ==================== ÉCRAN PRISE DE RDV ====================
  if (viewMode === 'rdv') {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col overflow-hidden">
        {/* Header fixe */}
        <header className="flex-shrink-0 p-6 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button 
              onClick={() => { resetRdvForm(); setViewMode('home'); }}
              className="flex items-center gap-3 text-white/70 hover:text-white transition-colors text-lg"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Retour</span>
            </button>
            <h1 className="text-2xl font-bold text-white">📅 Prendre rendez-vous</h1>
            <p className="text-2xl font-light text-white">
              {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </header>

        {/* Zone scrollable centrale */}
        <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'auto', scrollbarColor: '#3b82f6 #1e293b' }}>
          <style jsx>{`
            main::-webkit-scrollbar {
              width: 16px;
            }
            main::-webkit-scrollbar-track {
              background: #1e293b;
            }
            main::-webkit-scrollbar-thumb {
              background: linear-gradient(180deg, #3b82f6 0%, #6366f1 100%);
              border-radius: 8px;
              border: 3px solid #1e293b;
            }
            main::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(180deg, #60a5fa 0%, #818cf8 100%);
            }
          `}</style>
          
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-300 text-center text-lg">
                {error}
              </div>
            )}

            {/* Étape 1: Type de service */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-lg font-bold">1</span>
                Choisissez le type de service
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {SERVICES.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      selectedService === service.id
                        ? 'bg-blue-500/30 border-blue-400 scale-105'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mx-auto mb-2`}>
                      <div className="scale-50">{service.icon}</div>
                    </div>
                    <span className="text-white text-base font-medium">{service.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Étape 2: Date */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-lg font-bold">2</span>
                Choisissez une date
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {getAvailableDates().slice(0, 8).map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setSelectedDate(d.value)}
                    className={`p-4 rounded-xl text-base font-medium transition-all ${
                      selectedDate === d.value
                        ? 'bg-blue-500 text-white scale-105'
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Étape 3: Heure */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-lg font-bold">3</span>
                Choisissez une heure
              </h3>
              <div className="grid grid-cols-6 gap-3">
                {getAvailableSlots().map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`p-3 rounded-xl text-lg font-medium transition-all ${
                      selectedTime === slot
                        ? 'bg-blue-500 text-white scale-105'
                        : 'bg-white/5 text-white hover:bg-white/10'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Étape 4: Informations */}
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-lg font-bold">4</span>
                Vos informations
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-base text-slate-300 mb-2">Votre nom *</label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Entrez votre nom complet"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white text-lg placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-base text-slate-300 mb-2">Téléphone (facultatif)</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+243 ..."
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white text-lg placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Récapitulatif */}
            {selectedService && selectedDate && selectedTime && (
              <div className="bg-green-500/20 border-2 border-green-400/50 rounded-2xl p-5">
                <p className="text-green-100 text-xl font-semibold text-center">
                  ✓ {SERVICES.find(s => s.id === selectedService)?.name} — {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {selectedTime}
                </p>
              </div>
            )}

            {/* Espace pour le bouton fixe */}
            <div className="h-4"></div>
          </div>
        </main>

        {/* Bouton de confirmation FIXE en bas */}
        <div className="flex-shrink-0 p-6 bg-slate-900/95 border-t-2 border-blue-500/30 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleCreateRdv}
              disabled={loading || !selectedService || !selectedDate || !selectedTime || !clientName}
              className="w-full py-5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-white font-bold text-2xl transition-all shadow-xl shadow-blue-500/30"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Réservation en cours...
                </span>
              ) : (
                '✓ CONFIRMER LE RENDEZ-VOUS'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fonction pour traduire le service_type en français
  const getServiceNameFr = (serviceType: string): string => {
    if (!serviceType) return 'Service';
    
    // Normaliser en minuscules pour la recherche
    const normalizedType = serviceType.toLowerCase().trim();
    
    const serviceMap: Record<string, string> = {
      'payment': 'Paiement de facture',
      'subscription': 'Nouvel abonnement',
      'complaint': 'Réclamation',
      'info': 'Renseignements',
      'information': 'Renseignements',
      'technical': 'Service technique',
      'other': 'Autre demande',
      // Noms complets en anglais
      'bill payment': 'Paiement de facture',
      'new subscription': 'Nouvel abonnement',
      'technical service': 'Service technique',
      'other request': 'Autre demande',
    };
    
    // Chercher d'abord dans la map normalisée
    if (serviceMap[normalizedType]) {
      return serviceMap[normalizedType];
    }
    
    // Chercher dans SERVICES par id
    const found = SERVICES.find(s => s.id.toLowerCase() === normalizedType);
    if (found) return found.name;
    
    // Sinon retourner le type original
    return serviceType;
  };

  // ==================== ÉCRAN DE SUCCÈS ====================
  if (viewMode === 'success') {
    // Succès ticket
    if (ticketPrinted) {
      const serviceName = getServiceNameFr(
        ticketPrinted.service_name || 
        (ticketPrinted as any).service_type || 
        'Service'
      );
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-600 to-emerald-700 flex items-center justify-center p-8">
          <div className="text-center text-white">
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <p className="text-2xl mb-4 opacity-80">Votre numéro</p>
            
            <div className="text-9xl font-bold mb-8">
              {ticketPrinted.ticket_number || 'N/A'}
            </div>
            
            <p className="text-xl mb-2">{serviceName}</p>
            <p className="text-lg opacity-70">
              Veuillez patienter et surveiller l'écran d'appel
            </p>

            <div className="mt-12 p-6 bg-white/20 rounded-2xl inline-block">
              <p className="text-sm opacity-70">Position dans la file</p>
              <p className="text-4xl font-bold">{(ticketPrinted as any).queue_position || 1}</p>
            </div>

            <button
              onClick={() => { setTicketPrinted(null); setViewMode('home'); }}
              className="mt-12 px-8 py-4 bg-white/20 hover:bg-white/30 rounded-xl text-lg font-medium transition block mx-auto"
            >
              Nouveau ticket
            </button>
          </div>
        </div>
      );
    }

    // Succès RDV
    if (rdvConfirmation) {
      const service = SERVICES.find(s => s.id === selectedService);
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center p-8">
          <div className="text-center text-white max-w-lg">
            <div className="mb-8">
              <svg className="w-24 h-24 mx-auto text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <p className="text-2xl mb-4 opacity-80">Rendez-vous confirmé !</p>
            
            <div className="bg-white/20 rounded-2xl p-6 mb-8">
              <p className="text-sm opacity-70 mb-2">Code de confirmation</p>
              <p className="text-4xl font-bold tracking-wider">{rdvConfirmation}</p>
            </div>

            <div className="bg-white/10 rounded-xl p-4 mb-8 text-left space-y-2">
              <p><span className="opacity-70">📅 Date:</span> {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
              <p><span className="opacity-70">🕐 Heure:</span> {selectedTime}</p>
              <p><span className="opacity-70">📋 Service:</span> {service?.name}</p>
              <p><span className="opacity-70">👤 Nom:</span> {clientName}</p>
            </div>
            
            <p className="text-lg opacity-80 mb-8">
              📱 Présentez ce code à votre arrivée ou notez-le
            </p>

            <button
              onClick={() => { resetRdvForm(); setViewMode('home'); }}
              className="px-8 py-4 bg-white/20 hover:bg-white/30 rounded-xl text-lg font-medium transition"
            >
              Terminé
            </button>
          </div>
        </div>
      );
    }
  }

  return null;
}
