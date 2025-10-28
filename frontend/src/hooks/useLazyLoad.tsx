// src/hooks/useLazyLoad.tsx
'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ==========================================
// TYPES
// ==========================================

interface LazyLoadOptions {
  threshold?: number; // Seuil de visibilité (0-1)
  rootMargin?: string; // Marge autour du viewport
  delay?: number; // Délai avant chargement (ms)
  triggerOnce?: boolean; // Charger une seule fois
  enabled?: boolean; // Activer/désactiver
  fallback?: React.ComponentType; // Composant de fallback
  onLoad?: () => void; // Callback au chargement
  onError?: (error: Error) => void; // Callback en cas d'erreur
  mobileThreshold?: number; // Seuil spécifique mobile
  preload?: boolean; // Précharger avant visibilité
  priority?: 'high' | 'normal' | 'low'; // Priorité de chargement
}

interface LazyLoadState {
  isInView: boolean;
  hasLoaded: boolean;
  isLoading: boolean;
  error: Error | null;
  shouldRender: boolean;
}

// ==========================================
// DÉTECTION MOBILE
// ==========================================

const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    window.innerWidth < 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
};

// ==========================================
// GESTIONNAIRE DE PRIORITÉ
// ==========================================

class PriorityQueue {
  private queues: Map<string, (() => void)[]> = new Map([
    ['high', []],
    ['normal', []],
    ['low', []],
  ]);

  private processing = false;
  private batchSize = isMobile() ? 2 : 4;

  add(callback: () => void, priority: string = 'normal') {
    const queue = this.queues.get(priority) || [];
    queue.push(callback);
    this.queues.set(priority, queue);
    this.process();
  }

  private async process() {
    if (this.processing) return;
    this.processing = true;

    await new Promise(resolve => requestAnimationFrame(resolve));

    const priorities = ['high', 'normal', 'low'];
    let processed = 0;

    for (const priority of priorities) {
      const queue = this.queues.get(priority);
      if (!queue || queue.length === 0) continue;

      while (queue.length > 0 && processed < this.batchSize) {
        const callback = queue.shift();
        if (callback) {
          callback();
          processed++;
        }
      }

      if (processed >= this.batchSize) break;
    }

    this.processing = false;

    // Continue si il reste des éléments
    const hasMore = Array.from(this.queues.values()).some(q => q.length > 0);
    if (hasMore) {
      setTimeout(() => this.process(), 16); // ~60fps
    }
  }
}

const priorityQueue = new PriorityQueue();

// ==========================================
// HOOK PRINCIPAL
// ==========================================

