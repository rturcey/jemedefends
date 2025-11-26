// src/components/ui/button.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold',
    'transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[0.98]',
    'touch-manipulation',
  ].join(' '),
  {
    variants: {
      variant: {
        // ✅ ton primary
        primary:
          'text-white shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
        // ✅ secondaire doux
        secondary: 'bg-white text-gray-900 border border-gray-200 shadow-sm hover:bg-gray-50',
        outline:
          'bg-white text-blue-700 border-2 border-blue-200 hover:bg-blue-50 hover:border-blue-300',
        ghost: 'bg-transparent text-blue-700 hover:bg-blue-50',
        destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
        link: 'bg-transparent text-blue-700 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3 text-xs rounded-lg',
        default: 'h-11 px-4 py-2',
        md: 'h-12 px-5 text-sm',
        lg: 'h-14 px-6 text-base rounded-2xl',
        icon: 'h-10 w-10 p-0 rounded-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
