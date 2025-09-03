'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import StepIndicator from '@/components/ui/StepIndicator';
import ValidationMessage from '@/components/ui/ValidationMessage';
import { useEligibilityForm } from '@/hooks/useEligibilityForm';
import { ELIGIBILITY_STEPS } from '@/constants/eligibilitySteps';
import type { EligibilityData, StepId } from '@/types/eligibility';

import RadioGroup from '@/components/form/RadioGroup';
import Container from '@/components/ui/Container';
import LegalNote from '@/components/ui/LegalNote';
import BackOnlyNavigation from '@/components/form/BackOnlyNavigation';

// Mapping id -> champ du modèle
const FIELD_BY_ID: Record<StepId, keyof EligibilityData> = {
  seller: 'sellerType',
  usage: 'usage',
  product: 'productType',
  territory: 'territory',
  timing: 'withinTwoYears', // booléen (± 2 ans)
  defect: 'hasDefect',
};

// Variants de transition (rapides, sans “rebond”)
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

  // Focus auto sur le 1er input du step
  const firstFieldRef = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    const id = requestAnimationFrame(() => firstFieldRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [currentStep]);

  const normalize = (raw: any) => {
    if (step.id === 'defect') return raw === 'yes' ? true : raw === 'no' ? false : !!raw;
    if (step.id === 'timing') return raw === 'lt_2y' ? true : raw === 'gte_2y' ? false : undefined;
    return raw;
  };

  // Hard-fails évidents (éviter d’aller au bout si c’est non)
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
        return false; // timing/product ne hard-fail pas seuls
    }
  };

  const handleChoice = (raw: any) => {
    const normalized = normalize(raw);
    const result = updateData({ [field]: normalized });

    if (isHardFail(step.id, normalized)) {
      onComplete({ isEligible: false, reason: step.id, data: { ...data, [field]: normalized } });
      return;
    }

    if (isLastStep) {
      const computed = calculateEligibility({ ...data, [field]: normalized } as EligibilityData);
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

  // LegalNote animé et repliable (via LegalNote lui-même)
  const LegalBlock: React.FC = () => {
    const legal = step.legal;
    if (!legal) return null;
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`legal-${step.id}-${currentStep}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          <LegalNote
            title="Références légales"
            article={legal.article}
            explanation={legal.explanation}
            examples={legal.examples}
            disclaimer="Informations indicatives issues du Code de la consommation."
            defaultOpen={false}
            idPrefix={`legal-${step.id}`}
          />
        </motion.div>
      </AnimatePresence>
    );
  };

  const StepContent = () => {
    if (step.ui.type === 'radio') {
      return (
        <RadioGroup
          inputRef={firstFieldRef as any} // ignoré si non supporté, sans effet de bord
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
      {/* Override LOCAL : masque toute étoile “required” uniquement dans ce formulaire */}
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
        {/* En-tête stable */}
        <div className="flex items-center justify-center">
          <StepIndicator currentStep={currentStep} totalSteps={ELIGIBILITY_STEPS.length} />
        </div>

        {/* Titre + description */}
        <div>
          <h2 className="text-xl font-semibold mb-1">{step.title}</h2>
          <p className="text-gray-600 mb-3">{step.description}</p>

          {/* Zone contenu animée, dans une “carte” pour éviter l’effet vide */}
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

                {/* Hint très discret (optionnel) */}
                <p className="mt-2 text-xs text-gray-500">
                  Vous pourrez revenir en arrière si besoin.
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Séparateur fin + LegalNote rapproché */}
          <div className="my-3 h-px bg-gray-100" />
          <div className="mt-3">
            <LegalBlock />
          </div>
        </div>

        {/* Navigation : bouton Retour uniquement (mobile fixe + desktop en bas) */}
        <BackOnlyNavigation
          canGoPrev={canGoPrev}
          onPrev={prevStep}
          disabled={Boolean(isSubmitting)}
        />
      </Container>
    </>
  );
}
