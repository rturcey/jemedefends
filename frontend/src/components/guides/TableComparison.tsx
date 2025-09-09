// src/components/guides/TableComparison.tsx
// Tableaux responsives avec design mobile optimisé

'use client';

import { BarChart3 } from 'lucide-react';
import React from 'react';

import TextWithLegalRefs from '@/components/ui/TextWithLegalRefs';

interface TableComparisonProps {
  data: Array<Record<string, any>>;
  title: string;
  highlightColumn?: string;
}

export default function TableComparison({ data, title, highlightColumn }: TableComparisonProps) {
  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 mb-8 bg-white">
      {/* Header du tableau */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          {title}
        </h3>
      </div>

      {/* Desktop: tableau normal */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th
                  key={column}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column === highlightColumn ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                >
                  {column.replace(/-/g, ' ').replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {columns.map(column => (
                  <td
                    key={column}
                    className={`px-6 py-4 text-sm text-gray-900 ${
                      column === highlightColumn ? 'bg-blue-50 font-medium' : ''
                    }`}
                  >
                    {renderCellContent(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards empilées */}
      <div className="lg:hidden divide-y divide-gray-200">
        {data.map((row, index) => (
          <div key={index} className="p-4 space-y-3">
            {columns.map(column => (
              <div key={column} className="flex justify-between items-start gap-4">
                <dt className="text-sm font-medium text-gray-500 capitalize flex-shrink-0 min-w-0">
                  {column.replace(/-/g, ' ').replace(/_/g, ' ')}
                </dt>
                <dd
                  className={`text-sm text-gray-900 text-right flex-1 min-w-0 ${
                    column === highlightColumn ? 'font-semibold text-blue-700' : ''
                  }`}
                >
                  {renderCellContent(row[column])}
                </dd>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Fonction pour rendre le contenu d'une cellule
function renderCellContent(content: any): React.ReactNode {
  if (content === null || content === undefined) return '-';

  const contentStr = String(content);

  // Si le contenu contient des références légales, utiliser TextWithLegalRefs
  if (contentStr.includes('L.') || contentStr.includes('art.')) {
    return <TextWithLegalRefs text={contentStr} variant="inline" className="text-sm" />;
  }

  // Gestion des emojis/symboles courants
  if (contentStr.includes('✅')) {
    return (
      <span className="inline-flex items-center gap-1 text-green-600 font-medium">
        ✅ {contentStr.replace('✅', '').trim()}
      </span>
    );
  }

  if (contentStr.includes('❌')) {
    return (
      <span className="inline-flex items-center gap-1 text-red-600 font-medium">
        ❌ {contentStr.replace('❌', '').trim()}
      </span>
    );
  }

  if (contentStr.includes('❓')) {
    return (
      <span className="inline-flex items-center gap-1 text-yellow-600 font-medium">
        ❓ {contentStr.replace('❓', '').trim()}
      </span>
    );
  }

  // Contenu normal
  return contentStr;
}
