'use client';

import * as React from 'react';
import {ChevronDown} from 'lucide-react';

import {cn} from '@/lib/utils';

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: 'single' | 'multiple';
    collapsible?: boolean;
    value?: string;
    onValueChange?: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionProps>({});

const Accordion = ({children, value, onValueChange, ...props}: AccordionProps) => (
    <AccordionContext.Provider value={{value, onValueChange}}>
        <div {...props}>{children}</div>
    </AccordionContext.Provider>
);

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}

const AccordionItem: React.FC<ItemProps> = ({value, children, className, ...props}) => {
    const ctx = React.useContext(AccordionContext);
    const [open, setOpen] = React.useState(ctx.value ? ctx.value === value : false);

    React.useEffect(() => {
        if (ctx.value !== undefined) {
            setOpen(ctx.value === value);
        }
    }, [ctx.value, value]);

    const toggle = () => {
        if (ctx.onValueChange) {
            ctx.onValueChange(open ? '' : value);
        } else {
            setOpen(!open);
        }
    };

    return (
        <div className={cn('overflow-hidden rounded-xl border', className)} {...props}>
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(child as React.ReactElement<any>, {open, onToggle: toggle})
                    : child,
            )}
        </div>
    );
};

interface TriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
    open?: boolean;
    onToggle?: () => void;
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
    ({className, children, open, onToggle, ...props}, ref) => (
        <button
            type="button"
            className={cn(
                'flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold transition hover:bg-blue-50',
                className,
            )}
            onClick={onToggle}
            aria-expanded={open}
            ref={ref}
            {...props}
        >
            {children}
            <ChevronDown
                className={cn('h-4 w-4 shrink-0 transition-transform', open ? 'rotate-180' : '')}
                aria-hidden
            />
        </button>
    ),
);
AccordionTrigger.displayName = 'AccordionTrigger';

interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
    open?: boolean;
}

const AccordionContent = React.forwardRef<HTMLDivElement, ContentProps>(({className, open, ...props}, ref) => (
    <div
        ref={ref}
        hidden={!open}
        className={cn('border-t px-4 py-3 text-sm text-gray-700 bg-blue-50/50', className)}
        {...props}
    />
));
AccordionContent.displayName = 'AccordionContent';

export {Accordion, AccordionItem, AccordionTrigger, AccordionContent};
