'use client';

import { Info } from 'lucide-react';
import React from 'react';

type Variant = 'default' | 'compact';

export default function GuideDisclaimer({
  variant = 'default',
  className = '',
}: {
  /** ISO date string (ex: "2025-03-10") */
  lastUpdated?: string;
  variant?: Variant;
  className?: string;
}) {
  if (variant === 'compact') {
    return (
      <div
        className={[
          'rounded-lg border border-amber-200 bg-amber-50/70 text-amber-900',
          'px-3 py-2 text-sm flex items-start gap-2',
          className,
        ].join(' ')}
        role="note"
        aria-live="polite"
      >
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <p className="leading-relaxed">
          Informations générales, non constitutives de conseil juridique.{' '}
        </p>
      </div>
    );
  }

  return (
    <div
      className={[
        'rounded-xl border border-amber-200 bg-amber-50 text-amber-900',
        'px-4 py-3 flex items-start gap-3',
        className,
      ].join(' ')}
      role="note"
      aria-live="polite"
    >
      <Info className="w-5 h-5 mt-0.5 shrink-0" />
      <div className="text-sm leading-relaxed">
        <p className="font-medium">Disclaimer</p>
        <p className="mt-1">
          Les informations de ce guide sont fournies à titre général et ne constituent pas un
          conseil juridique. Chaque situation est unique : si besoin, rapprochez-vous d’un
          professionnel du droit (avocat, association de consommateurs, etc.).
        </p>
      </div>
    </div>
  );
}
