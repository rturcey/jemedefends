// constituer-preuves.tsx
// Guide migré automatiquement - Ne pas modifier la structure
import React from 'react';

import {
  Badge,
  Button,
  ErrorAlert,
  LegalNote,
  StandardProcedure,
  DefaultAlternatives,
  DefaultContacts,
} from '@/components/ui';
import type { GuidePage } from '@/types/guides';

export const GUIDE_CONSTITUER_PREUVES: GuidePage = {
  metadata: {
    title: 'Constituer un dossier de preuves solide en consommation (2025)',
    seo: {
      title: 'Constituer preuves litige consommation : dossier solide (Guide 2025)',
      description:
        'Comment constituer un dossier de preuves efficace pour votre litige consommation : documents, photos, expertises, témoignages. Recevabilité et conservation.',
      keywords: [
        'constituer preuves consommation',
        'dossier litige documentation',
        'photos preuves défaut produit',
        'correspondances vendeur preuves',
        'expertise judiciaire consommation',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Constituer un dossier de preuves solide en consommation (2025)',
        url: '/guides/constituer-preuves',
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
            d’échec: <strong>réduction du prix</strong> ou <strong>résolution</strong>. Tous frais
            incombent au vendeur.
          </ErrorAlert>
          <div className="flex flex-wrap gap-2">
            <Badge>Présomption 24&nbsp;mois</Badge>
            <Badge>Frais vendeur</Badge>
            <Badge>≤&nbsp;30&nbsp;jours</Badge>
          </div>
          <LegalNote
            title="Références légales"
            explanation="Articles détectés automatiquement dans ce guide."
            examples={['']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    { id: 'procedure', title: 'Procédure type', content: <StandardProcedure /> },
    { id: 'alternatives', title: 'Si ça bloque', content: <DefaultAlternatives /> },
    { id: 'contacts', title: 'Contacts utiles', content: <DefaultContacts /> },
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
    mainArticles: [],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};
