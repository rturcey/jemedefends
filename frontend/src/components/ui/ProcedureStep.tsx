'use client';
import clsx from 'clsx';
import { Check, Circle, ChevronRight } from 'lucide-react';
import * as React from 'react';

export type StepState = 'done' | 'current' | 'upcoming';

export interface ProcedureStepProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Index d'étape (1-based pour affichage) */
  index?: number;
  /** Alias rétrocompatible (à migrer) */
  number?: number;
  /** Titre de l'étape */
  title: string;
  /** État visuel */
  state?: StepState;
  /** Description sous le titre */
  description?: React.ReactNode;
  /** Base légale associée */
  law?: React.ReactNode;
  /** Icône personnalisée (facultative) */
  icon?: React.ReactNode;
  /** Sous-contenu (texte, actions) */
  children?: React.ReactNode;
  /** Marquer comme cliquable (navigation) */
  clickable?: boolean;
}

/** Étape procédurale avec index, icône, état et contenu. */
export default function ProcedureStep({
  index,
  number, // alias rétrocompatible
  title,
  state = 'upcoming',
  description,
  law,
  icon,
  children,
  clickable,
  className,
  ...rest
}: ProcedureStepProps) {
  // Utiliser index ou number pour la numérotation
  const stepNumber = index || number || 1;

  const Icon =
    state === 'done' ? (
      <Check className="h-4 w-4 text-white" aria-hidden />
    ) : state === 'current' ? (
      <Circle className="h-4 w-4 text-white" aria-hidden />
    ) : (
      <ChevronRight className="h-4 w-4 text-white" aria-hidden />
    );

  const pill =
    state === 'done' ? 'bg-green-600' : state === 'current' ? 'bg-blue-600' : 'bg-gray-400';

  return (
    <div
      role="listitem"
      aria-current={state === 'current' ? 'step' : undefined}
      className={clsx(
        'rounded-2xl border border-gray-200 bg-white p-4 sm:p-5',
        clickable && 'cursor-pointer hover:bg-gray-50',
        className,
      )}
      {...rest}
    >
      <div className="flex items-start gap-3">
        <div
          className={clsx(
            'mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full',
            pill,
          )}
        >
          {icon ?? Icon}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Étape {stepNumber}</span>
            <span className="text-sm text-gray-400">•</span>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h4>
          </div>
          {description ? <div className="text-sm text-gray-700">{description}</div> : null}
          {law ? <div className="text-xs text-gray-600 mt-1">{law}</div> : null}
          {children ? <div className="text-sm text-gray-700">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}
