'use client';

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTableOfContents } from '@/hooks/useTableOfContents';
import { useScrollOffset } from '@/hooks/useScrollOffset';

interface GuideTOCMobileProps {
  className?: string;
}

export default function GuideTOCMobile({ className = '' }: GuideTOCMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { items, activeId } = useTableOfContents();
  const { scrollToElement } = useScrollOffset();

  // Gérer la visibilité (après le hero)
  useEffect(() => {
    const handleScroll = () => {
      // Montrer le TOC après 50vh de scroll (sortie du hero)
      const shouldShow = window.scrollY > window.innerHeight * 0.5;
      setIsVisible(shouldShow);
    };

    handleScroll(); // Check initial
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleItemClick = (id: string) => {
    scrollToElement(id);
    setIsOpen(false);
  };

  if (items.length === 0) return null;

  return (
    <>
      {/* Header fixe mobile */}
      <div
        className={`
          lg:hidden fixed top-0 left-0 right-0 z-50
          bg-white/95 backdrop-blur-sm border-b border-gray-200
          transition-transform duration-300
          ${isVisible ? 'translate-y-0' : '-translate-y-full'}
          ${className}
        `}
        style={{ height: '48px' }}
      >
        <div className="h-full px-4 flex items-center justify-between">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            aria-expanded={isOpen}
            aria-controls="mobile-toc-panel"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>Sommaire</span>
            {!isOpen && items.length > 0 && (
              <span className="text-xs text-gray-500">({items.length})</span>
            )}
          </button>

          {/* Indicateur progression optionnel */}
          <div className="text-xs text-gray-500">
            {activeId && items.find(item => item.id === activeId)?.title.slice(0, 20)}
            {activeId && items.find(item => item.id === activeId)?.title.length > 20 && '...'}
          </div>
        </div>
      </div>

      {/* Panneau déroulant */}
      {isOpen && (
        <div
          id="mobile-toc-panel"
          className="lg:hidden fixed top-12 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-lg max-h-[60vh] overflow-y-auto"
        >
          <div className="py-4">
            <nav aria-label="Sommaire du guide">
              <ul className="space-y-1">
                {items.map(item => {
                  const isActive = item.id === activeId;
                  const indentClass = item.level > 2 ? 'pl-6' : item.level > 1 ? 'pl-3' : 'pl-4';

                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleItemClick(item.id)}
                        className={`
                          w-full text-left px-4 py-2 text-sm transition-colors
                          ${indentClass}
                          ${
                            isActive
                              ? 'text-blue-600 bg-blue-50 font-medium'
                              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
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
          </div>
        </div>
      )}

      {/* Overlay pour fermer */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/20"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Espaceur pour compenser le header fixe */}
      {isVisible && <div className="lg:hidden" style={{ height: '48px' }} />}
    </>
  );
}
