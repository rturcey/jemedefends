// frontend/src/hooks/form.tsx - VERSION SANS SÉRIALISATION PROBLÉMATIQUE
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { FormData, SaveStatus, STEPS } from '@/types/form';

const API_BASE = '/api/v1/form-drafts';
const DEBOUNCE_MS = 500;

const _touched = new Set<string>();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const simpleValidation = {
  markInteracted(field: string) {
    _touched.add(field);
  },

  isInteracted(field: string): boolean {
    return _touched.has(field);
  },

  // API existante : retourne { valid, message }, en respectant les rules
  validateField(
    value: any,
    rules: {
      required?: boolean;
      type?: 'email' | string;
      minLength?: number;
      maxLength?: number;
      pattern?: string;
    } = {}
  ): { valid: boolean; message: string } {
    const { required, type, minLength, maxLength, pattern } = rules;
    const str = (value ?? '').toString();

    // Champ vide
    if (!str.trim()) {
      if (required) return { valid: false, message: 'Ce champ est requis' };
      return { valid: true, message: '' }; // facultatif → OK
    }

    // Type email facultatif → on ne valide que si non vide
    if (type === 'email' && !EMAIL_RE.test(str)) {
      return { valid: false, message: 'Adresse email invalide' };
    }

    if (typeof minLength === 'number' && str.length < minLength) {
      return { valid: false, message: `Au moins ${minLength} caractères` };
    }
    if (typeof maxLength === 'number' && str.length > maxLength) {
      return { valid: false, message: `Au plus ${maxLength} caractères` };
    }
    if (pattern) {
      try {
        const re = new RegExp(pattern);
        if (!re.test(str)) return { valid: false, message: 'Format invalide' };
      } catch {
        // motif invalide → ignorer
      }
    }
    return { valid: true, message: '' };
  },

  // Pass-through
  getFieldRules(_name: string, rules: any) {
    return rules ?? {};
  },

  validateStep(idOrFields: string | string[], data: Record<string, any>) {
    const fields = Array.isArray(idOrFields)
      ? idOrFields
      : (STEPS.find(s => s.id === idOrFields)?.fields ?? []);
    if (!fields.length) return true;
    return fields.every(f => {
      const v = data?.[f];
      if (typeof v === 'string') return v.trim().length > 0;
      return v !== null && v !== undefined && v !== '';
    });
  },
} as const;

interface UseFormManagerReturn {
  currentStepIndex: number;
  formData: FormData;
  validation: typeof simpleValidation;
  isSubmitting: boolean;
  globalError: string | null;
  saveStatus: SaveStatus;
  progressPercent: number;
  goToStep: (index: number) => boolean;
  nextStep: () => boolean;
  prevStep: () => boolean;
  updateField: (field: string, value: string) => void;
  submitForm: () => Promise<void>;
  clearGlobalError: () => void;
  fillTestData: () => void;
}

