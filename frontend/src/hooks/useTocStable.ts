'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type TocItem = {
  id: string;
  title: string;
  level: number; // 2 for h2, 3 for h3
};

// --- offsets sticky (topbar + progress)
function getStickyOffset() {
  const isDesktop =
    typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
  const topbar = isDesktop ? 80 : 48;
  const progress = 32;
  return topbar + progress + 8;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

function collectHeadings(container: HTMLElement | null): TocItem[] {
  if (!container) return [];
  const used = new Set<string>();
  const nodes = container.querySelectorAll('h2, h3');
  const out: TocItem[] = [];

  nodes.forEach(h => {
    const level = h.tagName === 'H2' ? 2 : 3;
    const title = (h.textContent || '').trim();
    if (!title) return;

    // assure un id : si manquant, on le crée et on s'assure de l'unicité
    let id = h.getAttribute('id') || '';
    if (!id) {
      const base = slugify(title) || (level === 2 ? 'section' : 'subsection');
      let candidate = base;
      let i = 2;
      while (used.has(candidate) || document.getElementById(candidate)) {
        candidate = `${base}-${i++}`;
      }
      id = candidate;
      h.setAttribute('id', id);
    }
    used.add(id);

    out.push({ id, title, level });
  });

  return out;
}

export function useTocStable(articleSelector = 'main article') {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const lastStableId = useRef<string | null>(null);
  const raf = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // collecte initiale (ou quand le conteneur change)
  useEffect(() => {
    const article = document.querySelector<HTMLElement>(articleSelector);
    setItems(collectHeadings(article));
  }, [articleSelector]);

  // observe & calcule l’actif (stable, sans animations)
  useEffect(() => {
    const article = document.querySelector<HTMLElement>(articleSelector);
    if (!article || items.length === 0) return;

    const stickyOffset = getStickyOffset();
    const headings = items
      .map(it => document.getElementById(it.id))
      .filter(Boolean) as HTMLElement[];

    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    const io = new IntersectionObserver(
      () => {
        if (raf.current) cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(() => {
          const topY = stickyOffset;
          const candidates = headings.map(h => ({
            id: h.id,
            top: h.getBoundingClientRect().top,
          }));

          let nextId: string | null = null;

          // le plus proche sous le bord « collant »
          const visibles = candidates
            .filter(c => c.top - topY >= -2)
            .sort((a, b) => Math.abs(a.top - topY) - Math.abs(b.top - topY));
          if (visibles.length) {
            nextId = visibles[0].id;
          } else {
            const passed = candidates
              .filter(c => c.top - topY < -2)
              .sort((a, b) => Math.abs(a.top - topY) - Math.abs(b.top - topY));
            nextId = passed.length ? passed[0].id : null;
          }

          if (nextId && nextId !== lastStableId.current) {
            lastStableId.current = nextId;
            setActiveId(nextId);
          }
        });
      },
      {
        root: null,
        rootMargin: `-${stickyOffset}px 0px -60% 0px`,
        threshold: [0, 0.12, 0.25],
      },
    );

    headings.forEach(h => io.observe(h));
    observerRef.current = io;

    const onHash = () => {
      const id = decodeURIComponent(location.hash.replace('#', ''));
      if (id) {
        lastStableId.current = id;
        setActiveId(id);
      }
    };
    window.addEventListener('hashchange', onHash);
    onHash();

    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      if (observerRef.current) observerRef.current.disconnect();
      window.removeEventListener('hashchange', onHash);
    };
  }, [items, articleSelector]);

  // défilement sans animation (tu avais demandé de retirer les anims)
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const stickyOffset = getStickyOffset();
    const y = window.scrollY + el.getBoundingClientRect().top - stickyOffset - 4;
    window.scrollTo({ top: y, behavior: 'auto' });
    history.replaceState(null, '', `#${id}`);
  };

  // groupe H3 sous leur H2
  const grouped = useMemo(() => {
    const out: Array<TocItem & { children?: TocItem[] }> = [];
    let lastH2: (TocItem & { children?: TocItem[] }) | null = null;

    items.forEach(it => {
      if (it.level === 2) {
        lastH2 = { ...it, children: [] };
        out.push(lastH2);
      } else if (it.level === 3) {
        if (!lastH2) {
          lastH2 = { ...it, level: 2, children: [] };
          out.push(lastH2);
        } else {
          lastH2.children!.push(it);
        }
      }
    });
    return out;
  }, [items]);

  return { items: grouped, activeId, scrollToId };
}
