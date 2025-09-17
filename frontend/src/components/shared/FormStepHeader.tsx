// src/components/shared/FormStepHeader.tsx - Nouveau composant harmonisé
'use client';

import { motion } from 'framer-motion';
import * as React from 'react';

import LegalReference from '@/components/ui/LegalReference';

interface FormStepHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  legalRef?: string;
  stepNumber?: number;
  totalSteps?: number;
  variant?: 'default' | 'compact';
  className?: string;
}

/**
 * En-tête standardisé pour les étapes de formulaires
 * Utilisé par EligibilityForm et FormGenerator pour une cohérence parfaite
 */
const FormStepHeader: React.FC<FormStepHeaderProps> = ({
  icon,
  title,
  description,
  legalRef,
  stepNumber,
  totalSteps,
  variant = 'default',
  className = '',
}) => {
  const getDescriptionWithLegal = () => {
    return (
      <>
        {description}
        {legalRef && (
          <>
            {' '}
            <LegalReference
              code={legalRef as any}
              variant="tooltip"
              size="sm"
              showStatus
              className="text-blue-600 hover:text-blue-800"
            >
              (base légale)
            </LegalReference>
          </>
        )}
      </>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={className}
    >
      <div className="flex items-center gap-3 mb-4">
        {/* Icône dans un conteneur coloré */}
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600 flex-shrink-0">{icon}</div>

        {/* Titre et description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h2
              className={`font-semibold text-gray-900 ${
                variant === 'compact' ? 'text-lg' : 'text-xl md:text-2xl'
              }`}
            >
              {title}
            </h2>

            {/* Numéro d'étape optionnel */}
            {stepNumber && totalSteps && (
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {stepNumber}/{totalSteps}
              </span>
            )}
          </div>

          <p
            className={`text-gray-600 leading-relaxed ${
              variant === 'compact' ? 'text-sm' : 'text-base'
            }`}
          >
            {getDescriptionWithLegal()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FormStepHeader;
