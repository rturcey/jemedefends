// extrait à intégrer dans LegalLayout (desktop)
import { cn } from '@/lib/utils';
import Link from 'next/link';

export type LegalTOCItem = { id: string; label?: string; title?: string; icon?: React.ReactNode };

export default function LegalTOC({ toc }: { toc: LegalTOCItem[] }) {
  if (!toc?.length) return null;

  return (
    <aside
      className={cn(
        'hidden lg:block w-[280px] shrink-0 self-start',
        'sticky top-24', // ✅ sticky réel
      )}
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
          Sommaire
        </div>

        <nav className="space-y-1">
          {toc.map(item => {
            const text = item.label ?? item.title ?? '';
            return (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  'group flex items-start gap-2 rounded-lg px-2.5 py-2 text-sm',
                  'text-gray-700 hover:text-blue-700 hover:bg-blue-50 transition-colors',
                )}
              >
                {item.icon && (
                  <span className="mt-0.5 text-blue-600 group-hover:text-blue-700">
                    {item.icon}
                  </span>
                )}
                <span className="leading-snug">{text}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
