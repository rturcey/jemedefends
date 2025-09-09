'use client';

import { useEffect, useState, useMemo } from 'react';

export interface TOCItem {
  id: string;
  title: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function useTableOfContents() {
  const [items, setItems] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // Scan des headings dans le DOM
  useEffect(() => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const tocItems: TOCItem[] = [];

    headings.forEach(heading => {
      let id = heading.id;

      // Générer un ID si manquant
      if (!id && heading.textContent) {
        id = slugify(heading.textContent);

        // S'assurer que l'ID est unique
        let uniqueId = id;
        let counter = 1;
        while (document.getElementById(uniqueId)) {
          uniqueId = `${id}-${counter}`;
          counter++;
        }

        heading.setAttribute('id', uniqueId);
        id = uniqueId;
      }

      if (id && heading.textContent) {
        const level = parseInt(heading.tagName.charAt(1), 10);
        tocItems.push({
          id,
          title: heading.textContent.trim(),
          level,
        });
      }
    });

    setItems(tocItems);
  }, []);

  // Observer pour l'élément actif (scrollspy)
  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);

        if (visibleEntries.length > 0) {
          // Prendre le premier élément visible (plus haut dans la page)
          const topEntry = visibleEntries.reduce((prev, current) =>
            prev.boundingClientRect.top < current.boundingClientRect.top ? prev : current,
          );
          setActiveId(topEntry.target.id);
        }
      },
      {
        rootMargin: '-20% 0px -35% 0px', // Zone d'activation optimisée
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    // Observer tous les headings
    items.forEach(item => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [items]);

  return { items, activeId };
}
