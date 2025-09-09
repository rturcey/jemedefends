'use client';
import clsx from 'clsx';
import { ShieldAlert } from 'lucide-react';
import * as React from 'react';

export interface DisclaimerBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'legal' | 'info';
  /** Texte du disclaimer (par défaut : rappel “pas un conseil juridique individualisé”) */
  children?: React.ReactNode;
}

const variants = {
  legal: 'bg-amber-50 border-amber-200 text-amber-900',
  info: 'bg-blue-50 border-blue-200 text-blue-900',
};

export default function DisclaimerBox({
  variant = 'legal',
  className,
  children,
  ...rest
}: DisclaimerBoxProps) {
  return (
    <div
      role="note"
      aria-label={variant === 'legal' ? 'Avertissement légal' : 'Information'}
      className={clsx(
        'rounded-2xl border p-4 sm:p-5 flex items-start gap-3',
        variants[variant],
        className,
      )}
      {...rest}
    >
      <ShieldAlert className="mt-0.5 h-5 w-5" aria-hidden />
      <div className="text-sm">
        {children ?? (
          <p>
            Ces informations sont fournies à titre informatif et ne constituent pas un conseil
            juridique individualisé.
          </p>
        )}
      </div>
    </div>
  );
}
