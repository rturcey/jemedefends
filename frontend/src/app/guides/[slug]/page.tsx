// ============================================================================
// PAGE GUIDE REDESIGNÉE - LAYOUT ÉQUILIBRÉ ET UX OPTIMISÉE
// ============================================================================

// *** src/app/guides/[slug]/page.tsx - VERSION REDESIGNÉE ***
import React from 'react';
import { notFound } from 'next/navigation';

// Composants guides
import { GuideHero, RelatedGuides } from '@/components/guides';
import { FinalCTASection } from '@/components';

// TOC
import GuideTOCMobile from '@/components/guides/GuideTOCMobile';
import GuideTOCDesktop from '@/components/guides/GuideTOCDesktop';

// Nouveaux composants pour la sidebar droite
import GuideRightSidebar from '@/components/guides/GuideRightSidebar';
import GuideProgress from '@/components/guides/GuideProgress';

// Composants dev
import DevEditButton from '@/components/dev/DevEditButton';
import DevToolbar from '@/components/dev/DevToolbar';

// Données YAML
import { getFullGuide } from '@/lib/guide-registry';

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getFullGuide(slug);

  if (!guide) {
    notFound();
  }

  const relatedSlugs = [
    'smartphone-telephone-panne-garantie-legale',
    'ordinateur-portable-panne-garantie-legale',
    'lave-linge-panne-garantie-legale',
  ].filter(s => s !== slug);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <GuideHero guide={guide} readingTime={guide.readingTime} difficulty={guide.difficulty} />

      {/* Progress Bar Mobile */}
      <GuideProgress className="lg:hidden" />

      {/* TOC Mobile */}
      <GuideTOCMobile />

      {/* Layout Principal - ÉQUILIBRÉ avec 3 colonnes */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-[240px_1fr_280px] lg:gap-8 xl:gap-12">
          {/* === SIDEBAR GAUCHE : TOC === */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <GuideTOCDesktop />

              {/* Mini CTA dans TOC */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <p className="text-sm text-blue-800 mb-3 font-medium">Vous avez ce problème ?</p>
                <a
                  href="/eligibilite"
                  className="block bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Créer ma lettre
                </a>
              </div>
            </div>
          </aside>

          {/* === CONTENU CENTRAL === */}
          <main className="min-w-0">
            {/* Container optimisé pour la lecture */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Progress bar desktop intégrée */}
              <div className="hidden lg:block sticky top-20 z-30">
                <GuideProgress />
              </div>

              {/* Article avec largeur optimisée pour la lecture */}
              <article className="prose prose-lg prose-blue max-w-none px-6 py-8 sm:px-8 lg:px-12">
                {/* Largeur optimale pour la lecture : ~65-75 caractères par ligne */}
                <div className="max-w-4xl mx-auto">
                  {guide.sections.map((section, index) => (
                    <section
                      key={section.id}
                      id={section.id}
                      className="scroll-mt-24 mb-16 relative"
                    >
                      {/* Séparateur visuel entre sections */}
                      {index > 0 && <div className="border-t border-gray-200 pt-16 -mt-8" />}

                      {/* Contenu de la section */}
                      <div className="not-prose">{section.content}</div>

                      {/* CTA contextuel après certaines sections importantes */}
                      {(section.id === 'droits' || section.id === 'procedure') && (
                        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                          <div className="text-center">
                            <h3 className="text-lg font-semibold text-blue-900 mb-2">
                              Vous êtes dans cette situation ?
                            </h3>
                            <p className="text-blue-700 mb-4 text-sm">
                              Nos outils générateur automatiquement votre lettre personnalisée
                            </p>
                            <a
                              href="/eligibilite"
                              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                            >
                              🚀 Générer ma lettre maintenant
                            </a>
                          </div>
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              </article>
            </div>
          </main>

          {/* === SIDEBAR DROITE : ÉLÉMENTS CONTEXTUELS === */}
          <aside className="hidden lg:block">
            <GuideRightSidebar guide={guide} />
          </aside>
        </div>
      </div>

      {/* Guides liés */}
      <RelatedGuides currentGuide={guide} relatedSlugs={relatedSlugs} />

      {/* CTA final */}
      <FinalCTASection />

      {/* Composants dev */}
      <DevToolbar />
      <DevEditButton slug={slug} className="mb-20 sm:mb-4" />
    </div>
  );
}

// Métadonnées inchangées...
export async function generateMetadata({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getFullGuide(slug);

  if (!guide) {
    return {
      title: 'Guide non trouvé',
      description: "Ce guide n'existe pas ou n'est plus disponible.",
    };
  }

  return {
    title: guide.metadata.seo?.title || guide.metadata.title,
    description: guide.metadata.seo?.description || 'Guide pratique Je me défends',
    keywords: guide.metadata.seo?.keywords?.join(', '),
    openGraph: {
      title: guide.metadata.title,
      description: guide.metadata.seo?.description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.metadata.title,
      description: guide.metadata.seo?.description,
    },
  };
}

export async function generateStaticParams() {
  return [
    { slug: 'garantie-legale-conformite-guide-complet' },
    { slug: 'smartphone-telephone-panne-garantie-legale' },
    { slug: 'ordinateur-portable-panne-garantie-legale' },
  ];
}
