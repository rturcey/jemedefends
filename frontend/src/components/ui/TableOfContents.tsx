'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { ChevronDown, List } from 'lucide-react';

export type TocItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

export type TableOfContentsProps = {
  items: TocItem[];
  className?: string;
  dense?: boolean;
};

export default function TableOfContents({ items, className, dense = false }: TableOfContentsProps) {
  const [open, setOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | null>(items[0]?.id ?? null);

  // close after click on mobile
  const handleClickItem = React.useCallback(() => {
    setOpen(false);
  }, []);

  // Active section tracking (desktop + mobile, but highlight only desktop styles below)
  React.useEffect(() => {
    if (!items?.length) return;

    const ids = items.map(i => i.id);
    const elements = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    // rootMargin tuned so the "active" switches when heading approaches top
    const observer = new IntersectionObserver(
      entries => {
        // Keep only intersecting
        const visible = entries.filter(e => e.isIntersecting);

        if (visible.length > 0) {
          // pick the one closest to top
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(visible[0].target.id);
          return;
        }

        // Fallback: if none intersecting (fast scroll), pick last above top
        const above = entries
          .filter(e => e.boundingClientRect.top < 0)
          .sort((a, b) => b.boundingClientRect.top - a.boundingClientRect.top);

        if (above[0]) setActiveId(above[0].target.id);
      },
      {
        threshold: [0.1, 0.6, 1],
        rootMargin: '-120px 0px -60% 0px',
      },
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (!items?.length) return null;

  return (
    <>
      {/* Mobile TOC: sticky header bar */}
      <div
        className={cn(
          'lg:hidden sticky top-16 z-40',
          'bg-white/80 backdrop-blur-md',
          'border border-gray-200 rounded-2xl shadow-sm',
          'px-3 py-2',
          className,
        )}
        aria-label="Navigation des sections"
      >
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          className="w-full flex items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <List className="h-4 w-4" />
            </span>
            Navigation
          </span>

          <span className="flex items-center gap-2 text-xs text-gray-500">
            {items.length} sections
            <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
          </span>
        </button>

        {open && (
          <div className="mt-2">
            <ScrollArea.Root className="max-h-[60vh]">
              <ScrollArea.Viewport className="px-1 pb-1">
                <ul className={cn('space-y-1', dense && 'space-y-0.5')}>
                  {items.map(it => {
                    const isActive = activeId === it.id;
                    return (
                      <li key={it.id}>
                        <a
                          href={`#${it.id}`}
                          onClick={handleClickItem}
                          className={cn(
                            'group flex items-center gap-2 rounded-xl px-3 py-2 text-sm',
                            'text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors',
                            dense && 'py-1.5',
                            isActive && 'bg-blue-50 text-blue-800',
                          )}
                        >
                          {it.icon && (
                            <span
                              className={cn(
                                'text-blue-600 group-hover:text-blue-700',
                                isActive && 'text-blue-700',
                              )}
                            >
                              {it.icon}
                            </span>
                          )}
                          <span className="truncate">{it.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea.Viewport>

              <ScrollArea.Scrollbar
                orientation="vertical"
                className="flex select-none touch-none p-0.5 bg-transparent"
              >
                <ScrollArea.Thumb className="flex-1 bg-gray-200 rounded-full" />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
          </div>
        )}
      </div>

      {/* Desktop TOC: sticky sidebar + active highlight */}
      <aside
        className={cn('hidden lg:block sticky top-24 self-start', className)}
        aria-label="Navigation des sections"
      >
        <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-md shadow-sm">
          <ScrollArea.Root className="h-full max-h-[70vh]">
            <ScrollArea.Viewport className="px-2 py-2">
              <ul className={cn('space-y-1', dense && 'space-y-0.5')}>
                {items.map(it => {
                  const isActive = activeId === it.id;
                  return (
                    <li key={it.id}>
                      <a
                        href={`#${it.id}`}
                        className={cn(
                          'group flex items-center gap-2 rounded-xl px-3 py-2 text-sm',
                          'text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors',
                          dense && 'py-1.5',
                          isActive && ['bg-blue-100/70 text-blue-900', 'ring-1 ring-blue-200/60'],
                        )}
                        aria-current={isActive ? 'location' : undefined}
                      >
                        {it.icon && (
                          <span
                            className={cn(
                              'text-blue-600 group-hover:text-blue-700 transition-colors',
                              isActive && 'text-blue-800',
                            )}
                          >
                            {it.icon}
                          </span>
                        )}
                        <span className="truncate">{it.label}</span>

                        {/* subtle dot indicator */}
                        <span
                          className={cn(
                            'ml-auto h-1.5 w-1.5 rounded-full bg-transparent',
                            isActive && 'bg-blue-600',
                          )}
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </ScrollArea.Viewport>

            <ScrollArea.Scrollbar
              orientation="vertical"
              className="flex select-none touch-none p-0.5 bg-transparent"
            >
              <ScrollArea.Thumb className="flex-1 bg-gray-200 rounded-full" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        </div>
      </aside>
    </>
  );
}
