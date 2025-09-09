'use client';

import { useCallback, useEffect, useState } from 'react';

interface ScrollOffset {
  desktop: number; // TopBar height (80px)
  mobile: number; // Mobile TOC bar height (48px)
}

const OFFSETS: ScrollOffset = {
  desktop: 80, // TopBar height (md:pt-20 = 5rem = 80px)
  mobile: 48, // Mobile TOC bar height
};

export function useScrollOffset() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToElement = useCallback(
    (elementId: string) => {
      const element = document.getElementById(elementId);
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const offset = isMobile ? OFFSETS.mobile : OFFSETS.desktop;
      const targetY = window.scrollY + rect.top - offset - 16; // -16px pour respirer

      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: 'smooth',
      });
    },
    [isMobile],
  );

  return {
    scrollToElement,
    isMobile,
    offset: isMobile ? OFFSETS.mobile : OFFSETS.desktop,
  };
}
