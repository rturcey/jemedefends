'use client';
import { useEffect, useMemo, useState } from 'react';
import GuideStickyTOC, { TOCItem } from './GuideStickyTOC';

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

function useGuideHeadings() {
  const [items, setItems] = useState<TOCItem[]>([]);
  useEffect(() => {
    const root = document.querySelector('article.prose-guide, article.prose') || document.body;
    const nodes = root.querySelectorAll('h2, h3');
    const list: TOCItem[] = [];
    nodes.forEach((n: Element) => {
      let id = n.getAttribute('id') || '';
      const level = n.tagName === 'H3' ? 3 : 2;
      if (!id) {
        const text = (n.textContent || '').trim();
        id = slugify(text || 'section');
        let unique = id,
          i = 2;
        while (document.getElementById(unique)) unique = `${id}-${i++}`;
        n.setAttribute('id', unique);
        id = unique;
      }
      list.push({ id, title: (n.textContent || '').trim(), level });
    });
    setItems(list);
  }, []);
  return useMemo(() => items, [items]);
}

/** Sidebar sticky (desktop) */
export function GuideTOCDesktopCard() {
  const items = useGuideHeadings();
  if (!items.length) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 backdrop-blur shadow-sm p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sommaire</h2>
        <a
          href="#"
          onClick={e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xs text-slate-500 hover:text-slate-700"
        >
          Haut de page
        </a>
      </div>
      <GuideStickyTOC items={items} />
    </div>
  );
}

/** Mobile: barre FIXE en haut + panneau déroulant */
export function GuideTOCMobileHeader() {
  const items = useGuideHeadings();
  const [open, setOpen] = useState(false);
  if (!items.length)
    return (
      // garde un espace constant même sans items (évite les sauts)
      <div className="lg:hidden" style={{ height: '48px' }} />
    );

  return (
    <>
      {/* Barre fixe */}
      <div
        id="mobile-toc-bar"
        className="
          lg:hidden fixed inset-x-0 z-40
          bg-white/90 backdrop-blur border-b border-slate-200
        "
        style={{ top: 'var(--mobile-header-offset, 0px)', height: '48px' }}
      >
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls="mobile-toc-panel"
          className="h-full w-full px-4 text-sm font-medium text-slate-800 flex items-center justify-between"
        >
          <span className="inline-flex items-center gap-2">
            {/* icône liste */}
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden className="opacity-70">
              <path
                d="M4 6h16M4 12h16M4 18h10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Sommaire
          </span>
          {/* Chevron vers le bas */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            aria-hidden
            className={`transition-transform duration-200 text-slate-500 ${open ? 'rotate-180' : ''}`}
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>
      </div>

      {/* Espaceur pour pousser le contenu sous la barre fixe */}
      <div className="lg:hidden" style={{ height: '48px' }} />

      {/* Panneau déroulant */}
      <div
        id="mobile-toc-panel"
        className={`
          lg:hidden fixed inset-x-0 z-40
          transition-transform duration-200
          ${open ? 'translate-y-0' : '-translate-y-full'}
        `}
        style={{
          top: 'calc(var(--mobile-header-offset, 0px) + 48px)',
        }}
        aria-hidden={!open}
      >
        <div className="px-3 pb-3">
          <div className="rounded-b-2xl border border-slate-200 bg-white shadow-md max-h-[56vh] overflow-y-auto">
            <div className="p-3">
              <GuideStickyTOC items={items} onNavigate={() => setOpen(false)} dense />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
