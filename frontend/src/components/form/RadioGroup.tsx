'use client';

import * as React from 'react';
import clsx from 'clsx';

type Option = {
  value: string;
  label: string;
  description?: string;
};

export default function RadioGroup({
  name,
  options,
  onChange,
  required,
  label,
  className,
  inputRef,
  showAsterisk = true, // ⟵ NEW: étoile masquée par défaut
}: {
  name: string;
  options: Option[];
  onChange: (value: string) => void;
  required?: boolean;
  label?: string;
  className?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  showAsterisk?: boolean;
}) {
  return (
    <fieldset className={clsx('space-y-3', className)}>
      {label && (
        <legend className="block text-sm font-medium text-gray-900 mb-2">
          {label}
          {required && showAsterisk ? (
            <span className="ml-1 text-rose-500" aria-hidden="true">
              *
            </span>
          ) : null}
        </legend>
      )}

      <div className="space-y-2">
        {options.map((opt, i) => (
          <label
            key={opt.value}
            className={clsx(
              'flex items-start gap-3 rounded-xl border border-gray-300 bg-white p-3 cursor-pointer hover:border-gray-400'
            )}
          >
            <input
              ref={i === 0 ? (inputRef as any) : undefined}
              type="radio"
              name={name}
              value={opt.value}
              required={required}
              aria-required={required || undefined}
              className="mt-1 h-4 w-4"
              onChange={e => e.target.checked && onChange(opt.value)}
            />
            <span>
              <span className="block text-sm font-medium text-gray-900">{opt.label}</span>
              {opt.description ? (
                <span className="block text-xs text-gray-600">{opt.description}</span>
              ) : null}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
