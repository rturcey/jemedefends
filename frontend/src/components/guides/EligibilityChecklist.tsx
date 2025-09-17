// components/guides/EligibilityChecklist.tsx - Utilise le système existant
'use client';

import React from 'react';
import TextWithLegalRefs from '@/components/ui/TextWithLegalRefs';

interface EligibilityItem {
  title: string;
  description: string;
}

interface EligibilityChecklistProps {
  items: EligibilityItem[];
  className?: string;
}

export default function EligibilityChecklist({ items, className = '' }: EligibilityChecklistProps) {
  return (
    <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg px-4 py-3 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
        >
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0"></div>
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-gray-900 text-sm mb-1">{item.title}</h4>
              <div className="text-xs text-gray-600 leading-relaxed">
                <TextWithLegalRefs text={item.description} variant="tooltip" size="sm" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
