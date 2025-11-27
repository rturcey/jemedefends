'use client';

import { useState, useCallback } from 'react';

import { ELIGIBILITY_STEPS } from '@/constants/eligibilitySteps';
import { calculateEligibilityEngine, validateEligibilityData } from '@/eligibility/engine';
import type { EligibilityData } from '@/types/eligibility';
import type { LegalArticleId } from '@/legal/registry';

export type ValidationResult = {
  isValid: boolean;
  error?: string;
  /** Code d'article légal à afficher côté UI via <LegalReference /> */
  legalRef?: LegalArticleId;
  /** Indique qu'une réponse bloque l'éligibilité et doit déclencher la modale alternatives */
  blocking?: boolean;
};

type UseEligibilityFormOptions = {
  /**
   * Mapping optionnel erreur → article de loi.
   * Renommé en *Action pour être clean avec Next.
   */
  getLegalRefAction?: (ctx: {
    stepId?: string;
    stepIndex: number;
    value: unknown;
    data: EligibilityData;
    error?: string;
  }) => LegalArticleId | undefined;
};

export const useEligibilityForm = (opts: UseEligibilityFormOptions = {}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<EligibilityData>({});
  const [validations, setValidations] = useState<Record<number, ValidationResult>>({});

  const getValueForStep = useCallback(
    (stepId: string): unknown => {
      switch (stepId) {
        case 'seller':
          return data.seller ?? data.sellerType;
        case 'timing':
          return data.timing ?? data.timingAnswer ?? data.withinTwoYears;
        case 'defect':
          return data.defect ?? data.hasDefect;
        default:
          return (data as any)[stepId as keyof EligibilityData];
      }
    },
    [data],
  );

  const attachRef = useCallback(
    (base: ValidationResult, ctx: { stepId?: string; stepIndex: number; value: unknown; data: EligibilityData; error?: string }): ValidationResult => {
      if (base.isValid) return base;
      const legalRef = opts.getLegalRefAction?.(ctx);
      return legalRef ? { ...base, legalRef } : base;
    },
    [opts],
  );

  const validateStep = useCallback(
    (stepIndex: number, value: unknown): ValidationResult => {
      const step = ELIGIBILITY_STEPS[stepIndex];
      const stepId = step?.id as string | undefined;

      switch (stepId) {
        case 'seller': {
          if (!value) {
            const res = { isValid: false, error: 'Sélectionnez le type de vendeur.' };
            return attachRef(res, { stepId, stepIndex, value, data });
          }
          if (value === 'individual') {
            const res = {
              isValid: false,
              error: "La garantie légale ne couvre pas les ventes entre particuliers.",
              blocking: true,
            };
            return attachRef(res, { stepId, stepIndex, value, data, error: res.error });
          }
          return { isValid: true };
        }

        case 'usage': {
          if (!value) {
            const res = { isValid: false, error: "Précisez si l'achat est personnel." };
            return attachRef(res, { stepId, stepIndex, value, data });
          }
          if (value === 'professional') {
            const res = {
              isValid: false,
              error: 'La garantie légale est réservée au consommateur (usage personnel).',
              blocking: true,
            };
            return attachRef(res, { stepId, stepIndex, value, data, error: res.error });
          }
          return { isValid: true };
        }

        case 'itemCategory':
        case 'itemDetail': {
          if (!value) {
            const res = { isValid: false, error: 'Choisissez une option pour continuer.' };
            return attachRef(res, { stepId, stepIndex, value, data });
          }
          return { isValid: true };
        }

        case 'territory': {
          if (!value) {
            const res = { isValid: false, error: 'Précisez la zone du vendeur.' };
            return attachRef(res, { stepId, stepIndex, value, data });
          }
          if (value === 'non_eu') {
            const res = {
              isValid: false,
              error: "La garantie s'applique si le vendeur est en UE/EEE ou vise clairement le marché français.",
              blocking: true,
            };
            return attachRef(res, { stepId, stepIndex, value, data, error: res.error });
          }
          return { isValid: true };
        }

        case 'timing': {
          if (value === undefined || value === null) {
            const res = { isValid: false, error: 'Indiquez le délai.' };
            return attachRef(res, { stepId, stepIndex, value, data });
          }
          if (value === 'ko' || value === 'after_contract') {
            const res = {
              isValid: false,
              error: 'Le délai légal semble dépassé pour la garantie.',
              blocking: true,
            };
            return attachRef(res, { stepId, stepIndex, value, data, error: res.error });
          }
          return { isValid: true };
        }

        case 'defect': {
          if (value === undefined || value === null) {
            const res = { isValid: false, error: "Précisez s'il y a un défaut de conformité." };
            return attachRef(res, { stepId, stepIndex, value, data });
          }
          if (value === 'no' || value === false) {
            const res = {
              isValid: false,
              error: "La garantie légale s'active uniquement en présence d'un défaut de conformité.",
              blocking: true,
            };
            return attachRef(res, { stepId, stepIndex, value, data, error: res.error });
          }
          return { isValid: true };
        }

        default:
          return { isValid: true };
      }
    },
    [data, attachRef],
  );

  const calculateEligibility = useCallback((formData: EligibilityData) => {
    try {
      const validation = validateEligibilityData(formData);
      if (!validation.isValid) {
        console.warn(
          "Données incomplètes pour le calcul d'éligibilité:",
          validation.missingFields,
        );
        return {
          isEligible: false,
          reasons: ['no_defect'],
          timing: {},
        };
      }
      return calculateEligibilityEngine(formData);
    } catch (error) {
      console.error("Erreur lors du calcul d'éligibilité:", error);
      return {
        isEligible: false,
        reasons: ['no_defect'],
        timing: {},
      };
    }
  }, []);

  const updateData = useCallback((field: keyof EligibilityData, value: any) => {
    setData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  }, []);

  const goToNextStep = useCallback(() => {
    setCurrentStep(prev => (prev < ELIGIBILITY_STEPS.length - 1 ? prev + 1 : prev));
  }, []);

  const goToPreviousStep = useCallback(() => {
    setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  const resetForm = useCallback(() => {
    setCurrentStep(0);
    setData({});
    setValidations({});
  }, []);

  return {
    currentStep,
    data,
    validations,
    validateStep,
    calculateEligibility,
    updateData,
    goToNextStep,
    goToPreviousStep,
    resetForm,
    setCurrentStep,
    setData,
    setValidations,
  };
};
