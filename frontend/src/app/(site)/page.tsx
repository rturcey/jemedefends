// src/app/page.tsx (Home) – sections full-screen (sauf CTA final) + espace TopFAQ + sticky CTA mobile
import { ProblemsSection, ProcessSection, FinalCTASection } from '@/components/sections';
import { Hero, HomeHeroLeft, HeroRightFAQ } from '@/components/marketing';
import { TopFAQ } from '@/components/faq';
import StickyMobileCTA from '@/components/cta/StickyMobileCTA';
import { Section, TrustSovereigntySection } from '@/components';
import Container from '@/components/ui/Container';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main>
        <Hero title={<HomeHeroLeft />} right={<HeroRightFAQ />} />
        <ProblemsSection />
        <ProcessSection />
        <TrustSovereigntySection />
        <section
          id="faq"
          className="section-scroll-target min-h-screen md:h-[calc(100vh-5rem)] flex items-center justify-center bg-white"
        >
          <Container className="w-full">
            <div className="mx-auto max-w-5xl">
              <TopFAQ />
            </div>
          </Container>
        </section>
        <div className="h-10 sm:h-14" />

        <div id="finalcta" className="px-4">
          <div className="mx-auto max-w-5xl">
            <FinalCTASection />
          </div>
        </div>
      </main>
      <StickyMobileCTA />
    </div>
  );
}
