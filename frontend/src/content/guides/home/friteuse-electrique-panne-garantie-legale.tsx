// friteuse-electrique-panne-garantie-legale.tsx
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

export const GUIDE_FRITEUSE_ELECTRIQUE_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Friteuse électrique en panne : garantie légale 2025',
    seo: {
      title: 'Friteuse défectueuse : vos droits 2025',
      description:
        'Température instable, panne de chauffe ? Garantie légale : réparation, remplacement ou remboursement. Lettre prête en quelques clics.',
      keywords: [
        'friteuse panne garantie',
        'température friteuse instable',
        'résistance friteuse HS',
        'SAV refuse friteuse',
        'remboursement friteuse',
        'L.217-9 réparation',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'présomption L.217-7',
        'vendeur responsable L.217-3',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Friteuse électrique en panne : garantie légale 2025',
        url: '/guides/friteuse-electrique-panne-garantie-legale',
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
      title: 'Défauts friteuse couverts par la loi',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Chauffe inexistante, thermostat erratique, fuite d’huile, voyant inopérant, matériaux qui se déforment : couverts par L.217-5 et L.217-7.'
              }
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Sécurité : si risque de brûlure/feu, exigez une solution rapide (mise en demeure).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Obtenir la mise en conformité',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={'Preuves (photos/vidéos + facture)'} />,
                <TextWithLegalRefs text={'Réparation demandée (L.217-9)'} />,
                <TextWithLegalRefs text={'Mise en demeure (rappel L.217-3, L.217-7, L.217-11)'} />,
                <TextWithLegalRefs
                  text={'Remplacement ou remboursement (L.217-14, L.217-16, L.217-17)'}
                />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Preuves (photos/vidéos + facture) Réparation demandée (L.217-9) Mise en demeure (rappel L.217-3, L.217-7, L.217-11) Remplacement ou remboursement (L.217-14, L.217-16, L.217-17)'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Points de vente : stratégie',
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
      'L.217-3' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};
