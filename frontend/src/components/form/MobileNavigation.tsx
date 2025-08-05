import React from 'react';

interface MobileNavigationProps {
  currentStepIndex: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  isLastStep: boolean;
  isSubmitting: boolean;
}

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
}) => {
  // Mobile-only sticky nav with equal-width buttons
  return (
    <div
      className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-gray-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75 px-4 py-3"
      role="region"
      aria-label="Navigation mobile du formulaire"
    >
      <div className="mx-auto max-w-2xl grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev || isSubmitting || currentStepIndex === 0}
          className="w-full inline-flex items-center justify-center rounded-xl border border-gray-300 px-4 py-3 text-sm font-medium text-gray-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Étape précédente"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 111.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Précédent
        </button>

        <button
          type={isLastStep ? 'submit' : 'button'}
          onClick={isLastStep ? onSubmit : onNext}
          disabled={(!canGoNext && !isLastStep) || isSubmitting}
          className="w-full inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-white bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isLastStep ? 'Générer ma lettre' : 'Étape suivante'}
        >
          <span>{isLastStep ? 'Générer ma lettre' : 'Suivant'}</span>
          <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MobileNavigation;
