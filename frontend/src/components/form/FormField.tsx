'use client';

import React, { useRef } from 'react';
import { statusClass } from '@/lib/statusClass';
type ValidationShape = { valid?: boolean; message?: string } | boolean | undefined;

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  helpText?: string;
  validation?: ValidationShape; // si absent => neutre (pas d’orange/vert)
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  openPickerOnClick?: boolean; // ← NEW pour les dates
};

export default function FormField({
  name,
  label,
  value,
  onChange,
  helpText,
  validation,
  startAdornment,
  endAdornment,
  className,
  type = 'text',
  openPickerOnClick = false,
  required, // ← AJOUT ICI
  ...rest
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const v =
    typeof validation === 'boolean' ? { valid: validation, message: '' } : validation || undefined;

  const hasValidation = v !== undefined;
  const isValid = hasValidation ? !!v!.valid : undefined; // undefined => neutre
  const message = hasValidation ? (v as any)?.message || '' : '';

  const base =
    'block w-full rounded-lg border px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const paddings = [startAdornment ? 'pl-10' : '', endAdornment ? 'pr-10' : ''].join(' ');
  const color =
    isValid === true
      ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
      : isValid === false
        ? 'border-orange-500 focus:border-orange-500 focus:ring-orange-500'
        : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600';

  const handleClick = (e: React.MouseEvent) => {
    if (!openPickerOnClick) return;
    const el = inputRef.current;
    if (!el) return;
    // Ouvre le datepicker natif si dispo (Chrome/Edge/Safari iOS)
    // @ts-ignore
    if (typeof el.showPicker === 'function') {
      // @ts-ignore
      el.showPicker();
    } else {
      el.focus();
    }
  };

  return (
    <div className="form-field">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-900 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="relative" onClick={handleClick}>
        {startAdornment && (
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-500">
            {startAdornment}
          </div>
        )}

        <input
          ref={inputRef}
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          aria-invalid={hasValidation && isValid === false ? true : undefined}
          className={[
            statusClass(isValid === true ? 'valid' : isValid === false ? 'invalid' : 'default'),
            startAdornment ? 'pl-10' : '',
            endAdornment ? 'pr-10' : '',
            className || '',
          ].join(' ')}
          {...rest}
        />

        {endAdornment && (
          <div className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">
            {endAdornment}
          </div>
        )}
      </div>

      <div className="mt-1 min-h-[1.25rem] text-xs">
        {hasValidation && isValid === false && message ? (
          <p className="text-orange-600">{message}</p>
        ) : helpText ? (
          <p className="text-gray-500">{helpText}</p>
        ) : null}
      </div>
    </div>
  );
}
