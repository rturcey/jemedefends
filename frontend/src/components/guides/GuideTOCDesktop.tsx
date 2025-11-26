'use client';
import { BookOpen, ChevronDown } from 'lucide-react';
import React from 'react';
import { useTocStable } from '@/hooks/useTocStable'; // version stable qu’on a posée

// Si tu n’as pas encore mis le paramètre 'main article' côté hook,
// garde-le ici pour être sûr de ne scanner que le contenu central.
type H2Item = {
  id: string;
  title: string;
  level: number; // 2
  children?: { id: string; title: string; level: number }[];
};

interface GuideTOCDesktopProps {
  className?: string;
}

export default function GuideTOCDesktop({ className = '' }: GuideTOCDesktopProps) {
  const { items, activeId, scrollToId } = useTocStable('main article') as {
    items: H2Item[];
    activeId: string | null;
    scrollToId: (id: string) => void;
  };

  // On garde un seul H2 ouvert (accordéon)
  const [openH2Id, setOpenH2Id] = React.useState<string | null>(null);

  // Pour éviter qu’un scroll (changement d’activeId) referme immédiatement
  // la section que l’utilisateur vient d’ouvrir manuellement.
  const interactionUntil = React.useRef<number>(0);

  const markUserInteraction = () => (interactionUntil.current = Date.now() + 600);

  const isInUserInteraction = () => Date.now() < interactionUntil.current;

  // Auto-ouvrir la section contenant l’item actif, sauf si l’utilisateur vient
  // de cliquer (on respecte la volonté manuelle pendant ~600ms)
  React.useEffect(() => {
    if (!activeId || isInUserInteraction()) return;

    const owner = items.find(h2 => h2.id === activeId || h2.children?.some(c => c.id === activeId));

    if (owner && owner.id !== openH2Id) {
      setOpenH2Id(owner.id);
    }
  }, [activeId, items, openH2Id]);

  if (!items || items.length === 0) return null;

  return (
    <div className={`hidden lg:block ${className}`}>
      <div className="sticky top-24">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-medium text-gray-900">Sommaire</h3>
            <span className="text-xs text-gray-500">({items.length})</span>
          </div>

          <nav aria-label="Sommaire du guide">
            <ul className="space-y-1 text-sm">
              {items.map(h2 => {
                const containsActive =
                  h2.id === activeId || h2.children?.some(c => c.id === activeId);

                const isOpen = openH2Id === h2.id;

                return (
                  <li key={h2.id}>
                    <button
                      type="button"
                      aria-controls={`toc-group-${h2.id}`}
                      aria-expanded={isOpen}
                      onClick={() => {
                        markUserInteraction();
                        setOpenH2Id(prev => (prev === h2.id ? null : h2.id));
                        // scroll au H2 cliqué
                        scrollToId(h2.id);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded text-xs leading-relaxed
                        ${
                          containsActive
                            ? 'text-blue-600 bg-blue-50 font-medium border-l-3 border-blue-600'
                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                    >
                      <span className="inline-flex items-center gap-1">
                        {/* pas d’animation — rotation instantanée */}
                        <ChevronDown className={`w-3 h-3 ${isOpen ? 'rotate-180' : ''}`} />
                        {h2.title}
                      </span>
                    </button>

                    {/* enfants */}
                    {isOpen && h2.children && h2.children.length > 0 && (
                      <ul id={`toc-group-${h2.id}`} className="mt-1 ml-4 border-l border-gray-100">
                        {h2.children.map(h3 => {
                          const active = h3.id === activeId;
                          return (
                            <li key={h3.id}>
                              <button
                                type="button"
                                onClick={() => {
                                  markUserInteraction();
                                  scrollToId(h3.id);
                                }}
                                className={`w-full text-left pl-3 pr-2 py-1.5 rounded text-[11px] leading-relaxed
                                  ${
                                    active
                                      ? 'text-blue-600 bg-blue-50'
                                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                  }`}
                              >
                                {h3.title}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
