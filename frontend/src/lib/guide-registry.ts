// ============================================================================
// GUIDE REGISTRY - VERSION FINALE CORRIGÉE
// ============================================================================

// *** src/lib/guide-registry.ts - REMPLACE L'ORIGINAL ***

// Import du convertisseur corrigé (même fichier, sans dépendances circulaires)
import { yamlToGuidePage } from './yaml-guide-converter';
import { calculateReadingTime, getCategoryFromSlug } from './guide-utils';
import type { EnrichedGuide } from '@/types/guides';

type GuideMetaLite = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  categoryName: string;
  subcategory?: string; // si tu as cette notion
  readingTime?: number;
  lastUpdated?: number; // timestamp
  headings?: string[]; // titres de sections (extraits)
};

const FR_STOPWORDS = new Set([
  'le',
  'la',
  'les',
  'un',
  'une',
  'des',
  'de',
  'du',
  'au',
  'aux',
  'et',
  'ou',
  'à',
  'd’',
  "d'",
  'en',
  'dans',
  'pour',
  'avec',
  'par',
  'sur',
  'sous',
  'ce',
  'cet',
  'cette',
  'ces',
  'est',
  'sont',
  'être',
  'avoir',
  'plus',
  'moins',
  'très',
  'comme',
  'que',
  'qui',
  'quoi',
  'dont',
  'où',
  'ne',
  'pas',
  'plus',
  'sans',
  'entre',
  'chez',
  'vos',
  'nos',
  'vos',
  'vos',
  'vos',
  'votre',
  'notre',
  'leur',
  'leurs',
  'mon',
  'ma',
  'mes',
  'ton',
  'ta',
  'tes',
  'son',
  'sa',
  'ses',
]);

