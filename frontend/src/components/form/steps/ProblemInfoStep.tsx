'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import TextAreaField from '@/components/form/TextAreaField';
import RadioGroup from '@/components/form/RadioGroup';
import ReformatDescriptionModal from '@/components/form/ReformatDescriptionModal';
import { gatedValidation } from '@/lib/validation';
import { StepProps } from '@/types/form';

interface ProblemInfoStepProps extends StepProps {
  /** Le parent enregistre ici un handler pour ouvrir la modale depuis la nav mobile. */
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
  const [showImprovementModal, setShowImprovementModal] = useState(false);
  const [hasImprovedText, setHasImprovedText] = useState(false);

  const defectDescription = data.defect_description || '';
  const prevDescRef = useRef(defectDescription);

  const handleDescChange = (value: string) => {
    onFieldChange('defect_description', value);
    validation?.markInteracted?.('defect_description');

    if (hasImprovedText && value !== prevDescRef.current) {
      setHasImprovedText(false);
    }
    prevDescRef.current = value;
  };

  const canSubmit =
    validation?.validateStep?.('problem_info', data) ??
    Boolean(defectDescription && defectDescription.trim().length >= 20 && data.defect_type);

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

  const applyImprovement = (txt: string) => {
    onFieldChange('defect_description', txt);
    setHasImprovedText(true);
    setShowImprovementModal(false);
  };

  // 👉 Handler unique: ouvrir la modale d'amélioration (utilisé par desktop et mobile)
  const openImproveModal = useCallback(() => {
    if (isSubmitting) return;
    setShowImprovementModal(true);
  }, [isSubmitting]);

  // Le parent (FormGenerator) enregistre ce handler pour la nav mobile.
  useEffect(() => {
    registerOpenModalHandler?.(openImproveModal);
  }, [registerOpenModalHandler, openImproveModal]);

  // 👉 Quand la modale demande la génération : on met à jour le texte éventuel, on ferme et on soumet.
  const handleGenerateFromModal = async (finalText?: string) => {
    if (finalText && finalText !== defectDescription) {
      onFieldChange('defect_description', finalText);
    }
    setShowImprovementModal(false);
    if (canSubmit && !isSubmitting) {
      await onSubmit?.();
    }
  };

  return (
    <>
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
            <p className="text-sm text-gray-600">Expliquez le défaut ou problème rencontré.</p>
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
              validation?.isInteracted
            )}
          />

          <div>
            <TextAreaField
              name="defect_description"
              label="Description précise du problème"
              value={defectDescription}
              onChange={handleDescChange}
              onBlur={() => validation?.markInteracted?.('defect_description')}
              required
              minLength={20}
              maxLength={1000}
              rows={6}
              placeholder="Décrivez précisément le problème : faits, dates, échanges…"
              helpText="Plus vous êtes précis, plus votre lettre sera efficace"
              validation={gatedValidation(
                'defect_description',
                defectDescription || '',
                validation?.getFieldRules?.('defect_description', {
                  required: true,
                  minLength: 20,
                  maxLength: 1000,
                } as any),
                validation?.validateField,
                validation?.isInteracted
              )}
            />

            <div className="mt-2">
              <button
                type="button"
                onClick={openImproveModal}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors underline-offset-2 hover:underline"
                aria-haspopup="dialog"
              >
                Améliorer ma description
              </button>
            </div>

            {hasImprovedText && (
              <div className="mt-2 inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Texte amélioré
              </div>
            )}
          </div>
        </div>

        {/* NAV desktop/tablette – mobile géré par MobileNavigation */}
        <div className="hidden sm:flex justify-between mt-8">
          <button
            type="button"
            onClick={onPrev}
            className="bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-2xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            ← Retour
          </button>
          <button
            type="button"
            onClick={openImproveModal} // ← toujours la modale
            disabled={!canSubmit || isSubmitting}
            className="bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Génération…' : 'Générer ma lettre'}
          </button>
        </div>
      </section>

      {/* Modale d’amélioration — montée UNIQUEMENT quand ouverte */}
      {showImprovementModal && (
        <ReformatDescriptionModal
          open={true}
          onClose={() => setShowImprovementModal(false)}
          initialText={defectDescription} // ← lit toujours le texte courant
          onApply={applyImprovement}
          onGenerate={handleGenerateFromModal} // ← SEULE sortie vers résultats
          isSubmitting={isSubmitting}
          maxChars={1200}
          key={`reformat-${defectDescription.length}`} // remount propre si le texte change
        />
      )}
    </>
  );
};

export default ProblemInfoStep;
