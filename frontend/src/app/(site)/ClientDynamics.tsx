'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import {
    SectionSkeleton,
    FAQSkeleton,
    CTASkeleton,
} from '@/components/ui/SkeletonSystem';

import {LazyLoadWrapper} from '@/hooks/useLazyLoad';
import {deviceInfo} from '@/lib/performance';

// Pré-échauffage non bloquant (optionnel)
if (typeof window !== 'undefined') {
    const idle = (cb: () => void) =>
        'requestIdleCallback' in window
            ? (window as any).requestIdleCallback(cb, {timeout: 1500})
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
export const LazyHeroRightFAQ = dynamic(
    () => import('@/components/marketing/HeroRightFAQ'),
    {
        loading: () => <div className="animate-pulse h-96 rounded-xl bg-gray-100"/>,
        ssr: false,
    },
);

export const LazyTopFAQ = dynamic(() => import('@/components/sections/TopFAQ'), {
    loading: () => <FAQSkeleton/>,
    ssr: false,
});

export const LazyFinalCTA = dynamic(
    () => import('@/components/sections/FinalCTASection'),
    {loading: () => <CTASkeleton/>, ssr: false},
);

export const LazyStickyMobileCTA = dynamic(
    () => import('@/components/cta/StickyMobileCTA'),
    {loading: () => null, ssr: false},
);

// ⬇️ Les trois exports manquants
export const LazyProblemsSection = dynamic(
    () => import('@/components/sections/ProblemsSection'),
    {loading: () => <SectionSkeleton variant="problems"/>, ssr: false},
);

export const LazyProcessSection = dynamic(
    () => import('@/components/sections/ProcessSection'),
    {loading: () => <SectionSkeleton variant="process"/>, ssr: false},
);

export const LazyTrustSection = dynamic(
    () => import('@/components/sections/TrustSovereigntySection'),
    {loading: () => <SectionSkeleton variant="trust"/>, ssr: false},
);

// === Wrapper client ===
// REND DEUX MODES POSSIBLES :
// 1) "component" fourni -> LazyLoadWrapper fait l'import dynamique
// 2) pas de "component" -> on rend "children" quand visible (via un importFn no-op)
type LazySectionProps = {
    component?: () => Promise<
        { default: React.ComponentType<any> } | React.ComponentType<any> | any
    >;
    fallback: React.ReactNode;
    priority?: 'high' | 'normal' | 'low';
    threshold?: number;
    id?: string;
    className?: string;
    children?: React.ReactNode;
};

export function LazySectionClient({
                                      component,
                                      fallback,
                                      priority = 'normal',
                                      threshold,
                                      id,
                                      className = '',
                                      children,
                                  }: LazySectionProps) {
    const isMobile = deviceInfo.isMobile();
    const effThreshold = threshold ?? (isMobile ? 0 : 0.2);
    const rootMargin = isMobile ? '80px' : '240px';

    // Si aucun importFn fourni, on crée un import no-op qui retourne un composant
    // rendant simplement les children. Comme tout est côté client ici, c'est OK.
    const importFn =
        component ??
        (async () => ({
            default: function StaticChildren() {
                return <>{children}</>;
            },
        }));

    return (
        <section id={id} className={className}>
            <LazyLoadWrapper
                importFn={importFn}
                fallback={fallback}
                options={{
                    threshold: effThreshold,
                    rootMargin,
                    priority,
                    preload: priority === 'high',
                }}
            />
        </section>
    );
}
