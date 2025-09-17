// src/components/form/MobileNavigation.tsx - TOUJOURS VISIBLE sans scroll
'use client';

import clsx from 'clsx';
import { ArrowLeft, ArrowRight, FileText, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import * as React from 'react';

interface MobileNavigationProps {
  currentStepIndex: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => Promise<void>;
  isLastStep: boolean;
  isSubmitting: boolean;
  formData?: any;
  onFieldChange?: (field: string, value: any) => void;
  variant?: 'default' | 'eligibility';
}

/**
 * Navigation mobile TOUJOURS VISIBLE - aucun scroll nécessaire
 * Optimisée pour tous les devices et orientations
 */
const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentStepIndex,
  totalSteps,
  canGoNext,
  canGoPrev,
  onNext,
  onPrev,
  onSubmit,
  isLastStep,
  isSubmitting,
  variant = 'default',
}) => {
  const handleMainAction = async () => {
    if (!isLastStep) {
      onNext();
      return;
    }
    await onSubmit();
  };

  // Animation variants pour les boutons
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  };

  return (
    <>
      {/* Navigation mobile FIXE - TOUJOURS VISIBLE */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)', // Support iPhone notch
        }}
      >
        {/* Backdrop blur effet moderne */}
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm border-t border-gray-200" />

        {/* Contenu navigation */}
        <div className="relative px-4 py-3">
          <div className="max-w-[640px] mx-auto">
            <div className="flex items-center gap-3">
              {/* Bouton Retour */}
              <motion.button
                type="button"
                onClick={onPrev}
                disabled={!canGoPrev || isSubmitting}
                variants={buttonVariants}
                initial="idle"
                whileHover={canGoPrev && !isSubmitting ? 'hover' : 'idle'}
                whileTap={canGoPrev && !isSubmitting ? 'tap' : 'idle'}
                className={clsx(
                  'inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all min-h-[48px] min-w-[100px]',
                  {
                    'bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300 shadow-sm':
                      canGoPrev && !isSubmitting,
                    'bg-gray-50 text-gray-400 cursor-not-allowed': !canGoPrev || isSubmitting,
                  },
                )}
              >
                <ArrowLeft className="w-4 h-4 flex-shrink-0" />
                <span className="hidden xs:inline text-sm">Retour</span>
              </motion.button>

              {/* Bouton principal (Suivant/Générer) */}
              <motion.button
                type="button"
                onClick={handleMainAction}
                disabled={!canGoNext || isSubmitting}
                variants={buttonVariants}
                initial="idle"
                whileHover={canGoNext && !isSubmitting ? 'hover' : 'idle'}
                whileTap={canGoNext && !isSubmitting ? 'tap' : 'idle'}
                className={clsx(
                  'flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all min-h-[48px]',
                  {
                    // Style selon le type et l'état
                    'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg':
                      isLastStep && canGoNext && !isSubmitting,
                    'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg':
                      !isLastStep && canGoNext && !isSubmitting,
                    'bg-gray-200 text-gray-500 cursor-not-allowed': !canGoNext || isSubmitting,
                  },
                )}
              >
                {isSubmitting ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                    <span className="text-sm">
                      {variant === 'eligibility' ? 'Analyse...' : 'Génération...'}
                    </span>
                  </motion.div>
                ) : isLastStep ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    {variant === 'eligibility' ? (
                      <>
                        <Sparkles className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-bold">Voir mon résultat</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-bold">Générer ma lettre</span>
                      </>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-sm font-bold">Suivant</span>
                    <ArrowRight className="w-4 h-4 flex-shrink-0" />
                  </motion.div>
                )}
              </motion.button>
            </div>

            {/* Indicateur de progression compact */}
            <div className="mt-3 flex items-center justify-center">
              <div className="flex items-center gap-1">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div
                    key={i}
                    className={clsx('w-2 h-2 rounded-full transition-all duration-300', {
                      'bg-blue-600 scale-125': i === currentStepIndex,
                      'bg-green-600': i < currentStepIndex,
                      'bg-gray-300': i > currentStepIndex,
                    })}
                  />
                ))}
              </div>
              <span className="ml-3 text-xs text-gray-500">
                {currentStepIndex + 1}/{totalSteps}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ESPACE RÉSERVÉ OBLIGATOIRE pour compenser la navigation fixe */}
      {/* Hauteur: padding-top (12px) + bouton (48px) + indicateur (24px) + padding-bottom (12px) + safe-area */}
      <div
        className="h-24 md:hidden flex-shrink-0"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      />

      {/* Navigation desktop (simplifiée et harmonisée) */}
      <div className="hidden md:flex items-center justify-between mt-8">
        <motion.button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev || isSubmitting}
          variants={buttonVariants}
          initial="idle"
          whileHover={canGoPrev && !isSubmitting ? 'hover' : 'idle'}
          whileTap={canGoPrev && !isSubmitting ? 'tap' : 'idle'}
          className={clsx(
            'inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors',
            {
              'text-gray-700 hover:bg-gray-100 active:bg-gray-200': canGoPrev && !isSubmitting,
              'text-gray-400 cursor-not-allowed': !canGoPrev || isSubmitting,
            },
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </motion.button>

        <motion.button
          type="button"
          onClick={handleMainAction}
          disabled={!canGoNext || isSubmitting}
          variants={buttonVariants}
          initial="idle"
          whileHover={canGoNext && !isSubmitting ? 'hover' : 'idle'}
          whileTap={canGoNext && !isSubmitting ? 'tap' : 'idle'}
          className={clsx(
            'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all',
            {
              'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl':
                isLastStep && canGoNext && !isSubmitting,
              'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl':
                !isLastStep && canGoNext && !isSubmitting,
              'bg-gray-200 text-gray-500 cursor-not-allowed': !canGoNext || isSubmitting,
            },
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {variant === 'eligibility' ? 'Analyse en cours...' : 'Génération en cours...'}
            </>
          ) : isLastStep ? (
            <>
              {variant === 'eligibility' ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Voir mon résultat
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Générer ma lettre
                </>
              )}
            </>
          ) : (
            <>
              Suivant
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </>
  );
};

export default MobileNavigation;
