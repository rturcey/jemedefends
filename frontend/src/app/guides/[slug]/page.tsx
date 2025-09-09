// frontend/src/app/guides/[slug]/page.tsx - FIX SSR
// Solution : generateStaticParams + métadonnées simplifiées

import type { Metadata } from 'next';

import GuideDetailClient from './guide-detail-client';

type Params = { slug: string };

// SOLUTION 1 : Pré-génération statique de toutes les routes
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  // Import dynamique pour éviter les erreurs SSR
  try {
    const { ALL_GUIDES } = await import('@/content/guides');
    const slugs = Object.keys(ALL_GUIDES || {});

    console.log(`📦 generateStaticParams: ${slugs.length} routes pré-générées`);

    return slugs.map(slug => ({ slug }));
  } catch (error) {
    console.error('❌ Erreur generateStaticParams:', error);
    // Fallback : routes communes
    return [
      { slug: 'garantie-legale-conformite-guide-complet' },
      { slug: 'smartphone-ecran-batterie-defaut-garantie-legale' },
      { slug: 'ordinateur-portable-panne-garantie-legale' },
    ];
  }
}

// SOLUTION 2 : Métadonnées simplifiées sans dépendance ALL_GUIDES côté serveur
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;

  // Métadonnées basiques générées depuis le slug (sans ALL_GUIDES)
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) + ' - Je me défends';

  const description = `Guide pratique sur ${slug.replace(/-/g, ' ')} : vos droits, recours et garantie légale de conformité.`;

  return {
    title,
    description,
    keywords: ['garantie légale', 'conformité', 'consommateur', 'recours'],
    alternates: {
      canonical: `https://jemedefends.fr/guides/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://jemedefends.fr/guides/${slug}`,
      siteName: 'Je me défends',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

// SOLUTION 3 : Page qui fonctionne côté client
export default async function GuideDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  console.log(`🔍 Page server pour guide: ${slug}`);

  // Le composant client va gérer le chargement du contenu
  return <GuideDetailClient slug={slug} />;
}
