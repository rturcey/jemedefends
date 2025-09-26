'use client';

import { Menu, X, ChevronDown } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';

import { useScrollOffset } from '@/hooks/useScrollOffset';
import { useTableOfContents } from '@/hooks/useTableOfContents';

type TOCItem = { id: string; title: string; level: number };
type TOCNode = { id: string; title: string; children: TOCItem[] };

function buildTree(items: TOCItem[], topLevel = 2): TOCNode[] {
  const tree: TOCNode[] = [];
  let current: TOCNode | null = null;
  for (const it of items) {
    if (it.level <= topLevel) {
      current = { id: it.id, title: it.title, children: [] };
      tree.push(current);
    } else if (current) {
      current.children.push(it);
    }
  }
  return tree;
}

interface GuideTOCMobileProps {
  className?: string;
}

export default function GuideTOCMobile({ className = '' }: GuideTOCMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { items, activeId } = useTableOfContents();
  const { scrollToElement } = useScrollOffset();
  const tree = React.useMemo(() => buildTree(items, 2), [items]);

  // Ouverture/fermeture du panneau (pas d'événement global)
  const toggleTOC = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  // Afficher/masquer le header mobile selon le scroll
  // + émettre "toc:header" (visible = true/false) pour la barre de progression mobile
  useEffect(() => {
    let ticking = false;

    const update = () => {
      const visible = window.scrollY > window.innerHeight * 0.5;
      setIsVisible(prev => (prev !== visible ? visible : prev));
      window.dispatchEvent(new CustomEvent('toc:header', { detail: { visible } }));
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };

    // initial compute + notify
    update();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer avec Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // Auto-open sur la section active
  useEffect(() => {
    if (!activeId || tree.length === 0) return;
    if (tree.some(n => n.id === activeId)) setExpandedId(activeId);
    else {
      const parent = tree.find(n => n.children.some(c => c.id === activeId));
      if (parent) setExpandedId(parent.id);
    }
  }, [activeId, tree]);

  const jump = useCallback(
    (id: string) => {
      scrollToElement(id);
      toggleTOC(false);
    },
    [scrollToElement, toggleTOC],
  );

  if (!tree.length) return null;

  return (
    <>
      {/* Header fixe mobile */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        } ${className}`}
        style={{ height: '48px' }}
      >
        <div className="h-full px-4 flex items-center justify-between">
          <button
            onClick={() => toggleTOC(!isOpen)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors min-h-[44px]"
            aria-expanded={isOpen}
            aria-controls="mobile-toc-panel"
            aria-label={isOpen ? 'Fermer le sommaire' : 'Ouvrir le sommaire'}
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            <span>Sommaire</span>
            {!isOpen && <span className="text-xs text-gray-500">({tree.length})</span>}
          </button>

          <div className="text-xs text-gray-500 truncate max-w-[120px]">
            {activeId &&
              (tree.find(n => n.id === activeId)?.title ||
                tree.find(n => n.children.some(c => c.id === activeId))?.title)}
          </div>
        </div>
      </div>

      {/* Panneau déroulant */}
      {isOpen && (
        <div
          id="mobile-toc-panel"
          className="lg:hidden fixed top-12 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-lg max-h-[60vh] overflow-y-auto"
          role="dialog"
          aria-labelledby="toc-title"
        >
          <div className="py-3">
            <h3 id="toc-title" className="sr-only">
              Sommaire du guide
            </h3>

            <ul className="divide-y divide-gray-100">
              {tree.map(node => {
                const isExpanded = expandedId === node.id;
                const isParentActive = node.id === activeId;

                return (
                  <li key={node.id} className="px-2">
                    {/* Ligne parent */}
                    <button
                      onClick={() => {
                        setExpandedId(cur => (cur === node.id ? null : node.id));
                        jump(node.id);
                      }}
                      className={`w-full flex items-center justify-between gap-2 py-2 text-left text-sm ${
                        isParentActive ? 'text-blue-700 font-semibold' : 'text-gray-800'
                      }`}
                      aria-expanded={isExpanded}
                      aria-controls={`mtoc-children-${node.id}`}
                    >
                      <span className="truncate">{node.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isExpanded ? 'rotate-180 text-blue-700' : 'text-gray-400'
                        }`}
                      />
                    </button>

                    {/* Enfants */}
                    {node.children.length > 0 && (
                      <div
                        id={`mtoc-children-${node.id}`}
                        className={`overflow-hidden transition-[max-height,opacity] duration-200 ease-in-out ${
                          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <ul className="pb-2 pl-3">
                          {node.children.map(child => {
                            const isChildActive = child.id === activeId;
                            return (
                              <li key={child.id}>
                                <button
                                  onClick={() => jump(child.id)}
                                  className={`w-full text-left text-sm px-2 py-1.5 rounded my-0.5 ${
                                    isChildActive
                                      ? 'text-blue-700 bg-blue-50 font-medium'
                                      : 'text-gray-600 hover:text-blue-700 hover:bg-gray-50'
                                  }`}
                                >
                                  {child.title}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/20"
          onClick={() => toggleTOC(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
