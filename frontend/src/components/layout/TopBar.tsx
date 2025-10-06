'use client';

import { motion } from 'framer-motion';
import { FileText, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { Container, Button } from '@/components/ui';
import { getAllGuides } from '@/lib/guide-registry';

// --- NavLink Component ---
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

// --- GUIDES DROPDOWN adapté au nouveau guide-registry ---
function GuidesDropdown() {
  const [isOpen, setIsOpen] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  // 🔧 ADAPTÉ: Utilisation du nouveau guide-registry
  const { allGuides, guidesCount, isLoading } = React.useMemo(() => {
    try {
      const guides = getAllGuides();

      return {
        allGuides: guides || {},
        guidesCount: Object.keys(guides || {}).length,
        isLoading: false,
      };
    } catch (error) {
      console.warn('Could not load guides from registry:', error);
      return {
        allGuides: {},
        guidesCount: 0,
        isLoading: false,
      };
    }
  }, []);

  // 🎯 Guides populaires - adaptés aux slugs disponibles
  const popularGuides = React.useMemo(() => {
    const popularSlugs = [
      'garantie-legale-conformite-guide-complet',
      'smartphone-ecran-batterie-defaut-garantie-legale',
      'voiture-electrique-defaut-garantie-legale',
      'lave-linge-panne-garantie-legale',
      'action-groupe',
      'mediation-consommation',
    ];

    return popularSlugs
      .map(slug => {
        const guide = allGuides[slug];
        if (guide) {
          return {
            slug,
            title: guide.metadata.title,
            emoji: getCategoryEmoji(guide.category?.id),
          };
        }
        return null;
      })
      .filter(Boolean)
      .slice(0, 4); // Limiter à 4 guides max
  }, [allGuides]);

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
              {/* 🔧 ADAPTÉ: Guides dynamiques depuis le registry */}
              {popularGuides.length > 0 ? (
                popularGuides.map(guide => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <span className="mr-2">{guide.emoji}</span>
                    {truncateTitle(guide.title, 45)}
                  </Link>
                ))
              ) : (
                // Fallback statique si pas de guides dynamiques
                <>
                  <Link
                    href="/guides/garantie-legale-conformite-guide-complet"
                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    📋 Guide général de la garantie légale
                  </Link>
                  <Link
                    href="/guides/smartphone-ecran-batterie-defaut-garantie-legale"
                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    📱 Smartphones et High-Tech
                  </Link>
                  <Link
                    href="/guides/voiture-electrique-defaut-garantie-legale"
                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    🚗 Voitures et défauts
                  </Link>
                  <Link
                    href="/guides/lave-linge-panne-garantie-legale"
                    className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    🏠 Électroménager
                  </Link>
                </>
              )}
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

// --- Utilitaires ---

/**
 * Associe une emoji à chaque catégorie
 */
function getCategoryEmoji(categoryId?: string): string {
  const emojiMap: Record<string, string> = {
    tech: '📱',
    auto: '🚗',
    home: '🏠',
    general: '📋',
  };

  return emojiMap[categoryId || 'general'] || '📋';
}

/**
 * Tronque un titre s'il est trop long
 */
function truncateTitle(title: string, maxLength: number): string {
  if (title.length <= maxLength) return title;

  // Coupe au dernier espace avant la limite
  const truncated = title.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSpace > maxLength * 0.7) {
    return truncated.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

// --- TopBar complet ---
function TopBar({ ctaHref = '/eligibilite#start' }: { ctaHref?: string }) {
  return (
    <nav
      id="topbar"
      className="site-header hidden md:block fixed top-0 w-full bg-white backdrop-blur border-b border-gray-200 z-50 h-20"
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
          <NavLink href="/#problemes">Problèmes courants</NavLink>
          <NavLink href="/#process">Processus</NavLink>
          <NavLink href="/#fiabilite">Confiance</NavLink>
          <NavLink href="/faq">FAQ</NavLink>
          <GuidesDropdown />
          <Button href={ctaHref} icon={<FileText className="w-4 h-4" aria-hidden="true" />}>
            Commencer
          </Button>
        </div>
      </Container>
    </nav>
  );
}

export default TopBar;
