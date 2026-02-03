'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Politique de Confidentialité</h1>
            <p className="text-gray-400">Dernière mise à jour : Février 2026</p>
          </div>

          {/* Content */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                Mwolo Energy Systems s'engage à protéger la vie privée de ses clients. Cette politique 
                de confidentialité explique comment nous collectons, utilisons et protégeons vos données 
                personnelles conformément à la législation en vigueur en République Démocratique du Congo.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Données collectées</h2>
              <p className="text-gray-300 leading-relaxed mb-4">Nous collectons les types de données suivants :</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong className="text-white">Données d'identification :</strong> nom, prénom, adresse, numéro de téléphone, email</li>
                <li><strong className="text-white">Données de consommation :</strong> relevés de compteur, historique de consommation</li>
                <li><strong className="text-white">Données de paiement :</strong> historique des transactions, méthodes de paiement utilisées</li>
                <li><strong className="text-white">Données techniques :</strong> adresse IP, type de navigateur, données de connexion</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Utilisation des données</h2>
              <p className="text-gray-300 leading-relaxed mb-4">Vos données sont utilisées pour :</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Gérer votre compte client et vos abonnements</li>
                <li>Facturer et encaisser vos consommations d'énergie</li>
                <li>Assurer le suivi technique de vos installations</li>
                <li>Vous envoyer des communications importantes (factures, alertes, etc.)</li>
                <li>Améliorer nos services et votre expérience client</li>
                <li>Respecter nos obligations légales et réglementaires</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Partage des données</h2>
              <p className="text-gray-300 leading-relaxed">
                Nous ne vendons jamais vos données personnelles. Nous pouvons les partager uniquement avec :
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mt-4">
                <li>Nos partenaires techniques pour l'installation et la maintenance</li>
                <li>Les autorités compétentes sur demande légale</li>
                <li>Nos prestataires de paiement pour le traitement des transactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">5. Sécurité des données</h2>
              <p className="text-gray-300 leading-relaxed">
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour 
                protéger vos données contre tout accès non autorisé, modification, divulgation ou 
                destruction. Cela inclut le chiffrement des données sensibles et des audits de sécurité réguliers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">6. Conservation des données</h2>
              <p className="text-gray-300 leading-relaxed">
                Vos données personnelles sont conservées pendant la durée de votre contrat et pendant 
                une période de 5 ans après la fin de la relation contractuelle, conformément aux 
                obligations légales de conservation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">7. Vos droits</h2>
              <p className="text-gray-300 leading-relaxed mb-4">Vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li><strong className="text-white">Droit d'accès :</strong> obtenir une copie de vos données</li>
                <li><strong className="text-white">Droit de rectification :</strong> corriger vos données inexactes</li>
                <li><strong className="text-white">Droit à l'effacement :</strong> demander la suppression de vos données</li>
                <li><strong className="text-white">Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
                <li><strong className="text-white">Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">8. Cookies</h2>
              <p className="text-gray-300 leading-relaxed">
                Notre site utilise des cookies pour améliorer votre expérience de navigation. Vous pouvez 
                gérer vos préférences de cookies via les paramètres de votre navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">9. Contact</h2>
              <p className="text-gray-300 leading-relaxed">
                Pour exercer vos droits ou pour toute question relative à cette politique, contactez notre 
                Délégué à la Protection des Données :
              </p>
              <div className="mt-4 p-4 bg-slate-900/50 rounded-xl">
                <p className="text-green-400">📧 privacy@mwolo-energy.com</p>
                <p className="text-gray-400 mt-2">📞 +243 800 123 456</p>
                <p className="text-gray-400 mt-2">📍 123 Avenue de l'Énergie, Kinshasa, RDC</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
