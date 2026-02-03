'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  motivation: string;
  linkedin?: string;
  portfolio?: string;
  availability: string;
  salaryExpectation: string;
}

const Icons = {
  briefcase: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  check: (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  upload: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  ),
  arrowLeft: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
};

export default function ApplyPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const jobId = params.id as string;
  const jobTitle = searchParams.get('title') || '';
  const jobDepartment = searchParams.get('department') || '';
  const isSpontaneous = jobId === 'spontaneous';

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    experience: '',
    motivation: '',
    linkedin: '',
    portfolio: '',
    availability: '',
    salaryExpectation: '',
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cv' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        setError('Le fichier ne doit pas dépasser 5 Mo');
        return;
      }
      if (type === 'cv') setCvFile(file);
      else setCoverLetterFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      setError('Veuillez remplir tous les champs obligatoires');
      setLoading(false);
      return;
    }

    if (!cvFile) {
      setError('Veuillez joindre votre CV');
      setLoading(false);
      return;
    }

    try {
      // Simuler un envoi API (à remplacer par un vrai appel API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // En production, utilisez FormData pour envoyer les fichiers
      // const formDataToSend = new FormData();
      // formDataToSend.append('cv', cvFile);
      // if (coverLetterFile) formDataToSend.append('cover_letter', coverLetterFile);
      // Object.entries(formData).forEach(([key, value]) => formDataToSend.append(key, value));
      // await fetch('/api/applications', { method: 'POST', body: formDataToSend });

      setSubmitted(true);
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="pt-20">
          <div className="max-w-2xl mx-auto px-4 py-20">
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                {Icons.check}
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-4">Candidature envoyée !</h1>
              <p className="text-slate-600 mb-8">
                Merci pour votre candidature{isSpontaneous ? ' spontanée' : ` pour le poste de ${jobTitle}`}. 
                Notre équipe RH examinera votre dossier et vous contactera dans les meilleurs délais.
              </p>
              <div className="bg-cyan-50 rounded-xl p-4 mb-8">
                <p className="text-cyan-800 text-sm">
                  Un email de confirmation a été envoyé à <strong>{formData.email}</strong>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/careers"
                  className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition"
                >
                  Voir d'autres offres
                </Link>
                <Link 
                  href="/"
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
                >
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
      <Header />
      
      <main className="pt-20">
        {/* Hero */}
        <section className="relative py-16 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900"></div>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.2),transparent_70%)]"></div>
          
          <div className="relative max-w-4xl mx-auto">
            <Link href="/careers" className="inline-flex items-center gap-2 text-cyan-300 hover:text-white transition mb-8 group">
              {Icons.arrowLeft}
              <span className="group-hover:-translate-x-1 transition-transform">Retour aux offres</span>
            </Link>
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 flex-shrink-0">
                {Icons.briefcase}
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {isSpontaneous ? 'Candidature spontanée' : `Postuler : ${jobTitle}`}
                </h1>
                {!isSpontaneous && jobDepartment && (
                  <p className="text-cyan-300 text-lg">Département {jobDepartment}</p>
                )}
                <p className="text-slate-300 mt-3 max-w-2xl">
                  {isSpontaneous 
                    ? 'Aucune offre ne correspond à votre profil ? Envoyez-nous votre candidature spontanée !'
                    : 'Remplissez le formulaire ci-dessous pour postuler à cette offre d\'emploi.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12">
              {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-8">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Informations personnelles */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                  <span className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-cyan-500/20">1</span>
                  Informations personnelles
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Téléphone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                      placeholder="+243 XXX XXX XXX"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                      placeholder="Votre adresse complète"
                    />
                  </div>
                </div>
              </div>

              {/* Parcours */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                  <span className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-cyan-500/20">2</span>
                  Parcours professionnel
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Formation / Diplômes <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all resize-none"
                      placeholder="Ex: Licence en Électrotechnique - Université de Kinshasa (2020)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Expériences professionnelles <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all resize-none"
                      placeholder="Décrivez vos expériences professionnelles pertinentes..."
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        LinkedIn <span className="text-slate-400 font-normal">(optionnel)</span>
                      </label>
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                        placeholder="https://linkedin.com/in/votre-profil"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Portfolio <span className="text-slate-400 font-normal">(optionnel)</span>
                      </label>
                      <input
                        type="url"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                        placeholder="https://votre-site.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                  <span className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-cyan-500/20">3</span>
                  Documents
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      CV <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-cyan-400 hover:bg-cyan-50/50 transition-all cursor-pointer relative group">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'cv')}
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="w-14 h-14 bg-slate-100 group-hover:bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:text-cyan-500 transition-colors">{Icons.upload}</div>
                      {cvFile ? (
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-cyan-700 font-semibold">{cvFile.name}</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-slate-700 font-semibold mb-1">Glissez votre CV ici</p>
                          <p className="text-slate-500 text-sm">ou cliquez pour parcourir</p>
                        </>
                      )}
                      <p className="text-slate-400 text-xs mt-3">PDF, DOC, DOCX (max 5 Mo)</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Lettre de motivation <span className="text-slate-400 font-normal">(optionnel)</span>
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-cyan-400 hover:bg-cyan-50/50 transition-all cursor-pointer relative group">
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'cover')}
                        accept=".pdf,.doc,.docx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="w-14 h-14 bg-slate-100 group-hover:bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:text-cyan-500 transition-colors">{Icons.upload}</div>
                      {coverLetterFile ? (
                        <div className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-cyan-700 font-semibold">{coverLetterFile.name}</p>
                        </div>
                      ) : (
                        <>
                          <p className="text-slate-700 font-semibold mb-1">Lettre de motivation</p>
                          <p className="text-slate-500 text-sm">ou cliquez pour parcourir</p>
                        </>
                      )}
                      <p className="text-slate-400 text-xs mt-3">PDF, DOC, DOCX (max 5 Mo)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Motivation et disponibilité */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-4">
                  <span className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-cyan-500/20">4</span>
                  Motivation et disponibilité
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Pourquoi souhaitez-vous rejoindre Mwolo Energy Systems ? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all resize-none"
                      placeholder="Expliquez vos motivations..."
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Disponibilité <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                      >
                        <option value="">Sélectionnez...</option>
                        <option value="immediate">Immédiate</option>
                        <option value="2weeks">Sous 2 semaines</option>
                        <option value="1month">Sous 1 mois</option>
                        <option value="2months">Sous 2 mois</option>
                        <option value="3months">Sous 3 mois</option>
                        <option value="negotiable">À négocier</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Prétentions salariales <span className="text-slate-400 font-normal">(optionnel)</span>
                      </label>
                      <input
                        type="text"
                        name="salaryExpectation"
                        value={formData.salaryExpectation}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
                        placeholder="Ex: 1500 - 2000 USD"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-8 border-t border-slate-200">
                <div className="flex items-start gap-4 mb-8">
                  <input 
                    type="checkbox" 
                    id="consent"
                    required
                    className="mt-1 w-5 h-5 text-cyan-600 bg-slate-50 border-slate-300 rounded focus:ring-cyan-500 focus:ring-2 cursor-pointer"
                  />
                  <label htmlFor="consent" className="text-slate-600 cursor-pointer leading-relaxed">
                    J'accepte que mes données personnelles soient traitées conformément à la 
                    <Link href="/privacy" className="text-cyan-600 hover:text-cyan-700 font-medium hover:underline"> politique de confidentialité</Link> de Mwolo Energy Systems.
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      Envoyer ma candidature
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
