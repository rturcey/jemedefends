// src/components/guides/GuideHero.tsx
// MODIFIÉ - Fond gradient identique à FinalCTASection

'use client';

import { Clock, Scale, FileText, Zap, CheckCircle } from 'lucide-react';
import React from 'react';

import Badge from '@/components/ui/Badge';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import type { GuidePage } from '@/types/guides';
import { getCategoryWithIcon } from '@/lib/icon-utils';

interface GuideHeroProps {
  guide: GuidePage & { slug: string; readingTime: number };
  readingTime: number;
}

export default function GuideHero({ guide, readingTime }: GuideHeroProps) {
  const categoryWithIcon = getCategoryWithIcon(guide.slug, 'sm');

  return (
    <div className="relative bg-gradient-to-br from-surface-soft to-white">
      {/* Couches de fond identiques au FinalCTASection */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-40" />
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
      </div>

      <div className="relative">
        <Container className="max-w-4xl">
          <div className="px-4 py-6">
            {/* Breadcrumbs */}
            <div className="mb-3">
              <Breadcrumbs
                items={
                  guide.metadata.breadcrumb || [
                    { label: 'Accueil', href: '/' },
                    { label: 'Guides', href: '/guides' },
                    {
                      label: guide.metadata.title,
                      href: `/guides/${guide.slug}`,
                      isCurrentPage: true,
                    },
                  ]
                }
                maxItems={3}
              />
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary" className="flex items-center gap-1.5 text-xs">
                {categoryWithIcon.icon}
                <span>{categoryWithIcon.name}</span>
              </Badge>

              {guide.legal?.lastUpdated && (
                <Badge variant="success" className="flex items-center gap-1 text-xs">
                  <CheckCircle className="w-3 h-3" />À jour
                </Badge>
              )}
            </div>

            {/* Titre */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
              {guide.metadata.title}
            </h1>

            {/* Description */}
            {guide.metadata.seo?.description && (
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                {guide.metadata.seo.description}
              </p>
            )}

            {/* Métadonnées */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{readingTime} min de lecture</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Scale className="w-4 h-4" />
                <span>Références légales</span>
              </div>

              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>Guide pratique</span>
              </div>
            </div>

            {/* CTA Principal */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                href="/eligibilite"
                variant="primary"
                size="md"
                icon={<Zap className="w-4 h-4" />}
                className="flex-1 sm:flex-initial min-h-[44px] touch-manipulation"
              >
                Créer ma lettre
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