export const useLazyLoad = <T = any,>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  options: LazyLoadOptions = {},
): {
  Component: React.ComponentType<T> | null;
  ref: React.RefObject<HTMLDivElement>;
  state: LazyLoadState;
  retry: () => void;
} => {
  const {
    threshold = 0.1,
    rootMargin = isMobile() ? '100px' : '200px',
    delay = 0,
    triggerOnce = true,
    enabled = true,
    onLoad,
    onError,
    mobileThreshold,
    preload = false,
    priority = 'normal',
  } = options;

  // État
  const [Component, setComponent] = useState<React.ComponentType<T> | null>(null);
  const [state, setState] = useState<LazyLoadState>({
    isInView: false,
    hasLoaded: false,
    isLoading: false,
    error: null,
    shouldRender: false,
  });

  // Refs
  const ref = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Threshold adaptatif mobile
  const actualThreshold = useMemo(() => {
    if (mobileThreshold !== undefined && isMobile()) {
      return mobileThreshold;
    }
    return threshold;
  }, [threshold, mobileThreshold]);

  // Fonction de chargement
  const loadComponent = useCallback(async () => {
    if (loadingRef.current || Component) return;

    loadingRef.current = true;
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const module = await importFn();
      setComponent(() => module.default);
      setState(prev => ({
        ...prev,
        hasLoaded: true,
        isLoading: false,
        shouldRender: true,
      }));
      onLoad?.();
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to load component');
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: err,
      }));
      onError?.(err);
    } finally {
      loadingRef.current = false;
    }
  }, [importFn, Component, onLoad, onError]);

  // Gestion du chargement avec priorité
  const handleLoad = useCallback(() => {
    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        priorityQueue.add(loadComponent, priority);
      }, delay);
    } else {
      priorityQueue.add(loadComponent, priority);
    }
  }, [loadComponent, delay, priority]);

  // Retry en cas d'erreur
  const retry = useCallback(() => {
    loadingRef.current = false;
    setComponent(null);
    setState({
      isInView: true,
      hasLoaded: false,
      isLoading: false,
      error: null,
      shouldRender: false,
    });
    handleLoad();
  }, [handleLoad]);

  // Préchargement
  useEffect(() => {
    if (preload && enabled && !Component) {
      // Précharger après le chargement initial de la page
      const timer = setTimeout(() => {
        importFn()
          .then(module => {
            setComponent(() => module.default);
            setState(prev => ({ ...prev, hasLoaded: true }));
          })
          .catch(() => {
            // Ignorer les erreurs de préchargement
          });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [preload, enabled, Component, importFn]);

  // IntersectionObserver
  useEffect(() => {
    if (!enabled || !ref.current || Component) return;

    // Options de l'observer
    const observerOptions: IntersectionObserverInit = {
      threshold: actualThreshold,
      rootMargin,
    };

    // Callback de l'observer
    const observerCallback: IntersectionObserverCallback = entries => {
      const entry = entries[0];
      if (entry?.isIntersecting) {
        setState(prev => ({ ...prev, isInView: true }));

        if (triggerOnce && observerRef.current) {
          observerRef.current.disconnect();
        }

        handleLoad();
      } else if (!triggerOnce) {
        setState(prev => ({ ...prev, isInView: false }));
      }
    };

    // Créer et démarrer l'observer
    observerRef.current = new IntersectionObserver(observerCallback, observerOptions);
    observerRef.current.observe(ref.current);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      observerRef.current?.disconnect();
    };
  }, [enabled, actualThreshold, rootMargin, triggerOnce, Component, handleLoad]);

  return {
    Component,
    ref,
    state,
    retry,
  };
};

// ==========================================
// COMPOSANT WRAPPER
// ==========================================

interface LazyLoadWrapperProps<T = any> {
  importFn: () => Promise<{ default: React.ComponentType<T> }>;
  fallback?: React.ReactNode;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  options?: LazyLoadOptions;
  componentProps?: T;
  className?: string;
  skeletonClassName?: string;
}

export function LazyLoadWrapper<T = any>({
  importFn,
  fallback,
  errorFallback: ErrorFallback,
  options = {},
  componentProps,
  className,
  skeletonClassName,
}: LazyLoadWrapperProps<T>) {
  const { Component, ref, state, retry } = useLazyLoad(importFn, options);

  // Affichage de l'erreur
  if (state.error && ErrorFallback) {
    return <ErrorFallback error={state.error} retry={retry} />;
  }

  // Affichage du composant chargé
  if (Component && state.shouldRender) {
    return (
      <div ref={ref} className={className}>
        <Component {...(componentProps as T)} />
      </div>
    );
  }

  // Affichage du skeleton/fallback
  return (
    <div ref={ref} className={className}>
      {fallback || (
        <div className={skeletonClassName || 'animate-pulse bg-gray-200 rounded-lg h-32'} />
      )}
    </div>
  );
}

// ==========================================
// HOOK POUR IMAGES LAZY
// ==========================================

interface LazyImageOptions {
  src: string;
  fallbackSrc?: string;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const useLazyImage = ({
  src,
  fallbackSrc = '/images/placeholder.jpg',
  threshold = 0.1,
  rootMargin = '50px',
  onLoad,
  onError,
}: LazyImageOptions) => {
  const [imageSrc, setImageSrc] = useState(fallbackSrc);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const image = new Image();

          image.onload = () => {
            setImageSrc(src);
            setIsLoading(false);
            onLoad?.();
          };

          image.onerror = () => {
            setError(true);
            setIsLoading(false);
            onError?.();
          };

          image.src = src;
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(img);

    return () => observer.disconnect();
  }, [src, fallbackSrc, threshold, rootMargin, onLoad, onError]);

  return {
    ref: imgRef,
    src: imageSrc,
    isLoading,
    error,
  };
};

// ==========================================
// EXPORTS
// ==========================================

export default useLazyLoad;
