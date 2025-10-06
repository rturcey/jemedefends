// ============================================================================
// ALGORITHME DE RECOMMANDATION DE GUIDES CONNEXES - buildRelatedGuidesSmart
// ============================================================================

import { yamlToGuidePage } from '@/lib/yaml-guide-converter';

// Types
interface RelatedGuideOptions {
  limit?: number;
  minScore?: number;
  preferSameCategory?: boolean;
  includeKeywords?: boolean;
  includeLegalArticles?: boolean;
}

interface GuideScore {
  slug: string;
  score: number;
  reasons: string[];
}

// Utilitaires de scoring
const CATEGORY_PATTERNS = {
  tech: ['smartphone-', 'ordinateur-', 'routeur-', 'casque-', 'ecouteurs-', 'tablette-'],
  auto: [
    'voiture-',
    'moto-',
    'velo-',
    'trottinette-',
    'autoradio-',
    'borne-recharge',
    'camping-car',
  ],
  home: [
    'lave-',
    'micro-ondes',
    'refrigerateur',
    'climatisation',
    'chaudiere',
    'pompe-',
    'alarme-',
    'domotique-',
  ],
  general: ['action-', 'mediation-', 'amazon-', 'fnac-', 'boulanger-', 'cdiscount-'],
};

/**
 * Détecte la catégorie d'un guide par son slug
 */
function detectCategoryFromSlug(slug: string): string {
  for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    if (patterns.some(pattern => slug.startsWith(pattern))) {
      return category;
    }
  }
  return 'general';
}

/**
 * Extrait les mots-clés d'un texte pour comparaison
 */
function extractKeywords(text: string): Set<string> {
  if (!text) return new Set();

  // Nettoyer et normaliser le texte
  const cleanText = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ') // Garder les tirets
    .replace(/\s+/g, ' ')
    .trim();

  // Mots à ignorer (stop words français)
  const stopWords = new Set([
    'le',
    'la',
    'les',
    'un',
    'une',
    'des',
    'du',
    'de',
    'et',
    'ou',
    'mais',
    'donc',
    'car',
    'que',
    'qui',
    'quoi',
    'dont',
    'où',
    'quand',
    'comment',
    'pourquoi',
    'ce',
    'cette',
    'ces',
    'cet',
    'son',
    'sa',
    'ses',
    'leur',
    'leurs',
    'je',
    'tu',
    'il',
    'elle',
    'nous',
    'vous',
    'ils',
    'elles',
    'avec',
    'sans',
    'pour',
    'par',
    'sur',
    'sous',
    'dans',
    'en',
    'à',
    'est',
    'sont',
    'être',
    'avoir',
    'faire',
    'aller',
    'venir',
    'très',
    'plus',
    'moins',
    'bien',
    'mal',
    'déjà',
    'encore',
    'toujours',
    'jamais',
  ]);

  // Extraire les mots de 3+ caractères
  const words = cleanText
    .split(/\s+/)
    .filter(word => word.length >= 3 && !stopWords.has(word))
    .filter(word => !/^\d+$/.test(word)); // Exclure les nombres purs

  return new Set(words);
}

/**
 * Calcule la similarité entre deux ensembles de mots-clés (Jaccard)
 */
function calculateKeywordSimilarity(keywords1: Set<string>, keywords2: Set<string>): number {
  if (keywords1.size === 0 && keywords2.size === 0) return 0;
  if (keywords1.size === 0 || keywords2.size === 0) return 0;

  const intersection = new Set([...keywords1].filter(word => keywords2.has(word)));
  const union = new Set([...keywords1, ...keywords2]);

  return intersection.size / union.size;
}

/**
 * Normalise un article légal (ex: "art. L 217-3" → "L.217-3")
 */
function normalizeLegalArticle(article: string): string {
  return article
    .replace(/^art\.?\s*/i, '')
    .replace(/\s+/g, '')
    .replace(/([LRD])\.?(\d+)-(\d+)/i, '$1.$2-$3')
    .toUpperCase();
}

/**
 * Calcule le score d'un guide candidat par rapport au guide de référence
 */
