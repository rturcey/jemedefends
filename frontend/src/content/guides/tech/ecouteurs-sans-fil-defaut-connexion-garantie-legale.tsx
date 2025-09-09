// ecouteurs-sans-fil-defaut-connexion-garantie-legale.tsx
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

export const GUIDE_ECOUTEURS_SANS_FIL_DEFAUT_CONNEXION_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Écouteurs sans fil : garantie légale & recours 2025`,
    seo: {
      title: `Écouteurs TWS défectueux : vos droits 2025`,
      description: `AirPods/Pixel Buds/Galaxy Buds qui coupent ? Garantie légale : réparation, remplacement ou remboursement. Lettre conforme en 3 min.`,
      keywords: [
        'écouteurs sans fil garantie légale',
        'AirPods panne recours',
        'Galaxy Buds coupure son',
        'Pixel Buds latence défaut',
        'batterie écouteurs faible',
        'SAV refuse écouteurs',
        'remplacement écouteurs défectueux',
        'mise en demeure vendeur écouteurs',
        'garantie L.217-9 écouteurs',
        'réparation gratuite écouteurs',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Écouteurs sans fil : garantie légale & recours 2025`,
        url: `/guides/ecouteurs-sans-fil-defaut-connexion-garantie-legale`,
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
      title: `Les défauts typiques couverts sur les écouteurs`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Couvert : pertes de connexion, canal muet, grésillements, charge erratique, autonomie anormalement faible, boîtier qui ne ferme plus.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Base : L.217-5 (conformité à l’usage attendu), L.217-7 (présomption 2 ans).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Les dommages accidentels (chute/immersion) ne sont pas couverts, sauf promesse spécifique non tenue sur la résistance annoncée.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Obtenir réparation/remplacement : la méthode claire`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`1) Prouvez le défaut (vidéos, capture autonomie) • 2) Contactez le vendeur (L.217-9) • 3) Mise en demeure écrite si refus • 4) Remplacement ou remboursement (L.217-14, L.217-16, L.217-17).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Créer ma lettre maintenant →`} />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Stratégies par enseigne : comment accélérer`,
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
