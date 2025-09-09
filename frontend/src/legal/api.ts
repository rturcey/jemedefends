// src/legal/api.ts
// API unifiée pour accès aux références légales
// Remplace lib/legal/index.ts - corrige les imports circulaires
// Mobile-first avec cache intelligent

import {
  type LegalArticleId,
  type LegalArticleDefinition,
  type LegalRegistry,
  LEGAL_ARTICLE_DEFINITIONS,
  LegalRegistryUtils,
} from './registry';

/**
 * Article enrichi avec toutes les données (métadonnées + contenu)
 */
interface EnrichedLegalArticle extends LegalArticleDefinition {
  readonly text: string;
  readonly lastVerified: string;
  readonly status: 'VIGUEUR' | 'ABROGE' | 'MODIFIE' | 'UNKNOWN';
  readonly isValid: boolean;
}

/**
 * Erreurs spécialisées
 */
class LegalApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = 'LegalApiError';
  }
}

class ArticleNotFoundError extends LegalApiError {
  constructor(articleId: LegalArticleId) {
    super(`Article ${articleId} non trouvé`, 'ARTICLE_NOT_FOUND');
  }
}

class RegistryNotLoadedError extends LegalApiError {
  constructor() {
    super("Registry non chargé. Appelez loadRegistry() d'abord", 'REGISTRY_NOT_LOADED');
  }
}

class ArticleInvalidError extends LegalApiError {
  constructor(articleId: LegalArticleId, reason: string) {
    super(`Article ${articleId} invalide: ${reason}`, 'ARTICLE_INVALID');
  }
}

/**
 * Options pour récupération d'articles
 */
export interface GetArticleOptions {
  strict?: boolean;
  validate?: boolean;
  includeAbrogated?: boolean;
  forceReload?: boolean;
}

/**
 * Cache intelligent pour optimisation mobile
 */
class LegalCache {
  private cache = new Map<LegalArticleId, EnrichedLegalArticle>();
  private loadTime = new Map<LegalArticleId, number>();
  private readonly TTL = 30 * 60 * 1000; // 30 min

  get(id: LegalArticleId): EnrichedLegalArticle | null {
    const cached = this.cache.get(id);
    if (!cached) return null;

    const t = this.loadTime.get(id) || 0;
    if (Date.now() - t > this.TTL) {
      this.cache.delete(id);
      this.loadTime.delete(id);
      return null;
    }
    return cached;
  }

  set(id: LegalArticleId, article: EnrichedLegalArticle): void {
    this.cache.set(id, article);
    this.loadTime.set(id, Date.now());
  }