function calculateGuideScore(
  refSlug: string,
  refGuide: any,
  candidateSlug: string,
  candidateGuide: any,
  options: RelatedGuideOptions,
): GuideScore {
  const scores: { value: number; reason: string }[] = [];

  // 1. Score de catégorie (40% du poids total)
  const refCategory = detectCategoryFromSlug(refSlug);
  const candidateCategory = detectCategoryFromSlug(candidateSlug);

  if (refCategory === candidateCategory) {
    scores.push({ value: 0.4, reason: `Même catégorie (${refCategory})` });
  } else {
    scores.push({ value: 0, reason: 'Catégorie différente' });
  }

  // 2. Score des articles légaux en commun (25% du poids)
  if (
    options.includeLegalArticles !== false &&
    refGuide.legal?.mainArticles &&
    candidateGuide.legal?.mainArticles
  ) {
    const refArticles = new Set(refGuide.legal.mainArticles.map(normalizeLegalArticle));
    const candidateArticles = new Set(candidateGuide.legal.mainArticles.map(normalizeLegalArticle));

    const commonArticles = new Set(
      [...refArticles].filter(article => candidateArticles.has(article)),
    );

    if (commonArticles.size > 0) {
      const legalScore =
        Math.min(commonArticles.size / Math.max(refArticles.size, candidateArticles.size), 1) *
        0.25;
      scores.push({
        value: legalScore,
        reason: `${commonArticles.size} article(s) légal en commun`,
      });
    }
  }

  // 3. Score de similarité des mots-clés (20% du poids)
  if (options.includeKeywords !== false) {
    // Extraire mots-clés du titre, description et SEO keywords
    const refKeywords = new Set([
      ...extractKeywords(refGuide.metadata?.title || ''),
      ...extractKeywords(refGuide.metadata?.seo?.description || ''),
      ...(refGuide.metadata?.seo?.keywords || []).map((k: string) => k.toLowerCase()),
    ]);

    const candidateKeywords = new Set([
      ...extractKeywords(candidateGuide.metadata?.title || ''),
      ...extractKeywords(candidateGuide.metadata?.seo?.description || ''),
      ...(candidateGuide.metadata?.seo?.keywords || []).map((k: string) => k.toLowerCase()),
    ]);

    const keywordSimilarity = calculateKeywordSimilarity(refKeywords, candidateKeywords);
    if (keywordSimilarity > 0.1) {
      // Seuil minimum
      scores.push({
        value: keywordSimilarity * 0.2,
        reason: `Similarité mots-clés (${Math.round(keywordSimilarity * 100)}%)`,
      });
    }
  }

  // 4. Score de similarité des slugs (15% du poids)
  const refSlugWords = new Set(refSlug.split('-'));
  const candidateSlugWords = new Set(candidateSlug.split('-'));
  const slugSimilarity = calculateKeywordSimilarity(refSlugWords, candidateSlugWords);

  if (slugSimilarity > 0.2) {
    scores.push({
      value: slugSimilarity * 0.15,
      reason: `Slugs similaires (${Math.round(slugSimilarity * 100)}%)`,
    });
  }

  // Calculer le score total
  const totalScore = scores.reduce((sum, score) => sum + score.value, 0);
  const reasons = scores.filter(s => s.value > 0).map(s => s.reason);

  return {
    slug: candidateSlug,
    score: totalScore,
    reasons,
  };
}

/**
 * Fonction principale: trouve les guides les plus connexes
 */
export function buildRelatedGuidesSmart(
  refSlug: string,
  guideRegistry: Record<string, string>,
  options: RelatedGuideOptions = {},
): string[] {
  const {
    limit = 4,
    minScore = 0.06,
    preferSameCategory = true,
    includeKeywords = true,
    includeLegalArticles = true,
  } = options;

  try {
    // Récupérer le guide de référence
    const refYaml = guideRegistry[refSlug];
    if (!refYaml) {
      console.warn(`Guide de référence ${refSlug} non trouvé`);
      return [];
    }

    const refGuide = yamlToGuidePage(refYaml);
    if (!refGuide) {
      console.warn(`Impossible de parser le guide ${refSlug}`);
      return [];
    }

    // Analyser tous les autres guides
    const candidateScores: GuideScore[] = [];

    for (const [candidateSlug, candidateYaml] of Object.entries(guideRegistry)) {
      // Ignorer le guide de référence lui-même
      if (candidateSlug === refSlug) continue;

      try {
        const candidateGuide = yamlToGuidePage(candidateYaml);
        if (!candidateGuide) continue;

        const score = calculateGuideScore(refSlug, refGuide, candidateSlug, candidateGuide, {
          includeKeywords,
          includeLegalArticles,
          preferSameCategory,
        });

        if (score.score >= minScore) {
          candidateScores.push(score);
        }
      } catch (error) {
        console.warn(`Erreur analyse guide ${candidateSlug}:`, error);
      }
    }

    // Trier par score décroissant
    candidateScores.sort((a, b) => b.score - a.score);

    // Appliquer la préférence de catégorie si demandée
    if (preferSameCategory) {
      const refCategory = detectCategoryFromSlug(refSlug);
      const sameCategoryGuides = candidateScores.filter(
        guide => detectCategoryFromSlug(guide.slug) === refCategory,
      );
      const otherCategoryGuides = candidateScores.filter(
        guide => detectCategoryFromSlug(guide.slug) !== refCategory,
      );

      // Prioriser la même catégorie, mais inclure d'autres si pas assez
      const prioritizedGuides = [
        ...sameCategoryGuides.slice(0, Math.max(2, limit - 1)),
        ...otherCategoryGuides,
      ].slice(0, limit);

      return prioritizedGuides.map(guide => guide.slug);
    }

    // Retourner les top guides
    return candidateScores.slice(0, limit).map(guide => guide.slug);
  } catch (error) {
    console.error('Erreur buildRelatedGuidesSmart:', error);

    // Fallback: guides de même catégorie
    const refCategory = detectCategoryFromSlug(refSlug);
    return Object.keys(guideRegistry)
      .filter(slug => slug !== refSlug && detectCategoryFromSlug(slug) === refCategory)
      .slice(0, limit);
  }
}
