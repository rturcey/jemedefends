// smartphone-telephone-panne-garantie-legale.tsx
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
import type { LegalArticleId } from '@/legal/registry';
import type { GuidePage } from '@/types/guides';

export const GUIDE_SMARTPHONE_TELEPHONE_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Smartphone en panne : garantie légale et recours (iPhone, Samsung, Google)`,
    seo: {
      title: `Smartphone iPhone Samsung en panne : vos droits et recours 2025`,
      description: `Téléphone qui plante, batterie HS, écran défectueux ? Découvrez vos droits : réparation gratuite, remplacement ou remboursement sous 2 ans.`,
      keywords: [
        'smartphone en panne garantie légale',
        'iPhone défectueux remboursement',
        'Samsung Galaxy réparation gratuite',
        'téléphone écran noir SAV',
        'batterie smartphone défaillante',
        'Google Pixel problème garantie',
        'recours telephone en panne',
        'mise en demeure smartphone',
        'code consommation téléphone',
        'SAV téléphone refuse réparation',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Smartphone en panne : garantie légale et recours (iPhone, Samsung, Google)`,
        url: `/guides/smartphone-telephone-panne-garantie-legale`,
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
            examples={['L.217-14', 'L.217-5', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-smartphones',
      title: `Top 10 des pannes de smartphone couvertes par la garantie légale`,
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs
                  text={`• Autonomie divisée par 2+ sans raison (hors vieillissement normal)`}
                />,
                <TextWithLegalRefs text={`• Charge qui ne tient pas malgré calibrage`} />,
                <TextWithLegalRefs text={`• Surchauffe anormale lors de la charge`} />,
                <TextWithLegalRefs text={`• Smartphone qui s"éteint avec encore de la batterie`} />,
                <TextWithLegalRefs text={`• Charge extrêmement lente sans raison`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Votre smartphone présente un dysfonctionnement ? Découvrez si votre problème est couvert par la garantie légale de 2 ans qui s'applique automatiquement à tout achat chez un professionnel.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`🔋 Problèmes de batterie • Autonomie divisée par 2+ sans raison (hors vieillissement normal) • Charge qui ne tient pas malgré calibrage • Surchauffe anormale lors de la charge • Smartphone qui s"éteint avec encore de la batterie • Charge extrêmement lente sans raison Base légale : L.217-5 - Le produit doit correspondre à l'usage attendu et avoir les performances normales.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-smartphone',
      title: `Marche à suivre : comment obtenir réparation, remplacement ou remboursement`,
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Facture/ticket : Preuve d'achat avec date et lieu`} />,
                <TextWithLegalRefs
                  text={`• Photos/vidéos : Montrez le dysfonctionnement en action`}
                />,
                <TextWithLegalRefs text={`• Captures d'écran : Messages d'erreur, paramètres`} />,
                <TextWithLegalRefs
                  text={`• Descriptif vendeur : Page produit avec caractéristiques promises`}
                />,
                <TextWithLegalRefs text={`• Retournez au point de vente`} />,
                <TextWithLegalRefs text={`• Demandez le service client/SAV`} />,
                <TextWithLegalRefs text={`• Mentionnez "garantie légale L.217-9"`} />,
                <TextWithLegalRefs text={`• Email au service client`} />,
                <TextWithLegalRefs text={`• Chat en ligne si disponible`} />,
                <TextWithLegalRefs text={`• Téléphone en dernier recours`} />,
                <TextWithLegalRefs text={`• Garantit la preuve de réception`} />,
                <TextWithLegalRefs text={`• Coût : ~5€`} />,
              ] as React.ReactNode[]
            }
          />{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`🎯 Stratégie recommandée par les experts Ne perdez pas de temps avec les centres de service ! Votre interlocuteur légal est uniquement le vendeur (Apple Store, Fnac, Amazon, etc.). Suivez cette procédure testée et approuvée :`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`1 📋 Documentez le défaut (30 minutes) Preuves indispensables : • Facture/ticket : Preuve d'achat avec date et lieu • Photos/vidéos : Montrez le dysfonctionnement en action • Captures d'écran : Messages d'erreur, paramètres • Descriptif vendeur : Page produit avec caractéristiques promises 💡 Astuce pro : Filmez le défaut en montrant l'écran "À propos" avec le numéro de série visible.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`2 📞 Premier contact (obligatoire) 🏪 Achat en magasin • Retournez au point de vente • Demandez le service client/SAV • Mentionnez "garantie légale L.217-9" 🌐 Achat en ligne • Email au service client • Chat en ligne si disponible • Téléphone en dernier recours Phrase magique : "Mon smartphone présente un défaut de conformité. En application de l'article L.217-9 du Code de la consommation, je souhaite [sa réparation/son remplacement/son remboursement]."`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`3 ✉️ Mise en demeure écrite (si refus/silence) ⏰ Délai : 7 jours ouvrés maximum Si pas de réponse satisfaisante sous une semaine, passez immédiatement à l'écrit.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`📮 Envoi recommandé • Garantit la preuve de réception • Coût : ~5€ • Délai : 2-3 jours 📧 Email avec AR • Plus rapide (immédiat) • Demandez un accusé de réception • Gardez les captures d'écran 4 ⚖️ Escalade en cas d'échec 🏛️ SignalConso Signalement officiel DGCCRF`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`signal.conso.gouv.fr 🤝 Conciliateur Médiation gratuite et rapide`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`justice.fr ⚖️ Tribunal Procédure simplifiée < 5000€`} />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`En dernier recours`} />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`📊 Taux de réussite par approche 34% Contact oral seul 87% Avec mise en demeure écrite 96% Avec escalade SignalConso`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'marques-particularites',
      title: `Spécificités par marque : Apple, Samsung, Google, Xiaomi…`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            Conseils par grande marque : garanties commerciales, réseaux SAV, politiques d’échange.
          </p>
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs
                  text={`Apple : réparation rapide mais exiger l’application de la garantie légale.`}
                />,
                <TextWithLegalRefs
                  text={`Samsung : conservez les preuves de diagnostics successifs en cas de défaut récurrent.`}
                />,
                <TextWithLegalRefs
                  text={`Google : privilégiez les échanges écrits et exigez un délai raisonnable.`}
                />,
                <TextWithLegalRefs
                  text={`Xiaomi : vérifiez le canal d’achat pour l’accès au SAV en France.`}
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
    mainArticles: [
      'L.217-14' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};
