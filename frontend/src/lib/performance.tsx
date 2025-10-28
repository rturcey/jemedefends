// src/lib/performance.tsx
'use client';
import { useEffect, useCallback, useRef } from 'react';

// ==========================================
// DÉTECTION DE L'ENVIRONNEMENT
// ==========================================

export const isBrowser = typeof window !== 'undefined';
export const isProduction = process.env.NODE_ENV === 'production';

export const deviceInfo = {
  isMobile: (): boolean => {
    if (!isBrowser) return false;
    return (
      window.innerWidth < 768 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
  },

  isTablet: (): boolean => {
    if (!isBrowser) return false;
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  },

  isSlow: (): boolean => {
    if (!isBrowser) return false;
    const connection = (navigator as any).connection;
    return (
      connection?.effectiveType === '2g' ||
      connection?.effectiveType === 'slow-2g' ||
      connection?.saveData === true
    );
  },

  hasReducedMotion: (): boolean => {
    if (!isBrowser) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },
};

// ==========================================
// MÉTRIQUES DE PERFORMANCE
// ==========================================

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  fcp?: number;
  inp?: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private observers: Map<string, PerformanceObserver> = new Map();

  start() {
    if (!isBrowser || !isProduction) return;

    this.measureLCP();
    this.measureFID();
    this.measureCLS();
    this.measureINP();
    this.measureTTFB();
  }

  private measureLCP() {
    try {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
        this.report('LCP', this.metrics.lcp);
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.set('lcp', observer);
    } catch (e) {
      console.debug('LCP measurement not supported');
    }
  }

  private measureFID() {
    try {
      const observer = new PerformanceObserver(list => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          const firstInput = entries[0] as any;
          this.metrics.fid = firstInput.processingStart - firstInput.startTime;
          this.report('FID', this.metrics.fid);
        }
      });

      observer.observe({ type: 'first-input', buffered: true });
      this.observers.set('fid', observer);
    } catch (e) {
      console.debug('FID measurement not supported');
    }
  }

  private measureCLS() {
    let clsValue = 0;
    let clsEntries: any[] = [];
    let sessionValue = 0;
    let sessionEntries: any[] = [];

    try {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

            if (
              sessionValue &&
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000
            ) {
              sessionValue += entry.value;
              sessionEntries.push(entry);
            } else {
              sessionValue = entry.value;
              sessionEntries = [entry];
            }

            if (sessionValue > clsValue) {
              clsValue = sessionValue;
              clsEntries = sessionEntries;
              this.metrics.cls = clsValue;
              this.report('CLS', this.metrics.cls);
            }
          }
        }
      });

      observer.observe({ type: 'layout-shift', buffered: true });
      this.observers.set('cls', observer);
    } catch (e) {
      console.debug('CLS measurement not supported');
    }
  }

  private measureINP() {
    let maxDuration = 0;

    try {
      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries() as any[]) {
          if (entry.duration > maxDuration) {
            maxDuration = entry.duration;
            this.metrics.inp = maxDuration;
            this.report('INP', this.metrics.inp);
          }
        }
      });

      observer.observe({ type: 'event', buffered: true });
      this.observers.set('inp', observer);
    } catch (e) {
      console.debug('INP measurement not supported');
    }
  }

  private measureTTFB() {
    if (!isBrowser) return;

    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as any;
      if (navigationEntry) {
        this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
        this.report('TTFB', this.metrics.ttfb);
      }
    } catch (e) {
      console.debug('TTFB measurement not supported');
    }
  }

  private report(metric: string, value: number) {
    // Envoyer à votre système d'analytics
    if (isProduction && window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: metric,
        value: Math.round(metric === 'CLS' ? value * 1000 : value),
        non_interaction: true,
      });
    }

    // Log en développement
    if (!isProduction) {
      console.log(`📊 ${metric}: ${value.toFixed(2)}ms`);
    }
  }

  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  stop() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// ==========================================
