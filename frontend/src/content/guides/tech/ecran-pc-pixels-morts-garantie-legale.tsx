// ecran-pc-pixels-morts-garantie-legale.tsx
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

export const GUIDE_ECRAN_PC_PIXELS_MORTS_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Écran PC : pixels morts/saignement — recours 2025`,
    seo: {
      title: `Écran PC défectueux : garantie 2025`,
      description: `Pixels morts, fuites de lumière, ports HS : garantie légale. Obtenez réparation, remplacement ou remboursement. Lettre conforme immédiate.`,
      keywords: [
        'ecran pc garantie légale',
        'pixels morts moniteur',
        'fuite de lumière ips',
        'port displayport hdmi hs',
        'L.217-9 réparation moniteur',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption 2 ans',
        'vendeur responsable L.217-3',
        'mise en demeure moniteur',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Écran PC : pixels morts/saignement — recours 2025`,
        url: `/guides/ecran-pc-pixels-morts-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts sur moniteurs PC`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Pixels morts/taches, saignement de dalle, uniformité douteuse, ports HS, scintillement anormal : L.217-5, L.217-7.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Taux de réussite élevé avec preuve photo et rappel L.217-9/L.217-11.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Itinéraire vers la mise en conformité`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Contact vendeur → réparation/remplacement (L.217-9). Si échec : réduction/remboursement (L.217-14, L.217-16, L.217-17). Frais à sa charge (L.217-11).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Revendeurs IT : accélérer`,
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
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};
