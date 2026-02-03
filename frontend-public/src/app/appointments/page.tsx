'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Agency {
  id: string;
  name: string;
  address: string;
}

interface Service {
  id: string;
  name?: string;
  title?: string;
}

function AppointmentsContent() {
  const searchParams = useSearchParams();
  const preselectedAgency = searchParams.get('agency');
  
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    agency: preselectedAgency || '',
    service: '',
    date: '',
    time: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    Promise.all([
      fetch('http://127.0.0.1:8000/api/agencies/').then(r => r.json()),
      fetch('http://127.0.0.1:8000/api/cms/services/').then(r => r.json())
    ]).then(([agenciesData, servicesData]) => {
      setAgencies(Array.isArray(agenciesData) ? agenciesData : agenciesData.results || []);
      const servicesList = Array.isArray(servicesData) ? servicesData : servicesData.results || [];
      setServices(servicesList.filter((s: { is_active: boolean }) => s.is_active));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (preselectedAgency && !formData.agency) {
      setFormData(prev => ({ ...prev, agency: preselectedAgency }));
    }
  }, [preselectedAgency, formData.agency]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSuccess(true);
    setSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Get min date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Time slots
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-800/50 border border-green-500/50 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Rendez-vous confirmé !</h2>
          <p className="text-gray-400 mb-6">
            Votre demande a été enregistrée. Vous recevrez une confirmation par email sous peu.
          </p>
          <div className="bg-slate-900/50 rounded-lg p-4 mb-6 text-left">
            <p className="text-gray-400 text-sm">📅 {formData.date} à {formData.time}</p>
            <p className="text-white font-medium mt-1">{agencies.find(a => a.id === formData.agency)?.name}</p>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl mb-8 shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Prendre Rendez-vous</h1>
            <p className="text-xl text-gray-300">
              Réservez un créneau en agence et évitez l'attente
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="py-8 px-4 pb-20">
          <div className="max-w-2xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Agency */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        Agence *
                      </span>
                    </label>
                    <select 
                      name="agency" 
                      value={formData.agency} 
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                    >
                      <option value="">Sélectionnez une agence</option>
                      {agencies.map(agency => (
                        <option key={agency.id} value={agency.id}>{agency.name} - {agency.address}</option>
                      ))}
                    </select>
                  </div>

                  {/* Service */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Service *
                      </span>
                    </label>
                    <select 
                      name="service" 
                      value={formData.service} 
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                    >
                      <option value="">Sélectionnez un service</option>
                      {services.map(service => (
                        <option key={service.id} value={service.id}>{service.title || service.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Date *
                      </span>
                    </label>
                    <input 
                      type="date"
                      name="date" 
                      value={formData.date} 
                      onChange={handleChange}
                      min={minDate}
                      required
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                    />
                  </div>

                  {/* Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Heure *
                      </span>
                    </label>
                    <select 
                      name="time" 
                      value={formData.time} 
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                    >
                      <option value="">Sélectionnez une heure</option>
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2 border-t border-slate-700 pt-6 mt-2">
                    <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Vos informations
                    </h3>
                  </div>

                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Prénom *</label>
                    <input 
                      type="text"
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                      placeholder="Jean"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Nom *</label>
                    <input 
                      type="text"
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                      placeholder="Dupont"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                    <input 
                      type="email"
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                      placeholder="jean.dupont@email.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Téléphone *</label>
                    <input 
                      type="tel"
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                      placeholder="+243 XXX XXX XXX"
                    />
                  </div>

                  {/* Notes */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Notes (optionnel)</label>
                    <textarea 
                      name="notes" 
                      value={formData.notes} 
                      onChange={handleChange}
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none"
                      placeholder="Informations complémentaires..."
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Confirmation en cours...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Confirmer le rendez-vous
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AppointmentsContent />
    </Suspense>
  );
}
