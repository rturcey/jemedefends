// components/guides/OptionsTable.tsx - Utilise le système existant
'use client';

import React from 'react';

import TextWithLegalRefs from '@/components/legal/TextWithLegalRefs';

interface TableOption {
  option: string;
  when: string;
  cost: string;
  delay: string;
  details: string;
}

interface OptionsTableProps {
  data: TableOption[];
  className?: string;
}

// Fonction pour vérifier si le contenu est vide ou inutile
const isEmptyContent = (content: string) => {
  return (
    !content ||
    content === '—' ||
    content === 'undefined' ||
    content.trim() === '' ||
    content.toLowerCase() === 'undefined'
  );
};

// Composant pour une ligne de détail
const DetailLine: React.FC<{ label: string; content: string; isLast?: boolean }> = ({
  label,
  content,
  isLast = false,
}) => {
  if (isEmptyContent(content)) return null;

  return (
    <div className={`flex gap-2 text-xs ${!isLast ? 'mb-1' : ''}`}>
      <span className="text-gray-500 font-medium min-w-[35px] shrink-0">{label}:</span>
      <div className="flex-1 min-w-0 text-gray-800">
        <TextWithLegalRefs text={content} variant="tooltip" size="sm" />
      </div>
    </div>
  );
};

export default function OptionsTable({ data, className = '' }: OptionsTableProps) {
  return (
    <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-2 ${className}`}>
      {data.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
        >
          {/* Titre avec indicateur coloré */}
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
            <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
            <h4 className="font-semibold text-blue-900 text-sm">{item.option}</h4>
          </div>

          {/* Détails compacts */}
          <div className="space-y-1">
            <DetailLine label="Quand" content={item.when} />
            <DetailLine label="Coût" content={item.cost} />
            <DetailLine label="Délai" content={item.delay} />

            {/* Précisions seulement si pertinentes */}
            {!isEmptyContent(item.details) && (
              <div className="pt-2 border-t border-gray-100">
                <div className="text-xs text-gray-700">
                  <TextWithLegalRefs text={item.details} variant="tooltip" size="sm" />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
