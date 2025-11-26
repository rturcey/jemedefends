'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUp } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { useMobileOptimization } from '@/hooks/useMobileOptimization';

export default function StickyMobileCTA() {
  const { isMobile } = useMobileOptimization();
  const [isVisible, setIsVisible] = React.useState(false);
  const [showScrollTop, setShowScrollTop] = React.useState(false);

  React.useEffect(() => {
    let ticking = false;

    const updateVisibility = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      const shouldShow = scrollY > windowHeight * 0.5;
      const nearFooter = scrollY + windowHeight > documentHeight - 200;
      const shouldShowScrollTop = scrollY > windowHeight * 2;

      setIsVisible(shouldShow && !nearFooter);
      setShowScrollTop(shouldShowScrollTop);

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking && isMobile) {
        requestAnimationFrame(updateVisibility);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-4 z-50 px-4"
        >
          <div className="flex items-center gap-3 max-w-sm mx-auto">
            <Link
              href="/eligibilite"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 font-bold text-white
                         bg-gradient-to-r from-blue-600 to-indigo-600
                         hover:from-blue-700 hover:to-indigo-700
                         shadow-lg hover:shadow-xl
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                         transform active:scale-95 transition-all duration-200"
              data-umami-event="sticky-cta-mobile"
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-sm">Tester gratuitement</span>
            </Link>

            {showScrollTop && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={scrollToTop}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200
                           flex items-center justify-center text-gray-600 hover:text-blue-600
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                           transform active:scale-95 transition-all duration-200"
                aria-label="Retour en haut"
              >
                <ArrowUp className="h-5 w-5" />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
