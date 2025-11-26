'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export type CalloutVariant =
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'neutral'
  | 'purple'
  | 'orange';

const VARIANT_STYLES: Record<CalloutVariant, string> = {
  info: 'bg-blue-50 border-blue-200 text-blue-950',
  success: 'bg-green-50 border-green-200 text-green-950',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-950',
  danger: 'bg-rose-50 border-rose-200 text-rose-950',
  neutral: 'bg-gray-50 border-gray-200 text-gray-900',
  purple: 'bg-purple-50 border-purple-200 text-purple-950',
  orange: 'bg-orange-50 border-orange-200 text-orange-950',
};

export type CalloutProps = {
  variant?: CalloutVariant;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export default function Callout({
  variant = 'info',
  icon,
  title,
  children,
  className,
}: CalloutProps) {
  return (
    <div
      className={cn('rounded-2xl border p-4 sm:p-5 shadow-sm', VARIANT_STYLES[variant], className)}
      role="note"
    >
      {(icon || title) && (
        <div className="flex items-start gap-2 mb-2">
          {icon && <div className="mt-0.5">{icon}</div>}
          {title && <div className="font-semibold">{title}</div>}
        </div>
      )}
      <div className="text-sm sm:text-base leading-relaxed">{children}</div>
    </div>
  );
}
