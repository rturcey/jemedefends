import type { Metadata } from 'next';
import Script from 'next/script';

import LegalLayout from '@/components/legal/LegalLayout';
import LegalSection from '@/components/legal/LegalSection';
import { KeyValue } from '@/components';

const metadata: Metadata = {
  title: 'Mentions légales | Je me défends',
  description:
    'Mentions légales du site Je me défends : éditeur (EI Richard Turcey), hébergeur (Scaleway), contact, propriété intellectuelle, données personnelles et responsabilités.',
  alternates: { canonical: '/mentions-legales' },
};

export default function MentionsLegalesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Je me défends',
    url: 'https://jemedefends.fr',
    legalName: 'Richard Turcey',
    identifier: {
      '@type': 'PropertyValue',
      name: 'SIREN',
      value: '987801073',
    },
  };

  return (
    <>
      <Script
        id="org-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <LegalLayout
          title="Mentions légales"
          subtitle="Informations relatives à l'éditeur, l'hébergeur et les conditions d'utilisation du site."
        >
          <LegalSection id="editeur" title="🏢 Éditeur du site">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="space-y-0">
                <KeyValue label="Dénomination" value="Richard Turcey – Entrepreneur individuel" />
                <KeyValue label="Nom commercial" value="Je me défends" />
                <KeyValue label="SIREN" value="987 801 073" />
                <KeyValue label="SIRET" value="98780107300022" />
                <KeyValue label="Code APE" value="62.01Z – Programmation informatique" />
                <KeyValue label="Adresse" value="2 Rue André Bouillar, 40220 Tarnos, France" />
                <KeyValue
                  label="Contact"
                  value={
                    <a
                      href="mailto:contact@jemedefends.fr"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      contact@jemedefends.fr
                    </a>
                  }
                />
                <KeyValue label="Responsable de publication" value="Richard Turcey" />
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-yellow-800">
                <strong>ℹ️ Important :</strong> Ce site fournit des informations et des outils
                fondés sur le Code de la consommation. Il ne constitue pas un conseil juridique
                individualisé.
              </p>
            </div>
          </LegalSection>

          <LegalSection id="hebergeur" title="🌐 Hébergeur">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="space-y-0">
                <KeyValue label="Société" value="Scaleway SAS" />
                <KeyValue label="Adresse" value="8 rue de la Ville l'Évêque, 75008 Paris, France" />
                <KeyValue
                  label="Site web"
                  value={
                    <a
                      href="https://www.scaleway.com/fr/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      scaleway.com/fr
                    </a>
                  }
                />
              </div>
            </div>
          </LegalSection>

          <LegalSection id="donnees" title="🔒 Données personnelles">
            <p>
              Nous collectons uniquement les informations nécessaires à la génération de votre
              lettre. Hébergement en France (Scaleway), paiements via Stancer, envois postaux par
              Merci Facteur.
            </p>
            <p>
              Pour plus de détails, consultez notre{' '}
              <a
                href="/politique-confidentialite"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                politique de confidentialité
              </a>
              .
            </p>
          </LegalSection>

          <LegalSection id="propriete" title="⚖️ Propriété intellectuelle">
            <p>
              Les contenus du site (textes, interfaces, design, logo) sont protégés par le droit
              d'auteur. Toute reproduction sans autorisation est interdite.
            </p>
            <p>
              Les extraits d'articles de loi appartiennent au domaine public, mais leur sélection et
              présentation constituent une œuvre originale.
            </p>
          </LegalSection>

          <LegalSection id="responsabilite" title="⚠️ Responsabilité">
            <p>
              Nous mettons à disposition des informations fiables et à jour, mais ne garantissons
              pas l'issue d'un litige. L'utilisateur reste responsable de ses démarches.
            </p>
            <p>Les liens externes sont fournis à titre informatif, sans garantie de contenu.</p>
          </LegalSection>

          <LegalSection id="credits" title="🙏 Crédits">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span>✍️</span>
                <span>Éditeur : Richard Turcey</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🌐</span>
                <span>Hébergement : Scaleway (France)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💳</span>
                <span>Paiements : Stancer (France)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📮</span>
                <span>Envois postaux : Merci Facteur</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🎨</span>
                <span>Icônes : Lucide Dev</span>
              </div>
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
