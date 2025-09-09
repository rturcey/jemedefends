// amazon-garantie-retours.tsx
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

export const GUIDE_AMAZON_GARANTIE_RETOURS: GuidePage = {
  metadata: {
    title: 'Électroménager en panne : garantie légale et recours (2025)',
    seo: {
      title: 'Électroménager défaillant : vos droits garantie légale (Guide 2025)',
      description:
        'Lave-linge, lave-vaisselle, réfrigérateur en panne ? 2 ans de garantie légale : réparation gratuite obligatoire, remplacement ou remboursement. Procédure complète.',
      keywords: [
        'électroménager panne garantie légale',
        'lave-linge défaillant recours',
        'lave-vaisselle HS réparation',
        'réfrigérateur panne SAV',
        'four défectueux remboursement',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Électroménager en panne : garantie légale et recours (2025)',
        url: '/guides/amazon-garantie-retours',
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
            examples={['L.217-7']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'pannes-electromenager',
      title: "Pannes d'électroménager",
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={"• Fuite d'eau : joint, durite, pompe"} />,
                <TextWithLegalRefs text={'• Essorage défaillant : linge trempé'} />,
                <TextWithLegalRefs text={'• Chauffage HS : eau froide constante'} />,
                <TextWithLegalRefs text={'• Tambour bloqué : roulement usé'} />,
                <TextWithLegalRefs text={'• Vidange impossible : pompe HS'} />,
                <TextWithLegalRefs text={'• Électronique : programmateur défaillant'} />,
                <TextWithLegalRefs text={'• Température instable : +/- 5°C'} />,
                <TextWithLegalRefs text={'• Compresseur bruyant : > 45 dB'} />,
                <TextWithLegalRefs text={'• Dégivrage automatique HS'} />,
                <TextWithLegalRefs text={"• Joint défaillant : fuite d'air"} />,
                <TextWithLegalRefs text={'• Éclairage défaillant permanent'} />,
                <TextWithLegalRefs text={'• Consommation excessive : +50% annoncée'} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                "L'électroménager doit être conforme à l'usage attendu et fonctionner selon les caractéristiques annoncées. Tout défaut survenant dans les 2 ans est présumé exister dès l'achat ( Article L.217-7 )."
              }
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                "🌊 Lave-linge / Lave-vaisselle ❌ Pannes fréquentes • Fuite d'eau : joint, durite, pompe • Essorage défaillant : linge trempé • Chauffage HS : eau froide constante • Tambour bloqué : roulement usé • Vidange impossible : pompe HS • Électronique : programmateur défaillant 💡 Conseil : Une panne récurrente après réparation SAV = défaut de conformité manifeste"
              }
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                "❄️ Réfrigérateur / Congélateur ❌ Dysfonctionnements • Température instable : +/- 5°C • Compresseur bruyant : > 45 dB • Dégivrage automatique HS • Joint défaillant : fuite d'air • Éclairage défaillant permanent • Consommation excessive : +50% annoncée ⚠️ Urgence : Perte d'aliments = dommages-intérêts en plus de la réparation"
              }
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                "🔥 Four / Plaques cuisson ❌ Défauts courants • Température incorrecte : écart > 20°C • Résistance grillée : plus de chaleur • Ventilation HS : cuisson inégale • Porte défaillante : ne ferme plus • Programmateur : ne démarre pas • Pyrolyse défaillante ☕ Petit électroménager ❌ Problèmes fréquents • Cafetière : fuite, chauffe pas • Grille-pain : résistance, éjection • Mixeur : moteur, lames émoussées • Aspirateur : perte succion, filtre • Fer à repasser : semelle, vapeur 📏 Critères de conformité électroménager Performance Conforme aux specs (conso, efficacité) Durabilité Résiste à l'usage normal intensif Sécurité Normes CE, pas de danger"
              }
            />
          </p>
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
    mainArticles: ['L.217-7' as LegalArticleId],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};
