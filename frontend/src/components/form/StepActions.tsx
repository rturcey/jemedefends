// src/components/form/StepActions.tsx
import React from 'react';

type Props = {
  /** Afficher le bouton Retour ? */
  showPrev?: boolean;
  /** Afficher le bouton Continuer/Générer ? */
  showNext?: boolean;
  /** Dernière étape : change le label + couleurs */
  isLastStep?: boolean;
  /** États */
  canGoNext?: boolean;
  isSubmitting?: boolean;

  /** Callbacks */
  onPrev?: () => void;
  onNext?: () => void; // aussi utilisé pour "Générer" si isLastStep
};

/**
 * Boutons de navigation d’étape visibles UNIQUEMENT sur desktop (≥ md).
 * Sur mobile, on utilise MobileNavigation en bas de page.
 */
const StepActions: React.FC<Props> = ({
  showPrev = false,
  showNext = true,
  isLastStep = false,
  canGoNext = true,
  isSubmitting = false,
  onPrev,
  onNext,
}) => {
  return (
    <div className="mt-8 hidden md:flex items-center justify-between gap-3">
      {/* Bouton Retour (optionnel) */}
      <div>
        {showPrev && (
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center bg-gray-100 text-gray-800 font-semibold py-3 px-6 rounded-2xl hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Retour
          </button>
        )}
      </div>

      {/* Bouton Continuer/Générer (optionnel) */}
      <div className="ml-auto">
        {showNext && (
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext || isSubmitting}
            className={[
              'inline-flex items-center font-bold py-3 px-6 rounded-2xl transition-all focus:outline-none focus:ring-2',
              isLastStep
                ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:-translate-y-0.5 text-white focus:ring-blue-500',
              !canGoNext || isSubmitting
                ? 'opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none'
                : '',
            ].join(' ')}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="w-5 h-5 animate-spin mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
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
                    d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.14 5.82 3 7.94l3-2.65z"
                  />
                </svg>
                {isLastStep ? 'Génération…' : 'Chargement…'}
              </>
            ) : (
              <>
                {!isLastStep ? (
                  <>
                    Continuer
                    <svg
                      className="w-5 h-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    Générer
                    <svg
                      className="w-5 h-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </>
                )}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default StepActions;
