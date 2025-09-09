// refere-consommation.tsx
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

export const GUIDE_REFERE_CONSOMMATION: GuidePage = {
  metadata: {
    title: 'Référé consommation : procédure d\\',
    seo: {
      title: 'Référé consommation : procédure urgence tribunal (Guide 2025)',
      description: 'Litige consommation urgent ? Le référé permet d\\',
      keywords: [
        'référé consommation urgent',
        'procédure référé tribunal',
        'urgence litige consommation',
        'mesures conservatoires référé',
        'juge référés saisine',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Référé consommation : procédure d\\',
        url: '/guides/refere-consommation',
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
            examples={['808']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'conditions-refere',
      title: 'Conditions et cas d\\',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Préjudice imminent : risque de dommage`} />,
                <TextWithLegalRefs
                  text={`• Impossibilité d'attendre : procédure normale trop lente`}
                />,
                <TextWithLegalRefs text={`• Caractère objectif : apprécié par le juge`} />,
                <TextWithLegalRefs text={`• Lien avec le litige : urgence liée au fond`} />,
                <TextWithLegalRefs text={`• Droit apparent : vraisemblance juridique`} />,
                <TextWithLegalRefs text={`• Preuve prima facie : éléments suffisants`} />,
                <TextWithLegalRefs text={`• Contestation non fondée : défense fragile`} />,
                <TextWithLegalRefs text={`• Provisoire : sans préjuger du fond`} />,
                <TextWithLegalRefs text={`• Coupure services : électricité, gaz, eau`} />,
                <TextWithLegalRefs text={`• Denrées périssables : réfrigération HS`} />,
                <TextWithLegalRefs text={`• Sécurité : produit dangereux non rappelé`} />,
                <TextWithLegalRefs text={`• Logement : chauffage en hiver, infiltrations`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Le référé permet d'obtenir rapidement des mesures provisoires du juge en cas d' urgence manifeste ( Articles 808 et suivants CPC ).`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`⚡ Conditions strictes (Art. 808 CPC) 🚨 Urgence manifeste • Préjudice imminent : risque de dommage • Impossibilité d'attendre : procédure normale trop lente • Caractère objectif : apprécié par le juge • Lien avec le litige : urgence liée au fond ⚖️ Absence de contestation sérieuse • Droit apparent : vraisemblance juridique • Preuve prima facie : éléments suffisants • Contestation non fondée : défense fragile • Provisoire : sans préjuger du fond 🎯 Cas pratiques en consommation ✅ Urgence reconnue • Coupure services : électricité, gaz, eau • Denrées périssables : réfrigération HS • Sécurité : produit dangereux non rappelé • Logement : chauffage en hiver, infiltrations • Professionnel : outil de travail HS • Santé : matériel médical défaillant ❌ Pas d'urgence • Confort : TV, ordinateur personnel • Esthétique : rayures, défauts mineurs • Financier pur : remboursement sans préjudice • Litige complexe : expertise nécessaire • Délai écoulé : urgence non caractérisée ⚖️ Types de mesures possibles 🛡️ Conservatoires • Interdiction de vente • Séquestre du produit • Consignation sommes • Expertise contradictoire 🔧 Remise en état • Réparation immédiate • Remplacement urgent • Remise en service • Produit de substitution 💰 Financières • Provision dommages-intérêts • Remboursement partiel • Paiement créance certaine • Astreinte si non-exécution`}
            />
          </p>
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
    mainArticles: ['808' as LegalArticleId],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};
