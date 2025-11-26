'use client';

import * as React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormShell } from '@/components/form/FormShell';
import { Alert } from '@/components/ui/alert';
import { getSectionIcon } from '@/lib/icon-utils';
import { ELIGIBILITY_STEPS } from '@/constants/eligibilitySteps';
import { useEligibilityForm } from '@/hooks/useEligibilityForm';
import type { EligibilityData } from '@/types/eligibility';
import type { EligibilityResult } from '@/eligibility/engine';

type Props = {
  onCompleteAction: (result: EligibilityResult, data: EligibilityData) => void;
  onStepChange?: (stepIndex: number) => void;
};

export default function EligibilityForm({ onCompleteAction, onStepChange }: Props) {
  const {
    currentStep,
    data,
    updateData,
    goToNextStep,
    goToPreviousStep,
    validateStep,
    calculateEligibility,
  } = useEligibilityForm();

  const step = ELIGIBILITY_STEPS[currentStep];
  const stepCount = ELIGIBILITY_STEPS.length;

  React.useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  const selected = (data as any)[step.id as keyof EligibilityData];
  const validation = validateStep(currentStep, selected);
  const canNext = validation.isValid;

  const submitIfLast = () => {
    if (currentStep < stepCount - 1) {
      return goToNextStep();
    }
    const result = calculateEligibility(data as EligibilityData);
    onCompleteAction(result, data as EligibilityData);
  };

  return (
    <FormShell
      title="Vérifiez votre éligibilité"
      subtitle="2 minutes pour savoir si la garantie légale vous protège."
      stepIndex={currentStep}
      stepCount={stepCount}
      stepLabel={step.title}
      helpText={step.description}
      onPrev={currentStep > 0 ? goToPreviousStep : undefined}
      onNext={submitIfLast}
      canNext={canNext}
      nextLabel={currentStep === stepCount - 1 ? 'Voir le résultat' : 'Continuer'}
      isLastStep={currentStep === stepCount - 1}
    >
      {step.legal && (
        <Alert className="bg-blue-50 border-blue-200 text-sm text-blue-900 rounded-xl">
          <div className="font-semibold">{step.legal.article}</div>
          <div className="mt-1 text-blue-800">{step.legal.explanation}</div>
          {step.legal.examples?.length ? (
            <ul className="mt-2 list-disc pl-5 text-blue-800 space-y-1">
              {step.legal.examples.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          ) : null}
        </Alert>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900">{step.question}</h2>

        <RadioGroup
          value={selected as string | undefined}
          onValueChange={v =>
            updateData(step.id as keyof EligibilityData, v)
          }
          className="grid gap-2"
        >
          {((step.ui as any).options ?? []).map((opt: any) => {
            const icon = getSectionIcon(opt.icon, step.id, 'radio', 'sm');
            return (
              <Label
                key={opt.value}
                className="flex items-start gap-3 rounded-xl border border-gray-200 p-4 hover:bg-gray-50 cursor-pointer"
              >
                <RadioGroupItem value={opt.value} className="mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 flex items-center gap-2">
                    {icon}
                    {opt.label}
                  </div>
                  {opt.description && (
                    <div className="text-sm text-gray-600 mt-1">
                      {opt.description}
                    </div>
                  )}
                </div>
              </Label>
            );
          })}
        </RadioGroup>
      </div>
    </FormShell>
  );
}
