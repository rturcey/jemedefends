'use client';

import React from 'react';
import { Clock } from 'lucide-react';
import { useTocStable } from '@/hooks/useTocStable';
import type { GuideRightSidebarProps } from '@/types/guide-components';
import RelatedGuides from '@/components/guides/RelatedGuides';
import GuideDisclaimer from '@/components/guides/GuideDisclaimer';

// Composant pour le contenu de la barre latérale
// Utilise useTocStable pour obtenir les données du sommaire
export default function GuideSidebarContent({
  relatedGuides,
  onGuideNavigate,
  className = '',
  selector = 'main article',
}: Omit<GuideRightSidebarProps, 'tableOfContents'> & { selector?: string }) {
  // Utilise le même hook que GuideTOCDesktop pour la cohérence
  const { items: tableOfContents } = useTocStable(selector);

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
            <span className="text-gray-600">Sommaire</span>
            <span className="font-medium">{tableOfContents.length} sections</span>
          </div>
        </div>
      </div>
      
      {/* Guides connexes */}
      {relatedGuides && relatedGuides.length > 0 && (
        <RelatedGuides
          guides={relatedGuides}
          variant="sidebar"
          maxItems={3}
        />
      )}
    </div>
  );
}