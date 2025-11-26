'use client';

import * as React from 'react';
import useFormManager from '@/hooks/form';
import { STEPS } from '@/types/form';
import { FormShell } from '@/components/form/FormShell';

import BuyerInfoStep from './steps/BuyerInfoStep';
import SellerInfoStep from './steps/SellerInfoStep';
import PurchaseInfoStep from './steps/PurchaseInfoStep';
import ProblemInfoStep from './steps/ProblemInfoStep';

type Props = { formSlug: string };

const PROBLEM_INFO_STEP_INDEX = 3;

export default function FormGenerator({ formSlug }: Props) {
  const {
    currentStepIndex,
    formData,
    validation,
    isSubmitting,
    goToStep,
    updateField,
    submitForm,
  } = useFormManager();

  const stepCount = STEPS.length;
  const step = STEPS[currentStepIndex];

  const commonStepProps = React.useMemo(
    () => ({
      data: formData,
      validation,
      onFieldChange: updateField,
      onNext: () => goToStep(Math.min(currentStepIndex + 1, stepCount - 1)),
      onPrev: () => goToStep(Math.max(currentStepIndex - 1, 0)),
      isSubmitting,
    }),
    [formData, validation, updateField, currentStepIndex, goToStep, stepCount, isSubmitting],
  );

  const renderStep = () => {
    switch (currentStepIndex) {
      case 0:
        return <BuyerInfoStep {...commonStepProps} />;
      case 1:
        return <SellerInfoStep {...commonStepProps} />;
      case 2:
        return <PurchaseInfoStep {...commonStepProps} />;
      case PROBLEM_INFO_STEP_INDEX:
        return <ProblemInfoStep {...commonStepProps} onSubmit={submitForm} />;
      default:
        return null;
    }
  };

  const canNext = validation?.validateStep?.(step.id, formData) ?? true;

  return (
    <FormShell
      title="Créer votre mise en demeure"
      subtitle="Renseignez les informations utiles pour générer votre lettre."
      stepIndex={currentStepIndex}
      stepCount={stepCount}
      stepLabel={step.title}
      helpText={undefined}
      onPrev={currentStepIndex > 0 ? commonStepProps.onPrev : undefined}
      onNext={currentStepIndex === PROBLEM_INFO_STEP_INDEX ? submitForm : commonStepProps.onNext}
      canNext={canNext}
      nextLabel={currentStepIndex === PROBLEM_INFO_STEP_INDEX ? 'Générer ma lettre' : 'Continuer'}
      isLastStep={currentStepIndex === PROBLEM_INFO_STEP_INDEX}
      isSubmitting={isSubmitting}
    >
      {renderStep()}
    </FormShell>
  );
}
