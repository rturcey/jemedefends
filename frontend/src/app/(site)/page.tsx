import type {Metadata} from 'next';
import dynamic from 'next/dynamic';

// ✅ Components critiques chargés immédiatement (NO lazy loading)
import StickyMobileCTA from '@/components/cta/StickyMobileCTA';
import {Hero, HomeHeroLeft, HeroRightFAQ} from '@/components/marketing';
import {
    ProblemsSection,
    ProcessSection,
    TrustSovereigntySection,
    TopFAQ
} from '@/components/sections';
import Container from '@/components/ui/Container';
import {MobileHeader} from '@/components';

// ✅ Seul le CTA final est lazy loadé (bas de page, non critique)
const FinalCTASection = dynamic(() => import('@/components/sections/FinalCTASection'), {
    ssr: true, // ✅ SSR activé pour le SEO
});

// Métadonnées optimisées pour le SEO
export const metadata: Metadata = {
    title: 'Je me défends – Garantie légale de conformité',
    description: 'Générez votre lettre de mise en demeure en 3 minutes. Service gratuit pour faire valoir vos droits de consommateur.',
    metadataBase: new URL('https://jemedefends.fr'),
    openGraph: {
        title: 'Je me défends – Garantie légale de conformité',
        description: 'Générez votre lettre de mise en demeure en 3 minutes.',
        type: 'website',
        url: 'https://jemedefends.fr',
    },
};

export default function Homepage() {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Header Mobile */}
            <MobileHeader/>

            {/* Main content avec padding-top mobile */}
            <main className="pt-16 md:pt-0">
                {/* Hero - Chargé immédiatement */}
                <Hero title={<HomeHeroLeft/>} right={<HeroRightFAQ/>}/>

                {/* ✅ Sections principales - CHARGÉES IMMÉDIATEMENT (pas de lazy loading) */}
                <ProblemsSection/>
                <ProcessSection/>
                <TrustSovereigntySection/>

                {/* FAQ Section - Desktop uniquement */}
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

                {/* CTA Final - Lazy loadé (non critique) */}
                <section id="finalcta" className="py-16" aria-labelledby="final-cta">
                    <Container>
                        <div className="mx-auto max-w-5xl">
                            <FinalCTASection/>
                        </div>
                    </Container>
                </section>
            </main>

            <StickyMobileCTA/>
        </div>
    );
}