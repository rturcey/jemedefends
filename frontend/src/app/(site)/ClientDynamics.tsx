// src/app/(site)/ClientDynamics.tsx
'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import { SectionSkeleton, FAQSkeleton, CTASkeleton } from '@/components/ui/SkeletonSystem';

// Pré-échauffage non bloquant (optionnel)
if (typeof window !== 'undefined') {
  const idle = (cb: () => void) =>
    'requestIdleCallback' in window
      ? (window as any).requestIdleCallback(cb, { timeout: 1500 })
      : setTimeout(cb, 300);

  idle(() => {
    import('@/components/sections/ProblemsSection');
    import('@/components/sections/ProcessSection');
    import('@/components/sections/TrustSovereigntySection');
    import('@/components/sections/TopFAQ');
    import('@/components/sections/FinalCTASection');
    import('@/components/marketing/HeroRightFAQ');
  });
}

// === Client-only dynamics ===
export const LazyHeroRightFAQ = dynamic(() => import('@/components/marketing/HeroRightFAQ'), {
  loading: () => <div className="animate-pulse h-96 rounded-xl bg-gray-100" />,
  ssr: false,
});

export const LazyTopFAQ = dynamic(() => import('@/components/sections/TopFAQ'), {
  loading: () => <FAQSkeleton />,
  ssr: false,
});

export const LazyFinalCTA = dynamic(() => import('@/components/sections/FinalCTASection'), {
  loading: () => <CTASkeleton />,
  ssr: false,
});

export const LazyStickyMobileCTA = dynamic(() => import('@/components/cta/StickyMobileCTA'), {
  loading: () => null,
  ssr: false,
});

export const LazyProblemsSection = dynamic(() => import('@/components/sections/ProblemsSection'), {
  loading: () => <SectionSkeleton variant="problems" />,
  ssr: false,
});

export const LazyProcessSection = dynamic(() => import('@/components/sections/ProcessSection'), {
  loading: () => <SectionSkeleton variant="process" />,
  ssr: false,
});

export const LazyTrustSection = dynamic(
  () => import('@/components/sections/TrustSovereigntySection'),
  { loading: () => <SectionSkeleton variant="trust" />, ssr: false },
);
