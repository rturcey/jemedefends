// frontend/src/components/form/FormField.tsx
'use client';

import React, {useId, useMemo, useState} from 'react';

import type {ValidationResult} from '@/types/form';

interface FormFieldProps {
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    type?: 'text' | 'email' | 'tel' | 'date' | 'number';
    required?: boolean;
    placeholder?: string;
    helpText?: string;
    disabled?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    inputMode?: 'text' | 'decimal' | 'numeric' | 'tel' | 'email' | 'url';
    autoComplete?: string;
    className?: string;
    validation?: ValidationResult;
    endAdornment?: React.ReactNode;
    openPickerOnClick?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
                                                 name,
                                                 label,
                                                 value,
                                                 onChange,
                                                 onBlur,
                                                 type = 'text',
                                                 required = false,
                                                 placeholder,
                                                 helpText,
                                                 disabled = false,
                                                 maxLength,
                                                 minLength,
                                                 pattern,
                                                 inputMode,
                                                 autoComplete,
                                                 className = '',
                                                 validation,
                                                 endAdornment,
                                                 openPickerOnClick = false,
                                             }) => {
    const reactId = useId();
    const inputId = `${name}-${reactId}`;
    const helpId = `${name}-help-${reactId}`;
    const errorId = `${name}-error-${reactId}`;

    // État d'interaction local
    const [interacted, setInteracted] = useState(false);

    // Calcul de la validation (utilisé la prop validation ou validation locale)
    const computedValidation: ValidationResult | undefined = useMemo(() => {
        // Si une validation externe est fournie, l'utiliser en priorité
        if (validation) return validation;

        // Sinon, validation locale de base
        if (required && !value?.trim()) {
            return {valid: false, message: 'Ce champ est requis'};
        }

        if (minLength && value && value.length < minLength) {
            return {valid: false, message: `Minimum ${minLength} caractères`};
        }

        if (maxLength && value && value.length > maxLength) {
            return {valid: false, message: `Maximum ${maxLength} caractères`};
        }

        // Validation du pattern si fourni
        if (pattern && value) {
            const regex = new RegExp(pattern);
            if (!regex.test(value)) {
                // Messages d'erreur spécifiques selon le type de champ
                if (type === 'email') {
                    return {valid: false, message: 'Format email invalide'};
                }
                if (name.includes('price') || name.includes('prix')) {
                    return {valid: false, message: 'Format prix invalide (ex: 899.99)'};
                }
                if (name.includes('postal') || name.includes('code')) {
                    return {valid: false, message: 'Code postal invalide'};
                }
                return {valid: false, message: 'Format invalide'};
            }
        }

        // Validation email native
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return {valid: false, message: 'Format email invalide'};
            }
        }

        return {valid: true, message: ''};
    }, [validation, required, value, minLength, maxLength, pattern, type, name]);

    const isValid = computedValidation?.valid ?? true;

    // N'afficher l'erreur que si l'utilisateur a interagi avec le champ
    const showError = interacted && !isValid;

    // Classe de statut pour la bordure
    const statusClass = showError
        ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500/30 bg-orange-50/30'
        : value && isValid
            ? 'border-green-500 focus:border-green-500 focus:ring-green-500/30'
            : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600/20';

    // Gérer le changement
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    // Gérer le blur
    const handleBlur = () => {
        setInteracted(true);
        onBlur?.();
    };

    // Gérer le focus (pour marquer comme interacté)
    const handleFocus = () => {
        setInteracted(true);
    };

    // Pour les champs date, ouvrir le picker au clic
    const handleClick = () => {
        if (openPickerOnClick && type === 'date') {
            const input = document.getElementById(inputId) as HTMLInputElement;
            input?.showPicker?.();
        }
    };

    return (
        <div className={`form-group ${className}`}>
            {/* Label */}
            <label
                htmlFor={inputId}
                className="block text-sm font-semibold text-gray-900 mb-1"
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            {/* Wrapper pour input + endAdornment */}
            <div className="relative">
                <input
                    id={inputId}
                    name={name}
                    type={type}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    onClick={handleClick}
                    placeholder={placeholder}
                    disabled={disabled}
                    maxLength={maxLength}
                    minLength={minLength}
                    pattern={pattern}
                    inputMode={inputMode}
                    autoComplete={autoComplete}
                    aria-invalid={showError ? true : undefined}
                    aria-describedby={[
                        helpText ? helpId : null,
                        showError ? errorId : null,
                    ]
                        .filter(Boolean)
                        .join(' ')}
                    className={[
                        'block w-full rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all',
                        'focus:outline-none focus:ring-2',
                        'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                        endAdornment ? 'pr-12' : '',
                        statusClass,
                    ].join(' ')}
                />

                {/* Adornement de fin (ex: icône €) */}
                {endAdornment && (
                    <div
                        className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        {endAdornment}
                    </div>
                )}
            </div>

            {/* Texte d'aide ou message d'erreur */}
            <div className="mt-1">
                {showError ? (
                    <p id={errorId} role="alert"
                       className="text-sm font-medium text-orange-600">
                        {computedValidation?.message}
                    </p>
                ) : helpText ? (
                    <p id={helpId} className="text-xs text-gray-500">
                        {helpText}
                    </p>
                ) : null}
            </div>
        </div>
    );
};

export default FormField;