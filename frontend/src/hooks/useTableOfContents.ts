'use client';

import {useEffect, useState} from 'react';

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

    // FIX: Scan DOM une seule fois au mount
    useEffect(() => {
        const scanHeadings = () => {
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const tocItems: TOCItem[] = [];

            headings.forEach(heading => {
                let id = heading.id;

                if (!id && heading.textContent) {
                    id = slugify(heading.textContent);

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
        };

        // FIX: Délai pour éviter scan pendant render
        const timer = setTimeout(scanHeadings, 100);
        return () => clearTimeout(timer);
    }, []); // FIX: Une seule fois au mount

    // FIX: Observer optimisé avec cleanup propre
    useEffect(() => {
        if (items.length === 0) return;

        const observer = new IntersectionObserver(
            entries => {
                const visibleEntries = entries.filter(entry => entry.isIntersecting);

                if (visibleEntries.length > 0) {
                    const topEntry = visibleEntries.reduce((prev, current) =>
                        prev.boundingClientRect.top < current.boundingClientRect.top ? prev : current,
                    );

                    // FIX: Éviter setState inutiles
                    setActiveId(prev => (prev !== topEntry.target.id ? topEntry.target.id : prev));
                }
            },
            {
                rootMargin: '-20% 0px -35% 0px',
                threshold: [0, 0.25, 0.5, 0.75, 1],
            },
        );

        const elements: Element[] = [];
        items.forEach(item => {
            const element = document.getElementById(item.id);
            if (element) {
                observer.observe(element);
                elements.push(element);
            }
        });

        return () => {
            elements.forEach(el => observer.unobserve(el));
            observer.disconnect();
        };
    }, [items]); // FIX: Dépendance seulement sur items stable

    return {items, activeId};
}
