// frontend/src/components/form/FormField.tsx - Fix markInteracted

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
  validation?: {
    markInteracted?: (field: string) => void;
    validateField?: (value: any, rules: any) => { valid: boolean; message: string };
    isInteracted?: (field: string) => boolean;
  };
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
      isSlowConnection ? 800 : 400,
    ),
    [required, type, isSlowConnection],
  );

  return validateField; // ✅ Ne retourne que validateField
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
    validation, // ✅ Récupérer validation depuis les props
  }) => {
    const { isMobile } = useMobileOptimization();
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null);

    // ✅ CORRECTION : Récupérer validateField depuis useRealtimeValidation
    const validateField = useRealtimeValidation(value, required, type);

    // ✅ CORRECTION : Récupérer markInteracted depuis les props de validation
    const markInteracted = validation?.markInteracted;

    // Handler optimisé pour les changements
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const newValue = e.target.value;
        onChange(newValue);

        // Marquer comme interagi si la fonction existe
        if (markInteracted) {
          markInteracted(name);
        }

        // Validation en temps réel
        if (newValue.trim()) {
          validateField(newValue);
        }
      },
      [onChange, validateField, markInteracted, name],
    );

    // Handler optimisé pour le blur
    const handleBlur = useCallback(() => {
      // ✅ CORRECTION : Vérifier que markInteracted existe
      if (markInteracted) {
        markInteracted(name);
      }

      validateField(value);
      onBlur?.();
    }, [value, validateField, onBlur, markInteracted, name]);

    // Optimisation pour mobile
    const inputProps = {
      ref: inputRef,
      id: name,
      name,
      value,
      onChange: handleChange,
      onBlur: handleBlur,
      placeholder,
      disabled,
      maxLength,
      autoComplete,
      ...(isMobile && { autoCapitalize: 'none', autoCorrect: 'off' }),
    };

    // Rendu du champ selon le type
    const renderInput = () => {
      if (type === 'textarea') {
        return (
          <textarea
            {...inputProps}
            rows={4}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${className}`}
          />
        );
      }

      if (type === 'select' && options) {
        return (
          <select
            {...inputProps}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
          >
            <option value="">Sélectionnez...</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }

      return (
        <input
          {...inputProps}
          type={type}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
        />
      );
    };

    return (
      <div className="space-y-2">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {renderInput()}

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {helpText && !error && <p className="text-sm text-gray-500">{helpText}</p>}
      </div>
    );
  },
);

FormField.displayName = 'FormField';

export default FormField;
