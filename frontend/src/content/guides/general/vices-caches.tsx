// vices-caches.tsx
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

export const GUIDE_VICES_CACHES: GuidePage = {
  metadata: {
    title: 'Matériel audio/vidéo défectueux : garantie légale (2025)',
    seo: {
      title: 'Audio/vidéo défectueux : vos droits garantie légale (Guide 2025)',
      description:
        'TV, enceintes, casques en panne ? Qualité son dégradée, image défaillante ? 2 ans de garantie légale : réparation gratuite, remplacement ou remboursement.',
      keywords: [
        'matériel audio vidéo défectueux',
        'TV défaillante garantie légale',
        'enceintes casques en panne',
        'qualité son image dégradée',
        'barre de son dysfonctionnements',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Matériel audio/vidéo défectueux : garantie légale (2025)',
        url: '/guides/vices-caches',
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
      id: 'defauts-audio-video',
      title: 'Défauts audio/vidéo couverts par la garantie légale',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Pixels morts : > 5 pixels sur dalle neuve`} />,
                <TextWithLegalRefs text={`• Bandes verticales/horizontales : défaut dalle`} />,
                <TextWithLegalRefs text={`• Rétroéclairage défaillant : zones sombres`} />,
                <TextWithLegalRefs text={`• Dalle fissurée : sans choc externe`} />,
                <TextWithLegalRefs text={`• Couleurs délavées : calibrage défaillant`} />,
                <TextWithLegalRefs text={`• Connectique HS : HDMI, USB ne fonctionnent plus`} />,
                <TextWithLegalRefs text={`• Smart TV lente : < 50% performances annoncées`} />,
                <TextWithLegalRefs text={`• Grésillements : parasites constants`} />,
                <TextWithLegalRefs text={`• Coupures audio : son qui s'interrompt`} />,
                <TextWithLegalRefs text={`• Déséquilibre stéréo : canal gauche/droit`} />,
                <TextWithLegalRefs text={`• Saturation : distorsion à volume normal`} />,
                <TextWithLegalRefs text={`• Bluetooth instable : connexion qui chute`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Les équipements audio/vidéo doivent délivrer la qualité promise et fonctionner conformément aux caractéristiques annoncées. Tout défaut dans les 2 ans est couvert.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`📺 TV et écrans ❌ Défauts fréquents • Pixels morts : > 5 pixels sur dalle neuve • Bandes verticales/horizontales : défaut dalle • Rétroéclairage défaillant : zones sombres • Dalle fissurée : sans choc externe • Couleurs délavées : calibrage défaillant • Connectique HS : HDMI, USB ne fonctionnent plus • Smart TV lente : Norme pixels morts : ISO 13406-2 : Class II = max 2 pixels morts + 5 pixels bloqués`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`🔊 Équipements audio ❌ Problèmes sonores • Grésillements : parasites constants • Coupures audio : son qui s'interrompt • Déséquilibre stéréo : canal gauche/droit • Saturation : distorsion à volume normal • Bluetooth instable : connexion qui chute • Réponse fréquence : basses/aigus absents • Puissance insuffisante : Tests objectifs : applications de mesure (SpeakerTest, AudioTool) pour preuves`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`🎯 Critères de conformité spécifiques 📊 Performances • Résolution : native annoncée (4K, 8K) • Fréquence : 50/60/120 Hz selon modèle • Luminosité : nits conformes spécifications • Contraste : ratio annoncé respecté • Puissance audio : watts RMS réels 🔌 Connectivité • Ports annoncés : tous fonctionnels • Standards respectés : HDMI 2.1, USB 3.0 • Wi-Fi/Bluetooth : portée et stabilité • Compatibilité : codecs promis (Dolby, DTS) • Débit : bande passante suffisante ⚙️ Fonctionnalités • Smart TV : applications installables • HDR : formats supportés effectifs • Télécommande : toutes fonctions opérationnelles • Enregistrement : si prévu constructeur • Calibrage : modes image/son disponibles 🧪 Tests et diagnostic 📱 Applications de test • Pixels morts : Dead Pixel Test • Audio : Tone Generator, SpeakerTest • Couleurs : DisplayCAL, ColorHCFR • Latence : Leo Bodnar Input Lag Tester 📊 Mesures objectives • Captures d'écran : défauts visuels • Enregistrements audio : distorsions • Mesures décibels : sonomètre smartphone • Chronométrage : temps de réponse`}
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
