// hooks/useApi.ts - Hooks pour l'intégration API

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  FormDraft,
  Letter,
  ApiResponse,
  GetFormDraftResponse,
  SubmitFormResponse,
  API_ENDPOINTS,
} from '@/types/api';

// === HOOK DE BASE POUR LES REQUÊTES ===

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useApi<T = any>(
  url: string | null,
  options: RequestInit = {},
  apiOptions: UseApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (customUrl?: string, customOptions?: RequestInit) => {
      const requestUrl = customUrl || url;
      if (!requestUrl) return;

      // Annuler la requête précédente
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(requestUrl, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
            ...customOptions?.headers,
          },
          signal: abortControllerRef.current.signal,
          ...options,
          ...customOptions,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
        apiOptions.onSuccess?.(result);
        return result;
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err);
          apiOptions.onError?.(err);
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, options, apiOptions]
  );

  useEffect(() => {
    if (apiOptions.immediate && url) {
      execute();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [execute, apiOptions.immediate, url]);

  return { data, loading, error, execute };
}

// === HOOK POUR LES BROUILLONS ===

export function useFormDraft(formSlug: string) {
  const [draft, setDraft] = useState<FormDraft | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Récupération du draft
  const { execute: fetchDraft, loading: fetchLoading } = useApi<GetFormDraftResponse>(
    API_ENDPOINTS.getDraft(formSlug),
    { method: 'GET' },
    {
      onSuccess: response => {
        if (response.draft_id) {
          setDraft({
            id: response.draft_id,
            form_slug: formSlug,
            data: response.data || {},
            status: response.status,
            created_at: '',
            updated_at: '',
            last_event: response.last_event,
          });
        }
      },
    }
  );

  // Sauvegarde automatique
  const { execute: saveDraft } = useApi(
    API_ENDPOINTS.autosave(formSlug),
    { method: 'POST' },
    {
      onSuccess: () => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      },
      onError: () => {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      },
    }
  );

  // Soumission finale
  const { execute: submitDraft, loading: submitLoading } = useApi<SubmitFormResponse>(
    API_ENDPOINTS.submitForm(formSlug),
    { method: 'POST' },
    {
      onSuccess: response => {
        if (response.letter_id) {
          window.location.href = `/resultats?letter_id=${response.letter_id}`;
        } else if (response.redirect_url) {
          window.location.href = response.redirect_url;
        }
      },
    }
  );

  const autosave = useCallback(
    async (data: Record<string, any>) => {
      if (!data || Object.keys(data).length === 0) return;

      setSaveStatus('saving');

      try {
        await saveDraft(undefined, {
          body: JSON.stringify({ data }),
        });

        // Mettre à jour le draft local
        setDraft(prev => (prev ? { ...prev, data } : null));
      } catch (error) {
        console.error('Erreur autosave:', error);
      }
    },
    [saveDraft]
  );

  const debouncedAutosave = useCallback(
    (data: Record<string, any>, delay = 2000) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        autosave(data);
      }, delay);
    },
    [autosave]
  );

  const submitForm = useCallback(
    async (data: Record<string, any>) => {
      // Sauvegarder d'abord
      await autosave(data);

      // Puis soumettre
      return submitDraft(undefined, {
        body: JSON.stringify({
          data,
          event_type: 'form_submitted',
          meta: { timestamp: new Date().toISOString() },
        }),
      });
    },
    [autosave, submitDraft]
  );

  // Initialisation
  useEffect(() => {
    fetchDraft();
  }, [fetchDraft]);

  // Nettoyage
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    draft,
    saveStatus,
    loading: fetchLoading || submitLoading,
    autosave: debouncedAutosave,
    submitForm,
  };
}

// === HOOK POUR LES LETTRES ===

