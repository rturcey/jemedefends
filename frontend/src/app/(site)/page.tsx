import type {Metadata} from 'next';
import {Suspense} from 'react';
import dynamic from 'next/dynamic';

import {MobileHeader} from '@/components';
import Container from '@/components/ui/Container';

import {
    HeroSkeleton,
    SectionSkeleton,
    FAQSkeleton,
    CTASkeleton,
} from '@/components/ui/SkeletonSystem';

// ====== RSC (SSR) avec suspense : idéal pour SEO + streaming ======
const LazyHero = dynamic(
    () => import('@/components/marketing/Hero'),
    {suspense: true},
);

// Titre du Hero (élément JSX, pas un type/fonction)
const HomeHeroLeft = dynamic(
    () => import('@/components/marketing/HomeHeroLeft'),
    {loading: () => <div className="animate-pulse h-96"/>},
);

// ====== Client-only dynamics & wrapper ======
import {
    LazyHeroRightFAQ,
    LazyTopFAQ,
    LazyFinalCTA,
    LazyStickyMobileCTA,
    LazySectionClient,
    // ↓ on réutilise les versions client existantes, rendues comme enfants (JSX)
    LazyProblemsSection,
    LazyProcessSection,
    LazyTrustSection,
} from './ClientDynamics';

// =====================
// SEO
// =====================
export const metadata: Metadata = {
    title: 'Je me défends – Garantie légale de conformité',
    description:
        'Générez votre lettre de mise en demeure en 3 minutes. Service gratuit pour faire valoir vos droits de consommateur.',
    metadataBase: new URL('https://jemedefends.fr'),
    openGraph: {
        title: 'Je me défends – Garantie légale de conformité',
        description: 'Générez votre lettre de mise en demeure en 3 minutes.',
        type: 'website',
        url: 'https://jemedefends.fr',
    },
};

// =====================
// PAGE (Server Component)
// =====================
export default function OptimizedHomepage() {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            <MobileHeader/>

            <main className="pt-16 md:pt-0">
                {/* HERO mobile */}
                <div className="block md:hidden">
                    <Suspense fallback={<HeroSkeleton/>}>
                        <LazyHero title={<HomeHeroLeft/>} right={<LazyHeroRightFAQ/>}/>
                    </Suspense>
                </div>

                {/* HERO desktop */}
                <div className="hidden md:block">
                    <Suspense fallback={<HeroSkeleton/>}>
                        <LazyHero title={<HomeHeroLeft/>} right={<LazyHeroRightFAQ/>}/>
                    </Suspense>
                </div>

                {/* PROBLEMS */}
                <LazySectionClient
                    fallback={<SectionSkeleton variant="problems"/>}
                    priority="normal"
                    threshold={0.1}
                    id="problems"
                    className="py-12 md:py-20"
                >
                    <LazyProblemsSection/>
                </LazySectionClient>

                {/* PROCESS */}
                <LazySectionClient
                    fallback={<SectionSkeleton variant="process"/>}
                    priority="normal"
                    threshold={0.2}
                    id="process"
                    className="py-12 md:py-20 bg-gray-50"
                >
                    <LazyProcessSection/>
                </LazySectionClient>

                {/* TRUST */}
                <LazySectionClient
                    fallback={<SectionSkeleton variant="trust"/>}
                    priority="low"
                    threshold={0.3}
                    id="trust"
                    className="py-12 md:py-20"
                >
                    <LazyTrustSection/>
                </LazySectionClient>

                {/* FAQ (desktop) */}
                <section
                    id="faq"
                    className="hidden md:flex section-scroll-target min-h-screen md:h-[calc(100vh-5rem)] items-center justify-center bg-white relative"
                    aria-labelledby="faq-title"
                >
                    <Suspense fallback={<FAQSkeleton/>}>
                        <Container className="w-full">
                            <div className="mx-auto max-w-5xl">
                                <LazyTopFAQ/>
                            </div>
                        </Container>
                    </Suspense>
                </section>

                {/* CTA FINAL */}
                <LazySectionClient
                    fallback={<CTASkeleton/>}
                    priority="low"
                    threshold={0.5}
                    id="finalcta"
                    className="py-16"
                >
                    <LazyFinalCTA/>
                </LazySectionClient>
            </main>

            {/* Sticky Mobile CTA */}
            <LazyStickyMobileCTA/>
        </div>
    );
}
