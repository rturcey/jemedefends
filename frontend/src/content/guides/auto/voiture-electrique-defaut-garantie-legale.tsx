// voiture-electrique-defaut-garantie-legale.tsx
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

export const GUIDE_VOITURE_ELECTRIQUE_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Voiture électrique : garantie légale (produit vendu) 2025',
    seo: {
      title: 'Voiture électrique vendue : vos recours',
      description:
        'Problème de charge, électronique embarquée, défaut de conformité sur VE vendu par pro ? Garantie légale : réparation, remplacement, remboursement.',
      keywords: [
        'voiture électrique garantie légale',
        'défaut charge VE recours',
        'électronique voiture électrique panne',
        'vendeur responsable L.217-3 VE',
        'L.217-9 réparation VE',
        'L.217-11 frais vendeur VE',
        'L.217-13 remboursement VE',
        'L.217-7 présomption VE',
        'mise en demeure VE',
        'véhicule occasion présomption 12 mois',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Voiture électrique : garantie légale (produit vendu) 2025',
        url: '/guides/voiture-electrique-defaut-garantie-legale',
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
      title: 'Défauts VE couverts (hors garanties commerciales)',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Charge aléatoire, autonomie anormalement basse vs promesse, BMS/électronique défaillants, interfaces qui plantent : couverts si usage normal empêché (L.217-5, L.217-7).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Parcours légal côté consommateur',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={'Signalement au vendeur (L.217-9) + diagnostic écrit'} />,
                <TextWithLegalRefs text={'Mise en demeure avec délai raisonnable'} />,
                <TextWithLegalRefs
                  text={'Si échec : remplacement ou remboursement (L.217-14, L.217-16, L.217-17)'}
                />,
                <TextWithLegalRefs text={'Frais de transport/diagnostic : vendeur (L.217-11)'} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Signalement au vendeur (L.217-9) + diagnostic écrit Mise en demeure avec délai raisonnable Si échec : remplacement ou remboursement (L.217-14, L.217-16, L.217-17) Frais de transport/diagnostic : vendeur (L.217-11)'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Concession/mandataire : bonnes pratiques',
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
                  text={'Darty : processus cadré, demandez la mise en conformité par écrit.'}
                />,
                <TextWithLegalRefs
                  text={'Boulanger : insistez sur la gratuité des frais (L.217-11).'}
                />,
                <TextWithLegalRefs
                  text={'Conforama / But : privilégiez la LRAR en cas d’atermoiements.'}
                />,
                <TextWithLegalRefs
                  text={'Amazon : utilisez l’historique des tickets pour la preuve d’échec.'}
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
