// machine-a-pain-panne-garantie-legale.tsx
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

export const GUIDE_MACHINE_A_PAIN_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Machine à pain en panne : garantie légale 2025',
    seo: {
      title: 'Machine à pain défectueuse : recours',
      description:
        'Pétrin bloqué, cuisson inégale ? Garantie légale : réparation, remplacement, remboursement. Lettre en quelques clics.',
      keywords: [
        'machine à pain panne garantie',
        'pétrin bloqué défaut',
        'cuisson inégale machine à pain',
        'SAV refuse machine à pain',
        'L.217-9 réparation machine à pain',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure machine à pain',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Machine à pain en panne : garantie légale 2025',
        url: '/guides/machine-a-pain-panne-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-3', 'L.217-5', 'L.217-7']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts couverts & preuves utiles',
      content: (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-1">
            \n{' '}
            <li>
              <TextWithLegalRefs text={'• Pétrin qui ne tourne plus'} />
            </li>
            <li>
              <TextWithLegalRefs text={'• Cuisson incomplète/température instable'} />
            </li>
            <li>
              <TextWithLegalRefs text={'• Fuites, joints HS, fumées anormales'} />
            </li>
            \n
          </ul>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                '• Pétrin qui ne tourne plus • Cuisson incomplète/température instable • Fuites, joints HS, fumées anormales Base : L.217-5, L.217-7.'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Procédure fiable',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Réparation → Remplacement → Réduction/remboursement (L.217-14, L.217-16, L.217-17). Toujours via le vendeur (L.217-3), frais à sa charge (L.217-11).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Enseignes : faire valoir vos droits',
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
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};
