// src/components/ui/TrustFooter.tsx
'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export function TrustFooter({
  icon,
  children,
  className,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-x-0 -bottom-8 h-20 bg-gradient-to-b from-transparent via-blue-50/30 to-blue-50/50 pointer-events-none" />
      <div className="flex items-center justify-center gap-2 text-xs text-gray-600 pt-4 pb-6">
        {icon}
        <span>{children}</span>
      </div>
    </div>
  );
}

export default TrustFooter;
