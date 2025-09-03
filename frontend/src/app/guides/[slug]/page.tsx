import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllOptimizedGuides } from '@/content/guides';
import GuideDetailClient from './guide-detail-client'; // CHANGEMENT: nom de fichier correct

type GuideDetailPageParams = {
  params: {
    slug: string;
  };
};

const PAGES = getAllOptimizedGuides();

// Métadonnées côté serveur
export async function generateMetadata({ params }: GuideDetailPageParams): Promise<Metadata> {
  const { slug } = await params;
  const guide = PAGES[slug];

  if (!guide) {
    return {
      title: 'Guide introuvable - Je me défends',
      description: "Ce guide n'existe pas.",
    };
  }

  return {
    title: `${guide.title} - Je me défends`,
    description: guide.description,
    keywords: guide.keywords || [],
    alternates: {
      canonical: `https://jemedefends.fr/guides/${slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: `https://jemedefends.fr/guides/${slug}`,
      siteName: 'Je me défends',
      type: 'article',
    },
  };
}

// Composant serveur minimal — wrapper
export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // ✅ ici ok car fonction async
  const guide = PAGES[slug];

  if (!guide) {
    notFound();
  }

  return <GuideDetailClient slug={slug} guide={guide} />;
}
