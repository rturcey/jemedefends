// src/components/layout/TopBar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, FileText } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

const HEADER_H = 80; // 5rem

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_H - 8;
  window.scrollTo({ top, behavior: 'smooth' });
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);
  const pathname = usePathname();

  const isHash = href.startsWith('/#') || href.startsWith('#');
  const id = href.replace('/#', '').replace('#', '');
  const onClick: React.MouseEventHandler<HTMLAnchorElement> = e => {
    if (isHash && (pathname === '/' || pathname.startsWith('/(site)'))) {
      e.preventDefault();
      scrollToId(id);
    }
  };

  return (
    <motion.a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative px-1 py-1 text-gray-700 hover:text-blue-700 transition-colors"
      whileTap={{ scale: 0.98 }}
    >
      {children}
      <motion.span
        layoutId="nav-underline"
        className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-blue-600 rounded-full"
        initial={false}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 450, damping: 35, mass: 0.2 }}
      />
    </motion.a>
  );
}

// --- Correction GUIDES DROPDOWN ---
function GuidesDropdown() {
  const [isOpen, setIsOpen] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  const { PAGES } = React.useMemo(() => {
    try {
      return require('@/content/guides');
    } catch {
      return { PAGES: {} };
    }
  }, []);

  const guidesCount = Object.keys(PAGES).length;

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className="flex items-center gap-1 px-1 py-1 text-gray-700 hover:text-blue-700 transition-colors">
        Guides
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 z-50">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-2">Guides les plus consultés</h3>
            <div className="space-y-2">
              <Link
                href="/guides/garantie-legale-conformite"
                className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                📋 Guide général de la garantie légale
              </Link>
              <Link
                href="/guides/faire-jouer-garantie"
                className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                ⚖️ Comment faire jouer la garantie
              </Link>
              <Link
                href="/guides/smartphones-telephone-en-panne"
                className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                📱 Smartphones et High-Tech
              </Link>
              <Link
                href="/guides/voiture-defauts"
                className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                🚗 Voitures et défauts
              </Link>
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
        </div>
      )}
    </div>
  );
}

// --- TopBar complet ---
function TopBar({ ctaHref = '/eligibilite#start' }: { ctaHref?: string }) {
  return (
    <nav
      id="topbar"
      className="site-header hidden md:block fixed top-0 w-full bg-white/80 backdrop-blur border-b border-gray-200 z-50 h-20"
      aria-label="Navigation principale"
    >
      <Container className="h-full flex justify-between items-center">
        <Link href="/" aria-label="Je me défends – Accueil" className="flex items-center gap-3">
          <Image
            src="/images/logo_jemedefends.svg"
            alt="Je me défends – Mes droits, simplement"
            width={160}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </Link>

        <div className="hidden md:flex gap-6 items-center font-medium">
          <NavLink href="/#problemes">Problèmes courants</NavLink>
          <NavLink href="/#process">Processus</NavLink>
          <NavLink href="/#fiabilite">Confiance</NavLink>
          <NavLink href="/faq">FAQ</NavLink>
          <GuidesDropdown />
          <Button href={ctaHref}>
            <FileText className="w-4 h-4" aria-hidden="true" />
            Commencer
          </Button>
        </div>
      </Container>
    </nav>
  );
}

export default TopBar;
