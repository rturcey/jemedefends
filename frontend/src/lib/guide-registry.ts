import { yamlToGuidePage } from './yaml-guide-converter';
import { calculateReadingTime, calculateDifficulty, getCategoryFromSlug } from './guide-utils'; // ✅ Import depuis guide-utils
import type { EnrichedGuide } from '@/types/guides';

// Cache des guides convertis
const GUIDE_CACHE = new Map<string, EnrichedGuide>();

// YAML Registry - Source de vérité
const GUIDE_YAML_REGISTRY: Record<string, string> = {
  'garantie-legale-conformite-guide-complet': `
title: "Garantie légale de conformité : le guide de référence 2025"
description: "Comprendre et activer vos droits : 2 ans de protection (24 mois neuf / 12 mois occasion pour la présomption), mise en conformité ≤ 30 jours, 0 € de frais, réparations/remplacement, réduction du prix ou résolution. Outils gratuits + LRAR en 1 clic."
category: "general"
slug: "garantie-legale-conformite-guide-complet"

seo:
  title: "Garantie légale de conformité 2025 (France) : droits, délais 30 jours, modèles et procédure (Guide complet)"
  description: "Le guide le plus complet : critères de conformité, présomption 24/12 mois, mise en conformité ≤ 30 jours, aucun frais, réduction/résolution (L.217-3 à L.217-20). Modèles, outils gratuits, LRAR en 1 clic, relance auto."
  keywords:
    - "garantie légale de conformité"
    - "garantie 2 ans France"
    - "présomption 24 mois 12 mois occasion"
    - "mise en conformité 30 jours"
    - "L.217-9 réparation remplacement"
    - "L.217-10 délai 30 jours"
    - "L.217-11 aucun frais valeur d’usage"
    - "L.217-14 réduction du prix résolution"
    - "L.217-19 mises à jour numériques"
    - "modèle mise en demeure gratuit"
    - "envoyer recommandé en ligne"
    - "droits consommateur France"
    - "vendeur refuse garantie légale"

legal:
  mainArticles: ["L.217-3", "L.217-5", "L.217-7", "L.217-8", "L.217-9", "L.217-10", "L.217-11", "L.217-12", "L.217-13", "L.217-14", "L.217-15", "L.217-16", "L.217-17", "L.217-19", "L.212-1"]
  disclaimer: true
  lastUpdated: "2025-09-16"

sections:
  - id: "intro"
    title: "Pourquoi ce guide peut vraiment vous aider"
    icon: "Search"
    type: "content"
    content: |
      Vous avez acheté un produit auprès d’un professionnel et un défaut apparaît, ou la réalité ne correspond pas à la fiche produit ? La **garantie légale de conformité** existe précisément pour cela. Elle oblige le **vendeur** (et non seulement le constructeur) à livrer un bien conforme à la description et à l’usage attendu. Concrètement, cela se traduit par une **mise en conformité** – **réparation** ou **remplacement** – dans un délai **raisonnable**, qui **ne peut pas dépasser 30 jours**, et **sans aucun frais** pour vous.
      
      Ce guide est conçu pour **clarifier l’essentiel**, **rentrer dans le détail** sans vous perdre, et **vous faire gagner du temps** : vous allez comprendre vos droits, savoir **quoi demander** et **comment l’obtenir**. Et si vous souhaitez aller plus vite, nos outils (test d’éligibilité, lettre auto, LRAR en 1 clic, relance) vous permettent d’agir **en quelques minutes**.

  - id: "promo-services"
    title: "Agir sereinement, sans rédaction ni paperasse"
    icon: "Sparkles"
    type: "content"
    content: |
      Nous avons simplifié la démarche pour vous concentrer sur l’essentiel : **obtenir la mise en conformité**.
      
      D’abord, un **test d’éligibilité** vous confirme en moins de 20 secondes si la garantie légale s’applique à votre cas et **quelle demande formuler** (réparation ou remplacement). Ensuite, notre IA **rédige automatiquement** un **courrier juridiquement valable**, clair et argumenté à partir de vos informations (pas besoin d’écrire).
      
      Au choix, vous **téléchargez** la lettre gratuite (mise en demeure **incluse** en version non mise en page premium mais complète juridiquement, avec reformulation) ou vous l’**envoyez en recommandé** en **1 clic**, avec **numéro de suivi** et preuve de dépôt. Si le vendeur tarde, nous déclenchons une **relance automatique**. Enfin, vous recevez un **plan d’action personnalisé** pour la suite (que faire si c’est un succès, ou comment escalader si ça bloque).
    cta:
      label: "Tester mon éligibilité — 20 s"
      href: "/eligibilite"
      icon: "ChevronRight"
      variant: "primary"

  - id: "fondamentaux"
    title: "Le cadre légal, sans jargon"
    icon: "BookOpenCheck"
    type: "content"
    content: |
      L’idée centrale est simple : **vous choisissez d’abord** entre **réparation** et **remplacement**. Le vendeur ne peut écarter votre choix qu’en cas d’**impossibilité** ou de **coût disproportionné** par rapport à l’autre solution. S’il s’engage, la mise en conformité doit être **sans inconvénient majeur** et réalisée **dans les 30 jours** au maximum. 
      
      Ce cadre est **d’ordre public** : des frais de diagnostic, de transport ou une “déduction de valeur d’usage” **ne peuvent pas** vous être imposés. Si la mise en conformité **échoue**, **retarde**, **coûte** ou **vous complique la vie**, vous avez droit à la **réduction du prix** ou à la **résolution** (remboursement). Enfin, pour les biens d’occasion, la **présomption** joue **12 mois** ; pour les biens neufs, **24 mois** : dans ces délais, le défaut est **présumé** exister dès la délivrance, ce qui facilite vos démarches.
      
      Retenez ce cap : **rapide, sans frais, et orienté résultat**. Si le cap n’est pas tenu, on enclenche les **leviers** qui suivent.

  - id: "perimetre"
    title: "Suis-je concerné(e) ?"
    icon: "ShieldCheck"
    type: "content"
    content: |
      La garantie légale de conformité couvre les achats de **biens** (neufs ou **d’occasion**) effectués auprès d’un **vendeur professionnel** : magasin, e-commerce, marketplace avec vendeur pro. Les biens comportant des **éléments numériques** sont inclus (smartphone, TV connectée, objets connectés). 
      
      En revanche, les ventes **entre particuliers**, **aux enchères publiques** ou par **autorité de justice**, et l’**usage exclusivement professionnel** échappent à ce régime (d’autres voies peuvent exister, notamment la **garantie des vices cachés** du Code civil).
    cta:
      label: "Vérifier mon éligibilité — 20 s, sans email"
      href: "/eligibilite"
      icon: "ChevronRight"
      variant: "primary"

  - id: "criteres"
    title: "Quand un bien est-il « conforme » ?"
    icon: "ClipboardCheck"
    type: "content"
    content: |
      Un bien est **conforme** s’il correspond à la **description** et aux **qualités convenues**, s’il est **apte à l’usage attendu**, et s’il est livré avec les **accessoires**, **instructions** et **mises à jour** nécessaires. En pratique, on parle de **défaut de conformité** lorsqu’il existe un **écart clair** entre ce qui était promis et ce que vous recevez ou constatez à l’usage (ex. performance, autonomie, fonctionnalités, sécurité logicielle).
      
      À noter : vous ne pouvez pas contester un écart **dont vous avez été informé séparément et auquel vous avez **expressément** consenti lors de l’achat**. Cette règle empêche d’invoquer après coup une limite prévue et acceptée (ex. spécification technique moindre explicitement signalée).

  - id: "preuve"
    title: "Constituer un dossier simple et convaincant"
    icon: "Files"
    type: "content"
    content: |
      Pas besoin d’expertise : rassemblez d’abord la **preuve d’achat** (facture, relevé bancaire, mail de confirmation), puis des **photos/vidéos** du défaut, une **copie de la fiche produit**, des **CGV**, et vos **échanges** avec le vendeur/SAV. 
      
      La loi vous aide sur la charge de la preuve : si le défaut apparaît dans les **24 mois** (neuf) ou **12 mois** (occasion), il est **présumé** exister dès la délivrance. Le vendeur peut combattre cette présomption, mais c’est **à lui** de le faire. Votre dossier doit donc rendre **l’évidence visible** : ce qui était promis vs ce que vous avez.

  - id: "mise-en-conformite"
    title: "Mise en conformité : comment cela doit se passer"
    icon: "Hammer"
    type: "content"
    content: |
      **Votre choix** ouvre la marche : **réparation** ou **remplacement**. Dès votre demande, le vendeur organise l’intervention. La **réparation/remplacement** inclut, si nécessaire, l’**enlèvement** et la **reprise** du bien, ainsi que son **installation/réinstallation**. Tout doit se dérouler **sans inconvénient majeur** pour vous, **dans un délai raisonnable qui ne peut excéder 30 jours**.
      
      Côté finances, tout est **à la charge du vendeur** : pièces, main-d’œuvre, transport, enlèvement, réinstallation. Vous **n’avez rien à payer**, et aucune **déduction pour “valeur d’usage”** ne peut être opérée. Si le vendeur **refuse**, **retarde**, **fait peser des coûts** sur vous, ou si la mise en conformité **échoue**, vous êtes fondé(e) à demander la **réduction du prix** ou la **résolution**.
      
      Deux points souvent mal compris :
      1) **Impossibilité/Disproportion** : le vendeur peut écarter l’option que vous avez choisie seulement si elle est **impossible** (ex. pièce introuvable) ou **disproportionnée** (coût exorbitant par rapport à l’autre solution) — et il doit pouvoir **motiver** ce choix.  
      2) **Après-réparation/remplacement** : une **réparation** prolonge la garantie légale de **6 mois** ; si vous aviez **choisi la réparation** mais que le vendeur vous **impose un remplacement**, la garantie légale **redémarre pour 2 ans** à la **livraison du bien neuf**.

  - id: "solutions-si-echec"
    title: "Réduction du prix ou résolution : quand et comment"
    icon: "Scales"
    type: "content"
    content: |
      Quand la mise en conformité **n’aboutit pas** (refus, échec, dépassement du délai de **30 jours**, inconvénient majeur, frais indus), la loi vous ouvre deux sorties :
      
      **Réduction du prix** : elle est **proportionnelle** à l’écart de valeur entre le bien délivré (avec défaut) et le bien conforme. C’est utile quand vous voulez garder le bien malgré tout.  
      **Résolution (remboursement)** : vous rendez le bien (aux **frais du vendeur**) et vous êtes **remboursé**. Elle peut être **immédiate si le défaut est grave**, sans passer par l’étape réparation/remplacement. En revanche, la résolution n’est pas accordée si le **défaut est mineur** (au vendeur d’en apporter la preuve).
      
      En pratique : annoncez **par écrit** votre choix (réduction ou résolution), joignez vos preuves, et rappelez les **articles** correspondants. En cas de résolution, le remboursement intervient **sous 14 jours** à compter de la **réception** du bien ou de la **preuve d’expédition**.

  - id: "suspension-paiement"
    title: "Astuce légale : suspendre le paiement dans certains cas"
    icon: "Handshake"
    type: "content"
    content: |
      La loi prévoit la possibilité de **suspendre le paiement** de tout ou partie du prix tant que le vendeur n’a pas satisfait à ses obligations de mise en conformité, dans les conditions prévues par le Code civil. C’est un **levier** à manier avec sérieux : on s’en sert lorsque l’inexécution du vendeur est manifeste et que la suspension est **proportionnée** (ex. acompte à venir alors que la non-conformité est documentée et reconnue).
      
      Gardez à l’esprit que ce n’est pas un “droit de blocage illimité” : on **documente** le défaut, on **formalise** les demandes, on **met en demeure**, et seulement en cas d’inertie persistante on invoque ce mécanisme.

  - id: "numerique"
    title: "Biens avec éléments numériques : les mises à jour obligatoires"
    icon: "Cpu"
    type: "content"
    content: |
      Pour les biens connectés (smartphone, téléviseur, objets), la conformité inclut la fourniture des **mises à jour nécessaires** – y compris de **sécurité** – pendant la période à laquelle on peut **légitimement s’attendre**, selon le type de produit, sa finalité et le contrat. 
      
      Si des mises à jour essentielles ne sont pas fournies (ou si une mise à jour altère vos usages et que vos droits d’information/choix ne sont pas respectés), il peut s’agir d’un **défaut de conformité**. Mentionnez-le **clairement** dans votre courrier : pour certains dossiers, c’est **le point décisif**.

  - id: "eligibilite-check"
    title: "Êtes-vous couvert ?"
    icon: "UserCheck"
    type: "grid"
    content: |
      Un dernier coup d’œil avant d’agir : vérifiez votre éligibilité, cela vous évitera les allers-retours inutiles.
    items:
      - title: "Oui, a priori"
        description: "Achat auprès d’un **professionnel** • Défaut apparu dans les **2 ans** • Usage **personnel** ou **mixte** • Occasion couverte (présomption **12 mois**)"
      - title: "Non, plutôt"
        description: "Achat **entre particuliers** • **Usage pro exclusif** • Enchères publiques/autorité de justice → explorez la **garantie des vices cachés**"
    cta:
      label: "Vérifier mon éligibilité — 20 s, sans email"
      href: "/eligibilite"
      icon: "ChevronRight"
      variant: "primary"

  - id: "procedure"
    title: "Procédure pas à pas (et pourquoi chaque étape compte)"
    icon: "ListChecks"
    type: "timeline"
    content: |
      On commence **simple** (échange amiable), puis on **formalise** (mise en demeure), enfin on **escalade** (médiation, signalement, saisine). Chaque étape resserre l’exigence juridique tout en laissant une porte à l’amiable.
    steps:
      - title: "Préparez un dossier lisible"
        description: |
          Preuve d’achat (facture, mail, relevé bancaire), **photos/vidéos** du défaut, **fiche produit**, **CGV**, **échanges**. Objectif : rendre l’écart **évident**. Base légale : conformité (L.217-5), présomption (L.217-7).
        duration: "10 min"
        legalRef: "L.217-5"
      - title: "Contact amiable (clair et courtois)"
        description: |
          Écrivez au vendeur/SAV en invoquant la **garantie légale**. **Choisissez** réparation **ou** remplacement ; rappelez **≤ 30 jours**, **sans frais**, **sans inconvénient majeur**. Objectif : **poser le cadre** et laisser la solution s’organiser rapidement.
        duration: "1 jour"
        legalRef: "L.217-9"
      - title: "Mise en demeure (si ça patine)"
        description: |
          LRAR : **délai ferme (15 jours)** pour exécuter, faute de quoi vous demanderez **réduction du prix** ou **résolution**. Objectif : **sécuriser** votre position et enclencher les **leviers** légaux.
        duration: "15 jours"
        legalRef: "L.217-14"

  - id: "pieges"
    title: "Les pièges à éviter (vraiment)"
    icon: "AlertOctagon"
    type: "content"
    content: |
      • **Ne signez pas** de renonciation globale ou de “protocole” flou. Tant que la mise en conformité n’est pas aboutie, gardez la main. Et même après, n’acceptez pas d’être privé(e) de tout recours pour un **défaut distinct** qui apparaîtrait plus tard.  
      • **N’avancez aucun frais** : ni diagnostic, ni transport, ni réinstallation, ni “valeur d’usage”.  
      • **Refusez** les conditions abusives (ex. emballage d’origine imposé, déplacements à vos frais) : la solution doit être **sans inconvénient majeur** et **prise en charge** par le vendeur.  
      • **Ne vous limitez pas au constructeur** : votre **interlocuteur légal est le vendeur**.  
      • **Numérique** : si des mises à jour manquent ou cassent des fonctions sans respecter vos droits d’info/choix, **signalez-le** : c’est souvent **le déclic**.

  - id: "cas-pratiques"
    title: "Exemples concrets (pour vous situer rapidement)"
    icon: "Lightbulb"
    type: "content"
    content: |
      **Smartphone** : autonomie qui s’effondre alors que la fiche produit promettait l’inverse ; mises à jour de sécurité absentes. → Conformité (L.217-5) + mises à jour (L.217-19). Demande : réparation/remplacement ; au-delà de 30 jours ou si échec : réduction/résolution.  
      **Ordinateur portable** : composant livré différent/moins performant que la fiche. → Écart de description (L.217-5). Demande : remplacement conforme. En cas d’inefficacité : résolution.  
      **Lave-linge** : pannes récurrentes, indisponibilité prolongée. → Réparation **sans frais** ; si échec/retard : réduction/résolution.  
      **Occasion** (pro) : panne à 8 mois. → **Présomption 12 mois** : au vendeur de prouver l’absence de défaut à la délivrance.

  - id: "modeles"
    title: "Modèles & envoi recommandé (optionnel, en 1 clic)"
    icon: "Mail"
    type: "content"
    content: |
      Nous fournissons gratuitement une **mise en demeure** (texte brut) **complète juridiquement**, avec **reformulation automatique**. Vous pouvez aussi **envoyer le recommandé** en **un clic** (LRAR, suivi, preuve de dépôt). Si pas de réponse ou si c’est à côté du sujet, nous générons une **relance** structurée dans les bons délais. 
    cta:
      label: "Générer ma lettre maintenant"
      href: "/commencer"
      icon: "Send"
      variant: "primary"

  - id: "faq"
    title: "Questions fréquentes (le vrai utile)"
    icon: "HelpCircle"
    type: "faq"
    faqItems:
      - q: "Dois-je passer par le constructeur ?"
        a: "Non. L’obligation légale pèse d’abord sur le **vendeur**. Le constructeur peut aider, mais cela n’éteint jamais les obligations du vendeur."
      - q: "Le vendeur peut-il me faire payer quelque chose ?"
        a: "Non : **0 €**. Ni transport, ni diagnostic, ni réinstallation, ni “valeur d’usage”."
      - q: "Réparation ou remplacement : qui décide ?"
        a: "Vous choisissez. Le vendeur ne peut écarter votre choix qu’en cas d’**impossibilité** ou de **coût disproportionné** par rapport à l’autre solution."
      - q: "Combien de temps cela doit-il prendre ?"
        a: "La mise en conformité doit intervenir **dans un délai raisonnable** qui ne peut **dépasser 30 jours**, et **sans inconvénient majeur**."
      - q: "Et si ça n’aboutit pas ?"
        a: "Vous pouvez demander **réduction du prix** ou **résolution** (remboursement). La réduction est **proportionnelle** ; la résolution est **exclue** pour un défaut **mineur**."
      - q: "Que se passe-t-il après une réparation/remplacement ?"
        a: "La **réparation** prolonge la garantie légale de **6 mois**. Si vous aviez **choisi la réparation** mais qu’un **remplacement** est imposé, la garantie **redémarre pour 2 ans** à la livraison du bien de remplacement."
      - q: "Biens connectés : quid des mises à jour ?"
        a: "Les **mises à jour nécessaires** doivent être fournies pendant la période à laquelle on peut légitimement s’attendre. Leur défaut peut caractériser une **non-conformité**."
      - q: "Puis-je suspendre un paiement ?"
        a: "Dans certaines situations, oui, en s’appuyant sur les règles de **suspension** prévues par le Code civil lorsque le vendeur n’exécute pas ses obligations. À manier avec prudence et preuves."

  - id: "contacts"
    title: "Contacts utiles"
    icon: "Phone"
    type: "contacts"
    contacts:
      - name: "DGCCRF – SignalConso"
        url: "https://signal.conso.gouv.fr"
      - name: "Médiation de la consommation"
        url: "https://www.economie.gouv.fr/mediation-conso"
      - name: "Associations de consommateurs"
        url: "https://www.quechoisir.org"
      - name: "Service-Public.fr – Garantie légale"
        url: "https://www.service-public.fr/particuliers/vosdroits/F11094"

  - id: "conclusion"
    title: "L’essentiel à garder en tête"
    icon: "PenLine"
    type: "content"
    content: |
      Votre objectif ne change jamais : **obtenir gratuitement une mise en conformité efficace** (**réparation** ou **remplacement**) **dans les 30 jours**, **sans inconvénient majeur**. Si ce cap n’est pas tenu, utilisez calmement les leviers de **réduction du prix** ou de **résolution**, par écrit, avec preuves à l’appui. 
      
      Nos outils traduisent ce cadre en **parcours clair et rapide** : **test d’éligibilité** immédiat, **lettre automatique** juridiquement solide, **LRAR en 1 clic**, **relance** si nécessaire et **mise en demeure gratuite**. Résultat : vous gagnez du temps, vous sécurisez vos droits, et vous maximisez vos chances d’une solution **rapide** et **conforme à la loi**.
`,

  // Autres guides YAML ici...
};

