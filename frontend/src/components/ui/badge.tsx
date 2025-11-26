// src/components/ui/badge.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        blue: 'bg-blue-50 text-blue-800 border-blue-200',
        green: 'bg-green-50 text-green-800 border-green-200',
        purple: 'bg-purple-50 text-purple-800 border-purple-200',
        yellow: 'bg-yellow-50 text-yellow-900 border-yellow-200',
        indigo: 'bg-indigo-50 text-indigo-800 border-indigo-200',
        red: 'bg-red-50 text-red-800 border-red-200',
        gray: 'bg-gray-50 text-gray-800 border-gray-200',
      },
      size: {
        sm: 'text-[11px] px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
      },
    },
    defaultVariants: {
      variant: 'blue',
      size: 'md',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