  clear(): void {
    this.cache.clear();
    this.loadTime.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

/**
 * API principale - singleton
 */
class LegalAPI {
  private registry: LegalRegistry | null = null;
  private loadingPromise: Promise<void> | null = null;
  private cache = new LegalCache();

  /**
   * Charge le registry depuis le JSON généré
   * ⚡ Optimisé: import dynamique + cache
   */
  async loadRegistry(forceReload = false): Promise<void> {
    if (this.registry && !forceReload) return;
    if (this.loadingPromise && !forceReload) return this.loadingPromise;
    this.loadingPromise = this._loadRegistryInternal();
    return this.loadingPromise;
  }

  private async _loadRegistryInternal(): Promise<void> {
    try {
      // Import dynamique du JSON généré par le script Python
      const registryModule: any = await import('./registry.generated.json');
      const registryData = registryModule.default || registryModule;

      // Validation du registry
      if (!LegalRegistryUtils.validateRegistry(registryData)) {
        throw new LegalApiError('Registry invalide', 'INVALID_REGISTRY');
      }

      this.registry = registryData;
      this.cache.clear(); // Clear cache après reload
      console.log(
        `✅ Legal Registry chargé: ${this.registry.metadata.totalArticles} articles (${this.registry.metadata.coverage}% couverts)`,
      );
    } catch (error) {
      console.warn('⚠️ Registry non disponible, mode dégradé:', error);
      // Mode dégradé: registry minimal avec métadonnées seulement
      this.registry = this._createFallbackRegistry();
    } finally {
      this.loadingPromise = null;
    }
  }

  /**
   * Crée un registry minimal en mode dégradé
   */
  private _createFallbackRegistry(): LegalRegistry {
    const articles: Record<LegalArticleId, LegalArticleDefinition> = {};
    for (const [id, definition] of Object.entries(LEGAL_ARTICLE_DEFINITIONS)) {
      articles[id as LegalArticleId] = {
        ...definition,
        status: 'UNKNOWN',
        isValid: false, // Pas de texte en mode dégradé
      };
    }
    return {
      articles,
      metadata: LegalRegistryUtils.computeMetadata(articles),
    };
  }

  /**
   * Récupère un article avec toutes ses données
   */
  async getArticle(
    articleId: LegalArticleId,
    options: GetArticleOptions = {},
  ): Promise<EnrichedLegalArticle> {
    const {
      strict = true,
      validate = true,
      includeAbrogated = false,
      forceReload = false,
    } = options;

    await this.loadRegistry(forceReload);
    if (!this.registry) throw new RegistryNotLoadedError();

    if (!forceReload) {
      const cached = this.cache.get(articleId);
      if (cached) return cached;
    }

    const articleData = this.registry.articles[articleId];
    if (!articleData) throw new ArticleNotFoundError(articleId);

    if (strict && !articleData.text) {
      throw new ArticleInvalidError(
        articleId,
        'Aucun texte disponible. Lancez: cd frontend/tools && ./update_legal.sh',
      );
    }

    if (articleData.status === 'ABROGE' && !includeAbrogated) {
      throw new ArticleInvalidError(articleId, 'Article abrogé');
    }

    if (validate && articleData.text) {
      this._validateArticleText(articleId, articleData.text, articleData.status);
    }

    const enriched: EnrichedLegalArticle = {
      ...articleData,
      text: articleData.text || '',
      lastVerified: articleData.lastVerified || '',
      status: articleData.status,
      isValid: this._isArticleValid(articleData),
    };

    this.cache.set(articleId, enriched);
    return enriched;
  }

  /**
   * Version synchrone (pour SSR/composants)
   * ⚠️ Registry doit être déjà chargé
   */
  getArticleSync(
    articleId: LegalArticleId,
    options: GetArticleOptions = {},
  ): EnrichedLegalArticle | null {
    if (!this.registry) {
      console.warn(`Registry non chargé pour ${articleId}. Utilisez getArticle() en async`);
      return null;
    }

    const articleData = this.registry.articles[articleId];
    if (!articleData) return null;

    const { includeAbrogated = false } = options;
    if (articleData.status === 'ABROGE' && !includeAbrogated) return null;

    return {
      ...articleData,
      text: articleData.text || '',
      lastVerified: articleData.lastVerified || '',
      status: articleData.status,
      isValid: this._isArticleValid(articleData),
    };
  }

  /**
   * Récupère tous les articles d'un code donné
   */
  async getArticlesByCode(code: string): Promise<EnrichedLegalArticle[]> {
    await this.loadRegistry();
    if (!this.registry) throw new RegistryNotLoadedError();

    const articles: EnrichedLegalArticle[] = [];
    for (const [id, articleData] of Object.entries(this.registry.articles)) {
      if (articleData.code === code && this._isArticleValid(articleData)) {
        try {
          const enriched = await this.getArticle(id as LegalArticleId, { strict: false });
          if (enriched) articles.push(enriched);
        } catch {
          // ignore
        }
      }
    }

    return articles.sort((a, b) => {
      if (a.priority !== b.priority) return b.priority - a.priority;
      return a.id.localeCompare(b.id);
    });
  }

  /**
   * Statistiques du registry
   */
  getRegistryStats(): LegalRegistry['metadata'] | null {
    return this.registry?.metadata || null;
  }

  /**
   * Recherche d'articles par mot-clé (dans label + text)
   */
  async searchArticles(query: string): Promise<EnrichedLegalArticle[]> {
    await this.loadRegistry();
    if (!this.registry || !query.trim()) return [];

    const term = query.toLowerCase().trim();
    const results: EnrichedLegalArticle[] = [];

    for (const [id, articleData] of Object.entries(this.registry.articles)) {
      const matchLabel = articleData.label.toLowerCase().includes(term);
      const matchText = articleData.text?.toLowerCase().includes(term);
      const matchId = id.toLowerCase().includes(term);

      if ((matchLabel || matchText || matchId) && this._isArticleValid(articleData)) {
        try {
          const enriched = await this.getArticle(id as LegalArticleId, { strict: false });
          if (enriched) results.push(enriched);
        } catch {
          // ignore
        }
      }
    }

    return results.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Force le rechargement complet (pour admin/debug)
   */
  async reload(): Promise<void> {
    this.registry = null;
    this.cache.clear();
    await this.loadRegistry(true);
  }

  /**
   * Valide la cohérence d'un texte d'article
   */
  private _validateArticleText(
    articleId: LegalArticleId,
    text: string,
    status: LegalArticleDefinition['status'],
  ): void {
    if (text.length < 20) {
      throw new ArticleInvalidError(articleId, 'Texte trop court');
    }
    if (status === 'ABROGE') {
      const kw = ['abrogé', 'abrog', 'supprimé', 'caduc'];
      if (!kw.some(k => text.toLowerCase().includes(k))) {
        console.warn(`⚠️ Article ${articleId} marqué abrogé mais le texte ne le confirme pas`);
      }
    }
  }

  /**
   * Détermine si un article est valide pour utilisation
   */
  private _isArticleValid(articleData: LegalArticleDefinition): boolean {
    return !!(articleData.text && articleData.text.length > 20 && articleData.status !== 'ABROGE');
  }
}

// Singleton export
export const legalAPI = new LegalAPI();

// Export des types et utilitaires
export type { EnrichedLegalArticle, GetArticleOptions };
export { ArticleNotFoundError, RegistryNotLoadedError, ArticleInvalidError, LegalApiError };

/**
 * Wrappers **rétro-compatibles** (dépréciés)
 * Permettent de garder les anciens imports:
 *   import { getArticle, getArticleSync } from '@/legal/api'
 */
export async function getArticle(
  articleId: LegalArticleId,
  options: GetArticleOptions = {},
): Promise<EnrichedLegalArticle> {
  console.warn('[deprecated] import { getArticle } → utilisez legalAPI.getArticle()');
  return legalAPI.getArticle(articleId, options);
}

export function getArticleSync(
  articleId: LegalArticleId,
  options: GetArticleOptions = {},
): EnrichedLegalArticle | null {
  console.warn('[deprecated] import { getArticleSync } → utilisez legalAPI.getArticleSync()');
  return legalAPI.getArticleSync(articleId, options);
}
