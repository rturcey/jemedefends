'use client';

import React, { useMemo } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import RelatedGuides from '@/components/guides/RelatedGuides';
import GuideDisclaimer from '@/components/guides/GuideDisclaimer';
import type { EnrichedGuide } from '@/types/guides';
import { isValidLegalArticleId, type LegalArticleId } from '@/legal/registry';

// Composant pour le contenu de la barre latérale droite
// Affiche les informations du guide

function collectLegalRefs(guide: EnrichedGuide): LegalArticleId[] {
  const bag: string[] = [];

  // Source de vérité modèle
  if (Array.isArray(guide?.legal?.mainArticles)) bag.push(...guide.legal.mainArticles);
  for (const s of guide?.sections ?? []) {
    if (Array.isArray(s?.legalReferences)) bag.push(...s.legalReferences);
  }

  // Fallback texte (pour anciens YAML uniquement)
  const textBlobs: string[] = (guide?.sections ?? [])
    .map((s: any) => (typeof s?.content === 'string' ? s.content : ''))
    .filter(Boolean);
  if (textBlobs.length) {
    const all = textBlobs.join(' ');
    const matches = all.match(/(?:L|R|D)\.\d{1,4}-\d+|art\.?\s*\d{1,4}/gi) || [];
    bag.push(...matches.map(m => m.trim()));
  }

  const ids = bag.filter(isValidLegalArticleId) as LegalArticleId[];
  return Array.from(new Set(ids));
}

export default function GuideRightSidebarContent({
  guide,
  className = '',
}: {
  guide: EnrichedGuide;
  className?: string;
}) {
  const legalArticleIds = useMemo(() => collectLegalRefs(guide), [guide]);
  const showLegal = legalArticleIds.length > 0;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Infos */}
      <div className="mb-4">
        <GuideDisclaimer variant="compact" />
      </div>

      <div className="hidden md:block bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          Informations
        </h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Temps de lecture</span>
            <span className="font-medium">{guide.readingTime} min</span>
          </div>
          {guide?.legal?.lastUpdated && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Dernière mise à jour</span>
              <span className="font-medium">
                {new Date(guide.legal.lastUpdated).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Références légales</span>
            <span className="font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-600" />
              {showLegal ? `${legalArticleIds.length}` : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Guides connexes */}
      {guide.relatedGuides && guide.relatedGuides.length > 0 && (
        <RelatedGuides
          currentGuide={guide}
          relatedSlugs={guide.relatedGuides}
          variant="sidebar"
          maxItems={3}
        />
      )}
    </div>
  );
}
