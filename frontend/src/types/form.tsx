// frontend/src/types/form.tsx - ValidationManager corrigé
export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'number';
  value?: string | number;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  message: string;
}

export type StepId = 'buyer_info' | 'seller_info' | 'purchase_info' | 'problem_info';

export interface Step {
  id: StepId;
  title: string;
  fields: string[];
}

export interface FormData {
  // Buyer info
  buyer_name?: string;
  buyer_first_name?: string;
  buyer_last_name?: string;
  buyer_email?: string;
  buyer_address_line_1?: string;
  buyer_postal_code?: string;
  buyer_city?: string;
  buyer_country?: string;

  // Seller info
  seller_name?: string;
  seller_address_line_1?: string;
  seller_postal_code?: string;
  seller_city?: string;
  seller_country?: string;

  // Purchase info
  product_name?: string;
  purchase_date?: string;
  product_price?: string;
  product_condition?: string;

  // Problem info
  defect_type?: string;
  defect_description?: string;

  // Computed fields
  used?: boolean;
  presumption_limit_months?: number;
  presumption_months_since_delivery?: number;
  presumption_active?: boolean;
}

export interface SaveStatus {
  type: 'saving' | 'saved' | 'error' | null;
  message: string;
}

export const STEPS: Step[] = [
  {
    id: 'buyer_info',
    title: 'Vos informations',
    fields: ['buyer_name', 'buyer_address_line_1', 'buyer_postal_code', 'buyer_city'],
  },
  {
    id: 'seller_info',
    title: 'Informations vendeur',
    fields: ['seller_name', 'seller_address_line_1', 'seller_postal_code', 'seller_city'],
  },
  {
    id: 'purchase_info',
    title: 'Informations achat',
    fields: ['product_name', 'purchase_date', 'product_price', 'product_condition'],
  },
  {
    id: 'problem_info',
    title: 'Description du problème',
    fields: ['defect_type', 'defect_description'],
  },
];

// ✅ ValidationManager SANS RÉCURSION - Version corrigée
export class ValidationManager {
  private hasInteracted = new Set<string>();
  private validationCache = new Map<string, ValidationResult>();
  private isValidating = new Set<string>(); // Prévenir la récursion

  private validators = {
    required: (value: string) => value?.trim()?.length > 0,
    email: (value: string) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    minLength: (value: string, min: number) => (value?.length || 0) >= min,
    maxLength: (value: string, max: number) => (value?.length || 0) <= max,
    pattern: (value: string, pattern: string) => new RegExp(pattern).test(value || ''),
    number: (value: string) => !isNaN(Number(value)) && value?.trim() !== '',
  };

  markInteracted(fieldName: string): void {
    this.hasInteracted.add(fieldName);
  }

  isInteracted(fieldName: string): boolean {
    return this.hasInteracted.has(fieldName);
  }

  // ✅ Validation d'un champ SANS récursion
  validateField(fieldName: string, value: any, rules: ValidationRule[] = []): ValidationResult {
    // Clé de cache unique
    const cacheKey = `${fieldName}-${JSON.stringify(value)}-${JSON.stringify(rules)}`;

    // Vérifier le cache d'abord
    if (this.validationCache.has(cacheKey)) {
      return this.validationCache.get(cacheKey)!;
    }

    // Prévenir la récursion
    if (this.isValidating.has(fieldName)) {
      const defaultResult = { valid: true, message: '' };
      this.validationCache.set(cacheKey, defaultResult);
      return defaultResult;
    }

    this.isValidating.add(fieldName);

    try {
      // Validation séquentielle simple
      for (const rule of rules) {
        const validator = this.validators[rule.type];
        if (!validator) continue;

        const valid =
          rule.value !== undefined ? validator(value, rule.value as any) : validator(value);

        if (!valid) {
          const result = { valid: false, message: rule.message };
          this.validationCache.set(cacheKey, result);
          return result;
        }
      }

      const result = { valid: true, message: '' };
      this.validationCache.set(cacheKey, result);
      return result;
    } finally {
      // ✅ TOUJOURS nettoyer après validation
      this.isValidating.delete(fieldName);
    }
  }

  // ✅ Validation d'étape simple - SANS récursion
  validateStep(stepFields: string[], formData: Record<string, any>): boolean {
    // Validation simple sans appels récursifs
    return stepFields.every(fieldName => {
      const value = formData[fieldName];

      // Règles de validation basiques
      if (fieldName.includes('email') && value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }

      if (fieldName.includes('postal_code') && value) {
        return /^\d{5}$/.test(value);
      }

      // Champ requis : doit être non vide
      return value && (typeof value !== 'string' || value.trim().length > 0);
    });
  }

  // ✅ Nettoyage du cache (utile pour les performances)
  clearCache(): void {
    this.validationCache.clear();
    this.isValidating.clear();
  }

  // ✅ Reset complet
  reset(): void {
    this.hasInteracted.clear();
    this.clearCache();
  }
}

export interface AddressSearchResponse {
  type: string;
  version: string;
  features: AddressFeature[];
}

/** Une feature de l'API adresse */
export interface AddressFeature {
  type: 'Feature';
  geometry: {
    type: string;
    coordinates: [number, number]; // [lon, lat]
  };
  properties: {
    label: string; // "8 Boulevard du Port, 95000 Cergy"
    score?: number;
    housenumber?: string;
    id?: string;
    name?: string;
    postcode?: string;
    city?: string;
    district?: string;
    street?: string;
    context?: string; // "95, Val-d'Oise, Île-de-France"
    type?: string;
    importance?: number;
    country?: string;
    country_code?: string; // "fr"
    [key: string]: any; // pour tolérer d’autres propriétés
  };
}

export interface ValidationAPI {
  validateField?: (value: any, rules?: any) => { valid?: boolean; message?: string } | boolean;
  getFieldRules?: (name: string, rules: any) => any;
  validateStep?: (idOrFields: StepId | string[], data: FormData) => boolean;
  markInteracted?: (field: string) => void;
  isInteracted?: (field: string) => boolean;
}

// Callback standard pour mettre à jour un champ
export type OnFieldChange = (field: keyof FormData | string, value: string) => void;

// ✅ Props communes à toutes les étapes
export interface StepProps {
  data: FormData;
  validation: ValidationAPI; // simpleValidation ou ValidationManager
  onFieldChange: OnFieldChange;
  onNext?: () => void;
  onPrev?: () => void;
  onSubmit?: () => void;
  registerBeforeSubmit?: (fn: () => boolean | void) => void;
  isSubmitting?: boolean;
}
