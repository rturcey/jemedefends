'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type SectionCardProps = {
  id?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
};

export default function SectionCard({
  id,
  title,
  subtitle,
  icon,
  children,
  className,
  headerClassName,
  contentClassName,
}: SectionCardProps) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div
          className={cn(
            'flex items-start gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100',
            headerClassName,
          )}
        >
          {icon && (
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              {icon}
            </div>
          )}

          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-snug">{subtitle}</p>
            )}
          </div>
        </div>

        <div className={cn('px-4 sm:px-6 py-4 sm:py-5 text-gray-800', contentClassName)}>
          {children}
        </div>
      </div>
    </section>
  );
}
