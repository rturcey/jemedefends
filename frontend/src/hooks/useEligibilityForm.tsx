'use client';

import React, { useState, useCallback } from 'react';
import { EligibilityData, StepValidation } from '@/types/eligibility';
import { evaluateEligibility } from '@/components/eligibility/logic';
import { ELIGIBILITY_STEPS } from '@/constants/eligibilitySteps';
import { calculateEligibilityEngine } from '@/eligibility/entine';

export const useEligibilityForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<EligibilityData>({});
  const [validations, setValidations] = useState<Record<number, StepValidation>>({});

  const validateStep = useCallback(
    (
      step: number,
      value: any
    ): {
      isValid: boolean;
      error: string;
    } => {
      const stepId = ELIGIBILITY_STEPS[step]?.id;

      switch (stepId) {
        case 'seller':
          if (!value) return { isValid: false, error: 'Veuillez sélectionner une option' };
          if (value === 'individual') {
            return {
              isValid: false,
              error:
                "La garantie légale s'applique uniquement aux achats auprès de professionnels (Art. L.217-3).",
            };
          }
          return { isValid: true };

        case 'usage':
          if (!value) return { isValid: false, error: "Veuillez préciser l'usage" };
          return { isValid: true };

        case 'product':
          if (!value) return { isValid: false, error: 'Sélectionnez un type de produit' };
          return { isValid: true };

        case 'territory':
          if (!value) return { isValid: false, error: 'Sélectionnez une option' };
          return { isValid: true };

        case 'timing':
          if (!value) return { isValid: false, error: "Indiquez la date d'achat" };
          if (isNaN(new Date(value).getTime())) return { isValid: false, error: 'Date invalide' };
          if (new Date(value) > new Date())
            return { isValid: false, error: 'Date future invalide' };
          return { isValid: true };

        case 'defect':
          if (value === undefined || value === null)
            return { isValid: false, error: 'Choisissez une option' };
          return { isValid: true };

        default:
          return { isValid: true };
      }
    },
    []
  );

  const updateData = useCallback(
    (partial: Partial<EligibilityData>) => {
      const next = { ...data, ...partial };
      setData(next);
      const value = Object.values(partial)[0];
      const v = validateStep(currentStep, value);
      setValidations(prev => ({ ...prev, [currentStep]: v }));
      return v;
    },
    [data, currentStep, validateStep]
  );

  const nextStep = useCallback(() => setCurrentStep(s => s + 1), []);
  const prevStep = useCallback(() => setCurrentStep(s => Math.max(0, s - 1)), []);

  const calculateEligibility = React.useCallback((payload: EligibilityData) => {
    return calculateEligibilityEngine(payload);
  }, []);

  return {
    currentStep,
    data,
    validations,
    updateData,
    nextStep,
    prevStep,
    validateStep,
    calculateEligibility,
  };
};
