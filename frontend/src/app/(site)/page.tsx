// src/app/(site)/page.tsx - VERSION CORRIGÉE SANS PROBLÈMES DE SKELETONS
import type {Metadata} from 'next';
import dynamic from 'next/dynamic';

// ✅ Components critiques chargés immédiatement (NO lazy loading)
import {MobileHeader} from '@/components';
import StickyMobileCTA from '@/components/cta/StickyMobileCTA';
import {Hero, HomeHeroLeft, HeroRightFAQ} from '@/components/marketing';
import {
    ProblemsSection,
    ProcessSection,
    TrustSovereigntySection,
    TopFAQ,
} from '@/components/sections';
import Container from '@/components/ui/Container';

// ✅ Seul le CTA final est lazy loadé (bas de page, non critique)
const FinalCTASection = dynamic(() => import('@/components/sections/FinalCTASection'), {
    ssr: true, // ✅ SSR activé pour le SEO
});

// =====================
// SEO - Métadonnées optimisées
// =====================
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

// =====================
// PAGE (Server Component)
// =====================
export default function Homepage() {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Header Mobile - visible uniquement sur mobile */}
            <MobileHeader/>

            {/* Main content avec padding-top mobile pour compenser le MobileHeader */}
            <main className="pt-16 md:pt-0">
                {/*
          ✅ HERO - Chargé immédiatement, pas de lazy loading
          Le Hero est above-the-fold et critique, donc pas de skeleton
        */}
                <Hero
                    title={<HomeHeroLeft/>}
                    right={<HeroRightFAQ/>}
                />

                {/*
          ✅ SECTIONS PRINCIPALES - CHARGÉES IMMÉDIATEMENT
          Ces sections sont essentielles et above-the-fold sur desktop
          Pas de lazy loading pour une meilleure UX et SEO
        */}
                <ProblemsSection/>
                <ProcessSection/>
                <TrustSovereigntySection/>

                {/*
          FAQ Section - Desktop uniquement
          Chargée immédiatement car importante pour le SEO
        */}
                <section
                    id="faq"
                    className="hidden md:flex section-scroll-target min-h-screen md:h-[calc(100vh-5rem)] items-center justify-center bg-white relative"
                    aria-labelledby="faq-title"
                >
                    <Container className="w-full">
                        <div className="mx-auto max-w-5xl">
                            <TopFAQ/>
                        </div>
                    </Container>
                </section>

                {/*
          ✅ CTA Final - Lazy loadé avec SSR
          Seul composant lazy-loadé car non critique et en bas de page
        */}
                <section
                    id="finalcta"
                    className="py-16"
                    aria-labelledby="final-cta"
                >
                    <Container>
                        <div className="mx-auto max-w-5xl">
                            <FinalCTASection/>
                        </div>
                    </Container>
                </section>
            </main>

            {/* Sticky Mobile CTA - Affiché sur mobile uniquement */}
            <StickyMobileCTA/>
        </div>
    );
}