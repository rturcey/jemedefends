import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isInvalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, isInvalid, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={isInvalid ?? (props as any)['aria-invalid']}
      className={cn(
        'block h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
        'text-gray-900 placeholder:text-gray-500',
        'focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500/30',
        className
      )}
      {...props}
    />
  )
);

export default Input;
