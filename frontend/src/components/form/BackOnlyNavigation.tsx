// src/components/form/BackOnlyNavigation.tsx - Navigation spécifique éligibilité
'use client';

import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import * as React from 'react';

interface BackOnlyNavigationProps {
  canGoPrev: boolean;
  onPrev: () => void;
  currentStep: number;
  totalSteps: number;
  disabled?: boolean;
}

/**
 * Navigation "Retour" spécifique pour l'éligibilité
 * TOUJOURS visible en bas sur mobile, jamais de scroll nécessaire
 * VERSION SIMPLIFIÉE : sans indicateur "Question X sur Y"
 */
const BackOnlyNavigation: React.FC<BackOnlyNavigationProps> = ({
  canGoPrev,
  onPrev,
  currentStep,
  totalSteps,
  disabled = false,
}) => {
  const isDisabled = disabled || !canGoPrev;

  // N'affiche rien si on est à la première étape
  if (!canGoPrev) {
    return <div className="h-20 md:hidden" />; // Espace réservé pour cohérence
  }

  return (
    <>
      {/* Desktop - bouton placé naturellement dans le flow */}
      <div className="hidden md:block mt-6">
        <motion.button
          type="button"
          onClick={onPrev}
          disabled={isDisabled}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={!isDisabled ? { scale: 1.02 } : undefined}
          whileTap={!isDisabled ? { scale: 0.98 } : undefined}
          className={clsx(
            'inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all',
            {
              'text-gray-700 hover:bg-gray-100 active:bg-gray-200': !isDisabled,
              'text-gray-400 cursor-not-allowed': isDisabled,
            },
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </motion.button>
      </div>

      {/* Mobile - NAVIGATION FIXE TOUJOURS VISIBLE - SIMPLIFIÉE */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)', // Gère les encoches iPhone
        }}
      >
        {/* Backdrop avec blur pour séparer du contenu */}
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm border-t border-gray-200" />

        {/* Contenu navigation - CENTRÉ ET SIMPLIFIÉ */}
        <div className="relative px-4 py-3">
          <div className="max-w-[640px] mx-auto flex justify-center">
            {/* Bouton Retour - design cohérent */}
            <motion.button
              type="button"
              onClick={onPrev}
              disabled={isDisabled}
              whileHover={!isDisabled ? { scale: 1.02 } : undefined}
              whileTap={!isDisabled ? { scale: 0.98 } : undefined}
              className={clsx(
                'inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold transition-all min-h-[48px] min-w-[120px]',
                {
                  'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 shadow-sm':
                    !isDisabled,
                  'bg-gray-50 text-gray-400 cursor-not-allowed': isDisabled,
                },
              )}
            >
              <ArrowLeft className="w-5 h-5" />
              Retour
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ESPACE RÉSERVÉ pour compenser la navigation fixe mobile */}
      {/* Hauteur calculée : padding (12px) + bouton (48px) + padding (12px) + safe-area */}
      <div
        className="h-20 md:hidden flex-shrink-0"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      />
    </>
  );
};

export default BackOnlyNavigation;
