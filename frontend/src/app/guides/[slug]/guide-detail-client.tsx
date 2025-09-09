// frontend/src/app/guides/[slug]/guide-detail-client.tsx - FIX CLIENT

'use client';

import { ArrowLeft, Clock, Star, Share2 } from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import GuideNavigation from '@/components/guides/GuideNavigation';
import { Container, Breadcrumbs } from '@/components/ui';

interface Guide {
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  sections: Array<{
    id: string;
    title: string;
    html: string;
  }>;
  disclaimer?: string;
  seo: {
    title: string;
    description: string;
  };
}

interface GuideDetailClientProps {
  slug: string;
  guide?: Guide; // Optionnel maintenant
}

export default function GuideDetailClient({ slug, guide: initialGuide }: GuideDetailClientProps) {
  const [guide, setGuide] = useState<Guide | null>(initialGuide || null);
  const [isLoading, setIsLoading] = useState(!initialGuide);
  const [error, setError] = useState<string | null>(null);

  // Chargement côté client si pas de guide initial
  useEffect(() => {
    if (initialGuide) {
      console.log(`✅ Guide ${slug} déjà fourni par le serveur`);
      return;
    }

    console.log(`🔄 Chargement côté client du guide ${slug}...`);

    const loadGuide = async () => {
      try {
        setIsLoading(true);

        // Import dynamique côté client
        const { getFullGuide } = await import('@/lib/guide-utils');
        const fullGuide = getFullGuide(slug);

        if (!fullGuide) {
          throw new Error(`Guide ${slug} non trouvé`);
        }

        // Conversion vers le format attendu
        const guideForClient: Guide = {
          slug,
          title: fullGuide.metadata.title,
          subtitle: fullGuide.metadata.subtitle,
          description: fullGuide.metadata.seo?.description || '',
          sections: fullGuide.sections.map(section => ({
            id: section.id,
            title: section.title,
            // Conversion JSX vers HTML si nécessaire
            html:
              section.html ||
              (typeof section.content === 'string'
                ? section.content
                : section.content
                  ? '[Contenu JSX - nécessite rendu côté client]'
                  : ''),
          })),
          disclaimer: fullGuide.disclaimer,
          seo: {
            title: fullGuide.metadata.seo?.title || fullGuide.metadata.title,
            description: fullGuide.metadata.seo?.description || '',
          },
        };

        setGuide(guideForClient);
        console.log(`✅ Guide ${slug} chargé côté client:`, {
          title: guideForClient.title,
          sectionsCount: guideForClient.sections.length,
        });
      } catch (err) {
        console.error(`❌ Erreur chargement guide ${slug}:`, err);
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setIsLoading(false);
      }
    };

    loadGuide();
  }, [slug, initialGuide]);

  // État de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <Container>
            <div className="px-4 py-6">
              {/* Skeleton breadcrumbs */}
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-6"></div>

              {/* Skeleton titre */}
              <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mb-6"></div>

              {/* Skeleton métadonnées */}
              <div className="flex gap-4">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </Container>
        </div>

        <Container>
          <div className="px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
                {/* Skeleton contenu */}
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i}>
                      <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // État d'erreur
  if (error || !guide) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Guide introuvable</h1>
          <p className="text-gray-600 mb-6">
            {error || `Le guide "${slug}" n'existe pas ou n'a pas pu être chargé.`}
          </p>
          <Link
            href="/guides"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux guides
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Guides', href: '/guides' },
    { label: guide.title, isCurrentPage: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="px-4 py-6">
            <Breadcrumbs items={breadcrumbItems} />

            <div className="mt-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {guide.title}
              </h1>
              {guide.subtitle && <p className="text-lg text-gray-600 mb-6">{guide.subtitle}</p>}

              {/* Métadonnées du guide */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Lecture {Math.ceil(guide.sections.length * 2)} min
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Mis à jour récemment
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Contenu du guide */}
      <Container>
        <div className="px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
              {/* Sections du guide */}
              {guide.sections.map(section => (
                <div key={section.id} className="mb-8 last:mb-0">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
                  <div
                    className="prose prose-gray max-w-none"
                    dangerouslySetInnerHTML={{ __html: section.html }}
                  />
                </div>
              ))}

              {/* Disclaimer */}
              {guide.disclaimer && (
                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div
                    className="text-sm text-yellow-800"
                    dangerouslySetInnerHTML={{ __html: guide.disclaimer }}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="/eligibilite"
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Créer ma lettre maintenant
              </Link>
              <button className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4 mr-2" />
                Partager ce guide
              </button>
            </div>
          </div>
        </div>
      </Container>

      {/* Navigation vers autres guides */}
      <GuideNavigation guides={[]} title="Guides connexes" />
    </div>
  );
}
