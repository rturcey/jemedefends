// src/components/ui/NoticeBanner.tsx
'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const noticeVariants = cva('flex items-center gap-3 px-5 py-4 rounded-2xl border shadow-md', {
  variants: {
    variant: {
      green: 'bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-green-200',
      blue: 'bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-blue-200',
      purple: 'bg-gradient-to-r from-purple-50 via-fuchsia-50 to-purple-50 border-purple-200',
    },
  },
  defaultVariants: { variant: 'green' },
});

export interface NoticeBannerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    VariantProps<typeof noticeVariants> {
  icon: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}

export function NoticeBanner({
  className,
  variant,
  icon,
  title,
  subtitle,
  ...props
}: NoticeBannerProps) {
  return (
    <div className={cn(noticeVariants({ variant }), className)} {...props}>
      <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-sm">
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-bold text-[17px] leading-tight text-gray-900">{title}</div>
        {subtitle && <div className="text-gray-700 text-xs font-medium mt-1">{subtitle}</div>}
      </div>
    </div>
  );
}

export default NoticeBanner;
