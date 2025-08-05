'use client';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, FileText, ChevronLeft } from 'lucide-react';

// Content catalog
import { PAGES } from '@/content/guides';
import { Reveal } from '@/components';
import { TopFAQ } from '@/components/faq/TopFAQ';

const metadata: Metadata = {
  title: 'Guides pratiques - Garantie légale de conformité - Je me défends',
  description:
    "Découvrez tous nos guides pour faire valoir vos droits de consommateur. Garantie légale, réparation, remboursement : tout ce qu'il faut savoir.",
  alternates: { canonical: 'https://jemedefends.fr/guides' },
  openGraph: {
    title: 'Guides pratiques - Garantie légale de conformité',
    description: 'Découvrez tous nos guides pour faire valoir vos droits de consommateur.',
    url: 'https://jemedefends.fr/guides',
    siteName: 'Je me défends',
    type: 'website',
  },
};

// Helper catégories - DESIGN ORIGINAL
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

// ---- PAGE INDEX DES GUIDES - MOBILE FIRST AVEC FAQ TOP ----
export default function GuidesIndexPage() {
  const allGuides = Object.entries(PAGES).map(([slug, page]) => ({
    slug,
    ...page,
    category: getCategoryFromSlug(slug),
  }));

  // Filtrer les guides FAQ pour ne pas les dupliquer
  const guidesWithoutFAQ = allGuides.filter(guide => !guide.slug.includes('faq'));

  // Grouper par catégories (sans FAQ)
  const guidesByCategory = guidesWithoutFAQ.reduce(
    (acc, guide) => {
      const categoryName = guide.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = {
          category: guide.category,
          guides: [],
        };
      }
      acc[categoryName].guides.push(guide);
      return acc;
    },
    {} as Record<
      string,
      { category: ReturnType<typeof getCategoryFromSlug>; guides: typeof guidesWithoutFAQ }
    >
  );

  const totalGuidesCount = guidesWithoutFAQ.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mobile-first - Padding et spacing optimisés */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-6 sm:py-8 max-w-4xl mx-auto">
          {/* Breadcrumb mobile - plus compact */}
          <Reveal>
            <nav className="mb-4" aria-label="Fil d'ariane">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Accueil
              </Link>
            </nav>
          </Reveal>

          {/* Titre responsive - plus petit sur mobile */}
          <Reveal delay={0.1}>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              📚 Guides & FAQ
            </h1>
          </Reveal>

          {/* Description - plus courte sur mobile */}
          <Reveal delay={0.2}>
            <p className="text-base sm:text-lg text-gray-600 mb-6 leading-relaxed">
              Défendez vos droits de consommateur dans chaque situation.
            </p>
          </Reveal>

          {/* CTA mobile-first - pleine largeur sur mobile */}
          <Reveal delay={0.3}>
            <Link
              href="/eligibilite"
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              Commencer ma lettre
            </Link>
          </Reveal>
        </div>
      </div>

      {/* Stats rapides - nouvelles sur mobile */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 max-w-4xl mx-auto">
          <Reveal delay={0.4}>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {totalGuidesCount} guides disponibles
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>+ de 25 questions
                fréquentes
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Gratuit et sans inscription
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-4 py-6 sm:py-12 max-w-4xl mx-auto">
        <div className="space-y-8 sm:space-y-12">
          {/* FAQ Top en premier */}
          <TopFAQ />

          {/* Guides par catégories */}
          {Object.entries(guidesByCategory).map(
            ([categoryName, { category, guides }], categoryIndex) => (
              <Reveal key={categoryName} delay={(categoryIndex + 1) * 0.1}>
                <div className="space-y-4">
                  {/* Titre de catégorie - mobile optimisé */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl">{category.emoji}</span>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                        {categoryName}
                      </h2>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium self-start sm:self-auto">
                      {guides.length} guide{guides.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Grid mobile-first - 1 colonne sur mobile, 2 sur tablet+ */}
                  <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 lg:gap-6">
                    {guides.map(({ slug, title, seo }) => (
                      <Link
                        key={slug}
                        href={`/guides/${slug}`}
                        className="block p-4 sm:p-6 bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                      >
                        {/* Header de la card */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-base sm:text-lg">{category.emoji}</span>
                            {/* Badge catégorie sur mobile */}
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium sm:hidden">
                              {category.name}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                        </div>

                        {/* Titre - taille responsive */}
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                          {title}
                        </h3>

                        {/* Description - tronquée sur mobile */}
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                          {seo.description}
                        </p>

                        {/* Badge catégorie caché sur mobile, visible sur desktop */}
                        <div className="hidden sm:flex items-center mt-3 pt-3 border-t border-gray-100">
                          <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded text-xs font-medium">
                            {category.name}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            )
          )}
        </div>
      </div>

      {/* CTA final - mobile sticky bottom si nécessaire */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0 sm:static">
        <div className="px-4 py-6 sm:py-12 max-w-4xl mx-auto text-center">
          <Reveal>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              ⚖️ Prêt à agir ?
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
              Créez votre lettre personnalisée maintenant.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <Link
              href="/eligibilite"
              className="inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-5 h-5 mr-2" />
              Commencer ma lettre
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
