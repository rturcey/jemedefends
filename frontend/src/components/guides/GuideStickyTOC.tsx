'use client';
import { useEffect, useState, useCallback } from 'react';

export type TOCItem = { id: string; title: string; level: number };

type Props = {
  items: TOCItem[];
  onNavigate?: () => void;
  dense?: boolean;
};

function getOffsets() {
  // lit --mobile-header-offset (header global) + hauteur de la barre mobile
  const root = document.documentElement;
  const cssVar = getComputedStyle(root).getPropertyValue('--mobile-header-offset').trim();
  const globalOffset = parseInt(cssVar || '0', 10) || 0;
  const mobileBar = document.getElementById('mobile-toc-bar');
  const mobileOffset = mobileBar?.offsetHeight ?? 0;
  return { globalOffset, mobileOffset, total: globalOffset + mobileOffset };
}

export default function GuideStickyTOC({ items, onNavigate, dense = false }: Props) {
  const [active, setActive] = useState<string | null>(null);

  // Observe la section active (scrollspy)
  useEffect(() => {
    if (!items?.length) return;

    const { total } = getOffsets();
    // Décale le seuil d’activation en tenant compte des barres fixes
    const topMargin = -(Math.max(0, total) + 48); // +48px de marge douce
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { root: null, rootMargin: `${topMargin}px 0px -60% 0px`, threshold: 0.1 },
    );

    const els: Element[] = [];
    items.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) {
        io.observe(el);
        els.push(el);
      }
    });

    return () => {
      els.forEach(el => io.unobserve(el));
      io.disconnect();
    };
  }, [items]);

  // Scroll lissé avec offset header global + barre mobile
  const smoothScroll = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const { total } = getOffsets();
    const rect = el.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - total - 8; // -8px pour respirer
    window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
  }, []);

  if (!items?.length) return null;

  return (
    <nav aria-label="Sommaire du guide" className="text-sm">
      <ul className={`relative ${dense ? 'space-y-1.5' : 'space-y-2.5'}`}>
        {items.map(h => {
          const isActive = active === h.id;
          return (
            <li key={h.id} className={h.level > 2 ? 'ms-3' : ''}>
              <a
                href={`#${h.id}`}
                onClick={e => {
                  e.preventDefault();
                  smoothScroll(h.id);
                  onNavigate?.();
                }}
                className={[
                  'group block rounded-md px-2 py-1.5 transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-800'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                ].join(' ')}
              >
                <span className="inline-flex items-start gap-2">
                  <span
                    aria-hidden
                    className={[
                      'mt-0.5 h-5 w-1 rounded-full transition-colors',
                      isActive ? 'bg-blue-600' : 'bg-transparent group-hover:bg-slate-200',
                    ].join(' ')}
                  />
                  <span className="leading-snug">{h.title}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