/**
 * API principale - Récupère un guide enrichi par slug
 */
export function getFullGuide(slug: string): EnrichedGuide | null {
  // Cache
  if (GUIDE_CACHE.has(slug)) {
    return GUIDE_CACHE.get(slug)!;
  }

  // Récupérer YAML
  const yamlContent = GUIDE_YAML_REGISTRY[slug];
  if (!yamlContent) {
    console.warn(`Guide ${slug} non trouvé`);
    return null;
  }

  try {
    // Convertir YAML → GuidePage
    const guide = yamlToGuidePage(yamlContent);

    // ✅ Vérification que guide est valide
    if (!guide || !guide.metadata || !guide.sections || !guide.legal) {
      console.error(`Guide ${slug} invalide après conversion YAML`);
      return null;
    }

    // Enrichir avec métadonnées calculées
    const enrichedGuide: EnrichedGuide = {
      ...guide, // GuidePage contient metadata, sections, legal
      slug,
      readingTime: calculateReadingTime(guide),
      difficulty: calculateDifficulty(guide),
      category: getCategoryFromSlug(slug),
      relatedGuides: [] as string[], // ✅ Type explicite pour éviter any[]
    };

    // Cache
    GUIDE_CACHE.set(slug, enrichedGuide);
    return enrichedGuide;
  } catch (error) {
    console.error(`Erreur chargement guide ${slug}:`, error);
    return null;
  }
}

