import React from 'react';
import clsx from 'clsx';
import { Clock } from 'lucide-react';

export interface ProcedureStep {
  number: number;
  id?: string;
  title: string;
  descriptionNode: React.ReactNode;
  duration?: string;
}

type Accent = 'blue' | 'indigo' | 'violet' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'auto';

const PALETTE: Accent[] = ['blue', 'indigo', 'violet', 'cyan', 'emerald', 'amber', 'rose'];

function accentFor(i: number, accent: Accent) {
  const c = accent === 'auto' ? PALETTE[i % PALETTE.length] : accent;

  // classes tailwind par couleur
  const map: Record<
    string,
    {
      bubble: string;
      border: string;
      title: string;
      chipRing: string;
    }
  > = {
    blue: {
      bubble: 'bg-blue-600',
      border: 'border-blue-200',
      title: 'text-blue-800',
      chipRing: 'ring-blue-200/50',
    },
    indigo: {
      bubble: 'bg-indigo-600',
      border: 'border-indigo-200',
      title: 'text-indigo-800',
      chipRing: 'ring-indigo-200/50',
    },
    violet: {
      bubble: 'bg-violet-600',
      border: 'border-violet-200',
      title: 'text-violet-800',
      chipRing: 'ring-violet-200/50',
    },
    cyan: {
      bubble: 'bg-cyan-600',
      border: 'border-cyan-200',
      title: 'text-cyan-800',
      chipRing: 'ring-cyan-200/50',
    },
    emerald: {
      bubble: 'bg-emerald-600',
      border: 'border-emerald-200',
      title: 'text-emerald-800',
      chipRing: 'ring-emerald-200/50',
    },
    amber: {
      bubble: 'bg-amber-600',
      border: 'border-amber-200',
      title: 'text-amber-800',
      chipRing: 'ring-amber-200/50',
    },
    rose: {
      bubble: 'bg-rose-600',
      border: 'border-rose-200',
      title: 'text-rose-800',
      chipRing: 'ring-rose-200/50',
    },
  };
  return map[c];
}

export default function ProcedureSteps({
  steps,
  accent = 'blue', // ← change 'blue' en 'auto' si tu veux la palette
}: {
  steps: ProcedureStep[];
  accent?: Accent;
}) {
  return (
    <div className="relative">
      <div aria-hidden className="absolute left-[18px] top-0 bottom-0 w-px bg-gray-200" />

      <ol className="space-y-5">
        {steps.map((step, i) => {
          const a = accentFor(i, accent);
          return (
            <li key={step.number} className="relative pl-10">
              {/* bulle numérotée */}
              <div
                className={clsx(
                  'absolute left-0 top-3 w-9 h-9 rounded-full text-white flex items-center justify-center text-sm font-bold shadow-sm',
                  a.bubble,
                )}
                aria-hidden
              >
                {step.number}
              </div>

              {/* carte avec liseré coloré discret */}
              <div
                className={clsx(
                  'bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow',
                  a.border,
                )}
              >
                <div className="flex items-start justify-between gap-3 p-4 pb-2">
                  <h3
                    id={step.id}
                    className={clsx('text-base font-semibold leading-snug', a.title)}
                  >
                    {step.title}
                  </h3>

                  {step.duration && (
                    <span
                      className={clsx(
                        'shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs',
                        'bg-white text-gray-700 border ring-1',
                        a.chipRing,
                      )}
                    >
                      <Clock className="w-3 h-3" />
                      {step.duration}
                    </span>
                  )}
                </div>

                <div className="px-4 pb-4 text-justify">
                  <div className="prose prose-gray max-w-none leading-relaxed">
                    {step.descriptionNode}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
