'use client';

import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import * as React from 'react';

interface BackOnlyNavigationProps {
  canGoPrev: boolean;
  onPrev: () => void;
  /** Texte du bouton (par défaut "Retour") */
  label?: string;
  /** Désactive le bouton (ex: en soumission) */
  disabled?: boolean;
}

/**
 * Barre de navigation “Retour” uniquement.
 * - Mobile : barre FIXE en bas, bouton plein-largeur.
 * - Desktop : bouton en bas du formulaire, aligné à gauche.
 */
const BackOnlyNavigation: React.FC<BackOnlyNavigationProps> = ({
  canGoPrev,
  onPrev,
  label = 'Retour',
  disabled = false,
}) => {
  const isDisabled = disabled || !canGoPrev;

  // N’affiche pas la barre si on ne peut pas revenir (ex: step 0)
  const show = canGoPrev;

  return (
    <>
      {/* Desktop (≥ md) — bouton placé “idéalement” en bas du contenu */}
      {show && (
        <div className="hidden md:block">
          <div className="mt-6">
            <button
              type="button"
              onClick={onPrev}
              disabled={isDisabled}
              className={clsx(
                'inline-flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-colors',
                isDisabled
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              {label}
            </button>
          </div>
        </div>
      )}

      {/* Mobile (< md) — barre fixe en bas */}
      {show && (
        <>
          <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/80 backdrop-blur border-t border-gray-200 px-4 py-3">
            <button
              type="button"
              onClick={onPrev}
              disabled={isDisabled}
              className={clsx(
                'w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-colors',
                isDisabled
                  ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
              )}
            >
              <ArrowLeft className="h-5 w-5" />
              {label}
            </button>
          </div>
          {/* Espace pour compenser la barre fixe mobile */}
          <div className="h-20 md:hidden" />
        </>
      )}
    </>
  );
};

export default BackOnlyNavigation;