// HOOKS DE PERFORMANCE
// ==========================================

export function usePerformanceMonitor() {
  useEffect(() => {
    performanceMonitor.start();
    return () => performanceMonitor.stop();
  }, []);

  return performanceMonitor.getMetrics();
}

export function usePageLoadTime() {
  const [loadTime, setLoadTime] = useState<number | null>(null);

  useEffect(() => {
    if (!isBrowser) return;

    const handleLoad = () => {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as any;
      if (navigationEntry) {
        const time = navigationEntry.loadEventEnd - navigationEntry.fetchStart;
        setLoadTime(time);
      }
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return loadTime;
}

// ==========================================
// OPTIMISATION DES RESSOURCES
// ==========================================

export const resourceHints = {
  preconnect: (url: string) => {
    if (!isBrowser) return;
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    document.head.appendChild(link);
  },

  prefetch: (url: string) => {
    if (!isBrowser || deviceInfo.isSlow()) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  },

  preload: (url: string, as: string) => {
    if (!isBrowser) return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = as;
    document.head.appendChild(link);
  },
};

// ==========================================
// OPTIMISATION DES IMAGES
// ==========================================

export function getOptimizedImageSrc(src: string, width: number, quality: number = 75): string {
  // Si vous utilisez Next.js Image Optimization
  if (src.startsWith('/') || src.startsWith('http')) {
    const params = new URLSearchParams({
      w: width.toString(),
      q: quality.toString(),
    });
    return `/_next/image?url=${encodeURIComponent(src)}&${params}`;
  }
  return src;
}

// ==========================================
// DEBOUNCE & THROTTLE
// ==========================================

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {},
): T {
  let timeout: NodeJS.Timeout | null = null;
  let result: any;
  let lastArgs: any[] | null = null;
  let lastThis: any;
  let lastCallTime: number | null = null;

  const { leading = false, trailing = true } = options;

  const invokeFunc = (time: number) => {
    const args = lastArgs!;
    const thisArg = lastThis;

    lastArgs = lastThis = null;
    result = func.apply(thisArg, args);
    return result;
  };

  const debounced = function (this: any, ...args: any[]) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeout === null) {
        return leadingEdge(time);
      }
    }

    if (timeout === null) {
      timeout = setTimeout(timerExpired, wait);
    }

    return result;
  } as T;

  function shouldInvoke(time: number): boolean {
    return lastCallTime === null || time - lastCallTime >= wait;
  }

  function leadingEdge(time: number) {
    if (leading) {
      result = invokeFunc(time);
    }
    timeout = setTimeout(timerExpired, wait);
    return result;
  }

  function timerExpired() {
    const time = Date.now();

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }

    timeout = null;
  }

  return debounced;
}

export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean = false;
  let lastResult: any;

  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      lastResult = func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
    return lastResult;
  } as T;
}

// ==========================================
// LAZY LOADING D'IMAGES NATIVE
// ==========================================

export function LazyImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img || priority) return;

    // Utiliser l'API native si disponible
    if ('loading' in HTMLImageElement.prototype) {
      img.loading = 'lazy';
      return;
    }

    // Fallback avec IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const image = new Image();
          image.src = src;
          image.onload = () => setIsLoaded(true);
          image.onerror = () => setError(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' },
    );

    observer.observe(img);
    return () => observer.disconnect();
  }, [src, priority]);

  return (
    <img
      ref={imgRef}
      src={priority ? src : undefined}
      data-src={!priority ? src : undefined}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      onLoad={() => setIsLoaded(true)}
      onError={() => setError(true)}
      style={{
        opacity: isLoaded ? 1 : 0,
        transition: 'opacity 0.3s',
      }}
    />
  );
}

// ==========================================
// EXPORT TYPES
// ==========================================

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export type { PerformanceMetrics };

// Pour utilisation dans Next.js
export default {
  deviceInfo,
  performanceMonitor,
  resourceHints,
  debounce,
  throttle,
};
