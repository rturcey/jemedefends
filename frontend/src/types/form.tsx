// frontend/src/types/form.tsx - Types mis à jour avec les nouveaux champs
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
    buyer_phone?: string;
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
    remedy_preference?: 'réparation' | 'remplacement' | 'résiliation';
    digital?: boolean;

    // Problem info
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
        fields: ['remedy_preference', 'defect_description'],
    },
];

// ValidationManager SANS RÉCURSION - Version corrigée
export class ValidationManager {
    private hasInteracted = new Set<string>();
    private validationCache = new Map<string, ValidationResult>();
    private isValidating = new Set<string>();

    private validators = {
        required: (value: string) => value?.trim()?.length > 0,
        email: (value: string) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        minLength: (value: string, min: number) => (value?.length || 0) >= min,
        maxLength: (value: string, max: number) => (value?.length || 0) <= max,
        pattern: (value: string, pattern: RegExp) => !value || pattern.test(value),
    };

    markInteracted(fieldName: string): void {
        this.hasInteracted.add(fieldName);
    }

    isInteracted(fieldName: string): boolean {
        return this.hasInteracted.has(fieldName);
    }

    validateField(fieldName: string, value: any, rules?: ValidationRule[]): ValidationResult {
        if (this.isValidating.has(fieldName)) {
            return {valid: true, message: ''};
        }

        const cacheKey = `${fieldName}:${JSON.stringify(value)}`;
        if (this.validationCache.has(cacheKey)) {
            return this.validationCache.get(cacheKey)!;
        }

        this.isValidating.add(fieldName);

        try {
            if (!rules || rules.length === 0) {
                const result = {valid: true, message: ''};
                this.validationCache.set(cacheKey, result);
                return result;
            }

            for (const rule of rules) {
                let isValid = true;
                switch (rule.type) {
                    case 'required':
                        isValid = this.validators.required(value);
                        break;
                    case 'email':
                        isValid = this.validators.email(value);
                        break;
                    case 'minLength':
                        isValid = this.validators.minLength(value, rule.value as number);
                        break;
                    case 'maxLength':
                        isValid = this.validators.maxLength(value, rule.value as number);
                        break;
                    case 'pattern':
                        isValid = this.validators.pattern(value, new RegExp(rule.value as string));
                        break;
                }

                if (!isValid) {
                    const result = {valid: false, message: rule.message};
                    this.validationCache.set(cacheKey, result);
                    return result;
                }
            }

            const result = {valid: true, message: ''};
            this.validationCache.set(cacheKey, result);
            return result;
        } finally {
            this.isValidating.delete(fieldName);
        }
    }

    getFieldRules(fieldName: string, config: any): ValidationRule[] {
        const rules: ValidationRule[] = [];

        if (config.required) {
            rules.push({
                type: 'required',
                message: 'Ce champ est requis',
            });
        }

        if (config.email) {
            rules.push({
                type: 'email',
                message: 'Format email invalide',
            });
        }

        if (config.minLength) {
            rules.push({
                type: 'minLength',
                value: config.minLength,
                message: `Minimum ${config.minLength} caractères`,
            });
        }

        if (config.maxLength) {
            rules.push({
                type: 'maxLength',
                value: config.maxLength,
                message: `Maximum ${config.maxLength} caractères`,
            });
        }

        if (config.pattern) {
            rules.push({
                type: 'pattern',
                value: config.pattern,
                message: config.patternMessage || 'Format invalide',
            });
        }

        return rules;
    }

    validateStep(stepId: StepId, data: FormData): boolean {
        const step = STEPS.find(s => s.id === stepId);
        if (!step) return false;

        // Validation spécifique par étape
        switch (stepId) {
            case 'buyer_info':
                return !!(
                    data.buyer_name &&
                    data.buyer_address_line_1 &&
                    data.buyer_postal_code &&
                    data.buyer_city
                );

            case 'seller_info':
                return !!(
                    data.seller_name &&
                    data.seller_address_line_1 &&
                    data.seller_postal_code &&
                    data.seller_city
                );

            case 'purchase_info':
                return !!(
                    data.product_name &&
                    data.purchase_date &&
                    data.product_price &&
                    data.product_condition
                );

            case 'problem_info':
                return !!(
                    data.remedy_preference && // NOUVEAU : obligatoire
                    data.defect_description &&
                    data.defect_description.length >= 20
                );

            default:
                return false;
        }
    }

    clearCache(): void {
        this.validationCache.clear();
    }
}
