// frontend/src/lib/validation.ts
// ==========================================
// TYPES & VALIDATION
// ==========================================

interface ValidationResult {
  valid: boolean;
  message: string;
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
// ✅ NOUVEAUX VALIDATEURS STRICTS
// ==========================================

/**
 * Valide un prix avec une regex stricte
 * Accepte: 100, 100.50, 100,50, 899.99
 * Rejette: 7890--19, 100., .50, 100..50, --100, etc.
 */
export function validatePrice(value: string): ValidationResult {
  if (!value || !value.trim()) {
    return { valid: false, message: 'Le prix est requis' };
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
    return { valid: false, message: 'Prix invalide' };
  }

  if (numValue <= 0) {
    return { valid: false, message: 'Le prix doit être supérieur à 0' };
  }

  if (numValue > 999999.99) {
    return { valid: false, message: 'Le prix semble trop élevé' };
  }

  return { valid: true, message: '' };
}

/**
 * Valide une date
 */
export function validateDate(value: string): ValidationResult {
  if (!value || !value.trim()) {
    return { valid: false, message: 'La date est requise' };
  }

  const date = new Date(value);
  const now = new Date();

  if (isNaN(date.getTime())) {
    return { valid: false, message: 'Date invalide' };
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
    return { valid: false, message: "La date d'achat semble trop ancienne" };
  }

  return { valid: true, message: '' };
}

/**
 * Nettoie et normalise un prix (remplace virgule par point)
 */
export function normalizePrice(value: string): string {
  return value.replace(',', '.').trim();
}

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
