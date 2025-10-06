// src/components/guides/RelatedGuides.tsx
// MODIFIÉ - Version finale avec icônes et double usage

'use client';

import { BookOpen, Clock, ExternalLink } from 'lucide-react';
import React from 'react';

import GuideCard from '@/components/guides/GuideCard';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { getFullGuide } from '@/lib/guide-registry';
import { getIconFromName } from '@/lib/icon-utils';
import type { GuidePage } from '@/types/guides';

interface RelatedGuidesProps {
  currentGuide: GuidePage & { slug: string };
  relatedSlugs: string[];
  variant?: 'sidebar' | 'section';
  maxItems?: number;
  className?: string;
}

export default function RelatedGuides({
  currentGuide,
  relatedSlugs,
  variant = 'section',
  maxItems,
  className = '',
}: RelatedGuidesProps) {
  const { isMobile } = useMobileOptimization();

  const getMaxItems = () => {
    if (maxItems) return maxItems;
    return variant === 'sidebar' ? 3 : isMobile ? 2 : 4;
  };

  // Récupération et enrichissement des guides connexes
  const relatedGuides = relatedSlugs
    .map(slug => {
      const guide = getFullGuide(slug);
      if (!guide) return null;

      return {
        slug,
        title: guide.metadata.title,
        description: guide.metadata.seo?.description || '',
        category: guide.category,
        readingTime: guide.readingTime,
        lastUpdated: new Date(guide.legal.lastUpdated),
      };
    })
    .filter(Boolean)
    .slice(0, getMaxItems());

  if (relatedGuides.length === 0) return null;

  // Rendu pour la sidebar
  if (variant === 'sidebar') {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm ${className}`}>
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          {/* ✅ Utilise l'icône depuis le système centralisé */}
          {getIconFromName('BookOpen', 'sm', 'text-blue-600')}
          Guides complémentaires
        </h4>

        <div className="space-y-3">
          {relatedGuides.map(guide => (
            <a
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="block p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors group min-h-[44px] touch-manipulation"
            >
              <h5 className="text-sm font-medium text-gray-900 group-hover:text-blue-700 mb-1 line-clamp-2">
                {guide.title}
              </h5>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{guide.readingTime} min</span>
                </div>
                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-600" />
              </div>
            </a>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200">
          <Button
            variant="ghost"
            href="/guides"
            className="w-full text-sm justify-center min-h-[44px]"
            size="sm"
            icon={<BookOpen />}
          >
            Tous les guides
          </Button>
        </div>
      </div>
    );
  }

  // Rendu pour la section complète
  return (
    <Section className={`bg-white border-t border-gray-200 ${className}`}>
      <Container>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            {/* ✅ Utilise l'icône depuis le système centralisé */}
            {getIconFromName('BookOpen', 'lg', 'text-blue-600')}
            <h2 className="text-2xl font-bold text-gray-900">Guides connexes</h2>
          </div>
          <p className="text-gray-600">Ces guides pourraient également vous intéresser</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {relatedGuides.map(guide => (
            <GuideCard
              key={guide.slug}
              slug={guide.slug}
              title={guide.title}
              description={guide.description}
              category={guide.category}
              readingTime={guide.readingTime}
              lastUpdated={guide.lastUpdated}
              className="h-full"
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" href="/guides" className="min-h-[44px]" icon={<BookOpen />}>
            Voir tous les guides
          </Button>
        </div>
      </Container>
    </Section>
  );
}
