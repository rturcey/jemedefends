'use client';

import { useEffect } from 'react';

export const useExitIntent = (onExitIntent: () => void) => {
  useEffect(() => {
    let timeOnPage = 0;
    let hasTriggered = false;

    const interval = setInterval(() => {
      timeOnPage += 1000;
    }, 1000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && timeOnPage > 10000 && !hasTriggered) {
        hasTriggered = true;
        onExitIntent();
      }
    };

    const handleBeforeUnload = () => {
      if (timeOnPage > 5000 && !hasTriggered) {
        hasTriggered = true;
        onExitIntent();
      }
    };

    // Détection mobile - scroll rapide vers le haut
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (
        currentScrollY < lastScrollY - 100 &&
        currentScrollY < 50 &&
        timeOnPage > 8000 &&
        !hasTriggered
      ) {
        hasTriggered = true;
        onExitIntent();
      }
      lastScrollY = currentScrollY;
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(interval);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onExitIntent]);
};
