// frontend/src/lib/validation.ts
// ==========================================
// TYPES & VALIDATION
// ==========================================

interface ValidationRule {
    type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern';
    value?: string | number;
    message: string;
}

interface ValidationResult {
    valid: boolean;
    message: string;
}

interface FormData {
    // Buyer info
    buyer_name?: string;
    buyer_email?: string;
    buyer_address_line_1?: string;
    buyer_address_line_2?: string;
    buyer_postal_code?: string;
    buyer_city?: string;
    buyer_country?: string;

    // Seller info
    seller_name?: string;
    seller_address_line_1?: string;
    seller_address_line_2?: string;
    seller_postal_code?: string;
    seller_city?: string;
    seller_country?: string;

    // Purchase info
    product_name?: string;
    purchase_date?: string;
    product_price?: string;
    product_condition?: string;
    order_reference?: string;

    // Problem info
    defect_type?: string;
    defect_description?: string;
}

// ValidationManager centralisé
export class ValidationManager {
    private hasInteracted = new Set<string>();
    private validationCache = new Map<string, ValidationResult>();
    private isValidating = new Set<string>();

    private validators = {
        required: (value: string) => value?.trim()?.length > 0,
        email: (value: string) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        minLength: (value: string, min: number) => (value?.length || 0) >= min,
        maxLength: (value: string, max: number) => (value?.length || 0) <= max,
        pattern: (value: string, pattern: string) => new RegExp(pattern).test(value || ''),
    };

    markInteracted(fieldName: string): void {
        this.hasInteracted.add(fieldName);
    }

    isInteracted(fieldName: string): boolean {
        return this.hasInteracted.has(fieldName);
    }

