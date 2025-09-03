'use client';

import * as React from 'react';
import ProgressBar from '@/components/ui/progress/ProgressBar';
import SaveStatus from '@/components/form/SaveStatus';
import MobileNavigation from '@/components/form/MobileNavigation';

interface FormLayoutProps {
  children: React.ReactNode;

  // Progress
  currentStep: number;
  totalSteps: number;
  stepTitle?: string;
  progressPercent: number;

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

  // Props supplémentaires nécessaires pour MobileNavigation
  formData?: any;
  onFieldChange?: (field: string, value: any) => void;
}

interface GlobalErrorProps {
  error: string | null;
  onClose: () => void;
}

export const GlobalError: React.FC<GlobalErrorProps> = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg z-50"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <h3 className="font-medium text-red-800">Erreur</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
        <button
          type="button"
          className="ml-auto text-red-400 hover:text-red-600 focus:outline-none"
          onClick={onClose}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

function FormLayout({
  children,
  currentStep,
  totalSteps,
  stepTitle,
  progressPercent,
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
}: FormLayoutProps) {
  // Handlers pour la navigation mobile
  const handleNext = () => {
    onNext();
  };

  const handlePrev = () => {
    onPrev();
  };

  const handleSubmit = async () => {
    if (onSubmit) {
      await onSubmit();
    }
  };

  return (
    <div className="min-h-screen">
      <main className="mx-auto w-full max-w-4xl px-4 py-6 md:py-10">
        {/* Layout adaptatif : une seule colonne centrée sur écrans normaux */}
        <div className="w-full max-w-2xl mx-auto">
          {/* ========= FORM PRINCIPALE ========= */}
          <section className="w-full">
            {/* Barre de progress */}
            <div className="mb-2">
              <ProgressBar value={progressPercent} className="h-2" />
              <p className="text-xs text-gray-500 mt-1 text-right">
                Étape {currentStep + 1} sur {totalSteps}
                {stepTitle && ` : ${stepTitle}`}
              </p>
            </div>

            {/* Bouton test data en dev */}
            {showTestData && process.env.NODE_ENV === 'development' && onTestData && (
              <button
                type="button"
                onClick={onTestData}
                className="fixed bottom-6 right-6 z-50 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors px-4 py-2 text-sm font-medium"
                disabled={isSubmitting}
              >
                Test Data
              </button>
            )}

            {/* Statut save discret */}
            <div className="mb-4">
              <SaveStatus status={saveStatus} />
            </div>

            {/* CONTENU PRINCIPAL – sans card, marges sobres */}
            <div className="[&_.step-section]:p-0 [&_.step-section_h2]:text-[20px] [&_.step-section_h2]:font-semibold [&_.step-section_h2]:mb-1">
              {children}
            </div>

            {/* Navigation mobile */}
            <div className="mt-6">
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
              />
            </div>

            {/* Erreurs globales */}
            {globalError && onClearGlobalError && (
              <div className="mt-4">
                <GlobalError error={globalError} onClose={onClearGlobalError} />
              </div>
            )}
          </section>

          {/* ========= SIDEBAR (sur le côté, séparée) ========= */}
        </div>

        {sidebar && (
          <aside className="hidden lg:block fixed top-20 right-4 w-80">
            <div className="lg:sticky lg:top-20">{sidebar}</div>
          </aside>
        )}
      </main>
    </div>
  );
}

export default FormLayout;
