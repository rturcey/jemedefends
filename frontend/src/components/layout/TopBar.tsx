'use client';

import { motion } from 'framer-motion';
import { FileText, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

import Container from '@/components/ui/Container';
import { Button } from '@/components/ui/button';
import { NAV_ITEMS } from '@/components/layout/nav.config';
import { getAllGuides } from '@/lib/guide-registry';
import { getIconFromCategoryId } from '@/lib/icon-utils';
import { cn } from '@/lib/utils';

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      className="text-gray-700 hover:text-blue-700 transition-colors font-medium"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.a>
  );
}

function GuidesDropdown() {
  const { allGuides, guidesCount } = React.useMemo(() => {
    try {
      const guides = getAllGuides();
      return {
        allGuides: guides || {},
        guidesCount: Object.keys(guides || {}).length,
      };
    } catch {
      return { allGuides: {}, guidesCount: 0 };
    }
  }, []);

  const popularGuides = React.useMemo(() => {
    const popularSlugs = [
      'garantie-legale-conformite-guide-complet',
      'smartphone-garantie-legale',
      'grandes-enseignes-et-marketplaces',
      'electromenager-garantie-legale',
    ];

    return popularSlugs
      .map(slug => {
        const guide = (allGuides as any)[slug];
        if (!guide) return null;
        return {
          slug,
          title: guide.metadata.title,
          icon: getIconFromCategoryId(guide.category?.id),
        };
      })
      .filter(Boolean)
      .slice(0, 4) as Array<{ slug: string; title: string; icon: React.ReactNode }>;
  }, [allGuides]);

  return (
    <NavigationMenu.Root className="relative">
      <NavigationMenu.List className="flex items-center">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger
            className={cn(
              'flex items-center gap-1 px-1 py-1 text-gray-700 hover:text-blue-700 transition-colors font-medium',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-md',
            )}
          >
            Guides
            <ChevronDown className="w-4 h-4 transition-transform data-[state=open]:rotate-180" />
          </NavigationMenu.Trigger>

          <NavigationMenu.Content
            className={cn(
              'absolute left-0 top-full mt-2 w-80',
              'rounded-2xl shadow-xl border border-gray-200 bg-white p-6 z-50',
            )}
          >
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Guides les plus consultés</h3>
              <div className="space-y-2">
                {popularGuides.map(guide => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="inline-flex items-start gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <div className="mt-0.5 text-blue-600">{guide.icon}</div>
                    <span className="min-w-0 whitespace-normal break-words leading-tight">
                      {guide.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Link
                href="/guides"
                className="flex items-center justify-between text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Voir tous les guides
                <div className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                  {guidesCount > 0 ? `${guidesCount} guide${guidesCount > 1 ? 's' : ''}` : 'Guides'}
                </div>
              </Link>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

export default function TopBar({ ctaHref = '/eligibilite' }: { ctaHref?: string }) {
  const mainItems = NAV_ITEMS.filter(it => !it.mobileOnly && it.label !== 'Guides');

  return (
    <nav
      id="topbar"
      className="hidden md:block fixed top-0 w-full bg-white backdrop-blur border-b border-gray-200 z-50 h-20"
      aria-label="Navigation principale"
    >
      <Container className="h-full flex justify-between items-center">
        <Link href="/" aria-label="Je me défends – Accueil" className="flex items-center gap-3">
          <Image
            src="/images/logo_jemedefends.png"
            alt="Je me défends – Mes droits, simplement"
            width={160}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </Link>

        <div className="hidden md:flex gap-6 items-center font-medium">
          {mainItems.map(item => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}

          <GuidesDropdown />

          <Button asChild size="md" className="gap-2">
            <Link href={ctaHref}>
              <FileText className="w-4 h-4" aria-hidden="true" />
              Commencer
            </Link>
          </Button>
        </div>
      </Container>
    </nav>
  );
}
