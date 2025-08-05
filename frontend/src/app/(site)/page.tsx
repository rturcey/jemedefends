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
        <Section
            id="faq"
            className="section-scroll-target py-12 sm:py-16 lg:py-20 lg:min-h-screen flex items-center"
        >
          <Container>
            <div className="mx-auto max-w-5xl">
              <TopFAQ />
            </div>
          </Container>
        </Section>
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
