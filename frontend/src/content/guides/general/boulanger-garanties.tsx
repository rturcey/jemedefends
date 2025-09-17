// boulanger-garanties.tsx
// Guide migré automatiquement - Ne pas modifier la structure
import React from 'react';

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
import type { GuidePage } from '@/types/guides';

export const GUIDE_BOULANGER_GARANTIES: GuidePage = {
  metadata: {
    title: 'Boulanger : SAV et garanties électroménager (2025)',
    seo: {
      title: 'SAV Boulanger : vos droits et garanties électroménager (Guide 2025)',
      description:
        'Problème avec un achat Boulanger ? Garantie légale 2 ans, installation gratuite, extensions payantes. Procédure SAV complète et recours.',
      keywords: [
        'SAV Boulanger garantie légale',
        'Boulanger installation gratuite',
        'extension garantie Boulanger',
        'électroménager Boulanger panne',
        'réclamation Boulanger',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Boulanger : SAV et garanties électroménager (2025)',
        url: '/guides/boulanger-garanties',
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
      id: 'boulanger-services',
      title: 'Services et garanties Boulanger',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Gros électroménager : pose standard incluse`} />,
                <TextWithLegalRefs text={`• Raccordements : eau, évacuation, électricité`} />,
                <TextWithLegalRefs text={`• Mise en service : premier démarrage`} />,
                <TextWithLegalRefs text={`• Évacuation ancien : reprise gratuite`} />,
                <TextWithLegalRefs text={`• Délai : RDV sous 48-72h`} />,
                <TextWithLegalRefs text={`• Déballage : mise en place incluse`} />,
                <TextWithLegalRefs text={`• Première installation : paramétrage de base`} />,
                <TextWithLegalRefs text={`• Raccordement : selon complexité`} />,
                <TextWithLegalRefs text={`• Formation : utilisation basics`} />,
                <TextWithLegalRefs text={`• 2 ans produits neufs`} />,
                <TextWithLegalRefs text={`• Réparation gratuite prioritaire`} />,
                <TextWithLegalRefs text={`• Remplacement si réparation impossible`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Boulanger, spécialiste de l'électroménager, propose des services d'installation et doit respecter la garantie légale 2 ans + ses garanties commerciales spécialisées.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`🛠️ Services inclus Boulanger 🏠 Installation gratuite • Gros électroménager : pose standard incluse • Raccordements : eau, évacuation, électricité • Mise en service : premier démarrage • Évacuation ancien : reprise gratuite • Délai : RDV sous 48-72h 📺 High-tech • Déballage : mise en place incluse • Première installation : paramétrage de base • Raccordement : selon complexité • Formation : utilisation basics ⚖️ Garanties applicables 📋 Garantie légale (obligatoire) • 2 ans produits neufs • Réparation gratuite prioritaire • Remplacement si réparation impossible • Installation incluse dans réparation • Boulanger responsable comme vendeur 🎯 Spécificités électroménager • Installation défaillante : reprise gratuite • Panne liée pose : Boulanger responsable • Produit de remplacement : réinstallation incluse • Délai réparation : prêt d'appareil si > 7 jours 💳 Extensions payantes Sérénité 3 ans : +1 an après garantie légale Sérénité 4 ans : +2 ans pièces et main d'œuvre Sérénité 5 ans : Couverture maximale 🔧 SAV spécialisé électroménager 🏠 Intervention à domicile • Diagnostic gratuit : technicien qualifié • Réparation sur place : si pièces disponibles • RDV rapide : 48-72h selon urgence • Déplacement gratuit : sous garantie 🏭 Ateliers centralisés • Enlèvement gratuit : si réparation impossible domicile • Atelier agréé : toutes marques • Pièces d'origine : garanties constructeur • Livraison/réinstallation : incluses`}
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
