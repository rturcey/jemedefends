// fnac-sav-recours.tsx
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

export const GUIDE_FNAC_SAV_RECOURS: GuidePage = {
  metadata: {
    title: 'Fnac : SAV et garanties, vos droits de consommateur (2025)',
    seo: {
      title: 'SAV Fnac : vos droits garantie légale et recours (Guide 2025)',
      description:
        'Problème avec un achat Fnac ? Garantie légale 2 ans obligatoire, extensions payantes, marketplace. Procédure SAV, recours et médiation Fnac-Darty.',
      keywords: [
        'SAV Fnac garantie légale',
        'Fnac refuse réparation',
        'extension garantie Fnac',
        'marketplace Fnac vendeur tiers',
        'médiation Fnac Darty',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Fnac : SAV et garanties, vos droits de consommateur (2025)',
        url: '/guides/fnac-sav-recours',
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
            examples={['L.217-28', 'L.217-3', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'fnac-garanties',
      title: 'Garanties Fnac : légale vs commerciale vs extensions',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Durée : 2 ans produits neufs`} />,
                <TextWithLegalRefs text={`• Présomption : défaut pendant 24 mois`} />,
                <TextWithLegalRefs text={`• Gratuite : réparation, remplacement`} />,
                <TextWithLegalRefs text={`• Fnac responsable : en tant que vendeur`} />,
                <TextWithLegalRefs text={`• Base légale : Articles L.217-3 à L.217-28`} />,
                <TextWithLegalRefs
                  text={`• Tous produits : culturels, high-tech, électroménager`}
                />,
                <TextWithLegalRefs text={`• SAV intégré : ateliers de réparation`} />,
                <TextWithLegalRefs text={`• Échange possible : si réparation > 15 jours`} />,
                <TextWithLegalRefs text={`• Remboursement : si échec réparation/remplacement`} />,
                <TextWithLegalRefs text={`• Fnac+ : +1 an (total 3 ans)`} />,
                <TextWithLegalRefs text={`• Fnac++ : +2 ans (total 4 ans)`} />,
                <TextWithLegalRefs text={`• Casse accidentelle : option payante`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`La Fnac, comme tout vendeur, est tenue de respecter la garantie légale de conformité (2 ans). S'ajoutent ses garanties commerciales et extensions payantes qui complètent mais ne remplacent jamais vos droits.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`⚖️ Garantie légale (obligatoire) 📋 Caractéristiques • Durée : 2 ans produits neufs • Présomption : défaut pendant 24 mois • Gratuite : réparation, remplacement • Fnac responsable : en tant que vendeur • Base légale : Articles L.217-3 à L.217-28 🎯 Spécificités Fnac • Tous produits : culturels, high-tech, électroménager • SAV intégré : ateliers de réparation • Échange possible : si réparation > 15 jours • Remboursement : si échec réparation/remplacement 💳 Extensions de garantie Fnac ⚠️ Rappel : Ces extensions sont facultatives et s'ajoutent aux 2 ans légaux. Le vendeur ne peut pas conditionner la vente à leur souscription.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`📱 High-tech • Fnac+ : +1 an (total 3 ans) • Fnac++ : +2 ans (total 4 ans) • Casse accidentelle : option payante • Vol/vandalisme : selon contrat • Coût : 10-20% prix d'achat 🎵 Produits culturels • Échange : CD/DVD rayés (30 jours) • Satisfait ou remboursé : livres (15 jours) • Vinyles : garantie qualité audio • Instruments : réglages gratuits 1 an 🏪 Fnac Marketplace (vendeurs tiers) 🔍 Identifier le vendeur • "Vendu par Fnac" : Fnac responsable • "Vendu par [Nom]" : vendeur tiers responsable • Expédition : peut être Fnac même si vendeur tiers • Fiche produit : mention claire obligatoire ⚖️ Droits selon vendeur • Vendeur UE : garantie légale applicable • Vendeur hors UE : droit local (attention !) • Protection Fnac : remboursement si problème • Contact : vendeur d'abord, puis Fnac`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-sav-fnac',
      title: 'Procédure SAV Fnac étape par étape',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Site web : fnac.com → "Mon compte" → "SAV"`} />,
                <TextWithLegalRefs text={`• Téléphone : 0892 350 300 (0,35€/min)`} />,
                <TextWithLegalRefs text={`• Magasin : retour au point de vente`} />,
                <TextWithLegalRefs text={`• Chat : assistance en ligne 9h-20h`} />,
                <TextWithLegalRefs text={`• N° de commande (email confirmation)`} />,
                <TextWithLegalRefs text={`• Référence produit exacte`} />,
                <TextWithLegalRefs text={`• Description du problème`} />,
                <TextWithLegalRefs text={`• Date d'achat et première utilisation`} />,
                <TextWithLegalRefs text={`• Diagnostic immédiat : techniciens sur place`} />,
                <TextWithLegalRefs text={`• Ateliers intégrés : réparation directe`} />,
                <TextWithLegalRefs text={`• Échange sur place : si stock disponible`} />,
                <TextWithLegalRefs text={`• Sans RDV : aux horaires d'ouverture`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`1 📞 Contact SAV Fnac 🌐 Canaux disponibles • Site web : fnac.com → "Mon compte" → "SAV" • Téléphone : 0892 350 300 (0,35€/min) • Magasin : retour au point de vente • Chat : assistance en ligne 9h-20h 📋 Informations requises • N° de commande (email confirmation) • Référence produit exacte • Description du problème • Date d'achat et première utilisation 💡 Astuce : Mentionnez "garantie légale de conformité" dès le premier contact pour éviter qu'on vous oriente vers le fabricant.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`2 🔧 Diagnostic et réparation 🏪 En magasin (recommandé) • Diagnostic immédiat : techniciens sur place • Ateliers intégrés : réparation directe • Échange sur place : si stock disponible • Sans RDV : aux horaires d'ouverture 📦 Envoi en atelier • Colissimo gratuit : étiquette fournie • Diagnostic sous 5 jours : notification par email • Réparation 10-15 jours : selon disponibilité pièces • Retour gratuit : livraison domicile/magasin 3 ❌ Gestion des refus 🚫 Refus abusifs fréquents • "C"est la garantie constructeur" → FAUX : Art. L.217-9 vous protège • "Garantie expirée" → Rappeler les 2 ans légaux • "Usure normale" → Exiger rapport d'expertise • "Mauvaise utilisation" → Preuve à la charge de Fnac 📞 Escalade interne • Service réclamations : fnac.com • Responsable magasin • Direction régionale • Service consommateurs siège ⚖️ Recours externes • Médiation : mediateur-fnac-darty.com • 60 Millions : support UFC • SignalConso : DGCCRF 4 🤝 Médiation Fnac-Darty La Fnac et Darty partagent le même médiateur de la consommation depuis leur rapprochement.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`📋 Conditions de saisine • Recours préalable : échec SAV obligatoire • Délai : 1 an après réclamation • Gratuit : pour le consommateur • Dématérialisé : dossier en ligne ⏱️ Procédure • Dépôt : mediateur-fnac-darty.com • Délai : 90 jours maximum • Avis motivé : solution proposée • Exécution : libre adhésion`}
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
    mainArticles: [
      'L.217-28' as LegalArticleId,
      'L.217-3' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};
