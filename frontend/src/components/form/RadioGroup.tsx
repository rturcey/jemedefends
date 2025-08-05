'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { ValidationResult } from '@/types/form';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  name: string;
  legend?: string; // Optional pour l'eligibility (déjà dans QuestionCard)
  value?: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  required?: boolean;
  validation?: ValidationResult;
  layout?: 'grid' | 'stack'; // Flexibilité layout
  columns?: 1 | 2 | 3; // Nombre de colonnes
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  legend,
  value,
  onChange,
  options,
  required = false,
  validation,
  layout = 'grid',
  columns = 2,
  className = '',
}) => {
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleChange = (newValue: string) => {
    setHasInteracted(true);
    onChange(newValue);
  };

  const showError = hasInteracted && validation && !validation.valid;

  // Logique de layout flexible
  const getLayoutClass = () => {
    if (layout === 'stack') return 'space-y-2';

    // Layout grid responsive
    const colsMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    };
    return `grid ${colsMap[columns]} gap-2`;
  };

  const content = (
    <div className={cn('form-group', className)}>
      {legend && (
        <fieldset>
          <legend className="block text-sm font-bold mb-3 text-gray-700">
            {legend}
            {required && (
              <span className="text-red-500 ml-1" aria-label="obligatoire">
                *
              </span>
            )}
          </legend>
        </fieldset>
      )}

      <div className={getLayoutClass()}>
        {options.map(option => (
          <label
            key={option.value}
            className={cn(
              // Base styles (même logique que l'ancien OptionButton mais plus robuste)
              'group relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all cursor-pointer',
              'hover:shadow-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-1',
              // États actif/inactif
              value === option.value
                ? 'border-blue-600 bg-blue-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            {/* Input radio caché mais accessible */}
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => handleChange(option.value)}
              required={required}
              className="sr-only"
            />

            {/* Indicateur radio visuel */}
            <div
              className={cn(
                'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                value === option.value
                  ? 'border-blue-600 bg-blue-600'
                  : 'border-gray-300 bg-white group-hover:border-gray-400'
              )}
            >
              {value === option.value && <div className="h-2 w-2 rounded-full bg-white" />}
            </div>

            {/* Contenu */}
            <div className="min-w-0 flex-1">
              <div
                className={cn(
                  'font-medium transition-colors',
                  value === option.value ? 'text-blue-900' : 'text-gray-900'
                )}
              >
                {option.label}
              </div>
              {option.description && (
                <div
                  className={cn(
                    'mt-1 text-sm transition-colors',
                    value === option.value ? 'text-blue-700' : 'text-gray-600'
                  )}
                >
                  {option.description}
                </div>
              )}
            </div>
          </label>
        ))}
      </div>

      {showError && (
        <p
          className="error-message mt-2 text-red-600 text-sm font-medium animate-fade-in"
          role="alert"
        >
          {validation?.message}
        </p>
      )}
    </div>
  );

  // Si legend existe, wrapper dans fieldset, sinon juste le contenu
  return legend ? (
    <fieldset className={cn('form-group', className)}>
      <legend className="block text-sm font-bold mb-3 text-gray-700">
        {legend}
        {required && (
          <span className="text-red-500 ml-1" aria-label="obligatoire">
            *
          </span>
        )}
      </legend>
      <div className={getLayoutClass()}>
        {options.map(option => (
          <label
            key={option.value}
            className={cn(
              'group relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all cursor-pointer',
              'hover:shadow-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-1',
              value === option.value
                ? 'border-blue-600 bg-blue-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => handleChange(option.value)}
              required={required}
              className="sr-only"
            />

            <div
              className={cn(
                'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                value === option.value
                  ? 'border-blue-600 bg-blue-600'
                  : 'border-gray-300 bg-white group-hover:border-gray-400'
              )}
            >
              {value === option.value && <div className="h-2 w-2 rounded-full bg-white" />}
            </div>

            <div className="min-w-0 flex-1">
              <div
                className={cn(
                  'font-medium transition-colors',
                  value === option.value ? 'text-blue-900' : 'text-gray-900'
                )}
              >
                {option.label}
              </div>
              {option.description && (
                <div
                  className={cn(
                    'mt-1 text-sm transition-colors',
                    value === option.value ? 'text-blue-700' : 'text-gray-600'
                  )}
                >
                  {option.description}
                </div>
              )}
            </div>
          </label>
        ))}
      </div>

      {showError && (
        <p
          className="error-message mt-2 text-red-600 text-sm font-medium animate-fade-in"
          role="alert"
        >
          {validation?.message}
        </p>
      )}
    </fieldset>
  ) : (
    content
  );
};

export default RadioGroup;
