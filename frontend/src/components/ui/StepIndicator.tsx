'use client';

import clsx from 'clsx';
import * as React from 'react';

import ProgressBar from '@/components/ui/progress/ProgressBar';

export default function StepIndicator({
  currentStep, // index 0-based
  totalSteps,
  completed = false, // mets true pour afficher 100% (ex: panneau résultat)
  className,
}: {
  currentStep: number;
  totalSteps: number;
  completed?: boolean;
  className?: string;
}) {
  // 0% au step 0 ; 100% uniquement si `completed` est true
  const ratio = completed
    ? 1
    : totalSteps > 0
      ? Math.min(1, Math.max(0, currentStep / totalSteps))
      : 0;

  const percent = Math.round(ratio * 100);

  return (
    <div className={clsx('w-full max-w-[640px]', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600">
          Étape {Math.min(currentStep + 1, totalSteps)} / {totalSteps}
        </span>
        <span className="text-xs text-gray-500 tabular-nums">{percent}%</span>
      </div>

      {/* Compat: on envoie à la fois `value` et `progress` (selon l'API de ton ProgressBar) */}
      <ProgressBar
        {...({ value: percent, progress: percent } as any)}
        className="h-2"
        /* si ton ProgressBar gère un "trackClassName" / "barClassName", tu peux passer:
               trackClassName="bg-gray-200"
               barClassName="bg-gray-900"
            */
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      />
    </div>
  );
}