const useFormManager = (formSlug: string = 'mise_en_demeure_v1'): UseFormManagerReturn => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    buyer_country: 'FR',
    seller_country: 'FR',
  });
  // 🔧 PAS DE CLASSE EN STATE - simple objet
  // const [validation] = useState(() => new ValidationManager()); ❌

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ type: null, message: '' });

  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const formDataRef = useRef(formData);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const progressPercent = useMemo(() => {
    return Math.round(((currentStepIndex + 1) / STEPS.length) * 100);
  }, [currentStepIndex]);

  const fetchJSON = useCallback(async (url: string, opts: RequestInit = {}) => {
    const res = await fetch(url, { credentials: 'include', ...opts });
    if (!res.ok) {
      let msg = `HTTP ${res.status}`;
      try {
        const j = await res.json();
        if (j?.detail) msg = j.detail;
      } catch {}
      throw new Error(msg);
    }
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res.text();
  }, []);

  const showSaveStatus = useCallback((message: string, type: SaveStatus['type']) => {
    setSaveStatus({ message, type });
    if (type !== 'saving') {
      setTimeout(() => {
        setSaveStatus({ type: null, message: '' });
      }, 2000);
    }
  }, []);

  const extractFormData = useCallback((): ((currentData: FormData) => FormData) => {
    return (currentData: FormData) => {
      const data = { ...currentData };

      if (data.purchase_date) {
        const purchaseDateObj = new Date(data.purchase_date);
        const now = new Date();
        const monthsDiff =
          (now.getFullYear() - purchaseDateObj.getFullYear()) * 12 +
          (now.getMonth() - purchaseDateObj.getMonth());

        const condition = data.product_condition || 'new';
        data.used = condition === 'used';
        data.presumption_limit_months = condition === 'used' ? 12 : 24;
        data.presumption_months_since_delivery = monthsDiff;
        data.presumption_active = monthsDiff <= (condition === 'used' ? 12 : 24);
      }

      return data;
    };
  }, []);

  const performAutosave = useCallback(
    async (dataToSave: FormData) => {
      try {
        showSaveStatus('Sauvegarde...', 'saving');
        const processData = extractFormData();
        const data = processData(dataToSave);

        await fetchJSON(`${API_BASE}/${encodeURIComponent(formSlug)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data }),
        });

        showSaveStatus('Sauvegardé', 'saved');
      } catch (error) {
        console.error('Erreur sauvegarde automatique:', error);
        showSaveStatus('Erreur de sauvegarde', 'error');
      }
    },
    [extractFormData, fetchJSON, formSlug, showSaveStatus]
  );

  const loadDraft = useCallback(async () => {
    if (isInitializedRef.current) return;

    try {
      const data = await fetchJSON(`${API_BASE}/${encodeURIComponent(formSlug)}`);
      if (data?.data) {
        setFormData(data.data);
      }
      isInitializedRef.current = true;
    } catch (error) {
      console.error('Erreur chargement brouillon:', error);
      isInitializedRef.current = true;
    }
  }, [fetchJSON, formSlug]);

  // 🔧 VALIDATION SIMPLE SANS CLASSE
  const isStepValid = useCallback((stepIndex: number, data?: FormData): boolean => {
    if (stepIndex < 0 || stepIndex >= STEPS.length) return true;

    const step = STEPS[stepIndex];
    const dataToValidate = data || formDataRef.current;

    return step.fields.every(fieldName => {
      const value = dataToValidate[fieldName as keyof FormData];
      return value && (typeof value !== 'string' || value.trim().length > 0);
    });
  }, []);

  const goToStep = useCallback(
    (targetIndex: number, force = false): boolean => {
      if (targetIndex < 0 || targetIndex >= STEPS.length) return false;

      if (!force) {
        const currentData = formDataRef.current;
        for (let i = 0; i < targetIndex; i++) {
          if (!isStepValid(i, currentData)) {
            setCurrentStepIndex(i);
            setGlobalError('Veuillez compléter les champs requis');
            return false;
          }
        }
      }

      setCurrentStepIndex(targetIndex);
      setGlobalError(null);

      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      return true;
    },
    [isStepValid]
  );

  const nextStep = useCallback((): boolean => {
    return goToStep(currentStepIndex + 1);
  }, [currentStepIndex, goToStep]);

  const prevStep = useCallback((): boolean => {
    return goToStep(currentStepIndex - 1, true);
  }, [currentStepIndex, goToStep]);

  const updateField = useCallback(
    (field: string, value: string) => {
      setFormData(prev => {
        const newData = { ...prev, [field]: value };

        if (autosaveTimerRef.current) {
          clearTimeout(autosaveTimerRef.current);
        }

        autosaveTimerRef.current = setTimeout(() => {
          performAutosave(newData);
        }, DEBOUNCE_MS);

        return newData;
      });

      // 🔧 SIMPLE VALIDATION SANS CLASSE
      simpleValidation.markInteracted(field);
    },
    [performAutosave]
  );

  const submitForm = useCallback(async () => {
    try {
      setIsSubmitting(true);
      setGlobalError(null);

      const currentData = formDataRef.current || formData;

      for (let i = 0; i < STEPS.length; i++) {
        if (!isStepValid(i, currentData)) {
          setCurrentStepIndex(i);
          setGlobalError('Veuillez corriger les erreurs avant de continuer');
          return;
        }
      }

      showSaveStatus('Génération en cours...', 'saving');

      const processData = extractFormData();
      const data = processData(currentData);

      await fetchJSON(`${API_BASE}/${encodeURIComponent(formSlug)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });

      const result = await fetchJSON(`${API_BASE}/submit/${encodeURIComponent(formSlug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (result.redirect_url) {
        window.location.href = result.redirect_url;
      } else {
        showSaveStatus('Lettre générée avec succès!', 'saved');
      }
    } catch (error) {
      console.error('Erreur soumission:', error);
      setGlobalError(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      showSaveStatus('Erreur lors de la génération', 'error');
    } finally {
      setIsSubmitting(false);
    }
  }, [extractFormData, fetchJSON, formSlug, showSaveStatus, isStepValid]);

  const fillTestData = useCallback(() => {
    const testData: FormData = {
      buyer_name: 'Jean Dupont',
      buyer_address_line_1: '123 rue de la République',
      buyer_postal_code: '75001',
      buyer_city: 'Paris',
      buyer_country: 'FR',
      seller_name: 'TechStore SARL',
      seller_address_line_1: '456 avenue du Commerce',
      seller_postal_code: '69000',
      seller_city: 'Lyon',
      seller_country: 'FR',
      product_name: 'Smartphone XYZ Pro 256GB',
      purchase_date: '2024-06-15',
      product_price: '899',
      product_condition: 'used',
      defect_type: 'fonctionnement',
      defect_description:
        "L'écran présente des lignes verticales noires permanentes qui rendent l'appareil inutilisable. Le problème est apparu spontanément après seulement 2 mois d'utilisation normale.",
    };

    setFormData(testData);

    Object.keys(testData).forEach(field => {
      simpleValidation.markInteracted(field);
    });
  }, []);

  const clearGlobalError = useCallback(() => {
    setGlobalError(null);
  }, []);

  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  useEffect(() => {
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, []);

  return {
    currentStepIndex,
    formData,
    validation: simpleValidation, // 🔧 SIMPLE OBJET, PAS UNE CLASSE
    isSubmitting,
    globalError,
    saveStatus,
    progressPercent,
    goToStep,
    nextStep,
    prevStep,
    updateField,
    submitForm,
    clearGlobalError,
    fillTestData,
  };
};

export default useFormManager;
