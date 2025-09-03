'use client';
import * as React from 'react';

interface MobileOptimizationState {
  isMobile: boolean;
  isSlowConnection: boolean;
  prefersReducedMotion: boolean;
  shouldUseSimpleAnimations: boolean;
  deviceMemory: number;
}

export function useMobileOptimization(): MobileOptimizationState {
  const [state, setState] = React.useState<MobileOptimizationState>({
    isMobile: false,
    isSlowConnection: false,
    prefersReducedMotion: false,
    shouldUseSimpleAnimations: false,
    deviceMemory: 4,
  });

  React.useEffect(() => {
    const updateState = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches;

      let isSlowConnection = false;
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        isSlowConnection =
          connection.effectiveType === '2g' ||
          connection.effectiveType === 'slow-2g' ||
          connection.downlink < 1.5;
      }

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      let deviceMemory = 4;
      if ('deviceMemory' in navigator) {
        deviceMemory = (navigator as any).deviceMemory || 4;
      }

      const shouldUseSimpleAnimations =
        isSlowConnection || prefersReducedMotion || deviceMemory < 4;

      setState({
        isMobile,
        isSlowConnection,
        prefersReducedMotion,
        shouldUseSimpleAnimations,
        deviceMemory,
      });
    };

    updateState();

    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = () => updateState();

    mobileQuery.addEventListener('change', handleChange);
    motionQuery.addEventListener('change', handleChange);

    return () => {
      mobileQuery.removeEventListener('change', handleChange);
      motionQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return state;
}
