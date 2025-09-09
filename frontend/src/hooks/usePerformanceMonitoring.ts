// src/hooks/usePerformanceMonitoring.tsx - Hook pour le monitoring
'use client';

import { useEffect } from 'react';

import { trackEvent } from '@/lib/analytics';
import { measurePerformance } from '@/lib/performance';

export const usePerformanceMonitoring = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const monitorPerformance = async () => {
      // Attendre que la page soit complètement chargée
      await new Promise(resolve => {
        if (document.readyState === 'complete') {
          resolve(void 0);
        } else {
          window.addEventListener('load', () => resolve(void 0));
        }
      });

      try {
        // Mesurer les Core Web Vitals
        const [cls, lcp, fid] = await Promise.all([
          measurePerformance.getCLS(),
          measurePerformance.getLCP(),
          measurePerformance.getFID(),
        ]);

        const tti = measurePerformance.getTTI();

        // Tracker les métriques
        trackEvent({
          action: 'core_web_vitals',
          category: 'performance',
          label: 'cls',
          value: Math.round(cls * 1000),
        });

        trackEvent({
          action: 'core_web_vitals',
          category: 'performance',
          label: 'lcp',
          value: Math.round(lcp),
        });

        trackEvent({
          action: 'core_web_vitals',
          category: 'performance',
          label: 'fid',
          value: Math.round(fid),
        });

        trackEvent({
          action: 'page_metrics',
          category: 'performance',
          label: 'tti',
          value: tti,
        });

        // Log pour le développement
        if (process.env.NODE_ENV === 'development') {
          console.log('Performance Metrics:', {
            CLS: cls,
            LCP: lcp,
            FID: fid,
            TTI: tti,
          });
        }
      } catch (error) {
        console.warn('Performance monitoring failed:', error);
      }
    };

    // Délai pour éviter d'impacter les performances initiales
    setTimeout(monitorPerformance, 3000);
  }, []);
};
