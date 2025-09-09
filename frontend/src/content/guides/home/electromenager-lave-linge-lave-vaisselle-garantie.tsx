// electromenager-lave-linge-lave-vaisselle-garantie.tsx
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

export const GUIDE_ELECTROMENAGER_LAVE_LINGE_LAVE_VAISSELLE_GARANTIE: GuidePage = {
  metadata: {
    title: 'Électroménager en panne : garantie légale et remboursement (2025)',
    seo: {
      title: 'Électroménager en panne : vos droits, réparation gratuite et remboursement',
      description:
        'Lave-linge qui fuit, frigo HS, four défectueux ? Découvrez vos recours : réparation gratuite, remplacement ou remboursement intégral sous 2 ans.',
      keywords: [
        'électroménager en panne garantie',
        'lave-linge fuit réparation gratuite',
        'frigo ne refroidit plus SAV',
        'four défectueux remboursement',
        'lave-vaisselle ne lave plus',
        'garantie légale électroménager',
        'Darty Boulanger recours',
        'mise en demeure électroménager',
        'SAV refuse réparation gratuite',
        'remboursement gros électroménager',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Électroménager en panne : garantie légale et remboursement (2025)',
        url: '/guides/electromenager-lave-linge-lave-vaisselle-garantie',
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
            examples={['847', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'pannes-courantes',
      title: '',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={'• Fuite par le joint de porte'} />,
                <TextWithLegalRefs text={'• Eau qui sort par le tiroir à lessive'} />,
                <TextWithLegalRefs text={'• Flaques sous la machine'} />,
                <TextWithLegalRefs text={'• Tuyaux qui se détachent'} />,
                <TextWithLegalRefs text={'• Tambour bloqué qui ne tourne plus'} />,
                <TextWithLegalRefs text={'• Essorage défaillant ou bruyant'} />,
                <TextWithLegalRefs text={'• Porte qui ne se ferme plus'} />,
                <TextWithLegalRefs text={'• Pompe de vidange en panne'} />,
                <TextWithLegalRefs text={'• Ne refroidit plus du tout'} />,
                <TextWithLegalRefs text={'• Température instable'} />,
                <TextWithLegalRefs text={'• Congélateur qui décongèle'} />,
                <TextWithLegalRefs text={'• Givrage excessif'} />,
              ] as React.ReactNode[]
            }
          />{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Votre électroménager vous lâche ? Pas de panique ! La garantie légale de 2 ans vous protège automatiquement. Découvrez si votre panne est couverte et comment obtenir réparation gratuite, remplacement ou remboursement.'
              }
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                '🧺 LAVE-LINGE : Top 5 des pannes couvertes 🚿 Problèmes de fuite • Fuite par le joint de porte • Eau qui sort par le tiroir à lessive • Flaques sous la machine • Tuyaux qui se détachent ⚙️ Dysfonctionnements mécaniques • Tambour bloqué qui ne tourne plus • Essorage défaillant ou bruyant • Porte qui ne se ferme plus • Pompe de vidange en panne 💡 Cas réel : Lave-linge Bosch qui fuit après 8 mois → Darty a remplacé gratuitement sous 48h après mise en demeure citant L.217-9.'
              }
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                "❄️ RÉFRIGÉRATEUR : Pannes critiques 🌡️ Problèmes de température • Ne refroidit plus du tout • Température instable • Congélateur qui décongèle • Givrage excessif 🔧 Défaillances techniques • Compresseur bruyant ou HS • Éclairage défaillant • Thermostat déréglé • Joint d'étanchéité défectueux ⚠️ Urgence : Un frigo qui ne refroidit plus = perte de denrées alimentaires. Vous pouvez réclamer des dommages-intérêts en plus de la réparation !"
              }
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                "🍽️ LAVE-VAISSELLE : Défauts récurrents 🧼 Lavage déficient • Vaisselle qui reste sale • Traces et résidus persistants • Bras de lavage obstrués • Pastilles qui ne se dissolvent pas 💧 Problèmes d'eau • Ne se remplit plus d'eau • Ne vidange pas complètement • Fuite au niveau des joints • Séchage inefficace 💡 Astuce : Photographiez la vaisselle mal lavée avec la date. C'est votre preuve du défaut de conformité !"
              }
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                '🔥 FOUR : Problèmes de cuisson 🌡️ Température défaillante • Ne chauffe plus du tout • Température incorrecte/instable • Préchauffage très long • Chaleur tournante HS ⚡ Dysfonctionnements • Porte qui ne ferme pas bien • Éclairage intérieur défaillant • Programmateur en panne • Grill qui ne fonctionne plus ⚠️ Cas NON couverts par la garantie légale ❌ Exclusions absolues • Mauvais entretien (calcaire, saleté) • Surtension/foudre • Utilisation non conforme • Pièces d\'usure normale (joints, filtres) ⚖️ Cas litigieux • Usure "prématurée" (à prouver) • Problèmes d\'installation • Incompatibilité électrique • Dommages transport'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'recours-strategiques',
      title: 'Stratégies de recours : comment obtenir gain de cause rapidement',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={'• Panne ponctuelle et identifiable'} />,
                <TextWithLegalRefs text={'• Appareil récent (< 6 mois)'} />,
                <TextWithLegalRefs text={'• Réparateur compétent disponible'} />,
                <TextWithLegalRefs text={'• Pièce disponible rapidement'} />,
                <TextWithLegalRefs text={'• 2e panne du même type'} />,
                <TextWithLegalRefs text={'• Délai > 30 jours annoncé'} />,
                <TextWithLegalRefs text={'• Coût réparation > 50% prix neuf'} />,
                <TextWithLegalRefs text={'• Panne récurrente connue du modèle'} />,
                <TextWithLegalRefs text={'• Appareil neuf avec nouvelle garantie de 2 ans'} />,
                <TextWithLegalRefs text={'• Aucun risque de panne récurrente'} />,
                <TextWithLegalRefs text={'• Souvent plus rapide que la réparation'} />,
                <TextWithLegalRefs text={'• Modèle équivalent ou supérieur si stock épuisé'} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                "🎯 La règle d'or de l'électroménager Contrairement aux idées reçues, vous n'êtes jamais obligé d'accepter une réparation. Selon l'article L.217-9, vous pouvez directement demander le remplacement ou le remboursement si vous estimez que le produit n'est pas fiable."
              }
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                '1 🔧 OPTION 1 : Réparation gratuite ✅ Quand la choisir • Panne ponctuelle et identifiable • Appareil récent ( • Réparateur compétent disponible • Pièce disponible rapidement ❌ Évitez si • 2e panne du même type • Délai > 30 jours annoncé • Coût réparation > 50% prix neuf • Panne récurrente connue du modèle ⏰ Délai maximum : La réparation doit être effectuée dans un "délai raisonnable". En pratique : ≤ 30 jours (L.217-10) selon la complexité. Au-delà, vous pouvez exiger le remplacement.'
              }
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                "2 🔄 OPTION 2 : Remplacement (RECOMMANDÉ) 🎯 Pourquoi c'est souvent le meilleur choix • Appareil neuf avec nouvelle garantie de 2 ans • Aucun risque de panne récurrente • Souvent plus rapide que la réparation • Modèle équivalent ou supérieur si stock épuisé 📋 Conditions d'obtention • Invoquer L.217-9 du Code conso • Justifier que réparation inadéquate • Produit disponible en stock • Dans les 2 ans après achat 💡 Arguments juridiques efficaces • Perte de confiance dans la fiabilité • Risque de récidive inacceptable • Besoin d'un appareil fiable au quotidien • Coût réparation disproportionné 3 💰 OPTION 3 : Remboursement intégral 🎯 Situations où l'exiger • Réparation échouée après 2 tentatives • Remplacement impossible (produit discontinué) • Panne grave compromettant la sécurité • Délais inacceptables (> 1 mois) 💶 Ce qui vous est dû • Prix d'achat intégral • Frais de livraison/installation • TVA incluse • Éventuels dommages-intérêts ⚠️ Attention aux pièges • Refusez les avoirs/bons d'achat • Exigez le remboursement en espèces • Ne payez pas les frais de retour • Gardez l'appareil jusqu'au remboursement 📊 Efficacité des recours selon le type d'appareil 🧺 Lave-linge 78% remplacement obtenu ❄️ Réfrigérateur 65% remboursement 🍽️ Lave-vaisselle 71% réparation réussie"
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'SAV par enseigne : Darty, Boulanger, Conforama, But… Qui est le plus conciliant ?',
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
    mainArticles: ['847' as LegalArticleId, 'L.217-9' as LegalArticleId],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};
