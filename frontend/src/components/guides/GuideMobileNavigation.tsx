// src/components/guides/GuideMobileNavigation.tsx
// Navigation mobile spécialisée avec progress et drawer

'use client';

import { BookOpen, Menu, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import TableOfContents from '@/components/guides/TableOfContents';
import type { GuidePage } from '@/types/guides';

interface GuideMobileNavigationProps {
  guide: GuidePage & { slug: string };
}

// Composant barre de progression
function ProgressBar({ value, className = '' }: { value: number; className?: string }) {
  return (
    <div className={`w-full bg-gray-200 ${className}`}>
      <div
        className="h-full bg-blue-600 transition-all duration-300 ease-out"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}

export default function GuideMobileNavigation({ guide }: GuideMobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Barre de progression sticky - Affichée uniquement sur mobile */}
      <div className="md:hidden sticky top-0 z-40 bg-white border-b">
        <ProgressBar value={scrollProgress} className="h-1" />

        <div className="flex items-center justify-between px-4 py-2">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors min-h-[44px] min-w-[44px] justify-start"
          >
            <Menu className="w-4 h-4" />
            <span>Sommaire</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{Math.round(scrollProgress)}%</span>
            <Button
              size="sm"
              href="/eligibilite"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5"
            >
              Créer lettre
            </Button>
          </div>
        </div>
      </div>

      {/* Modal sommaire mobile */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Sommaire du guide"
        className="md:hidden"
      >
        <div className="max-h-[70vh] overflow-y-auto">
          {/* Progression en haut du modal */}
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium text-blue-900">Progression</span>
              <span className="text-blue-700">{Math.round(scrollProgress)}%</span>
            </div>
            <ProgressBar value={scrollProgress} className="h-2 rounded-full" />
          </div>

          {/* TableOfContents existant avec configuration mobile */}
          <TableOfContents
            sections={guide.sections}
            onSectionClick={() => setIsOpen(false)}
            showProgress={true}
            compact={true}
            className="space-y-2"
          />

          {/* CTA rapides en bas du modal */}
          <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
            <Button
              href="/eligibilite"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setIsOpen(false)}
            >
              Créer ma lettre maintenant
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
              Fermer le sommaire
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
