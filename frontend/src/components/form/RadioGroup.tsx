// src/components/form/RadioGroup.tsx - Version mobile-first optimisée
'use client';

import clsx from 'clsx';
import {motion} from 'framer-motion';
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
 * Optimisé pour mobile avec touch targets >= 44px et proportions adaptées
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
        <div className={clsx('space-y-2.5 md:space-y-3', className)} role="radiogroup">
            {options.map((option, index) => {
                const isSelected = value === option.value;
                const isDisabled = disabled || option.disabled;
                const optionId = `${name}-${option.value}`;

                return (
                    <motion.label
                        key={option.value}
                        htmlFor={optionId}
                        onClick={e => {
                            // FIX: Gérer le clic directement pour permettre la re-sélection
                            e.preventDefault();
                            if (!isDisabled) {
                                onChange(option.value);
                            }
                        }}
                        className={clsx(
                            'group relative flex items-start cursor-pointer transition-all duration-200',
                            {
                                // Variants de style - PROPORTIONS MOBILE OPTIMISÉES
                                'p-3.5 md:p-4 border-2 rounded-xl md:rounded-xl min-h-[60px] md:min-h-[64px]':
                                    variant === 'card',
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
                        whileHover={!isDisabled ? {scale: 1.01} : undefined}
                        whileTap={!isDisabled ? {scale: 0.99} : undefined}
                    >
                        {/* Input radio masqué - garde la sémantique HTML */}
                        <input
                            ref={index === 0 ? inputRef : undefined}
                            type="radio"
                            id={optionId}
                            name={name}
                            value={option.value}
                            checked={isSelected}
                            onChange={() => {
                            }} // onChange vide pour éviter les warnings React
                            required={required}
                            disabled={isDisabled}
                            className="sr-only"
                            tabIndex={-1} // Le focus est géré par le label
                        />

                        {/* Icône optionnelle - TAILLE MOBILE OPTIMISÉE */}
                        {option.icon && (
                            <div
                                className={clsx('flex-shrink-0 mr-2.5 md:mr-3 mt-0.5 transition-colors', {
                                    'text-blue-600': isSelected,
                                    'text-gray-400 group-hover:text-gray-600': !isSelected && !isDisabled,
                                    'text-gray-300': isDisabled,
                                })}
                            >
                                {option.icon}
                            </div>
                        )}

                        {/* Contenu - TYPOGRAPHIE MOBILE OPTIMISÉE */}
                        <div className="flex-1 min-w-0">
                            <div
                                className={clsx(
                                    'font-medium transition-colors leading-tight text-sm md:text-base',
                                    {
                                        'text-blue-900': isSelected,
                                        'text-gray-900 group-hover:text-gray-700': !isSelected && !isDisabled,
                                        'text-gray-400': isDisabled,
                                    },
                                )}
                            >
                                {option.label}
                            </div>

                            {option.description && (
                                <div
                                    className={clsx('text-xs md:text-sm leading-relaxed mt-1 transition-colors', {
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
                                initial={{opacity: 0, scale: 0.8}}
                                animate={{opacity: 1, scale: 1}}
                                transition={{duration: 0.2}}
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
