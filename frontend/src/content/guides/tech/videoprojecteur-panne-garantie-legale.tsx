// videoprojecteur-panne-garantie-legale.tsx
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

export const GUIDE_VIDEOPROJECTEUR_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Vidéoprojecteur en panne : garantie légale 2025`,
    seo: {
      title: `Vidéoprojecteur défectueux : recours 2025`,
      description: `Focus, keystone, lampe/laser, HDMI instable : garantie légale. Obtenez réparation, remplacement ou remboursement. Lettre en 3 minutes.`,
      keywords: [
        'videoprojecteur garantie légale',
        'focus flou keystone défaut',
        'lampe laser panne projo',
        'hdmi arc instable projecteur',
        'L.217-9 réparation projecteur',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption 2 ans',
        'vendeur responsable L.217-3',
        'mise en demeure projecteur',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Vidéoprojecteur en panne : garantie légale 2025`,
        url: `/guides/videoprojecteur-panne-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-3', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts côté image & connectique`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Couvert : focus impossible à régler, keystone inopérant, lampe/laser chute anormale, HDMI/ARC instable, ventilateur bruyant.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Base : L.217-5 (usage attendu), L.217-7 (présomption).`} />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Résolution amiable en ~70% des cas après rappel clair de L.217-9 et L.217-11.`}
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
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`Preuves (photos/fichiers test) + facture`} />,
                <TextWithLegalRefs text={`Demande de mise en conformité (L.217-9)`} />,
                <TextWithLegalRefs text={`Mise en demeure (L.217-3, L.217-7, L.217-11)`} />,
                <TextWithLegalRefs
                  text={`Réduction du prix / remboursement (L.217-14, L.217-16, L.217-17)`}
                />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Interlocuteur : uniquement le vendeur (L.217-3). Choix initial : réparation ou remplacement (L.217-9).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Preuves (photos/fichiers test) + facture Demande de mise en conformité (L.217-9) Mise en demeure (L.217-3, L.217-7, L.217-11) Réduction du prix / remboursement (L.217-14, L.217-16, L.217-17) Créer ma lettre →`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Enseignes & astuces pratiques`,
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
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};
