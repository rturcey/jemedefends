// src/app/(site)/guide/[slug]/page.tsx
// Page guide individuelle avec structure harmonisée

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

// Composants
import GuideHero from '@/components/guides/GuideHero';
import GuideNavigation from '@/components/guides/GuideNavigation';
import GuideSection from '@/components/guides/GuideSection';
import GuideRightSidebar from '@/components/guides/GuideRightSidebar';
import GuideTOCMobile from '@/components/guides/GuideTOCMobile';
import GuideDisclaimer from '@/components/guides/GuideDisclaimer';

// Hooks
import { useGuide } from '@/hooks/useGuides';

// Types
import type { GuideSection as GuideSectionType } from '@/types/guides';

// Définir les métadonnées dynamiques
export async function generateMetadata({
                                         params,
                                       }: {
  params: { slug: string };
}): Promise<Metadata> {
  const guide = await getGuideData(params.slug);

  if (!guide) {
    return {
      title: 'Guide non trouvé | Je me défends',
      description: 'Le guide demandé est introuvable.',
    };
  }

  return {
    title: `${guide.metadata.title} | Je me défends`,
    description: guide.metadata.seo?.description || `Guide pratique pour défendre vos droits de consommateur.`,
    keywords: guide.metadata.seo?.keywords || [],
    alternates: {
      canonical: `/guide/${guide.slug}`,
    },
    openGraph: {
      title: guide.metadata.title,
      description: guide.metadata.seo?.description || '',
      url: `https://jemedefends.fr/guide/${guide.slug}`,
      siteName: 'Je me défends',
      type: 'article',
      publishedTime: guide.legal.lastUpdated,
      modifiedTime: guide.legal.lastUpdated,
      authors: ['Je me défends'],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.metadata.title,
      description: guide.metadata.seo?.description || '',
    },
  };
}

// Composant principal
export default function GuidePage({
                                    params,
                                  }: {
  params: { slug: string };
}) {
  const guide = useGuide(params.slug);

  if (!guide) {
    notFound();
  }

  // Préparer les sections pour le rendu
  const sections: GuideSectionType[] = guide.sections.map(section => ({
    ...section,
    id: section.id,
    title: section.title,
    content: section.content,
    type: section.type,
  }));

  // Préparer les guides connexes
  const relatedGuides = guide.relatedGuides.map(relatedSlug => ({
    slug: relatedSlug,
    title: '', // sera rempli par le composant
    description: '', // sera rempli par le composant
    category: guide.category,
  }));
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header du guide */}
      <GuideHero
        title={guide.metadata.title}
        description={guide.metadata.seo?.description || ''}
        category={guide.category}
        readingTime={guide.readingTime}
        lastUpdated={new Date(guide.legal.lastUpdated)}
        onGenerateLetter={() => {
          // Rediriger vers le formulaire d'éligibilité
          window.location.href = '/eligibilite';
        }}
      />

      {/* Navigation */}
      <GuideNavigation
        currentSlug={guide.slug}
        relatedGuides={relatedGuides}
      />

      {/* Contenu principal */}
      <div className="flex flex-col lg:flex-row gap-8 py-8">
        <div className="lg:flex-1 px-4">
          {sections.map((section, index) => (
            <GuideSection
              key={section.id || index}
              section={section}
            />
          ))}

          {/* Disclaimer */}
          <GuideDisclaimer
            lastUpdated={new Date(guide.legal.lastUpdated)}
          />
        </div>

        {/* Sidebar droite (desktop) */}
        <GuideRightSidebar
          tableOfContents={sections.map(s => ({
            id: s.id,
            title: s.title || '',
            level: 2,
          }))}
          relatedGuides={relatedGuides}
        />
      </div>

      {/* TOC mobile */}
      <GuideTOCMobile />
    </div>
  );
}

// Fonction utilitaire pour récupérer les données du guide
async function getGuideData(slug: string) {
  // Cette fonction serait utilisée dans generateMetadata
  // pour récupérer les données du guide côté serveur
  // Pour l'instant, on utilise le hook côté client

  // Dans une implémentation complète, on utiliserait :
  // const { getFullGuide } = require('@/lib/guide-registry');
  // return getFullGuide(slug);

  return null; // Placeholder pour le typage
}
