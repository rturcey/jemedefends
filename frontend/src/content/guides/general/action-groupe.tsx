// action-groupe.tsx
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

export const GUIDE_ACTION_GROUPE: GuidePage = {
  metadata: {
    title: 'Action de groupe consommation : class action française (2025)',
    seo: {
      title: 'Action de groupe consommation : class action française (Guide 2025)',
      description: 'Victime d\\',
      keywords: [
        'action de groupe consommation',
        'class action française',
        'association action groupe',
        'préjudice collectif consommation',
        'indemnisation collective',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Action de groupe consommation : class action française (2025)',
        url: '/guides/action-groupe',
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
      id: 'principe-action-groupe',
      title: 'Principe et conditions de l\\',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Consommateurs multiples : nombre significatif`} />,
                <TextWithLegalRefs text={`• Situation similaire : même origine du préjudice`} />,
                <TextWithLegalRefs text={`• Intérêt à agir : lésion commune`} />,
                <TextWithLegalRefs text={`• Représentativité : groupe homogène`} />,
                <TextWithLegalRefs text={`• Obligations légales : Code consommation`} />,
                <TextWithLegalRefs text={`• Obligations contractuelles : CGV, garanties`} />,
                <TextWithLegalRefs text={`• Pratiques déloyales : publicité, vente`} />,
                <TextWithLegalRefs text={`• Sécurité produits : défauts en série`} />,
                <TextWithLegalRefs text={`• Plus active en actions groupe`} />,
                <TextWithLegalRefs text={`• Expertise juridique développée`} />,
                <TextWithLegalRefs text={`• Ressources : avocats spécialisés`} />,
                <TextWithLegalRefs text={`• Secteurs : tous domaines conso`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`l' action de groupe permet aux associations de consommateurs agréées d'agir en justice pour défendre les intérêts collectifs des consommateurs ( Articles L.623-1 et suivants ).`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`⚖️ Conditions d'ouverture 👥 Pluralité de victimes • Consommateurs multiples : nombre significatif • Situation similaire : même origine du préjudice • Intérêt à agir : lésion commune • Représentativité : groupe homogène 🎯 Manquement du professionnel • Obligations légales : Code consommation • Obligations contractuelles : CGV, garanties • Pratiques déloyales : publicité, vente • Sécurité produits : défauts en série 🏛️ Associations habilitées Seules les associations agréées au niveau national peuvent initier une action de groupe.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`UFC-Que Choisir • Plus active en actions groupe • Expertise juridique développée • Ressources : avocats spécialisés • Secteurs : tous domaines conso CLCV • Spécialisation : logement, énergie • Actions ciblées : services publics • Expertise technique : secteurs spécialisés Autres (CSF, AFOC) • Actions ponctuelles • Spécialisations sectorielles • Partenariats avec UFC 📊 Exemples d'actions réussies 🎯 Cas emblématiques • Dieselgate : Volkswagen (moteurs truqués) • iPhone : Apple (batterie bridée) • Linky : Enedis (compteurs défaillants) • Pesticides : Roundup (glyphosate) 💰 Indemnisations obtenues • Individuelles : 50€ à 5000€ selon préjudice • Collectives : millions d'euros au total • Mesures correctrices : modification pratiques • Publicité : condamnation publique`}
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
