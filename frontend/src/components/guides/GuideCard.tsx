// src/components/guides/GuideCard.tsx
// MODIFIÉ - Utilise icon-utils au lieu des emojis

'use client';

import { Clock, TrendingUp, Star, ArrowRight, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { formatDate } from '@/lib/guide-utils';
import { getIconFromCategoryId } from '@/lib/icon-utils';
import { GuideCategory } from '@/types/guides';

interface Category {
  name: string;
  color: string;
}

interface GuideCardProps {
  slug: string;
  title: string;
  description: string;
  category: GuideCategory;
  readingTime: number;
  lastUpdated: Date;
  image?: string;
  viewCount?: number;
  className?: string;
  // ❌ PLUS DE DIFFICULTY - supprimé comme demandé
}

const getCategoryColors = (color: string) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    green: 'bg-green-100 text-green-700 border-green-200',
    indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    pink: 'bg-pink-100 text-pink-700 border-pink-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    gray: 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return colors[color as keyof typeof colors] || colors.gray;
};

const GuideCard: React.FC<GuideCardProps> = ({
                                               slug,
                                               title,
                                               description,
                                               category,
                                               readingTime,
                                               lastUpdated,
                                               image,
                                               viewCount,
                                               className = '',
                                             }) => {
  const { isMobile, shouldUseSimpleAnimations } = useMobileOptimization();

  return (
    <Link
      href={`/guides/${slug}`}
      className={`
        group block w-full
        bg-white border border-gray-200 rounded-xl overflow-hidden
        hover:border-blue-300 hover:shadow-lg
        transition-all duration-200
        min-h-[44px] touch-manipulation
        ${shouldUseSimpleAnimations ? '' : 'hover:scale-[1.02]'}
        active:scale-98 sm:active:scale-100
        ${className}
      `}
    >
      {/* Image header si disponible */}
      {image && (
        <div className="relative h-32 sm:h-40 bg-gray-100 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Contenu principal */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Header avec catégorie seulement (plus de difficulté) */}
        <div className="flex items-center justify-between gap-2">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${getCategoryColors(category.color)}`}
          >
            {/* UTILISE LA NOUVELLE FONCTION CENTRALISÉE */}
            {getIconFromCategoryId(category.id, 'sm')}
            <span
              className="truncate max-w-24 sm:max-w-none">{category.name}</span>
          </div>
        </div>

        {/* Titre */}
        <h3
          className="font-bold text-gray-900 text-lg sm:text-xl leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Métadonnées */}
        <div
          className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readingTime} min</span>
          </div>

          {viewCount && (
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>
                {viewCount > 1000 ? `${(viewCount / 1000).toFixed(1)}k` : viewCount} lectures
              </span>
            </div>
          )}
        </div>

        {/* Footer avec date et CTA */}
        <div
          className="flex items-center justify-between pt-2 border-t border-gray-100">
          {/* UTILISE formatDate EXISTANT */}
          <span
            className="text-xs text-gray-500">{formatDate(lastUpdated)}</span>

          <div
            className="flex items-center gap-1 text-blue-600 group-hover:text-blue-700 font-medium text-xs sm:text-sm">
            <span className="hidden sm:inline">Lire</span>
            <ArrowRight
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GuideCard;

// Composant Skeleton pour GuideCard
export const GuideCardSkeleton: React.FC<{
  className?: string;
}> = ({ className = '' }) => (
  <div
    className={`bg-white border border-gray-200 rounded-xl overflow-hidden ${className}`}>
    {/* Image skeleton */}
    <div className="h-32 sm:h-40 bg-gray-200 animate-pulse" />

    {/* Content skeleton */}
    <div className="p-4 sm:p-5 space-y-3">
      {/* Badges */}
      <div className="flex items-center justify-between">
        <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
      </div>

      {/* Titre */}
      <div className="space-y-2">
        <div className="h-6 bg-gray-200 rounded w-4/5 animate-pulse" />
        <div className="h-6 bg-gray-200 rounded w-3/5 animate-pulse" />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
      </div>

      {/* Métadonnées */}
      <div className="flex gap-3">
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
      </div>

      {/* Footer */}
      <div className="flex justify-between pt-2 border-t border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
      </div>
    </div>
  </div>
);
