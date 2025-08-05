import * as React from 'react';
import { cn } from '@/lib/utils';

export interface HelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  state?: 'default' | 'error' | 'success';
}

const HelperText = React.forwardRef<HTMLParagraphElement, HelperTextProps>(
  ({ className, state = 'default', ...props }, ref) => {
    const tone =
      state === 'error'
        ? 'text-red-600'
        : state === 'success'
          ? 'text-emerald-600'
          : 'text-gray-500';
    return <p ref={ref} className={cn('jmd-help', tone, className)} {...props} />;
  }
);

export default HelperText;
