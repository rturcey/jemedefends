// src/hooks/useScrollOffset.ts
'use client';

export function useScrollOffset() {
  function getOffset() {
    const isDesktop =
      typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;
    const topbar = isDesktop ? 80 : 48;
    const progress = 32;
    return topbar + progress + 8;
  }

  const scrollToElement = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = window.scrollY + el.getBoundingClientRect().top - getOffset();
    window.scrollTo({ top: y, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  };
  return { scrollToElement };
}
