// src/lib/performance.ts - Optimisations de performance
'use client';

// Lazy loading des composants lourds

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
