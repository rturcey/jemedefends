// frontend/src/components/form/steps/ProblemInfoStep.tsx
// ✅ Version nettoyée sans defect_type (supprimé comme demandé)

'use client';

import React, { useState } from 'react';

import MagicImprovement from '@/components/form/MagicImprovement';
import RadioGroup from '@/components/form/RadioGroup';
import TextAreaField from '@/components/form/TextAreaField';
import { gatedValidation } from '@/lib/validation';
import type { StepProps } from '@/types/form';

interface ProblemInfoStepProps extends StepProps {
  registerOpenModalHandler?: (fn: () => void) => void;
}

const ProblemInfoStep: React.FC<ProblemInfoStepProps> = ({
  data,
  validation,
  onFieldChange,
  onSubmit,
  onPrev,
  isSubmitting,
  registerOpenModalHandler,
}) => {
  const [descriptionValidated, setDescriptionValidated] = useState(false);

  const defectDescription = data.defect_description || '';
  const productName = data.product_name || '';
  const isDigital = data.digital || false;

  let remedyOptions = [
    {
      value: 'repairs',
      label: 'Réparation',
      description: 'Je souhaite que le produit soit réparé',
    },
  ];

  if (isDigital) {
    remedyOptions.push({
      value: 'termination',
      label: 'Résiliation',
      description: 'Je souhaite résilier le service',
    });
  } else {
    remedyOptions.push({
      value: 'replacement',
      label: 'Remplacement',
      description: 'Je souhaite un produit de remplacement',
    });
  }

  const handleDescChange = (value: string) => {
    onFieldChange('defect_description', value);
    validation?.markInteracted?.('defect_description');

    // Reset validation when user changes text
    if (descriptionValidated) {
      setDescriptionValidated(false);
    }
  };

  // Handler pour le Magic Improvement
  const handleMagicTextChange = (newText: string) => {
    onFieldChange('defect_description', newText);
    validation?.markInteracted?.('defect_description');
  };

  // Handler pour l'état de validation de la description
  const handleValidationStateChange = (isValidated: boolean) => {
    console.log('🔧 ProblemInfoStep received validation state change:', isValidated);
    setDescriptionValidated(isValidated);
  };

  // ✅ Conditions pour activer le bouton de soumission
  const hasMinimumText = defectDescription.trim().length >= 20;
  const hasRemedyPreference = Boolean(data.remedy_preference);
  const canSubmit = hasMinimumText && hasRemedyPreference && descriptionValidated && !isSubmitting;

  // Debug
  React.useEffect(() => {
    console.log('🔧 ProblemInfoStep canSubmit debug:', {
      hasMinimumText,
      hasRemedyPreference,
      hasUserChoice: descriptionValidated,
      isSubmitting,
      canSubmit,
      textLength: defectDescription.length,
      remedyPreference: data.remedy_preference,
    });
  }, [
    hasMinimumText,
    hasRemedyPreference,
    descriptionValidated,
    isSubmitting,
    canSubmit,
    defectDescription.length,
    data.remedy_preference,
  ]);

  // Handler pour le bouton principal
  const handleMainButtonClick = async () => {
    console.log('🔧 Bouton principal cliqué:', {
      canSubmit,
      isSubmitting,
      onSubmit: !!onSubmit,
    });

    if (!canSubmit) {
      console.log('🔧 Bouton désactivé - conditions non remplies');
      return;
    }

    if (!onSubmit) {
      console.log('🔧 Pas de fonction onSubmit fournie');
      return;
    }

    try {
      console.log('🔧 Appel de onSubmit...');
      await onSubmit();
      console.log('🔧 onSubmit terminé');
    } catch (error) {
      console.error('🔧 Erreur dans onSubmit:', error);
    }
  };

  return (
    <section className="step-section p-0" role="tabpanel" aria-labelledby="step-4-title">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl shadow">
          <svg
            className="w-6 h-6 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2a10 10 0 100 20A10 10 0 0012 2Zm1 15H11v-2h2v2Zm0-4H11V7h2v6Z" />
          </svg>
        </div>
        <div>
          <h2 id="step-4-title" className="text-lg md:text-xl font-bold text-gray-900">
            Description du problème
          </h2>
          <p className="text-sm text-gray-600">
            Expliquez le défaut avec vos mots, nous vous aiderons à l'optimiser.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* ✅ Choix réparation/remplacement */}
        <RadioGroup
          name="remedy_preference"
          label="Solution souhaitée"
          value={data.remedy_preference || ''}
          onChange={v => {
            onFieldChange('remedy_preference', v);
            validation?.markInteracted?.('remedy_preference');
          }}
          options={remedyOptions}
          required
          helpText="Indiquez votre préférence pour résoudre le problème"
          validation={gatedValidation(
            'remedy_preference',
            data.remedy_preference || '',
            validation?.getFieldRules?.('remedy_preference', { required: true }),
            validation?.validateField,
            validation?.isInteracted,
          )}
        />

        {/* Description du problème */}
        <div>
          <TextAreaField
            name="defect_description"
            label="Description du problème"
            value={defectDescription}
            onChange={handleDescChange}
            onBlur={() => validation?.markInteracted?.('defect_description')}
            required
            minLength={20}
            maxLength={500}
            placeholder="Exemple : 'mon téléphone ne charge qu'une fois sur deux et il s'éteint en plein milieu'"
            helpText={
              descriptionValidated
                ? '✅ Description validée - prête pour votre lettre'
                : 'Écrivez naturellement, nous vous aiderons à optimiser ensuite !'
            }
            validation={gatedValidation(
              'defect_description',
              defectDescription,
              validation?.getFieldRules?.('defect_description', {
                required: true,
                minLength: 20,
                maxLength: 500,
              }),
              validation?.validateField,
              validation?.isInteracted,
            )}
            rows={4}
          />

          {/* Magic Improvement - Affichée seulement si texte >= 20 caractères */}
          {hasMinimumText && (
            <div className="mt-4">
              <MagicImprovement
                userText={defectDescription}
                productName={productName}
                isDigital={isDigital}
                onTextChange={handleMagicTextChange}
                onValidationStateChange={handleValidationStateChange}
                registerOpenModalHandler={registerOpenModalHandler}
              />
            </div>
          )}
        </div>
      </div>

      {/* Navigation desktop / tablette (cachée sur mobile) */}
      <div className="hidden sm:flex justify-between mt-8">
        <button
          type="button"
          onClick={onPrev}
          className="bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-2xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          ← Retour
        </button>
        <button
          type="button"
          onClick={handleMainButtonClick}
          disabled={!canSubmit}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
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
              Génération...
            </>
          ) : (
            'Générer ma lettre →'
          )}
        </button>
      </div>
    </section>
  );
};

export default ProblemInfoStep;
