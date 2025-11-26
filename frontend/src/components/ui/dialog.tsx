'use client';

import * as React from 'react';
import {createPortal} from 'react-dom';
import {X} from 'lucide-react';

import {cn} from '@/lib/utils';

interface DialogRootProps {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}

const DialogContext = React.createContext<Pick<DialogRootProps, 'open' | 'onOpenChange'>>({open: false});

const Dialog: React.FC<DialogRootProps> = ({open, onOpenChange, children}) => (
    <DialogContext.Provider value={{open, onOpenChange}}>{children}</DialogContext.Provider>
);

const DialogTrigger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({children, ...props}) => {
    const ctx = React.useContext(DialogContext);
    return (
        <button type="button" onClick={() => ctx.onOpenChange?.(!ctx.open)} {...props}>
            {children}
        </button>
    );
};

const DialogPortal: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    if (!mounted) return null;
    return createPortal(children, document.body);
};

const DialogOverlay: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({className, ...props}) => (
    <div className={cn('fixed inset-0 z-50 bg-black/30 backdrop-blur-sm', className)} {...props} />
);

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
    closeButton?: boolean;
}

const DialogContent: React.FC<DialogContentProps> = ({className, children, closeButton = true, ...props}) => {
    const ctx = React.useContext(DialogContext);
    if (!ctx.open) return null;

    return (
        <DialogPortal>
            <DialogOverlay onClick={() => ctx.onOpenChange?.(false)} />
            <div
                className={cn(
                    'fixed left-1/2 top-8 z-50 w-[calc(100%-1.5rem)] max-w-4xl -translate-x-1/2 rounded-3xl border bg-white p-4 shadow-2xl focus:outline-none',
                    className,
                )}
                role="dialog"
                aria-modal
                {...props}
            >
                {closeButton && (
                    <button
                        type="button"
                        onClick={() => ctx.onOpenChange?.(false)}
                        className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
                        aria-label="Fermer"
                    >
                        <X className="h-5 w-5" aria-hidden />
                    </button>
                )}
                {children}
            </div>
        </DialogPortal>
    );
};

const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({className, ...props}) => (
    <div className={cn('space-y-1.5 text-center sm:text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({className, ...props}) => (
    <div className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />
);
DialogFooter.displayName = 'DialogFooter';

const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({className, ...props}) => (
    <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
);
DialogTitle.displayName = 'DialogTitle';

const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({className, ...props}) => (
    <p className={cn('text-sm text-gray-600', className)} {...props} />
);
DialogDescription.displayName = 'DialogDescription';

const DialogClose: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({className, children, ...props}) => {
    const ctx = React.useContext(DialogContext);
    return (
        <button
            type="button"
            className={cn('rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-100', className)}
            onClick={() => ctx.onOpenChange?.(false)}
            {...props}
        >
            {children ?? 'Fermer'}
        </button>
    );
};

export {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogOverlay,
    DialogPortal,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    DialogClose,
};
