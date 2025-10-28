// hooks/useConsent.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CookieConsent, ConsentLevel, UseConsentReturn } from '@/types/analytics';

const CONSENT_KEY = 'cookie-consent';
const CONSENT_VERSION = '1.0.0';

/**
 * Hook pour gérer le consentement des cookies
 * Facilite l'accès et la modification du consentement dans toute l'app
 */
export function useConsent(): UseConsentReturn {
  const [consent, setConsentState] = useState<CookieConsent | null>(null);

  // Charger le consentement initial
  useEffect(() => {
    const loadConsent = () => {
      try {
        const stored = localStorage.getItem(CONSENT_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setConsentState(parsed);
        }
      } catch (error) {
        console.error('Erreur lecture consentement:', error);
      }
    };

    loadConsent();

    // Écouter les changements de consentement
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CONSENT_KEY && e.newValue) {
        try {
          const newConsent = JSON.parse(e.newValue);
          setConsentState(newConsent);
        } catch (error) {
          console.error('Erreur parsing consentement:', error);
        }
      }
    };

    const handleCustomEvent = (e: CustomEvent<CookieConsent>) => {
      setConsentState(e.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cookieConsentUpdate', handleCustomEvent as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cookieConsentUpdate', handleCustomEvent as EventListener);
    };
  }, []);

  // Mettre à jour le consentement
  const updateConsent = useCallback((newConsent: Partial<CookieConsent>) => {
    const finalConsent: CookieConsent = {
      necessary: true, // Toujours true
      analytics: false,
      marketing: false,
      ...consent,
      ...newConsent,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };

    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(finalConsent));
      setConsentState(finalConsent);

      // Notifier les autres composants
      window.dispatchEvent(
        new CustomEvent('cookieConsentUpdate', { detail: finalConsent })
      );

      // Mettre à jour Google Analytics si présent
      if (window.gtag) {
        window.gtag('consent', 'update', {
          'analytics_storage': finalConsent.analytics ? 'granted' : 'denied',
          'ad_storage': finalConsent.marketing ? 'granted' : 'denied',
        });
      }
    } catch (error) {
      console.error('Erreur sauvegarde consentement:', error);
    }
  }, [consent]);

  // Révoquer tout consentement (sauf essentiels)
  const revokeAll = useCallback(() => {
    updateConsent({
      analytics: false,
      marketing: false,
    });
  }, [updateConsent]);

  return {
    consent,
    hasAnalytics: consent?.analytics ?? false,
    hasMarketing: consent?.marketing ?? false,
    updateConsent,
    revokeAll,
  };
}

/**
 * Hook pour vérifier si un niveau de consentement est actif
 */
export function useHasConsent(level: ConsentLevel): boolean {
  const { consent } = useConsent();
  
  if (!consent) return false;
  
  switch (level) {
    case 'necessary':
      return true; // Toujours true
    case 'analytics':
      return consent.analytics;
    case 'marketing':
      return consent.marketing;
    default:
      return false;
  }
}

/**
 * Hook pour gérer l'affichage conditionnel basé sur le consentement
 */
export function useConsentGate(requiredLevel: ConsentLevel): {
  hasConsent: boolean;
  requestConsent: () => void;
} {
  const hasConsent = useHasConsent(requiredLevel);
  
  const requestConsent = useCallback(() => {
    // Déclencher l'ouverture du cookie banner
    // Vous pouvez implémenter une logique custom ici
    const event = new CustomEvent('requestConsent', { 
      detail: { level: requiredLevel } 
    });
    window.dispatchEvent(event);
  }, [requiredLevel]);

  return {
    hasConsent,
    requestConsent,
  };
}

/**
 * Composant pour afficher du contenu uniquement si consentement donné
 */
export function ConsentGate({ 
  level, 
  children, 
  fallback 
}: {
  level: ConsentLevel;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { hasConsent } = useConsentGate(level);
  
  if (hasConsent) {
    return <>{children}</>;
  }
  
  return <>{fallback || null}</>;
}
