// src/components/guides/RelatedGuides.tsx
// Guides connexes utilisant le composant GuideCard existant - VERSION CORRIGÉE

'use client';

import { BookOpen } from 'lucide-react';
import React from 'react';

import GuideCard from '@/components/guides/GuideCard';
import Container from '@/components/ui/Container';
import Section from '@/components/ui/Section';
import Button from '@/components/ui/Button';

// CORRECTION : Import depuis le bon fichier
import {
  getFullGuide,
  calculateReadingTime,
  calculateDifficulty,
  getCategoryFromSlug,
} from '@/lib/guide-registry';
import type { GuidePage } from '@/types/guides';

interface RelatedGuidesProps {
  currentGuide: GuidePage & { slug: string };
  relatedSlugs: string[];
}

export default function RelatedGuides({ currentGuide, relatedSlugs }: RelatedGuidesProps) {
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
        difficulty: guide.difficulty,
        lastUpdated: new Date(guide.legal.lastUpdated),
      };
    })
    .filter(Boolean)
    .slice(0, 4); // Maximum 4 guides connexes

  if (relatedGuides.length === 0) return null;

  return (
    <Section className="bg-white border-t border-gray-200">
      <Container>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Guides connexes</h2>
          <p className="text-gray-600">Ces guides pourraient également vous intéresser</p>
        </div>

        {/* Grille de guides connexes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {relatedGuides.map(guide => (
            <GuideCard
              key={guide.slug}
              slug={guide.slug}
              title={guide.title}
              description={guide.description}
              category={guide.category}
              readingTime={guide.readingTime}
              difficulty={guide.difficulty}
              lastUpdated={guide.lastUpdated}
              isPopular={false} // À déterminer selon vos critères
              className="h-full"
            />
          ))}
        </div>

        {/* CTA vers tous les guides */}
        <div className="text-center mt-8">
          <Button variant="outline" href="/guides" className="min-h-[44px]">
            <BookOpen className="w-4 h-4 mr-2" />
            Voir tous les guides
          </Button>
        </div>
      </Container>
    </Section>
  );
}