    validateField(fieldName: string, value: any, rules: ValidationRule[] = []): ValidationResult {
        const cacheKey = `${fieldName}-${JSON.stringify(value)}-${JSON.stringify(rules)}`;

        if (this.validationCache.has(cacheKey)) {
            return this.validationCache.get(cacheKey)!;
        }

        if (this.isValidating.has(fieldName)) {
            const defaultResult = {valid: true, message: ''};
            this.validationCache.set(cacheKey, defaultResult);
            return defaultResult;
        }

        this.isValidating.add(fieldName);

        try {
            for (const rule of rules) {
                const validator = this.validators[rule.type];
                if (!validator) continue;

                const valid =
                    rule.value !== undefined ? validator(value, rule.value as any) : validator(value);

                if (!valid) {
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

    validateStep(stepFields: string[], formData: Record<string, any>): boolean {
        return stepFields.every(fieldName => {
            const value = formData[fieldName];
            if (fieldName.includes('email') && value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            }
            if (fieldName.includes('postal_code') && value) {
                return /^\d{5}$/.test(value);
            }
            return value && (typeof value !== 'string' || value.trim().length > 0);
        });
    }

    clearCache(): void {
        this.validationCache.clear();
        this.isValidating.clear();
    }

    reset(): void {
        this.hasInteracted.clear();
        this.clearCache();
    }
}

export function gatedValidation(
    fieldName: string,
    value: any,
    rules: any,
    validateField?: (value: any, rules: any) => ValidationResult,
    isInteracted?: (fieldName: string) => boolean,
): ValidationResult | undefined {
    const touched = isInteracted?.(fieldName) === true;
    const hasValue =
        typeof value === 'string' ? value.trim().length > 0 : value !== undefined && value !== null;

    if (!touched && !hasValue) {
        return undefined; // neutral = no border/error shown
    }
    return typeof validateField === 'function' ? validateField(value, rules) : undefined;
}

// ==========================================
// NOUVEAUX VALIDATEURS STRICTS
// ==========================================

/**
 * Valide un prix avec une regex stricte
 * Accepte: 100, 100.50, 100,50, 899.99
 * Rejette: 7890--19, 100., .50, 100..50, --100, etc.
 */
export function validatePrice(value: string): ValidationResult {
    if (!value || !value.trim()) {
        return {valid: false, message: 'Le prix est requis'};
    }

    const trimmed = value.trim();

    // Regex stricte : chiffres + optionnellement point ou virgule + 1-2 décimales
    const priceRegex = /^\d+(?:[.,]\d{1,2})?$/;

    if (!priceRegex.test(trimmed)) {
        return {
            valid: false,
            message: 'Format invalide. Utilisez des chiffres (ex: 899.99 ou 899,99)',
        };
    }

    // Vérifier que le nombre est positif et raisonnable
    const normalized = trimmed.replace(',', '.');
    const numValue = parseFloat(normalized);

    if (isNaN(numValue)) {
        return {valid: false, message: 'Prix invalide'};
    }

    if (numValue <= 0) {
        return {valid: false, message: 'Le prix doit être supérieur à 0'};
    }

    if (numValue > 999999.99) {
        return {valid: false, message: 'Le prix semble trop élevé'};
    }

    return {valid: true, message: ''};
}

/**
 * Valide une date
 */
export function validateDate(value: string): ValidationResult {
    if (!value || !value.trim()) {
        return {valid: false, message: 'La date est requise'};
    }

    const date = new Date(value);
    const now = new Date();

    if (isNaN(date.getTime())) {
        return {valid: false, message: 'Date invalide'};
    }

    // Pas de date dans le futur
    if (date > now) {
        return {
            valid: false,
            message: "La date d'achat ne peut pas être dans le futur",
        };
    }

    // Pas de date trop ancienne (plus de 10 ans)
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(now.getFullYear() - 10);

    if (date < tenYearsAgo) {
        return {valid: false, message: "La date d'achat semble trop ancienne"};
    }

    return {valid: true, message: ''};
}

/**
 * Valide un code postal français (5 chiffres)
 */
export function validatePostalCode(value: string): ValidationResult {
    if (!value || !value.trim()) {
        return {valid: false, message: 'Le code postal est requis'};
    }

    const postalRegex = /^[0-9]{5}$/;

    if (!postalRegex.test(value.trim())) {
        return {
            valid: false,
            message: 'Format invalide. Le code postal doit contenir 5 chiffres',
        };
    }

    return {valid: true, message: ''};
}

/**
 * Nettoie et normalise un prix (remplace virgule par point)
 */
export function normalizePrice(value: string): string {
    return value.replace(',', '.').trim();
}

/**
 * Formate un prix pour l'affichage (ajoute 2 décimales si nécessaire)
 */
export function formatPrice(value: string): string {
    const normalized = normalizePrice(value);
    const num = parseFloat(normalized);

    if (isNaN(num)) return value;

    return num.toFixed(2).replace('.', ',');
}

// ==========================================
// FONCTIONS EXISTANTES (maintenues)
// ==========================================

// Capitalisation des noms
export function normalizeName(input: string): string {
    if (!input) return input;
    const particles = new Set([
        'de',
        'du',
        'des',
        'la',
        'le',
        'les',
        'von',
        'van',
        'der',
        'da',
        'di',
    ]);

    return input
        .trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map((token, idx) => {
            if (!token) return token;

            // Gestion L', D', etc.
            if (token.includes("'")) {
                const [left, right] = token.split("'");
                return `${left.toUpperCase()}'${right.charAt(0).toUpperCase()}${right.slice(1).toLowerCase()}`;
            }

            // Gestion tirets
            if (token.includes('-')) {
                return token
                    .split('-')
                    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
                    .join('-');
            }

            const lower = token.toLowerCase();
            if (particles.has(lower) && idx > 0) {
                return lower;
            }

            return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
        })
        .join(' ');
}

export const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const showMessage = (type: 'success' | 'error', text: string) => {
    const messagesEl = document.getElementById('messages');
    if (!messagesEl) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `
    message p-4 rounded-2xl text-center font-semibold mb-4 animate-slide-down
    ${
        type === 'success'
            ? 'bg-green-100 text-green-800 border border-green-200'
            : 'bg-red-100 text-red-800 border border-red-200'
    }
  `;
    messageDiv.textContent = text;

    messagesEl.appendChild(messageDiv);

    // Auto-suppression après 5 secondes
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.classList.add('animate-slide-up');
            setTimeout(() => messageDiv.remove(), 300);
        }
    }, 5000);
};
