import type { Metadata } from 'next';
import Script from 'next/script';
import { Target, CreditCard, RotateCcwLeft } from 'lucide-react';

import LegalLayout from '@/components/legal/LegalLayout';
import LegalSection from '@/components/legal/LegalSection';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation | Je me défends",
  description:
    "Conditions générales d'utilisation du service Je me défends : formules, tarifs, commande, paiement, droit de rétractation et responsabilités.",
  keywords: [
    'conditions générales',
    'CGU',
    'CGV',
    'tarifs',
    'droit de rétractation',
    'service juridique',
    'Je me défends',
  ],
  alternates: { canonical: '/conditions-generales' },
  openGraph: {
    title: 'Conditions générales - Je me défends',
    description: "Règles d'utilisation du service de génération de lettres de mise en demeure",
    url: 'https://jemedefends.fr/conditions-generales',
    siteName: 'Je me défends',
    type: 'website',
  },
};

const TOC_ITEMS = [
  { id: 'objet', label: 'Objet du service', icon: <Target className="w-4 h-4" /> },
  { id: 'formules', label: 'Formules et tarifs', icon: <CreditCard className="w-4 h-4" /> },
  {
    id: 'retractation',
    label: 'Droit de rétractation',
    icon: <RotateCcwLeft className="w-4 h-4" />,
  },
];

export default function ConditionsGeneralesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TermsOfService',
    name: "Conditions générales d'utilisation - Je me défends",
    url: 'https://jemedefends.fr/conditions-generales',
    creator: {
      '@type': 'Organization',
      name: 'Je me défends',
      legalName: 'Richard Turcey',
    },
    dateModified: new Date().toISOString(),
    inLanguage: 'fr-FR',
  };

  return (
    <>
      <Script
        id="terms-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <LegalLayout
        title="Conditions générales d'utilisation"
        subtitle="Règles d'utilisation du service Je me défends et modalités de commande."
        toc={TOC_ITEMS}
      >
        <LegalSection id="objet" title="Objet du service">
          <p>
            <strong>Je me défends</strong> est un service d'assistance juridique qui permet de
            générer des lettres de mise en demeure fondées sur le Code de la consommation.
          </p>

          <Alert className="bg-blue-50 border-blue-200">
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Ce service ne constitue pas un conseil juridique personnalisé. Il s'agit d'un outil
              d'assistance basé sur des informations générales.
            </AlertDescription>
          </Alert>

          <p>
            Trois formules sont proposées : gratuite (téléchargement simple), PDF professionnel
            (4,99€) et complète avec envoi postal (12,99€).
          </p>
        </LegalSection>

        <LegalSection id="formules" title="Formules et tarifs">
          <div className="grid gap-3">
            <Card className="p-4 bg-green-50 border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">Formule gratuite</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Génération de lettre conforme</li>
                <li>• Articles du Code de la consommation</li>
                <li>• Format texte à imprimer</li>
                <li>• Signature manuelle requise</li>
              </ul>
            </Card>

            <Card className="p-4 bg-blue-50 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">PDF Professionnel - 4,99€</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Tout de la version gratuite</li>
                <li>• PDF mis en forme avec logo</li>
                <li>• Signature électronique intégrée</li>
                <li>• Support email illimité</li>
              </ul>
            </Card>

            <Card className="p-4 bg-purple-50 border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">Formule complète - 12,99€</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Tous les avantages PDF</li>
                <li>• Impression et envoi en recommandé AR</li>
                <li>• Suivi postal en ligne</li>
                <li>• Preuve juridique d'envoi</li>
              </ul>
            </Card>
          </div>

          <p className="text-sm text-gray-600">
            <strong>Prestataires :</strong> Paiements via Stancer (France), envois via Merci
            Facteur, hébergement Scaleway (France).
          </p>
        </LegalSection>

        <LegalSection id="retractation" title="Droit de rétractation">
          <p>
            Conformément à l'article L.221-18 du Code de la consommation, vous disposez d'un délai
            de rétractation de <strong>14 jours</strong> à compter de la commande.
          </p>

          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900">
            <AlertTitle>Exception importante (art. L.221-28)</AlertTitle>
            <AlertDescription>
              Le droit de rétractation ne peut être exercé pour les services{' '}
              <strong>entièrement exécutés</strong> avant la fin du délai avec accord exprès du
              consommateur.
            </AlertDescription>
          </Alert>

          <Card className="p-4 bg-gray-50 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Application pratique :</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                <strong>Avant génération :</strong> rétractation possible intégralement
              </li>
              <li>
                <strong>Après génération PDF :</strong> rétractation impossible (service rendu)
              </li>
              <li>
                <strong>Envoi postal non effectué :</strong> rétractation partielle possible
              </li>
              <li>
                <strong>Erreur technique :</strong> remboursement intégral garanti
              </li>
            </ul>
          </Card>

          <p className="text-sm text-gray-600">
            En validant votre commande, vous reconnaissez que le service sera exécuté immédiatement
            et renoncez expressément à votre droit de rétractation.
          </p>
        </LegalSection>
      </LegalLayout>
    </>
  );
}
