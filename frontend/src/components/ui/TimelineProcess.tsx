'use client';
import clsx from 'clsx';
import { Check, Circle } from 'lucide-react';
import * as React from 'react';

export type TimelineStatus = 'done' | 'current' | 'upcoming';

export interface TimelineItem {
  id: string;
  title: string;
  description?: string | React.ReactNode;
  dateLabel?: string;
  status?: TimelineStatus;
}

export interface TimelineProcessProps extends React.HTMLAttributes<HTMLOListElement> {
  items: TimelineItem[];
}

/** Timeline verticale pour visualiser une procédure (mise en demeure → SAV → médiation → référé…). */
export default function TimelineProcess({ items, className, ...rest }: TimelineProcessProps) {
  return (
    <ol
      role="list"
      className={clsx('relative border-l border-gray-200 pl-4 space-y-6', className)}
      {...rest}
    >
      {items.map((it, i) => {
        const status = it.status ?? 'upcoming';
        const dot =
          status === 'done'
            ? 'bg-green-600 text-white'
            : status === 'current'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-300 text-white';

        return (
          <li key={it.id} className="relative">
            <span
              className={clsx(
                'absolute -left-2 inline-flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white',
                dot,
              )}
              aria-hidden
            >
              {status === 'done' ? <Check className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            </span>
            <div className="ml-6">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">{it.title}</h4>
                {it.dateLabel ? (
                  <span className="text-xs text-gray-500">{it.dateLabel}</span>
                ) : null}
                <span className="sr-only">Étape {i + 1}</span>
              </div>
              {it.description ? (
                <div className="mt-1 text-sm text-gray-700">{it.description}</div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
