'use client';

import React, { useId, useMemo, useState } from 'react';
import { ValidationResult } from '@/types/form';

type Props = {
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  rows?: number;
  validation?: ValidationResult;
  helpText?: string;
  className?: string;
  /** ← NEW: force l’id du contrôle pour matcher un label externe */
  controlId?: string;
};

const TextAreaField: React.FC<Props> = ({
  name,
  label,
  value,
  onChange,
  required = false,
  placeholder,
  minLength,
  maxLength = 1000,
  rows = 5,
  validation,
  helpText,
  className = '',
  controlId,
}) => {
  const reactId = useId();
  // ✅ si controlId est fourni, on l’utilise tel quel (pour matcher le label externe)
  const inputId = controlId || `${name}-${reactId}`;
  const helpId = `${name}-help-${reactId}`;
  const errorId = `${name}-error-${reactId}`;

  const [interacted, setInteracted] = useState(false);

  const computedValidation: ValidationResult | undefined = useMemo(() => {
    if (validation) return validation;
    if (required && !value?.trim()) return { valid: false, message: 'Ce champ est requis' };
    if (minLength && (value?.trim().length || 0) < minLength)
      return { valid: false, message: `Minimum ${minLength} caractères` };
    if (maxLength && (value?.length || 0) > maxLength)
      return { valid: false, message: `Maximum ${maxLength} caractères` };
    return { valid: true, message: '' };
  }, [validation, required, value, minLength, maxLength]);

  const isValid = computedValidation?.valid ?? true;
  const showError = interacted && !isValid;

  const statusClass = showError
    ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500/30'
    : value && isValid
      ? 'border-green-500 focus:border-green-500 focus:ring-green-500/30'
      : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600/20';

  // ⭐ forcer l’astérisque sur label externe si label interne absent
  const forceExternalStar = required && (!label || label.trim() === '');

  return (
    <div className={`form-group ${className}`}>
      {/* Label interne optionnel */}
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-gray-900 mb-1 inline-flex items-center"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      ) : null}

      <textarea
        id={inputId}
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={() => setInteracted(true)}
        onFocus={() => setInteracted(true)}
        rows={rows}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        aria-invalid={showError ? true : undefined}
        aria-describedby={[helpText ? helpId : null, showError ? errorId : null]
          .filter(Boolean)
          .join(' ')}
        className={[
          'block w-full rounded-lg border-2 px-3 py-2 text-sm transition-all',
          'focus:outline-none focus:ring-2',
          statusClass,
        ].join(' ')}
      />

      <div className="mt-1 flex items-center justify-between">
        {helpText ? (
          <p id={helpId} className="text-xs text-gray-500">
            {helpText}
          </p>
        ) : (
          <span />
        )}
        <p className="text-xs text-gray-400">
          {value?.length || 0}/{maxLength}
        </p>
      </div>

      {showError && (
        <p id={errorId} role="alert" className="mt-1 text-sm font-medium text-orange-600">
          {computedValidation?.message}
        </p>
      )}

      {/* ⭐ Injection CSS - astérisque sur label externe matchant cet id */}
      {forceExternalStar && (
        <style>{`label[for="${inputId}"]::after{content:" *";margin-left:0.25rem;color:#ef4444;}`}</style>
      )}
    </div>
  );
};

export default TextAreaField;
