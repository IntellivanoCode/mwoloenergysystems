'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAccessToken, getCurrentUser, apiRequest } from '@/lib/api';

// Icônes SVG
const Icons = {
  chart: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  users: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  money: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  lightning: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  calendar: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  download: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  back: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
};

interface StatsData {
  clients: { total: number; active: number; newThisMonth: number };
  invoices: { total: number; totalAmount: number; paid: number; pending: number };
  payments: { total: number; todayAmount: number; monthAmount: number };
  tickets: { total: number; open: number; resolved: number };
}

export default function ReportsPage() {
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month'); // 'week', 'month', 'year'
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser({ name: currentUser.full_name || currentUser.username, role: currentUser.role });
    }

    loadStats();
  }, [period]);

  const loadStats = async () => {
    setLoading(true);
    try {
      // Charger les données depuis l'API
      const [clientsRes, invoicesRes, paymentsRes, ticketsRes] = await Promise.all([
        apiRequest('/crm/clients/'),
        apiRequest('/billing/invoices/'),
        apiRequest('/billing/payments/'),
        apiRequest('/support/tickets/'),
      ]);

      const clients = clientsRes.data?.results || clientsRes.data || [];
      const invoices = invoicesRes.data?.results || invoicesRes.data || [];
      const payments = paymentsRes.data?.results || paymentsRes.data || [];
      const tickets = ticketsRes.data?.results || ticketsRes.data || [];

      const thisMonth = new Date().getMonth();
      const today = new Date().toISOString().split('T')[0];

      setStats({
        clients: {
          total: Array.isArray(clients) ? clients.length : 0,
          active: Array.isArray(clients) ? clients.filter((c: { status?: string }) => c.status === 'active').length : 0,
          newThisMonth: Array.isArray(clients) ? clients.filter((c: { created_at?: string }) => 
            c.created_at && new Date(c.created_at).getMonth() === thisMonth
          ).length : 0,
        },
        invoices: {
          total: Array.isArray(invoices) ? invoices.length : 0,
          totalAmount: Array.isArray(invoices) ? invoices.reduce((sum: number, i: { total_amount?: number }) => sum + (i.total_amount || 0), 0) : 0,
          paid: Array.isArray(invoices) ? invoices.filter((i: { status?: string }) => i.status === 'paid').length : 0,
          pending: Array.isArray(invoices) ? invoices.filter((i: { status?: string }) => i.status === 'pending').length : 0,
        },
        payments: {
          total: Array.isArray(payments) ? payments.length : 0,
          todayAmount: Array.isArray(payments) ? payments.filter((p: { payment_date?: string }) => 
            p.payment_date && p.payment_date.startsWith(today)
          ).reduce((sum: number, p: { amount?: number }) => sum + (p.amount || 0), 0) : 0,
          monthAmount: Array.isArray(payments) ? payments.filter((p: { payment_date?: string }) => 
            p.payment_date && new Date(p.payment_date).getMonth() === thisMonth
          ).reduce((sum: number, p: { amount?: number }) => sum + (p.amount || 0), 0) : 0,
        },
        tickets: {
          total: Array.isArray(tickets) ? tickets.length : 0,
          open: Array.isArray(tickets) ? tickets.filter((t: { status?: string }) => t.status === 'open').length : 0,
          resolved: Array.isArray(tickets) ? tickets.filter((t: { status?: string }) => t.status === 'resolved').length : 0,
        },
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CD', { style: 'currency', currency: 'CDF' }).format(amount);
  };

  const handleExport = async (reportType: string) => {
    setGenerating(reportType);
    // Simuler la génération du rapport
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert(`Rapport ${reportType} généré avec succès!`);
    setGenerating(null);
  };

  const reportTypes = [
    { id: 'clients', name: 'Rapport Clients', icon: Icons.users, color: 'from-blue-500 to-indigo-600' },
    { id: 'financial', name: 'Rapport Financier', icon: Icons.money, color: 'from-green-500 to-emerald-600' },
    { id: 'consumption', name: 'Rapport Consommation', icon: Icons.lightning, color: 'from-amber-500 to-orange-600' },
    { id: 'support', name: 'Rapport Support', icon: Icons.chart, color: 'from-purple-500 to-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-xl transition">
                {Icons.back}
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Rapports & Statistiques</h1>
                <p className="text-slate-400 text-sm">Générez des rapports détaillés</p>
              </div>
            </div>
            
            {/* Période */}
            <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1">
              {[
                { value: 'week', label: 'Semaine' },
                { value: 'month', label: 'Mois' },
                { value: 'year', label: 'Année' },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPeriod(p.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    period === p.value
                      ? 'bg-cyan-500 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {/* Vue d'ensemble */}
            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-6">Vue d'ensemble</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Clients */}
                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/10 rounded-2xl p-6 border border-blue-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                      {Icons.users}
                    </div>
                    <span className="text-green-400 text-sm">+{stats?.clients.newThisMonth || 0} ce mois</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{stats?.clients.total || 0}</p>
                  <p className="text-slate-400">Clients totaux</p>
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm">
                    <span className="text-green-400">{stats?.clients.active || 0} actifs</span>
                  </div>
                </div>

                {/* Factures */}
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400">
                      {Icons.money}
                    </div>
                    <span className="text-amber-400 text-sm">{stats?.invoices.pending || 0} en attente</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{formatCurrency(stats?.invoices.totalAmount || 0)}</p>
                  <p className="text-slate-400">Montant total factures</p>
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm">
                    <span className="text-green-400">{stats?.invoices.paid || 0} payées</span>
                    <span className="text-slate-400">{stats?.invoices.total || 0} total</span>
                  </div>
                </div>

                {/* Paiements */}
                <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
                      {Icons.lightning}
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white">{formatCurrency(stats?.payments.monthAmount || 0)}</p>
                  <p className="text-slate-400">Encaissements du mois</p>
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm">
                    <span className="text-green-400">{formatCurrency(stats?.payments.todayAmount || 0)} aujourd'hui</span>
                  </div>
                </div>

                {/* Support */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                      {Icons.chart}
                    </div>
                    <span className="text-red-400 text-sm">{stats?.tickets.open || 0} ouverts</span>
                  </div>
                  <p className="text-3xl font-bold text-white">{stats?.tickets.total || 0}</p>
                  <p className="text-slate-400">Tickets support</p>
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-sm">
                    <span className="text-green-400">{stats?.tickets.resolved || 0} résolus</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Génération de rapports */}
            <section className="mb-10">
              <h2 className="text-xl font-bold text-white mb-6">Générer des rapports</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reportTypes.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white/5 rounded-2xl border border-white/10 p-6 hover:border-white/20 transition"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${report.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                      {report.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{report.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">
                      Données pour la période: {period === 'week' ? 'Cette semaine' : period === 'month' ? 'Ce mois' : 'Cette année'}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExport(report.id)}
                        disabled={generating === report.id}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition disabled:opacity-50"
                      >
                        {generating === report.id ? (
                          <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                        ) : (
                          <>
                            {Icons.download}
                            <span>PDF</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleExport(report.id + '-excel')}
                        disabled={generating === report.id + '-excel'}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl transition disabled:opacity-50"
                      >
                        {generating === report.id + '-excel' ? (
                          <span className="animate-spin w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full"></span>
                        ) : (
                          <>
                            {Icons.download}
                            <span>Excel</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Graphiques simulés */}
            <section>
              <h2 className="text-xl font-bold text-white mb-6">Tendances</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Graphique Revenus */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Évolution des revenus</h3>
                  <div className="h-64 flex items-end gap-2">
                    {[40, 65, 45, 80, 55, 70, 60, 85, 75, 90, 70, 95].map((height, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-gradient-to-t from-cyan-500/50 to-cyan-500/80 rounded-t-lg transition-all hover:from-cyan-500/70 hover:to-cyan-500"
                          style={{ height: `${height}%` }}
                        ></div>
                        <span className="text-xs text-slate-500">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][idx]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Graphique Tickets */}
                <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Répartition des tickets</h3>
                  <div className="h-64 flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      {/* Cercle de base */}
                      <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="15" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#22d3ee" strokeWidth="15" 
                          strokeDasharray={`${((stats?.tickets.resolved || 0) / Math.max(stats?.tickets.total || 1, 1)) * 251.2} 251.2`} />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#f59e0b" strokeWidth="15" 
                          strokeDasharray={`${((stats?.tickets.open || 0) / Math.max(stats?.tickets.total || 1, 1)) * 251.2} 251.2`}
                          strokeDashoffset={`-${((stats?.tickets.resolved || 0) / Math.max(stats?.tickets.total || 1, 1)) * 251.2}`} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white">{stats?.tickets.total || 0}</span>
                        <span className="text-slate-400 text-sm">Total</span>
                      </div>
                    </div>
                    <div className="ml-8 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
                        <span className="text-slate-300">Résolus: {stats?.tickets.resolved || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                        <span className="text-slate-300">Ouverts: {stats?.tickets.open || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
