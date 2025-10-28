'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface Window {
  gtag?: (command: string, ...args: any[]) => void;
  dataLayer?: any[];
}

declare const window: Window & typeof globalThis;

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

/**
 * Composant Analytics avec gestion du consentement RGPD
 * - Chargé uniquement après consentement
 * - Lazy loaded pour optimiser les performances
 * - Respecte le RGPD
 */
export default function Analytics() {
  useEffect(() => {
    // Vérifier le consentement stocké
    const checkConsent = () => {
      try {
        const consent = localStorage.getItem('cookie-consent');
        if (consent) {
          const consentData = JSON.parse(consent);
          return consentData.analytics === true;
        }
      } catch (e) {
        console.error('Erreur lecture consentement:', e);
      }
      return false;
    };

    const hasConsent = checkConsent();
    
    if (hasConsent && GA_MEASUREMENT_ID) {
      // Initialiser dataLayer si nécessaire
      window.dataLayer = window.dataLayer || [];
      
      // Fonction gtag
      function gtag(...args: any[]) {
        window.dataLayer?.push(arguments);
      }
      
      window.gtag = gtag;
      
      // Configuration par défaut
      gtag('js', new Date());
      gtag('config', GA_MEASUREMENT_ID, {
        page_path: window.location.pathname,
        anonymize_ip: true, // RGPD : anonymisation IP
        cookie_flags: 'SameSite=Strict;Secure', // Sécurité cookies
        storage: 'none' // Pas de stockage local si pas de consentement cookies
      });

      // Tracker la performance (Core Web Vitals)
      if (typeof window !== 'undefined' && 'performance' in window) {
        // LCP (Largest Contentful Paint)
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'largest-contentful-paint') {
                gtag('event', 'web_vitals', {
                  event_category: 'Web Vitals',
                  event_label: 'LCP',
                  value: Math.round((entry as any).startTime),
                  non_interaction: true
                });
              }
            }
          });
          observer.observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
          console.debug('LCP tracking non supporté');
        }

        // FID (First Input Delay)
        try {
          const fidObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'first-input') {
                const fid = (entry as any).processingStart - entry.startTime;
                gtag('event', 'web_vitals', {
                  event_category: 'Web Vitals',
                  event_label: 'FID',
                  value: Math.round(fid),
                  non_interaction: true
                });
              }
            }
          });
          fidObserver.observe({ type: 'first-input', buffered: true });
        } catch (e) {
          console.debug('FID tracking non supporté');
        }
      }

      // Écouter les changements de consentement
      const handleConsentChange = (e: StorageEvent) => {
        if (e.key === 'cookie-consent' && e.newValue) {
          try {
            const newConsent = JSON.parse(e.newValue);
            if (!newConsent.analytics) {
              // Désactiver le tracking
              gtag('consent', 'update', {
                'analytics_storage': 'denied'
              });
            }
          } catch (err) {
            console.error('Erreur parsing consentement:', err);
          }
        }
      };

      window.addEventListener('storage', handleConsentChange);
      
      return () => {
        window.removeEventListener('storage', handleConsentChange);
      };
    }
  }, []);

  // Ne charger les scripts que si on a le consentement
  const consent = typeof window !== 'undefined' 
    ? (() => {
        try {
          const stored = localStorage.getItem('cookie-consent');
          return stored ? JSON.parse(stored).analytics === true : false;
        } catch {
          return false;
        }
      })()
    : false;

  if (!consent || !GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_flags: 'SameSite=Strict;Secure'
            });
          `,
        }}
      />
    </>
  );
}
