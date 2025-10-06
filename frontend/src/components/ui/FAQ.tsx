'use client';
import * as React from 'react';

interface FaqItem {
  q: string;
  a: React.ReactNode;
  id?: string;
}

interface FAQProps {
  items: FaqItem[];
  /** JSON-LD FAQPage (inséré côté page si besoin) */
  asJsonLd?: boolean;
}

/** Accordéon simple basé sur <details>, SEO ok avec option FAQPage JSON-LD côté page. */
export default function FAQ({ items }: FAQProps) {
  return (
    <div className="space-y-2">
      {items.map((it, idx) => (
        <details
          key={it.id ?? idx}
          className="group rounded-xl border border-gray-200 bg-white p-3 sm:p-4"
        >
          <summary className="cursor-pointer list-none font-semibold text-gray-900">{it.q}</summary>
          <div className="mt-2 text-sm text-gray-700">{it.a}</div>
        </details>
      ))}
    </div>
  );
}
