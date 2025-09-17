// permanences-juridiques.tsx
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

export const GUIDE_PERMANENCES_JURIDIQUES: GuidePage = {
  metadata: {
    title: `Permanences juridiques gratuites : conseils d\\`,
    seo: {
      title: `Permanences juridiques gratuites : avocats gratuits près de vous (2025)`,
      description: `Besoin de conseils juridiques gratuits ? Trouvez des avocats en permanence dans votre mairie, tribunal ou maison de justice. Consultations gratuites et accessibles.`,
      keywords: [
        `permanence juridique gratuite`,
        `avocat gratuit mairie`,
        `consultation juridique gratuite`,
        `point accès droit`,
        `conseil juridique proximité`,
      ],
    },
    breadcrumb: [
      { name: `Accueil`, url: `/` },
      { name: `Guides`, url: `/guides` },
      {
        name: `Permanences juridiques gratuites : conseils d\\`,
        url: `/guides/permanences-juridiques`,
      },
    ],
  },
  sections: [
    {
      id: `intro`,
      title: `L’essentiel`,
      content: (
        <div className="space-y-3">
          <ErrorAlert type="info" className="text-sm sm:text-base">
            Exigez la <strong>mise en conformité</strong> (réparation ou remplacement). En cas
            d’échec : <strong>réduction du prix</strong> ou <strong>résolution</strong>. Tous frais
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
      id: `types-permanences`,
      title: `Types de permanences et lieux d\\`,
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Fréquence : 1er et 3e samedi du mois`} />,
                <TextWithLegalRefs text={`• Horaires : 9h-12h généralement`} />,
                <TextWithLegalRefs text={`• Durée consultation : 30 minutes`} />,
                <TextWithLegalRefs text={`• Sur RDV : prise au secrétariat mairie`} />,
                <TextWithLegalRefs text={`• Zones : toutes communes > 20 000 habitants`} />,
                <TextWithLegalRefs text={`• Barreaux locaux : roulement organisé`} />,
                <TextWithLegalRefs
                  text={`• Spécialisations variées : consommation, famille, travail`}
                />,
                <TextWithLegalRefs text={`• Expérience confirmée : minimum 5 ans`} />,
                <TextWithLegalRefs text={`• Déontologie : secret professionnel garanti`} />,
                <TextWithLegalRefs text={`• Tribunaux judiciaires : hall d'accueil`} />,
                <TextWithLegalRefs text={`• Tribunaux de proximité : selon disponibilité`} />,
                <TextWithLegalRefs text={`• Cours d'appel : grandes villes`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Les permanences juridiques gratuites sont organisées par les points d'accès au droit sur tout le territoire français, en application de la loi du 10 juillet 1991 .`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`🏛️ Permanences en mairie 📅 Organisation type • Fréquence : 1er et 3e samedi du mois • Horaires : 9h-12h généralement • Durée consultation : 30 minutes • Sur RDV : prise au secrétariat mairie • Zones : toutes communes > 20 000 habitants ⚖️ Avocats présents • Barreaux locaux : roulement organisé • Spécialisations variées : consommation, famille, travail • Expérience confirmée : minimum 5 ans • Déontologie : secret professionnel garanti 🔍 Trouver : Contactez votre mairie ou consultez le site de votre préfecture`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`⚖️ Points d'accès au droit (tribunaux) 🏛️ Localisations • Tribunaux judiciaires : hall d'accueil • Tribunaux de proximité : selon disponibilité • Cours d'appel : grandes villes • Accès direct : pas de RDV parfois 🕐 Créneaux • Matinées : mardi, jeudi souvent • Consultations : 20-30 minutes • File d'attente : premier arrivé, premier servi • Capacité : 10-15 personnes/séance 📍 Localiser : justice.fr → "Points d'accès au droit" → votre département`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`🏠 Maisons de justice et du droit 🌟 Services étendus • Accueil personnalisé : orientation juridique • Consultations d'avocats : sur RDV • Médiateurs : règlement amiable • Notaires : conseils patrimoniaux • Huissiers : procédures recouvrement 📞 Modalités • RDV obligatoire : par téléphone • Délai : 2-3 semaines généralement • Durée : 45 minutes à 1h • Suivi possible : selon les cas 🗺️ Carte : conseil-national.mediation.fr → "Annuaire des maisons de justice"`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`🤝 Autres lieux d'accès 🏘️ Centres sociaux • Quartiers populaires • Proximité habitants • Horaires adaptés • Accompagnement social 🏢 Préfectures/sous-préfectures • Droit des étrangers • Procédures administratives • Recours préfectoraux • Contentieux public 🚂 Antennes mobiles • Zones rurales isolées • Caravanes du droit • Planning tournant • Bus juridiques`}
            />
          </p>
        </div>
      ),
    },
    {
      id: `preparation-consultation`,
      title: `Préparer sa consultation juridique`,
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Carte d'identité ou passeport`} />,
                <TextWithLegalRefs text={`• Justificatif domicile récent`} />,
                <TextWithLegalRefs text={`• Situation familiale : livret famille si pertinent`} />,
                <TextWithLegalRefs text={`• Chronologie écrite : dates clés`} />,
                <TextWithLegalRefs text={`• Contrats : vente, service, garantie`} />,
                <TextWithLegalRefs text={`• Correspondances : emails, courriers`} />,
                <TextWithLegalRefs text={`• Preuves : photos, factures, témoignages`} />,
                <TextWithLegalRefs text={`• "Ai-je des droits dans cette situation ?"`} />,
                <TextWithLegalRefs text={`• "Quels textes de loi s'appliquent ?"`} />,
                <TextWithLegalRefs text={`• "Quelles sont mes chances de succès ?"`} />,
                <TextWithLegalRefs text={`• "Quels sont les risques si j'échoue ?"`} />,
                <TextWithLegalRefs text={`• "Par quoi commencer concrètement ?"`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`📁 Documents à apporter 🆔 Pièces d'identité • Carte d'identité ou passeport • Justificatif domicile récent • Situation familiale : livret famille si pertinent 📋 Dossier litige • Chronologie écrite : dates clés • Contrats : vente, service, garantie • Correspondances : emails, courriers • Preuves : photos, factures, témoignages ❓ Questions essentielles à poser ⚖️ Analyse juridique • "Ai-je des droits dans cette situation ?" • "Quels textes de loi s"appliquent ?" • "Quelles sont mes chances de succès ?" • "Quels sont les risques si j'échoue ?" 🎯 Stratégie pratique • "Par quoi commencer concrètement ?" • "Quels délais dois-je respecter ?" • "Combien cela va-t-il me coûter ?" • "Puis-je avoir des dommages-intérêts ?" ⚠️ Limites des consultations gratuites ❌ Ce qu'elles ne font PAS • Rédaction d'actes : mises en demeure, requêtes • Représentation : audience, négociation • Suivi long : accompagnement durable • Urgences : référés, saisines immédiates ✅ Ce qu'elles offrent • Diagnostic juridique : faisabilité • Orientation : vers bons interlocuteurs • Information : droits et obligations • Première approche : débroussaillage 🚀 Suites possibles après consultation 💼 Avocat payant • Si dossier complexe • Honoraires : 150-500€/h • Aide juridictionnelle possible • Assurance protection juridique 🤝 Solutions amiables • Médiation consommation • Conciliateur de justice • Associations de consommateurs • SignalConso ⚖️ Action en justice • Procédure simplifiée • Tribunal judiciaire • Référé si urgence • Sans avocat possible`}
            />
          </p>
        </div>
      ),
    },
    {
      id: `procedure`,
      title: `Procédure type`,
      content: <StandardProcedure />,
    },
    {
      id: `alternatives`,
      title: `Si ça bloque`,
      content: <DefaultAlternatives />,
    },
    {
      id: `contacts`,
      title: `Contacts utiles`,
      content: <DefaultContacts />,
    },
    {
      id: `cta`,
      title: `Passer à l’action`,
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
    lastUpdated: `2025-09-09`,
  },
};
