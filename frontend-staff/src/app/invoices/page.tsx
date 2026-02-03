'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAccessToken, getCurrentUser, clearTokens, apiRequest } from '@/lib/api';

interface Invoice {
  id: string;
  invoice_number: string;
  client_name?: string;
  client?: {
    user?: {
      first_name: string;
      last_name: string;
    };
  };
  total_amount: number;
  amount_paid: number;
  status: string;
  due_date: string;
  period_start: string;
  period_end: string;
  created_at: string;
}

export default function InvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

    fetchInvoices();
  }, [router]);

  const fetchInvoices = async () => {
    try {
      const result = await apiRequest('/billing/invoices/');
      const rawData = result?.data as { results?: Invoice[] } | Invoice[] | undefined;
      const list = Array.isArray(rawData) ? rawData : (rawData?.results || []);
      setInvoices(list);
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = filter === 'all' 
    ? invoices 
    : invoices.filter(i => i.status === filter);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'payée': case 'paid': return 'bg-green-500/20 text-green-400';
      case 'en attente': case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'en retard': case 'overdue': return 'bg-red-500/20 text-red-400';
      case 'annulée': case 'cancelled': return 'bg-slate-500/20 text-slate-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CD', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  const formatDate = (date: string) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const totalAmount = invoices.reduce((sum, i) => sum + (i.total_amount || 0), 0);
  const totalPaid = invoices.reduce((sum, i) => sum + (i.amount_paid || 0), 0);
  const totalPending = invoices.filter(i => i.status === 'pending' || i.status === 'en attente')
    .reduce((sum, i) => sum + ((i.total_amount || 0) - (i.amount_paid || 0)), 0);

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
            <h1 className="text-2xl font-bold text-white">Gestion des Factures</h1>
          </div>
          <div className="flex items-center gap-4">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:border-indigo-500 outline-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="paid">Payées</option>
              <option value="overdue">En retard</option>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total Factures</p>
                <p className="text-2xl font-bold text-white">{invoices.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Montant Total</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Montant Payé</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-slate-400 text-sm">En Attente</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalPending)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="text-left text-slate-400 font-medium px-6 py-4">N° Facture</th>
                  <th className="text-left text-slate-400 font-medium px-6 py-4">Client</th>
                  <th className="text-left text-slate-400 font-medium px-6 py-4">Période</th>
                  <th className="text-right text-slate-400 font-medium px-6 py-4">Montant</th>
                  <th className="text-right text-slate-400 font-medium px-6 py-4">Payé</th>
                  <th className="text-left text-slate-400 font-medium px-6 py-4">Échéance</th>
                  <th className="text-left text-slate-400 font-medium px-6 py-4">Statut</th>
                  <th className="text-right text-slate-400 font-medium px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-slate-700/50 transition">
                    <td className="px-6 py-4">
                      <span className="text-cyan-400 font-mono">{invoice.invoice_number}</span>
                    </td>
                    <td className="px-6 py-4 text-white">
                      {invoice.client_name || `${invoice.client?.user?.first_name || ''} ${invoice.client?.user?.last_name || ''}`}
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">
                      {formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}
                    </td>
                    <td className="px-6 py-4 text-right text-white font-semibold">
                      {formatCurrency(invoice.total_amount)}
                    </td>
                    <td className="px-6 py-4 text-right text-green-400">
                      {formatCurrency(invoice.amount_paid)}
                    </td>
                    <td className="px-6 py-4 text-slate-300">{formatDate(invoice.due_date)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-slate-600 rounded-lg transition text-slate-400 hover:text-white" title="Voir">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-slate-600 rounded-lg transition text-slate-400 hover:text-white" title="Imprimer">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                          </svg>
                        </button>
                        <button className="p-2 hover:bg-green-600 rounded-lg transition text-green-400 hover:text-white" title="Enregistrer paiement">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                      Aucune facture trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
