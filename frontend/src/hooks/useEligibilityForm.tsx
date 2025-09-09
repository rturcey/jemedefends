'use client';

import { useState, useCallback } from 'react';

import { ELIGIBILITY_STEPS } from '@/constants/eligibilitySteps';
import { calculateEligibilityEngine } from '@/eligibility/engine';
import type { EligibilityData } from '@/types/eligibility';
import type { LegalArticleId } from '@/types/guides';

export type ValidationResult = {
  isValid: boolean;
  error?: string;
  /** Code d'article légal à afficher côté UI via <LegalReference />, jamais de texte en dur ici */
  legalRef?: LegalArticleId;
};

type UseEligibilityFormOptions = {
  /**
   * Permet d'associer dynamiquement une référence légale à une erreur de validation,
   * sans la coder en dur dans le hook.
   */
  getLegalRef?: (ctx: {
    stepId?: string;
    stepIndex: number;
    value: unknown;
    data: EligibilityData;
    error?: string;
  }) => LegalArticleId | undefined;
};

export const useEligibilityForm = (opts: UseEligibilityFormOptions = {}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<EligibilityData>({} as EligibilityData);
  const [validations, setValidations] = useState<Record<number, ValidationResult>>({});

  const attachRef = useCallback(
    (
      base: ValidationResult,
      ctx: Omit<Parameters<NonNullable<UseEligibilityFormOptions['getLegalRef']>>[0], 'error'> & {
        error?: string;
      },
    ): ValidationResult => {
      if (base.isValid) {
        return base;
      }
      const legalRef = opts.getLegalRef?.(ctx);
      return legalRef ? { ...base, legalRef } : base;
    },
    [opts],
  );

  const validateStep = useCallback(
    (step: number, value: unknown): ValidationResult => {
      const stepId = ELIGIBILITY_STEPS[step]?.id;

      switch (stepId) {
        case 'seller': {
          if (!value) {
            const res = { isValid: false, error: 'Veuillez sélectionner une option.' };
            return attachRef(res, { stepId, stepIndex: step, value, data });
          }
          if (value === 'individual') {
            // Message générique, la ref éventuelle vient du mapper getLegalRef
            const res = {
              isValid: false,
              error:
                "La garantie légale s'applique uniquement pour un achat auprès d'un professionnel.",
            };
            return attachRef(res, {
              stepId,
              stepIndex: step,
              value,
              data,
              error: res.error,
            });
          }
          return { isValid: true };
        }

        case 'usage': {
          if (!value) {
            const res = { isValid: false, error: "Veuillez préciser l'usage." };
            return attachRef(res, {
              stepId,
              stepIndex: step,
              value,
              data,
              error: res.error,
            });
          }
          return { isValid: true };
        }

        case 'product': {
          if (!value) {
            const res = { isValid: false, error: 'Sélectionnez un type de produit.' };
            return attachRef(res, {
              stepId,
              stepIndex: step,
              value,
              data,
              error: res.error,
            });
          }
          return { isValid: true };
        }

        case 'territory': {
          if (!value) {
            const res = { isValid: false, error: 'Sélectionnez une option.' };
            return attachRef(res, {
              stepId,
              stepIndex: step,
              value,
              data,
              error: res.error,
            });
          }
          return { isValid: true };
        }

        case 'timing': {
          if (!value) {
            const res = { isValid: false, error: "Indiquez la date d'achat." };
            return attachRef(res, {
              stepId,
              stepIndex: step,
              value,
              data,
              error: res.error,
            });
          }
          const d = new Date(String(value));
          if (Number.isNaN(d.getTime())) {
            const res = { isValid: false, error: 'Date invalide.' };
            return attachRef(res, {
              stepId,
              stepIndex: step,
              value,
              data,
              error: res.error,
            });
          }
          if (d > new Date()) {
            const res = {
              isValid: false,
              error: 'La date ne peut pas être dans le futur.',
            };
            return attachRef(res, {
              stepId,
              stepIndex: step,
              value,
              data,
              error: res.error,
            });
          }
          return { isValid: true };
        }

        case 'defect': {
          if (value === undefined || value === null) {
            const res = { isValid: false, error: 'Choisissez une option.' };
            return attachRef(res, {
              stepId,
              stepIndex: step,
              value,
              data,
              error: res.error,
            });
          }
          return { isValid: true };
        }

        default:
          return { isValid: true };
      }
    },
    [attachRef, data],
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
    [data, currentStep, validateStep],
  );

  const nextStep = useCallback(() => setCurrentStep(s => s + 1), []);
  const prevStep = useCallback(() => setCurrentStep(s => Math.max(0, s - 1)), []);

  const calculateEligibility = useCallback((payload: EligibilityData) => {
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
