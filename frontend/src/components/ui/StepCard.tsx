// src/components/ui/StepCard.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type StepCardProps = {
  icon: React.ReactNode;
  title: React.ReactNode;
  desc: React.ReactNode;
  time?: React.ReactNode;
  className?: string;
};

export function StepCard({ icon, title, desc, time, className }: StepCardProps) {
  return (
    <div className={cn('relative pl-16 md:pl-0 md:pt-16 h-full', className)}>
      {/* pastille icône */}
      <div className="absolute left-0 top-0 md:left-1/2 md:-translate-x-1/2 w-12 h-12 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center text-blue-600 shadow-sm z-10">
        {icon}
      </div>

      {/* card shadcn-like | h-full + flex-col = hauteur uniforme */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all h-full flex flex-col">
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="font-semibold text-slate-900 text-sm md:text-base leading-tight">
            {title}
          </h3>

          {time && (
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full whitespace-nowrap">
              {time}
            </span>
          )}
        </div>

        {/* flex-1 => toutes les cartes prennent la même hauteur */}
        <p className="text-xs md:text-sm text-slate-600 leading-relaxed flex-1">{desc}</p>
      </div>
    </div>
  );
}

export default StepCard;
