// src/components/ui/FeatureGrid.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { FeatureCard } from '@/components/ui/FeatureCard';

export type FeatureItem = {
  icon: React.ReactNode;
  label: React.ReactNode;
  className?: string;
};

export interface FeatureGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items: FeatureItem[];
  columns?: 2 | 3 | 4;
}

export function FeatureGrid({ items, columns = 3, className, ...props }: FeatureGridProps) {
  const colsClass = columns === 2 ? 'grid-cols-2' : columns === 4 ? 'grid-cols-4' : 'grid-cols-3';

  return (
    <div className={cn('grid gap-3 sm:gap-4 max-w-2xl', colsClass, className)} {...props}>
      {items.map((it, i) => (
        <FeatureCard key={i} icon={it.icon} label={it.label} className={it.className} />
      ))}
    </div>
  );
}

export default FeatureGrid;
