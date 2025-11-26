'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export function FeatureCard({
  icon,
  label,
  className,
}: {
  icon: React.ReactNode;
  label: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3 rounded-xl border border-gray-200',
        'bg-gradient-to-b from-white to-gray-50/50 px-3 py-4 text-center shadow-sm',
        'hover:shadow-md transition-all',
        className,
      )}
    >
      <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">{icon}</div>
      <div className="text-xs font-semibold text-gray-800 leading-tight">{label}</div>
    </div>
  );
}

export default FeatureCard;
