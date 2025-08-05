// src/components/navigation/GuidesMenu.tsx - VERSION CORRIGÉE
'use client';

import Link from 'next/link';
import * as React from 'react';
import Button from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/DropdownMenu';
import { BookOpen, ChevronDown } from 'lucide-react';
import { PAGES } from '@/content/guides';

/**
 * Menu d'accès rapide aux guides avec compteur réel
 */
export function GuidesMenu() {
  const items = Object.entries(PAGES).map(([slug, guide]) => ({ slug, title: guide.title }));
  const guidesCount = items.length;

  // Guides populaires à afficher dans le menu
  const popularGuides = React.useMemo(() => {
    return items.slice(0, 5); // Limiter à 5 guides populaires
  }, [items]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="inline-flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50/50 transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Guides
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" sideOffset={8} className="w-80 max-h-[70vh] overflow-auto">
        <DropdownMenuLabel>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Guides pratiques
            </div>
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
              {guidesCount} guide{guidesCount > 1 ? 's' : ''}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Lien vers tous les guides */}
        <DropdownMenuItem asChild>
          <Link href="/guides" className="flex items-center gap-3 cursor-pointer">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">Tous les guides</div>
              <div className="text-xs text-gray-500">Voir la liste complète</div>
            </div>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Guides populaires */}
        {popularGuides.length > 0 && (
          <>
            <div className="px-2 py-1">
              <div className="text-xs font-medium text-gray-500 mb-2">Guides populaires</div>
              <div className="space-y-1">
                {popularGuides.map(({ slug, title }) => (
                  <DropdownMenuItem key={slug} asChild>
                    <Link
                      href={`/guides/${slug}`}
                      className="block px-2 py-2 text-sm rounded-md cursor-pointer hover:bg-blue-50"
                    >
                      <div className="truncate font-medium">{title}</div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
            </div>

            <DropdownMenuSeparator />
          </>
        )}

        {/* CTA */}
        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 m-1 rounded-md">
          <div className="text-xs font-medium text-gray-700 mb-2">Besoin d'aide maintenant ?</div>
          <Button as={Link} href="/eligibilite" size="sm" className="w-full">
            Commencer
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default GuidesMenu;
