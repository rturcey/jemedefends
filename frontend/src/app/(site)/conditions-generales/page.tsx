import type {Metadata} from 'next';
import Script from 'next/script';

import {KeyValue} from '@/components';
import LegalLayout from '@/components/legal/LegalLayout';
import LegalSection from '@/components/legal/LegalSection';

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
    alternates: {canonical: '/conditions-generales'},
    openGraph: {
        title: 'Conditions générales - Je me défends',
        description: "Règles d'utilisation du service de génération de lettres de mise en demeure",
        url: 'https://jemedefends.fr/conditions-generales',
        siteName: 'Je me défends',
        type: 'website',
    },
};

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
                dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
            />
            <main>
                <LegalLayout
                    title="Conditions générales d'utilisation"
                    subtitle="Règles d'utilisation du service Je me défends et modalités de commande."
                >
                    <LegalSection id="objet" title="🎯 Objet du service">
                        <p>
                            <strong>Je me défends</strong> est un service d'assistance
                            juridique qui permet de
                            générer des lettres de mise en demeure fondées sur le Code
                            de la consommation.
                        </p>
                        <div
                            className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800">
                                <strong>Important :</strong> Ce service ne constitue pas
                                un conseil juridique
                                personnalisé. Il s'agit d'un outil d'assistance basé sur
                                des informations générales.
                            </p>
                        </div>
                        <p>
                            Trois formules sont proposées : gratuite (téléchargement
                            simple), PDF professionnel
                            (4,99€) et complète avec envoi postal (12,99€).
                        </p>
                    </LegalSection>

                    <LegalSection id="formules" title="💳 Formules et tarifs">
                        <div className="space-y-4">
                            <div
                                className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h4 className="font-semibold text-green-900 mb-2">🆓
                                    Formule gratuite</h4>
                                <ul className="text-sm text-green-800 space-y-1">
                                    <li>• Génération de lettre conforme</li>
                                    <li>• Articles du Code de la consommation</li>
                                    <li>• Format texte à imprimer</li>
                                    <li>• Signature manuelle requise</li>
                                </ul>
                            </div>

                            <div
                                className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 mb-2">📄 PDF
                                    Professionnel - 4,99€</h4>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Tout de la version gratuite</li>
                                    <li>• PDF mis en forme avec logo</li>
                                    <li>• Signature électronique intégrée</li>
                                    <li>• Support email illimité</li>
                                </ul>
                            </div>

                            <div
                                className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <h4 className="font-semibold text-purple-900 mb-2">📮
                                    Formule complète - 12,99€</h4>
                                <ul className="text-sm text-purple-800 space-y-1">
                                    <li>• Tous les avantages PDF</li>
                                    <li>• Impression et envoi en recommandé AR</li>
                                    <li>• Suivi postal en ligne</li>
                                    <li>• Preuve juridique d'envoi</li>
                                </ul>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mt-4">
                            <strong>Prestataires :</strong> Paiements via Stancer
                            (France), envois via Merci
                            Facteur, hébergement Scaleway (France).
                        </p>
                    </LegalSection>

                    <LegalSection id="retractation" title="↩️ Droit de rétractation">
                        <p>
                            Conformément à l'article L.221-18 du Code de la
                            consommation, vous disposez d'un délai
                            de rétractation de <strong>14 jours</strong> à compter de la
                            commande.
                        </p>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-semibold text-red-900 mb-2">
                                Exception importante (art. L.221-28)
                            </h4>
                            <p className="text-sm text-red-800">
                                Le droit de rétractation ne peut être exercé pour les
                                services{' '}
                                <strong>entièrement exécutés</strong>
                                avant la fin du délai de rétractation avec accord exprès
                                du consommateur.
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mt-4">
                            <h4 className="font-semibold text-gray-900 mb-3">Application
                                pratique :</h4>
                            <div className="space-y-0">
                                <KeyValue label="Avant génération"
                                          value="Rétractation possible intégralement"/>
                                <KeyValue
                                    label="Après génération PDF"
                                    value="Rétractation impossible (service rendu)"
                                />
                                <KeyValue
                                    label="Envoi postal non effectué"
                                    value="Rétractation partielle possible"
                                />
                                <KeyValue label="Erreur technique"
                                          value="Remboursement intégral garanti"/>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mt-3">
                            En validant votre commande, vous reconnaissez que le service
                            sera exécuté
                            immédiatement et renoncez expressément à votre droit de
                            rétractation.
                        </p>
                    </LegalSection>

                    {/* Autres sections similaires... */}
                </LegalLayout>
            </main>
        </>
    );
}
