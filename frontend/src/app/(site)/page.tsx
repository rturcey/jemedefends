// src/app/(site)/page.tsx
import type {Metadata} from 'next';
import {Suspense} from 'react';

import {MobileHeader} from '@/components';
import StickyMobileCTA from '@/components/cta/StickyMobileCTA';
import {Hero, HomeHeroLeft, HeroRightFAQ} from '@/components/marketing';
import {
    ProblemsSection,
    ProcessSection,
    TrustSovereigntySection,
    TopFAQ,
    FinalCTASection,
} from '@/components/sections';
import Container from '@/components/ui/Container';
import {
    HeroSkeleton,
    SectionSkeleton,
    FAQSkeleton,
    CTASkeleton
} from '@/components/ui/SkeletonSystem';

// Métadonnées optimisées pour le SEO
export const metadata: Metadata = {
    title: 'Je me défends – Garantie légale de conformité',
    description:
        'Générez votre lettre de mise en demeure en 3 minutes. Service gratuit pour faire valoir vos droits de consommateur.',
    metadataBase: new URL('https://jemedefends.fr'),
    keywords:
        'garantie légale conformité, mise en demeure, défaut produit, réparation gratuite, Code consommation',
    authors: [{name: 'Je me défends'}],
    creator: 'Je me défends',
    publisher: 'Je me défends',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        url: 'https://jemedefends.fr',
        siteName: 'Je me défends',
        title: 'Je me défends – Garantie légale de conformité',
        description: 'Générez votre lettre de mise en demeure en 3 minutes.',
        images: [
            {
                url: '/og-image-homepage.jpg',
                width: 1200,
                height: 630,
                alt: 'Je me défends — Produit défaillant ? Obtenez réparation',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        creator: '@jemedefends',
        title: 'Obtenez réparation en 3 minutes, légalement',
        description:
            'Garantie légale de conformité — lettre gratuite conforme au Code de la consommation.',
        images: ['/twitter-card.jpg'],
    },
    alternates: {canonical: 'https://jemedefends.fr'},
};

export default function Homepage() {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Header Mobile - pas de skeleton */}
            <MobileHeader/>

            {/* Main content avec padding-top mobile */}
            <main className="pt-16 md:pt-0">
                {/* Hero avec skeleton */}
                <Suspense fallback={<HeroSkeleton/>}>
                    <Hero
                        title={<HomeHeroLeft/>}
                        right={<HeroRightFAQ/>}
                    />
                </Suspense>

                {/* Sections principales avec skeletons */}
                <Suspense fallback={<SectionSkeleton variant="problems"/>}>
                    <ProblemsSection/>
                </Suspense>

                <Suspense fallback={<SectionSkeleton variant="process"/>}>
                    <ProcessSection/>
                </Suspense>

                <Suspense fallback={<SectionSkeleton variant="trust"/>}>
                    <TrustSovereigntySection/>
                </Suspense>

                {/* FAQ Section - Desktop uniquement */}
                <section
                    id="faq"
                    className="hidden md:flex section-scroll-target min-h-screen md:h-[calc(100vh-5rem)] items-center justify-center bg-white relative"
                    aria-labelledby="faq-title"
                >
                    <Container className="w-full">
                        <div className="mx-auto max-w-5xl">
                            <Suspense fallback={<FAQSkeleton/>}>
                                <TopFAQ/>
                            </Suspense>
                        </div>
                    </Container>
                </section>

                {/* CTA Final avec skeleton */}
                <section id="finalcta" className="py-16" aria-labelledby="final-cta">
                    <Container>
                        <div className="mx-auto max-w-5xl">
                            <Suspense fallback={<CTASkeleton/>}>
                                <FinalCTASection/>
                            </Suspense>
                        </div>
                    </Container>
                </section>
            </main>

            {/* Sticky Mobile CTA - pas de skeleton */}
            <StickyMobileCTA/>
        </div>
    );
}