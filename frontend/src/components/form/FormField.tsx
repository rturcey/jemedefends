// src/components/form/FormField.tsx
'use client';

import React, { memo, useCallback, useRef } from 'react';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { debounce } from '@/lib/performance';

interface FormFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: 'text' | 'email' | 'tel' | 'date' | 'number' | 'textarea' | 'select';
  required?: boolean;
  placeholder?: string;
  helpText?: string;
  error?: string;
  disabled?: boolean;
  maxLength?: number;
  minLength?: number;
  options?: Array<{ value: string; label: string }>;
  autoComplete?: string;
  className?: string;
}

// Validation en temps réel optimisée
const useRealtimeValidation = (value: string, required: boolean, type: string) => {
  const { isSlowConnection } = useMobileOptimization();

  const validateField = useCallback(
    debounce(
      (val: string): string | null => {
        if (required && !val.trim()) {
          return 'Ce champ est requis';
        }

        if (type === 'email' && val.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) {
            return 'Format email invalide';
          }
        }

        if (type === 'tel' && val.trim()) {
          const phoneRegex = /^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/;
          if (!phoneRegex.test(val.replace(/\s/g, ''))) {
            return 'Format téléphone invalide';
          }
        }

        return null;
      },
      isSlowConnection ? 800 : 400
    ),
    [required, type, isSlowConnection]
  );

  return validateField;
};

const FormField = memo<FormFieldProps>(
  ({
    name,
    label,
    value,
    onChange,
    onBlur,
    type = 'text',
    required = false,
    placeholder,
    helpText,
    error,
    disabled = false,
    maxLength,
    minLength,
    options,
    autoComplete,
    className = '',
  }) => {
    const { isMobile } = useMobileOptimization();
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);
    const { validateField, markInteracted } = useRealtimeValidation(
      value,
      required,
      type,
      undefined,
      name
    );

    // Handler optimisé pour les changements
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const newValue = e.target.value;
        onChange(newValue);

        // Marquer comme interagi
        markInteracted();

        // Validation en temps réel
        if (newValue.trim()) {
          validateField(newValue);
        }
      },
      [onChange, validateField, markInteracted]
    );

    // Handler optimisé pour le blur
    const handleBlur = useCallback(() => {
      markInteracted();
      validateField(value);
      onBlur?.();
    }, [value, validateField, onBlur, markInteracted]);

    // Props communes optimisées pour mobile
    const commonProps = {
      id: name,
      name,
      value,
      onChange: handleChange,
      onBlur: handleBlur,
      disabled,
      required,
      maxLength,
      autoComplete,
      'aria-invalid': !!error,
      'aria-describedby': error ? `${name}-error` : helpText ? `${name}-help` : undefined,
      className: `
      w-full px-4 py-3 border rounded-lg transition-all duration-200
      bg-white border-gray-300 
      focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none
      disabled:bg-gray-100 disabled:cursor-not-allowed
      ${error ? 'border-red-500 bg-red-50' : ''}
      ${isMobile ? 'text-base' : 'text-sm'}
      min-h-[44px] touch-manipulation
    `,
    };

    // Rendu conditionnel selon le type
    const renderInput = () => {
      switch (type) {
        case 'textarea':
          return (
            <textarea
              {...commonProps}
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              placeholder={placeholder}
              rows={4}
              style={{ resize: 'vertical', minHeight: isMobile ? '120px' : '100px' }}
            />
          );

        case 'select':
          return (
            <select {...commonProps} ref={inputRef as React.RefObject<HTMLSelectElement>}>
              <option value="" disabled>
                {placeholder || 'Sélectionnez une option'}
              </option>
              {options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );

        default:
          return (
            <input
              {...commonProps}
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type={type}
              placeholder={placeholder}
              minLength={minLength}
              // Optimisations iOS pour éviter le zoom
              style={isMobile && type === 'text' ? { fontSize: '16px' } : undefined}
            />
          );
      }
    };

    return (
      <div className={`form-field space-y-2 ${className}`}>
        {/* Label */}
        <label
          htmlFor={name}
          className={`
          block font-semibold text-gray-700
          ${isMobile ? 'text-base' : 'text-sm'}
        `}
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="obligatoire">
              *
            </span>
          )}
        </label>

        {/* Input/Textarea/Select */}
        {renderInput()}

        {/* Texte d'aide */}
        {helpText && !error && (
          <p id={`${name}-help`} className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-xs'}`}>
            {helpText}
          </p>
        )}

        {/* Message d'erreur */}
        {error && (
          <div
            id={`${name}-error`}
            className={`
            text-red-600 font-medium flex items-start gap-2
            ${isMobile ? 'text-sm' : 'text-xs'}
          `}
            role="alert"
            aria-live="polite"
          >
            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
