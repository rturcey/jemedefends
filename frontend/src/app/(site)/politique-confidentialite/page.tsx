import type { Metadata } from 'next';
import Script from 'next/script';

import LegalLayout from '@/components/legal/LegalLayout';
import LegalSection from '@/components/legal/LegalSection';

const metadata: Metadata = {
  title: 'Politique de confidentialité | Je me défends',
  description:
    'Politique de confidentialité de Je me défends : données collectées, finalités, hébergement, droits RGPD et prestataires.',
  alternates: { canonical: '/politique-confidentialite' },
};

export default function PolitiqueConfidentialitePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Politique de confidentialité – Je me défends',
    url: 'https://jemedefends.fr/politique-confidentialite',
  };

  return (
    <>
      <Script
        id="privacy-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <LegalLayout
          title="Politique de confidentialité"
          subtitle="Comment nous collectons, utilisons et protégeons vos données personnelles."
        >
          <LegalSection id="collecte" title="📊 Collecte des données">
            <p>
              <strong>Principe de minimisation :</strong> Nous collectons uniquement les
              informations strictement nécessaires à la génération de votre lettre.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-3">
              <p className="text-sm text-blue-800">
                <strong>Données collectées :</strong> identité et coordonnées de l'expéditeur,
                coordonnées du destinataire, informations sur le produit/service et description du
                litige.
              </p>
            </div>
            <p className="mt-3">
              <strong>Aucune donnée superflue ni sensible</strong> n'est collectée.
            </p>
          </LegalSection>

          <LegalSection id="finalites" title="🎯 Finalités et bases légales">
            <div className="space-y-4">
              <div className="border-l-4 border-green-400 bg-green-50 p-4 rounded-r-lg">
                <h4 className="font-semibold text-green-900 mb-2">✅ Génération de la lettre</h4>
                <p className="text-sm text-green-800">
                  <strong>Base légale :</strong> exécution d'une mesure précontractuelle à la
                  demande de l'utilisateur
                </p>
              </div>

              <div className="border-l-4 border-blue-400 bg-blue-50 p-4 rounded-r-lg">
                <h4 className="font-semibold text-blue-900 mb-2">
                  💳 Paiements (formules payantes)
                </h4>
                <p className="text-sm text-blue-800">
                  <strong>Base légale :</strong> exécution du contrat
                  <br />
                  <strong>Prestataire :</strong> Stancer (France)
                </p>
              </div>

              <div className="border-l-4 border-orange-400 bg-orange-50 p-4 rounded-r-lg">
                <h4 className="font-semibold text-orange-900 mb-2">
                  📮 Envoi postal (option recommandé)
                </h4>
                <p className="text-sm text-orange-800">
                  <strong>Base légale :</strong> exécution du contrat
                  <br />
                  <strong>Prestataire :</strong> Merci Facteur
                </p>
              </div>

              <div className="border-l-4 border-purple-400 bg-purple-50 p-4 rounded-r-lg">
                <h4 className="font-semibold text-purple-900 mb-2">📈 Amélioration du service</h4>
                <p className="text-sm text-purple-800">Statistiques anonymisées uniquement</p>
              </div>
            </div>
          </LegalSection>

          <LegalSection id="hebergement" title="🇫🇷 Hébergement">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                <strong>🏢 Scaleway SAS</strong>
                <br />
                📍 8 rue de la Ville l'Évêque, 75008 Paris, France
                <br />
                🌐{' '}
                <a
                  href="https://www.scaleway.com"
                  target="_blank"
                  rel="noopener"
                  className="text-green-700 font-medium"
                >
                  scaleway.com
                </a>
              </p>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Toutes vos données restent sur le territoire français.
            </p>
          </LegalSection>

          <LegalSection id="duree" title="⏱️ Durée de conservation">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>🚀 Suppression immédiate :</strong> Les données sont supprimées ou
                anonymisées dès que la lettre est générée et transmise.
              </p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p>
                <strong>Paiements :</strong> conservés par Stancer selon les obligations légales
              </p>
              <p>
                <strong>Envois postaux :</strong> gérés par Merci Facteur selon leurs conditions
              </p>
            </div>
          </LegalSection>

          <LegalSection id="droits" title="🛡️ Vos droits RGPD">
            <p>Vous disposez des droits suivants sur vos données personnelles :</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900 mb-1">🔍 Accès</h4>
                <p className="text-sm text-gray-600">Savoir quelles données nous avons</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900 mb-1">✏️ Rectification</h4>
                <p className="text-sm text-gray-600">Corriger les informations inexactes</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900 mb-1">🗑️ Effacement</h4>
                <p className="text-sm text-gray-600">Demander la suppression</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <h4 className="font-semibold text-gray-900 mb-1">⏸️ Limitation</h4>
                <p className="text-sm text-gray-600">Limiter le traitement</p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-blue-800">
                <strong>📧 Pour exercer vos droits :</strong>{' '}
                <a
                  href="mailto:privacy@jemedefends.fr"
                  className="font-medium text-blue-700 hover:text-blue-800"
                >
                  privacy@jemedefends.fr
                </a>
              </p>
              <p className="text-sm text-blue-700 mt-2">
                Si nécessaire, vous pouvez saisir la CNIL.
              </p>
            </div>
          </LegalSection>

          <LegalSection id="cookies" title="🍪 Cookies">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">
                <strong>✅ Cookies essentiels uniquement</strong>
                <br />
                Aucune publicité ciblée, aucun suivi commercial.
              </p>
            </div>
          </LegalSection>

          <LegalSection id="transparence" title="💎 Engagement transparence">
            <p>Nous mettons un point d'honneur à :</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  📉
                </span>
                <span className="text-sm">Limiter la collecte au minimum</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  🔍
                </span>
                <span className="text-sm">Rester transparents</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  🇫🇷
                </span>
                <span className="text-sm">Héberger en France</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  🆓
                </span>
                <span className="text-sm">Maintenir le gratuit</span>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-yellow-800 text-sm">
                <strong>🤝 Promesse :</strong> Le service gratuit restera toujours accessible afin
                que chacun puisse défendre ses droits sans barrière financière.
              </p>
            </div>
          </LegalSection>

          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>
          </div>
        </LegalLayout>
      </main>
    </>
  );
}