function normalizeTextToTokens(text: string): string[] {
  return (text || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // accents
    .replace(/[^a-z0-9\s\-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !FR_STOPWORDS.has(t));
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  return inter / (a.size + b.size - inter);
}

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0,
    na = 0,
    nb = 0;
  for (const [k, v] of a) {
    na += v * v;
    const bv = b.get(k) || 0;
    dot += v * bv;
  }
  for (const [, v] of b) nb += v * v;
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function tf(tokens: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const t of tokens) m.set(t, (m.get(t) || 0) + 1);
  return m;
}

function collectGuideMeta(slug: string, guide: any): GuideMetaLite {
  const title = guide?.metadata?.title || slug;
  const description = guide?.metadata?.seo?.description || '';
  const keywords: string[] = Array.isArray(guide?.metadata?.seo?.keywords)
    ? guide.metadata.seo.keywords
    : [];
  const categoryName = guide?.category?.name || 'Guides';
  const subcategory = guide?.category?.subcategory;
  const readingTime: number | undefined = guide?.readingTime;

  const lastUpdated = guide?.legal?.lastUpdated ? Date.parse(guide.legal.lastUpdated) : undefined;

  const headings: string[] = (guide?.sections ?? [])
    .map((s: any) => (typeof s?.title === 'string' ? s.title : ''))
    .filter(Boolean);

  return {
    slug,
    title,
    description,
    keywords,
    categoryName,
    subcategory,
    readingTime,
    lastUpdated,
    headings,
  };
}

function scorePair(a: GuideMetaLite, b: GuideMetaLite): number {
  // 1) Similarité texte (SEO keywords + title + description + headings)
  const aTokens = [
    ...a.keywords,
    ...normalizeTextToTokens(a.title),
    ...normalizeTextToTokens(a.description),
    ...(a.headings ?? []).flatMap(normalizeTextToTokens),
  ];
  const bTokens = [
    ...b.keywords,
    ...normalizeTextToTokens(b.title),
    ...normalizeTextToTokens(b.description),
    ...(b.headings ?? []).flatMap(normalizeTextToTokens),
  ];
  const aSet = new Set(aTokens);
  const bSet = new Set(bTokens);
  const textJac = jaccard(aSet, bSet);
  const textCos = cosineSimilarity(tf(aTokens), tf(bTokens));

  // 2) Catégorie / sous-catégorie
  const sameCategory = a.categoryName && a.categoryName === b.categoryName ? 1 : 0;
  const sameSub = a.subcategory && b.subcategory && a.subcategory === b.subcategory ? 1 : 0;

  // 3) Proximité de temps de lecture
  let readSim = 0;
  if (a.readingTime && b.readingTime) {
    const diff = Math.abs(a.readingTime - b.readingTime);
    readSim = Math.max(0, 1 - diff / 10); // 0..1 (10 min d’écart -> 0)
  }

  // 4) Fraîcheur
  let freshness = 0;
  if (a.lastUpdated && b.lastUpdated) {
    const ONE_YEAR = 365 * 24 * 3600 * 1000;
    const diff = Math.abs(a.lastUpdated - b.lastUpdated);
    freshness = Math.max(0, 1 - diff / ONE_YEAR); // 0..1 (≥1 an d’écart -> 0)
  }

  // Pondérations (ajuste à ton goût)
  const W = {
    textJac: 0.35,
    textCos: 0.25,
    sameCategory: 0.15,
    sameSub: 0.05,
    readSim: 0.08,
    freshness: 0.07,
  };

  return (
    W.textJac * textJac +
    W.textCos * textCos +
    W.sameCategory * sameCategory +
    W.sameSub * sameSub +
    W.readSim * readSim +
    W.freshness * freshness
  );
}

export function buildRelatedGuidesSmart(
  currentSlug: string,
  registry: Record<string, any>,
  opts?: { limit?: number; minScore?: number; preferSameCategory?: boolean },
): string[] {
  const limit = opts?.limit ?? 4;
  const minScore = opts?.minScore ?? 0.05;

  const currentGuide = registry[currentSlug];
  if (!currentGuide) return [];

  const currentMeta = collectGuideMeta(currentSlug, currentGuide);

  const candidates: { slug: string; score: number }[] = [];

  for (const [slug, guide] of Object.entries(registry)) {
    if (slug === currentSlug) continue;
    const meta = collectGuideMeta(slug, guide);

    // bonus léger si même catégorie pour booster les ex aequo
    let s = scorePair(currentMeta, meta);
    if (opts?.preferSameCategory && meta.categoryName === currentMeta.categoryName) {
      s += 0.02;
    }

    if (s >= minScore) candidates.push({ slug, score: s });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates.slice(0, limit).map(c => c.slug);
}

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
  description: "Le guide le plus complet : critères de conformité, présomption 24/12 mois, mise en conformité ≤ 30 jours, aucun frais, réduction/résolution (art. L.217-3 à L.217-20). Modèles, outils gratuits, LRAR en 1 clic, relance auto."
  keywords:
    - "garantie légale de conformité"
    - "garantie 2 ans France"
    - "présomption 24 mois 12 mois occasion"
    - "mise en conformité 30 jours"
    - " L.217-9 réparation remplacement"
    - " L.217-10 délai 30 jours"
    - " L.217-11 aucun frais valeur d'usage"
    - " L.217-14 réduction du prix résolution"
    - " L.217-19 mises à jour numériques"
    - "modèle mise en demeure gratuit"
    - "envoyer recommandé en ligne"
    - "droits consommateur France"
    - "vendeur refuse garantie légale"

legal:
  mainArticles: [" L.217-3", " L.217-5", " L.217-7", " L.217-8", " L.217-9", " L.217-10", " L.217-11", " L.217-12", " L.217-13", " L.217-14", " L.217-15", " L.217-16", " L.217-17", " L.217-19", " L.212-1"]
  disclaimer: true
  lastUpdated: "2025-09-16"

sections:
  - id: "intro"
    title: "Pourquoi ce guide peut vraiment vous aider"
    icon: "Search"
    type: "content"
    content: |
      Vous avez acheté un produit auprès d'un professionnel et un défaut apparaît, ou la réalité ne correspond pas à la fiche produit ? La **garantie légale de conformité** existe précisément pour cela. Elle oblige le **vendeur** (et non seulement le constructeur) à livrer un bien conforme à la description et à l'usage attendu. Concrètement, cela se traduit par une **mise en conformité** – **réparation** ou **remplacement** – dans un délai **raisonnable**, qui **ne peut pas dépasser 30 jours**, et **sans aucun frais** pour vous.
      
      Ce guide est conçu pour **clarifier l'essentiel**, **rentrer dans le détail** sans vous perdre, et **vous faire gagner du temps** : vous allez comprendre vos droits, savoir **quoi demander** et **comment l'obtenir**.

    alert:
      type: "info"
      title: "💡 Conseil pratique"
      content: "Ce guide couvre tous les aspects de la garantie légale de conformité. Vous pouvez naviguer directement vers la section qui vous intéresse ou le lire dans l'ordre pour une compréhension complète."

    badges:
      - text: "Guide officiel 2025"
        tone: "blue"
      - text: "Mis à jour"
        tone: "green"
      - text: "Juridiquement vérifié"
        tone: "purple"

    cta:
      label: "Tester mon éligibilité"
      href: "/eligibilite"
      icon: "ChevronRight"
      variant: "primary"

  - id: "definition"
    title: "Qu'est-ce que la garantie légale de conformité ?"
    icon: "BookOpen"
    type: "content"
    content: |
      La **garantie légale de conformité** est une protection automatique et gratuite qui s'applique à tous les achats auprès de professionnels en France. Elle vous protège contre les défauts de conformité pendant **2 ans** pour les biens neufs et **1 an** pour les biens d'occasion.

      ### Les critères de conformité L.217-5

      Un bien est considéré comme conforme s'il répond aux critères suivants :

      1. **Correspondance à la description** donnée par le vendeur
      2. **Aptitude à l'usage** habituellement attendu
      3. **Présentation des qualités** annoncées par le vendeur
      4. **Présentation des qualités** qu'un acheteur peut légitimement attendre

      ### Présomption de non-conformité
      Le vendeur a la charge de la preuve : dans les délais ci-dessous, c'est à lui d'apporter des preuves de la conformité du bien. Vous n'avez rien à prouver.
      - **24 mois** pour les biens neufs L.217-7
      - **12 mois** pour les biens d'occasion L.217-7

      Pendant cette période, si un défaut apparaît, il est **présumé** exister au moment de la vente. C'est au vendeur de prouver le contraire.

    alert:
      type: "success"
      title: "✅ Important à retenir"
      content: "Contrairement à la garantie commerciale, la garantie légale est **gratuite**, **automatique** et ne peut pas être refusée par le vendeur."

  - id: "droits"
    title: "Vos droits en cas de non-conformité"
    icon: "Scale"
    type: "timeline"
    content: |
      Lorsqu'un défaut de conformité est constaté, vous avez **le choix** entre deux solutions principales L.217-9 :

      ### Réparation ou remplacement (mise en conformité)

      **Conditions à respecter par le vendeur :**
      - **Délai raisonnable** qui ne peut **pas dépasser 30 jours** L.217-10
      - **Aucun frais** pour vous : ni main d'œuvre, ni pièces, ni transport L.217-11
      - **Aucune inconvénient majeur** pour vous L.217-11

      **Vous gardez le bien** pendant la réparation, sauf si son état ne le permet pas.

      ### Si la mise en conformité échoue

      Si la réparation/remplacement est **impossible**, **trop coûteuse** ou **échoue**, vous pouvez demander L.217-14 :

      - **Réduction du prix** proportionnelle au défaut
      - **Résolution de la vente** (remboursement) si le défaut est suffisamment grave

      ### Cas particuliers

      - **Biens numériques :** Droit aux mises à jour pendant la durée d'usage attendue L.217-19
      - **Valeur d'usage :** En cas de remboursement, le vendeur peut déduire la valeur d'usage L.217-11

    cta:
      label: "Créer ma lettre de mise en demeure"
      href: "/eligibilite"
      icon: "FileText"
      variant: "primary"

  - id: "procedure"
    title: "Comment faire valoir vos droits : la procédure complète"
    icon: "CheckSquare"
    type: "timeline"
    content: |
      ### Étape 1 : Rassembler les preuves

      **Documents indispensables :**
      - Facture ou preuve d'achat
      - Photos/vidéos du défaut
      - Correspondence avec le vendeur
      - Notice du produit ou fiche technique

      **Preuves complémentaires :**
      - Témoignages d'utilisation normale
      - Devis de réparation d'un professionnel
      - Documentation technique du constructeur

      ### Étape 2 : Première demande amiable

      - **Privilégier l'écrit :** Email ou courrier simple en recommandé
      - **Délai de réponse :** Laisser 15 jours ouvrés
      - **Ton :** Ferme mais courtois

      ### Étape 3 : Mise en demeure formelle

      Si le vendeur refuse ou ne répond pas :

      **Contenu obligatoire :**
      - Référence aux articles de loi L.217-9 L.217-10 L.217-11
      - Description précise du défaut
      - Demande claire (réparation/remplacement)
      - Délai de 30 jours maximum
      - Mention des conséquences en cas de refus

      **Envoi :** Lettre recommandée avec accusé de réception

      ### Étape 4 : Recours en cas d'échec

      - **Médiation de la consommation** (gratuite)
      - **Tribunal judiciaire** pour les litiges > 5 000 €
      - **Tribunal de proximité** pour les litiges ≤ 5 000 €

    alert:
      type: "warning"
      title: "⚠️ Attention aux délais"
      content: "La garantie légale s'exerce dans un délai de **2 ans** (1 an pour l'occasion) à compter de la délivrance du bien. Ne tardez pas à agir !"

  - id: "outils"
    title: "Nos outils pour vous accompagner"
    icon: "Wrench"
    type: "content"
    content: |
      ### Test d'éligibilité gratuit

      En quelques questions, déterminez si votre situation relève de la garantie légale de conformité et identifiez la meilleure stratégie.

      ### Générateur de lettres automatique

      - **Version gratuite :** Lettre type à personnaliser et imprimer
      - **Version pro :** PDF professionnel signé en ligne et prêt à imprimer
      - **Version premium :** PDF professionnel + envoi en LRAR + suivi

      ### Suivi de votre dossier

      Relances automatiques, et des guides adaptés pour la suite.

    cta:
      label: "Commencer maintenant"
      href: "/eligibilite"
      icon: "ArrowRight"
      variant: "primary"

  - id: "conclusion"
    title: "En résumé : ce qu'il faut retenir"
    icon: "CheckCircle"
    type: "content"
    content: |
      La garantie légale de conformité est **votre droit le plus puissant** face aux défauts de produits achetés chez des professionnels.

      **Les points clés à retenir :**

      - **2 ans de protection** (1 an pour l'occasion)  
      - **Présomption automatique** pendant 24/12 mois 
      - **Mise en conformité gratuite** en moins de 30 jours  
      - **Aucun frais** à votre charge  
      - **Choix** entre réparation et remplacement  
      - **Recours** en cas d'échec (réduction/remboursement)

      **Notre valeur ajoutée :**

      Plutôt que de vous lancer seul dans une procédure complexe, nos outils transforment vos droits en **démarches concrètes** : diagnostic immédiat, lettre juridiquement solide, envoi sécurisé et suivi jusqu'à la résolution.
      
      Résultat : vous gagnez du temps, vous sécurisez vos droits, et vous maximisez vos chances d'une solution **rapide** et **conforme à la loi**.

    alert:
      type: "success"
      title: "🚀 Prêt à agir ?"
      content: "Votre situation nécessite une action ? Utilisez nos outils pour transformer vos droits en résultats concrets."

    cta:
      label: "Tester mon éligibilité gratuitement"
      href: "/eligibilite"
      icon: "Zap"
      variant: "primary"
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
    // Convertir YAML → GuidePage avec le convertisseur corrigé
    const guide = yamlToGuidePage(yamlContent);

    // ✅ Vérification que guide est valide
    if (!guide || !guide.metadata || !guide.sections || !guide.legal) {
      console.error(`Guide ${slug} invalide après conversion YAML`);
      return null;
    }

    // Vérification spécifique pour legal.mainArticles
    if (!guide.legal.mainArticles) {
      console.error(`Guide ${slug} - legal.mainArticles manquant`);
      return null;
    }

    // Enrichir avec métadonnées calculées
    const enrichedGuide: EnrichedGuide = {
      ...guide, // GuidePage contient metadata, sections, legal
      slug,
      readingTime: calculateReadingTime(guide),
      category: getCategoryFromSlug(slug),
      relatedGuides: [] as string[], // ✅ Type explicite pour éviter any[]
    };

    try {
      enrichedGuide.relatedGuides = buildRelatedGuidesSmart(
        slug,
        GUIDE_YAML_REGISTRY, // ton registre YAML/chargé
        { limit: 4, minScore: 0.06, preferSameCategory: true },
      );
    } catch {
      // fallback très simple si besoin
      enrichedGuide.relatedGuides = Object.keys(GUIDE_YAML_REGISTRY)
        .filter(s => s !== slug && getCategoryFromSlug(s).name === enrichedGuide.category.name)
        .slice(0, 3);
    }

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
