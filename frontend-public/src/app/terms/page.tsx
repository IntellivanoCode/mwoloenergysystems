'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Conditions Générales d'Utilisation</h1>
            <p className="text-gray-400">Dernière mise à jour : Février 2026</p>
          </div>

          {/* Content */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Objet</h2>
              <p className="text-gray-300 leading-relaxed">
                Les présentes Conditions Générales d'Utilisation (CGU) régissent l'utilisation des services 
                proposés par Mwolo Energy Systems, société spécialisée dans la fourniture d'électricité 
                et de solutions énergétiques solaires en République Démocratique du Congo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Acceptation des conditions</h2>
              <p className="text-gray-300 leading-relaxed">
                En accédant à nos services ou en utilisant notre site web, vous acceptez d'être lié par 
                ces conditions. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Services proposés</h2>
              <p className="text-gray-300 leading-relaxed mb-4">Mwolo Energy Systems propose les services suivants :</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Fourniture d'électricité aux particuliers et entreprises</li>
                <li>Installation de panneaux solaires et systèmes photovoltaïques</li>
                <li>Maintenance et entretien des installations électriques</li>
                <li>Gestion des compteurs intelligents</li>
                <li>Services de paiement en ligne et en agence</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Obligations du client</h2>
              <p className="text-gray-300 leading-relaxed mb-4">Le client s'engage à :</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Fournir des informations exactes et à jour lors de l'inscription</li>
                <li>Payer ses factures dans les délais impartis</li>
                <li>Ne pas manipuler ou altérer les équipements de comptage</li>
                <li>Signaler toute anomalie ou dysfonctionnement</li>
                <li>Respecter les normes de sécurité électrique en vigueur</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Tarification et paiement</h2>
              <p className="text-gray-300 leading-relaxed">
                Les tarifs de nos services sont disponibles sur demande et peuvent varier selon le type 
                d'abonnement choisi. Le paiement peut s'effectuer par mobile money, virement bancaire, 
                ou en espèces dans nos agences. Tout retard de paiement peut entraîner des pénalités 
                et/ou une suspension du service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Responsabilité</h2>
              <p className="text-gray-300 leading-relaxed">
                Mwolo Energy Systems s'efforce d'assurer la continuité du service mais ne peut être 
                tenue responsable des interruptions dues à des cas de force majeure, des travaux de 
                maintenance programmés, ou des défaillances du réseau national.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Résiliation</h2>
              <p className="text-gray-300 leading-relaxed">
                Le client peut résilier son contrat à tout moment avec un préavis de 30 jours. 
                Mwolo Energy Systems se réserve le droit de résilier le contrat en cas de non-paiement 
                prolongé ou de violation des présentes conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Modification des CGU</h2>
              <p className="text-gray-300 leading-relaxed">
                Mwolo Energy Systems se réserve le droit de modifier ces conditions à tout moment. 
                Les modifications seront notifiées aux clients par email ou via le site web.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Contact</h2>
              <p className="text-gray-300 leading-relaxed">
                Pour toute question concernant ces conditions, veuillez nous contacter à :
              </p>
              <div className="mt-4 p-4 bg-slate-900/50 rounded-xl">
                <p className="text-cyan-400">📧 legal@mwolo-energy.com</p>
                <p className="text-gray-400 mt-2">📞 +243 800 123 456</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
