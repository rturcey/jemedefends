// serveur-nas-panne-garantie-legale.tsx
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

export const GUIDE_SERVEUR_NAS_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Serveur NAS en panne : garantie légale 2025`,
    seo: {
      title: `NAS défectueux : recours 2025`,
      description: `Baies HS, réseau instable, RAID qui lâche : garantie légale. Exigez réparation, remplacement ou remboursement. Lettre conforme immédiate.`,
      keywords: [
        'NAS garantie légale',
        'baie disque HS NAS',
        'réseau instable NAS défaut',
        'RAID reconstruit echec',
        'L.217-9 réparation NAS',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement NAS',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure NAS',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Serveur NAS en panne : garantie légale 2025`,
        url: `/guides/serveur-nas-panne-garantie-legale`,
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
      title: `Défauts NAS couverts par la garantie légale`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Baie/dock disque qui n’alimente plus, contrôleur RAID instable, ports Ethernet HS, ventilateurs très bruyants, UI inaccessible : L.217-5, L.217-7.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Attention : la récupération de données n’est pas couverte par la garantie légale elle-même (c’est un service séparé).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Procédure pas à pas`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Demandez réparation/remplacement (L.217-9). Tous frais à la charge du vendeur (L.217-11). Si échec : réduction/remboursement (L.217-14, L.217-16, L.217-17).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Lettre conforme →`} />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Distributeurs & bonnes pratiques`,
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
