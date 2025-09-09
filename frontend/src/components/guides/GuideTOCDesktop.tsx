'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';
import { useTableOfContents } from '@/hooks/useTableOfContents';
import { useScrollOffset } from '@/hooks/useScrollOffset';

interface GuideTOCDesktopProps {
  className?: string;
}

export default function GuideTOCDesktop({ className = '' }: GuideTOCDesktopProps) {
  const { items, activeId } = useTableOfContents();
  const { scrollToElement } = useScrollOffset();

  if (items.length === 0) return null;

  return (
    <div className={`hidden lg:block ${className}`}>
      <div className="sticky top-24">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-900">Sommaire</h3>
          </div>

          {/* Navigation */}
          <nav aria-label="Sommaire du guide">
            <ul className="space-y-1 text-sm">
              {items.map(item => {
                const isActive = item.id === activeId;
                const indentClass = item.level > 2 ? 'pl-4' : item.level > 1 ? 'pl-2' : '';

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollToElement(item.id)}
                      className={`
                        w-full text-left px-2 py-1.5 rounded transition-colors
                        ${indentClass}
                        ${
                          isActive
                            ? 'text-blue-600 bg-blue-50 font-medium'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      {item.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Action rapide */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <a
              href="/eligibilite"
              className="block text-center text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg transition-colors"
            >
              Créer ma lettre
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
