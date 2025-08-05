// 🛠️ validation.ts - Service de validation sécurisé

interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  value?: string | number;
  message: string;
}

interface StepDefinition {
  id: string;
  fields: string[];
}

class ValidationService {
  private validators = {
    required: (value: string) => value?.trim().length > 0,
    email: (value: string) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    minLength: (value: string, min: number) => value.length >= min,
    maxLength: (value: string, max: number) => value.length <= max,
    pattern: (value: string, pattern: string) => new RegExp(pattern).test(value),
  };

  private isValidating = new Set<string>(); // Prévenir la récursion

  /**
   * ✅ Validation d'un champ spécifique
   */
  validateField(
    fieldName: string,
    value: any,
    rules: ValidationRule[] = []
  ): { valid: boolean; message: string } {
    // Éviter la validation récursive
    const validationKey = `${fieldName}-${typeof value === 'string' ? value : JSON.stringify(value)}`;

    if (this.isValidating.has(validationKey)) {
      return { valid: true, message: '' };
    }

    this.isValidating.add(validationKey);

    try {
      for (const rule of rules) {
        const validator = this.validators[rule.type];
        if (!validator) continue;

        const valid =
          rule.value !== undefined ? validator(value, rule.value as any) : validator(value);

        if (!valid) {
          return { valid: false, message: rule.message };
        }
      }

      return { valid: true, message: '' };
    } finally {
      // Toujours nettoyer après validation
      this.isValidating.delete(validationKey);
    }
  }

  /**
   * ✅ Validation d'une étape complète - SANS RÉCURSION
   */
  validateStep(
    stepId: string,
    formData: Record<string, any> = {},
    steps: StepDefinition[] = []
  ): boolean {
    // Éviter la validation récursive d'étape
    if (this.isValidating.has(`step-${stepId}`)) {
      return true;
    }

    const step = steps.find(s => s.id === stepId);
    if (!step) return true;

    this.isValidating.add(`step-${stepId}`);

    try {
      return step.fields.every(fieldName => {
        const value = formData[fieldName];

        // Validation des champs radio/select
        if (fieldName === 'product_condition' || fieldName === 'defect_type') {
          return !!value;
        }

        // Validation des champs texte
        if (typeof value === 'string') {
          const trimmedValue = value.trim();

          // Validation basique required
          if (!trimmedValue) return false;

          // Validations spécifiques par champ
          if (fieldName.includes('email')) {
            return this.validators.email(trimmedValue);
          }

          if (fieldName.includes('postal_code')) {
            return /^\d{5}$/.test(trimmedValue);
          }

          return true;
        }

        // Pour autres types, vérifier juste la présence
        return !!value;
      });
    } finally {
      this.isValidating.delete(`step-${stepId}`);
    }
  }

  /**
   * ✅ Validation de tous les champs d'un formulaire
   */
  validateAll(
    formData: Record<string, any>,
    steps: StepDefinition[] = []
  ): { isValid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    let isValid = true;

    for (const step of steps) {
      for (const fieldName of step.fields) {
        const value = formData[fieldName] || '';

        // Validation simple sans appel à validateStep pour éviter la récursion
        if (!value || (typeof value === 'string' && !value.trim())) {
          errors[fieldName] = 'Ce champ est requis';
          isValid = false;
        }
      }
    }

    return { isValid, errors };
  }

  /**
   * ✅ Nettoyer le cache de validation
   */
  clearCache(): void {
    this.isValidating.clear();
  }
}

// Export d'une instance unique
export const validationService = new ValidationService();

// Export du type pour utilisation dans les composants
export type { ValidationRule, StepDefinition };
