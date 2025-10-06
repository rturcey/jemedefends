import { notFound } from 'next/navigation';
import React from 'react';

// Composants guides
import { FinalCTASection } from '@/components';
import { RelatedGuides } from '@/components/guides';
import GuideHero from '@/components/guides/GuideHero';
import GuideProgress from '@/components/guides/GuideProgress';
import GuideRightSidebar from '@/components/guides/GuideRightSidebar';
import GuideTOCDesktop from '@/components/guides/GuideTOCDesktop';
import GuideTOCMobile from '@/components/guides/GuideTOCMobile';

// Données YAML
import LegalFootnotes from '@/components/legal/LegalFootnotes';
import { getFullGuide } from '@/lib/guide-registry';

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;

  // Chargement du guide
  const guide = getFullGuide(slug);

  // Vérifier sections
  if (!guide || !guide.sections || guide.sections.length === 0) {
    notFound();
  }

  const readingTime = guide.readingTime || 2;
  const enrichedGuide = { ...guide, slug, readingTime };

  return (
    <>
      {/* Hero fonctionnel */}
      <GuideHero guide={enrichedGuide} readingTime={readingTime} />

      {/* TOC mobile sticky sous le topbar */}
      <div className="md:hidden sticky top-[5rem] z-30">
        <GuideTOCMobile guide={guide} className="lg:hidden" />
      </div>

      {/* Progress bar FIXE sous le topbar */}
      <div className="fixed top-12 lg:top-[5rem] left-0 right-0 z-40">
        <GuideProgress />
      </div>

      {/* Layout principal en 3 colonnes : TOC gauche / contenu / sidebar droite */}
      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:[grid-template-columns:16rem_minmax(0,1fr)_20rem] gap-6 lg:gap-8">
          {/* TOC gauche sticky */}
          <aside className="hidden lg:block">
            <div className="sticky top-[6rem]">
              <GuideTOCDesktop guide={guide} />
            </div>
          </aside>

          {/* Contenu principal */}
          <main className="min-w-0">
            <article className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 lg:p-8">
                <div className="prose prose-lg max-w-none">
                  {guide.sections.map((section: any, index: number) => (
                    <div key={section.id || `section-${index}`} className="mb-8 last:mb-0">
                      {section.content}
                    </div>
                  ))}
                </div>
              </div>
            </article>

            {/* Hydratation des exposants + blocs Sources */}
            <LegalFootnotes scopeSelector="main article" />
          </main>

          {/* Sidebar droite sticky */}
          <aside className="w-full lg:w-auto" data-toc-exclude>
            <div className="lg:sticky lg:top-[6rem] space-y-6">
              <GuideRightSidebar guide={enrichedGuide} />
            </div>
          </aside>
        </div>
      </div>

      {/* Section guides connexes */}
      {guide.relatedGuides && guide.relatedGuides.length > 0 && (
        <RelatedGuides
          currentGuide={enrichedGuide}
          relatedSlugs={enrichedGuide.relatedGuides}
          variant="section"
        />
      )}

      {/* CTA finale */}
      <FinalCTASection />
    </>
  );
}

// Métadonnées de page
export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getFullGuide(slug);

  if (!guide) {
    return {
      title: 'Guide non trouvé',
      description: "Ce guide n'existe pas ou n'est plus disponible.",
    };
  }

  const title = guide.metadata.title;
  const description =
    guide.metadata.seo?.description ||
    `Guide pratique pour ${title}. Défendez vos droits de consommateur avec nos conseils juridiques et modèles de lettres.`;

  return {
    title,
    description,
    keywords: guide.metadata.seo?.keywords || [],
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: guide.legal?.lastUpdated,
      authors: ['Je me défends'],
      section: guide.category?.name || 'Guides',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/guides/${slug}`,
    },
  };
}

// Génération statique des pages
export async function generateStaticParams() {
  return [];
}
