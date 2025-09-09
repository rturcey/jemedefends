// smartphone-ecran-batterie-defaut-garantie-legale.tsx
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

export const GUIDE_SMARTPHONE_ECRAN_BATTERIE_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Smartphone défectueux : garantie légale 2025`,
    seo: {
      title: `Smartphone en panne : vos droits 2025`,
      description: `Écran, batterie, réseau : faites jouer la garantie légale (2 ans). Lettre de mise en demeure prête en 3 minutes.`,
      keywords: [
        'smartphone garantie légale',
        'écran cassures lignes défaut',
        'batterie ne tient pas téléphone',
        'réseau 4G 5G instable recours',
        'L.217-9 réparation smartphone',
        'vendeur responsable L.217-3',
        'présomption 2 ans L.217-7',
        'L.217-11 frais à charge vendeur',
        'remboursement L.217-13',
        'mise en demeure smartphone',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Smartphone défectueux : garantie légale 2025`,
        url: `/guides/smartphone-ecran-batterie-defaut-garantie-legale`,
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
      title: `Défauts smartphone couverts par la loi`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Couverts (L.217-5, L.217-7) : écran avec lignes/pixels morts, tactile fantôme, batterie chute anormale, recharge capricieuse, pertes réseau répétées, micro/HP défaillants.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Non couvert : casse accidentelle/immersion hors promesse d’étanchéité. En revanche, une étanchéité annoncée mais non tenue reste couverte.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Procédure en 4 étapes : simple et efficace`,
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`Preuves (photos/vidéos, batterie, réseau) + facture`} />,
                <TextWithLegalRefs
                  text={`Demande au vendeur : réparation/remplacement (L.217-9)`}
                />,
                <TextWithLegalRefs text={`Mise en demeure écrite (L.217-3, L.217-7, L.217-11)`} />,
                <TextWithLegalRefs
                  text={`Échec : réduction du prix ou remboursement (L.217-14, L.217-16, L.217-17)`}
                />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Preuves (photos/vidéos, batterie, réseau) + facture Demande au vendeur : réparation/remplacement (L.217-9) Mise en demeure écrite (L.217-3, L.217-7, L.217-11) Échec : réduction du prix ou remboursement (L.217-14, L.217-16, L.217-17) Générer ma lettre →`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Boutiques & e-commerce : nos conseils`,
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
