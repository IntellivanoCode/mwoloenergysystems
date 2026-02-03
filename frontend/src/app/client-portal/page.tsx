'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiCall, getAccessToken } from '@/lib/api';

// Icônes SVG professionnelles
const Icons = {
  user: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  invoice: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  calendar: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  ticket: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
  ),
  creditCard: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  support: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  settings: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  check: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  clock: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  bolt: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  logout: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  home: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  document: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  arrowRight: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
};

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  date: string;
  due_date: string;
  total_amount: string;
  status: string;
}

interface Appointment {
  id: string;
  confirmation_code: string;
  date: string;
  time: string;
  service_name: string;
  agency_name: string;
  status: string;
}

export default function ClientPortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      // Vérifier l'authentification
      const token = getAccessToken();
      if (!token) {
        router.push('/login?redirect=/client-portal');
        return;
      }

      setAuthChecked(true);

      try {
        // Charger l'utilisateur
        const userRes = await apiCall<User>('/auth/me/');
        if (userRes.error) {
          router.push('/login?redirect=/client-portal');
          return;
        }
        
        if (userRes.data) {
          // Les employés/admins ne peuvent pas accéder au portail client
          if (userRes.data.role !== 'client') {
            // Déconnecter et rediriger vers login staff
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            router.push('/staff-login?error=client_only');
            return;
          }
          setUser(userRes.data);
        }

        // Charger les données
        const [clientRes, invoicesRes, appointmentsRes] = await Promise.allSettled([
          apiCall<Client>('/crm/clients/me/'),
          apiCall<Invoice[]>('/billing/invoices/my_invoices/'),
          apiCall<Appointment[]>('/appointments/appointments/my_appointments/'),
        ]);

        if (clientRes.status === 'fulfilled' && clientRes.value.data) {
          setClient(clientRes.value.data);
        }

        if (invoicesRes.status === 'fulfilled' && invoicesRes.value.data) {
          const data = invoicesRes.value.data;
          setInvoices(Array.isArray(data) ? data.slice(0, 5) : []);
        }

        if (appointmentsRes.status === 'fulfilled' && appointmentsRes.value.data) {
          const data = appointmentsRes.value.data;
          setAppointments(Array.isArray(data) ? data.slice(0, 5) : []);
        }
      } catch (err) {
        console.error('Erreur chargement:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/');
  };

  const getStatusBadge = (status: string, type: 'invoice' | 'appointment') => {
    const configs: Record<string, Record<string, { bg: string; text: string; label: string }>> = {
      invoice: {
        paid: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Payée' },
        pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'En attente' },
        overdue: { bg: 'bg-red-100', text: 'text-red-700', label: 'En retard' },
        partial: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Partiel' },
      },
      appointment: {
        confirmed: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Confirmé' },
        pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'En attente' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Annulé' },
        completed: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Terminé' },
      },
    };
    const config = configs[type][status] || { bg: 'bg-slate-100', text: 'text-slate-700', label: status };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-teal-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-teal-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-200">
                {Icons.bolt}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Mwolo Energy</h1>
                <p className="text-xs text-teal-600 font-medium">Espace Client</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="Site public">
                {Icons.home}
              </Link>
              <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Déconnexion">
                {Icons.logout}
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Bannière */}
        <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-600 rounded-3xl p-8 mb-8 text-white shadow-2xl shadow-teal-200/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-teal-100 text-sm font-medium mb-1">Bienvenue sur votre espace personnel</p>
              <h2 className="text-3xl font-bold mb-2">{user.first_name} {user.last_name}</h2>
              <p className="text-teal-100 flex items-center gap-2">
                <span className="text-white font-semibold">{user.email}</span>
                {client?.status === 'actif' && (
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">Compte actif</span>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/appointments" className="flex items-center gap-2 px-5 py-3 bg-white text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition-all shadow-lg hover:shadow-xl">
                {Icons.calendar}
                <span>Prendre RDV</span>
              </Link>
              <Link href="/profile" className="flex items-center gap-2 px-5 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all border border-white/30">
                {Icons.settings}
                <span>Mon profil</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-100 border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                {Icons.check}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{invoices.filter(i => i.status === 'paid').length}</p>
                <p className="text-sm text-slate-500">Factures payées</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-100 border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                {Icons.clock}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{invoices.filter(i => i.status === 'pending').length}</p>
                <p className="text-sm text-slate-500">En attente</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-100 border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                {Icons.calendar}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{appointments.filter(a => ['confirmed', 'pending'].includes(a.status)).length}</p>
                <p className="text-sm text-slate-500">RDV à venir</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-100 border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center">
                {Icons.bolt}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{client?.status === 'actif' ? 'Actif' : '-'}</p>
                <p className="text-sm text-slate-500">Statut</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Factures */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-100 border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-xl flex items-center justify-center">
                  {Icons.invoice}
                </div>
                <h3 className="text-lg font-bold text-slate-900">Mes factures</h3>
              </div>
              <Link href="/billing/my-invoices" className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium">
                Voir tout {Icons.arrowRight}
              </Link>
            </div>
            <div className="p-6">
              {invoices.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    {Icons.document}
                  </div>
                  <p className="text-slate-500">Aucune facture</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {invoices.map(invoice => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                      <div>
                        <p className="font-semibold text-slate-900">{invoice.invoice_number}</p>
                        <p className="text-sm text-slate-500">Échéance: {new Date(invoice.due_date).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{parseFloat(invoice.total_amount).toLocaleString('fr-FR')} FC</p>
                        {getStatusBadge(invoice.status, 'invoice')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RDV */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-100 border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-xl flex items-center justify-center">
                  {Icons.calendar}
                </div>
                <h3 className="text-lg font-bold text-slate-900">Mes rendez-vous</h3>
              </div>
              <Link href="/appointments" className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium">
                Nouveau {Icons.arrowRight}
              </Link>
            </div>
            <div className="p-6">
              {appointments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    {Icons.calendar}
                  </div>
                  <p className="text-slate-500 mb-4">Aucun rendez-vous</p>
                  <Link href="/appointments" className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium">
                    Prendre un rendez-vous
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.map(apt => (
                    <div key={apt.id} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors">
                      <div>
                        <p className="font-semibold text-slate-900">{apt.service_name}</p>
                        <p className="text-sm text-slate-500">{new Date(apt.date).toLocaleDateString('fr-FR')} à {apt.time}</p>
                        <p className="text-xs text-slate-400">{apt.agency_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-xs text-slate-500 mb-1">{apt.confirmation_code}</p>
                        {getStatusBadge(apt.status, 'appointment')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Services rapides */}
        <h3 className="text-lg font-bold text-slate-900 mb-4">Services rapides</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/appointments" className="group bg-white rounded-2xl p-6 shadow-lg shadow-slate-100 border border-slate-100 hover:border-teal-200 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-blue-200">
              {Icons.calendar}
            </div>
            <p className="font-semibold text-slate-900">Prendre RDV</p>
            <p className="text-sm text-slate-500">Réserver un créneau</p>
          </Link>
          <Link href="/kiosk" className="group bg-white rounded-2xl p-6 shadow-lg shadow-slate-100 border border-slate-100 hover:border-teal-200 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-purple-200">
              {Icons.ticket}
            </div>
            <p className="font-semibold text-slate-900">Prendre un ticket</p>
            <p className="text-sm text-slate-500">File d'attente</p>
          </Link>
          <Link href="/billing/pay" className="group bg-white rounded-2xl p-6 shadow-lg shadow-slate-100 border border-slate-100 hover:border-teal-200 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-emerald-200">
              {Icons.creditCard}
            </div>
            <p className="font-semibold text-slate-900">Payer une facture</p>
            <p className="text-sm text-slate-500">Paiement en ligne</p>
          </Link>
          <Link href="/support" className="group bg-white rounded-2xl p-6 shadow-lg shadow-slate-100 border border-slate-100 hover:border-teal-200 hover:shadow-xl transition-all">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-orange-200">
              {Icons.support}
            </div>
            <p className="font-semibold text-slate-900">Support</p>
            <p className="text-sm text-slate-500">Besoin d'aide ?</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
