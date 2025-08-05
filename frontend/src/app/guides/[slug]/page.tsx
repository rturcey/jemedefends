// src/app/guides/[slug]/page.tsx
import type { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { ArrowRight, FileText, ChevronLeft, Share, Bookmark } from 'lucide-react';
import Link from 'next/link';

// Components
import { Reveal } from '@/components/ui';
import GuideNavigation from '@/components/guides/GuideNavigation';

// Content catalog
import { PAGES, type GuidePage } from '@/content/guides';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(PAGES).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES[slug as keyof typeof PAGES];
  if (!page) return {};
  const url = `https://jemedefends.fr/guides/${slug}`;
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.seo.title,
      description: page.seo.description,
      url,
      siteName: 'Je me défends',
      type: 'article',
    },
  };
}

// Helper catégories
function getCategoryFromSlug(slug: string): { name: string; color: string; emoji: string } {
  if (slug.includes('services-numeriques'))
    return { name: 'Services numériques', color: 'blue', emoji: '💻' };
  if (slug.includes('voiture')) return { name: 'Automobile', color: 'purple', emoji: '🚗' };
  if (slug.includes('electromenager') || slug.includes('gros-electromenager'))
    return { name: 'Électroménager', color: 'green', emoji: '🏠' };
  if (slug.includes('smartphones') || slug.includes('ordinateurs') || slug.includes('consoles'))
    return { name: 'High-Tech', color: 'indigo', emoji: '📱' };
  if (slug.includes('meubles') || slug.includes('bricolage') || slug.includes('jardinage'))
    return { name: 'Maison & Jardin', color: 'orange', emoji: '🔨' };
  if (slug.includes('jouets') || slug.includes('puericulture'))
    return { name: 'Enfants', color: 'pink', emoji: '🧸' };
  if (slug.includes('faq')) return { name: 'FAQ', color: 'yellow', emoji: '❓' };
  return { name: 'Guide général', color: 'gray', emoji: '📋' };
}

// Guides similaires → d’abord même catégorie, puis autres
function getSimilarSlugs(currentSlug: string, maxResults: number = 3): string[] {
  const currentCategory = getCategoryFromSlug(currentSlug).name;
  const all = Object.keys(PAGES).filter(s => s !== currentSlug);
  const same = all.filter(s => getCategoryFromSlug(s).name === currentCategory);
  const others = all.filter(s => getCategoryFromSlug(s).name !== currentCategory);
  return [...same, ...others].slice(0, maxResults);
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const page = PAGES[slug as keyof typeof PAGES] as GuidePage | undefined;
  if (!page) return notFound();

  const jsonLd = page.schema;
  const category = getCategoryFromSlug(slug);

  // Liste pour <GuideNavigation />
  const similarSlugs = getSimilarSlugs(slug);
  const guidesForNav = similarSlugs.map(s => ({
    slug: s,
    title: PAGES[s].title,
    description: PAGES[s].seo.description,
    category: getCategoryFromSlug(s),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {jsonLd && (
        <Script
          id={`ld-json-${slug}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* Header mobile-first - Navigation + Titre */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 sm:py-6">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <nav className="flex items-center justify-between mb-4" aria-label="Navigation">
                <Link
                  href="/guides"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Tous les guides</span>
                  <span className="sm:hidden">Guides</span>
                </Link>

                {/* Actions mobiles (placeholder) */}
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors sm:hidden"
                    aria-label="Partager"
                  >
                    <Share className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors sm:hidden"
                    aria-label="Enregistrer"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </nav>
            </Reveal>

            {/* Métadonnées - Badge catégorie + temps de lecture */}
            <Reveal delay={0.1}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-${category.color}-100 text-${category.color}-700 border border-${category.color}-200 self-start`}
                >
                  <span>{category.emoji}</span>
                  {category.name}
                </span>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>📖 2 min de lecture</span>
                  <span>🔄 Mis à jour récemment</span>
                </div>
              </div>
            </Reveal>

            {/* Titre */}
            <Reveal delay={0.2}>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                {page.title}
              </h1>
            </Reveal>

            {/* Description */}
            <Reveal delay={0.3}>
              <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
                {page.subtitle || page.seo.description}
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/eligibilite"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-none"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <span className="sm:hidden">Créer ma lettre</span>
                  <span className="hidden sm:inline">Commencer ma lettre</span>
                </Link>
                <Link
                  href="/guides"
                  className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors order-2 sm:order-none"
                >
                  ← Autres guides
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {page.sections.map((section, index) => (
            <Reveal key={section.id} delay={index * 0.1}>
              <section
                id={section.id}
                className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-6"
              >
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 leading-tight">
                  {section.title}
                </h2>
                <div
                  className="prose prose-sm sm:prose max-w-none prose-blue prose-headings:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-p:leading-relaxed prose-li:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section.html }}
                />

                {/* CTA intégré après la première section */}
                {index === 0 && !slug.includes('faq') && !slug.includes('faire-jouer') && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">
                          🚀 Dans votre situation ?
                        </h3>
                        <p className="text-xs sm:text-sm text-blue-700">
                          Générez votre lettre avec les bons articles de loi
                        </p>
                      </div>
                      <Link
                        href="/eligibilite"
                        className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm w-full sm:w-auto"
                      >
                        <FileText className="w-4 h-4" />
                        Tester mon cas
                      </Link>
                    </div>
                  </div>
                )}
              </section>
            </Reveal>
          ))}

          {/* Disclaimer */}
          <Reveal>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-xs sm:text-sm text-yellow-800">
                <strong>⚠️ Avertissement :</strong>{' '}
                {page.disclaimer ??
                  'Les informations ci-dessus sont générales et pédagogiques. Elles ne constituent pas un conseil juridique individualisé.'}
              </p>
            </div>
          </Reveal>

          {/* Guides similaires : vraie valeur ajoutée via GuideNavigation */}
          {guidesForNav.length > 0 && (
            <GuideNavigation guides={guidesForNav} title="📚 Guides similaires" />
          )}
        </div>
      </div>

      {/* CTA final - Sticky sur mobile, discret sur desktop */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0 sm:static">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:py-8">
          <Reveal>
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                ⚖️ Prêt à agir ?
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Créez votre lettre personnalisée maintenant.
              </p>
              <Link
                href="/eligibilite"
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                Commencer ma lettre
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
