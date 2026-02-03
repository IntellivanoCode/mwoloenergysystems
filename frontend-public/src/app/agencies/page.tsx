'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import dynamic from 'next/dynamic';

// Import dynamique du composant Map (côté client uniquement)
const Map = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => (
    <div className="h-40 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
      <svg className="w-12 h-12 text-slate-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    </div>
  )
});

interface Agency {
  id: string;
  name: string;
  address: string;
  city?: string;
  phone?: string;
  email?: string;
  opening_hours?: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  province_details?: {
    name: string;
  };
  territory_details?: {
    name: string;
    commune_name: string;
  };
}

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>('all');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/agencies/')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.results || [];
        setAgencies(list.filter((a: Agency) => a.is_active !== false));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Utiliser province_details.name comme ville, sinon city
  const getCity = (agency: Agency) => agency.province_details?.name || agency.city || '';
  
  const cities = ['all', ...new Set(agencies.map(a => getCity(a)).filter(Boolean))];
  const filteredAgencies = selectedCity === 'all' 
    ? agencies 
    : agencies.filter(a => getCity(a) === selectedCity);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl mb-8 shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">Nos Agences</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Trouvez l'agence Mwolo Energy la plus proche de chez vous. 
              Notre réseau couvre toute la région pour être toujours à votre service.
            </p>
          </div>
        </section>

        {/* Filter */}
        {cities.length > 2 && (
          <section className="px-4 pb-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-4 justify-center flex-wrap">
                <span className="text-gray-400">Filtrer par ville :</span>
                {cities.map(city => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCity === city 
                        ? 'bg-cyan-500 text-white' 
                        : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                    }`}
                  >
                    {city === 'all' ? 'Toutes' : city}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Agencies Grid */}
        <section className="py-8 px-4">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredAgencies.length === 0 ? (
              <div className="text-center py-20 bg-slate-800/30 rounded-2xl">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <p className="text-gray-400 text-lg">Aucune agence trouvée dans cette zone</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAgencies.map((agency) => (
                  <div key={agency.id} 
                       className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-green-500/50 transition-all group">
                    {/* Map */}
                    <div className="h-40 relative overflow-hidden">
                      {agency.latitude && agency.longitude ? (
                        <Map 
                          latitude={agency.latitude} 
                          longitude={agency.longitude} 
                          name={agency.name}
                          className="h-40"
                        />
                      ) : (
                        <div className="h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                          <svg className="w-16 h-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 z-10">
                        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                          Ouvert
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                        {agency.name}
                      </h3>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3 text-gray-400">
                          <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{agency.address}{getCity(agency) && `, ${getCity(agency)}`}</span>
                        </div>
                        
                        {agency.phone && (
                          <div className="flex items-center gap-3 text-gray-400">
                            <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <a href={`tel:${agency.phone}`} className="hover:text-cyan-400 transition-colors">{agency.phone}</a>
                          </div>
                        )}
                        
                        {agency.opening_hours && (
                          <div className="flex items-center gap-3 text-gray-400">
                            <svg className="w-5 h-5 text-yellow-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{agency.opening_hours}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6 flex gap-3">
                        <Link href={`/appointments?agency=${agency.id}`}
                              className="flex-1 bg-green-600 hover:bg-green-500 text-white text-center py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          RDV
                        </Link>
                        {agency.latitude && agency.longitude && (
                          <a href={`https://www.google.com/maps?q=${agency.latitude},${agency.longitude}`}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Carte
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 px-4 bg-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Horaires d'ouverture</h3>
                <p className="text-gray-400">Lun - Ven : 8h00 - 17h00</p>
                <p className="text-gray-400">Samedi : 8h00 - 12h00</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Urgences 24/7</h3>
                <p className="text-green-400 text-xl font-bold">+243 800 123 456</p>
                <p className="text-gray-400 text-sm">Appel gratuit</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Support en ligne</h3>
                <p className="text-gray-400">Chat disponible</p>
                <p className="text-gray-400">sur l'espace client</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Évitez l'attente en agence</h2>
            <p className="text-green-100 mb-8">Prenez rendez-vous en ligne et soyez reçu à l'heure convenue</p>
            <Link href="/appointments" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-green-700 font-semibold rounded-lg hover:bg-gray-100 transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Prendre rendez-vous
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
