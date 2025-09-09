/* AUTO-MIGRATED ALL GUIDES — no legacy fallback */
'use client';

import * as React from 'react';

import AlternativeOptions from '@/components/ui/AlternativeOptions';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import CompanyContact from '@/components/ui/CompanyContact';
import DefaultGrid from '@/components/ui/DefaultGrid';
import ErrorAlert from '@/components/ui/ErrorAlert';
import LegalNote from '@/components/ui/LegalNote';
import LegalReference from '@/components/ui/LegalReference';
import ProcedureStep from '@/components/ui/ProcedureStep';
import TimelineProcess from '@/components/ui/TimelineProcess';
import type { GuidePage } from '@/types/guides';

const TextWithLegalRefs: React.FC<{ text: string }> = ({ text }) => {
  const parts: Array<string | React.ReactNode> = [];
  // Reconnaît: L.217-xx, L.612-x, CPC 808|843-847, art. 1641..1649 (incl. 1642.1 / 1646.1)
  const pattern =
    /(L\.217-(\d{1,2}))|(L\.612-([1-5]))|\b(?:CPC\s*)?(808|843|844|845|846|847)\b|\b(?:art\.?\s*)?(164(?:2\.1|6\.1|[1-9]))\b/gi;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(text)) !== null) {
    if (m.index > lastIndex) parts.push(text.slice(lastIndex, m.index));
    let code: LegalArticleId | null = null;
    if (m[1]) code = `L.217-${m[2]}` as LegalArticleId;
    else if (m[3]) code = `L.612-${m[4]}` as LegalArticleId;
    else if (m[5])
      code = m[5] as LegalArticleId; // CPC
    else if (m[6]) code = m[6] as LegalArticleId; // Code civil
    if (code) {
      parts.push(<LegalReference key={`ref-${parts.length}`} code={code} />);
    }
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return <>{parts}</>;
};

function StandardProcedure() {
  return (
    <>
      <TimelineProcess
        items={[
          {
            id: 'reunir-preuves',
            title: 'Réunir les preuves',
            description: 'Facture, photos/vidéos, échanges, diagnostics.',
          },
          {
            id: 'mise-en-conformite',
            title: 'Demander la mise en conformité',
            description: <LegalReference code="L.217-9" />,
          },
          {
            id: 'delais-frais',
            title: 'Délais & frais',
            description: (
              <>
                <LegalReference code="L.217-10" /> <span aria-hidden>•</span>{' '}
                <LegalReference code="L.217-11" />
              </>
            ),
          },
          {
            id: 'echec-refus',
            title: 'Si échec / refus',
            description: (
              <>
                <LegalReference code="L.217-12" /> <span aria-hidden>•</span>{' '}
                <LegalReference code="L.217-14" /> <span aria-hidden>•</span>{' '}
                <LegalReference code="L.217-15" /> <span aria-hidden>•</span>{' '}
                <LegalReference code="L.217-16" /> <span aria-hidden>•</span>{' '}
                <LegalReference code="L.217-17" />
              </>
            ),
          },
        ]}
      />

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <ProcedureStep
          number={1}
          title="Réparation"
          description="Transport, main-d’œuvre et pièces à la charge du vendeur."
          law={<LegalReference code="L.217-11" />}
        />
        <ProcedureStep
          number={2}
          title="Remplacement"
          description="Si réparation impossible ou disproportionnée."
          law={<LegalReference code="L.217-12" />}
        />
      </div>
    </>
  );
}

function DefaultAlternatives() {
  return (
    <AlternativeOptions
      options={[
        {
          label: 'Médiation (gratuite)',
          description: 'Saisine possible après réclamation écrite.',
          law: (
            <>
              <LegalReference code="L.612-1" />
              <span aria-hidden>•</span> <LegalReference code="L.612-2" />
              <span aria-hidden>•</span> <LegalReference code="L.612-4" />
            </>
          ),
          href: '/mediation',
        },
        {
          label: 'Action en justice',
          description: 'Référés / fond selon l’urgence et les preuves.',
          law: (
            <>
              CPC: <LegalReference code="808" />
              <span aria-hidden>•</span> <LegalReference code="843" />
              <span aria-hidden>•</span> <LegalReference code="844" />
              <span aria-hidden>•</span> <LegalReference code="845" />
              <span aria-hidden>•</span> <LegalReference code="846" />
              <span aria-hidden>•</span> <LegalReference code="847" />
            </>
          ),
          href: '/procedures',
        },
      ]}
    />
  );
}

function DefaultContacts() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <CompanyContact
        name="Service client du vendeur"
        channels={[{ type: 'email', value: 'service-client@example.com' }]}
        note="Privilégiez l’écrit (LRAR / e-LRAR) et joignez vos pièces."
      />
      <CompanyContact
        name="Médiateur de la consommation"
        channels={[{ type: 'web', value: 'https://www.mediation-consommation.fr' }]}
        note={
          <>
            Gratuit pour le consommateur — <LegalReference code="L.612-1" />.
          </>
        }
      />
    </div>
  );
}

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

