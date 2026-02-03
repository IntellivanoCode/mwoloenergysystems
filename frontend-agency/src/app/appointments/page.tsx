'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';
import AuthGuard from '@/components/AuthGuard';
import { getAgencyId, getTodayAppointments, getAvailableSlots, createWalkInAppointment, checkInAppointment } from '@/lib/api';

interface Appointment {
  id: string;
  client_name: string;
  client_phone?: string;
  service_type: string;
  date: string;
  time_slot: string;
  status: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const SERVICE_TYPES = [
  { id: 'paiement', name: 'Paiement de facture', icon: '💳' },
  { id: 'abonnement', name: 'Nouvel abonnement', icon: '📝' },
  { id: 'modification', name: 'Modification contrat', icon: '✏️' },
  { id: 'reclamation', name: 'Réclamation', icon: '⚠️' },
  { id: 'information', name: 'Renseignements', icon: 'ℹ️' },
  { id: 'autre', name: 'Autre', icon: '📋' },
];

function AppointmentsContent() {
  const router = useRouter();
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'today' | 'checkin' | 'create'>('today');
  
  // Liste des RDV
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Check-in par code
  const [rdvCode, setRdvCode] = useState('');
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [foundAppointment, setFoundAppointment] = useState<Appointment | null>(null);
  
  // Création de RDV
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    client_name: '',
    client_phone: '',
    service_type: '',
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const id = getAgencyId();
    if (!id) {
      router.push('/');
      return;
    }
    setAgencyId(id);

    // Update time
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [router]);

  useEffect(() => {
    if (agencyId) {
      loadTodayAppointments();
    }
  }, [agencyId]);

  useEffect(() => {
    if (agencyId && selectedDate) {
      loadAvailableSlots();
    }
  }, [agencyId, selectedDate]);

  const loadTodayAppointments = async () => {
    if (!agencyId) return;
    setLoading(true);
    
    const result = await getTodayAppointments(agencyId);
    if (result.data) {
      // Handle paginated or direct array
      const data = Array.isArray(result.data) ? result.data : (result.data as any).results || [];
      setAppointments(data);
    }
    setLoading(false);
  };

  const loadAvailableSlots = async () => {
    if (!agencyId) return;
    
    const result = await getAvailableSlots(agencyId, selectedDate);
    if (result.data) {
      // Génerer des créneaux par défaut si l'API ne retourne rien
      const slots = Array.isArray(result.data) ? result.data : [];
      if (slots.length === 0) {
        // Créneaux par défaut: 8h-12h et 14h-17h
        const defaultSlots: TimeSlot[] = [];
        for (let h = 8; h < 12; h++) {
          defaultSlots.push({ time: `${h.toString().padStart(2, '0')}:00`, available: true });
          defaultSlots.push({ time: `${h.toString().padStart(2, '0')}:30`, available: true });
        }
        for (let h = 14; h < 17; h++) {
          defaultSlots.push({ time: `${h.toString().padStart(2, '0')}:00`, available: true });
          defaultSlots.push({ time: `${h.toString().padStart(2, '0')}:30`, available: true });
        }
        setAvailableSlots(defaultSlots);
      } else {
        setAvailableSlots(slots);
      }
    }
  };

