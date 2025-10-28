// src/legal/hooks.ts
// Hooks React pour consommation facile des références légales
// Mobile-first, performance optimisée, SSR-friendly

import {useState, useEffect, useCallback, useMemo} from 'react';

import {legalAPI, type EnrichedLegalArticle, type GetArticleOptions} from './api';
import {type LegalArticleId, type LegalRegistry} from './registry';

/**
 * État d'un article
 */
interface ArticleState {
    article: EnrichedLegalArticle | null;
    loading: boolean;
    error: Error | null;
}

/**
 * Hook principal pour récupérer un article
 * ✨ Optimisé mobile: cache, lazy loading, fallback gracieux
 */
export function useLegalArticle(
    articleId: LegalArticleId | null,
    options: GetArticleOptions & {
        immediate?: boolean;
        autoRetry?: boolean;
        retryDelay?: number;
    } = {},
) {
    const {
        immediate = false,
        autoRetry = true,
        retryDelay = 2000,
        strict,
        validate,
        includeAbrogated,
        forceReload,
    } = options;

    const stableGetOptions = useMemo<GetArticleOptions>(
        () => ({
            ...(strict !== undefined ? {strict} : {}),
            ...(validate !== undefined ? {validate} : {}),
            ...(includeAbrogated !== undefined ? {includeAbrogated} : {}),
            ...(forceReload !== undefined ? {forceReload} : {}),
        }),
        [strict, validate, includeAbrogated, forceReload],
    );

    const [state, setState] = useState<ArticleState>({
        article: null,
        loading: immediate && !!articleId,
        error: null,
    });

    const [retryCount, setRetryCount] = useState(0);

    // Fonction de chargement avec gestion d'erreur améliorée
    const loadArticle = useCallback(async () => {
        if (!articleId) {
            setState({article: null, loading: false, error: null});
            return;
        }

        setState(prev => ({...prev, loading: true, error: null}));

        try {
            const article = await legalAPI.getArticle(articleId, stableGetOptions);
            setState({article, loading: false, error: null});
            setRetryCount(0);
        } catch (error) {
            const err = error instanceof Error ? error : new Error('Erreur de chargement');

            // Log pour debug mais pas d'erreur bloquante
            console.warn(`Impossible de charger l'article ${articleId}:`, err.message);

            setState({article: null, loading: false, error: err});

            // Retry automatique si activé et pas trop de tentatives
            if (autoRetry && retryCount < 3) {
                setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                    loadArticle();
                }, retryDelay);
            }
        }
    }, [articleId, stableGetOptions, retryCount, autoRetry, retryDelay]);

    // Chargement initial ou reload
    useEffect(() => {
        if (immediate && articleId) {
            loadArticle();
        }
    }, [immediate, articleId, loadArticle]);

    return {
        article: state.article,
        loading: state.loading,
        error: state.error,
        load: loadArticle,
        retry: () => {
            setRetryCount(0);
            loadArticle();
        },
    };
}

/**
 * Hook pour récupérer plusieurs articles à la fois
 * 🚀 Optimisé: batch loading, parallélisme contrôlé
 */
export function useLegalArticles(
    articleIds: LegalArticleId[],
    options: GetArticleOptions & {
        /** Nombre max de requêtes simultanées */
        concurrency?: number;
    } = {},
) {
    const {concurrency = 3, ...getOptions} = options;

    const [state, setState] = useState<{
        articles: Record<LegalArticleId, EnrichedLegalArticle>;
        loading: boolean;
        error: Error | null;
        loadedCount: number;
    }>({
        articles: {},
        loading: false,
        error: null,
        loadedCount: 0,
    });

    const loadArticles = useCallback(async () => {
        if (articleIds.length === 0) {
            setState({articles: {}, loading: false, error: null, loadedCount: 0});
            return;
        }

        setState(prev => ({...prev, loading: true, error: null}));

        try {
            const articles: Record<LegalArticleId, EnrichedLegalArticle> = {};
            let loadedCount = 0;

            // Batch loading with controlled concurrency
            for (let i = 0; i < articleIds.length; i += concurrency) {
                const batch = articleIds.slice(i, i + concurrency);
                const batchPromises = batch.map(async id => {
                    try {
                        const article = await legalAPI.getArticle(id, getOptions);
                        return {id, article};
                    } catch (error) {
                        console.warn(`Failed to load article ${id}:`, error);
                        return {id, article: null};
                    }
                });

                const batchResults = await Promise.all(batchPromises);

                batchResults.forEach(({id, article}) => {
                    if (article) {
                        articles[id] = article;
                        loadedCount++;
                    }
                });

                // Update progress
                setState(prev => ({
                    ...prev,
                    articles: {...prev.articles, ...articles},
                    loadedCount,
                }));
            }

            setState(prev => ({...prev, loading: false}));
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            setState(prev => ({...prev, loading: false, error: err}));
        }
    }, [articleIds, concurrency, getOptions]);

    useEffect(() => {
        loadArticles();
    }, [loadArticles]);

    return {
        ...state,
        reload: loadArticles,
        progress: articleIds.length > 0 ? (state.loadedCount / articleIds.length) * 100 : 0,
    };
}