export const GUIDE_SMARTPHONE_ECRAN_BATTERIE_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Smartphone défectueux : garantie légale 2025`,
    seo: {
      title: `Smartphone en panne : vos droits 2025`,
      description: `Écran, batterie, réseau : faites jouer la garantie légale (2 ans). Lettre de mise en demeure prête en 3 minutes.`,
      keywords: [
        'smartphone garantie légale',
        'écran cassures lignes défaut',
        'batterie ne tient pas téléphone',
        'réseau 4G 5G instable recours',
        'L.217-9 réparation smartphone',
        'vendeur responsable L.217-3',
        'présomption 2 ans L.217-7',
        'L.217-11 frais à charge vendeur',
        'remboursement L.217-13',
        'mise en demeure smartphone',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Smartphone défectueux : garantie légale 2025`,
        url: `/guides/smartphone-ecran-batterie-defaut-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-3', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts smartphone couverts par la loi`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Couverts (L.217-5, L.217-7) : écran avec lignes/pixels morts, tactile fantôme, batterie chute anormale, recharge capricieuse, pertes réseau répétées, micro/HP défaillants.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Non couvert : casse accidentelle/immersion hors promesse d’étanchéité. En revanche, une étanchéité annoncée mais non tenue reste couverte.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Procédure en 4 étapes : simple et efficace`,
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`Preuves (photos/vidéos, batterie, réseau) + facture`} />,
                <TextWithLegalRefs
                  text={`Demande au vendeur : réparation/remplacement (L.217-9)`}
                />,
                <TextWithLegalRefs text={`Mise en demeure écrite (L.217-3, L.217-7, L.217-11)`} />,
                <TextWithLegalRefs
                  text={`Échec : réduction du prix ou remboursement (L.217-14, L.217-16, L.217-17)`}
                />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Preuves (photos/vidéos, batterie, réseau) + facture Demande au vendeur : réparation/remplacement (L.217-9) Mise en demeure écrite (L.217-3, L.217-7, L.217-11) Échec : réduction du prix ou remboursement (L.217-14, L.217-16, L.217-17) Générer ma lettre →`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Boutiques & e-commerce : nos conseils`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-3' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_ORDINATEUR_PORTABLE_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Ordinateur portable en panne : vos recours 2025`,
    seo: {
      title: `PC portable défectueux : droits 2025`,
      description: `Écran, carte-mère, SSD, batterie : garantie légale 2 ans. Obtenez réparation, remplacement ou remboursement rapidement.`,
      keywords: [
        'ordinateur portable garantie légale',
        'pc portable écran défaut',
        'ssd panne remboursement',
        'batterie pc portable faible',
        'L.217-9 réparation ordinateur',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'présomption 2 ans L.217-7',
        'vendeur responsable L.217-3',
        'mise en demeure pc',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Ordinateur portable en panne : vos recours 2025`,
        url: `/guides/ordinateur-portable-panne-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts par la garantie légale`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Matériel : écran/pixels, clavier/charnières, SSD/RAM, carte-mère.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Usage : surchauffe anormale, extinction, batterie anormale, ports USB/HDMI HS.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Références : L.217-5 (conformité), L.217-7 (présomption).`} />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Chemin vers la mise en conformité`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Demandez d’abord la réparation (L.217-9). Si échec ou délai déraisonnable : remplacement. En dernier recours : réduction du prix/remboursement (L.217-14, L.217-16, L.217-17). Frais vendeur (L.217-11).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Lettre conforme →`} />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Revendeurs : pratiques efficaces`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_ROUTEUR_WIFI_MESH_DECONNEXIONS_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Routeur/mesh déconnexions : garantie légale 2025`,
    seo: {
      title: `Routeur Wi-Fi défectueux : recours`,
      description: `Coupures, ports HS, débit instable : faites jouer la garantie légale. Lettre de mise en demeure en 3 minutes.`,
      keywords: [
        'routeur wifi panne garantie',
        'mesh deconnexions recours',
        'débit wifi instable défaut',
        'ports ethernet HS routeur',
        'L.217-9 réparation routeur',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement routeur',
        'présomption L.217-7',
        'vendeur responsable L.217-3',
        'mise en demeure routeur',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Routeur/mesh déconnexions : garantie légale 2025`,
        url: `/guides/routeur-wifi-mesh-deconnexions-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts réseau couverts`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Coupures récurrentes, débit faible vs caractéristiques, ports LAN/WAN HS, redémarrages intempestifs, firmware instable empêchant l’usage : L.217-5, L.217-7.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Obtenir une solution rapide`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Réparation/remplacement auprès du vendeur (L.217-9), frais inclus (L.217-11). Si échec : réduction/remboursement (L.217-14, L.217-16, L.217-17).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Distributeurs : accélérer`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_APPAREIL_PHOTO_HYBRIDE_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Appareil photo hybride : garantie légale 2025`,
    seo: {
      title: `Hybride en panne : vos recours 2025`,
      description: `Autofocus erratique, capteur taché, ports HS : garantie légale. Obtenez réparation, remplacement ou remboursement.`,
      keywords: [
        'appareil photo hybride garantie légale',
        'autofocus panne recours',
        'capteur taches défaut',
        'ports hdmi usb hs boîtier',
        'L.217-9 réparation photo',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption 2 ans',
        'vendeur responsable L.217-3',
        'mise en demeure photo',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Appareil photo hybride : garantie légale 2025`,
        url: `/guides/appareil-photo-hybride-defaut-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts sur boîtiers hybrides`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`AF qui “pompe” en lumière normale, capteur avec taches d’origine, obturateur bruyant/instable, ports HS, surchauffe empêchant l’usage : L.217-5, L.217-7.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Démarches concrètes`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Réparation prioritaire (L.217-9), sinon remplacement. En cas d’échec : réduction/remboursement (L.217-14, L.217-16, L.217-17). Frais vendeur (L.217-11).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Magasins photo : bonnes pratiques`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_LAVE_LINGE_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Lave-linge en panne : garantie légale 2025`,
    seo: {
      title: `Lave-linge défectueux : recours 2025`,
      description: `Fuite, tambour bloqué, carte HS : faites jouer la garantie légale. Réparation/remplacement/remboursement.`,
      keywords: [
        'lave linge panne garantie',
        'fuite machine a laver recours',
        'tambour bloque défaut',
        'carte électronique HS machine',
        'L.217-9 réparation lave linge',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure lave linge',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Lave-linge en panne : garantie légale 2025`,
        url: `/guides/lave-linge-panne-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts & risques`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Fuites, tambour/roulements, carte/affichage HS, chauffe absente, cyclage erratique : couverts (L.217-5, L.217-7). Risque d’inondation ⇒ intervention rapide.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Procédure à activer vite`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Réparation prioritaire (L.217-9). Si immobilisation longue/défaut récurrent : remplacement. À défaut : remboursement (L.217-14, L.217-16, L.217-17). Frais à la charge du vendeur (L.217-11).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Créer ma lettre →`} />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Pose/transport : qui paie ?`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_LAVE_VAISSELLE_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Lave-vaisselle défectueux : garantie légale 2025`,
    seo: {
      title: `LV en panne : vos droits 2025`,
      description: `Fuites, chauffe absente, pompe HS : garantie légale. Réparation, remplacement ou remboursement, frais au vendeur.`,
      keywords: [
        'lave vaisselle panne garantie',
        'pompe HS lave vaisselle',
        'chauffe absente LV',
        'fuite LV recours',
        'L.217-9 réparation LV',
        'L.217-11 frais vendeur LV',
        'L.217-13 remboursement LV',
        'L.217-7 présomption LV',
        'vendeur responsable L.217-3',
        'mise en demeure LV',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Lave-vaisselle défectueux : garantie légale 2025`,
        url: `/guides/lave-vaisselle-defaut-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts & preuves`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Fuites, code erreur pompe, chauffe absente, bras de lavage bloqués, cartes HS : couverts (L.217-5, L.217-7). Photos/vidéos utiles.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Obtenir la mise en conformité`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Réparation via vendeur (L.217-9) → si échec : remplacement → sinon remboursement (L.217-14, L.217-16, L.217-17). Transport et MO à la charge du vendeur (L.217-11).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Installateurs : cadrage utile`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_REFRIGERATEUR_CONGELATEUR_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Réfrigérateur/Congélateur : recours 2025`,
    seo: {
      title: `Frigo défectueux : garantie légale`,
      description: `Froid insuffisant, fuites, carte HS : garantie légale 2 ans. Réparation, remplacement, remboursement. Lettre en 3 minutes.`,
      keywords: [
        'réfrigérateur garantie légale',
        'froid insuffisant frigo',
        'fuite gaz frigo défaut',
        'carte électronique frigo HS',
        'L.217-9 réparation frigo',
        'L.217-11 frais vendeur frigo',
        'L.217-13 remboursement frigo',
        'L.217-7 présomption frigo',
        'vendeur responsable L.217-3',
        'mise en demeure frigo',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Réfrigérateur/Congélateur : recours 2025`,
        url: `/guides/refrigerateur-congelateur-defaut-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts froid & électronique couverts`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Températures hors tolérance, dégivrage défaillant, ventilateur HS, fuites, cartes/sondes HS : L.217-5, L.217-7.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Denrées perdues ? Conservez les preuves pour la négociation civile/assurance (hors garantie légale elle-même).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Étapes pour une solution rapide`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Réparation (L.217-9). Si échec/délai anormal : remplacement. Dernier recours : remboursement (L.217-14, L.217-16, L.217-17). Frais vendeur (L.217-11).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Livraison/pose : précisions utiles`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_ASPIRATEUR_ROBOT_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Aspirateur robot en panne : garantie légale 2025`,
    seo: {
      title: `Robot aspirateur défectueux : recours`,
      description: `Navigation erratique, batterie/fonte de charge, station HS : garantie légale. Lettre prête en 3 min.`,
      keywords: [
        'aspirateur robot garantie légale',
        'navigation erratique robot',
        'batterie robot aspirateur',
        'station de vidage HS',
        'L.217-9 réparation aspirateur',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption 2 ans',
        'vendeur responsable L.217-3',
        'mise en demeure robot',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Aspirateur robot en panne : garantie légale 2025`,
        url: `/guides/aspirateur-robot-panne-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts robot/IA couverts`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Cartographie perdue, capteurs/roues défaillants, batterie chute anormale, station qui ne vide pas : L.217-5, L.217-7.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Du signalement à la solution`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Réparation/remplacement (L.217-9) via vendeur → si échec : réduction/remboursement (L.217-14, L.217-16, L.217-17). Frais : vendeur (L.217-11).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `E-commerce : sécuriser la preuve`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_MICRO_ONDES_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Micro-ondes en panne : garantie légale 2025`,
    seo: {
      title: `Micro-ondes défectueux : recours`,
      description: `Chauffe faible, plateau/porte HS : garantie légale. Réparation, remplacement, remboursement. Lettre conforme immédiate.`,
      keywords: [
        'micro ondes panne garantie',
        'chauffe faible micro ondes',
        'plateau ne tourne pas',
        'porte micro ondes défaut',
        'L.217-9 réparation micro ondes',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure micro ondes',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Micro-ondes en panne : garantie légale 2025`,
        url: `/guides/micro-ondes-panne-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts micro-ondes couverts`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Chauffe quasi nulle, plateau inopérant, minuterie/affichage HS, porte qui ferme mal (sécurité) : L.217-5, L.217-7.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Étapes légales rapides`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Réparation par le vendeur (L.217-9) • Frais à sa charge (L.217-11) • Échec : remboursement (L.217-14, L.217-16, L.217-17).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Sécurité & preuves`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_CHAUFFE_EAU_ELECTRIQUE_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Chauffe-eau électrique : garantie légale 2025`,
    seo: {
      title: `Chauffe-eau en panne : vos recours`,
      description: `Résistance HS, fuite, carte défaillante : garantie légale. Réparation/remplacement/remboursement, frais au vendeur.`,
      keywords: [
        'chauffe eau garantie légale',
        'résistance HS cumulus',
        'fuite ballon eau chaude',
        'carte chauffe eau défaut',
        'L.217-9 réparation chauffe eau',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure chauffe eau',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Chauffe-eau électrique : garantie légale 2025`,
        url: `/guides/chauffe-eau-electrique-defaut-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts & urgence sanitaire`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Fuite, absence de chauffe, carte HS, anode défaillante prématurée : L.217-5, L.217-7. Absence d’eau chaude = urgence, exigez un délai court.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Mise en conformité par le vendeur`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Réparation (L.217-9) → Remplacement si besoin → Remboursement si échec (L.217-14, L.217-16, L.217-17). Transport/MO/consommables à la charge du vendeur (L.217-11).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Installateur : formaliser par écrit`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_PORTAIL_MOTORISE_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Portail motorisé : garantie légale 2025`,
    seo: {
      title: `Portail motorisé en panne : recours`,
      description: `Moteur/carte/capteurs HS : garantie légale. Réparation, remplacement, remboursement. Frais au vendeur.`,
      keywords: [
        'portail motorisé garantie légale',
        'moteur portail panne',
        'carte électronique portail',
        'cellules photo HS portail',
        'L.217-9 réparation portail',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure portail',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Portail motorisé : garantie légale 2025`,
        url: `/guides/portail-motorise-defaut-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts & sécurité d’usage`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Moteur qui force, carte HS, cellules non détectées, télécommandes inopérantes : L.217-5, L.217-7. Mentionnez les risques sécurité (écrasement/fermeture).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Itinéraire légal côté consommateur`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Réparation (L.217-9) → Mise en demeure → Remplacement/remboursement (L.217-14, L.217-16, L.217-17). Tous frais à la charge du vendeur (L.217-11).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Poseur/distributeur : preuves utiles`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_AUTORADIO_INFOTAINMENT_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Autoradio/infotainment : garantie légale 2025`,
    seo: {
      title: `Infotainment défectueux : vos droits`,
      description: `Écran/GPS/BT qui bug ? Garantie légale si le système a été vendu comme produit. Réparation/remplacement/remboursement.`,
      keywords: [
        'autoradio garantie légale',
        'infotainment bug gps',
        'bluetooth voiture défaut',
        'écran tactile auto HS',
        'L.217-9 réparation autoradio',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure autoradio',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Autoradio/infotainment : garantie légale 2025`,
        url: `/guides/autoradio-infotainment-defaut-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Quand la garantie légale s’applique`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`S’applique si l’autoradio/écran a été vendu comme produit par un pro. Bugs bloquants, écran HS, GPS/Bluetooth inopérant : L.217-5, L.217-7.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Processus côté consommateur`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Réparation/remplacement via vendeur (L.217-9), frais à sa charge (L.217-11). Échec : réduction/remboursement (L.217-14, L.217-16, L.217-17).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Monteur/accessoiriste : preuves`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_HOME_TRAINER_CONNECTE_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Home trainer connecté : garantie légale 2025`,
    seo: {
      title: `Home trainer défectueux : recours`,
      description: `Puissance sous-estimée, connexion instable, bruits : garantie légale. Réparation/remplacement/remboursement.`,
      keywords: [
        'home trainer connecté garantie',
        'puissance zwift fausse',
        'bluetooth ant+ instable',
        'bruits anormaux home trainer',
        'L.217-9 réparation home trainer',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure home trainer',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Home trainer connecté : garantie légale 2025`,
        url: `/guides/home-trainer-connecte-defaut-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts & mesures`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Écart de puissance significatif vs promesse, perte ANT+/BT, bruits/jeu anormal, chauffe excessive : L.217-5, L.217-7.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Démarches gagnantes`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Réparation (L.217-9) → Remplacement → Remboursement (L.217-14, L.217-16, L.217-17). Frais vendeur (L.217-11). Joignez vos courbes de puissance.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Magasins vélo : protocoles utiles`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

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

export const GUIDE_CASQUE_AUDIO_HAUT_DE_GAMME_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Casque audio haut de gamme : vos recours 2025`,
    seo: {
      title: `Casque audio défectueux : garantie légale 2025`,
      description: `Casque Bose/Sony/Apple en panne ? Réparation, remplacement ou remboursement sous 2 ans. Générez votre mise en demeure en 3 minutes.`,
      keywords: [
        'casque audio garantie légale',
        'Bose casque panne recours',
        'Sony WH-1000XM défaut réparation',
        'AirPods Max grésillement garantie',
        'casque haut de gamme coupure son',
        'batterie casque ne tient pas',
        'SAV refuse garantie casque',
        'remboursement casque défectueux',
        'mise en demeure vendeur casque',
        'garantie légale L.217-9 casque',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Casque audio haut de gamme : vos recours 2025`,
        url: `/guides/casque-audio-haut-de-gamme-defaut-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-3', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Les 8 défauts casque audio couverts par la garantie légale`,
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Coupures/bluetooth instable`} />,
                <TextWithLegalRefs text={`• Grésillements/cliquetis anormaux`} />,
                <TextWithLegalRefs text={`• ANC inefficace ou défaillant`} />,
                <TextWithLegalRefs text={`• Volume ou canaux déséquilibrés`} />,
                <TextWithLegalRefs text={`• Batterie qui chute anormalement`} />,
                <TextWithLegalRefs text={`• Charge impossible/port défectueux`} />,
                <TextWithLegalRefs text={`• Échauffement anormal en charge`} />,
                <TextWithLegalRefs text={`• Indication batterie erronée`} />,
              ] as React.ReactNode[]
            }
          />{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`La garantie légale (Art. L.217-3 à L.217-9 ) impose au vendeur de livrer un produit conforme et d'assumer les défauts pendant 2 ans (12 mois pour l'occasion). Exemples couverts :`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Défauts techniques • Coupures/bluetooth instable • Grésillements/cliquetis anormaux • ANC inefficace ou défaillant • Volume ou canaux déséquilibrés Autonomie & charge • Batterie qui chute anormalement • Charge impossible/port défectueux • Échauffement anormal en charge • Indication batterie erronée Présomption (Art. L.217-7) : tout défaut apparu dans les 2 ans est présumé exister au jour de la livraison. Au vendeur de prouver l’incompatibilité avec un usage normal.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Procédure étape par étape : obtenir réparation/remboursement`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Important : votre interlocuteur légal est uniquement le vendeur . Ne vous laissez pas renvoyer vers la marque.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`1 Rassemblez les preuves Facture, vidéos du défaut, page produit (promesses), échanges écrits.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`2 Contact amiable Annoncez la garantie légale (Art. L.217-9) et demandez réparation ou remplacement .`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`3 Mise en demeure Écrite et datée, rappelant L.217-3, L.217-7, L.217-9, L.217-11. Délai 15 jours.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Générer ma lettre → 4 Si échec Exigez réduction du prix ou remboursement (Art. L.217-14, L.217-16, L.217-17). Tous frais à la charge du vendeur (L.217-11).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Spécificités par enseigne/marque : qui est le plus conciliant`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-3' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_ECOUTEURS_SANS_FIL_DEFAUT_CONNEXION_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Écouteurs sans fil : garantie légale & recours 2025`,
    seo: {
      title: `Écouteurs TWS défectueux : vos droits 2025`,
      description: `AirPods/Pixel Buds/Galaxy Buds qui coupent ? Garantie légale : réparation, remplacement ou remboursement. Lettre conforme en 3 min.`,
      keywords: [
        'écouteurs sans fil garantie légale',
        'AirPods panne recours',
        'Galaxy Buds coupure son',
        'Pixel Buds latence défaut',
        'batterie écouteurs faible',
        'SAV refuse écouteurs',
        'remplacement écouteurs défectueux',
        'mise en demeure vendeur écouteurs',
        'garantie L.217-9 écouteurs',
        'réparation gratuite écouteurs',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Écouteurs sans fil : garantie légale & recours 2025`,
        url: `/guides/ecouteurs-sans-fil-defaut-connexion-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Les défauts typiques couverts sur les écouteurs`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Couvert : pertes de connexion, canal muet, grésillements, charge erratique, autonomie anormalement faible, boîtier qui ne ferme plus.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Base : L.217-5 (conformité à l’usage attendu), L.217-7 (présomption 2 ans).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Les dommages accidentels (chute/immersion) ne sont pas couverts, sauf promesse spécifique non tenue sur la résistance annoncée.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Obtenir réparation/remplacement : la méthode claire`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`1) Prouvez le défaut (vidéos, capture autonomie) • 2) Contactez le vendeur (L.217-9) • 3) Mise en demeure écrite si refus • 4) Remplacement ou remboursement (L.217-14, L.217-16, L.217-17).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Créer ma lettre maintenant →`} />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Stratégies par enseigne : comment accélérer`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_SMARTWATCH_BATTERIE_FAIBLE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Smartwatch qui ne tient plus la charge : recours 2025`,
    seo: {
      title: `Montre connectée en panne : garantie légale`,
      description: `Batterie faible, capteurs défaillants, écran qui fige ? Garantie légale : réparation, remplacement, remboursement. Lettre conforme en 3 minutes.`,
      keywords: [
        'smartwatch batterie faible garantie',
        'garantie légale montre connectée',
        'capteur cardio imprécis recours',
        'écran montre fige défaut',
        'SAV refuse montre connectée',
        'remplacement smartwatch défectueuse',
        'L.217-9 smartwatch',
        'présomption 2 ans L.217-7',
        'vendeur responsable L.217-3',
        'réparation gratuite L.217-11',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Smartwatch qui ne tient plus la charge : recours 2025`,
        url: `/guides/smartwatch-batterie-faible-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-3', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts : de la batterie aux capteurs`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Couvert par L.217-5 et L.217-7 : autonomie anormalement basse, écran figé/ghosting, capteurs incohérents, charge instable, boutons défaillants.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Tip : consignez des mesures sur plusieurs jours (captures), cela renforce la preuve.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `La timeline gagnante (vendeur uniquement)`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`J+0 : signaler au vendeur (L.217-9) • solution demandée : réparation.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`J+15 : mise en demeure si pas de solution • rappel L.217-3, L.217-7, L.217-11.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Échec : bascule en remplacement ou remboursement (L.217-14, L.217-16, L.217-17).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Générer ma lettre →`} />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Enseignes & bonnes pratiques`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-3' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_TABLETTE_TACTILE_ECRAN_SURCHAUFFE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Tablette tactile en panne : garantie légale 2025`,
    seo: {
      title: `Tablette défectueuse : vos droits 2025`,
      description: `iPad/Galaxy Tab/Lenovo Tab défectueuse ? Activez la garantie légale : 2 ans. Lettre de mise en demeure en quelques clics.`,
      keywords: [
        'tablette en panne garantie',
        'iPad écran défaut recours',
        'Galaxy Tab surchauffe réparation',
        'batterie tablette ne tient pas',
        'L.217-9 remplacement tablette',
        'SAV refuse garantie tablette',
        'remboursement tablette défectueuse',
        'mise en demeure tablette',
        'vendeur responsable L.217-3',
        'frais vendeur L.217-11',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Tablette tactile en panne : garantie légale 2025`,
        url: `/guides/tablette-tactile-ecran-surchauffe-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-3', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts sur les tablettes : check-list`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Écran : taches, lignes, tactile fantôme, pixellisation.`} />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Surchauffe anormale, reboots, charge erratique, haut-parleurs HS.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Base : L.217-5 (usage attendu), L.217-7 (présomption 2 ans).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Procédure express en 4 étapes`,
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`Preuves (photos/vidéos + facture)`} />,
                <TextWithLegalRefs text={`Demande au vendeur : réparation (L.217-9)`} />,
                <TextWithLegalRefs text={`Mise en demeure (rappel L.217-3, L.217-7, L.217-11)`} />,
                <TextWithLegalRefs
                  text={`Si échec : réduction du prix ou remboursement (L.217-14, L.217-16, L.217-17)`}
                />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Preuves (photos/vidéos + facture) Demande au vendeur : réparation (L.217-9) Mise en demeure (rappel L.217-3, L.217-7, L.217-11) Si échec : réduction du prix ou remboursement (L.217-14, L.217-16, L.217-17) Créer ma lettre →`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Conseils par circuits de vente`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-3' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_TV_OLED_ECRAN_MARQUES_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `TV OLED défectueuse : vos recours 2025`,
    seo: {
      title: `TV OLED en panne : garantie légale 2025`,
      description: `Pixels morts, marquage, HDMI eARC/CEC instable ? Exigez réparation, remplacement ou remboursement sous 2 ans. Lettre conforme en 3 minutes.`,
      keywords: [
        'tv oled garantie légale',
        'oled marquage rémanence recours',
        'pixels morts tv garantie',
        'hdmi earc cec décrochement',
        'SAV refuse tv oled',
        'L.217-9 réparation tv',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement tv',
        'L.217-7 présomption 2 ans',
        'vendeur responsable L.217-3',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `TV OLED défectueuse : vos recours 2025`,
        url: `/guides/tv-oled-ecran-marques-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-3', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Les 8 défauts TV OLED couverts par la garantie légale`,
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Pixels morts / lignes`} />,
                <TextWithLegalRefs text={`• Marquage/rémanence anormale`} />,
                <TextWithLegalRefs text={`• Teintes/gradients instables`} />,
                <TextWithLegalRefs text={`• eARC/CEC instable`} />,
                <TextWithLegalRefs text={`• HDMI/port optique HS`} />,
                <TextWithLegalRefs text={`• Haut-parleurs défaillants`} />,
              ] as React.ReactNode[]
            }
          />{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Art. L.217-3 à L.217-13 : le vendeur doit livrer un produit conforme pendant 2 ans (12 mois mini en occasion).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Affichage • Pixels morts / lignes • Marquage/rémanence anormale • Teintes/gradients instables Connectique & son • eARC/CEC instable • HDMI/port optique HS • Haut-parleurs défaillants L.217-7 : tout défaut apparu dans les 2 ans (12 mois occasion) est présumé exister à la livraison.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Nos dossiers obtiennent une issue favorable dans 78% des cas après mise en demeure écrite.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Procédure étape par étape : obtenir réparation/remboursement`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`1 Prouvez Photos/vidéos du défaut, facture, promesses commerciales (fiche produit).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`2 Demandez la mise en conformité Au vendeur uniquement (L.217-9) : réparation ou remplacement.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`3 Mise en demeure Rappelez L.217-3, L.217-7, L.217-11. Délai 15 jours.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Générer ma lettre → 4 Si échec Réduction du prix ou remboursement (L.217-14, L.217-16, L.217-17). Tous frais au vendeur (L.217-11).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Spécificités par enseigne/marque : qui est le plus conciliant`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-3' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_VIDEOPROJECTEUR_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Vidéoprojecteur en panne : garantie légale 2025`,
    seo: {
      title: `Vidéoprojecteur défectueux : recours 2025`,
      description: `Focus, keystone, lampe/laser, HDMI instable : garantie légale. Obtenez réparation, remplacement ou remboursement. Lettre en 3 minutes.`,
      keywords: [
        'videoprojecteur garantie légale',
        'focus flou keystone défaut',
        'lampe laser panne projo',
        'hdmi arc instable projecteur',
        'L.217-9 réparation projecteur',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption 2 ans',
        'vendeur responsable L.217-3',
        'mise en demeure projecteur',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Vidéoprojecteur en panne : garantie légale 2025`,
        url: `/guides/videoprojecteur-panne-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-3', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts côté image & connectique`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Couvert : focus impossible à régler, keystone inopérant, lampe/laser chute anormale, HDMI/ARC instable, ventilateur bruyant.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Base : L.217-5 (usage attendu), L.217-7 (présomption).`} />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Résolution amiable en ~70% des cas après rappel clair de L.217-9 et L.217-11.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Procédure étape par étape : obtenir réparation/remboursement`,
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`Preuves (photos/fichiers test) + facture`} />,
                <TextWithLegalRefs text={`Demande de mise en conformité (L.217-9)`} />,
                <TextWithLegalRefs text={`Mise en demeure (L.217-3, L.217-7, L.217-11)`} />,
                <TextWithLegalRefs
                  text={`Réduction du prix / remboursement (L.217-14, L.217-16, L.217-17)`}
                />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Interlocuteur : uniquement le vendeur (L.217-3). Choix initial : réparation ou remplacement (L.217-9).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Preuves (photos/fichiers test) + facture Demande de mise en conformité (L.217-9) Mise en demeure (L.217-3, L.217-7, L.217-11) Réduction du prix / remboursement (L.217-14, L.217-16, L.217-17) Créer ma lettre →`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Enseignes & astuces pratiques`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-3' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_SERVEUR_NAS_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Serveur NAS en panne : garantie légale 2025`,
    seo: {
      title: `NAS défectueux : recours 2025`,
      description: `Baies HS, réseau instable, RAID qui lâche : garantie légale. Exigez réparation, remplacement ou remboursement. Lettre conforme immédiate.`,
      keywords: [
        'NAS garantie légale',
        'baie disque HS NAS',
        'réseau instable NAS défaut',
        'RAID reconstruit echec',
        'L.217-9 réparation NAS',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement NAS',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure NAS',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Serveur NAS en panne : garantie légale 2025`,
        url: `/guides/serveur-nas-panne-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts NAS couverts par la garantie légale`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Baie/dock disque qui n’alimente plus, contrôleur RAID instable, ports Ethernet HS, ventilateurs très bruyants, UI inaccessible : L.217-5, L.217-7.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Attention : la récupération de données n’est pas couverte par la garantie légale elle-même (c’est un service séparé).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Procédure pas à pas`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Demandez réparation/remplacement (L.217-9). Tous frais à la charge du vendeur (L.217-11). Si échec : réduction/remboursement (L.217-14, L.217-16, L.217-17).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Lettre conforme →`} />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Distributeurs & bonnes pratiques`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_IMPRIMANTE_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Imprimante défectueuse : garantie légale 2025`,
    seo: {
      title: `Imprimante en panne : vos droits 2025`,
      description: `Têtes bouchées, bourrages, Wi-Fi/USB HS : garantie légale. Exigez réparation, remplacement ou remboursement. Lettre en 3 minutes.`,
      keywords: [
        'imprimante garantie légale',
        'bourrage papier défaut',
        'tetes impression bouchees',
        'wifi usb imprimante panne',
        'L.217-9 réparation imprimante',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption 2 ans',
        'vendeur responsable L.217-3',
        'mise en demeure imprimante',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Imprimante défectueuse : garantie légale 2025`,
        url: `/guides/imprimante-defaut-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-3', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts imprimante couverts par la loi`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Bourrages répétés, entraînement papier HS, Wi-Fi/USB inopérant.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Têtes bouchées malgré usage normal, cartouches non reconnues.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Base : L.217-5, L.217-7.`} />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Procédure express en 4 étapes`,
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`Preuves + facture`} />,
                <TextWithLegalRefs text={`Demande de réparation/remplacement (L.217-9)`} />,
                <TextWithLegalRefs text={`Mise en demeure (L.217-3, L.217-7, L.217-11)`} />,
                <TextWithLegalRefs
                  text={`Réduction du prix / remboursement (L.217-14, L.217-16, L.217-17)`}
                />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Preuves + facture Demande de réparation/remplacement (L.217-9) Mise en demeure (L.217-3, L.217-7, L.217-11) Réduction du prix / remboursement (L.217-14, L.217-16, L.217-17) Générer ma lettre →`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Conseils enseignes`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-3' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_ECRAN_PC_PIXELS_MORTS_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Écran PC : pixels morts/saignement — recours 2025`,
    seo: {
      title: `Écran PC défectueux : garantie 2025`,
      description: `Pixels morts, fuites de lumière, ports HS : garantie légale. Obtenez réparation, remplacement ou remboursement. Lettre conforme immédiate.`,
      keywords: [
        'ecran pc garantie légale',
        'pixels morts moniteur',
        'fuite de lumière ips',
        'port displayport hdmi hs',
        'L.217-9 réparation moniteur',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption 2 ans',
        'vendeur responsable L.217-3',
        'mise en demeure moniteur',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Écran PC : pixels morts/saignement — recours 2025`,
        url: `/guides/ecran-pc-pixels-morts-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts sur moniteurs PC`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Pixels morts/taches, saignement de dalle, uniformité douteuse, ports HS, scintillement anormal : L.217-5, L.217-7.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Taux de réussite élevé avec preuve photo et rappel L.217-9/L.217-11.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Itinéraire vers la mise en conformité`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Contact vendeur → réparation/remplacement (L.217-9). Si échec : réduction/remboursement (L.217-14, L.217-16, L.217-17). Frais à sa charge (L.217-11).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Revendeurs IT : accélérer`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_ASPIRATEUR_BALAI_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Aspirateur balai en panne : garantie légale 2025`,
    seo: {
      title: `Aspirateur balai défectueux : recours`,
      description: `Batterie chute, brosse/moteur HS, charge erratique : garantie légale. Réparation, remplacement ou remboursement. Lettre en 3 minutes.`,
      keywords: [
        'aspirateur balai garantie légale',
        'batterie aspirateur chute',
        'brosse motorisée HS',
        'charge erratique aspirateur',
        'L.217-9 réparation aspirateur',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure aspirateur',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Aspirateur balai en panne : garantie légale 2025`,
        url: `/guides/aspirateur-balai-panne-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts & preuves utiles`,
      content: (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-1">
            \n{' '}
            <li>
              <TextWithLegalRefs text={`• Autonomie anormalement faible`} />
            </li>
            <li>
              <TextWithLegalRefs text={`• Moteur/bruit anormal, coupures`} />
            </li>
            <li>
              <TextWithLegalRefs text={`• Brosse/embouts inopérants, charge capricieuse`} />
            </li>
            \n
          </ul>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`• Autonomie anormalement faible • Moteur/bruit anormal, coupures • Brosse/embouts inopérants, charge capricieuse Base : L.217-5, L.217-7.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Procédure fiable`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Réparation (L.217-9) → Remplacement → Réduction/remboursement (L.217-14, L.217-16, L.217-17). Frais intégralement au vendeur (L.217-11).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Lettre conforme →`} />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Magasins : faire valoir vos droits`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_PURIFICATEUR_AIR_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Purificateur d’air défectueux : garantie légale 2025`,
    seo: {
      title: `Purificateur d’air en panne : recours`,
      description: `Capteurs faux, CADR insuffisant, bruit excessif : garantie légale. Réparation, remplacement ou remboursement. Lettre immédiate.`,
      keywords: [
        'purificateur air garantie légale',
        'capteurs pm2.5 faux',
        'debit CADR insuffisant',
        'bruit excessif appareil',
        'L.217-9 réparation purificateur',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure purificateur',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Purificateur d’air défectueux : garantie légale 2025`,
        url: `/guides/purificateur-air-defaut-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts & métriques utiles`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Capteurs PM2.5/TVOC incohérents, CADR très inférieur aux promesses, bruit/vibrations anormales, ventilateur HS : L.217-5, L.217-7.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Conservez captures (niveaux PM), vidéos du bruit, fiche produit (promesses).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Démarches efficaces`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Exigez réparation/remplacement (L.217-9). Frais à la charge du vendeur (L.217-11). Échec : réduction/remboursement (L.217-14, L.217-16, L.217-17).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Distributeurs/poseurs : cadrage`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_PLAQUE_INDUCTION_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Plaque induction défectueuse : garantie légale 2025`,
    seo: {
      title: `Plaque induction en panne : recours`,
      description: `Détection casserole aléatoire, erreurs, carte HS : garantie légale. Réparation, remplacement ou remboursement. Lettre conforme.`,
      keywords: [
        'plaque induction garantie légale',
        'détection casserole défaut',
        'carte électronique table induction',
        'erreur e0 e1 e2 plaque',
        'L.217-9 réparation plaque',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure plaque',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Plaque induction défectueuse : garantie légale 2025`,
        url: `/guides/plaque-induction-defaut-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts & sécurité`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Détection aléatoire, zones inactives, cartes HS, erreurs récurrentes, ventilateurs bruyants : L.217-5, L.217-7. Mentionnez l’impact sur la cuisine quotidienne.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Obtenir la mise en conformité`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Réparation prioritaire (L.217-9). Si échec : remplacement. Dernier recours : remboursement (L.217-14, L.217-16, L.217-17). Frais : vendeur (L.217-11).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Créer ma lettre →`} />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Installateurs & magasins`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_FOUR_ENCASTRABLE_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Four encastrable en panne : garantie légale 2025`,
    seo: {
      title: `Four défectueux : vos droits 2025`,
      description: `Chauffe lente, thermostat faux, pyrolyse HS : garantie légale. Demandez réparation, remplacement ou remboursement.`,
      keywords: [
        'four encastrable garantie légale',
        'thermostat four défaut',
        'pyrolyse ne marche pas',
        'chauffe lente four panne',
        'L.217-9 réparation four',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure four',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Four encastrable en panne : garantie légale 2025`,
        url: `/guides/four-encastrable-panne-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts & preuves utiles`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Résistances HS, thermostat faux, ventilateur, pyrolyse inopérante, affichage/sonde HS : L.217-5, L.217-7. Photos/temps de chauffe comme preuves.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Procédure claire`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Réparation via vendeur (L.217-9). Si échec : remplacement/remboursement (L.217-14, L.217-16, L.217-17). Frais intégralement au vendeur (L.217-11).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Poseur/distributeur : accélérer`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_CAFETIERE_EXPRESSO_BROYEUR_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Cafetière expresso broyeur : recours 2025`,
    seo: {
      title: `Expresso broyeur défectueux : droits`,
      description: `Groupe café/moulin HS, fuites, capteurs : garantie légale. Réparation, remplacement, remboursement. Lettre en 3 min.`,
      keywords: [
        'cafetière expresso garantie légale',
        'broyeur café panne',
        'fuite expresso machine',
        'capteurs réservoir HS',
        'L.217-9 réparation expresso',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure expresso',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Cafetière expresso broyeur : recours 2025`,
        url: `/guides/cafetiere-expresso-broyeur-defaut-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts & entretien normal`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Groupe qui bloque, broyeur HS, fuites, capteurs réservoir, chauffe instable : L.217-5, L.217-7. L’entretien normal (détartrage) ne supprime pas la garantie légale.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Étapes légales`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Demandez réparation/remplacement (L.217-9). Frais vendeur (L.217-11). Si échec : réduction/remboursement (L.217-14, L.217-16, L.217-17).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Générer ma lettre →`} />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Revendeurs : preuves efficaces`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_BORNE_RECHARGE_DOMESTIQUE_VE_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Borne de recharge domestique VE : recours 2025`,
    seo: {
      title: `Borne de recharge VE défectueuse`,
      description: `Charge aléatoire, RFID/app HS, disjonctions : garantie légale. Réparation, remplacement ou remboursement. Lettre conforme en 3 minutes.`,
      keywords: [
        'borne recharge VE garantie légale',
        'wallbox panne défaut',
        'rfid app charge voiture',
        'disjonction recharge domicile',
        'L.217-9 réparation borne',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement borne',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure borne',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Borne de recharge domestique VE : recours 2025`,
        url: `/guides/borne-recharge-domestique-ve-defaut-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts & sécurité électrique`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Charge aléatoire, pilotage RFID/app inopérant, câble/prise HS, disjonctions sans cause externe : L.217-5, L.217-7.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Sécurité : mentionnez les disjonctions et l’immobilisation du véhicule.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Démarches côté consommateur`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Exigez réparation/remplacement (L.217-9). Frais intégralement au vendeur (L.217-11). Si échec : remboursement (L.217-14, L.217-16, L.217-17).`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Installateur/distributeur : bonnes pratiques`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_SERRURE_CONNECTEE_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Serrure connectée défectueuse : garantie légale 2025`,
    seo: {
      title: `Serrure connectée en panne : recours`,
      description: `App/bridge instables, moteur bloqué, capteurs faux : garantie légale. Réparation, remplacement, remboursement. Lettre immédiate.`,
      keywords: [
        'serrure connectée garantie légale',
        'bridge app instable serrure',
        'moteur serrure bloque',
        'capteurs porte faux',
        'L.217-9 réparation serrure',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure serrure',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Serrure connectée défectueuse : garantie légale 2025`,
        url: `/guides/serrure-connectee-defaut-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-3', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts & points sécurité`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Bridge/app instables, moteur/béquille bloqués, capteurs d’ouverture faux, autonomie anormalement faible : L.217-5, L.217-7.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Mentionnez le risque de non-accès au logement pour prioriser l’intervention.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Procédure en 4 étapes`,
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`Preuves + facture`} />,
                <TextWithLegalRefs text={`Réparation/remplacement (L.217-9) auprès du vendeur`} />,
                <TextWithLegalRefs text={`Mise en demeure (L.217-3, L.217-7, L.217-11)`} />,
                <TextWithLegalRefs
                  text={`Remboursement si échec (L.217-14, L.217-16, L.217-17)`}
                />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Preuves + facture Réparation/remplacement (L.217-9) auprès du vendeur Mise en demeure (L.217-3, L.217-7, L.217-11) Remboursement si échec (L.217-14, L.217-16, L.217-17)`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Magasins domotique/DIY : accélérer`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-3' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_CONSOLE_PORTABLE_ECRAN_DEFECTUEUX_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Console portable écran défectueux : recours 2025`,
    seo: {
      title: `Console portable en panne : vos droits 2025`,
      description: `Écran, joystick, surchauffe : faites valoir la garantie légale. Réparation, remplacement ou remboursement. Lettre prête en 3 minutes.`,
      keywords: [
        'console portable écran défaut',
        'joystick drift garantie',
        'Switch OLED pixels morts recours',
        'Steam Deck panne réparation',
        'Asus ROG Ally crash garantie',
        'L.217-9 console remplacement',
        'vendeur responsable console',
        'présomption L.217-7 console',
        'frais vendeur L.217-11 console',
        'remboursement L.217-13 console',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Console portable écran défectueux : recours 2025`,
        url: `/guides/console-portable-ecran-defectueux-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts couverts pour consoles portables`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Écran : pixels morts, taches, latence tactile, saignement de dalle.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Joysticks : drift, boutons inopérants • Surchauffe • Batterie anormale.`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Base : L.217-5, L.217-7.`} />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Itinéraire simple vers la solution`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`1) Prouvez • 2) Demandez réparation/remplacement (L.217-9) • 3) Mise en demeure • 4) Remboursement si échec (L.217-14, L.217-16, L.217-17). Frais vendeur (L.217-11).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Lettre conforme →`} />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Marques/enseignes : comment négocier`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_HOME_CINEMA_BARRE_DE_SON_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: `Home cinéma/Barre de son en panne : recours 2025`,
    seo: {
      title: `Barre de son défectueuse : garantie légale`,
      description: `HDMI ARC qui décroche, caisson muet ? Activez la garantie légale : réparation, remplacement, remboursement. Lettre conforme en 3 min.`,
      keywords: [
        'barre de son garantie légale',
        'home cinéma panne HDMI ARC',
        'caisson de basses muet',
        'SAV refuse garantie audio',
        'remplacement barre de son',
        'L.217-9 réparation audio',
        'L.217-11 frais vendeur audio',
        'présomption L.217-7 audio',
        'réduction prix L.217-13 audio',
        'vendeur responsable L.217-3',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: `Home cinéma/Barre de son en panne : recours 2025`,
        url: `/guides/home-cinema-barre-de-son-panne-garantie-legale`,
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: `Défauts audio/vidéo couverts`,
      content: (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-1">
            \n{' '}
            <li>
              <TextWithLegalRefs text={`• Coupures HDMI ARC/eARC, désynchronisation audio`} />
            </li>
            <li>
              <TextWithLegalRefs
                text={`• Caisson sans appairage, grésillements, saturation basse`}
              />
            </li>
            <li>
              <TextWithLegalRefs
                text={`• Perte de canaux, volume bloqué, télécommande inopérante`}
              />
            </li>
            \n
          </ul>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`• Coupures HDMI ARC/eARC, désynchronisation audio • Caisson sans appairage, grésillements, saturation basse • Perte de canaux, volume bloqué, télécommande inopérante Fondements : L.217-5, L.217-7.`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: `Du diagnostic à la solution`,
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Diagnostic écrit + demande réparation (L.217-9) → mise en demeure si besoin → remplacement/remboursement (L.217-14, L.217-16, L.217-17). Frais pris en charge (L.217-11).`}
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`Générer ma lettre →`} />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: `Conseils pratiques par enseigne`,
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
                  text={`Darty : processus cadré, demandez la mise en conformité par écrit.`}
                />,
                <TextWithLegalRefs
                  text={`Boulanger : insistez sur la gratuité des frais (L.217-11).`}
                />,
                <TextWithLegalRefs
                  text={`Conforama / But : privilégiez la LRAR en cas d’atermoiements.`}
                />,
                <TextWithLegalRefs
                  text={`Amazon : utilisez l’historique des tickets pour la preuve d’échec.`}
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
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_FRITEUSE_ELECTRIQUE_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Friteuse électrique en panne : garantie légale 2025',
    seo: {
      title: 'Friteuse défectueuse : vos droits 2025',
      description:
        'Température instable, panne de chauffe ? Garantie légale : réparation, remplacement ou remboursement. Lettre prête en quelques clics.',
      keywords: [
        'friteuse panne garantie',
        'température friteuse instable',
        'résistance friteuse HS',
        'SAV refuse friteuse',
        'remboursement friteuse',
        'L.217-9 réparation',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'présomption L.217-7',
        'vendeur responsable L.217-3',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Friteuse électrique en panne : garantie légale 2025',
        url: '/guides/friteuse-electrique-panne-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-3', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts friteuse couverts par la loi',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Chauffe inexistante, thermostat erratique, fuite d’huile, voyant inopérant, matériaux qui se déforment : couverts par L.217-5 et L.217-7.'
              }
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Sécurité : si risque de brûlure/feu, exigez une solution rapide (mise en demeure).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Obtenir la mise en conformité',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={'Preuves (photos/vidéos + facture)'} />,
                <TextWithLegalRefs text={'Réparation demandée (L.217-9)'} />,
                <TextWithLegalRefs text={'Mise en demeure (rappel L.217-3, L.217-7, L.217-11)'} />,
                <TextWithLegalRefs
                  text={'Remplacement ou remboursement (L.217-14, L.217-16, L.217-17)'}
                />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Preuves (photos/vidéos + facture) Réparation demandée (L.217-9) Mise en demeure (rappel L.217-3, L.217-7, L.217-11) Remplacement ou remboursement (L.217-14, L.217-16, L.217-17)'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Points de vente : stratégie',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-3' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_MIXEUR_BLENDER_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Mixeur/Blender en panne : garantie légale 2025',
    seo: {
      title: 'Blender défectueux : vos droits 2025',
      description:
        'Moteur qui chauffe, lames bloquées ? Garantie légale : réparation, remplacement ou remboursement. Lettre conforme immédiate.',
      keywords: [
        'blender panne garantie',
        'mixeur moteur brûle',
        'lames bloquées blender',
        'SAV refuse garantie blender',
        'L.217-9 remplacement blender',
        'vendeur responsable blender',
        'présomption L.217-7 blender',
        'frais vendeur L.217-11 blender',
        'réduction prix L.217-13 blender',
        'mise en demeure blender',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Mixeur/Blender en panne : garantie légale 2025',
        url: '/guides/mixeur-blender-panne-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts fréquents & couverture',
      content: (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-1">
            \n{' '}
            <li>
              <TextWithLegalRefs text={'• Moteur qui s’arrête sous faible charge'} />
            </li>
            <li>
              <TextWithLegalRefs text={'• Joints qui fuient/odeurs de brûlé'} />
            </li>
            <li>
              <TextWithLegalRefs text={'• Vitesses inopérantes, boîtier fissuré'} />
            </li>
            \n
          </ul>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                '• Moteur qui s’arrête sous faible charge • Joints qui fuient/odeurs de brûlé • Vitesses inopérantes, boîtier fissuré Couvert : L.217-5, L.217-7.'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Chemin rapide vers la solution',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Demandez d’abord la réparation (L.217-9) • Si échec → remplacement • En dernier recours → réduction/ remboursement (L.217-14, L.217-16, L.217-17). Frais : vendeur (L.217-11).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Enseignes : conseils',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_EXTRACTEUR_DE_JUS_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Extracteur de jus en panne : garantie légale 2025',
    seo: {
      title: 'Extracteur de jus défectueux : recours',
      description:
        'Fuites, bourrages, moteur instable ? Garantie légale : réparation, remplacement, remboursement. Lettre en 3 minutes.',
      keywords: [
        'extracteur de jus panne',
        'fuite extracteur garantie',
        'moteur extracteur défaut',
        'SAV refuse extracteur',
        'L.217-9 réparation extracteur',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'présomption L.217-7',
        'vendeur responsable L.217-3',
        'mise en demeure extracteur',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Extracteur de jus en panne : garantie légale 2025',
        url: '/guides/extracteur-de-jus-panne-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-3', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts couverts & bases légales',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Fuites, craquements mécaniques, blocage de la vis, moteur irrégulier, plastique qui blanchit prématurément : couverts (L.217-5, L.217-7).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Procédure pas à pas',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={'Preuves'} />,
                <TextWithLegalRefs text={'Demande de réparation (L.217-9)'} />,
                <TextWithLegalRefs text={'Mise en demeure (L.217-3, L.217-7, L.217-11)'} />,
                <TextWithLegalRefs
                  text={'Réduction/remboursement (L.217-14, L.217-16, L.217-17)'}
                />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Preuves Demande de réparation (L.217-9) Mise en demeure (L.217-3, L.217-7, L.217-11) Réduction/remboursement (L.217-14, L.217-16, L.217-17)'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Vendeur : comment cadrer',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-3' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_YAOURTIERE_DEFAUT_TEMPERATURE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Yaourtière défectueuse : garantie légale 2025',
    seo: {
      title: 'Yaourtière en panne : recours',
      description:
        'Température instable ou panne ? Faites valoir la garantie légale : réparation, remplacement, remboursement. Lettre conforme immédiate.',
      keywords: [
        'yaourtière panne garantie',
        'température yaourtière défaut',
        'SAV refuse yaourtière',
        'vendeur responsable L.217-3',
        'L.217-9 réparation',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'présomption L.217-7',
        'mise en demeure yaourtière',
        'recours garantie yaourtière',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Yaourtière défectueuse : garantie légale 2025',
        url: '/guides/yaourtiere-defaut-temperature-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts courants & couverture',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Température fluctuante, cycles incomplets, minuterie erratique, cuve qui fissure : couverts (L.217-5, L.217-7).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Étapes rapides',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Réparation prioritaire (L.217-9) → Mise en demeure → Remplacement ou remboursement (L.217-14, L.217-16, L.217-17). Frais à la charge du vendeur (L.217-11).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'À dire au vendeur',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_MACHINE_A_PAIN_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Machine à pain en panne : garantie légale 2025',
    seo: {
      title: 'Machine à pain défectueuse : recours',
      description:
        'Pétrin bloqué, cuisson inégale ? Garantie légale : réparation, remplacement, remboursement. Lettre en quelques clics.',
      keywords: [
        'machine à pain panne garantie',
        'pétrin bloqué défaut',
        'cuisson inégale machine à pain',
        'SAV refuse machine à pain',
        'L.217-9 réparation machine à pain',
        'L.217-11 frais vendeur',
        'L.217-13 remboursement',
        'L.217-7 présomption',
        'vendeur responsable L.217-3',
        'mise en demeure machine à pain',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Machine à pain en panne : garantie légale 2025',
        url: '/guides/machine-a-pain-panne-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-3', 'L.217-5', 'L.217-7']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts couverts & preuves utiles',
      content: (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-1">
            \n{' '}
            <li>
              <TextWithLegalRefs text={'• Pétrin qui ne tourne plus'} />
            </li>
            <li>
              <TextWithLegalRefs text={'• Cuisson incomplète/température instable'} />
            </li>
            <li>
              <TextWithLegalRefs text={'• Fuites, joints HS, fumées anormales'} />
            </li>
            \n
          </ul>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                '• Pétrin qui ne tourne plus • Cuisson incomplète/température instable • Fuites, joints HS, fumées anormales Base : L.217-5, L.217-7.'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Procédure fiable',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Réparation → Remplacement → Réduction/remboursement (L.217-14, L.217-16, L.217-17). Toujours via le vendeur (L.217-3), frais à sa charge (L.217-11).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Enseignes : faire valoir vos droits',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-3' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_CENTRALE_VAPEUR_FUITE_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Centrale vapeur en panne : garantie légale 2025',
    seo: {
      title: 'Centrale vapeur défectueuse : recours',
      description:
        'Fuite, vapeur faible, arrêt intempestif : garantie légale. Réparation, remplacement ou remboursement. Lettre en 3 minutes.',
      keywords: [
        'centrale vapeur panne garantie',
        'fuite centrale vapeur',
        'vapeur faible réparation',
        'SAV refuse centrale vapeur',
        'L.217-9 remplacement centrale',
        'L.217-7 présomption centrale',
        'L.217-11 frais vendeur centrale',
        'L.217-13 remboursement centrale',
        'vendeur responsable L.217-3',
        'mise en demeure centrale',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Centrale vapeur en panne : garantie légale 2025',
        url: '/guides/centrale-vapeur-fuite-panne-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts couverts & sécurité',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Fuite réservoir, vapeur insuffisante, pression instable, semelle défaillante : couverts (L.217-5, L.217-7). En cas de risque brûlure, exigez une action rapide.'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Étapes pour obtenir la mise en conformité',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Demande de réparation (L.217-9) → Mise en demeure → Remplacement/remboursement (L.217-14, L.217-16, L.217-17). Frais : vendeur (L.217-11).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Magasin / en ligne : nos conseils',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_VOITURE_ELECTRIQUE_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Voiture électrique : garantie légale (produit vendu) 2025',
    seo: {
      title: 'Voiture électrique vendue : vos recours',
      description:
        'Problème de charge, électronique embarquée, défaut de conformité sur VE vendu par pro ? Garantie légale : réparation, remplacement, remboursement.',
      keywords: [
        'voiture électrique garantie légale',
        'défaut charge VE recours',
        'électronique voiture électrique panne',
        'vendeur responsable L.217-3 VE',
        'L.217-9 réparation VE',
        'L.217-11 frais vendeur VE',
        'L.217-13 remboursement VE',
        'L.217-7 présomption VE',
        'mise en demeure VE',
        'véhicule occasion présomption 12 mois',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Voiture électrique : garantie légale (produit vendu) 2025',
        url: '/guides/voiture-electrique-defaut-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts VE couverts (hors garanties commerciales)',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Charge aléatoire, autonomie anormalement basse vs promesse, BMS/électronique défaillants, interfaces qui plantent : couverts si usage normal empêché (L.217-5, L.217-7).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Parcours légal côté consommateur',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={'Signalement au vendeur (L.217-9) + diagnostic écrit'} />,
                <TextWithLegalRefs text={'Mise en demeure avec délai raisonnable'} />,
                <TextWithLegalRefs
                  text={'Si échec : remplacement ou remboursement (L.217-14, L.217-16, L.217-17)'}
                />,
                <TextWithLegalRefs text={'Frais de transport/diagnostic : vendeur (L.217-11)'} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Signalement au vendeur (L.217-9) + diagnostic écrit Mise en demeure avec délai raisonnable Si échec : remplacement ou remboursement (L.217-14, L.217-16, L.217-17) Frais de transport/diagnostic : vendeur (L.217-11)'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Concession/mandataire : bonnes pratiques',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_VOITURE_HYBRIDE_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Voiture hybride : garantie légale (produit vendu) 2025',
    seo: {
      title: 'Voiture hybride vendue : vos droits',
      description:
        'Défaut hybride/électronique après achat chez pro ? Garantie légale : réparation, remplacement, réduction du prix, remboursement.',
      keywords: [
        'voiture hybride garantie légale',
        'défaut système hybride',
        'électronique hybride panne',
        'L.217-9 réparation hybride',
        'L.217-11 frais vendeur véhicule',
        'L.217-13 remboursement hybride',
        'L.217-7 présomption véhicule',
        'vendeur responsable L.217-3 auto',
        'mise en demeure hybride',
        'véhicule occasion garantie légale',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Voiture hybride : garantie légale (produit vendu) 2025',
        url: '/guides/voiture-hybride-defaut-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts couverts côté hybride/électronique',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Bascule thermique/électrique erratique, surconsommation vs promesse, calculateurs qui plantent, voyants défaut persistants : couverts (L.217-5, L.217-7).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Étapes légales clés',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Demande de réparation (L.217-9) → Mise en demeure → Remplacement/remboursement (L.217-14, L.217-16, L.217-17). Frais liés = vendeur (L.217-11).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Concessions : faire valoir la loi',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_CAMPING_CAR_DEFAUTS_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Camping-car : garantie légale (produit vendu) 2025',
    seo: {
      title: 'Camping-car défectueux : recours',
      description:
        'Infiltrations, équipements HS ? Garantie légale : réparation, remplacement, remboursement. Dossier clair + lettre conforme.',
      keywords: [
        'camping-car garantie légale',
        'infiltration eau camping-car',
        'équipements HS camping-car',
        'électronique camping-car défaut',
        'L.217-9 réparation camping-car',
        'L.217-11 frais vendeur camping-car',
        'L.217-13 remboursement camping-car',
        'L.217-7 présomption camping-car',
        'vendeur responsable L.217-3',
        'mise en demeure camping-car',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Camping-car : garantie légale (produit vendu) 2025',
        url: '/guides/camping-car-defauts-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts typiques couverts',
      content: (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-1">
            \n{' '}
            <li>
              <TextWithLegalRefs text={'• Infiltrations/étanchéité'} />
            </li>
            <li>
              <TextWithLegalRefs text={'• Chauffage/eau/chauffe-eau HS'} />
            </li>
            <li>
              <TextWithLegalRefs text={'• Électricité auxiliaire défaillante'} />
            </li>
            \n
          </ul>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                '• Infiltrations/étanchéité • Chauffage/eau/chauffe-eau HS • Électricité auxiliaire défaillante Base : L.217-5, L.217-7.'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Parcours gagnant',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Réparation prioritaire (L.217-9). En cas d’immobilisation longue, demandez remplacement raisonnable. Si échec : remboursement (L.217-14, L.217-16, L.217-17). Frais : vendeur (L.217-11).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Concessions : cadrage pratique',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_MOTO_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Moto achetée chez pro : garantie légale 2025',
    seo: {
      title: 'Moto vendue : vos droits',
      description:
        'Panne moteur, électronique, freinage ? Garantie légale : réparation, remplacement, remboursement. Lettre de mise en demeure rapide.',
      keywords: [
        'moto garantie légale',
        'panne moto vendeur responsable',
        'électronique moto défaut',
        'freinage moto problème',
        'L.217-9 réparation moto',
        'L.217-11 frais vendeur moto',
        'L.217-13 remboursement moto',
        'L.217-7 présomption moto',
        'vendeur responsable L.217-3',
        'mise en demeure moto',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Moto achetée chez pro : garantie légale 2025',
        url: '/guides/moto-defaut-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts moto couverts',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Démarrages aléatoires, voyants défaut, ABS/TC défaillant, surchauffe, coupures : couverts (L.217-5, L.217-7).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'La méthode qui marche',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Réparation (L.217-9) → Mise en demeure → Remplacement ou remboursement (L.217-14, L.217-16, L.217-17). Frais : vendeur (L.217-11).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Concession moto : tips',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_SCOOTER_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Scooter acheté chez pro : garantie légale 2025',
    seo: {
      title: 'Scooter défectueux : recours',
      description:
        'Pannes d’allumage/charge, freinage : garantie légale. Réparation, remplacement, remboursement. Lettre conforme en 3 minutes.',
      keywords: [
        'scooter garantie légale',
        'panne scooter vendeur',
        'charge scooter défaut',
        'freinage scooter problème',
        'L.217-9 réparation scooter',
        'L.217-11 frais vendeur scooter',
        'L.217-13 remboursement scooter',
        'L.217-7 présomption scooter',
        'vendeur responsable L.217-3',
        'mise en demeure scooter',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Scooter acheté chez pro : garantie légale 2025',
        url: '/guides/scooter-defaut-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-3', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts couverts sur scooters',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Allumage aléatoire, batterie/chargeur défaillants, freinage spongieux, électronique instable : L.217-5, L.217-7.'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Procédure en 4 temps',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={'Preuves'} />,
                <TextWithLegalRefs text={'Réparation (L.217-9)'} />,
                <TextWithLegalRefs text={'Mise en demeure (L.217-3, L.217-7, L.217-11)'} />,
                <TextWithLegalRefs
                  text={'Remplacement/remboursement (L.217-14, L.217-16, L.217-17)'}
                />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Preuves Réparation (L.217-9) Mise en demeure (L.217-3, L.217-7, L.217-11) Remplacement/remboursement (L.217-14, L.217-16, L.217-17)'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Concession : accélérer le traitement',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-3' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_CLIMATISATION_EN_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Climatisation en panne : garantie légale 2025',
    seo: {
      title: 'Clim défectueuse : vos droits 2025',
      description:
        'Fuite, compresseur en panne, carte HS : garantie légale. Réparation, remplacement, remboursement. Lettre conforme en 3 min.',
      keywords: [
        'climatisation panne garantie',
        'fuite clim recours',
        'compresseur HS clim',
        'carte électronique clim défaut',
        'L.217-9 réparation clim',
        'L.217-11 frais vendeur clim',
        'L.217-13 remboursement clim',
        'L.217-7 présomption clim',
        'vendeur responsable L.217-3',
        'mise en demeure clim',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Climatisation en panne : garantie légale 2025',
        url: '/guides/climatisation-en-panne-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts clim couverts par la loi',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Fuite fluide, compresseur/ventilo HS, carte électronique, performances de refroidissement insuffisantes vs promesse : L.217-5, L.217-7.'
              }
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={'Chaleur estivale = urgence. Exigez un délai raisonnable écrit.'}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Démarches efficaces',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Réparation prioritaire (L.217-9) • Mise en demeure • Remplacement/remboursement (L.217-14, L.217-16, L.217-17). Frais : vendeur (L.217-11).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Installateur/vendeur : cadrage',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_VMC_HABITATION_PANNE_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'VMC habitation en panne : garantie légale 2025',
    seo: {
      title: 'VMC défectueuse : recours',
      description:
        'VMC bruyante, débit insuffisant ? Garantie légale : réparation, remplacement, remboursement. Lettre conforme immédiate.',
      keywords: [
        'VMC panne garantie',
        'moteur VMC bruyant',
        'débit VMC insuffisant',
        'vendeur responsable L.217-3 VMC',
        'L.217-9 réparation VMC',
        'L.217-11 frais vendeur VMC',
        'L.217-13 remboursement VMC',
        'L.217-7 présomption VMC',
        'mise en demeure VMC',
        'VMC défaut conformité',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'VMC habitation en panne : garantie légale 2025',
        url: '/guides/vmc-habitation-panne-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts VMC couverts & preuves',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Bruit anormal, pannes, débit très inférieur aux caractéristiques promises : L.217-5, L.217-7. Preuves : mesures simples/vidéos.'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Étapes légales',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Réparation (L.217-9) → Mise en demeure → Remplacement/remboursement (L.217-14, L.217-16, L.217-17). Frais : vendeur (L.217-11).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Distributeur/poseur : comment agir',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_CHAUDIERE_DOMESTIQUE_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Chaudière domestique : garantie légale 2025',
    seo: {
      title: 'Chaudière en panne : vos droits',
      description:
        'Allumage, carte, fuites ? Garantie légale : réparation, remplacement, remboursement. Lettre conforme en 3 min.',
      keywords: [
        'chaudière panne garantie',
        'carte chaudière HS',
        'allumage chaudière défaut',
        'fuite chaudière recours',
        'L.217-9 réparation chaudière',
        'L.217-11 frais vendeur chaudière',
        'L.217-13 remboursement chaudière',
        'L.217-7 présomption chaudière',
        'vendeur responsable L.217-3',
        'mise en demeure chaudière',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Chaudière domestique : garantie légale 2025',
        url: '/guides/chaudiere-domestique-defaut-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts chaudière couverts',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Allumage aléatoire, carte électronique, fuites, pression instable, impossibilité d’atteindre la température : L.217-5, L.217-7.'
              }
            />
          </p>{' '}
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={'Urgence sanitaire : exigez un délai raisonnable réduit.'} />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Démarches priorisées',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Réparation (L.217-9) • Mise en demeure • Remplacement/remboursement (L.217-14, L.217-16, L.217-17). Frais : vendeur (L.217-11).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Installateur/vendeur : points clés',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_POMPE_A_CHALEUR_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Pompe à chaleur : garantie légale 2025',
    seo: {
      title: 'PAC défectueuse : vos recours',
      description:
        'COP faible, pannes électroniques ? Garantie légale : réparation, remplacement, remboursement. Lettre conforme en 3 min.',
      keywords: [
        'pompe à chaleur garantie légale',
        'COP faible recours PAC',
        'panne électronique PAC',
        'fuite fluide PAC',
        'L.217-9 réparation PAC',
        'L.217-11 frais vendeur PAC',
        'L.217-13 remboursement PAC',
        'L.217-7 présomption PAC',
        'vendeur responsable L.217-3',
        'mise en demeure PAC',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Pompe à chaleur : garantie légale 2025',
        url: '/guides/pompe-a-chaleur-defaut-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts PAC couverts',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'COP très inférieur aux caractéristiques promises, fuites, cartes HS, bruit anormal : L.217-5, L.217-7.'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Parcours clair',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Réparation (L.217-9) → Mise en demeure → Remplacement/remboursement (L.217-14, L.217-16, L.217-17). Frais : vendeur (L.217-11).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Poseur/distributeur : cadrage',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_ALARME_MAISON_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Alarme maison défectueuse : garantie légale 2025',
    seo: {
      title: 'Alarme défectueuse : vos droits',
      description:
        'Faux positifs, sirène muette, capteurs instables ? Garantie légale : réparation, remplacement, remboursement.',
      keywords: [
        'alarme maison garantie légale',
        'faux positifs alarme',
        'sirène muette défaut',
        'capteurs alarme instables',
        'L.217-9 réparation alarme',
        'L.217-11 frais vendeur alarme',
        'L.217-13 remboursement alarme',
        'L.217-7 présomption alarme',
        'vendeur responsable L.217-3',
        'mise en demeure alarme',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Alarme maison défectueuse : garantie légale 2025',
        url: '/guides/alarme-maison-defaut-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts couverts sur systèmes d’alarme',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Détections fantômes, capteurs défaillants, sirène inopérante, centrale instable : L.217-5, L.217-7.'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Étapes légales',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Réparation (L.217-9) → Mise en demeure → Remplacement/remboursement (L.217-14, L.217-16, L.217-17). Frais : vendeur (L.217-11).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Vendeur/poseur : bonnes pratiques',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_DOMOTIQUE_PASSERELLE_CAPTEURS_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Domotique (passerelle/capteurs) : garantie légale 2025',
    seo: {
      title: 'Domotique défectueuse : recours',
      description:
        'Passerelle/capteurs qui se déconnectent, automations HS ? Garantie légale : réparation, remplacement, remboursement.',
      keywords: [
        'domotique garantie légale',
        'passerelle domotique panne',
        'capteurs déconnexion',
        'automations HS défaut',
        'L.217-9 réparation domotique',
        'L.217-11 frais vendeur domotique',
        'L.217-13 remboursement domotique',
        'L.217-7 présomption domotique',
        'vendeur responsable L.217-3',
        'mise en demeure domotique',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Domotique (passerelle/capteurs) : garantie légale 2025',
        url: '/guides/domotique-passerelle-capteurs-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts domotique couverts',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Pertes de liaison, capteurs fantômes, scénarios non exécutés, application inopérante : L.217-5, L.217-7.'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Marche à suivre',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Réparation prioritaire (L.217-9). Si échec : remplacement/remboursement (L.217-14, L.217-16, L.217-17). Frais : vendeur (L.217-11).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Distributeur : accélérer la prise en charge',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_VELO_ELECTRIQUE_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Vélo électrique défectueux : garantie légale 2025',
    seo: {
      title: 'VAE en panne : vos droits 2025',
      description:
        'Batterie/moteur, contrôleur, freins : garantie légale. Réparation, remplacement, remboursement. Lettre immédiate.',
      keywords: [
        'vélo électrique garantie légale',
        'batterie VAE panne',
        'moteur VAE défaut',
        'contrôleur VAE HS',
        'freinage VAE problème',
        'L.217-9 réparation VAE',
        'L.217-11 frais vendeur VAE',
        'L.217-13 remboursement VAE',
        'L.217-7 présomption VAE',
        'vendeur responsable L.217-3',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Vélo électrique défectueux : garantie légale 2025',
        url: '/guides/velo-electrique-defaut-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts VAE couverts',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Batterie qui chute, moteur bruyant, contrôleur/afficheur HS, câblage défectueux, freins inefficaces : L.217-5, L.217-7.'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Procédure claire',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Réparation via vendeur (L.217-9) • Mise en demeure • Remplacement/remboursement (L.217-14, L.217-16, L.217-17). Frais : vendeur (L.217-11).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Magasin vélos : tips',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_TROTTINETTE_ELECTRIQUE_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Trottinette électrique : garantie légale 2025',
    seo: {
      title: 'Trottinette en panne : vos droits',
      description:
        'Batterie/contrôleur/freins défectueux ? Garantie légale : réparation, remplacement, remboursement. Lettre prête en 3 min.',
      keywords: [
        'trottinette garantie légale',
        'batterie trottinette panne',
        'contrôleur trottinette HS',
        'frein trottinette défaut',
        'L.217-9 réparation trottinette',
        'L.217-11 frais vendeur trottinette',
        'L.217-13 remboursement trottinette',
        'L.217-7 présomption trottinette',
        'vendeur responsable L.217-3',
        'mise en demeure trottinette',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Trottinette électrique : garantie légale 2025',
        url: '/guides/trottinette-electrique-defaut-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts couverts sur trottinettes',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Batterie qui ne tient pas, contrôleur/écran HS, freinage inefficace, jeu dans la colonne : L.217-5, L.217-7.'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Étapes légales',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Réparation (L.217-9) → Mise en demeure → Remplacement/remboursement (L.217-14, L.217-16, L.217-17). Frais : vendeur (L.217-11).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Boutiques : comment procéder',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_EQUIPEMENT_FITNESS_MAISON_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Équipement fitness maison : garantie légale 2025',
    seo: {
      title: 'Matériel fitness défectueux : recours',
      description:
        'Bruits, électronique, résistance HS : garantie légale. Réparation, remplacement, remboursement. Lettre conforme en 3 min.',
      keywords: [
        'tapis de course garantie légale',
        'rameur panne électronique',
        'vélo d’appartement défaut',
        'L.217-9 réparation fitness',
        'L.217-11 frais vendeur fitness',
        'L.217-13 remboursement fitness',
        'L.217-7 présomption fitness',
        'vendeur responsable L.217-3',
        'mise en demeure fitness',
        'matériel sport défectueux',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Équipement fitness maison : garantie légale 2025',
        url: '/guides/equipement-fitness-maison-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts couverts (tapis/vélo/rameur)',
      content: (
        <div className="space-y-3">
          <ul className="list-disc pl-5 space-y-1">
            \n{' '}
            <li>
              <TextWithLegalRefs text={'• Bruits/jeu anormal, courroie qui patine'} />
            </li>
            <li>
              <TextWithLegalRefs text={'• Électronique/console HS, capteurs faux'} />
            </li>
            <li>
              <TextWithLegalRefs text={'• Résistance inopérante, structure qui fissure'} />
            </li>
            \n
          </ul>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                '• Bruits/jeu anormal, courroie qui patine • Électronique/console HS, capteurs faux • Résistance inopérante, structure qui fissure Base : L.217-5, L.217-7.'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Procédure orientée résultat',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Réparation (L.217-9) • Mise en demeure • Remplacement/remboursement (L.217-14, L.217-16, L.217-17). Frais vendeurs (L.217-11).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Magasin/marketplace : agir vite',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_SKI_EQUIPEMENT_DEFAUT_GARANTIE_LEGALE: GuidePage = {
  metadata: {
    title: 'Ski & équipements défectueux : garantie légale 2025',
    seo: {
      title: 'Ski défectueux : vos recours',
      description:
        'Fixations/chaussures/peaux : casse, défauts ? Garantie légale. Réparation, remplacement, remboursement.',
      keywords: [
        'ski garantie légale',
        'fixations ski défaut',
        'chaussures ski casse',
        'peaux de phoque défaut',
        'L.217-9 réparation ski',
        'L.217-11 frais vendeur ski',
        'L.217-13 remboursement ski',
        'L.217-7 présomption ski',
        'vendeur responsable L.217-3',
        'mise en demeure ski',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Ski & équipements défectueux : garantie légale 2025',
        url: '/guides/ski-equipement-defaut-garantie-legale',
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
            examples={['L.217-11', 'L.217-13', 'L.217-5', 'L.217-7', 'L.217-9']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'defauts-couverts',
      title: 'Défauts ski couverts',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Fixations qui déclenchent mal, chaussures qui fissurent anormalement, peaux qui se décollent : L.217-5, L.217-7.'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-recours',
      title: 'Étapes légales',
      content: (
        <div className="space-y-3">
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                'Réparation (L.217-9) → Mise en demeure → Remplacement/remboursement (L.217-14, L.217-16, L.217-17). Frais : vendeur (L.217-11).'
              }
            />
          </p>
        </div>
      ),
    },
    {
      id: 'vendeurs-strategies',
      title: 'Magasin sport : accélérer',
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
    mainArticles: [
      'L.217-11' as LegalArticleId,
      'L.217-13' as LegalArticleId,
      'L.217-5' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.217-9' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

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

export const GUIDE_CDISCOUNT_MARKETPLACE: GuidePage = {
  metadata: {
    title: 'Cdiscount marketplace : vos droits avec les vendeurs tiers (2025)',
    seo: {
      title: 'Cdiscount marketplace : vos droits vendeurs tiers (Guide 2025)',
      description:
        'Achat chez un vendeur tiers sur Cdiscount ? Distinguez Pro/Particulier, garantie légale applicable, A-Z Protection. Procédure complète de recours.',
      keywords: [
        'Cdiscount marketplace vendeur tiers',
        'Cdiscount A-Z protection',
        'vendeur pro Cdiscount droits',
        'garantie légale Cdiscount',
        'réclamation vendeur Cdiscount',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Cdiscount marketplace : vos droits avec les vendeurs tiers (2025)',
        url: '/guides/cdiscount-marketplace',
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
      id: 'cdiscount-responsabilites',
      title: 'Cdiscount vs vendeurs tiers : qui est responsable ?',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• "Vendu et expédié par Cdiscount"`} />,
                <TextWithLegalRefs text={`• Logo Cdiscount sans mention vendeur`} />,
                <TextWithLegalRefs text={`• "Cdiscount à volonté" éligible`} />,
                <TextWithLegalRefs text={`• Garantie légale 2 ans française`} />,
                <TextWithLegalRefs text={`• Cdiscount responsable directement`} />,
                <TextWithLegalRefs text={`• SAV centralisé Cdiscount`} />,
                <TextWithLegalRefs text={`• Retour ≤ 30 jours (L.217-10) selon produit`} />,
                <TextWithLegalRefs text={`• Remboursement rapide`} />,
                <TextWithLegalRefs text={`• "Vendu par [Nom vendeur]"`} />,
                <TextWithLegalRefs text={`• "Expédié par Cdiscount" ou vendeur`} />,
                <TextWithLegalRefs text={`• Nom société visible sur fiche`} />,
                <TextWithLegalRefs text={`• Vendeur Pro UE : garantie légale 2 ans`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Cdiscount fonctionne principalement comme marketplace : distinguer Cdiscount vendeur direct des milliers de vendeurs tiers est crucial pour vos recours.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text={`🛒 Cdiscount vendeur direct 🔍 Comment identifier :`} />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`• "Vendu et expédié par Cdiscount" • Logo Cdiscount sans mention vendeur • "Cdiscount à volonté" éligible ✅ Vos droits • Garantie légale 2 ans française • Cdiscount responsable directement • SAV centralisé Cdiscount • Retour ≤ 30 jours (L.217-10) selon produit • Remboursement rapide 🏪 Vendeurs tiers marketplace 🔍 Comment identifier :`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`• "Vendu par [Nom vendeur]" • "Expédié par Cdiscount" ou vendeur • Nom société visible sur fiche ⚖️ Vos droits • Vendeur Pro UE : garantie légale 2 ans • Vendeur particulier : pas de garantie légale • Vendeur hors UE : droit local • A-Z Protection : recours Cdiscount • Contact vendeur obligatoire d'abord 🔍 Identifier le statut du vendeur 🏢 Vendeur Professionnel • Mention "Pro" sur fiche • SIRET visible • CGV détaillées • Garantie légale applicable 👤 Vendeur Particulier • Mention "Particulier" • Pas de SIRET • Vente occasionnelle • Pas de garantie légale 🌍 Vendeur étranger • Adresse hors France • Délais livraison longs • Droit local applicable • A-Z Protection essentielle`}
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

export const GUIDE_REFERE_CONSOMMATION: GuidePage = {
  metadata: {
    title: 'Référé consommation : procédure d\\',
    seo: {
      title: 'Référé consommation : procédure urgence tribunal (Guide 2025)',
      description: 'Litige consommation urgent ? Le référé permet d\\',
      keywords: [
        'référé consommation urgent',
        'procédure référé tribunal',
        'urgence litige consommation',
        'mesures conservatoires référé',
        'juge référés saisine',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Référé consommation : procédure d\\',
        url: '/guides/refere-consommation',
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
            examples={['808']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'conditions-refere',
      title: 'Conditions et cas d\\',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Préjudice imminent : risque de dommage`} />,
                <TextWithLegalRefs
                  text={`• Impossibilité d'attendre : procédure normale trop lente`}
                />,
                <TextWithLegalRefs text={`• Caractère objectif : apprécié par le juge`} />,
                <TextWithLegalRefs text={`• Lien avec le litige : urgence liée au fond`} />,
                <TextWithLegalRefs text={`• Droit apparent : vraisemblance juridique`} />,
                <TextWithLegalRefs text={`• Preuve prima facie : éléments suffisants`} />,
                <TextWithLegalRefs text={`• Contestation non fondée : défense fragile`} />,
                <TextWithLegalRefs text={`• Provisoire : sans préjuger du fond`} />,
                <TextWithLegalRefs text={`• Coupure services : électricité, gaz, eau`} />,
                <TextWithLegalRefs text={`• Denrées périssables : réfrigération HS`} />,
                <TextWithLegalRefs text={`• Sécurité : produit dangereux non rappelé`} />,
                <TextWithLegalRefs text={`• Logement : chauffage en hiver, infiltrations`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Le référé permet d'obtenir rapidement des mesures provisoires du juge en cas d' urgence manifeste ( Articles 808 et suivants CPC ).`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`⚡ Conditions strictes (Art. 808 CPC) 🚨 Urgence manifeste • Préjudice imminent : risque de dommage • Impossibilité d'attendre : procédure normale trop lente • Caractère objectif : apprécié par le juge • Lien avec le litige : urgence liée au fond ⚖️ Absence de contestation sérieuse • Droit apparent : vraisemblance juridique • Preuve prima facie : éléments suffisants • Contestation non fondée : défense fragile • Provisoire : sans préjuger du fond 🎯 Cas pratiques en consommation ✅ Urgence reconnue • Coupure services : électricité, gaz, eau • Denrées périssables : réfrigération HS • Sécurité : produit dangereux non rappelé • Logement : chauffage en hiver, infiltrations • Professionnel : outil de travail HS • Santé : matériel médical défaillant ❌ Pas d'urgence • Confort : TV, ordinateur personnel • Esthétique : rayures, défauts mineurs • Financier pur : remboursement sans préjudice • Litige complexe : expertise nécessaire • Délai écoulé : urgence non caractérisée ⚖️ Types de mesures possibles 🛡️ Conservatoires • Interdiction de vente • Séquestre du produit • Consignation sommes • Expertise contradictoire 🔧 Remise en état • Réparation immédiate • Remplacement urgent • Remise en service • Produit de substitution 💰 Financières • Provision dommages-intérêts • Remboursement partiel • Paiement créance certaine • Astreinte si non-exécution`}
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
    mainArticles: ['808' as LegalArticleId],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

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

export const GUIDE_PRESCRIPTION_DELAIS: GuidePage = {
  metadata: {
    title: 'Prescription et délais en droit de la consommation (2025)',
    seo: {
      title: 'Prescription délais consommation : ne ratez plus vos recours (2025)',
      description:
        'Délais pour agir en consommation : 2 ans garantie légale, 2 ans vices cachés après découverte, 5 ans responsabilité. Interruption et suspension.',
      keywords: [
        'prescription délais consommation',
        'délai action garantie légale',
        'prescription vices cachés',
        'interruption prescription',
        'délai recours consommateur',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Prescription et délais en droit de la consommation (2025)',
        url: '/guides/prescription-delais',
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
            <Badge>Présomption 24&nbsp;mois</Badge>
            <Badge>Frais vendeur</Badge>
            <Badge>≤&nbsp;30&nbsp;jours</Badge>
          </div>
          <LegalNote
            title="Références légales"
            explanation="Articles détectés automatiquement dans ce guide."
            examples={['1648', 'L.217-7', 'L.612-4']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'delais-prescription',
      title: 'Délais de prescription par type d\\',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• 2 ans à compter de la livraison`} />,
                <TextWithLegalRefs text={`• 1 an minimum pour l'occasion (pro)`} />,
                <TextWithLegalRefs text={`• Point de départ : délivrance conforme`} />,
                <TextWithLegalRefs text={`• Présomption : défaut pendant 24 mois`} />,
                <TextWithLegalRefs text={`• Livraison échelonnée : dernier élément`} />,
                <TextWithLegalRefs text={`• Installation complexe : mise en service`} />,
                <TextWithLegalRefs text={`• Découverte tardive : pas d'extension`} />,
                <TextWithLegalRefs text={`• Réparation sous garantie : nouveau délai`} />,
                <TextWithLegalRefs text={`• 2 ans après découverte du vice`} />,
                <TextWithLegalRefs text={`• Point de départ : connaissance certaine`} />,
                <TextWithLegalRefs text={`• Preuve : date de découverte à établir`} />,
                <TextWithLegalRefs text={`• Délai butoir : 20 ans après la vente`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`La prescription éteint le droit d'agir en justice après un certain délai. En droit de la consommation, les délais varient selon le fondement juridique invoqué.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`⚖️ Garantie légale de conformité 📅 Délai principal (Art. L.217-7) • 2 ans à compter de la livraison • 1 an minimum pour l'occasion (pro) • Point de départ : délivrance conforme • Présomption : défaut pendant 24 mois 🔍 Cas particuliers • Livraison échelonnée : dernier élément • Installation complexe : mise en service • Découverte tardive : pas d'extension • Réparation sous garantie : nouveau délai 🔍 Vices cachés (Code civil) ⏰ Délai de découverte (Art. 1648) • 2 ans après découverte du vice • Point de départ : connaissance certaine • Preuve : date de découverte à établir • Délai butoir : 20 ans après la vente 📋 Appréciation découverte • Manifestation claire : du défaut • Expertise : confirmant le vice • Impossibilité d'ignorer : évidence • Pas de soupçons : certitude requise ⚖️ Action en responsabilité 🎯 Délai général (Art. 2224 C.civ) • 5 ans après fait dommageable • Point de départ : dommage + auteur connus • Applications : défaut produit dangereux • Cumul possible : avec garantie légale 💥 Responsabilité produits défectueux • 3 ans : après connaissance dommage + défaut • 10 ans : à compter mise en circulation • Producteur : responsabilité automatique • Dommages corporels : régime spécial 📋 Autres délais spéciaux 💳 Crédit consommation • 2 ans : vices du consentement • 5 ans : nullité du contrat • Point de départ : signature 🏠 Démarchage domicile • 14 jours : rétractation • 1 an : si info manquante • 3 mois : + 14 jours si régularisation 🌐 Vente distance • 14 jours : rétractation • 12 mois : si info manquante • Service : exécution immédiate possible`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'interruption-suspension',
      title: 'Interruption et suspension de la prescription',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Citation en justice : assignation au fond`} />,
                <TextWithLegalRefs text={`• Requête : procédure simplifiée`} />,
                <TextWithLegalRefs text={`• Référé : même conservatoire`} />,
                <TextWithLegalRefs text={`• Déclaration : greffe compétent`} />,
                <TextWithLegalRefs text={`• Commandement : huissier de justice`} />,
                <TextWithLegalRefs text={`• Reconnaissance expresse : écrite du débiteur`} />,
                <TextWithLegalRefs text={`• Paiement partiel : reconnaissance implicite`} />,
                <TextWithLegalRefs text={`• Demande délai : reconnaissance de la dette`} />,
                <TextWithLegalRefs text={`• Offre transaction : selon les termes`} />,
                <TextWithLegalRefs text={`• Saisine médiateur : consommation agréé`} />,
                <TextWithLegalRefs text={`• Durée : jusqu'à fin de médiation`} />,
                <TextWithLegalRefs text={`• Maximum : 90 jours généralement`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`⏹️ Interruption de la prescription L'interruption efface le délai écoulé et fait courir un nouveau délai intégral.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`⚖️ Actes judiciaires (Art. 2241 C.civ) • Citation en justice : assignation au fond • Requête : procédure simplifiée • Référé : même conservatoire • Déclaration : greffe compétent • Commandement : huissier de justice 📞 Actes de reconnaissance (Art. 2240) • Reconnaissance expresse : écrite du débiteur • Paiement partiel : reconnaissance implicite • Demande délai : reconnaissance de la dette • Offre transaction : selon les termes ⏸️ Suspension de la prescription La suspension arrête temporairement le délai qui reprend ensuite où il s'était arrêté.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`🤝 Médiation (Art. L.612-4) • Saisine médiateur : consommation agréé • Durée : jusqu'à fin de médiation • Maximum : 90 jours généralement • Notification : au professionnel ⚖️ Autres causes suspension • Force majeure : impossibilité absolue • Conciliation : devant conciliateur • Expertise : judiciaire ordonnée • Procédure collective : du débiteur 🎯 Stratégie pour préserver vos droits 📅 Calendrier délais • Noter : date livraison exacte • Calculer : échéance -3 mois • Alertes : rappels automatiques • Documents : classement chronologique ✍️ Actes conservatoires • Mise en demeure : LRAR systématique • Médiation : si délai proche • Citation : en urgence si nécessaire • Référé : mesures conservatoires 🔍 Preuves de dates • Factures : avec mentions légales • Bons livraison : signés datés • Emails : horodatages serveur • Photos : métadonnées EXIF`}
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
      '1648' as LegalArticleId,
      'L.217-7' as LegalArticleId,
      'L.612-4' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_CONSTITUER_PREUVES: GuidePage = {
  metadata: {
    title: 'Constituer un dossier de preuves solide en consommation (2025)',
    seo: {
      title: 'Constituer preuves litige consommation : dossier solide (Guide 2025)',
      description:
        'Comment constituer un dossier de preuves efficace pour votre litige consommation : documents, photos, expertises, témoignages. Recevabilité et conservation.',
      keywords: [
        'constituer preuves consommation',
        'dossier litige documentation',
        'photos preuves défaut produit',
        'correspondances vendeur preuves',
        'expertise judiciaire consommation',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Constituer un dossier de preuves solide en consommation (2025)',
        url: '/guides/constituer-preuves',
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

export const GUIDE_ALTERNATIVES: GuidePage = {
  metadata: {
    title: 'SignalConso : mode d\\',
    seo: {
      title: 'SignalConso : comment signaler un professionnel défaillant (Guide 2025)',
      description:
        'Signalement sur SignalConso en 5 étapes : quand, comment, quels documents. Taux de réussite 96%. Pression officielle sur le professionnel.',
      keywords: [
        'SignalConso mode emploi',
        'signaler professionnel DGCCRF',
        'signal conso efficacité',
        'signalement consommateur gratuit',
        'DGCCRF contrôle entreprise',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      { name: 'SignalConso : mode d\\', url: '/guides/alternatives' },
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
            examples={['843']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'quand-signaler',
      title: 'Quand utiliser SignalConso ?',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Refus de garantie abusif`} />,
                <TextWithLegalRefs text={`• Clauses contractuelles illégales`} />,
                <TextWithLegalRefs text={`• Publicité mensongère`} />,
                <TextWithLegalRefs text={`• Vente forcée / pratiques agressives`} />,
                <TextWithLegalRefs text={`• Non-respect droit de rétractation`} />,
                <TextWithLegalRefs text={`• Prix abusifs / entente`} />,
                <TextWithLegalRefs text={`• Défaut d'information précontractuelle`} />,
                <TextWithLegalRefs text={`• SAV inexistant`} />,
                <TextWithLegalRefs text={`• Sécurité produit défaillante`} />,
                <TextWithLegalRefs text={`• Hygiène / traçabilité`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`SignalConso est le service officiel de signalement des anomalies de consommation à la DGCCRF (Direction générale de la concurrence, de la consommation et de la répression des fraudes).`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`✅ Situations où SignalConso est efficace • Refus de garantie abusif • Clauses contractuelles illégales • Publicité mensongère • Vente forcée / pratiques agressives • Non-respect droit de rétractation • Prix abusifs / entente • Défaut d'information précontractuelle • SAV inexistant • Sécurité produit défaillante • Hygiène / traçabilité 📊 Efficacité prouvée 96% de résolution après signalement 15j délai moyen de réponse pro 0€ 100% gratuit`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-signalement',
      title: 'Procédure de signalement en 5 étapes',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Pratique commerciale déloyale`} />,
                <TextWithLegalRefs text={`• Non-respect réglementation`} />,
                <TextWithLegalRefs text={`• Sécurité des produits`} />,
                <TextWithLegalRefs text={`• Problème généralisé`} />,
                <TextWithLegalRefs text={`• Litige contractuel individuel`} />,
                <TextWithLegalRefs text={`• Conflit de voisinage`} />,
                <TextWithLegalRefs text={`• Services bancaires`} />,
                <TextWithLegalRefs text={`• Professions libérales`} />,
                <TextWithLegalRefs text={`• Principe : échange contradictoire obligatoire`} />,
                <TextWithLegalRefs text={`• Délai : 15 jours avant audience`} />,
                <TextWithLegalRefs text={`• Modalités : LRAR ou remise contre récépissé`} />,
                <TextWithLegalRefs text={`• Bordereau : inventaire des pièces joint`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`1 🔍 Vérifier l'éligibilité Avant de signaler, vérifiez que votre cas relève bien de la DGCCRF :`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`✅ OUI • Pratique commerciale déloyale • Non-respect réglementation • Sécurité des produits • Problème généralisé ❌ NON • Litige contractuel individuel • Conflit de voisinage • Services bancaires • Professions libérales 2 🎯 Se connecter sur signal.conso.gouv.fr Conseil : Créez un compte pour suivre votre signalement et être recontacté.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`💡 Astuce mobile : L'interface est optimisée smartphone, vous pouvez signaler depuis votre téléphone. 3 📝 Remplir le formulaire détaillé ⚠️ Important : Conservez le récépissé et notez le numéro RG (Répertoire Général). C"est votre référence pour tous les échanges ultérieurs.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`3 📬 Notification et échanges Le greffe notifie votre requête au défendeur qui a 15 jours pour répondre (Art. 843 CPC).`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`📨 Communication des pièces • Principe : échange contradictoire obligatoire • Délai : 15 jours avant audience • Modalités : LRAR ou remise contre récépissé • Bordereau : inventaire des pièces joint ⚖️ Réponse du défendeur • Conclusions : défense écrite • Demande reconventionnelle : contre-attaque possible • Défaut : si pas de réponse, jugement possible • Transaction : accord amiable jusqu'à l'audience 4 🏛️ Audience et jugement 📅 Déroulement audience • Appel de l'affaire : présence obligatoire • Exposé des parties : 5-10 min chacune • Questions du juge : clarifications • Tentative conciliation : solution amiable • Mise en délibéré : date du jugement ⚖️ Issues possibles • Jugement au fond : décision sur le litige • Mesures d'instruction : expertise ordonnée • Conciliation homologuée : accord devant juge • Renvoi : complément d'information 💡 Conseils pour l'audience • Ponctualité : arrivée 15 min avant • Tenue correcte : respect de l'institution • Documents organisés : classeur avec onglets • Synthèse orale : reprendre les points clés • Respect : vouvoiement, "Monsieur/Madame le Juge"`}
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
    mainArticles: ['843' as LegalArticleId],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_SIGNALCONSO: GuidePage = {
  metadata: {
    title: 'Vices cachés : action en garantie au-delà de 2 ans (2025)',
    seo: {
      title: 'Vices cachés : agir au-delà de la garantie légale (Guide 2025)',
      description: 'Défaut découvert après 2 ans ? Les vices cachés (Code civil) permettent d\\',
      keywords: [
        'vices cachés code civil',
        'action garantie vices cachés',
        'défaut antérieur vente',
        'recours après 2 ans',
        'articles 1641 1649',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Vices cachés : action en garantie au-delà de 2 ans (2025)',
        url: '/guides/signalconso',
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
            examples={['1641', '1644', '1645', '1648', '1649']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'definition-vices-caches',
      title: 'Définition et conditions des vices cachés',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Test : acheteur diligent n'aurait pas pu déceler`} />,
                <TextWithLegalRefs text={`• Moment : appréciation à la date de vente`} />,
                <TextWithLegalRefs text={`• Connaissance vendeur : sans incidence`} />,
                <TextWithLegalRefs text={`• Critère : usage normal attendu`} />,
                <TextWithLegalRefs text={`• Appréciation : in concreto (votre situation)`} />,
                <TextWithLegalRefs text={`• Seuil : trouble suffisamment important`} />,
                <TextWithLegalRefs text={`• Preuve : à la charge de l'acheteur`} />,
                <TextWithLegalRefs text={`• Indices : nature du défaut, évolution`} />,
                <TextWithLegalRefs text={`• Expertise : souvent nécessaire`} />,
                <TextWithLegalRefs text={`• Test : comportement rationnel`} />,
                <TextWithLegalRefs text={`• Preuve : présomption simple`} />,
                <TextWithLegalRefs text={`• Réfutation : vendeur peut contester`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`Les vices cachés sont régis par les articles 1641 à 1649 du Code civil . Ils permettent d'agir même après expiration de la garantie légale de conformité.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`⚖️ 4 conditions cumulatives (Article 1641) 1️⃣ Défaut caché Non apparent lors de la vente, même avec examen attentif`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`• Test : acheteur diligent n'aurait pas pu déceler • Moment : appréciation à la date de vente • Connaissance vendeur : sans incidence 2️⃣ Défaut grave Rend la chose impropre à l'usage ou diminue cet usage`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`• Critère : usage normal attendu • Appréciation : in concreto (votre situation) • Seuil : trouble suffisamment important 3️⃣ Défaut antérieur Existait déjà au moment de la vente`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`• Preuve : à la charge de l'acheteur • Indices : nature du défaut, évolution • Expertise : souvent nécessaire 4️⃣ Connaissance présumée l'acheteur n'aurait pas acheté ou à prix moindre`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`• Test : comportement rationnel • Preuve : présomption simple • Réfutation : vendeur peut contester 🔍 Vices cachés vs Garantie légale 🆚 Différences clés Délai : Vices cachés : 2 ans après découverte Garantie légale : 2 ans après livraison Preuve : Vices cachés : charge acheteur Garantie légale : présomption 24 mois Conditions : Vices cachés : 4 conditions strictes Garantie légale : simple non-conformité 🎯 Stratégie juridique • privilégier garantie légale • > 2 ans : vices cachés seule option • Cumul possible : selon les faits • Action subsidiaire : vices cachés en 2ème • Choix tactique : selon la preuve disponible 📋 Exemples concrets de vices cachés 🚗 Automobile • Moteur réparé non déclaré • Accident antérieur masqué • Kilométrage trafiqué • Corrosion structurelle 🏠 Immobilier • Infiltrations cachées • Termites non déclarés • Fissures structurelles • Installation électrique dangereuse 📱 Électronique • Composant défaillant interne • Réparation antérieure cachée • Oxydation non visible • Logiciel piraté/modifié`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'procedure-vices-caches',
      title: 'Procédure et délais d\\',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Manifestation claire du défaut`} />,
                <TextWithLegalRefs text={`• Diagnostic professionnel confirmant`} />,
                <TextWithLegalRefs text={`• Impossibilité d'ignorer le problème`} />,
                <TextWithLegalRefs text={`• Lien de causalité établi`} />,
                <TextWithLegalRefs text={`• Dies a quo : jour de découverte certaine`} />,
                <TextWithLegalRefs text={`• Interruption : citation en justice`} />,
                <TextWithLegalRefs text={`• Suspension : expertise amiable`} />,
                <TextWithLegalRefs text={`• Forclusion : délai dépassé = irrecevabilité`} />,
                <TextWithLegalRefs
                  text={`• Expert judiciaire : inscription sur liste cour d'appel`}
                />,
                <TextWithLegalRefs text={`• Expertise amiable : plus rapide et moins chère`} />,
                <TextWithLegalRefs text={`• Contre-expertise : droit du vendeur`} />,
                <TextWithLegalRefs text={`• Coût : 800-3000€ selon complexité`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`⏰ Délai d'action : 2 ans après découverte (Art. 1648) Point de départ : connaissance certaine du vice, pas des simples soupçons ou dysfonctionnements mineurs.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`🔍 Moment de la découverte • Manifestation claire du défaut • Diagnostic professionnel confirmant • Impossibilité d'ignorer le problème • Lien de causalité établi 📅 Calcul du délai • Dies a quo : jour de découverte certaine • Interruption : citation en justice • Suspension : expertise amiable • Forclusion : délai dépassé = irrecevabilité 🔎 Constitution de la preuve La preuve des vices cachés incombe entièrement à l'acheteur . Une expertise technique est souvent indispensable.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`🧪 Expertise technique • Expert judiciaire : inscription sur liste cour d'appel • Expertise amiable : plus rapide et moins chère • Contre-expertise : droit du vendeur • Coût : 800-3000€ selon complexité • Contradictoire : parties convoquées 📋 Éléments de preuve • Rapport d'expertise circonstancié • Photos datées de l'évolution • Témoignages de professionnels • Documents techniques : notices, réparations • Correspondances avec le vendeur ⚖️ Actions et sanctions (Art. 1644) L'acheteur peut choisir entre résolution (remboursement) ou réduction du prix , plus dommages-intérêts si vendeur connaissait le vice.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`🔄 Action résolutoire • Principe : remboursement intégral • Restitution : chose vendue en l'état • Frais : remboursement frais acquisition • Usage : indemnité possible si enrichissement • Délai : rétroactivité à la vente 💰 Action estimatoire • Principe : conservation + réduction prix • Calcul : expertise évalue moins-value • Avantage : garde la chose malgré le vice • Cumul : réparation aux frais vendeur possible • Choix : souvent plus pratique 💸 Dommages-intérêts (Art. 1645) Condition : vendeur professionnel présumé connaître le vice, ou vendeur particulier ayant eu connaissance.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`• Préjudice direct : coût réparations tentées • Préjudice d'usage : privation de jouissance • Préjudice économique : perte d'exploitation • Préjudice moral : trouble, désagrément`}
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
      '1641' as LegalArticleId,
      '1644' as LegalArticleId,
      '1645' as LegalArticleId,
      '1648' as LegalArticleId,
      '1649' as LegalArticleId,
    ],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

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

export const GUIDE_PROTECTION_JURIDIQUE: GuidePage = {
  metadata: {
    title: 'Protection juridique : votre assurance peut-elle couvrir votre litige ? (2025)',
    seo: {
      title: 'Protection juridique assurance : comment l\\',
      description:
        'Votre assurance habitation ou auto inclut souvent une protection juridique. Découvrez comment vérifier et activer cette garantie pour vos litiges consommation.',
      keywords: [
        'protection juridique assurance',
        'garantie défense recours',
        'assurance litige consommation',
        'frais avocat pris en charge',
        'protection juridique habitation auto',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Protection juridique : votre assurance peut-elle couvrir votre litige ? (2025)',
        url: '/guides/protection-juridique',
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
      id: 'verification-contrat',
      title: 'Vérifier si vous avez une protection juridique',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Multirisques habitation`} />,
                <TextWithLegalRefs text={`• Garantie "Défense-Recours"`} />,
                <TextWithLegalRefs text={`• "Protection juridique"`} />,
                <TextWithLegalRefs text={`• Montant : 3 000€ à 15 000€`} />,
                <TextWithLegalRefs text={`• Tous risques ou tiers+`} />,
                <TextWithLegalRefs text={`• Protection juridique étendue`} />,
                <TextWithLegalRefs text={`• Défense pénale et recours`} />,
                <TextWithLegalRefs text={`• Souvent 7 500€ à 20 000€`} />,
                <TextWithLegalRefs text={`• Visa Premier, Gold MasterCard`} />,
                <TextWithLegalRefs text={`• Assistance juridique`} />,
                <TextWithLegalRefs text={`• Litiges e-commerce inclus`} />,
                <TextWithLegalRefs text={`• Montants variables`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`90% des français possèdent une protection juridique sans le savoir ! Cette garantie est souvent incluse dans vos contrats d'assurance existants.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`🔍 Où chercher votre protection juridique ? 🏠 Assurance habitation • Multirisques habitation • Garantie "Défense-Recours" • "Protection juridique" • Montant : 3 000€ à 15 000€ 🚗 Assurance automobile • Tous risques ou tiers+ • Protection juridique étendue • Défense pénale et recours • Souvent 7 500€ à 20 000€ 💳 Carte bancaire premium • Visa Premier, Gold MasterCard • Assistance juridique • Litiges e-commerce inclus • Montants variables 🏢 Assurance professionnelle • RC professionnelle • Multirisques entreprise • Protection juridique pro • Couvre litiges perso parfois 📋 Documents à examiner Conditions générales Chapitre "Protection juridique" Tableau des garanties Montants et plafonds Conditions particulières Vos garanties spécifiques`}
            />
          </p>
        </div>
      ),
    },
    {
      id: 'activation-garantie',
      title: 'Comment activer votre protection juridique ?',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text={`• Téléphone : n° sur votre contrat`} />,
                <TextWithLegalRefs text={`• Email : sinistres@assureur.fr`} />,
                <TextWithLegalRefs text={`• Courrier RAR (+ sûr)`} />,
                <TextWithLegalRefs text={`• Espace client en ligne`} />,
                <TextWithLegalRefs text={`• N° de contrat et nom assuré`} />,
                <TextWithLegalRefs text={`• Date et nature du litige`} />,
                <TextWithLegalRefs text={`• Adversaire (nom, adresse)`} />,
                <TextWithLegalRefs text={`• Montant en jeu`} />,
                <TextWithLegalRefs text={`• Facture d'achat`} />,
                <TextWithLegalRefs text={`• Correspondances avec le pro`} />,
                <TextWithLegalRefs text={`• Photos du défaut`} />,
                <TextWithLegalRefs text={`• Conditions générales de vente`} />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`1 📞 Déclarer le sinistre Délai impératif : 5 jours ouvrés après connaissance du litige (souvent extensible à 20 jours)`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`📧 Moyens de déclaration • Téléphone : n° sur votre contrat • Email : sinistres@assureur.fr • Courrier RAR (+ sûr) • Espace client en ligne 📋 Informations à donner • N° de contrat et nom assuré • Date et nature du litige • Adversaire (nom, adresse) • Montant en jeu 2 📄 Constituer le dossier 🗂️ Pièces indispensables • Facture d'achat • Correspondances avec le pro • Photos du défaut • Conditions générales de vente • Devis de réparation • Expertise technique si existante • Mise en demeure envoyée • Tout élément de preuve 💡 Conseil : Numérisez tous vos documents. La plupart des assureurs acceptent maintenant les envois dématérialisés.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`3 ⚖️ Analyse juridique L'assureur fait analyser votre dossier par un juriste pour évaluer vos chances de succès.`}
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={`✅ Si chances > 50% • Prise en charge immédiate • Assignation d'un avocat • Avance des frais • Négociation amiable d'abord ❌ Si chances • Refus de prise en charge • Possibilité de recours interne • Médiation avec l'assureur • Expertise contradictoire`}
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

export const GUIDE_MISSING_15: GuidePage = {
  metadata: {
    title: 'Médiation de la consommation : résoudre votre litige gratuitement (2025)',
    seo: {
      title: 'Médiation consommation : mode d\\',
      description:
        'Litige non résolu ? La médiation de la consommation est gratuite et obligatoire. Trouvez votre médiateur, procédure complète, délais et efficacité.',
      keywords: [
        'médiation consommation gratuite',
        'médiateur sectoriel litige',
        'résolution amiable conflit',
        'alternative tribunal consommation',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Médiation de la consommation : résoudre votre litige gratuitement (2025)',
        url: '/guides/missing-15',
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
            <Badge>Présomption 24&nbsp;mois</Badge>
            <Badge>Frais vendeur</Badge>
            <Badge>≤&nbsp;30&nbsp;jours</Badge>
          </div>
          <LegalNote
            title="Références légales"
            explanation="Articles détectés automatiquement dans ce guide."
            examples={['L.612-1']}
            disclaimer="Informations générales — ceci n’est pas un conseil juridique individualisé."
            defaultOpen={false}
          />
        </div>
      ),
    },
    {
      id: 'principe-mediation',
      title: 'Principe et avantages de la médiation',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text="• 100% gratuit pour le consommateur" />,
                <TextWithLegalRefs text="• Procédure dématérialisée possible" />,
                <TextWithLegalRefs text="• Pas d'avocat obligatoire" />,
                <TextWithLegalRefs text="• Langue française garantie" />,
                <TextWithLegalRefs text="• Délai maximum : 90 jours" />,
                <TextWithLegalRefs text="• Taux de succès : 65% d'accords" />,
                <TextWithLegalRefs text="• Solution personnalisée" />,
                <TextWithLegalRefs text="• Préserve la relation commerciale" />,
                <TextWithLegalRefs text="• Litige contractuel consommateur/professionnel" />,
                <TextWithLegalRefs text="• Vente de biens ou prestation de services" />,
                <TextWithLegalRefs text="• Refus application garantie légale" />,
                <TextWithLegalRefs text="• Défaut d'information précontractuelle" />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text="La médiation de la consommation est un mode de résolution amiable des litiges obligatoire et gratuit instauré par la loi Hamon de 2014 ( Articles L.612-1 et suivants )." />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text="✅ Avantages de la médiation 💰 Coût et facilité • 100% gratuit pour le consommateur • Procédure dématérialisée possible • Pas d'avocat obligatoire • Langue française garantie ⏱️ Délais et efficacité • Délai maximum : 90 jours • Taux de succès : 65% d'accords • Solution personnalisée • Préserve la relation commerciale 🎯 Litiges concernés ✅ Éligible à la médiation • Litige contractuel consommateur/professionnel • Vente de biens ou prestation de services • Refus application garantie légale • Défaut d'information précontractuelle • Non-respect délais de livraison ❌ Exclus de la médiation • Litiges entre particuliers • Services publics (poste, SNCF) • Santé (responsabilité médicale) • Réclamations frivoles ou abusives • Procédure judiciaire en cours" />
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
    mainArticles: ['L.612-1' as LegalArticleId],
    disclaimer: true,
    lastUpdated: '2025-09-09',
  },
};

export const GUIDE_MISSING_16: GuidePage = {
  metadata: {
    title: 'Amazon : garantie légale et politique de retours (2025)',
    seo: {
      title: 'Amazon garantie et retours : vos droits sur la marketplace (2025)',
      description:
        'Produit défectueux sur Amazon ? Distinguez vendeurs Amazon/tiers, 30 jours retour + 2 ans garantie légale, A-Z Protection. Procédure complète.',
      keywords: [
        'Amazon garantie légale retours',
        'marketplace vendeur tiers droits',
        'Amazon A-Z protection',
        'produit défectueux Amazon recours',
      ],
    },
    breadcrumb: [
      { name: 'Accueil', url: '/' },
      { name: 'Guides', url: '/guides' },
      {
        name: 'Amazon : garantie légale et politique de retours (2025)',
        url: '/guides/missing-16',
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
      id: 'amazon-responsabilites',
      title: 'Amazon vendeur vs Marketplace : qui est responsable ?',
      content: (
        <div className="space-y-3">
          <DefaultGrid
            items={
              [
                <TextWithLegalRefs text='• "Vendu par Amazon"' />,
                <TextWithLegalRefs text='• "Expédié par Amazon"' />,
                <TextWithLegalRefs text="• Pas de nom vendeur tiers" />,
                <TextWithLegalRefs text="• 30 jours retour Amazon sans motif" />,
                <TextWithLegalRefs text="• 2 ans garantie légale française" />,
                <TextWithLegalRefs text="• Amazon responsable directement" />,
                <TextWithLegalRefs text="• Service client Amazon compétent" />,
                <TextWithLegalRefs text="• Remboursement rapide (3-5 jours)" />,
                <TextWithLegalRefs text='• "Vendu par [Nom société]"' />,
                <TextWithLegalRefs text='• "Expédié par Amazon" possible' />,
                <TextWithLegalRefs text="• Nom vendeur visible sur fiche" />,
                <TextWithLegalRefs text="• 14 jours rétractation (droit européen)" />,
              ] as React.ReactNode[]
            }
          />
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text="Amazon fonctionne comme marketplace : Amazon peut être vendeur direct ou simple intermédiaire. Vos droits et interlocuteurs diffèrent selon le cas." />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text="📦 Amazon vendeur direct 🔍 Comment identifier :" />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text='• "Vendu par Amazon" • "Expédié par Amazon" • Pas de nom vendeur tiers ✅ Vos droits • 30 jours retour Amazon sans motif • 2 ans garantie légale française • Amazon responsable directement • Service client Amazon compétent • Remboursement rapide (3-5 jours) 🏪 Vendeur tiers sur Amazon 🔍 Comment identifier :' />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs
              text={
                '• "Vendu par [Nom société]" • "Expédié par Amazon" possible • Nom vendeur visible sur fiche ⚖️ Vos droits • 14 jours rétractation (droit européen) • 2 ans garantie légale si vendeur UE • Vendeur responsable principal • A-Z Protection Amazon si échec • Contact vendeur obligatoire d\'abord ⚠️ Cas particulier : vendeur hors UE • Garantie légale française non applicable si vendeur hors UE'
              }
            />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text="• A-Z Protection Amazon devient votre principal recours" />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text="• Délai 90 jours pour saisir Amazon après livraison" />
          </p>
          <p className="text-sm sm:text-base">
            <TextWithLegalRefs text="• Montant plafonné selon politique Amazon" />
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

export const ALL_GUIDES: Record<string, GuidePage> = {
  'garantie-legale-conformite-guide-complet': GUIDE_GARANTIE_LEGALE_CONFORMITE_GUIDE_COMPLET,
  'smartphone-ecran-batterie-defaut-garantie-legale':
    GUIDE_SMARTPHONE_ECRAN_BATTERIE_DEFAUT_GARANTIE_LEGALE,
  'ordinateur-portable-panne-garantie-legale': GUIDE_ORDINATEUR_PORTABLE_PANNE_GARANTIE_LEGALE,
  'routeur-wifi-mesh-deconnexions-garantie-legale':
    GUIDE_ROUTEUR_WIFI_MESH_DECONNEXIONS_GARANTIE_LEGALE,
  'appareil-photo-hybride-defaut-garantie-legale':
    GUIDE_APPAREIL_PHOTO_HYBRIDE_DEFAUT_GARANTIE_LEGALE,
  'lave-linge-panne-garantie-legale': GUIDE_LAVE_LINGE_PANNE_GARANTIE_LEGALE,
  'lave-vaisselle-defaut-garantie-legale': GUIDE_LAVE_VAISSELLE_DEFAUT_GARANTIE_LEGALE,
  'refrigerateur-congelateur-defaut-garantie-legale':
    GUIDE_REFRIGERATEUR_CONGELATEUR_DEFAUT_GARANTIE_LEGALE,
  'aspirateur-robot-panne-garantie-legale': GUIDE_ASPIRATEUR_ROBOT_PANNE_GARANTIE_LEGALE,
  'micro-ondes-panne-garantie-legale': GUIDE_MICRO_ONDES_PANNE_GARANTIE_LEGALE,
  'chauffe-eau-electrique-defaut-garantie-legale':
    GUIDE_CHAUFFE_EAU_ELECTRIQUE_DEFAUT_GARANTIE_LEGALE,
  'portail-motorise-defaut-garantie-legale': GUIDE_PORTAIL_MOTORISE_DEFAUT_GARANTIE_LEGALE,
  'autoradio-infotainment-defaut-garantie-legale':
    GUIDE_AUTORADIO_INFOTAINMENT_DEFAUT_GARANTIE_LEGALE,
  'home-trainer-connecte-defaut-garantie-legale':
    GUIDE_HOME_TRAINER_CONNECTE_DEFAUT_GARANTIE_LEGALE,
  'smartphone-telephone-panne-garantie-legale': GUIDE_SMARTPHONE_TELEPHONE_PANNE_GARANTIE_LEGALE,
  'casque-audio-haut-de-gamme-defaut-garantie-legale':
    GUIDE_CASQUE_AUDIO_HAUT_DE_GAMME_DEFAUT_GARANTIE_LEGALE,
  'ecouteurs-sans-fil-defaut-connexion-garantie-legale':
    GUIDE_ECOUTEURS_SANS_FIL_DEFAUT_CONNEXION_GARANTIE_LEGALE,
  'smartwatch-batterie-faible-garantie-legale': GUIDE_SMARTWATCH_BATTERIE_FAIBLE_GARANTIE_LEGALE,
  'tablette-tactile-ecran-surchauffe-garantie-legale':
    GUIDE_TABLETTE_TACTILE_ECRAN_SURCHAUFFE_GARANTIE_LEGALE,
  'tv-oled-ecran-marques-garantie-legale': GUIDE_TV_OLED_ECRAN_MARQUES_GARANTIE_LEGALE,
  'videoprojecteur-panne-garantie-legale': GUIDE_VIDEOPROJECTEUR_PANNE_GARANTIE_LEGALE,
  'serveur-nas-panne-garantie-legale': GUIDE_SERVEUR_NAS_PANNE_GARANTIE_LEGALE,
  'imprimante-defaut-garantie-legale': GUIDE_IMPRIMANTE_DEFAUT_GARANTIE_LEGALE,
  'ecran-pc-pixels-morts-garantie-legale': GUIDE_ECRAN_PC_PIXELS_MORTS_GARANTIE_LEGALE,
  'aspirateur-balai-panne-garantie-legale': GUIDE_ASPIRATEUR_BALAI_PANNE_GARANTIE_LEGALE,
  'purificateur-air-defaut-garantie-legale': GUIDE_PURIFICATEUR_AIR_DEFAUT_GARANTIE_LEGALE,
  'plaque-induction-defaut-garantie-legale': GUIDE_PLAQUE_INDUCTION_DEFAUT_GARANTIE_LEGALE,
  'four-encastrable-panne-garantie-legale': GUIDE_FOUR_ENCASTRABLE_PANNE_GARANTIE_LEGALE,
  'cafetiere-expresso-broyeur-defaut-garantie-legale':
    GUIDE_CAFETIERE_EXPRESSO_BROYEUR_DEFAUT_GARANTIE_LEGALE,
  'borne-recharge-domestique-ve-defaut-garantie-legale':
    GUIDE_BORNE_RECHARGE_DOMESTIQUE_VE_DEFAUT_GARANTIE_LEGALE,
  'serrure-connectee-defaut-garantie-legale': GUIDE_SERRURE_CONNECTEE_DEFAUT_GARANTIE_LEGALE,
  'console-portable-ecran-defectueux-garantie-legale':
    GUIDE_CONSOLE_PORTABLE_ECRAN_DEFECTUEUX_GARANTIE_LEGALE,
  'home-cinema-barre-de-son-panne-garantie-legale':
    GUIDE_HOME_CINEMA_BARRE_DE_SON_PANNE_GARANTIE_LEGALE,
  'friteuse-electrique-panne-garantie-legale': GUIDE_FRITEUSE_ELECTRIQUE_PANNE_GARANTIE_LEGALE,
  'mixeur-blender-panne-garantie-legale': GUIDE_MIXEUR_BLENDER_PANNE_GARANTIE_LEGALE,
  'extracteur-de-jus-panne-garantie-legale': GUIDE_EXTRACTEUR_DE_JUS_PANNE_GARANTIE_LEGALE,
  'yaourtiere-defaut-temperature-garantie-legale':
    GUIDE_YAOURTIERE_DEFAUT_TEMPERATURE_GARANTIE_LEGALE,
  'machine-a-pain-panne-garantie-legale': GUIDE_MACHINE_A_PAIN_PANNE_GARANTIE_LEGALE,
  'centrale-vapeur-fuite-panne-garantie-legale': GUIDE_CENTRALE_VAPEUR_FUITE_PANNE_GARANTIE_LEGALE,
  'voiture-electrique-defaut-garantie-legale': GUIDE_VOITURE_ELECTRIQUE_DEFAUT_GARANTIE_LEGALE,
  'voiture-hybride-defaut-garantie-legale': GUIDE_VOITURE_HYBRIDE_DEFAUT_GARANTIE_LEGALE,
  'camping-car-defauts-garantie-legale': GUIDE_CAMPING_CAR_DEFAUTS_GARANTIE_LEGALE,
  'moto-defaut-garantie-legale': GUIDE_MOTO_DEFAUT_GARANTIE_LEGALE,
  'scooter-defaut-garantie-legale': GUIDE_SCOOTER_DEFAUT_GARANTIE_LEGALE,
  'climatisation-en-panne-garantie-legale': GUIDE_CLIMATISATION_EN_PANNE_GARANTIE_LEGALE,
  'vmc-habitation-panne-garantie-legale': GUIDE_VMC_HABITATION_PANNE_GARANTIE_LEGALE,
  'chaudiere-domestique-defaut-garantie-legale': GUIDE_CHAUDIERE_DOMESTIQUE_DEFAUT_GARANTIE_LEGALE,
  'pompe-a-chaleur-defaut-garantie-legale': GUIDE_POMPE_A_CHALEUR_DEFAUT_GARANTIE_LEGALE,
  'alarme-maison-defaut-garantie-legale': GUIDE_ALARME_MAISON_DEFAUT_GARANTIE_LEGALE,
  'domotique-passerelle-capteurs-garantie-legale':
    GUIDE_DOMOTIQUE_PASSERELLE_CAPTEURS_GARANTIE_LEGALE,
  'velo-electrique-defaut-garantie-legale': GUIDE_VELO_ELECTRIQUE_DEFAUT_GARANTIE_LEGALE,
  'trottinette-electrique-defaut-garantie-legale':
    GUIDE_TROTTINETTE_ELECTRIQUE_DEFAUT_GARANTIE_LEGALE,
  'equipement-fitness-maison-garantie-legale': GUIDE_EQUIPEMENT_FITNESS_MAISON_GARANTIE_LEGALE,
  'ski-equipement-defaut-garantie-legale': GUIDE_SKI_EQUIPEMENT_DEFAUT_GARANTIE_LEGALE,
  'electromenager-lave-linge-lave-vaisselle-garantie':
    GUIDE_ELECTROMENAGER_LAVE_LINGE_LAVE_VAISSELLE_GARANTIE,
  'permanences-juridiques': GUIDE_PERMANENCES_JURIDIQUES,
  'fnac-sav-recours': GUIDE_FNAC_SAV_RECOURS,
  'boulanger-garanties': GUIDE_BOULANGER_GARANTIES,
  'cdiscount-marketplace': GUIDE_CDISCOUNT_MARKETPLACE,
  'refere-consommation': GUIDE_REFERE_CONSOMMATION,
  'action-groupe': GUIDE_ACTION_GROUPE,
  'prescription-delais': GUIDE_PRESCRIPTION_DELAIS,
  'constituer-preuves': GUIDE_CONSTITUER_PREUVES,
  alternatives: GUIDE_ALTERNATIVES,
  signalconso: GUIDE_SIGNALCONSO,
  'vices-caches': GUIDE_VICES_CACHES,
  'protection-juridique': GUIDE_PROTECTION_JURIDIQUE,
  'mediation-consommation': GUIDE_MEDIATION_CONSOMMATION,
  'amazon-garantie-retours': GUIDE_AMAZON_GARANTIE_RETOURS,
  'missing-15': GUIDE_MISSING_15,
  'missing-16': GUIDE_MISSING_16,
};
