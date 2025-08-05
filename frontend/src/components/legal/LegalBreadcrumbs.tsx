'use client';
import * as React from 'react';

function LegalBreadcrumbs({
  items,
}: {
  items: { href: string; label: string; current?: boolean }[];
}) {
  return (
    <nav aria-label="Fil d’Ariane" className="text-sm text-slate-600">
      <ol className="flex items-center gap-2">
        {items.map((it, i) => (
          <li key={it.href} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>›</span>}
            {it.current ? (
              <span className="font-semibold text-slate-800">{it.label}</span>
            ) : (
              <a href={it.href} className="hover:underline">
                {it.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export default LegalBreadcrumbs;
