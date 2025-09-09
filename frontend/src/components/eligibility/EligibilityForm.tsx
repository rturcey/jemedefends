// frontend/src/components/eligibility/EligibilityForm.tsx
// CORRECTION basée sur le vrai code existant

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

import BackOnlyNavigation from '@/components/form/BackOnlyNavigation';
import RadioGroup from '@/components/form/RadioGroup';
import Container from '@/components/ui/Container';
import LegalReference from '@/components/ui/LegalReference';
import StepIndicator from '@/components/ui/StepIndicator';
import ValidationMessage from '@/components/ui/ValidationMessage';
import { ELIGIBILITY_STEPS } from '@/constants/eligibilitySteps';
import { useEligibilityForm } from '@/hooks/useEligibilityForm';
import type { EligibilityData, StepId } from '@/types/eligibility';
// OPTION A : Remplacer LegalNote par LegalReference

// Mapping id -> champ du modèle (gardé identique)
const FIELD_BY_ID: Record<StepId, keyof EligibilityData> = {
  seller: 'sellerType',
  usage: 'usage',
  product: 'productType',
  territory: 'territory',
  timing: 'withinTwoYears',
  defect: 'hasDefect',
};

// NOUVEAU : Mapping des étapes vers leurs articles principaux
const STEP_LEGAL_ARTICLES: Record<StepId, string> = {
  seller: 'L.217-3', // Vente professionnel → consommateur
  usage: 'L.217-4', // Définition du consommateur
  product: 'L.217-3', // Biens couverts
  territory: 'L.217-3', // Territoire d'application
  timing: 'L.217-12', // Délai de 2 ans
  defect: 'L.217-5', // Défaut de conformité
};

// Variants identiques
const stepVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.16, ease: 'easeIn' } },
};

interface EligibilityFormProps {
  onComplete: (data: any) => void;
  onStepChange: (step: number) => void;
}

export default function EligibilityForm({ onComplete, onStepChange }: EligibilityFormProps) {
  const {
    currentStep,
    data,
    validations,
    updateData,
    nextStep,
    prevStep,
    calculateEligibility,
    isSubmitting = false,
  } = useEligibilityForm();

  const step = ELIGIBILITY_STEPS[currentStep];
  const field = FIELD_BY_ID[step.id];
  const validation = validations[currentStep];
  const isLastStep = currentStep === ELIGIBILITY_STEPS.length - 1;

  // Focus auto sur le 1er input du step (gardé identique)
  const firstFieldRef = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => firstFieldRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [currentStep]);

  // Logique normalization gardée identique
  const normalize = (raw: any) => {
    if (step.id === 'defect') return raw === 'yes' ? true : raw === 'no' ? false : !!raw;
    if (step.id === 'timing') return raw === 'lt_2y' ? true : raw === 'gte_2y' ? false : undefined;
    return raw;
  };

  // Hard-fails gardés identiques
  const isHardFail = (stepId: StepId, value: any): boolean => {
    switch (stepId) {
      case 'seller':
        return value === 'individual';
      case 'usage':
        return value === 'professional';
      case 'territory':
        return value === 'non_eu';
      case 'defect':
        return value === false || value === 'no';
      default:
        return false;
    }
  };

  // handleChoice gardé identique
  const handleChoice = (raw: any) => {
    const normalized = normalize(raw);
    const result = updateData({ [field]: normalized });

    if (isHardFail(step.id, normalized)) {
      onComplete({
        isEligible: false,
        reason: step.id,
        data: { ...data, [field]: normalized },
      });
      return;
    }

    if (isLastStep) {
      const computed = calculateEligibility({
        ...data,
        [field]: normalized,
      } as EligibilityData);
      onComplete(computed);
      return;
    }

    if (result?.isValid !== false) nextStep();
  };

  const required = Boolean(step.ui.required);
  const value = (data as any)?.[field];
  const hasValue =
    step.id === 'timing'
      ? typeof value === 'boolean'
      : value !== undefined && value !== null && value !== '';

  const canGoPrev = currentStep > 0;

  // OPTION A : LegalReference inline dans la description (recommandé)
  const getStepDescriptionWithLegal = () => {
    const legalArticle = STEP_LEGAL_ARTICLES[step.id];

    return (
      <>
        {step.description}
        {legalArticle && (
          <>
            {' '}
            <LegalReference code={legalArticle as any} variant="tooltip" size="sm" showStatus>
              (base légale)
            </LegalReference>
          </>
        )}
      </>
    );
  };

  // StepContent gardé identique
  const StepContent = () => {
    if (step.ui.type === 'radio') {
      return (
        <RadioGroup
          inputRef={firstFieldRef as any}
          name={String(step.id)}
          onChange={handleChoice}
          options={step.ui.options}
          required={step.ui.required}
        />
      );
    }
    return null;
  };

  return (
    <>
      {/* Override CSS gardé identique */}
      <style jsx global>{`
        .eligibility-ui legend::after,
        .eligibility-ui label::after {
          content: '' !important;
        }
        .eligibility-ui .required-asterisk,
        .eligibility-ui [data-required-indicator],
        .eligibility-ui .asterisk {
          display: none !important;
        }
      `}</style>

      <Container className="eligibility-ui pt-6 md:pt-10 pb-24 md:pb-10 max-w-[640px] mx-auto space-y-6">
        {/* En-tête stable - identique */}
        <div className="flex items-center justify-center">
          <StepIndicator currentStep={currentStep} totalSteps={ELIGIBILITY_STEPS.length} />
        </div>

        {/* Titre + description - MODIFIÉ pour inclure LegalReference */}
        <div>
          <h2 className="text-xl font-semibold mb-1">{step.title}</h2>
          <p className="text-gray-600 mb-3">{getStepDescriptionWithLegal()}</p>

          {/* Zone contenu - identique */}
          <div className="min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ willChange: 'transform, opacity' }}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <StepContent />

                {validation?.message && !validation.isValid && (
                  <ValidationMessage
                    className="mt-3"
                    message={validation.message}
                    type={validation.type ?? 'error'}
                  />
                )}

                {/* Hint gardé identique */}
                <p className="mt-2 text-xs text-gray-500">
                  Vous pourrez revenir en arrière si besoin.
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* OPTION A : Supprimer complètement le LegalBlock 
              Remplacé par LegalReference inline dans la description */}

          {/* OPTION B : Ou garder mais avec un details/summary discret */}
          {step.legal?.explanation && (
            <details className="mt-4">
              <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800 select-none">
                💡 Pourquoi cette question ? (base légale)
              </summary>
              <div className="mt-2 p-3 bg-blue-50 rounded-lg text-sm text-gray-700 leading-relaxed">
                <p>{step.legal.explanation}</p>
                {step.legal.examples && step.legal.examples.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {step.legal.examples.map((example, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </details>
          )}
        </div>

        {/* Navigation gardée identique */}
        <BackOnlyNavigation
          canGoPrev={canGoPrev}
          onPrev={prevStep}
          disabled={Boolean(isSubmitting)}
        />
      </Container>
    </>
  );
}
