'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getAccessToken, getCurrentUser, apiRequest } from '@/lib/api';

// Charger le composant Map dynamiquement (côté client uniquement)
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-slate-800 rounded-xl flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-3 border-cyan-500 border-t-transparent rounded-full"></div>
    </div>
  ),
});

// Icônes SVG
const Icons = {
  building: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  search: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  plus: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  map: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  users: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  edit: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  tools: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  back: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
};

interface Agency {
  id: string;
  name: string;
  code: string;
  address: string;
  city?: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  manager?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  employees_count?: number;
  opening_hours?: string;
}

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      window.location.href = '/login';
      return;
    }
    loadAgencies();
  }, []);

  const loadAgencies = async () => {
    setLoading(true);
    const result = await apiRequest('/agencies/agencies/');
    if (result.data) {
      const data = result.data.results || result.data;
      setAgencies(Array.isArray(data) ? data : []);
      
      const ags = Array.isArray(data) ? data : [];
      setStats({
        total: ags.length,
        active: ags.filter((a: Agency) => a.is_active).length,
        inactive: ags.filter((a: Agency) => !a.is_active).length,
      });
    }
    setLoading(false);
  };

  const filteredAgencies = agencies.filter((agency) =>
    agency.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agency.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Préparer les marqueurs pour la carte
  const mapMarkers = agencies
    .filter(a => a.latitude && a.longitude)
    .map(a => ({
      lat: a.latitude!,
      lng: a.longitude!,
      popup: `<strong>${a.name}</strong><br>${a.address}`,
    }));

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
                <h1 className="text-2xl font-bold text-white">Gestion des agences</h1>
                <p className="text-slate-400 text-sm">Gérez le réseau d'agences</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Toggle vue */}
              <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    viewMode === 'list' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Liste
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                    viewMode === 'map' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {Icons.map}
                  Carte
                </button>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:shadow-lg hover:shadow-cyan-500/25 transition">
                {Icons.plus}
                <span>Ajouter agence</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
                {Icons.building}
              </div>
              <div>
                <p className="text-slate-400 text-sm">Total agences</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-500/10 rounded-2xl p-4 border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center text-green-400">
                ✓
              </div>
              <div>
                <p className="text-green-400 text-sm">Actives</p>
                <p className="text-3xl font-bold text-green-400">{stats.active}</p>
              </div>
            </div>
          </div>
          <div className="bg-red-500/10 rounded-2xl p-4 border border-red-500/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center text-red-400">
                ✗
              </div>
              <div>
                <p className="text-red-400 text-sm">Inactives</p>
                <p className="text-3xl font-bold text-red-400">{stats.inactive}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recherche */}
        <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {Icons.search}
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom, code ou adresse..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Contenu principal */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
          </div>
        ) : viewMode === 'map' ? (
          /* Vue carte */
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <div className="h-[600px]">
              <Map
                center={[-4.4419, 15.2663]} // Kinshasa par défaut
                zoom={11}
                markers={mapMarkers}
                height="600px"
              />
            </div>
            {/* Liste des agences sur la carte */}
            <div className="p-4 bg-slate-900/50 border-t border-white/10 max-h-48 overflow-y-auto">
              <h3 className="text-sm font-semibold text-white mb-2">Agences sur la carte ({mapMarkers.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {agencies.filter(a => a.latitude && a.longitude).map((agency) => (
                  <button
                    key={agency.id}
                    onClick={() => setSelectedAgency(agency)}
                    className="text-left p-2 bg-white/5 hover:bg-white/10 rounded-lg transition"
                  >
                    <p className="text-white text-sm font-medium truncate">{agency.name}</p>
                    <p className="text-slate-500 text-xs truncate">{agency.address}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : filteredAgencies.length === 0 ? (
          <div className="bg-white/5 rounded-2xl border border-white/10 p-12 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              {Icons.building}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Aucune agence trouvée</h3>
            <p className="text-slate-400">Modifiez votre recherche ou ajoutez une nouvelle agence</p>
          </div>
        ) : (
          /* Vue liste */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgencies.map((agency) => (
              <div
                key={agency.id}
                className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition"
              >
                {/* Mini carte */}
                {agency.latitude && agency.longitude && (
                  <div className="h-32 bg-slate-800">
                    <Map
                      center={[agency.latitude, agency.longitude]}
                      zoom={14}
                      markers={[{
                        lat: agency.latitude,
                        lng: agency.longitude,
                        popup: agency.name,
                      }]}
                      height="128px"
                    />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">{agency.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          agency.is_active 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {agency.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-cyan-400 text-sm font-mono">{agency.code}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400">{Icons.map}</span>
                      <span className="text-white">{agency.address}</span>
                    </div>
                    {agency.phone && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">📞</span>
                        <span className="text-white">{agency.phone}</span>
                      </div>
                    )}
                    {agency.manager && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">{Icons.users}</span>
                        <span className="text-white">
                          {agency.manager.first_name} {agency.manager.last_name}
                        </span>
                      </div>
                    )}
                    {agency.opening_hours && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">🕐</span>
                        <span className="text-white">{agency.opening_hours}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition text-sm">
                      {Icons.edit}
                      <span>Modifier</span>
                    </button>
                    <Link
                      href={`http://localhost:3002?agency=${agency.id}`}
                      target="_blank"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-xl transition text-sm"
                    >
                      {Icons.tools}
                      <span>Outils</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
