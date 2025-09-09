// cdiscount-marketplace.tsx
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
import React from 'react';

export const GUIDE_CDISCOUNT_MARKETPLACE: GuidePage = {
  metadata: {
    title: 'Cdiscount marketplace : vos droits avec les vendeurs tiers (2025)',
    seo: {
      title: 'Cdiscount marketplace : vos droits vendeurs tiers (Guide 2025)',
      description:
        'Achat chez un vendeur tiers sur Cdiscount ? Distinguez Pro/Particulier, garantie légale applicable, A-Z Protection. Procédure complète de recours.',
      keywords: [
        'Cdiscount marketplace vendeur tiers',
        'Cdiscount A-Z protection',
        'vendeur pro Cdiscount droits',
        'garantie légale Cdiscount',
        'réclamation vendeur Cdiscount',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Cdiscount marketplace : vos droits avec les vendeurs tiers (2025)',
        url: '/guides/cdiscount-marketplace',
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
    {
      id: 'cdiscount-responsabilites',
      title: 'Cdiscount vs vendeurs tiers : qui est responsable ?',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• "Vendu et expédié par Cdiscount"`} />,
                <TextWithLegalRefs text={`• Logo Cdiscount sans mention vendeur`} />,
                <TextWithLegalRefs text={`• "Cdiscount à volonté" éligible`} />,
                <TextWithLegalRefs text={`• Garantie légale 2 ans française`} />,
                <TextWithLegalRefs text={`• Cdiscount responsable directement`} />,
                <TextWithLegalRefs text={`• SAV centralisé Cdiscount`} />,
                <TextWithLegalRefs text={`• Retour ≤ 30 jours (L.217-10) selon produit`} />,
                <TextWithLegalRefs text={`• Remboursement rapide`} />,
                <TextWithLegalRefs text={`• "Vendu par [Nom vendeur]"`} />,
                <TextWithLegalRefs text={`• "Expédié par Cdiscount" ou vendeur`} />,
                <TextWithLegalRefs text={`• Nom société visible sur fiche`} />,
                <TextWithLegalRefs text={`• Vendeur Pro UE : garantie légale 2 ans`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Cdiscount fonctionne principalement comme marketplace : distinguer Cdiscount vendeur direct des milliers de vendeurs tiers est crucial pour vos recours.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`🛒 Cdiscount vendeur direct 🔍 Comment identifier :`} />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`• "Vendu et expédié par Cdiscount" • Logo Cdiscount sans mention vendeur • "Cdiscount à volonté" éligible ✅ Vos droits • Garantie légale 2 ans française • Cdiscount responsable directement • SAV centralisé Cdiscount • Retour ≤ 30 jours (L.217-10) selon produit • Remboursement rapide 🏪 Vendeurs tiers marketplace 🔍 Comment identifier :`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`• "Vendu par [Nom vendeur]" • "Expédié par Cdiscount" ou vendeur • Nom société visible sur fiche ⚖️ Vos droits • Vendeur Pro UE : garantie légale 2 ans • Vendeur particulier : pas de garantie légale • Vendeur hors UE : droit local • A-Z Protection : recours Cdiscount • Contact vendeur obligatoire d'abord 🔍 Identifier le statut du vendeur 🏢 Vendeur Professionnel • Mention "Pro" sur fiche • SIRET visible • CGV détaillées • Garantie légale applicable 👤 Vendeur Particulier • Mention "Particulier" • Pas de SIRET • Vente occasionnelle • Pas de garantie légale 🌍 Vendeur étranger • Adresse hors France • Délais livraison longs • Droit local applicable • A-Z Protection essentielle`}
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
    mainArticles: [],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};
