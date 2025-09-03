// Ce fichier doit être renommé en guide-detail-client.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Star, ExternalLink, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Container, Breadcrumbs } from '@/components/ui';
import GuideNavigation from '@/components/guides/GuideNavigation';

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
  guide: Guide;
}

export default function GuideDetailClient({ slug, guide }: GuideDetailClientProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
                  Lecture 5 min
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
