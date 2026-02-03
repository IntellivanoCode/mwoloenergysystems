'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';
import { 
  getAgencyId, 
  getCounterId, 
  setAgencyConfig,
  getWaitingTickets, 
  callNextTicket, 
  completeTicket, 
  recallTicket,
  QueueTicket,
  validateBadge
} from '@/lib/api';

export default function CounterPage() {
  const router = useRouter();
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [counterId, setCounterId] = useState<string | null>(null);
  const [counterName, setCounterName] = useState('');
  const [badgeCode, setBadgeCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  
  const [waitingTickets, setWaitingTickets] = useState<QueueTicket[]>([]);
  const [currentTicket, setCurrentTicket] = useState<QueueTicket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = getAgencyId();
    const counter = getCounterId();
    
    if (!id) {
      window.location.href = '/';
      return;
    }
    
    setAgencyId(id);
    if (counter) setCounterId(counter);
  }, []);

  useEffect(() => {
    if (!agencyId || !isAuthenticated) return;

    loadTickets();
    const timer = setInterval(loadTickets, 5000);
    return () => clearInterval(timer);
  }, [agencyId, isAuthenticated]);

  const loadTickets = async () => {
    if (!agencyId) return;
    const result = await getWaitingTickets(agencyId);
    if (result.data) {
      setWaitingTickets(result.data.filter((t: QueueTicket) => t.status === 'waiting'));
    }
  };

  const handleBadgeAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await validateBadge(badgeCode);
    setLoading(false);

    if (result.error || !result.data?.valid) {
      setError('Badge invalide');
      return;
    }

    setEmployeeName(result.data.employee_name);
    setIsAuthenticated(true);
  };

  const handleSetCounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!counterName.trim()) return;
    
    const id = `counter-${Date.now()}`;
    setAgencyConfig({
      agency_id: agencyId!,
      agency_name: '',
      agency_code: '',
      counter_id: id,
      counter_name: counterName,
    });
    setCounterId(id);
  };

  const handleCallNext = async () => {
    if (!agencyId || !counterId) return;
    
    setLoading(true);
    setError('');
    
    const result = await callNextTicket(agencyId, counterId);
    setLoading(false);

    if (result.error) {
      setError('Aucun ticket en attente');
      return;
    }

    if (result.data) {
      setCurrentTicket(result.data);
    }
  };

  const handleComplete = async () => {
    if (!currentTicket) return;
    
    setLoading(true);
    await completeTicket(currentTicket.id);
    setCurrentTicket(null);
    setLoading(false);
    loadTickets();
  };

  const handleRecall = async () => {
    if (!currentTicket) return;
    
    setLoading(true);
    await recallTicket(currentTicket.id);
    setLoading(false);
  };

  // Badge authentication screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-8">
        <div className="absolute top-6 left-6">
          <BackButton />
        </div>
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎫</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Guichet Agent</h1>
              <p className="text-slate-400 mt-1">Scannez votre badge pour activer</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleBadgeAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Code Badge</label>
                <input
                  type="text"
                  value={badgeCode}
                  onChange={(e) => setBadgeCode(e.target.value)}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-center text-2xl tracking-widest placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••"
                  autoFocus
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition disabled:opacity-50"
              >
                {loading ? 'Vérification...' : 'Activer le guichet'}
              </button>
            </form>

            <p className="mt-6 text-center text-slate-500 text-sm">
              Placez votre badge sur le lecteur ou entrez le code manuellement
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Counter setup screen
  if (!counterId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-8">
        <div className="absolute top-6 left-6">
          <BackButton />
        </div>
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
            <div className="text-center mb-8">
              <p className="text-green-400 mb-2">✓ Badge validé</p>
              <h1 className="text-2xl font-bold text-white">Bonjour, {employeeName}</h1>
              <p className="text-slate-400 mt-1">Configurez votre guichet</p>
            </div>

            <form onSubmit={handleSetCounter} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nom du guichet</label>
                <input
                  type="text"
                  value={counterName}
                  onChange={(e) => setCounterName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500"
                  placeholder="ex: Guichet 1"
                  autoFocus
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
              >
                Ouvrir le guichet
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Main counter interface
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-4 bg-slate-800/50 border-b border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BackButton />
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              🖥️
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{counterName}</h1>
              <p className="text-slate-400 text-sm">{employeeName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">
              🟢 Guichet ouvert
            </span>
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setCounterId(null);
                setBadgeCode('');
              }}
              className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition"
            >
              Fermer
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-3 gap-6 p-6">
        {/* Current Ticket */}
        <div className="col-span-2">
          <h2 className="text-lg font-bold text-white mb-4">Client en cours</h2>
          
          {currentTicket ? (
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 mb-6">
              <div className="text-center mb-8">
                <p className="text-indigo-200 text-lg mb-2">Ticket appelé</p>
                <p className="text-8xl font-bold text-white mb-4">{currentTicket.ticket_number}</p>
                <p className="text-xl text-indigo-100">{currentTicket.service_name}</p>
                {currentTicket.client_name && (
                  <p className="text-indigo-200 mt-2">Client: {currentTicket.client_name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleRecall}
                  disabled={loading}
                  className="py-4 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-xl transition"
                >
                  🔔 Rappeler
                </button>
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="py-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition"
                >
                  ✓ Terminer
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 rounded-3xl border border-white/10 p-12 text-center mb-6">
              <p className="text-6xl mb-4">👋</p>
              <p className="text-slate-400 text-xl">Aucun client en cours</p>
              <p className="text-slate-500 mt-2">Cliquez sur "Appeler suivant" pour commencer</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-300 text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleCallNext}
            disabled={loading || !!currentTicket}
            className="w-full py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-2xl font-bold rounded-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Appel en cours...' : '📢 Appeler suivant'}
          </button>
        </div>

        {/* Waiting Queue */}
        <div className="bg-white/5 rounded-3xl border border-white/10 p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center justify-between">
            <span>File d'attente</span>
            <span className="text-2xl text-cyan-400">{waitingTickets.length}</span>
          </h2>
          
          <div className="space-y-2">
            {waitingTickets.slice(0, 8).map((ticket, idx) => (
              <div
                key={ticket.id}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  idx === 0 ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-white/5'
                }`}
              >
                <span className={`text-lg font-bold ${idx === 0 ? 'text-cyan-400' : 'text-white'}`}>
                  {ticket.ticket_number}
                </span>
                <span className="text-slate-500 text-sm truncate ml-2">{ticket.service_name}</span>
              </div>
            ))}
            
            {waitingTickets.length === 0 && (
              <p className="text-slate-500 text-center py-8">Aucun ticket en attente</p>
            )}
            
            {waitingTickets.length > 8 && (
              <p className="text-slate-500 text-center py-2">+ {waitingTickets.length - 8} autres</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
