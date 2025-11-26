// src/components/ui/KeyValue.tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

type KeyValueProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  className?: string;
};

export default function KeyValue({ label, value, className }: KeyValueProps) {
  return (
    <div className={cn('py-2 border-b border-gray-100 last:border-b-0', className)}>
      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-3">
        <div className="text-xs sm:text-sm font-semibold text-gray-500">{label}</div>
        <div className="text-sm sm:text-base text-gray-900 break-words">{value}</div>
      </div>
    </div>
  );
}
