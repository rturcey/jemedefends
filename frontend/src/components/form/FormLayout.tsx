// src/components/form/FormLayout.tsx - Navigation toujours accessible
'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import * as React from 'react';

import MobileNavigation from '@/components/form/MobileNavigation';
import SaveStatus from '@/components/form/SaveStatus';
import Container from '@/components/ui/Container';

interface FormLayoutProps {
  children: React.ReactNode;

  // Progress
  currentStep: number;
  totalSteps: number;

  // Navigation
  canGoNext: boolean;
  canGoPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
  isSubmitting?: boolean;

  // Status & Errors
  saveStatus?: 'saving' | 'saved' | 'error';
  globalError?: string | null;
  onClearGlobalError?: () => void;

  // Sidebar (optionnel)
  sidebar?: React.ReactNode;

  // Debug (optionnel)
  showTestData?: boolean;
  onTestData?: () => void;

  // Props pour MobileNavigation
  formData?: any;
  onFieldChange?: (field: string, value: any) => void;

  // Variant pour adapter le style
  variant?: 'default' | 'eligibility';
}

interface GlobalErrorProps {
  error: string | null;
  onClose: () => void;
}

const GlobalError: React.FC<GlobalErrorProps> = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className="fixed bottom-28 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg z-40"
      role="alert"
      style={{
        marginBottom: 'env(safe-area-inset-bottom)', // Au-dessus de la navigation
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-5 h-5 text-red-500 mt-0.5">
          <svg fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-red-800">Erreur</h3>
          <p className="text-sm text-red-700 mt-1 leading-relaxed">{error}</p>
        </div>
        <button
          type="button"
          className="flex-shrink-0 text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg p-1 transition-colors"
          onClick={onClose}
        >
          <span className="sr-only">Fermer</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

const FormLayout: React.FC<FormLayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  canGoNext,
  canGoPrev,
  onNext,
  onPrev,
  onSubmit,
  isLastStep = false,
  isSubmitting = false,
  saveStatus = 'saved',
  globalError,
  onClearGlobalError,
  sidebar,
  showTestData = false,
  onTestData,
  formData,
  onFieldChange,
  variant = 'default',
}) => {
  const handleNext = () => onNext();
  const handlePrev = () => onPrev();
  const handleSubmit = async () => {
    if (onSubmit) {
      await onSubmit();
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50`}>
      {/* ✅ CONTAINER OPTIMISÉ POUR FORMULAIRES */}
      <Container variant="form" className="py-8 md:py-12">
        {/* ✅ INDICATEUR DE PROGRESSION MODERNE */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <span>
              Étape {currentStep + 1} sur {totalSteps}
            </span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentStep + 1) / totalSteps) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        </div>

        {/* Bouton test data en dev - Position ajustée */}
        {showTestData && process.env.NODE_ENV === 'development' && onTestData && (
          <button
            type="button"
            onClick={onTestData}
            className="fixed bottom-6 right-6 z-30 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors px-4 py-2 text-sm font-medium"
            disabled={isSubmitting}
          >
            Test Data
          </button>
        )}

        {/* Statut de sauvegarde discret */}
        <div className="mb-4">
          <SaveStatus status={saveStatus} />
        </div>

        {/* Contenu principal avec animations */}
        <motion.div
          key={`step-${currentStep}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="[&_.step-section]:p-0 [&_.step-section_h2]:text-xl [&_.step-section_h2]:font-semibold [&_.step-section_h2]:mb-3"
        >
          {children}
        </motion.div>

        {/* Erreur globale - positionnée au-dessus de la navigation */}
        {globalError && onClearGlobalError && (
          <GlobalError error={globalError} onClose={onClearGlobalError} />
        )}
      </Container>

      {/* NAVIGATION MOBILE TOUJOURS VISIBLE - En dehors du scroll */}
      <MobileNavigation
        currentStepIndex={currentStep}
        totalSteps={totalSteps}
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
        onNext={handleNext}
        onPrev={handlePrev}
        onSubmit={handleSubmit}
        isLastStep={isLastStep}
        isSubmitting={isSubmitting}
        formData={formData}
        onFieldChange={onFieldChange}
        variant={variant}
      />
    </div>
  );
};

export default FormLayout;
