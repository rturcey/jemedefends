// frontend/src/components/form/steps/ProblemInfoStep.tsx - Bouton principal fixé

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

  // Conditions pour activer le bouton de soumission
  const hasValidDefectType = Boolean(data.defect_type);
  const hasMinimumText = defectDescription.trim().length >= 20;
  const hasUserChoice = descriptionValidated;

  const canSubmit = hasValidDefectType && hasMinimumText && descriptionValidated && !isSubmitting;

  // ✅ DEBUG pour identifier le problème
  React.useEffect(() => {
    console.log('🔧 ProblemInfoStep canSubmit debug:', {
      hasValidDefectType,
      hasMinimumText,
      hasUserChoice: descriptionValidated,
      isSubmitting,
      canSubmit,
      defectType: data.defect_type,
      textLength: defectDescription.length,
    });
  }, [
    hasValidDefectType,
    hasMinimumText,
    descriptionValidated,
    isSubmitting,
    canSubmit,
    data.defect_type,
    defectDescription.length,
  ]);

  // ✅ CORRIGÉ: Handler pour le bouton principal (même logique que MobileNavigation)
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

  const defectOptions = [
    {
      value: 'apparence',
      label: "Problème d'apparence",
      description: 'Rayures, taches, décoloration…',
    },
    {
      value: 'fonctionnement',
      label: 'Problème de fonctionnement',
      description: 'Ne marche pas, dysfonctionnement…',
    },
  ];

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
        <RadioGroup
          name="defect_type"
          legend="Type de problème"
          value={data.defect_type}
          onChange={value => {
            onFieldChange('defect_type', value);
            validation?.markInteracted?.('defect_type');
          }}
          options={defectOptions}
          required
          validation={gatedValidation(
            'defect_type',
            data.defect_type || '',
            validation?.getFieldRules?.('defect_type', { required: true }),
            validation?.validateField,
            validation?.isInteracted,
          )}
        />

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
              defectDescription || '',
              validation?.getFieldRules?.('defect_description', {
                required: true,
                minLength: 20,
              }),
              validation?.validateField,
              validation?.isInteracted,
            )}
          />
        </div>

        {/* Magic Improvement - Version sobre */}
        {defectDescription.length > 0 && (
          <MagicImprovement
            userText={defectDescription}
            onTextChange={handleMagicTextChange}
            onValidationStateChange={handleValidationStateChange}
            isDigital={isDigital}
            productName={productName}
            className="animate-in fade-in slide-in-from-bottom-4 duration-300"
          />
        )}
      </div>

      {/* Navigation - VISIBLE SEULEMENT SUR DESKTOP */}
      <div className="hidden lg:flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
        <button
          type="button"
          onClick={onPrev}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Précédent
        </button>

        <div className="flex flex-col items-end gap-2">
          {/* ✅ CORRIGÉ: Bouton principal avec même logique que MobileNavigation */}
          <button
            type="button"
            onClick={handleMainButtonClick}
            disabled={!canSubmit || isSubmitting}
            className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
              canSubmit && !isSubmitting
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Génération...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Générer ma lettre
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProblemInfoStep;
