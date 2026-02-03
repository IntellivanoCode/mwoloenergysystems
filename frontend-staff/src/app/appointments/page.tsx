'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAccessToken, getCurrentUser, clearTokens, apiRequest } from '@/lib/api';

interface Appointment {
  id: string;
  reference?: string;
  client?: {
    user?: {
      first_name: string;
      last_name: string;
    };
    client_number: string;
  };
  agency?: {
    name: string;
  };
  service_type: string;
  appointment_date: string;
  time_slot: string;
  status: string;
  notes?: string;
  created_at: string;
}

export default function AppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');

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

    fetchAppointments();
  }, [router]);

  const fetchAppointments = async () => {
    try {
      const result = await apiRequest('/appointments/appointments/');
      const rawData = result?.data as { results?: Appointment[] } | Appointment[] | undefined;
      const list = Array.isArray(rawData) ? rawData : (rawData?.results || []);
      setAppointments(list);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAppointments = () => {
    let filtered = appointments;
    
    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(a => a.status === filter);
    }
    
    // Filter by date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateFilter === 'today') {
      filtered = filtered.filter(a => {
        const date = new Date(a.appointment_date);
        date.setHours(0, 0, 0, 0);
        return date.getTime() === today.getTime();
      });
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter(a => new Date(a.appointment_date) >= weekAgo);
    }
    
    return filtered.sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime());
  };

  const filteredAppointments = getFilteredAppointments();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmé': case 'confirmed': return 'bg-green-500/20 text-green-400';
      case 'en attente': case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'annulé': case 'cancelled': return 'bg-red-500/20 text-red-400';
      case 'terminé': case 'completed': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service?.toLowerCase()) {
      case 'nouveau_raccordement':
        return (
          <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'reclamation':
        return (
          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'paiement':
        return (
          <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const todayCount = appointments.filter(a => {
    const date = new Date(a.appointment_date);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }).length;

  const pendingCount = appointments.filter(a => a.status === 'pending' || a.status === 'en attente').length;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-slate-400 hover:text-white transition">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-white">Gestion des Rendez-vous</h1>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:border-indigo-500 outline-none"
            >
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="all">Tous</option>
            </select>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:border-indigo-500 outline-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="confirmed">Confirmés</option>
              <option value="completed">Terminés</option>
              <option value="cancelled">Annulés</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total RDV</p>
                <p className="text-2xl font-bold text-white">{appointments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Aujourd'hui</p>
                <p className="text-2xl font-bold text-white">{todayCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-400 text-sm">En Attente</p>
                <p className="text-2xl font-bold text-white">{pendingCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Confirmés</p>
                <p className="text-2xl font-bold text-white">{appointments.filter(a => a.status === 'confirmed').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des RDV */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-slate-600 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                      {getServiceIcon(appointment.service_type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-white font-semibold">
                          {appointment.client?.user?.first_name} {appointment.client?.user?.last_name}
                        </p>
                        <span className="text-cyan-400 font-mono text-sm">{appointment.client?.client_number}</span>
                      </div>
                      <p className="text-slate-400 text-sm capitalize">{appointment.service_type?.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-white font-medium">{formatDate(appointment.appointment_date)}</p>
                      <p className="text-slate-400 text-sm">{appointment.time_slot}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-sm">{appointment.agency?.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-green-600 rounded-lg transition text-green-400 hover:text-white" title="Confirmer">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button className="p-2 hover:bg-red-600 rounded-lg transition text-red-400 hover:text-white" title="Annuler">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                {appointment.notes && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <p className="text-slate-400 text-sm">{appointment.notes}</p>
                  </div>
                )}
              </div>
            ))}
            {filteredAppointments.length === 0 && (
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center">
                <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-slate-400">Aucun rendez-vous trouvé</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
