'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Mentions Légales</h1>
            <p className="text-gray-400">Informations légales sur Mwolo Energy Systems</p>
          </div>

          {/* Content */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Éditeur du site</h2>
              <div className="bg-slate-900/50 rounded-xl p-6">
                <p className="text-gray-300 mb-2"><strong className="text-white">Raison sociale :</strong> Mwolo Energy Systems SARL</p>
                <p className="text-gray-300 mb-2"><strong className="text-white">Siège social :</strong> 123 Avenue de l'Énergie, Quartier Commercial, Kinshasa</p>
                <p className="text-gray-300 mb-2"><strong className="text-white">Pays :</strong> République Démocratique du Congo</p>
                <p className="text-gray-300 mb-2"><strong className="text-white">Capital social :</strong> 50 000 000 CDF</p>
                <p className="text-gray-300 mb-2"><strong className="text-white">RCCM :</strong> CD/KIN/RCCM/26-B-12345</p>
                <p className="text-gray-300 mb-2"><strong className="text-white">ID National :</strong> 01-93-N12345X</p>
                <p className="text-gray-300 mb-2"><strong className="text-white">Numéro impôt :</strong> A1234567Z</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Direction de la publication</h2>
              <div className="bg-slate-900/50 rounded-xl p-6">
                <p className="text-gray-300 mb-2"><strong className="text-white">Directeur de la publication :</strong> M. Jean-Pierre Mwolo</p>
                <p className="text-gray-300 mb-2"><strong className="text-white">Fonction :</strong> Directeur Général</p>
                <p className="text-gray-300"><strong className="text-white">Email :</strong> direction@mwolo-energy.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Hébergement</h2>
              <div className="bg-slate-900/50 rounded-xl p-6">
                <p className="text-gray-300 mb-2"><strong className="text-white">Hébergeur :</strong> Vercel Inc.</p>
                <p className="text-gray-300 mb-2"><strong className="text-white">Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
                <p className="text-gray-300"><strong className="text-white">Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">https://vercel.com</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Contact</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-900/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3">Service client</h3>
                  <p className="text-gray-300 mb-1">📞 +243 800 123 456 (Gratuit)</p>
                  <p className="text-gray-300 mb-1">📧 contact@mwolo-energy.com</p>
                  <p className="text-gray-300">🕐 Lun-Ven: 8h-17h</p>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-3">Support technique</h3>
                  <p className="text-gray-300 mb-1">📞 +243 999 888 777</p>
                  <p className="text-gray-300 mb-1">📧 support@mwolo-energy.com</p>
                  <p className="text-gray-300">🕐 24h/24 - 7j/7</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Propriété intellectuelle</h2>
              <p className="text-gray-300 leading-relaxed">
                L'ensemble des éléments constituant ce site (textes, images, logos, graphismes, icônes, 
                logiciels, etc.) sont la propriété exclusive de Mwolo Energy Systems ou de ses partenaires. 
                Toute reproduction, représentation, modification, publication ou adaptation de tout ou 
                partie des éléments du site est interdite sans autorisation préalable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Réglementation applicable</h2>
              <p className="text-gray-300 leading-relaxed">
                Mwolo Energy Systems exerce ses activités en conformité avec :
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mt-4">
                <li>La loi n°14/011 du 17 juin 2014 relative au secteur de l'électricité en RDC</li>
                <li>Les règlements de l'Autorité de Régulation du Secteur de l'Électricité (ARE)</li>
                <li>Le Code des investissements de la RDC</li>
                <li>Les normes environnementales en vigueur</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Litiges</h2>
              <p className="text-gray-300 leading-relaxed">
                En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, 
                les tribunaux de Kinshasa seront seuls compétents pour trancher le différend.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Crédits</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Ce site a été conçu et développé par l'équipe technique de Mwolo Energy Systems.
              </p>
              <div className="flex flex-wrap gap-4">
                <span className="px-4 py-2 bg-slate-900 rounded-lg text-gray-400 text-sm">Next.js</span>
                <span className="px-4 py-2 bg-slate-900 rounded-lg text-gray-400 text-sm">React</span>
                <span className="px-4 py-2 bg-slate-900 rounded-lg text-gray-400 text-sm">Tailwind CSS</span>
                <span className="px-4 py-2 bg-slate-900 rounded-lg text-gray-400 text-sm">Django</span>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
