// src/components/guides/TableOfContents.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Clock } from 'lucide-react';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface Heading {
  id: string;
  text: string;
  level: number; // 1-6 pour h1-h6
  element?: HTMLElement;
}

interface TableOfContentsProps {
  headings: Heading[];
  activeId?: string;
  className?: string;
  showProgress?: boolean;
  readingTime?: number;
  collapsible?: boolean;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  headings,
  activeId,
  className = '',
  showProgress = true,
  readingTime,
  collapsible = false,
}) => {
  const [currentActiveId, setCurrentActiveId] = useState(activeId || '');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { isMobile, shouldUseSimpleAnimations } = useMobileOptimization();

  // Intersection Observer pour détecter la section active
  useEffect(() => {
    const headingElements = headings
      .map(heading => document.getElementById(heading.id))
      .filter(Boolean) as HTMLElement[];

    if (headingElements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      entries => {
        // Trouver l'élément le plus visible
        const visibleEntries = entries.filter(entry => entry.isIntersecting);

        if (visibleEntries.length > 0) {
          // Prendre le premier élément visible (le plus haut)
          const topEntry = visibleEntries.reduce((prev, current) =>
            prev.boundingClientRect.top < current.boundingClientRect.top ? prev : current
          );
          setCurrentActiveId(topEntry.target.id);
        }
      },
      {
        rootMargin: '-20% 0px -35% 0px', // Zone d'activation optimisée
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    headingElements.forEach(element => {
      observerRef.current?.observe(element);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [headings]);

  // Progress de lecture
  useEffect(() => {
    if (!showProgress) return;

    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.scrollY;
      const progress = Math.min(100, Math.max(0, (scrollTop / documentHeight) * 100));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call

    return () => window.removeEventListener('scroll', updateProgress);
  }, [showProgress]);

  // Smooth scroll vers section
  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId);
    if (element) {
      const offsetTop = element.offsetTop - (isMobile ? 80 : 100); // Compensation header sticky

      window.scrollTo({
        top: offsetTop,
        behavior: shouldUseSimpleAnimations ? 'auto' : 'smooth',
      });

      // Fermer sur mobile après clic
      if (isMobile && collapsible) {
        setIsCollapsed(true);
      }
    }
  };

  // Filtrer les headings par niveau pour l'indentation
  const getIndentClass = (level: number) => {
    const indents = {
      1: 'pl-0',
      2: 'pl-3',
      3: 'pl-6',
      4: 'pl-9',
      5: 'pl-12',
      6: 'pl-15',
    };
    return indents[level as keyof typeof indents] || 'pl-0';
  };

  // Taille de texte selon le niveau
  const getTextSizeClass = (level: number) => {
    const sizes = {
      1: 'text-base font-semibold',
      2: 'text-sm font-medium',
      3: 'text-sm',
      4: 'text-xs',
      5: 'text-xs',
      6: 'text-xs',
    };
    return sizes[level as keyof typeof sizes] || 'text-sm';
  };

  if (headings.length === 0) return null;

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      {/* Header avec progress */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Sommaire</h3>
          </div>

          {collapsible && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
              aria-label={isCollapsed ? 'Développer le sommaire' : 'Réduire le sommaire'}
            >
              {isCollapsed ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
        </div>

        {/* Informations de lecture */}
        {(readingTime || showProgress) && (
          <div className="mt-3 space-y-2">
            {readingTime && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>~{readingTime} min de lecture</span>
              </div>
            )}

            {showProgress && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Progression</span>
                  <span>{Math.round(scrollProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${scrollProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Liste des sections */}
      {!isCollapsed && (
        <div className="max-h-80 sm:max-h-96 overflow-y-auto">
          <nav className="p-2">
            <ul className="space-y-1">
              {headings.map((heading, index) => (
                <li key={heading.id}>
                  <button
                    onClick={() => scrollToHeading(heading.id)}
                    className={`
                      w-full text-left p-2 rounded-lg transition-all duration-200
                      min-h-[44px] touch-manipulation
                      ${getIndentClass(heading.level)}
                      ${getTextSizeClass(heading.level)}
                      ${
                        currentActiveId === heading.id
                          ? 'bg-blue-50 text-blue-700 border-l-3 border-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                      ${shouldUseSimpleAnimations ? '' : 'hover:translate-x-1'}
                    `}
                  >
                    <span className="line-clamp-2 leading-relaxed">{heading.text}</span>

                    {/* Indicateur de niveau pour les sous-sections */}
                    {heading.level > 2 && (
                      <span className="inline-block w-1 h-1 bg-gray-400 rounded-full ml-2" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {/* Footer avec raccourci clavier */}
      {!isMobile && !isCollapsed && (
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            Utilisez les touches ↑↓ pour naviguer
          </div>
        </div>
      )}
    </div>
  );
};

export default TableOfContents;

// Hook pour auto-générer les headings depuis le contenu
export const useTableOfContents = () => {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    // Récupérer tous les headings de la page
    const headingElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    const headingsList: Heading[] = Array.from(headingElements).map((element, index) => {
      const heading = element as HTMLHeadingElement;
      const level = parseInt(heading.tagName.substring(1));

      // Générer un ID si il n'existe pas
      if (!heading.id) {
        const id = `heading-${index}-${heading.textContent
          ?.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '')}`;
        heading.id = id;
      }

      return {
        id: heading.id,
        text: heading.textContent || '',
        level,
        element: heading,
      };
    });

    setHeadings(headingsList);
  }, []);

  return headings;
};

// Composant Skeleton pour TableOfContents
export const TableOfContentsSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
    {/* Header skeleton */}
    <div className="p-4 border-b border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
      </div>

      {/* Progress skeleton */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 animate-pulse" />
      </div>
    </div>

    {/* Liste skeleton */}
    <div className="p-2 space-y-1">
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className={`h-10 bg-gray-200 rounded-lg animate-pulse ${i % 3 === 0 ? 'ml-3' : ''}`}
          style={{
            width: `${80 + i * 15}%`,
            marginLeft: i % 3 === 0 ? '12px' : i % 2 === 0 ? '24px' : '0',
          }}
        />
      ))}
    </div>
  </div>
);
