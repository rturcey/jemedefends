'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FormShellProps = {
  title: string;
  subtitle?: string;
  stepIndex: number; // 0-based
  stepCount: number;
  stepLabel?: string; // ex: "Vos infos"
  helpText?: string;
  onPrev?: () => void;
  onNext?: () => void;
  canPrev?: boolean;
  canNext?: boolean;
  nextLabel?: string;
  prevLabel?: string;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  children: React.ReactNode;
};

export function FormShell({
  title,
  subtitle,
  stepIndex,
  stepCount,
  stepLabel,
  helpText,
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
  nextLabel = 'Continuer',
  prevLabel = 'Retour',
  isLastStep = false,
  isSubmitting = false,
  children,
}: FormShellProps) {
  const progress = Math.round(((stepIndex + 1) / stepCount) * 100);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-6 sm:py-10">
      <Card className="rounded-2xl border-gray-200 shadow-sm">
        <CardHeader className="space-y-2 pb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
                {title}
              </h1>
              {subtitle && <p className="text-sm sm:text-base text-gray-600 mt-1">{subtitle}</p>}
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-500">
                Étape {stepIndex + 1} / {stepCount}
              </div>
              {stepLabel && <div className="text-sm font-semibold text-gray-900">{stepLabel}</div>}
            </div>
          </div>

          <Progress value={progress} className="h-2 rounded-full" />

          {helpText && (
            <div className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-xl p-3">
              {helpText}
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-2">
          <div className="space-y-6">{children}</div>

          {(onPrev || onNext) && (
            <div className="mt-8 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={onPrev}
                disabled={!onPrev || !canPrev || isSubmitting}
                className={cn('rounded-xl')}
              >
                ← {prevLabel}
              </Button>

              <Button
                type="button"
                variant="brand"
                onClick={onNext}
                disabled={!onNext || !canNext || isSubmitting}
                className={cn(
                  'rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600',
                  'hover:from-blue-700 hover:to-indigo-700',
                )}
              >
                {isSubmitting ? 'Traitement…' : nextLabel}
                {isLastStep && ' →'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
