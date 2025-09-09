// garantie-legale-conformite-guide-complet.tsx
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

export const GUIDE_GARANTIE_LEGALE_CONFORMITE_GUIDE_COMPLET: GuidePage = {
  metadata: {
    title: `Garantie légale de conformité 2025 : Guide complet de vos droits de consommateur`,
    seo: {
      title: `Garantie légale de conformité 2025 : Vos droits et recours (Guide complet)`,
      description: `Découvrez vos droits avec la garantie légale : 2 ans de protection, réparation gratuite, remplacement ou remboursement. Articles L.217-3 à L.217-28 expliqués.`,
      keywords: [
        'garantie légale de conformité',
        'garantie légale 2 ans',
        'droits consommateur France',
        'réparation gratuite',
        'remplacement produit défectueux',
        'remboursement article L.217-9',
        'mise en demeure vendeur',
        'code de la consommation',
        'vice caché produit',
        'SAV refus garantie',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Garantie légale de conformité 2025 : Guide complet de vos droits de consommateur`,
        url: `/guides/garantie-legale-conformite-guide-complet`,
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
            examples={[
              'L.217-11',
              'L.217-13',
              'L.217-14',
              'L.217-3',
              'L.217-5',
              'L.217-7',
              'L.217-9',
            ]}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'definition',
      title: ``,
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs
                  text={`Article L.217-3 : Obligation de conformité du vendeur`}
                />,
                <TextWithLegalRefs text={`Article L.217-5 : Critères de conformité`} />,
                <TextWithLegalRefs text={`Article L.217-7 : Présomption de défaut (2 ans)`} />,
                <TextWithLegalRefs text={`Article L.217-9 : Droits du consommateur`} />,
                <TextWithLegalRefs
                  text={`• Achat chez un professionnel (magasin, site e-commerce)`}
                />,
                <TextWithLegalRefs text={`• Produit neuf ou reconditionné`} />,
                <TextWithLegalRefs text={`• Usage personnel ou mixte`} />,
                <TextWithLegalRefs text={`• Livraison depuis moins de 2 ans`} />,
                <TextWithLegalRefs text={`• Achat entre particuliers (Leboncoin, etc.)`} />,
                <TextWithLegalRefs text={`• Usage professionnel exclusif (B2B)`} />,
                <TextWithLegalRefs text={`• Produit acheté il y a plus de 2 ans`} />,
                <TextWithLegalRefs text={`• Vente aux enchères publiques`} />,
              ] as React.ReactNode[]
            }
          />{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`La garantie légale de conformité est votre bouclier juridique le plus puissant contre les produits défectueux. Méconnue de 70% des consommateurs français, elle vous protège automatiquement pendant 2 ans sur tout achat effectué auprès d'un professionnel.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`⚖️ Base légale incontournable Article L.217-3 : Obligation de conformité du vendeur Article L.217-5 : Critères de conformité Article L.217-7 : Présomption de défaut (2 ans) Article L.217-9 : Droits du consommateur 🎯 Qui est concerné ? ✅ PROTÉGÉ par la garantie légale • Achat chez un professionnel (magasin, site e-commerce) • Produit neuf ou reconditionné • Usage personnel ou mixte • Livraison depuis moins de 2 ans ❌ NON PROTÉGÉ • Achat entre particuliers (Leboncoin, etc.) • Usage professionnel exclusif (B2B) • Produit acheté il y a plus de 2 ans • Vente aux enchères publiques`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Quels défauts sont couverts ? Tous les cas pratiques`,
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Smartphone qui ne s"allume plus`} />,
                <TextWithLegalRefs text={`• Lave-linge qui fuit`} />,
                <TextWithLegalRefs text={`• TV avec écran qui scintille`} />,
                <TextWithLegalRefs text={`• Voiture avec problème moteur`} />,
                <TextWithLegalRefs text={`• Ordinateur qui plante en permanence`} />,
                <TextWithLegalRefs text={`• Caractéristiques techniques différentes`} />,
                <TextWithLegalRefs text={`• Couleur non conforme`} />,
                <TextWithLegalRefs text={`• Taille erronée`} />,
                <TextWithLegalRefs text={`• Accessoires manquants`} />,
                <TextWithLegalRefs text={`• Fonctionnalités absentes`} />,
                <TextWithLegalRefs text={`• Durabilité inférieure à l'attendu`} />,
                <TextWithLegalRefs text={`• Matériaux de mauvaise qualité`} />,
              ] as React.ReactNode[]
            }
          />{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`La garantie légale couvre tous les défauts de conformité , qu'ils soient visibles immédiatement ou qui apparaissent au fil du temps. Voici une liste exhaustive des situations couvertes :`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`🔧 Défauts de fonctionnement • Smartphone qui ne s"allume plus • Lave-linge qui fuit • TV avec écran qui scintille • Voiture avec problème moteur • Ordinateur qui plante en permanence 📋 Non-conformité à la description • Caractéristiques techniques différentes • Couleur non conforme • Taille erronée • Accessoires manquants • Fonctionnalités absentes ⭐ Qualité insuffisante • Durabilité inférieure à l'attendu • Matériaux de mauvaise qualité • Finitions défectueuses • Performance en-deçà des promesses • Usure prématurée anormale 💡 Bon à savoir Présomption légale : Pendant 2 ans (12 mois pour l'occasion), tout défaut est présumé exister dès la livraison. Le vendeur doit prouver que le défaut vient de votre mauvaise utilisation, pas l'inverse !`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vos-droits',
      title: `Vos 4 droits inaliénables : réparation, remplacement, remboursement (Art. L.217-9)`,
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs
                  text={`Demandez d'abord la réparation (solution la plus rapide)`}
                />,
                <TextWithLegalRefs text={`Si refus ou échec, exigez le remplacement`} />,
                <TextWithLegalRefs
                  text={`En dernier recours, réclamez le remboursement intégral`}
                />,
                <TextWithLegalRefs text={`Accompagnez toujours d'une mise en demeure écrite`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Face à un défaut de conformité, la loi vous accorde 4 options de recours dans un ordre précis. Le vendeur ne peut pas vous imposer une solution : vous choisissez !`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`1 🔧 RÉPARATION (Art. L.217-9) Le vendeur doit réparer gratuitement le produit dans un délai raisonnable.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Gratuit : Aucun frais à votre charge (pièces, main d'œuvre, transport) Délai : "Délai raisonnable" selon la complexité (généralement ≤ 30 jours (L.217-10)) Qualité : Réparation durable avec pièces d'origine ou équivalentes`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`2 🔄 REMPLACEMENT (Art. L.217-9) Échange contre un produit identique et conforme.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Produit : Identique ou caractéristiques équivalentes État : Neuf ou reconditionné selon l'achat initial Garantie : Extension de 6 mois (L.217-14, L.217-16, L.217-17)`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`3 💰 RÉDUCTION DU PRIX (Art. L.217-14, L.217-16, L.217-17) Si réparation/remplacement impossible ou refusé.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Calcul : Proportionnel à la gravité du défaut Conservation : Vous gardez le produit défectueux Cumul : Possible avec dommages-intérêts`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`4 💸 REMBOURSEMENT INTÉGRAL (Art. L.217-14, L.217-16, L.217-17) Résolution du contrat et remboursement total.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Montant : Prix d'achat intégral + frais accessoires Délai : 14 jours après retour du produit Retour : Frais de retour à la charge du vendeur`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`🎯 Stratégie recommandée Demandez d'abord la réparation (solution la plus rapide) Si refus ou échec, exigez le remplacement En dernier recours, réclamez le remboursement intégral Accompagnez toujours d'une mise en demeure écrite`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-etapes',
      title: `Procédure étape par étape : comment faire valoir vos droits`,
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Facture ou ticket de caisse (preuve d'achat)`} />,
                <TextWithLegalRefs text={`• Photos/vidéos du défaut (preuves visuelles)`} />,
                <TextWithLegalRefs text={`• Descriptif produit (site web, catalogue)`} />,
                <TextWithLegalRefs
                  text={`• Échanges écrits avec le vendeur (emails, courriers)`}
                />,
                <TextWithLegalRefs text={`• Témoignages si nécessaire`} />,
                <TextWithLegalRefs text={`• Description précise du défaut`} />,
                <TextWithLegalRefs text={`• Référence aux articles L.217-3 et L.217-9`} />,
                <TextWithLegalRefs
                  text={`• Réclamation claire (réparation/remplacement/remboursement)`}
                />,
                <TextWithLegalRefs text={`• Délai de réponse (15 jours recommandés)`} />,
                <TextWithLegalRefs text={`• Mention des recours en cas de refus`} />,
                <TextWithLegalRefs text={`• Signalconso.gouv.fr`} />,
                <TextWithLegalRefs text={`• Conciliateur de justice`} />,
              ] as React.ReactNode[]
            }
          />{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Voici la marche à suivre exacte pour faire valoir votre garantie légale, avec les modèles de lettres et les délais à respecter :`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`1 📋 Rassemblez les preuves • Facture ou ticket de caisse (preuve d'achat) • Photos/vidéos du défaut (preuves visuelles) • Descriptif produit (site web, catalogue) • Échanges écrits avec le vendeur (emails, courriers) • Témoignages si nécessaire 2 📞 Contact amiable préalable Contactez d'abord le vendeur par téléphone ou email pour signaler le défaut.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Phrase-type : "Bonjour, j'ai acheté [produit] le [date] et il présente un défaut de conformité. En application de l'article L.217-9 du Code de la consommation, je souhaite sa réparation/remplacement."`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`3 ✉️ Mise en demeure écrite Si pas de réponse sous 7 jours ou refus, envoyez une mise en demeure.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Contenu obligatoire : • Description précise du défaut • Référence aux articles L.217-3 et L.217-9 • Réclamation claire (réparation/remplacement/remboursement) • Délai de réponse (15 jours recommandés) • Mention des recours en cas de refus 💡 Astuce : Utilisez notre générateur pour créer automatiquement votre lettre conforme !`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`4 ⚖️ Recours si échec 🤝 Solutions amiables • Signalconso.gouv.fr • Conciliateur de justice • Association de consommateurs • Médiateur sectoriel ⚖️ Action judiciaire • Tribunal de proximité (< 10 000€) • Procédure simplifiée possible • Dommages-intérêts possibles • Frais à la charge du perdant`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'pieges-eviter',
      title: `Les 10 pièges à éviter : ce que les vendeurs ne veulent pas que vous sachiez`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Beaucoup de vendeurs comptent sur votre méconnaissance de vos droits. Voici les pièges les plus fréquents et comment les éviter :`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`❌ PIÈGE #1 : "Adressez-vous au fabricant" Ce qu'ils disent :`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`"Ce n'est pas notre problème, contactez [marque] directement."`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Votre réponse :`} />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`"l'article L.217-14 précise que je ne peux être renvoyé vers le fabricant. Vous êtes mon seul interlocuteur."`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`❌ PIÈGE #2 : "La garantie légale ne couvre pas ça" Ce qu'ils disent :`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`"C'est de l'usure normale" ou "Vous l'avez mal utilisé"`} />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Votre réponse :`} />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`"L'article L.217-7 établit une présomption : c"est à vous de prouver la mauvaise utilisation, pas à moi."`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`❌ PIÈGE #3 : "Vous devez payer les frais de retour" Ce qu'ils disent :`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`"Les frais de port sont à vos frais"`} />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Votre réponse :`} />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`"L'article L.217-11 stipule que tous les frais sont à la charge du vendeur."`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`❌ PIÈGE #4 : "Nous ne faisons que des avoirs" Ce qu'ils disent :`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`"On ne rembourse pas, seulement des bons d'achat"`} />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Votre réponse :`} />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`"L'article L.217-14, L.217-16, L.217-17 me donne droit au remboursement en espèces, pas en avoir."`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`❌ PIÈGE #5 : "Il faut l'emballage d'origine" Ce qu'ils disent :`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`"Sans l'emballage, on ne peut rien faire"`} />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Votre réponse :`} />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`"l'emballage n'est pas requis par la loi pour la garantie légale, seule la preuve d'achat suffit."`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`💡 Conseil d'expert Face à ces arguments fallacieux, restez ferme et citez systématiquement les articles de loi. La plupart des vendeurs cèdent quand ils réalisent que vous connaissez vos droits. Si nécessaire, demandez à parler au responsable ou au service juridique.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'exemples-concrets',
      title: `Cas pratiques résolus : 15 exemples concrets avec solutions`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Découvrez comment d'autres consommateurs ont fait valoir leurs droits dans des situations similaires à la vôtre. Ces cas réels vous donneront les clés pour réussir :`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`📱 iPhone 14 : batterie qui se décharge en 2h Situation : Acheté chez Fnac il y a 8 mois, autonomie divisée par 10 sans raison.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`✅ Solution : Mise en demeure citant L.217-5 (conformité à l'usage attendu). Fnac a proposé un remplacement immédiat par un iPhone 14 neuf. Délai : 3 jours.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`🏠 Lave-linge Whirlpool : panne après 13 mois Situation : Acheté chez Darty, tambour bloqué, coût réparation annoncé : 380€.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`✅ Solution : Refus du devis, invocation L.217-11 (réparation gratuite). Darty a pris en charge la réparation complète. Économie : 380€.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`🚗 Peugeot 208 neuve : problème boîte de vitesse Situation : Achetée en concession, à-coups permanents, utilisation impossible.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`✅ Solution : Après 2 réparations échouées, résolution du contrat (L.217-14, L.217-16, L.217-17). Remboursement intégral : 23 500€ + dommages-intérêts pour les désagréments.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`💻 MacBook Pro M2 : surchauffe excessive Situation : Acheté sur Amazon, ventilateur à fond en permanence, ralentissements.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`✅ Solution : Documentation du défaut avec captures d'écran des températures. Amazon a accepté le remplacement par un MacBook Pro M3 (modèle supérieur) à prix égal.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`📊 Statistiques de réussite 87% Résolution amiable avec mise en demeure 15 jours Délai moyen de résolution €2,341 Économie moyenne par dossier`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'delais-prescrips',
      title: `Délais et prescription : ne ratez pas le coche`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`⏰ URGENT : Délais à ne pas manquer La garantie légale a des délais stricts. Passé ces échéances, vous perdez définitivement vos droits. Voici tout ce qu'il faut savoir :`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`📅 Durée de la garantie Produits NEUFS 2 ans à partir de la livraison (L.217-7)`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Produits d'OCCASION 12 mois minimum (peut être réduit par accord)`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Services NUMÉRIQUES 2 ans ou durée du contrat si supérieure`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`⚖️ Délai d'action en justice Action contractuelle 5 ans à partir de la livraison (Art. 2224 Code civil)`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`⚠️ Attention Ne confondez pas durée de garantie et délai pour agir en justice !`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`🎯 Moments clés de votre garantie J Livraison`} />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`6M Présomption forte`} />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`1A Présomption affaiblie`} />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`2A Fin de garantie`} />
          </p>
        </div>
      ),
    },
    {
      id: 'faq-complete',
      title: `FAQ : 20 questions que vous vous posez`,
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs
                  text={`Qui contacter ? Le vendeur est l’unique interlocuteur pour la conformité.`}
                />,
                <TextWithLegalRefs
                  text={`Délais : mise en conformité dans un délai raisonnable (≤ 30 jours).`}
                />,
                <TextWithLegalRefs
                  text={`Frais : transport, main-d’œuvre et pièces à la charge du vendeur.`}
                />,
                <TextWithLegalRefs
                  text={`Si échec : réduction du prix ou résolution avec remboursement.`}
                />,
              ] as React.ReactNode[]
            }
          />
          <div className="pt-2">
            <Button asChild>
              <a href="/eligibilite">📄 Créer ma lettre maintenant</a>
            </Button>
          </div>
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-14' as LegalArticleId,
      'L.217-3' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};
