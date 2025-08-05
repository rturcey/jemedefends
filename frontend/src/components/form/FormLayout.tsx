'use client';

import * as React from 'react';
import ProgressBar from '@/components/ui/progress/ProgressBar';
import SaveStatus from '@/components/form/SaveStatus';
import MobileNavigation from '@/components/form/MobileNavigation';
import GlobalError from '@/components/ui/GlobalError';

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
}

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
}: FormLayoutProps) {
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
                onNext={onNext}
                onPrev={onPrev}
                onSubmit={onSubmit || (() => {})}
                isLastStep={isLastStep}
                isSubmitting={isSubmitting}
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
