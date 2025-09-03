// src/components/guides/CategoryFilter.tsx
'use client';

import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface Category {
  id: string;
  name: string;
  color: string;
  emoji: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
  className?: string;
  showCounts?: boolean;
  stickyOnScroll?: boolean;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selected,
  onSelect,
  className = '',
  showCounts = true,
  stickyOnScroll = true,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const [isSticky, setIsSticky] = React.useState(false);

  const { isMobile, shouldUseSimpleAnimations } = useMobileOptimization();

  // Vérifier la capacité de scroll
  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScrollability();

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollability);
      return () => container.removeEventListener('scroll', checkScrollability);
    }
  }, [categories]);

  // Sticky scroll detection
  useEffect(() => {
    if (!stickyOnScroll) return;

    const handleScroll = () => {
      setIsSticky(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [stickyOnScroll]);

  // Scroll horizontal
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = isMobile ? 200 : 300;
      const newScrollLeft =
        direction === 'left'
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: shouldUseSimpleAnimations ? 'auto' : 'smooth',
      });
    }
  };

  // Couleurs de catégorie
  const getCategoryColors = (color: string, isSelected: boolean) => {
    const baseColors = {
      blue: isSelected
        ? 'bg-blue-600 text-white border-blue-600'
        : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
      purple: isSelected
        ? 'bg-purple-600 text-white border-purple-600'
        : 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
      green: isSelected
        ? 'bg-green-600 text-white border-green-600'
        : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
      indigo: isSelected
        ? 'bg-indigo-600 text-white border-indigo-600'
        : 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100',
      orange: isSelected
        ? 'bg-orange-600 text-white border-orange-600'
        : 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100',
      pink: isSelected
        ? 'bg-pink-600 text-white border-pink-600'
        : 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100',
      yellow: isSelected
        ? 'bg-yellow-600 text-white border-yellow-600'
        : 'bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100',
      gray: isSelected
        ? 'bg-gray-600 text-white border-gray-600'
        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100',
    };
    return baseColors[color as keyof typeof baseColors] || baseColors.gray;
  };

  return (
    <div
      className={`
      ${stickyOnScroll && isSticky ? 'sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm' : ''}
      ${className}
    `}
    >
      <div
        className={`
        ${stickyOnScroll && isSticky ? 'px-4 py-3' : 'px-4 py-6'}
        transition-all duration-200
      `}
      >
        {/* Header avec titre */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-gray-900">Catégories</h3>
          </div>

          {selected && (
            <button
              onClick={() => onSelect(null)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Tout afficher
            </button>
          )}
        </div>

        {/* Conteneur avec boutons de navigation */}
        <div className="relative">
          {/* Bouton scroll gauche */}
          {!isMobile && canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Défiler vers la gauche"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
          )}

          {/* Bouton scroll droite */}
          {!isMobile && canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Défiler vers la droite"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          )}

          {/* Scroll horizontal des catégories */}
          <div
            ref={scrollContainerRef}
            className={`
              flex gap-3 overflow-x-auto scrollbar-hide
              ${!isMobile ? 'px-10' : ''}
              scroll-smooth
            `}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitScrollbar: { display: 'none' },
            }}
          >
            {/* Bouton "Tout" */}
            <button
              onClick={() => onSelect(null)}
              className={`
                flex-shrink-0 flex items-center gap-2 px-4 py-2 border rounded-xl
                font-medium text-sm transition-all duration-200
                min-h-[44px] touch-manipulation
                ${
                  selected === null
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }
                ${shouldUseSimpleAnimations ? '' : 'hover:scale-105 active:scale-95'}
              `}
            >
              <span className="text-base">📋</span>
              <span>Tout</span>
              {showCounts && (
                <span
                  className={`
                  px-2 py-0.5 rounded-full text-xs font-medium
                  ${selected === null ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}
                `}
                >
                  {categories.reduce((sum, cat) => sum + cat.count, 0)}
                </span>
              )}
            </button>

            {/* Catégories */}
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => onSelect(category.id)}
                className={`
                  flex-shrink-0 flex items-center gap-2 px-4 py-2 border rounded-xl
                  font-medium text-sm transition-all duration-200
                  min-h-[44px] touch-manipulation
                  ${getCategoryColors(category.color, selected === category.id)}
                  ${shouldUseSimpleAnimations ? '' : 'hover:scale-105 active:scale-95'}
                `}
              >
                <span className="text-base">{category.emoji}</span>
                <span className="whitespace-nowrap">{category.name}</span>
                {showCounts && (
                  <span
                    className={`
                    px-2 py-0.5 rounded-full text-xs font-medium
                    ${
                      selected === category.id
                        ? 'bg-white/20 text-white'
                        : 'bg-white/80 text-gray-600'
                    }
                  `}
                  >
                    {category.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Gradient fade sur mobile */}
          {isMobile && (
            <>
              {canScrollLeft && (
                <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none" />
              )}
              {canScrollRight && (
                <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none" />
              )}
            </>
          )}
        </div>

        {/* Indicateur de sélection mobile */}
        {isMobile && selected && (
          <div className="mt-3 text-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
              <span>Filtré par:</span>
              <span>{categories.find(c => c.id === selected)?.name}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;

// Composant Skeleton pour CategoryFilter
export const CategoryFilterSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`px-4 py-6 ${className}`}>
    {/* Header skeleton */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
      </div>
    </div>

    {/* Catégories skeleton */}
    <div className="flex gap-3 overflow-hidden">
      {[1, 2, 3, 4, 5].map(i => (
        <div
          key={i}
          className="flex-shrink-0 h-10 bg-gray-200 rounded-xl animate-pulse"
          style={{ width: `${80 + i * 20}px` }}
        />
      ))}
    </div>
  </div>
);