/**
 * Récupère tous les guides
 */
export function getAllGuides(): Record<string, EnrichedGuide> {
  const guides: Record<string, EnrichedGuide> = {};

  Object.keys(GUIDE_YAML_REGISTRY).forEach(slug => {
    const guide = getFullGuide(slug);
    if (guide) guides[slug] = guide;
  });

  return guides;
}

/**
 * Ajoute un guide YAML au registry (pour tests/dev)
 */
export function addGuideYAML(slug: string, yamlContent: string): void {
  GUIDE_YAML_REGISTRY[slug] = yamlContent;
  GUIDE_CACHE.delete(slug); // Invalider cache
}

export function getOriginalYAMLForSlug(slug: string): string | null {
  return GUIDE_YAML_REGISTRY[slug] || null;
}

/**
 * Liste tous les slugs disponibles
 */
export function getAllGuideSlugs(): string[] {
  return Object.keys(GUIDE_YAML_REGISTRY);
}

// Export des overrides dev (si fichier existe)
let DEV_OVERRIDES_CACHE: Record<string, string> = {};

/**
 * Charge un guide en tenant compte des overrides dev
 */
export function getGuideYAML(slug: string): string | null {
  // En développement, vérifier les overrides d'abord
  if (process.env.NODE_ENV === 'development' && DEV_OVERRIDES_CACHE[slug]) {
    return DEV_OVERRIDES_CACHE[slug];
  }

  return getOriginalYAMLForSlug(slug);
}
