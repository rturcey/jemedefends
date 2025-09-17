'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Clock, CheckCircle, Scale, X } from 'lucide-react';

import { Button } from '@/components/ui';
import RelatedGuides from '@/components/guides/RelatedGuides';
import LegalReference from '@/components/ui/LegalReference';
import type { EnrichedGuide } from '@/types/guides';
import { isValidLegalArticleId, type LegalArticleId } from '@/legal/registry';
import GuideDisclaimer from '@/components/guides/GuideDisclaimer';

/* --------------------- utils refs légales --------------------- */
function collectLegalRefs(guide: any): LegalArticleId[] {
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

/* --------------------- progress (IO + rAF fallback) --------------------- */
function useReadingProgress(targetSelector = '#guide-article'): number {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const article =
      (document.querySelector(targetSelector) as HTMLElement | null) ??
      (document.querySelector('article') as HTMLElement | null);
    if (!article) return;

    const top = document.createElement('div');
    const bottom = document.createElement('div');
    top.style.cssText = 'position:relative;width:1px;height:1px;';
    bottom.style.cssText = 'position:relative;width:1px;height:1px;';
    article.prepend(top);
    article.append(bottom);

    const compute = () => {
      const rect = article.getBoundingClientRect();
      const vh = window.innerHeight;
      const articleTop = window.scrollY + rect.top;
      const h = article.offsetHeight || rect.height;
      if (h <= 0) return setProgress(0);
      const scrolled = window.scrollY + vh - articleTop;
      setProgress(Math.max(0, Math.min(100, Math.round((scrolled / h) * 100))));
    };

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(() => compute(), { threshold: [0, 0.25, 0.5, 0.75, 1] });
      io.observe(top);
      io.observe(bottom);
      const onResize = () => compute();
      window.addEventListener('resize', onResize);
      compute();
      return () => {
        io.disconnect();
        window.removeEventListener('resize', onResize);
        top.remove();
        bottom.remove();
      };
    }

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        compute();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    compute();
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      top.remove();
      bottom.remove();
    };
  }, [targetSelector]);

  return progress;
}

/* --------------------- Sidebar --------------------- */
export default function GuideRightSidebar({
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

      {/* Références légales — compact + scroll interne + modale “tout voir” */}
      {showLegal && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-600" />
              Références légales
            </h4>
          </div>

          {/* Zone compacte et scrollable dans la sidebar */}
          <div className="max-h-40 overflow-y-auto pr-1">
            <div className="flex flex-wrap gap-2">
              {legalArticleIds.map(code => (
                <LegalReference key={code} code={code} variant="badge" size="sm" />
              ))}
            </div>
          </div>
        </div>
      )}

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