export function useLetter(letterId: string | null) {
  const {
    data: letter,
    loading,
    error,
    execute,
  } = useApi<Letter>(
    letterId ? API_ENDPOINTS.getLetter(letterId) : null,
    { method: 'GET' },
    { immediate: !!letterId }
  );

  const downloadFree = useCallback(async () => {
    if (!letterId) return;

    try {
      const response = await fetch(API_ENDPOINTS.previewBasic, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ letter_id: letterId }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mise-en-demeure-${letterId}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Erreur téléchargement gratuit:', error);
      throw error;
    }
  }, [letterId]);

  const generatePDF = useCallback(
    async (signatureDataUrl?: string) => {
      if (!letterId) return;

      try {
        const response = await fetch(API_ENDPOINTS.generatePDF, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            letter_id: letterId,
            signature_data_url: signatureDataUrl,
            pdf_type: 'final',
          }),
        });

        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `mise-en-demeure-${letterId}.pdf`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        }
      } catch (error) {
        console.error('Erreur génération PDF:', error);
        throw error;
      }
    },
    [letterId]
  );

  const completeService = useCallback(
    async (signatureDataUrl?: string) => {
      if (!letterId) return;

      try {
        const response = await fetch(API_ENDPOINTS.completeService, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            letter_id: letterId,
            signature_data_url: signatureDataUrl,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          return result;
        }
      } catch (error) {
        console.error('Erreur service complet:', error);
        throw error;
      }
    },
    [letterId]
  );

  return {
    letter,
    loading,
    error,
    refresh: execute,
    downloadFree,
    generatePDF,
    completeService,
  };
}

// === HOOK POUR LA VALIDATION ===

interface ValidationRule {
  required?: boolean;
  email?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface ValidationRules {
  [fieldName: string]: ValidationRule;
}

export function useValidation(rules: ValidationRules) {
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const validateField = useCallback(
    (name: string, value: any): boolean => {
      const rule = rules[name];
      if (!rule) return true;

      // Required
      if (rule.required && (!value || value.toString().trim() === '')) {
        setErrors(prev => ({ ...prev, [name]: 'Ce champ est requis' }));
        return false;
      }

      // Email
      if (rule.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors(prev => ({ ...prev, [name]: 'Format email invalide' }));
        return false;
      }

      // Min length
      if (rule.minLength && value && value.length < rule.minLength) {
        setErrors(prev => ({ ...prev, [name]: `Minimum ${rule.minLength} caractères` }));
        return false;
      }

      // Max length
      if (rule.maxLength && value && value.length > rule.maxLength) {
        setErrors(prev => ({ ...prev, [name]: `Maximum ${rule.maxLength} caractères` }));
        return false;
      }

      // Pattern
      if (rule.pattern && value && !rule.pattern.test(value)) {
        setErrors(prev => ({ ...prev, [name]: 'Format invalide' }));
        return false;
      }

      // Custom validation
      if (rule.custom && value) {
        const customError = rule.custom(value);
        if (customError) {
          setErrors(prev => ({ ...prev, [name]: customError }));
          return false;
        }
      }

      // Clear error if validation passes
      setErrors(prev => ({ ...prev, [name]: null }));
      return true;
    },
    [rules]
  );

  const validateAll = useCallback(
    (data: Record<string, any>): boolean => {
      let allValid = true;

      Object.keys(rules).forEach(fieldName => {
        const isValid = validateField(fieldName, data[fieldName]);
        if (!isValid) allValid = false;
      });

      return allValid;
    },
    [rules, validateField]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearError = useCallback((fieldName: string) => {
    setErrors(prev => ({ ...prev, [fieldName]: null }));
  }, []);

  return {
    errors,
    validateField,
    validateAll,
    clearErrors,
    clearError,
    hasErrors: Object.values(errors).some(error => error !== null),
  };
}

// === HOOK POUR L'ÉTAT DE L'APPLICATION ===

interface AppState {
  currentStep: number;
  formData: Record<string, any>;
  selectedFormula: 'free' | 'pdf' | 'complete';
  isSubmitting: boolean;
}

export function useAppState(initialState: Partial<AppState> = {}) {
  const [state, setState] = useState<AppState>({
    currentStep: 0,
    formData: {},
    selectedFormula: 'pdf',
    isSubmitting: false,
    ...initialState,
  });

  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateFormData = useCallback((field: string, value: any) => {
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
    }));
  }, []);

  const resetState = useCallback(() => {
    setState({
      currentStep: 0,
      formData: {},
      selectedFormula: 'pdf',
      isSubmitting: false,
    });
  }, []);

  return {
    state,
    updateState,
    updateFormData,
    resetState,
  };
}

