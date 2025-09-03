// src/components/guides/GuideCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, TrendingUp, Star, ArrowRight, BookOpen } from 'lucide-react';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface Category {
  name: string;
  color: string;
  emoji: string;
}

interface GuideCardProps {
  slug: string;
  title: string;
  description: string;
  category: Category;
  readingTime: number;
  difficulty: 'facile' | 'moyen' | 'expert';
  lastUpdated: Date;
  image?: string;
  isPopular?: boolean;
  rating?: number;
  viewCount?: number;
  className?: string;
}

const GuideCard: React.FC<GuideCardProps> = ({
  slug,
  title,
  description,
  category,
  readingTime,
  difficulty,
  lastUpdated,
  image,
  isPopular = false,
  rating = 4.5,
  viewCount,
  className = '',
}) => {
  const { isMobile, shouldUseSimpleAnimations } = useMobileOptimization();

  // Couleurs de catégorie
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

  // Couleurs de difficulté
  const getDifficultyColors = (diff: string) => {
    const colors = {
      facile: 'bg-green-50 text-green-600 border-green-200',
      moyen: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      expert: 'bg-red-50 text-red-600 border-red-200',
    };
    return colors[diff as keyof typeof colors] || colors.facile;
  };

  // Formatage de la date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

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

          {/* Badges overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {isPopular && (
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500 text-white rounded-full text-xs font-medium">
                <TrendingUp className="w-3 h-3" />
                Populaire
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Header avec catégorie et difficulté */}
        <div className="flex items-center justify-between gap-2">
          <div
            className={`
            flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium
            ${getCategoryColors(category.color)}
          `}
          >
            <span className="text-sm">{category.emoji}</span>
            <span className="truncate max-w-24 sm:max-w-none">{category.name}</span>
          </div>

          <div
            className={`
            px-2 py-1 rounded-full border text-xs font-medium
            ${getDifficultyColors(difficulty)}
          `}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </div>
        </div>

        {/* Titre */}
        <h3 className="font-bold text-gray-900 text-lg sm:text-xl leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Métadonnées */}
        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readingTime} min</span>
          </div>

          {rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>{rating.toFixed(1)}</span>
            </div>
          )}

          {viewCount && (
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{viewCount > 1000 ? `${Math.floor(viewCount / 1000)}k` : viewCount} vues</span>
            </div>
          )}
        </div>

        {/* Footer avec date et CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Mis à jour {formatDate(lastUpdated)}</span>

          <div className="flex items-center gap-1 text-blue-600 font-medium text-sm group-hover:gap-2 transition-all">
            <span className="hidden sm:inline">Lire</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GuideCard;

// Composant Skeleton pour GuideCard
export const GuideCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden ${className}`}>
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
