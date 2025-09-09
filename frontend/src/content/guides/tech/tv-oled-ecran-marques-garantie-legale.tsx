// tv-oled-ecran-marques-garantie-legale.tsx
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

export const GUIDE_TV_OLED_ECRAN_MARQUES_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `TV OLED défectueuse : vos recours 2025`,
    seo: {
      title: `TV OLED en panne : garantie légale 2025`,
      description: `Pixels morts, marquage, HDMI eARC/CEC instable ? Exigez réparation, remplacement ou remboursement sous 2 ans. Lettre conforme en 3 minutes.`,
      keywords: [
        'tv oled garantie légale',
        'oled marquage rémanence recours',
        'pixels morts tv garantie',
        'hdmi earc cec décrochement',
        'SAV refuse tv oled',
        'L.217-9 réparation tv',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement tv',
        'L.217-7 présomption 2 ans',
        'vendeur responsable L.217-3',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `TV OLED défectueuse : vos recours 2025`,
        url: `/guides/tv-oled-ecran-marques-garantie-legale`,
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
      title: `Les 8 défauts TV OLED couverts par la garantie légale`,
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Pixels morts / lignes`} />,
                <TextWithLegalRefs text={`• Marquage/rémanence anormale`} />,
                <TextWithLegalRefs text={`• Teintes/gradients instables`} />,
                <TextWithLegalRefs text={`• eARC/CEC instable`} />,
                <TextWithLegalRefs text={`• HDMI/port optique HS`} />,
                <TextWithLegalRefs text={`• Haut-parleurs défaillants`} />,
              ] as React.ReactNode[]
            }
          />{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Art. L.217-3 à L.217-13 : le vendeur doit livrer un produit conforme pendant 2 ans (12 mois mini en occasion).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Affichage • Pixels morts / lignes • Marquage/rémanence anormale • Teintes/gradients instables Connectique & son • eARC/CEC instable • HDMI/port optique HS • Haut-parleurs défaillants L.217-7 : tout défaut apparu dans les 2 ans (12 mois occasion) est présumé exister à la livraison.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Nos dossiers obtiennent une issue favorable dans 78% des cas après mise en demeure écrite.`}
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
              text={`1 Prouvez Photos/vidéos du défaut, facture, promesses commerciales (fiche produit).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`2 Demandez la mise en conformité Au vendeur uniquement (L.217-9) : réparation ou remplacement.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`3 Mise en demeure Rappelez L.217-3, L.217-7, L.217-11. Délai 15 jours.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Générer ma lettre → 4 Si échec Réduction du prix ou remboursement (L.217-14, L.217-16, L.217-17). Tous frais au vendeur (L.217-11).`}
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