// === HOOK POUR LA GESTION DES ERREURS ===

export function useErrorHandler() {
  const [error, setError] = useState<Error | null>(null);

  const handleError = useCallback((err: Error | string) => {
    const errorObj = typeof err === 'string' ? new Error(err) : err;
    setError(errorObj);
    console.error('Application error:', errorObj);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const withErrorHandling = useCallback(
    <T extends any[], R>(fn: (...args: T) => Promise<R>) => {
      return async (...args: T): Promise<R | undefined> => {
        try {
          return await fn(...args);
        } catch (err) {
          handleError(err as Error);
          return undefined;
        }
      };
    },
    [handleError]
  );

  return {
    error,
    handleError,
    clearError,
    withErrorHandling,
  };
}

// === HOOK POUR LES ÉTAPES DU FORMULAIRE ===

export function useFormSteps(totalSteps: number, validationRules: ValidationRules) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const { validateAll } = useValidation(validationRules);

  const canGoToStep = useCallback(
    (stepIndex: number) => {
      // Peut aller aux étapes déjà complétées ou à la suivante
      return stepIndex <= currentStep || completedSteps.has(stepIndex);
    },
    [currentStep, completedSteps]
  );

  const goToStep = useCallback(
    (stepIndex: number, formData?: Record<string, any>) => {
      if (stepIndex >= 0 && stepIndex < totalSteps && canGoToStep(stepIndex)) {
        setCurrentStep(stepIndex);
      }
    },
    [totalSteps, canGoToStep]
  );

  const nextStep = useCallback(
    (formData: Record<string, any>) => {
      if (validateAll(formData) && currentStep < totalSteps - 1) {
        setCompletedSteps(prev => new Set([...prev, currentStep]));
        setCurrentStep(currentStep + 1);
        return true;
      }
      return false;
    },
    [currentStep, totalSteps, validateAll]
  );

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const resetSteps = useCallback(() => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
  }, []);

  return {
    currentStep,
    completedSteps,
    canGoToStep,
    goToStep,
    nextStep,
    previousStep,
    resetSteps,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === totalSteps - 1,
    progress: ((currentStep + 1) / totalSteps) * 100,
  };
}

// === HOOK POUR LES ANALYTICS ===

export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    // Intégration future avec un service d'analytics
    console.log('Analytics event:', eventName, properties);

    // Exemple d'intégration avec Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, properties);
    }
  }, []);

  const trackPageView = useCallback(
    (page: string) => {
      trackEvent('page_view', { page });
    },
    [trackEvent]
  );

  const trackFormStep = useCallback(
    (step: number, stepName: string) => {
      trackEvent('form_step_completed', { step, step_name: stepName });
    },
    [trackEvent]
  );

  const trackFormSubmission = useCallback(
    (formSlug: string, formula: string) => {
      trackEvent('form_submitted', { form_slug: formSlug, formula });
    },
    [trackEvent]
  );

  const trackDownload = useCallback(
    (type: 'free' | 'pdf', letterId: string) => {
      trackEvent('letter_downloaded', { type, letter_id: letterId });
    },
    [trackEvent]
  );

  return {
    trackEvent,
    trackPageView,
    trackFormStep,
    trackFormSubmission,
    trackDownload,
  };
}
