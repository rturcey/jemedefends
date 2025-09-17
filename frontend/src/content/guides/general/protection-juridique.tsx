// protection-juridique.tsx
// Guide migré automatiquement - Ne pas modifier la structure
import React from 'react';

import {
  Badge,
  Button,
  ErrorAlert,
  LegalNote,
  TextWithLegalRefs,
  StandardProcedure,
  DefaultAlternatives,
  DefaultContacts,
  DefaultGrid,
} from '@/components/ui';
import type { GuidePage } from '@/types/guides';

export const GUIDE_PROTECTION_JURIDIQUE: GuidePage = {
  metadata: {
    title: 'Protection juridique : votre assurance peut-elle couvrir votre litige ? (2025)',
    seo: {
      title: 'Protection juridique assurance : comment l\\',
      description:
        'Votre assurance habitation ou auto inclut souvent une protection juridique. Découvrez comment vérifier et activer cette garantie pour vos litiges consommation.',
      keywords: [
        'protection juridique assurance',
        'garantie défense recours',
        'assurance litige consommation',
        'frais avocat pris en charge',
        'protection juridique habitation auto',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Protection juridique : votre assurance peut-elle couvrir votre litige ? (2025)',
        url: '/guides/protection-juridique',
      },
    ],
  },
  sections: [
    {
      id: 'intro',
      title: 'L’essentiel',
      content: (
        <div className="space-y-3">
          <ErrorAlert type="info" className="text-sm sm:text-base">
            Exigez la <strong>mise en conformité</strong> (réparation ou remplacement). En cas
            d’échec: <strong>réduction du prix</strong> ou <strong>résolution</strong>. Tous frais
            incombent au vendeur.
          </ErrorAlert>
          <div className="flex flex-wrap gap-2">
            <Badge>Présomption 24&nbsp;mois</Badge>
            <Badge>Frais vendeur</Badge>
            <Badge>≤&nbsp;30&nbsp;jours</Badge>
          </div>
          <LegalNote
            title="Références légales"
            explanation="Articles détectés automatiquement dans ce guide."
            examples={['']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'verification-contrat',
      title: 'Vérifier si vous avez une protection juridique',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Multirisques habitation`} />,
                <TextWithLegalRefs text={`• Garantie "Défense-Recours"`} />,
                <TextWithLegalRefs text={`• "Protection juridique"`} />,
                <TextWithLegalRefs text={`• Montant : 3 000€ à 15 000€`} />,
                <TextWithLegalRefs text={`• Tous risques ou tiers+`} />,
                <TextWithLegalRefs text={`• Protection juridique étendue`} />,
                <TextWithLegalRefs text={`• Défense pénale et recours`} />,
                <TextWithLegalRefs text={`• Souvent 7 500€ à 20 000€`} />,
                <TextWithLegalRefs text={`• Visa Premier, Gold MasterCard`} />,
                <TextWithLegalRefs text={`• Assistance juridique`} />,
                <TextWithLegalRefs text={`• Litiges e-commerce inclus`} />,
                <TextWithLegalRefs text={`• Montants variables`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`90% des français possèdent une protection juridique sans le savoir ! Cette garantie est souvent incluse dans vos contrats d'assurance existants.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`🔍 Où chercher votre protection juridique ? 🏠 Assurance habitation • Multirisques habitation • Garantie "Défense-Recours" • "Protection juridique" • Montant : 3 000€ à 15 000€ 🚗 Assurance automobile • Tous risques ou tiers+ • Protection juridique étendue • Défense pénale et recours • Souvent 7 500€ à 20 000€ 💳 Carte bancaire premium • Visa Premier, Gold MasterCard • Assistance juridique • Litiges e-commerce inclus • Montants variables 🏢 Assurance professionnelle • RC professionnelle • Multirisques entreprise • Protection juridique pro • Couvre litiges perso parfois 📋 Documents à examiner Conditions générales Chapitre "Protection juridique" Tableau des garanties Montants et plafonds Conditions particulières Vos garanties spécifiques`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'activation-garantie',
      title: 'Comment activer votre protection juridique ?',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Téléphone : n° sur votre contrat`} />,
                <TextWithLegalRefs text={`• Email : sinistres@assureur.fr`} />,
                <TextWithLegalRefs text={`• Courrier RAR (+ sûr)`} />,
                <TextWithLegalRefs text={`• Espace client en ligne`} />,
                <TextWithLegalRefs text={`• N° de contrat et nom assuré`} />,
                <TextWithLegalRefs text={`• Date et nature du litige`} />,
                <TextWithLegalRefs text={`• Adversaire (nom, adresse)`} />,
                <TextWithLegalRefs text={`• Montant en jeu`} />,
                <TextWithLegalRefs text={`• Facture d'achat`} />,
                <TextWithLegalRefs text={`• Correspondances avec le pro`} />,
                <TextWithLegalRefs text={`• Photos du défaut`} />,
                <TextWithLegalRefs text={`• Conditions générales de vente`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`1 📞 Déclarer le sinistre Délai impératif : 5 jours ouvrés après connaissance du litige (souvent extensible à 20 jours)`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`📧 Moyens de déclaration • Téléphone : n° sur votre contrat • Email : sinistres@assureur.fr • Courrier RAR (+ sûr) • Espace client en ligne 📋 Informations à donner • N° de contrat et nom assuré • Date et nature du litige • Adversaire (nom, adresse) • Montant en jeu 2 📄 Constituer le dossier 🗂️ Pièces indispensables • Facture d'achat • Correspondances avec le pro • Photos du défaut • Conditions générales de vente • Devis de réparation • Expertise technique si existante • Mise en demeure envoyée • Tout élément de preuve 💡 Conseil : Numérisez tous vos documents. La plupart des assureurs acceptent maintenant les envois dématérialisés.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`3 ⚖️ Analyse juridique L'assureur fait analyser votre dossier par un juriste pour évaluer vos chances de succès.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`✅ Si chances > 50% • Prise en charge immédiate • Assignation d'un avocat • Avance des frais • Négociation amiable d'abord ❌ Si chances • Refus de prise en charge • Possibilité de recours interne • Médiation avec l'assureur • Expertise contradictoire`}
            />
          </p>
        </div>
      ),
    },
    { id: 'procedure', title: 'Procédure type', content: <StandardProcedure /> },
    { id: 'alternatives', title: 'Si ça bloque', content: <DefaultAlternatives /> },
    { id: 'contacts', title: 'Contacts utiles', content: <DefaultContacts /> },
    {
      id: 'cta',
      title: 'Passer à l’action',
      content: (
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Button asChild>
            <a href="/eligibilite">🚀 Générer ma mise en demeure</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/guides">📚 Voir tous les guides</a>
          </Button>
        </div>
      ),
    },
  ],
  legal: {
    mainArticles: [],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};
