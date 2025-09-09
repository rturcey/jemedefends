// equipement-fitness-maison-garantie-legale.tsx
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

export const GUIDE_EQUIPEMENT_FITNESS_MAISON_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Équipement fitness maison : garantie légale 2025',
    seo: {
      title: 'Matériel fitness défectueux : recours',
      description:
        'Bruits, électronique, résistance HS : garantie légale. Réparation, remplacement, remboursement. Lettre conforme en 3 min.',
      keywords: [
        'tapis de course garantie légale',
        'rameur panne électronique',
        'vélo d’appartement défaut',
        'L.217-9 réparation fitness',
        'L.217-11 frais vendeur fitness',
        'L.217-13 remboursement fitness',
        'L.217-7 présomption fitness',
        'vendeur responsable L.217-3',
        'mise en demeure fitness',
        'matériel sport défectueux',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Équipement fitness maison : garantie légale 2025',
        url: '/guides/equipement-fitness-maison-garantie-legale',
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
      title: 'Défauts couverts (tapis/vélo/rameur)',
      content: (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-1">
            \n{' '}
            <li>
              <TextWithLegalRefs text={'• Bruits/jeu anormal, courroie qui patine'} />
            </li>
            <li>
              <TextWithLegalRefs text={'• Électronique/console HS, capteurs faux'} />
            </li>
            <li>
              <TextWithLegalRefs text={'• Résistance inopérante, structure qui fissure'} />
            </li>
            \n
          </ul>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                '• Bruits/jeu anormal, courroie qui patine • Électronique/console HS, capteurs faux • Résistance inopérante, structure qui fissure Base : L.217-5, L.217-7.'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Procédure orientée résultat',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Réparation (L.217-9) • Mise en demeure • Remplacement/remboursement (L.217-14, L.217-16, L.217-17). Frais vendeurs (L.217-11).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Magasin/marketplace : agir vite',
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
