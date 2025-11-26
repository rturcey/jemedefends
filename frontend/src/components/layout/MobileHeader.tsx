'use client';

import { Menu, X, FileText } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { NAV_ITEMS } from '@/components/layout/nav.config';
import { Button } from '@/components/ui/button';

export default function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const menuItems = useMemo(() => NAV_ITEMS.filter(it => !it.desktopOnly), []);

  return (
    <>
      <header
        className={`md:hidden fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          isScrolled ? 'shadow-md' : 'shadow-sm'
        }`}
        style={{ height: '64px' }}
      >
        <div className="h-full px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center" onClick={closeMenu}>
            <Image
              src="/images/logo_jemedefends.png"
              alt="Je me défends"
              width={140}
              height={42}
              className="h-10 w-auto"
              priority
            />
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(v => !v)}
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isOpen}
            className="h-12 w-12 rounded-lg"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </Button>
        </div>
      </header>

      {isOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            style={{ top: '64px' }}
            onClick={closeMenu}
            aria-hidden="true"
          />

          <nav
            className="md:hidden fixed top-16 left-0 right-0 bottom-0 z-50 bg-white overflow-y-auto"
            aria-label="Menu mobile"
          >
            <div className="px-4 py-6 space-y-2">
              {menuItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {item.label}
                  </span>
                </Link>
              ))}

              <div className="py-4">
                <div className="h-px bg-gray-200" />
              </div>

              <Button asChild size="lg" className="w-full min-h-[56px] gap-2 shadow-lg">
                <Link href="/eligibilite" onClick={closeMenu}>
                  <FileText className="w-5 h-5" />
                  Créer ma lettre gratuite
                </Link>
              </Button>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    100% gratuit
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />2 minutes
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    Articles de loi
                  </span>
                </div>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
