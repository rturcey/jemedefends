// mediation-consommation.tsx
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

export const GUIDE_MEDIATION_CONSOMMATION: GuidePage = {
  metadata: {
    title: 'Ordinateur défectueux : garantie légale et recours (2025)',
    seo: {
      title: 'Ordinateur en panne : vos droits et recours garantie légale (2025)',
      description:
        'Ordinateur lent, qui surchauffe ou ne démarre plus ? Découvrez vos droits : 2 ans de garantie légale, réparation gratuite ou remboursement. Procédure étape par étape.',
      keywords: [
        'ordinateur défectueux garantie légale',
        'PC portable en panne recours',
        'ordinateur lent remboursement',
        'surchauffe ordinateur SAV',
        'garantie légale informatique',
        'Mac défectueux réparation',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Ordinateur défectueux : garantie légale et recours (2025)',
        url: '/guides/mediation-consommation',
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
            examples={['L.217-13', 'L.217-5', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-ordinateurs',
      title: 'Défauts d\\',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={'• Écran défaillant : pixels morts, dalle cassée'} />,
                <TextWithLegalRefs text={'• Clavier/touchpad : touches qui ne répondent plus'} />,
                <TextWithLegalRefs text={'• Connectique : ports USB, HDMI, jack HS'} />,
                <TextWithLegalRefs text={'• Alimentation : ne charge plus, chargeur défectueux'} />,
                <TextWithLegalRefs text={'• Ventilation : surchauffe anormale'} />,
                <TextWithLegalRefs text={'• Disque dur/SSD : erreurs, lenteurs excessives'} />,
                <TextWithLegalRefs text={'• RAM : erreurs mémoire, instabilité'} />,
                <TextWithLegalRefs text={'• Ne démarre plus : écran noir, bootloop'} />,
                <TextWithLegalRefs text={'• Lenteurs anormales : en deçà des specs'} />,
                <TextWithLegalRefs text={'• Plantages fréquents : écrans bleus/kernel panic'} />,
                <TextWithLegalRefs text={'• Wi-Fi défaillant : connexion instable'} />,
                <TextWithLegalRefs text={'• Autonomie : batterie qui ne tient pas'} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Un ordinateur doit fonctionner conformément à sa destination et aux caractéristiques annoncées. La garantie légale de conformité vous protège 2 ans contre les défauts.'
              }
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                '❌ Défauts fréquents couverts 💻 Pannes matérielles • Écran défaillant : pixels morts, dalle cassée • Clavier/touchpad : touches qui ne répondent plus • Connectique : ports USB, HDMI, jack HS • Alimentation : ne charge plus, chargeur défectueux • Ventilation : surchauffe anormale • Disque dur/SSD : erreurs, lenteurs excessives • RAM : erreurs mémoire, instabilité ⚙️ Dysfonctionnements système • Ne démarre plus : écran noir, bootloop • Lenteurs anormales : en deçà des specs • Plantages fréquents : écrans bleus/kernel panic • Wi-Fi défaillant : connexion instable • Autonomie : batterie qui ne tient pas • Logiciels préinstallés : dysfonctionnements • Pilotes : composants non reconnus 📏 Critères de conformité (Article L.217-5) ✅ Conforme • Performances annoncées (processeur, RAM) • Autonomie proche de celle annoncée • Tous logiciels préinstallés fonctionnels • Connectique opérationnelle • Température normale en usage ❌ Non conforme • Performances • Autonomie • Surchauffe récurrente (> 85°C) • Composants absents ou HS • Incompatibilité avec usage normal ⚠️ Usure normale non couverte • Rayures esthétiques sans impact fonctionnel'
              }
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={'• Dégradation batterie normale : -20% après 2 ans acceptable'}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={'• Lenteur liée aux mises à jour OS (sauf si rend inutilisable)'}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={'• Usure mécanique normale : touches brillantes, trackpad poli'}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Procédure étape par étape pour faire valoir vos droits',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={'• Benchmark : UserBenchmark, Geekbench'} />,
                <TextWithLegalRefs text={'• Température : HWMonitor, Core Temp'} />,
                <TextWithLegalRefs text={'• Disque : CrystalDiskInfo, HDTune'} />,
                <TextWithLegalRefs text={'• RAM : MemTest86, Windows Memory'} />,
                <TextWithLegalRefs text={'• Stress test : Prime95, FurMark'} />,
                <TextWithLegalRefs text={"• Captures écrans d'erreur"} />,
                <TextWithLegalRefs text={'• Photos du problème physique'} />,
                <TextWithLegalRefs text={'• Résultats des tests'} />,
                <TextWithLegalRefs text={'• Vidéo du dysfonctionnement'} />,
                <TextWithLegalRefs text={"• Messages d'erreur système"} />,
                <TextWithLegalRefs text={'• Référence exacte du modèle'} />,
                <TextWithLegalRefs text={"• Date d'achat (< 2 ans)"} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`1 🔍 Documenter le défaut 📊 Tests à effectuer • Benchmark : UserBenchmark, Geekbench • Température : HWMonitor, Core Temp • Disque : CrystalDiskInfo, HDTune • RAM : MemTest86, Windows Memory • Stress test : Prime95, FurMark 📸 Preuves à collecter • Captures écrans d'erreur • Photos du problème physique • Résultats des tests • Vidéo du dysfonctionnement • Messages d'erreur système 2 📞 Contact initial avec le vendeur ⚖️ Base légale : Article L.217-9 - Le vendeur doit proposer gratuitement la réparation ou le remplacement.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`📧 Informations à communiquer • Référence exacte du modèle • Date d'achat ( • Description précise du défaut • Impact sur l'utilisation • Exigence : réparation gratuite ⏰ Délais légaux • Réponse : délai raisonnable • Réparation : maximum 30 jours • Inconvénient majeur : prêt obligatoire • Échec : remplacement/remboursement 3 📮 Mise en demeure (si nécessaire) ✍️ Points clés de la lettre • Rappel de l'achat et du défaut constaté • Article L.217-9 : droit à réparation gratuite • Article L.217-14, L.217-16, L.217-17 : remplacement si réparation impossible • Délai de 15 jours pour répondre • Envoi en recommandé avec AR 🚀 Générer ma lettre de mise en demeure Service gratuit, conforme au Code de la consommation`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={"4 ⚖️ Escalade en cas d'échec 🏛️ SignalConso Signalement DGCCRF"}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={'Gratuit • Pression officielle'} />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={'🤝 Médiation Conciliateur conso'} />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={'Gratuit • Délai 60 jours'} />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={'⚖️ Tribunal Procédure simplifiée'} />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={'< 5000€ sans avocat'} />
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
    mainArticles: [
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};
