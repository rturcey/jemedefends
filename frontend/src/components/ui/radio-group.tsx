'use client';

import * as React from 'react';

import {cn} from '@/lib/utils';

type RadioGroupContextValue = {
    value?: string | number | boolean;
    onValueChange?: (value: string) => void;
};

const RadioGroupContext = React.createContext<RadioGroupContextValue>({});

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string | number | boolean;
    onValueChange?: (value: string) => void;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
    ({className, children, value, onValueChange, ...props}, ref) => (
        <RadioGroupContext.Provider value={{value, onValueChange}}>
            <div ref={ref} role="radiogroup" className={cn('grid gap-3', className)} {...props}>
                {children}
            </div>
        </RadioGroupContext.Provider>
    ),
);
RadioGroup.displayName = 'RadioGroup';

export interface RadioGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    label: React.ReactNode;
    description?: React.ReactNode;
    icon?: React.ReactNode;
    tone?: 'default' | 'warning' | 'success';
}

const toneClasses: Record<NonNullable<RadioGroupItemProps['tone']>, string> = {
    default: 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/60',
    warning: 'border-amber-200 hover:border-amber-300 hover:bg-amber-50/70',
    success: 'border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/70',
};

const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
    ({className, label, description, value, icon, tone = 'default', ...props}, ref) => {
        const group = React.useContext(RadioGroupContext);
        const isActive = `${group.value}` === `${value}`;

        return (
            <button
                type="button"
                role="radio"
                aria-checked={isActive}
                onClick={() => group.onValueChange?.(String(value))}
                className={cn(
                    'w-full rounded-2xl border bg-white p-4 text-left shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2',
                    toneClasses[tone],
                    isActive ? 'ring-2 ring-blue-500 ring-offset-1 border-blue-400' : 'border-gray-200',
                    className,
                )}
                ref={ref}
                {...props}
            >
                <div className="flex items-start gap-3">
                    <div
                        className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700',
                            isActive && 'bg-blue-600 text-white shadow-lg',
                        )}
                    >
                        {icon ?? <div className="h-2 w-2 rounded-full bg-current" />}
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-gray-900 leading-tight">{label}</div>
                        {description && <p className="text-sm text-gray-600 mt-1 leading-relaxed">{description}</p>}
                    </div>
                    <div
                        className={cn(
                            'mt-1 h-5 w-5 rounded-full border-2 border-gray-300 transition-all',
                            isActive ? 'border-blue-600 bg-blue-600 shadow-inner' : 'bg-white',
                        )}
                        aria-hidden
                    />
                </div>
            </button>
        );
    },
);
RadioGroupItem.displayName = 'RadioGroupItem';

export {RadioGroup, RadioGroupItem};
