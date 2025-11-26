'use client';

import * as React from 'react';

import {cn} from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({className, value = 0, ...props}, ref) => {
    const clamped = Math.min(Math.max(value, 0), 100);
    return (
        <div
            ref={ref}
            className={cn('relative h-2 w-full overflow-hidden rounded-full bg-gray-200', className)}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={clamped}
            {...props}
        >
            <div
                className="h-full w-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                style={{transform: `translateX(-${100 - clamped}%)`}}
            />
        </div>
    );
});
Progress.displayName = 'Progress';

export {Progress};
