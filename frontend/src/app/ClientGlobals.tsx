'use client';

import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { performanceMonitor, deviceInfo, resourceHints } from '@/lib/performance';

// Analytics & Cookie Banner (ssr:false → doit vivre côté client)
const LazyAnalytics = dynamic(() => import('@/components/Analytics'), {
  ssr: false,
});
const LazyCookieBanner = dynamic(() => import('@/components/CookieBanner'), {
  ssr: false,
  loading: () => null,
});

function LazyLoadInitializer() {
  const [cookieBannerLoaded, setCookieBannerLoaded] = useState(false);

  useEffect(() => {
    performanceMonitor.start();

    // Optimisations réseau
    resourceHints.preconnect('https://fonts.googleapis.com');
    resourceHints.preconnect('https://fonts.gstatic.com');

    // Préchargements conditionnels
    const isMobile = deviceInfo.isMobile();
    const isSlow = deviceInfo.isSlow();

    if (!isSlow) {
      const timer = setTimeout(() => {
        // Formulaire d’éligibilité (le plus probable)
        import('@/components/eligibility/EligibilityForm');

        // Sections principales si desktop
        if (!isMobile) {
          import('@/components/sections/ProblemsSection');
          import('@/components/sections/ProcessSection');
        }
      }, 2000);

      const cookieTimer = setTimeout(() => {
        setCookieBannerLoaded(true);
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearTimeout(cookieTimer);
      };
    }
  }, []);

  return (
    <>
      {/* Analytics – asynchrone */}
      <Suspense fallback={null}>
        <LazyAnalytics />
      </Suspense>

      {/* Cookie banner – après délai */}
      {cookieBannerLoaded && (
        <Suspense fallback={null}>
          <LazyCookieBanner />
        </Suspense>
      )}
    </>
  );
}

export default function ClientGlobals() {
  return <LazyLoadInitializer />;
}
