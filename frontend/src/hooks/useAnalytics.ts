import { useCallback } from 'react';

export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    // Intégration future avec un service d'analytics
    console.log('Analytics event:', eventName, properties);

    // Exemple d'intégration avec Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }
  }, []);

  const trackPageView = useCallback(
    (page: string) => {
      trackEvent('page_view', { page });
    },
    [trackEvent],
  );

  const trackFormStep = useCallback(
    (step: number, stepName: string) => {
      trackEvent('form_step_completed', { step, step_name: stepName });
    },
    [trackEvent],
  );

  const trackFormSubmission = useCallback(
    (formSlug: string, formula: string) => {
      trackEvent('form_submitted', { form_slug: formSlug, formula });
    },
    [trackEvent],
  );

  const trackDownload = useCallback(
    (type: 'free' | 'pdf', letterId: string) => {
      trackEvent('letter_downloaded', { type, letter_id: letterId });
    },
    [trackEvent],
  );

  return {
    trackEvent,
    trackPageView,
    trackFormStep,
    trackFormSubmission,
    trackDownload,
  };
}
