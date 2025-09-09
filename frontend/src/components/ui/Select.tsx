import * as React from 'react';

import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  isInvalid?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, isInvalid, children, ...props }, ref) => (
    <select
      ref={ref}
      aria-invalid={isInvalid ?? (props as any)['aria-invalid']}
      className={cn(
        'jmd-input', // même base visuelle que Input
        "pr-8 appearance-none bg-[url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")] bg-[right_0.6rem_center] bg-[length:1rem_1rem] bg-no-repeat",
        'aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500/30',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);

export default Select;
