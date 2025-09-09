'use client';
import clsx from 'clsx';
import * as React from 'react';

import LegalReference from './LegalReference';

export interface GridItem {
  id: string;
  title: string;
  description?: string | React.ReactNode;
  legalRefs?: LegalArticleId[];
}

export interface DefaultGridProps extends React.HTMLAttributes<HTMLDivElement> {
  items: (GridItem | React.ReactNode)[];
  /** colonnes sm / lg (mobile = 1) */
  cols?: { sm?: 2 | 3; lg?: 2 | 3 | 4 };
}

/** Grille responsive pour présenter des défauts/points clés avec références légales. */
export default function DefaultGrid({ items, cols, className, ...rest }: DefaultGridProps) {
  const sm = cols?.sm ?? 2;
  const lg = cols?.lg ?? 3;
  const gridCls = clsx(
    'grid grid-cols-1 gap-3 sm:gap-4',
    `sm:grid-cols-${sm}`,
    `lg:grid-cols-${lg}`,
  );

  return (
    <div className={className} {...rest}>
      <div className={gridCls}>
        {items.map(it => (
          <div
            key={it.id}
            className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]"
          >
            <h5 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{it.title}</h5>
            {it.description ? <div className="text-sm text-gray-700">{it.description}</div> : null}
            {it.legalRefs?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {it.legalRefs.map(code => (
                  <LegalReference key={String(code)} code={code as LegalKey} />
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
