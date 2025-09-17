// src/components/guides/TableComparison.tsx
'use client';

import React from 'react';

interface TableComparisonProps {
  data: Array<Record<string, any>>;
  className?: string;
}

export default function TableComparison({ data, className = '' }: TableComparisonProps) {
  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  return (
    <div className={`mb-6 ${className}`}>
      {/* Desktop: tableau avec scroll horizontal */}
      <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50">
            <tr>
              {headers.map(header => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {headers.map(header => (
                  <td
                    key={header}
                    className="px-4 py-4 text-sm text-gray-900 min-w-[120px] break-words align-top"
                  >
                    <div
                      className="leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: String(row[header] || '') }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cartes empilées */}
      <div className="sm:hidden space-y-4">
        {data.map((row, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="font-semibold text-gray-900 mb-3 pb-2 border-b border-gray-100">
              {String(row[headers[0]] || '')}
            </div>
            <div className="space-y-2">
              {headers.slice(1).map(header => (
                <div key={header} className="flex justify-between items-start gap-3">
                  <span className="text-sm font-medium text-gray-600 flex-shrink-0">{header}:</span>
                  <span
                    className="text-sm text-gray-900 text-right"
                    dangerouslySetInnerHTML={{ __html: String(row[header] || '') }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
