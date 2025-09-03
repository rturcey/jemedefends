import React from 'react';

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
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  canGoNext,
  canGoPrev,
  onNext,
  onPrev,
  onSubmit,
  isLastStep,
  isSubmitting,
}) => {
  const handleMainAction = async () => {
    if (!isLastStep) {
      onNext();
      return;
    }
    await onSubmit(); // ⚠️ Le parent (FormGenerator) branchera ici le signal pour ProblemInfoStep
  };

  return (
    <>
      {/* UNIQUEMENT mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onPrev}
            disabled={!canGoPrev || isSubmitting}
            className={`
              inline-flex items-center justify-center py-3 px-4 rounded-xl font-semibold transition-colors
              ${canGoPrev && !isSubmitting ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' : 'bg-gray-50 text-gray-400 cursor-not-allowed'}
            `}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Retour
          </button>

          <button
            type="button"
            onClick={handleMainAction}
            disabled={!canGoNext || isSubmitting}
            className={`
              flex-1 inline-flex items-center justify-center py-3 px-6 rounded-xl font-bold transition-all
              ${
                isLastStep
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
              }
              ${canGoNext && !isSubmitting ? 'hover:shadow-lg hover:-translate-y-0.5' : 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none'}
            `}
          >
            {isSubmitting ? (
              <>
                <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Génération...
              </>
            ) : (
              <>
                {isLastStep ? (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    Générer ma lettre
                  </>
                ) : (
                  <>
                    Suivant
                    <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Padding pour compenser la nav fixe mobile */}
      <div className="h-20 md:hidden" />
    </>
  );
};

export default MobileNavigation;
