// casque-audio-haut-de-gamme-defaut-garantie-legale.tsx
// Guide migré automatiquement - Ne pas modifier la structure
import type { GuidePage } from '@/types/guides';
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
import type { LegalArticleId } from '@/legal/registry';
import React from 'react';

export const GUIDE_CASQUE_AUDIO_HAUT_DE_GAMME_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Casque audio haut de gamme : vos recours 2025`,
    seo: {
      title: `Casque audio défectueux : garantie légale 2025`,
      description: `Casque Bose/Sony/Apple en panne ? Réparation, remplacement ou remboursement sous 2 ans. Générez votre mise en demeure en 3 minutes.`,
      keywords: [
        'casque audio garantie légale',
        'Bose casque panne recours',
        'Sony WH-1000XM défaut réparation',
        'AirPods Max grésillement garantie',
        'casque haut de gamme coupure son',
        'batterie casque ne tient pas',
        'SAV refuse garantie casque',
        'remboursement casque défectueux',
        'mise en demeure vendeur casque',
        'garantie légale L.217-9 casque',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Casque audio haut de gamme : vos recours 2025`,
        url: `/guides/casque-audio-haut-de-gamme-defaut-garantie-legale`,
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
            d’échec : <strong>réduction du prix</strong> ou <strong>résolution</strong>. Tous frais
            incombent au vendeur.
          </ErrorAlert>
          <div className="flex flex-wrap gap-2">
            <Badge>Présomption 24 mois</Badge>
            <Badge>Frais vendeur</Badge>
            <Badge>≤ 30 jours</Badge>
          </div>
          <LegalNote
            title="Références légales"
            explanation="Articles détectés automatiquement dans ce guide."
            examples={['L.217-11', 'L.217-13', 'L.217-3', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Les 8 défauts casque audio couverts par la garantie légale`,
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Coupures/bluetooth instable`} />,
                <TextWithLegalRefs text={`• Grésillements/cliquetis anormaux`} />,
                <TextWithLegalRefs text={`• ANC inefficace ou défaillant`} />,
                <TextWithLegalRefs text={`• Volume ou canaux déséquilibrés`} />,
                <TextWithLegalRefs text={`• Batterie qui chute anormalement`} />,
                <TextWithLegalRefs text={`• Charge impossible/port défectueux`} />,
                <TextWithLegalRefs text={`• Échauffement anormal en charge`} />,
                <TextWithLegalRefs text={`• Indication batterie erronée`} />,
              ] as React.ReactNode[]
            }
          />{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`La garantie légale (Art. L.217-3 à L.217-9 ) impose au vendeur de livrer un produit conforme et d'assumer les défauts pendant 2 ans (12 mois pour l'occasion). Exemples couverts :`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Défauts techniques • Coupures/bluetooth instable • Grésillements/cliquetis anormaux • ANC inefficace ou défaillant • Volume ou canaux déséquilibrés Autonomie & charge • Batterie qui chute anormalement • Charge impossible/port défectueux • Échauffement anormal en charge • Indication batterie erronée Présomption (Art. L.217-7) : tout défaut apparu dans les 2 ans est présumé exister au jour de la livraison. Au vendeur de prouver l’incompatibilité avec un usage normal.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Procédure étape par étape : obtenir réparation/remboursement`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Important : votre interlocuteur légal est uniquement le vendeur . Ne vous laissez pas renvoyer vers la marque.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`1 Rassemblez les preuves Facture, vidéos du défaut, page produit (promesses), échanges écrits.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`2 Contact amiable Annoncez la garantie légale (Art. L.217-9) et demandez réparation ou remplacement .`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`3 Mise en demeure Écrite et datée, rappelant L.217-3, L.217-7, L.217-9, L.217-11. Délai 15 jours.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Générer ma lettre → 4 Si échec Exigez réduction du prix ou remboursement (Art. L.217-14, L.217-16, L.217-17). Tous frais à la charge du vendeur (L.217-11).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Spécificités par enseigne/marque : qui est le plus conciliant`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            Panorama des pratiques par enseigne : qualité d’accueil, délais moyens, facilité de
            remplacement.
          </p>
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
                />,
              ] as React.ReactNode[]
            }
          />
        </div>
      ),
    },
    {
      id: 'procedure',
      title: 'Procédure type',
      content: <StandardProcedure />,
    },
    {
      id: 'alternatives',
      title: 'Si ça bloque',
      content: <DefaultAlternatives />,
    },
    {
      id: 'contacts',
      title: 'Contacts utiles',
      content: <DefaultContacts />,
    },
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-3' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};
