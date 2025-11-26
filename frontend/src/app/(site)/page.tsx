// src/app/(site)/page.tsx
import type { Metadata } from 'next';
import { Suspense } from 'react';

import { MobileHeader } from '@/components';
import StickyMobileCTA from '@/components/cta/StickyMobileCTA';
import { Hero, HomeHeroLeft } from '@/components/marketing';

import Container from '@/components/ui/Container';
import {
  HeroSkeleton,
  SectionSkeleton,
  FAQSkeleton,
  CTASkeleton,
} from '@/components/ui/SkeletonSystem';

// ⬇️ on importe les versions lazy client
import {
  LazyHeroRightFAQ,
  LazyProblemsSection,
  LazyProcessSection,
  LazyTrustSection,
  LazyTopFAQ,
  LazyFinalCTA,
} from './ClientDynamics';

// Métadonnées optimisées pour le SEO
export const metadata: Metadata = {
  title: 'Je me défends – Garantie légale de conformité',
  description:
    'Générez votre lettre de mise en demeure en 3 minutes. Service gratuit pour faire valoir vos droits de consommateur.',
  metadataBase: new URL('https://jemedefends.fr'),
  keywords:
    'garantie légale conformité, mise en demeure, défaut produit, réparation gratuite, Code consommation',
  authors: [{ name: 'Je me défends' }],
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
  alternates: { canonical: 'https://jemedefends.fr' },
};

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <MobileHeader />

      <main className="pt-16 md:pt-0">
        {/* HERO */}
        <Suspense fallback={<HeroSkeleton />}>
          <Hero title={<HomeHeroLeft />} right={<LazyHeroRightFAQ />} />
        </Suspense>

        {/* PROBLEMS */}
        <Suspense fallback={<SectionSkeleton variant="problems" />}>
          <LazyProblemsSection />
        </Suspense>

        {/* PROCESS */}
        <Suspense fallback={<SectionSkeleton variant="process" />}>
          <LazyProcessSection />
        </Suspense>

        {/* TRUST */}
        <Suspense fallback={<SectionSkeleton variant="trust" />}>
          <LazyTrustSection />
        </Suspense>

        {/* FAQ desktop only */}
        <section
          id="faq"
          className="hidden md:flex section-scroll-target min-h-screen md:h-[calc(100vh-5rem)] items-center justify-center bg-white relative"
          aria-labelledby="faq-title"
        >
          <Container className="w-full">
            <div className="mx-auto max-w-5xl">
              <Suspense fallback={<FAQSkeleton />}>
                <LazyTopFAQ />
              </Suspense>
            </div>
          </Container>
        </section>

        <Suspense fallback={<CTASkeleton />}>
          <LazyFinalCTA />
        </Suspense>
      </main>

      <StickyMobileCTA />
    </div>
  );
}
