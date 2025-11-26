interface TrackingEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const trackEvent = ({ action, category, label, value }: TrackingEvent): void => {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // Matomo (si utilisé)
  if (typeof window !== 'undefined' && window._paq) {
    window._paq.push(['trackEvent', category, action, label, value]);
  }
};

export const trackEligibilityEvents = {
  pageView: () =>
    trackEvent({
      action: 'page_view',
      category: 'eligibility',
    }),

  testStarted: (source: string = 'hero_cta') =>
    trackEvent({
      action: 'test_started',
      category: 'engagement',
      label: source,
    }),

  testRestarted: () =>
    trackEvent({
      action: 'test_restarted',
      category: 'engagement',
    }),

  stepCompleted: (step: number, timeSpent?: number) =>
    trackEvent({
      action: 'step_completed',
      category: 'engagement',
      label: `step_${step}`,
      value: timeSpent,
    }),

  testCompleted: (result: string, totalTime?: number) =>
    trackEvent({
      action: 'test_completed',
      category: 'conversion',
      label: result,
      value: totalTime,
    }),
};
