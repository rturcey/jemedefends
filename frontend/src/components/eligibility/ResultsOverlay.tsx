'use client';

import * as React from 'react';
import Link from 'next/link';
import { UnifiedDialog } from '@/components/form/UnifiedDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

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
  const Icon = tone === 'success' ? CheckCircle2 : tone === 'error' ? XCircle : AlertTriangle;

  const toneClasses =
    tone === 'success'
      ? 'bg-green-50 border-green-200 text-green-900'
      : tone === 'error'
        ? 'bg-red-50 border-red-200 text-red-900'
        : 'bg-blue-50 border-blue-200 text-blue-900';

  return (
    <UnifiedDialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) onRestart();
      }}
      title={title}
      description={subtitle}
    >
      <div className="space-y-4">
        <Card className="overflow-hidden rounded-2xl border-slate-100 shadow-[0_16px_60px_rgba(15,23,42,0.12)]">
          <div className="flex flex-col gap-3 bg-gradient-to-r from-blue-50 via-white to-indigo-50 px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <Badge variant="outline" className="rounded-full border-blue-200 bg-white/80 text-blue-900">
                Diagnostic instantané
              </Badge>
              <Badge variant="outline" className="rounded-full border-slate-200 bg-white/80 text-slate-900">
                Parcours terminé
              </Badge>
            </div>
            <div className="flex items-start gap-3">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-full border', toneClasses)}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                <p className="text-sm text-slate-700">{subtitle}</p>
              </div>
            </div>
          </div>

          {bullets?.length ? (
            <div className="border-t border-slate-100 bg-white px-4 py-4 sm:px-5">
              <ul className="space-y-2 text-sm text-slate-800">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 text-blue-600">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="border-t border-slate-100 bg-white px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={onRestart}
                className="rounded-xl border-slate-200"
              >
                {secondaryCtaLabel}
              </Button>

              {primaryCtaHref && primaryCtaLabel ? (
                <Button
                  asChild
                  className={cn(
                    'rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-white shadow',
                    'hover:from-blue-700 hover:to-indigo-700',
                  )}
                >
                  <Link href={primaryCtaHref}>{primaryCtaLabel}</Link>
                </Button>
              ) : null}
            </div>
          </div>
        </Card>
      </div>
    </UnifiedDialog>
  );
}

export default function ResultsOverlay(props: ResultsOverlayProps) {
  return <ResultsOverlayInner {...props} />;
}
