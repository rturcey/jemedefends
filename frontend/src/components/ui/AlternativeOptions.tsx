'use client';
import clsx from 'clsx';
import { ExternalLink, MessageSquareWarning, Scale, Handshake, ShieldCheck } from 'lucide-react';
import * as React from 'react';

import Button from './Button';

export type AltKind = 'signalconso' | 'mediation' | 'conciliation' | 'assistance' | 'assurance';

export interface Alternative {
  kind?: AltKind;
  label: string;
  description?: string | React.ReactNode;
  law?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  /** Indice de priorité visuelle */
  primary?: boolean;
}

export interface AlternativeOptionsProps extends React.HTMLAttributes<HTMLDivElement> {
  options: Alternative[];
  horizontal?: boolean;
}

/** Groupe d'actions "alternatives" (SignalConso, médiation, etc.). */
export default function AlternativeOptions({
  options,
  horizontal = false,
  className,
  ...rest
}: AlternativeOptionsProps) {
  const iconFor: Record<AltKind, React.ReactNode> = {
    signalconso: <MessageSquareWarning className="h-4 w-4" aria-hidden />,
    mediation: <Scale className="h-4 w-4" aria-hidden />,
    conciliation: <Handshake className="h-4 w-4" aria-hidden />,
    assistance: <ShieldCheck className="h-4 w-4" aria-hidden />,
    assurance: <ShieldCheck className="h-4 w-4" aria-hidden />,
  };

  return (
    <div
      className={clsx(
        'flex',
        horizontal ? 'flex-row flex-wrap gap-2' : 'flex-col gap-2',
        className,
      )}
      {...rest}
    >
      {options.map(o =>
        o.href ? (
          <a key={o.label} href={o.href} target="_blank" rel="noreferrer">
            <Button variant={o.primary ? 'primary' : 'secondary'} className="whitespace-nowrap">
              {iconFor[o.kind]} {o.label} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </Button>
          </a>
        ) : (
          <Button
            key={o.label}
            onClick={o.onClick}
            variant={o.primary ? 'primary' : 'secondary'}
            className="whitespace-nowrap"
          >
            {iconFor[o.kind]} {o.label}
          </Button>
        ),
      )}
    </div>
  );
}
