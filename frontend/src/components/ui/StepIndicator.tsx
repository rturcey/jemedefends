// src/components/ui/StepIndicator.tsx - Design moderne et harmonisé
'use client';

import clsx from 'clsx';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import * as React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  variant?: 'default' | 'compact';
  className?: string;
  showLabels?: boolean;
  stepLabels?: string[];
}

/**
 * Indicateur d'étapes moderne avec animations fluides
 * Optimisé mobile-first avec états visuels clairs
 */
const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  variant = 'default',
  className = '',
  showLabels = false,
  stepLabels = [],
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i);

  return (
    <div className={clsx('flex items-center justify-center', className)}>
      <div className="flex items-center space-x-2">
        {steps.map((stepIndex, arrayIndex) => {
          const stepNumber = stepIndex + 1;
          const isActive = stepNumber === currentStep + 1;
          const isCompleted = stepNumber < currentStep + 1;
          const isUpcoming = stepNumber > currentStep + 1;

          return (
            <React.Fragment key={stepIndex}>
              {/* Étape */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    boxShadow: isActive
                      ? '0 0 0 4px rgb(59 130 246 / 0.15)'
                      : '0 0 0 0px transparent',
                  }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className={clsx(
                    'relative flex items-center justify-center rounded-full font-semibold transition-all duration-200',
                    {
                      // Tailles selon variant
                      'w-8 h-8 text-sm': variant === 'compact',
                      'w-10 h-10 text-sm md:w-12 md:h-12 md:text-base': variant === 'default',

                      // États de couleur
                      'bg-blue-600 text-white ring-4 ring-blue-100': isActive,
                      'bg-green-600 text-white': isCompleted && !isActive,
                      'bg-gray-200 text-gray-500': isUpcoming,
                    },
                  )}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <CheckCircle
                        className={clsx(
                          'text-white',
                          variant === 'compact' ? 'w-4 h-4' : 'w-5 h-5 md:w-6 md:h-6',
                        )}
                      />
                    </motion.div>
                  ) : (
                    <motion.span
                      initial={false}
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {stepNumber}
                    </motion.span>
                  )}
                </motion.div>

                {/* Label optionnel */}
                {showLabels && stepLabels[stepIndex] && (
                  <span
                    className={clsx('mt-2 text-xs font-medium text-center leading-tight', {
                      'text-blue-600': isActive,
                      'text-green-600': isCompleted && !isActive,
                      'text-gray-400': isUpcoming,
                    })}
                  >
                    {stepLabels[stepIndex]}
                  </span>
                )}
              </div>

              {/* Ligne de connexion */}
              {arrayIndex < totalSteps - 1 && (
                <div className="relative">
                  <div
                    className={clsx(
                      'bg-gray-200 transition-all duration-300',
                      variant === 'compact' ? 'w-6 h-0.5' : 'w-8 h-0.5 md:w-10',
                    )}
                  />
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{
                      width: isCompleted ? '100%' : '0%',
                    }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className={clsx('absolute top-0 left-0 bg-green-600 h-0.5')}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
