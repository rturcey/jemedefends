// src/hooks/useEligibilityForm.tsx - VERSION CORRIGÉE
'use client';

import { useState, useCallback } from 'react';

import { ELIGIBILITY_STEPS } from '@/constants/eligibilitySteps';
import { calculateEligibilityEngine, validateEligibilityData } from '@/eligibility/engine';
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
  // ✅ INITIALISATION CORRIGÉE - données vides au lieu de cast forcé
  const [data, setData] = useState<EligibilityData>({});
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
            return attachRef(res, { stepId, stepIndex: step, value, data });
          }
          if (value === 'professional') {
            const res = {
              isValid: false,
              error: "La garantie légale s'applique uniquement aux consommateurs.",
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

        case 'product': {
          if (!value) {
            const res = {
              isValid: false,
              error: 'Veuillez sélectionner le type de produit.',
            };
            return attachRef(res, { stepId, stepIndex: step, value, data });
          }
          return { isValid: true };
        }

        case 'territory': {
          if (!value) {
            const res = {
              isValid: false,
              error: 'Veuillez préciser la localisation du vendeur.',
            };
            return attachRef(res, { stepId, stepIndex: step, value, data });
          }
          if (value === 'non_eu') {
            const res = {
              isValid: false,
              error:
                "La garantie s'applique si le vendeur est en UE/EEE ou cible le marché français.",
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

        case 'timing': {
          if (value === undefined || value === null) {
            const res = {
              isValid: false,
              error: "Veuillez préciser la date d'achat.",
            };
            return attachRef(res, { stepId, stepIndex: step, value, data });
          }
          if (value === false) {
            const res = {
              isValid: false,
              error: 'Le délai de garantie légale de 2 ans est dépassé.',
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
            const res = {
              isValid: false,
              error: "Veuillez préciser s'il y a un défaut.",
            };
            return attachRef(res, { stepId, stepIndex: step, value, data });
          }
          if (value === false) {
            const res = {
              isValid: false,
              error: "La garantie légale ne s'applique qu'en cas de défaut de conformité.",
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

        default:
          return { isValid: true };
      }
    },
    [data, attachRef],
  );

  // ✅ FONCTION CORRIGÉE POUR CALCULER L'ÉLIGIBILITÉ AVEC VÉRIFICATIONS
  const calculateEligibility = useCallback((formData: EligibilityData) => {
    try {
      // ✅ VÉRIFICATION DES DONNÉES AVANT CALCUL
      const validation = validateEligibilityData(formData);

      if (!validation.isValid) {
        console.warn("Données incomplètes pour le calcul d'éligibilité:", validation.missingFields);
        // On peut retourner un résultat partiel ou attendre que toutes les données soient remplies
        return {
          isEligible: false,
          reasons: ['no_defect'], // Raison générique en attendant plus de données
          timing: {},
        };
      }

      // ✅ APPEL SÉCURISÉ AU MOTEUR D'ÉLIGIBILITÉ
      return calculateEligibilityEngine(formData);
    } catch (error) {
      console.error("Erreur lors du calcul d'éligibilité:", error);
      // Fallback en cas d'erreur
      return {
        isEligible: false,
        reasons: ['no_defect'],
        timing: {},
      };
    }
  }, []);

  // ✅ FONCTION POUR METTRE À JOUR LES DONNÉES DE FAÇON SÉCURISÉE
  const updateData = useCallback((field: keyof EligibilityData, value: any) => {
    setData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  }, []);

  // ✅ FONCTION POUR VALIDER ET AVANCER À L'ÉTAPE SUIVANTE
  const goToNextStep = useCallback(() => {
    if (currentStep < ELIGIBILITY_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

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
