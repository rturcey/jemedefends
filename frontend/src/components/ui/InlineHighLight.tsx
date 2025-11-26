// src/components/ui/InlineHighlight.tsx
'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const highlightVariants = cva('inline-flex items-center px-2.5 py-1 rounded-lg font-bold text-sm', {
  variants: {
    variant: {
      green: 'bg-green-50 text-green-900',
      blue: 'bg-blue-50 text-blue-900',
      gray: 'bg-gray-100 text-gray-900',
    },
  },
  defaultVariants: { variant: 'green' },
});

export function InlineHighlight({
  variant,
  className,
  children,
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof highlightVariants>) {
  return <span className={cn(highlightVariants({ variant }), className)}>{children}</span>;
}

export default InlineHighlight;