/**
 * Hook pour recherche d'articles
 * 🔍 Optimisé: debouncing, cache des résultats
 */
export function useLegalSearch(
    initialQuery = '',
    options: {
        /** Délai de debouncing (ms) */
        debounceMs?: number;
        /** Longueur min de query pour chercher */
        minLength?: number;
        /** Auto-search on query change */
        autoSearch?: boolean;
    } = {},
) {
    const {debounceMs = 300, minLength = 2, autoSearch = true} = options;

    const [query, setQuery] = useState(initialQuery);
    const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

    const [state, setState] = useState<{
        results: EnrichedLegalArticle[];
        loading: boolean;
        error: Error | null;
    }>({
        results: [],
        loading: false,
        error: null,
    });

    // Debouncing de la query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, debounceMs);

        return () => clearTimeout(timer);
    }, [query, debounceMs]);

    // Fonction de recherche
    const search = useCallback(
        async (searchQuery?: string) => {
            const finalQuery = searchQuery !== undefined ? searchQuery : debouncedQuery;

            if (finalQuery.trim().length < minLength) {
                setState({results: [], loading: false, error: null});
                return;
            }

            setState(prev => ({...prev, loading: true, error: null}));

            try {
                const results = await legalAPI.searchArticles(finalQuery);
                setState({results, loading: false, error: null});
            } catch (error) {
                const err = error instanceof Error ? error : new Error(String(error));
                setState({results: [], loading: false, error: err});
            }
        },
        [debouncedQuery, minLength],
    );

    // Auto-search on debounced query change
    useEffect(() => {
        if (autoSearch) {
            search();
        }
    }, [debouncedQuery, autoSearch, search]);

    return {
        query,
        setQuery,
        ...state,
        search: (q?: string) => search(q),
        clear: () => {
            setQuery('');
            setState({results: [], loading: false, error: null});
        },
    };
}

/**
 * Hook pour les statistiques du registry
 * 📊 Utile pour admin/monitoring
 */
export function useLegalRegistry() {
    const [state, setState] = useState<{
        metadata: LegalRegistry['metadata'] | null;
        loading: boolean;
        error: Error | null;
    }>({
        metadata: null,
        loading: true,
        error: null,
    });

    const loadRegistry = useCallback(async () => {
        setState(prev => ({...prev, loading: true, error: null}));

        try {
            await legalAPI.loadRegistry();
            const metadata = legalAPI.getRegistryStats();
            setState({metadata, loading: false, error: null});
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            setState({metadata: null, loading: false, error: err});
        }
    }, []);

    useEffect(() => {
        loadRegistry();
    }, [loadRegistry]);

    const reload = useCallback(async () => {
        try {
            await legalAPI.reload();
            const metadata = legalAPI.getRegistryStats();
            setState({metadata, loading: false, error: null});
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            setState({metadata: null, loading: false, error: err});
        }
    }, []);

    return {
        ...state,
        reload,
        refresh: loadRegistry,
    };
}

/**
 * Hook pour récupérer articles d'un code spécifique
 * 📚 Ex: tous les articles L.217-* (garantie légale)
 */
export function useLegalArticlesByCode(code: string) {
    const [state, setState] = useState<{
        articles: EnrichedLegalArticle[];
        loading: boolean;
        error: Error | null;
    }>({
        articles: [],
        loading: true,
        error: null,
    });

    const loadArticles = useCallback(async () => {
        if (!code) {
            setState({articles: [], loading: false, error: null});
            return;
        }

        setState(prev => ({...prev, loading: true, error: null}));

        try {
            const articles = await legalAPI.getArticlesByCode(code);
            setState({articles, loading: false, error: null});
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));
            setState({articles: [], loading: false, error: err});
        }
    }, [code]);

    useEffect(() => {
        loadArticles();
    }, [loadArticles]);

    return {
        ...state,
        reload: loadArticles,
    };
}

/**
 * Hook pour détection de changements (admin)
 * 🔄 Compare checksums pour alerter sur modifications
 */
export function useLegalChangeDetection(
    options: {
        /** Intervalle de vérification (ms) */
        checkInterval?: number;
        /** Callback appelé en cas de changement */
        onChangeDetected?: (changes: string[]) => void;
    } = {},
) {
    const {checkInterval = 60000, onChangeDetected} = options; // Check every minute

    const [lastChecksum, setLastChecksum] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    const checkForChanges = useCallback(async () => {
        try {
            const stats = legalAPI.getRegistryStats();
            if (!stats) return;

            if (lastChecksum && lastChecksum !== stats.checksum) {
                setHasChanges(true);
                onChangeDetected?.(['Registry updated']);
            }

            setLastChecksum(stats.checksum);
        } catch (error) {
            console.warn('Change detection failed:', error);
        }
    }, [lastChecksum, onChangeDetected]);

    useEffect(() => {
        // Initial check
        checkForChanges();

        // Periodic checks
        const interval = setInterval(checkForChanges, checkInterval);
        return () => clearInterval(interval);
    }, [checkForChanges, checkInterval]);

    const resetChangeDetection = useCallback(() => {
        setHasChanges(false);
    }, []);

    return {
        hasChanges,
        lastChecksum,
        resetChangeDetection,
        forceCheck: checkForChanges,
    };
}
