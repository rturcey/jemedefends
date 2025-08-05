type ValidateFn = (value: any, rules?: any) => any;
type IsInteractedFn = (name: string) => boolean;

/**
 * Gate validation results behind "touched" OR non-empty value.
 * If not touched and empty -> return `undefined` (neutral UI).
 */
export function gatedValidation(
  fieldName: string,
  value: any,
  rules: any,
  validateField?: ValidateFn,
  isInteracted?: IsInteractedFn
) {
  const touched = isInteracted?.(fieldName) === true;
  const hasValue =
    typeof value === 'string' ? value.trim().length > 0 : value !== undefined && value !== null;

  if (!touched && !hasValue) {
    return undefined; // neutral = no border/error shown
  }
  return typeof validateField === 'function' ? validateField(value, rules) : undefined;
}
