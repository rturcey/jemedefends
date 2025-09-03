'use client';

import React, { useState } from 'react';

interface FormSubmissionProps {
  onSubmit: (data: any) => Promise<void>;
  isLastStep: boolean;
  canSubmit: boolean;
}

const FormSubmissionButton: React.FC<FormSubmissionProps> = ({
  onSubmit,
  isLastStep,
  canSubmit,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async () => {
    if (!isLastStep || !canSubmit) return;

    setIsGenerating(true);

    try {
      await onSubmit({});
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit || isGenerating}
        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-4 px-8 rounded-2xl hover:shadow-xl transition-all disabled:opacity-50"
      >
        {isGenerating ? 'Génération...' : 'Générer ma lettre'}
      </button>

      {/* Modale de génération */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Génération en cours...</h3>
              <p className="text-gray-600 text-sm">Nous créons votre lettre personnalisée</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormSubmissionButton;