  const handleCheckIn = async (appointmentId: string) => {
    const result = await checkInAppointment(appointmentId);
    if (result.data) {
      setSuccess('Client enregistré - Ticket créé !');
      loadTodayAppointments();
      setFoundAppointment(null);
      setRdvCode('');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.message || 'Erreur lors de l\'enregistrement');
    }
  };

  // Recherche par code RDV
  const handleSearchByCode = async () => {
    if (!rdvCode.trim()) {
      setError('Veuillez entrer un code RDV');
      return;
    }
    
    setCheckInLoading(true);
    setError('');
    setFoundAppointment(null);
    
    // Simuler la recherche (TODO: implémenter l'API)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Pour la démo, simuler un RDV trouvé si le code commence par "RDV-"
    if (rdvCode.toUpperCase().startsWith('RDV-')) {
      setFoundAppointment({
        id: rdvCode,
        client_name: 'Client Demo',
        service_type: 'paiement',
        date: new Date().toISOString().split('T')[0],
        time_slot: '10:00',
        status: 'confirmed'
      });
    } else {
      setError('Code RDV non trouvé. Vérifiez le code et réessayez.');
    }
    
    setCheckInLoading(false);
  };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyId || !selectedSlot || !formData.client_name || !formData.service_type) {
      setError('Veuillez remplir tous les champs requis');
      return;
    }

    setCreateLoading(true);
    setError('');

    const result = await createWalkInAppointment({
      agency: agencyId,
      service_type: formData.service_type,
      client_name: formData.client_name,
      client_phone: formData.client_phone,
      date: selectedDate,
      time_slot: selectedSlot,
    });

    setCreateLoading(false);

    if (result.data) {
      setSuccess('Rendez-vous créé avec succès !');
      setFormData({ client_name: '', client_phone: '', service_type: '' });
      setSelectedSlot(null);
      loadTodayAppointments();
      loadAvailableSlots();
      setActiveTab('today');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.message || 'Erreur lors de la création');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BackButton />
            <div>
              <h1 className="text-2xl font-bold text-white">Rendez-vous</h1>
              <p className="text-slate-400">Gestion des rendez-vous client</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-light text-white">
              {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-slate-400">
              {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </header>

      {/* Success/Error Messages */}
      {success && (
        <div className="mx-6 mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
          ❌ {error}
        </div>
      )}

      {/* Tabs */}
      <div className="px-6 mt-6">
        <div className="flex gap-2 bg-white/5 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
              activeTab === 'today' 
                ? 'bg-cyan-500 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📋 RDV du jour ({appointments.length})
          </button>
          <button
            onClick={() => setActiveTab('checkin')}
            className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
              activeTab === 'checkin' 
                ? 'bg-green-500 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ✅ Check-in par code
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
              activeTab === 'create' 
                ? 'bg-cyan-500 text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ➕ Nouveau RDV
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="p-6">
        {/* Onglet Check-in par code */}
        {activeTab === 'checkin' && (
          <div className="max-w-md mx-auto">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Check-in client</h2>
                <p className="text-slate-400 text-sm mt-1">
                  Entrez le code RDV que le client a reçu à la borne
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Code RDV</label>
                  <input
                    type="text"
                    value={rdvCode}
                    onChange={(e) => setRdvCode(e.target.value.toUpperCase())}
                    placeholder="RDV-XXXXXX"
                    className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white text-center text-2xl font-mono tracking-widest placeholder-slate-500 focus:border-green-500 focus:outline-none"
                    maxLength={12}
                  />
                </div>
                
                <button
                  onClick={handleSearchByCode}
                  disabled={checkInLoading || !rdvCode.trim()}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all"
                >
                  {checkInLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Recherche...
                    </span>
                  ) : (
                    '🔍 Rechercher le RDV'
                  )}
                </button>
              </div>
              
              {/* RDV trouvé */}
              {foundAppointment && (
                <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <p className="text-green-400 font-medium mb-3">✅ Rendez-vous trouvé !</p>
                  <div className="space-y-2 text-sm">
                    <p className="text-white"><span className="text-slate-400">Client:</span> {foundAppointment.client_name}</p>
                    <p className="text-white"><span className="text-slate-400">Service:</span> {SERVICE_TYPES.find(s => s.id === foundAppointment.service_type)?.name}</p>
                    <p className="text-white"><span className="text-slate-400">Heure prévue:</span> {foundAppointment.time_slot}</p>
                  </div>
                  <button
                    onClick={() => handleCheckIn(foundAppointment.id)}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-xl text-white font-semibold transition-all"
                  >
                    🎫 Créer le ticket prioritaire
                  </button>
                </div>
              )}
              
              <div className="mt-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p className="text-blue-300 text-xs text-center">
                  💡 Le client reçoit un ticket prioritaire et passe devant la file normale
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Onglet RDV du jour */}
        {activeTab === 'today' && (
          // Liste des RDV du jour
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400">Chargement...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-slate-400 text-lg">Aucun rendez-vous aujourd'hui</p>
                <p className="text-slate-500 mt-1">Créez un nouveau RDV pour un client</p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-4 flex items-center justify-between hover:bg-white/5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
                        <span className="text-xl">
                          {SERVICE_TYPES.find(s => s.id === apt.service_type)?.icon || '📋'}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{apt.client_name}</p>
                        <p className="text-slate-400 text-sm">
                          {apt.time_slot} - {SERVICE_TYPES.find(s => s.id === apt.service_type)?.name || apt.service_type}
                        </p>
                        {apt.client_phone && (
                          <p className="text-slate-500 text-xs">📞 {apt.client_phone}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        apt.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                        apt.status === 'checked_in' ? 'bg-blue-500/20 text-blue-400' :
                        apt.status === 'completed' ? 'bg-slate-500/20 text-slate-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {apt.status === 'confirmed' ? 'Confirmé' :
                         apt.status === 'checked_in' ? 'Enregistré' :
                         apt.status === 'completed' ? 'Terminé' : 'En attente'}
                      </span>
                      {apt.status === 'confirmed' && (
                        <button
                          onClick={() => handleCheckIn(apt.id)}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl text-white font-medium transition-all"
                        >
                          Check-in
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Onglet Nouveau RDV */}
        {activeTab === 'create' && (
          // Formulaire de création
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleCreateAppointment} className="space-y-6">
              {/* Info client */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Information client</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Nom du client *</label>
                    <input
                      type="text"
                      value={formData.client_name}
                      onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                      placeholder="Nom complet"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Téléphone (optionnel)</label>
                    <input
                      type="tel"
                      value={formData.client_phone}
                      onChange={(e) => setFormData({...formData, client_phone: e.target.value})}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                      placeholder="+243 ..."
                    />
                  </div>
                </div>
              </div>

              {/* Type de service */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Type de service *</h3>
                <div className="grid grid-cols-2 gap-3">
                  {SERVICE_TYPES.map((service) => (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => setFormData({...formData, service_type: service.id})}
                      className={`p-4 rounded-xl border transition-all text-left ${
                        formData.service_type === service.id
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-white'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-2xl mr-2">{service.icon}</span>
                      <span className="text-sm">{service.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date et heure */}
              <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Date et heure *</h3>
                
                <div className="mb-4">
                  <label className="block text-sm text-slate-300 mb-2">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">Créneau horaire</label>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`p-2 rounded-lg text-sm font-medium transition-all ${
                          selectedSlot === slot.time
                            ? 'bg-cyan-500 text-white'
                            : slot.available
                              ? 'bg-white/5 text-white hover:bg-white/10'
                              : 'bg-white/5 text-slate-600 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={createLoading || !formData.client_name || !formData.service_type || !selectedSlot}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold text-lg transition-all"
              >
                {createLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Création...
                  </span>
                ) : (
                  'Créer le rendez-vous'
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <AuthGuard>
      <AppointmentsContent />
    </AuthGuard>
  );
}
