// src/components/form/RadioGroup.tsx - Version harmonisée mobile-first
'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import * as React from 'react';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  inputRef?: React.RefObject<HTMLInputElement>;
  variant?: 'default' | 'compact' | 'card';
}

/**
 * RadioGroup harmonisé avec design moderne et interactions fluides
 * Optimisé pour mobile avec touch targets >= 44px
 */
const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  required = false,
  disabled = false,
  className = '',
  inputRef,
  variant = 'card',
}) => {
  return (
    <div className={clsx('space-y-3', className)} role="radiogroup">
      {options.map((option, index) => {
        const isSelected = value === option.value;
        const isDisabled = disabled || option.disabled;
        const optionId = `${name}-${option.value}`;

        return (
          <motion.label
            key={option.value}
            htmlFor={optionId}
            className={clsx(
              'group relative flex items-start cursor-pointer transition-all duration-200',
              {
                // Variants de style
                'p-4 border-2 rounded-xl': variant === 'card',
                'p-3 border rounded-lg': variant === 'default',
                'p-2 border rounded-md': variant === 'compact',

                // États de sélection
                'border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-200':
                  isSelected && variant === 'card',
                'border-blue-500 bg-blue-50': isSelected && variant !== 'card',
                'border-gray-200 hover:border-gray-300 hover:bg-gray-50':
                  !isSelected && !isDisabled,
                'border-gray-100 bg-gray-50 cursor-not-allowed': isDisabled,
              },
            )}
            whileHover={!isDisabled ? { scale: 1.01 } : undefined}
            whileTap={!isDisabled ? { scale: 0.99 } : undefined}
          >
            {/* Input radio masqué */}
            <input
              ref={index === 0 ? inputRef : undefined}
              type="radio"
              id={optionId}
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={e => !isDisabled && onChange(e.target.value)}
              required={required}
              disabled={isDisabled}
              className="sr-only"
            />

            {/* Indicateur radio personnalisé */}
            <div className="relative flex-shrink-0 mr-3 mt-0.5">
              <div
                className={clsx(
                  'w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center',
                  {
                    'border-blue-500 bg-blue-500': isSelected,
                    'border-gray-300 bg-white group-hover:border-gray-400':
                      !isSelected && !isDisabled,
                    'border-gray-200 bg-gray-100': isDisabled,
                  },
                )}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                )}
              </div>
            </div>

            {/* Icône optionnelle */}
            {option.icon && (
              <div
                className={clsx('flex-shrink-0 mr-3 mt-0.5 transition-colors', {
                  'text-blue-600': isSelected,
                  'text-gray-400 group-hover:text-gray-600': !isSelected && !isDisabled,
                  'text-gray-300': isDisabled,
                })}
              >
                {option.icon}
              </div>
            )}

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <div
                className={clsx('font-medium transition-colors leading-tight', {
                  'text-blue-900': isSelected,
                  'text-gray-900 group-hover:text-gray-700': !isSelected && !isDisabled,
                  'text-gray-400': isDisabled,
                })}
              >
                {option.label}
              </div>

              {option.description && (
                <div
                  className={clsx('text-sm leading-relaxed mt-1 transition-colors', {
                    'text-blue-700': isSelected,
                    'text-gray-600': !isSelected && !isDisabled,
                    'text-gray-400': isDisabled,
                  })}
                >
                  {option.description}
                </div>
              )}
            </div>

            {/* Indicateur de sélection - Ring effect sur mobile */}
            {isSelected && variant === 'card' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 pointer-events-none rounded-xl ring-2 ring-blue-400/20"
              />
            )}
          </motion.label>
        );
      })}
    </div>
  );
};

export default RadioGroup;
