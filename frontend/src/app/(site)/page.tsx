import type {Metadata} from 'next';
import dynamic from 'next/dynamic';

// Components statiques (chargés immédiatement)
import StickyMobileCTA from '@/components/cta/StickyMobileCTA';
import {Hero, HomeHeroLeft, HeroRightFAQ} from '@/components/marketing';
import {TopFAQ} from '@/components/sections';
import Container from '@/components/ui/Container';
import Skeleton from '@/components/ui/Skeleton';
import {MobileHeaderIndex} from "@/components";

// Components dynamiques avec skeleton loading RÉALISTE
const ProblemsSection = dynamic(() => import('@/components/sections/ProblemsSection'), {
    loading: () => (
        <section
            className="min-h-screen md:h-[calc(100vh-5rem)] flex items-center justify-center bg-white">
            <Container>
                <div className="space-y-8 w-full max-w-6xl mx-auto">
                    <Skeleton className="h-20 w-3/4 mx-auto"/>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="h-64 rounded-xl"/>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    ),
});

const ProcessSection = dynamic(() => import('@/components/sections/ProcessSection'), {
    loading: () => (
        <section
            className="min-h-screen md:h-[calc(100vh-5rem)] flex items-center justify-center bg-gray-50">
            <Container>
                <div className="space-y-8 w-full max-w-6xl mx-auto">
                    <Skeleton className="h-20 w-2/3 mx-auto"/>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <Skeleton key={i} className="h-80 rounded-xl"/>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    ),
});

const TrustSovereigntySection = dynamic(
    () => import('@/components/sections/TrustSovereigntySection'),
    {
        loading: () => (
            <section
                className="min-h-screen md:h-[calc(100vh-5rem)] flex items-center justify-center bg-blue-50">
                <Container>
                    <div className="space-y-8 w-full max-w-6xl mx-auto">
                        <Skeleton className="h-16 w-1/2 mx-auto"/>
                        <div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map(i => (
                                <Skeleton key={i} className="h-32 rounded-xl"/>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>
        ),
    },
);

const FinalCTASection = dynamic(() => import('@/components/sections/FinalCTASection'), {
    loading: () => (
        <section className="py-12">
            <Container>
                <div className="text-center space-y-6">
                    <Skeleton className="h-12 w-2/3 mx-auto"/>
                    <Skeleton className="h-6 w-1/2 mx-auto"/>
                    <Skeleton className="h-14 w-64 mx-auto rounded-xl"/>
                </div>
            </Container>
        </section>
    ),
});

// Métadonnées RÉELLES (sans inventions)
export const metadata: Metadata = {
    title: 'Je me défends – Garantie légale de conformité',
    description: 'Générez votre lettre de mise en demeure en 3 minutes.',
    metadataBase: new URL('https://jemedefends.fr'),
};

export default function Homepage() {
    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Header Mobile uniquement pour la page d'index */}
            <MobileHeaderIndex/>

            {/* Ajouter un padding-top sur mobile pour compenser le header fixe */}
            <main className="pt-16 md:pt-0">
                {/* Hero - Pleine hauteur avec topbar */}
                <Hero title={<HomeHeroLeft/>} right={<HeroRightFAQ/>}/>

                {/* Sections centrées verticalement */}
                <ProblemsSection/>
                <ProcessSection/>
                <TrustSovereigntySection/>

                {/* FAQ Section centrée */}
                <section
                    id="faq"
                    className="section-scroll-target min-h-screen md:h-[calc(100vh-5rem)] flex items-center justify-center bg-white relative"
                    aria-labelledby="faq-title"
                >
                    <Container className="w-full">
                        <div className="mx-auto max-w-5xl">
                            <TopFAQ/>
                        </div>
                    </Container>
                </section>

                {/* CTA Final - Pas de centrage vertical */}
                <section id="finalcta" className="py-16"
                         aria-labelledby="final-cta">
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