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

const RadioGroup = ({ name, legend, value, onChange, options, required, validation }) => {
  const isValid = validation?.valid;
  const message = validation?.message || '';

  return (
    <fieldset className="form-field">
      <legend className="block text-sm font-semibold text-gray-900 mb-3">
        {legend}
        {required && <span className="text-red-500 ml-1">*</span>}
      </legend>

      <div className="space-y-3">
        {options.map(option => (
          <label
            key={option.value}
            className={`
              flex items-start gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all
              ${
                value === option.value
                  ? 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20'
                  : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
              }
            `}
          >
            <div className="flex items-center h-5">
              <div
                className={`
                w-4 h-4 rounded-full border-2 flex items-center justify-center
                ${value === option.value ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
              `}
              >
                {value === option.value && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">{option.label}</div>
              {option.description && (
                <div className="text-xs text-gray-600 mt-1">{option.description}</div>
              )}
            </div>
          </label>
        ))}
      </div>

      {isValid === false && message && <p className="text-orange-600 text-xs mt-2">{message}</p>}
    </fieldset>
  );
};

export default RadioGroup;
