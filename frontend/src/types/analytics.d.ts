// types/analytics.d.ts
// Types pour Analytics et Cookie Consent

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
}

export interface ConsentUpdateEvent extends CustomEvent {
  detail: CookieConsent;
}

export interface AnalyticsConfig {
  measurementId: string;
  anonymizeIp?: boolean;
  cookieFlags?: string;
  storage?: 'none' | 'cookies';
  debug?: boolean;
}

export interface WebVitalsMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  fcp?: number;
  inp?: number;
}

export interface GtagEvent {
  (command: 'config', targetId: string, config?: any): void;
  (command: 'event', eventName: string, eventParams?: any): void;
  (command: 'consent', action: 'update', params: any): void;
  (command: 'js', date: Date): void;
}

declare global {
  interface Window {
    gtag?: GtagEvent;
    dataLayer?: any[];
  }
  
  interface WindowEventMap {
    'cookieConsentUpdate': ConsentUpdateEvent;
  }
}

export type ConsentLevel = 'necessary' | 'analytics' | 'marketing';

export interface ConsentManager {
  getConsent(): CookieConsent | null;
  setConsent(consent: Partial<CookieConsent>): void;
  hasConsent(level: ConsentLevel): boolean;
  revokeConsent(): void;
  onConsentChange(callback: (consent: CookieConsent) => void): () => void;
}

// Helper hook type
export interface UseConsentReturn {
  consent: CookieConsent | null;
  hasAnalytics: boolean;
  hasMarketing: boolean;
  updateConsent: (consent: Partial<CookieConsent>) => void;
  revokeAll: () => void;
}
