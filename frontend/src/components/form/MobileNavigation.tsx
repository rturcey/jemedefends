// frontend/src/components/form/MobileNavigation.tsx - Caché sur desktop

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
 * Navigation mobile - CACHÉ SUR DESKTOP
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
    console.log('🔧 MobileNavigation.handleMainAction called', {
      isLastStep,
      canGoNext,
    });
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
      {/* CORRIGÉ: lg:hidden au lieu de md:hidden pour cacher sur desktop */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
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
                  'inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors',
                  {
                    'text-gray-700 hover:bg-gray-100 active:bg-gray-200':
                      canGoPrev && !isSubmitting,
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
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default MobileNavigation;
