'use client';

import clsx from 'clsx';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import LegalReference from '@/components/legal/LegalReference';

/**
 * Par section :
 *  - Remplace <span data-legal-id="..."> par un exposant cliquable "[n]" (ordre d'apparition).
 *  - Ajoute un bloc "Sources de la section" en bas de la section, listé dans le même ordre
 *    et préfixé par le même [n].
 *
 * Hypothèse structure :
 *   <main>
 *     <article>
 *       <div data-section-type="..."> … </div>
 *       <div data-section-type="..."> … </div>
 *     </article>
 *   </main>
 */
export default function LegalFootnotes({
  scopeSelector = 'main article',
  sectionSelector = 'div[data-section-type]',
  className,
}: {
  scopeSelector?: string;
  sectionSelector?: string;
  className?: string;
}) {
  useEffect(() => {
    const rootEl = document.querySelector<HTMLElement>(scopeSelector);
    if (!rootEl) return;

    // Sélectionne uniquement le contenu (pas la sidebar)
    const sections = Array.from(rootEl.querySelectorAll<HTMLElement>(sectionSelector)).filter(
      sec => !sec.closest('aside'),
    );

    sections.forEach(sectionEl => {
      if (sectionEl.dataset.legalSectionHydrated === '1') return;

      // 1) Références dans l’ordre du DOM pour CETTE section
      const spanNodes = Array.from(sectionEl.querySelectorAll<HTMLElement>('span[data-legal-id]'));
      if (spanNodes.length === 0) {
        sectionEl.dataset.legalSectionHydrated = '1';
        return;
      }

      // 2) Attribution d’un numéro à la première apparition de chaque ID
      const indexById = new Map<string, number>();
      const orderedPairs: Array<{ id: string; n: number }> = [];
      let next = 1;

      spanNodes.forEach(el => {
        const id = el.dataset.legalId || '';
        if (!id) return;
        if (!indexById.has(id)) indexById.set(id, next++);
        const n = indexById.get(id)!;
        orderedPairs.push({ id, n });
      });

      // Liste unique dans l’ordre d’apparition
      const uniqueOrdered: Array<{ id: string; n: number }> = [];
      const seen = new Set<string>();
      for (const p of orderedPairs) {
        if (!seen.has(p.id)) {
          uniqueOrdered.push(p);
          seen.add(p.id);
        }
      }

      // 3) Remplacement inline → exposant "[n]" cliquable (tooltip), pas d’icône
      spanNodes.forEach(el => {
        const id = el.dataset.legalId || '';
        const n = indexById.get(id);
        if (!id || !n) return;

        // Nettoie et monte le composant
        el.innerHTML = '';
        const mount = ReactDOM.createRoot(el);
        const label = `[${String(n)}]`; // une simple chaîne (évite [object Object] / virgules)

        mount.render(
          <LegalReference
            code={id as any}
            variant="tooltip"
            asSup
            size="sm"
            immediate
            // bleu du site, pas de soulignement sur l’exposant, icônes masquées côté trigger
            className={clsx('!text-blue-600 no-underline [&_svg]:hidden')}
          >
            {label}
          </LegalReference>,
        );
      });

      // 4) Bloc “Sources de la section” tout en bas (même ordre + [n])
      const existing = sectionEl.querySelector<HTMLElement>('[data-legal-section-sources="1"]');
      if (!existing) {
        const holder = document.createElement('div');
        holder.dataset.legalSectionSources = '1';
        holder.className = clsx('not-prose mt-4', className);
        sectionEl.appendChild(holder);

        const root = ReactDOM.createRoot(holder);
        root.render(<SectionSources items={uniqueOrdered} />);
      }

      sectionEl.dataset.legalSectionHydrated = '1';
    });
  }, [scopeSelector, sectionSelector, className]);

  return null;
}

function SectionSources({ items }: { items: Array<{ id: string; n: number }> }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="not-prose">
      <div className="bg-blue-50/40 border border-blue-100 rounded-md px-2 py-1.5">
        <div className="text-[12px] text-blue-700 font-medium mb-1">
          Sources de la section <span className="text-blue-700/70">({items.length})</span>
        </div>

        {/* Puces côte à côte, retour à la ligne auto */}
        <div className="flex flex-wrap gap-2">
          {items.map(({ id, n }) => {
            const label = `[${String(n)}]`;
            return (
              <div key={`${id}-${n}`} className="inline-flex items-center gap-1 px-1.5 py-0.5">
                <span className="text-[11px] font-medium text-blue-700">{label}</span>
                <LegalReference
                  code={id as any}
                  variant="badge"
                  size="sm"
                  immediate
                  className="!text-blue-600"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
