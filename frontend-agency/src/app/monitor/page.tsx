'use client';

import { useState, useEffect } from 'react';
import { getAgencyId, getWaitingTickets, getCalledTickets, QueueTicket, getQueueStats } from '@/lib/api';
import BackButton from '@/components/BackButton';

export default function MonitorPage() {
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [calledTickets, setCalledTickets] = useState<QueueTicket[]>([]);
  const [waitingTickets, setWaitingTickets] = useState<QueueTicket[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({ waiting_count: 0, average_wait_time: 0 });

  useEffect(() => {
    const id = getAgencyId();
    if (!id) {
      window.location.href = '/';
      return;
    }
    setAgencyId(id);

    // Update time every second
    const timeTimer = setInterval(() => setCurrentTime(new Date()), 1000);

    // Initial load
    loadData(id);

    // Refresh data every 3 seconds
    const dataTimer = setInterval(() => loadData(id), 3000);

    return () => {
      clearInterval(timeTimer);
      clearInterval(dataTimer);
    };
  }, []);

  const loadData = async (agencyId: string) => {
    const [calledRes, waitingRes, statsRes] = await Promise.all([
      getCalledTickets(agencyId),
      getWaitingTickets(agencyId),
      getQueueStats(agencyId),
    ]);

    // Gérer les réponses - s'assurer que ce sont des tableaux
    const calledData = Array.isArray(calledRes.data) ? calledRes.data : [];
    const waitingData = Array.isArray(waitingRes.data) ? waitingRes.data : [];
    
    setCalledTickets(calledData);
    setWaitingTickets(waitingData.filter((t: QueueTicket) => t.status === 'waiting'));
    if (statsRes.data) setStats(statsRes.data as typeof stats);
  };

  // Group called tickets by counter for display
  const latestCalled = Array.isArray(calledTickets) ? calledTickets.slice(0, 4) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="p-6 bg-slate-900/50 border-b border-white/10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <BackButton />
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
            <h1 className="text-2xl font-bold text-white">Mwolo Energy Systems</h1>
              <p className="text-cyan-400">File d'attente</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-6xl font-light text-white">
              {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-slate-400 text-lg">
              {currentTime.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-3 gap-6 p-6">
        {/* Left - Current Called Tickets */}
        <div className="col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            Tickets appelés
          </h2>
          
          {latestCalled.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {latestCalled.map((ticket, idx) => (
                <div
                  key={ticket.id}
                  className={`p-6 rounded-3xl border-2 ${
                    idx === 0 
                      ? 'bg-gradient-to-br from-green-600 to-emerald-700 border-green-400 animate-pulse-slow' 
                      : 'bg-white/10 border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      idx === 0 ? 'bg-white/20 text-white' : 'bg-white/10 text-slate-300'
                    }`}>
                      {ticket.counter_name || `Guichet`}
                    </span>
                    {idx === 0 && (
                      <span className="text-white text-sm animate-blink">MAINTENANT</span>
                    )}
                  </div>
                  
                  <p className={`text-7xl font-bold mb-2 ${idx === 0 ? 'text-white' : 'text-cyan-400'}`}>
                    {ticket.ticket_number}
                  </p>
                  
                  <p className={`text-lg ${idx === 0 ? 'text-green-100' : 'text-slate-400'}`}>
                    {ticket.service_name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 rounded-3xl border border-white/10 p-12 text-center">
              <p className="text-slate-400 text-2xl">Aucun ticket en cours d'appel</p>
              <p className="text-slate-500 mt-2">Les prochains numéros s'afficheront ici</p>
            </div>
          )}
        </div>

        {/* Right - Waiting Queue */}
        <div className="bg-white/5 rounded-3xl border border-white/10 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
            <span>En attente</span>
            <span className="text-4xl text-cyan-400">{stats.waiting_count}</span>
          </h2>
          
          <div className="flex-1 overflow-hidden">
            {waitingTickets.length > 0 ? (
              <div className="space-y-2">
                {waitingTickets.slice(0, 10).map((ticket, idx) => (
                  <div
                    key={ticket.id}
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      idx === 0 ? 'bg-cyan-500/20 border border-cyan-500/30' : 'bg-white/5'
                    }`}
                  >
                    <span className={`text-2xl font-bold ${idx === 0 ? 'text-cyan-400' : 'text-white'}`}>
                      {ticket.ticket_number}
                    </span>
                    <span className="text-slate-500 text-sm">{ticket.service_name}</span>
                  </div>
                ))}
                {waitingTickets.length > 10 && (
                  <p className="text-slate-500 text-center py-2">
                    + {waitingTickets.length - 10} autres
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-slate-500">Aucun ticket en attente</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Temps d'attente moyen</span>
              <span className="text-white font-medium">~{stats.average_wait_time || 5} min</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 bg-slate-900/50 border-t border-white/10">
        <div className="flex justify-center items-center gap-8 text-slate-400">
          <span>💡 Prenez votre ticket à la borne d'accueil</span>
          <span>•</span>
          <span>📱 Surveillez votre numéro sur cet écran</span>
        </div>
      </footer>
    </div>
  );
}
