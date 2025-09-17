// home-cinema-barre-de-son-panne-garantie-legale.tsx
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
import type { LegalArticleId } from '@/legal/registry';
import type { GuidePage } from '@/types/guides';

export const GUIDE_HOME_CINEMA_BARRE_DE_SON_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Home cinéma/Barre de son en panne : recours 2025`,
    seo: {
      title: `Barre de son défectueuse : garantie légale`,
      description: `HDMI ARC qui décroche, caisson muet ? Activez la garantie légale : réparation, remplacement, remboursement. Lettre conforme en 3 min.`,
      keywords: [
        'barre de son garantie légale',
        'home cinéma panne HDMI ARC',
        'caisson de basses muet',
        'SAV refuse garantie audio',
        'remplacement barre de son',
        'L.217-9 réparation audio',
        'L.217-11 frais vendeur audio',
        'présomption L.217-7 audio',
        'réduction prix L.217-13 audio',
        'vendeur responsable L.217-3',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Home cinéma/Barre de son en panne : recours 2025`,
        url: `/guides/home-cinema-barre-de-son-panne-garantie-legale`,
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
      title: `Défauts audio/vidéo couverts`,
      content: (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-1">
            \n{' '}
            <li>
              <TextWithLegalRefs text={`• Coupures HDMI ARC/eARC, désynchronisation audio`} />
            </li>
            <li>
              <TextWithLegalRefs
                text={`• Caisson sans appairage, grésillements, saturation basse`}
              />
            </li>
            <li>
              <TextWithLegalRefs
                text={`• Perte de canaux, volume bloqué, télécommande inopérante`}
              />
            </li>
            \n
          </ul>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`• Coupures HDMI ARC/eARC, désynchronisation audio • Caisson sans appairage, grésillements, saturation basse • Perte de canaux, volume bloqué, télécommande inopérante Fondements : L.217-5, L.217-7.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Du diagnostic à la solution`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Diagnostic écrit + demande réparation (L.217-9) → mise en demeure si besoin → remplacement/remboursement (L.217-14, L.217-16, L.217-17). Frais pris en charge (L.217-11).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Générer ma lettre →`} />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Conseils pratiques par enseigne`,
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
