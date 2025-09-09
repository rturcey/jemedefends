// src/lib/performance.ts - Optimisations de performance
'use client';

// Lazy loading des composants lourds
import { lazy } from 'react';

export const LazyEligibilityForm = lazy(() =>
  import('@/components/eligibility/EligibilityForm').then(module => ({
    default: module.default,
  })),
);

export const LazyResultsDisplay = lazy(() =>
  import('@/components/eligibility/ResultsDisplay').then(module => ({
    default: module.default,
  })),
);

export const LazyExitIntentModal = lazy(() =>
  import('@/components/eligibility/ExitIntentModal').then(module => ({
    default: module.default,
  })),
);

// Preload des composants critiques
export const preloadComponents = () => {
  if (typeof window !== 'undefined') {
    // Preload form après 2 secondes
    setTimeout(() => {
      import('@/components/eligibility/EligibilityForm');
    }, 2000);

    // Preload results après 5 secondes
    setTimeout(() => {
      import('@/components/eligibility/ResultsDisplay');
    }, 5000);
  }
};

// Debounce pour les events fréquents
export const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): T => {
  let timeout: NodeJS.Timeout | null = null;

  return ((...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
};

// Throttle pour le scroll
export const throttle = <T extends (...args: any[]) => any>(func: T, limit: number): T => {
  let inThrottle: boolean;

  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
};

// Intersection Observer pour le lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {},
): IntersectionObserver | null => {
  if (typeof window === 'undefined' || !window.IntersectionObserver) {
    return null;
  }

  return new IntersectionObserver(callback, {
    threshold: 0.1,
    rootMargin: '50px',
    ...options,
  });
};

// Métriques de performance
export const measurePerformance = {
  // Core Web Vitals
  getCLS: (): Promise<number> => {
    return new Promise(resolve => {
      new PerformanceObserver(list => {
        let cls = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cls += (entry as any).value;
          }
        }
        resolve(cls);
      }).observe({ type: 'layout-shift', buffered: true });
    });
  },

  getLCP: (): Promise<number> => {
    return new Promise(resolve => {
      new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
  },

  getFID: (): Promise<number> => {
    return new Promise(resolve => {
      new PerformanceObserver(list => {
        const entries = list.getEntries();
        const firstEntry = entries[0];
        resolve((firstEntry as any).processingStart - firstEntry.startTime);
      }).observe({ type: 'first-input', buffered: true });
    });
  },

  // Time to Interactive
  getTTI: (): number => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return navigation.domInteractive - navigation.navigationStart;
  },
};
