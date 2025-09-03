'use client';
import * as React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
  loading?: boolean;
  lines?: number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
}

export default function Skeleton({
  className = '',
  children,
  loading = false,
  lines = 1,
  variant = 'rectangular',
  animation = 'pulse',
}: SkeletonProps) {
  // Si pas en loading et on a des enfants, afficher les enfants
  if (!loading && children) {
    return <>{children}</>;
  }

  const baseClasses = 'bg-gray-200 dark:bg-gray-700';

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full aspect-square',
    rectangular: 'rounded',
    rounded: 'rounded-lg',
  };

  // Si en loading avec enfants, masquer le contenu mais garder les dimensions
  if (loading && children) {
    return (
      <div
        className={cn(baseClasses, animationClasses[animation], variantClasses[variant], className)}
      >
        <div className="invisible">{children}</div>
      </div>
    );
  }

  // Mode lignes multiples pour le texte
  if (lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              animationClasses[animation],
              variantClasses[variant],
              i === lines - 1 ? 'w-3/4' : 'w-full',
              'h-4',
              className
            )}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  }

  // Mode skeleton simple
  return (
    <div
      className={cn(baseClasses, animationClasses[animation], variantClasses[variant], className)}
    />
  );
}
