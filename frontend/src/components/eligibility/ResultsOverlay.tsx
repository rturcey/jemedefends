'use client';

import * as React from 'react';
import { UnifiedDialog } from '@/components/form/UnifiedDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, Sparkles, XCircle } from 'lucide-react';

type Tone = 'success' | 'error' | 'warning' | 'info';

export type ResultsOverlayProps = {
  open: boolean;
  onRestart: () => void;
  tone: Tone;
  title: string;
  subtitle: string;
  bullets?: string[];
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
};

const ALTERNATIVES_GUIDE_HREF = '/guide/telephonie-garantie-legale#alternatives';

function ResultsOverlayInner({
                               open,
                               onRestart,
                               tone,
                               title,
                               subtitle,
                               bullets,
                               primaryCtaLabel,
                               primaryCtaHref,
                               secondaryCtaLabel = 'Recommencer',
                             }: ResultsOverlayProps) {
  const Icon =
    tone === 'success' ? CheckCircle2 :
      tone === 'error' ? XCircle :
        AlertTriangle;

  const toneClasses =
    tone === 'success'
      ? 'text-green-700 bg-green-50 border-green-200'
      : tone === 'error'
        ? 'text-red-700 bg-red-50 border-red-200'
        : 'text-blue-700 bg-blue-50 border-blue-200';

  return (
    <UnifiedDialog
      open={open}
      onOpenChange={isOpen => {
        // si on ferme la modale, on redémarre le flow
        if (!isOpen) onRestart();
      }}
      title={title}
      description={subtitle}
    >
      <div className={cn('flex items-start gap-3 p-3 rounded-xl border', toneClasses)}>
        <Icon className="h-5 w-5 mt-0.5" />
        <div className="text-sm">{subtitle}</div>
      </div>

      {bullets?.length ? (
        <ul className="mt-4 space-y-2 text-sm text-gray-800 list-disc pl-5">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-6 flex flex-col sm:flex-row gap-2 sm:justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={onRestart}
          className="rounded-xl"
        >
          {secondaryCtaLabel}
        </Button>

        {primaryCtaHref && primaryCtaLabel ? (
          <Button
            asChild
            className={cn(
              'rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600',
              'hover:from-blue-700 hover:to-indigo-700',
            )}
          >
            <Link href={primaryCtaHref}>{primaryCtaLabel}</Link>
          </Button>
        ) : null}
      </div>

      <div className="mt-6 space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
          <Sparkles className="h-4 w-4" />
          <span>Guide des alternatives</span>
          <Badge variant="outline" className="border-amber-300 text-amber-900 bg-white/60">Conseils experts</Badge>
        </div>
        <p className="text-sm text-amber-900 leading-relaxed">
          Comparez réparation, remplacement, remboursement et autres recours avant d'envoyer votre lettre. Le guide vous
          donne les réflexes rapides et les arguments prêts à l'emploi.
        </p>
        <Button
          asChild
          className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow hover:from-amber-600 hover:to-orange-600"
        >
          <Link href={ALTERNATIVES_GUIDE_HREF}>Découvrir le guide des alternatives</Link>
        </Button>
      </div>
    </UnifiedDialog>
  );
}

export default function ResultsOverlay(props: ResultsOverlayProps) {
  return <ResultsOverlayInner {...props} />;
}
