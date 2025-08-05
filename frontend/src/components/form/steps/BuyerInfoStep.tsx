'use client';

import React from 'react';
import FormField from '@/components/form/FormField';
import AddressInput from '@/components/form/AddressInput';
import { gatedValidation } from '@/lib/fieldValidation';
import { normalizeName } from '@/lib/normalizeName';
import { StepProps } from '@/types/form';

const BuyerInfoStep: React.FC<StepProps> = ({ data, validation, onFieldChange, onNext }) => {
  const d = (data ?? {}) as Record<string, any>;

  const canContinue =
    (validation?.validateStep?.('buyer_info', d) ??
      Boolean(d.buyer_name && d.buyer_address_line_1 && d.buyer_postal_code && d.buyer_city)) ===
    true;

  return (
    <section className="step-section p-0" role="tabpanel" aria-labelledby="buyer-title">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow">
          <svg
            className="w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 12a4 4 0 100-8 4 4 0 000 8Zm0 2c-3 0-9 1.5-9 4v2h18v-2c0-2.5-6-4-9-4Z" />
          </svg>
        </div>
        <div>
          <h2 id="buyer-title" className="text-lg md:text-xl font-bold text-gray-900">
            Vos informations
          </h2>
          <p className="text-sm text-gray-600">Ces informations apparaîtront sur votre lettre.</p>
        </div>
      </div>

      <div className="space-y-6">
        <FormField
          name="buyer_name"
          label="Prénom et nom"
          value={d.buyer_name || ''}
          onChange={v => onFieldChange('buyer_name', v)}
          onBlur={() => {
            validation?.markInteracted?.('buyer_name');
            const v = (d.buyer_name || '').trim();
            if (v) onFieldChange('buyer_name', normalizeName(v));
          }}
          required
          minLength={2}
          maxLength={100}
          placeholder="Ex : Jean Dupont"
          helpText="Votre prénom et nom tels qu'ils apparaîtront sur la lettre"
          validation={gatedValidation(
            'buyer_name',
            d.buyer_name || '',
            validation?.getFieldRules?.('buyer_name', {
              required: true,
              minLength: 2,
              maxLength: 100,
            }),
            validation?.validateField,
            validation?.isInteracted
          )}
        />

        <AddressInput prefix="buyer" data={d} onChange={onFieldChange} validation={validation} />

        <FormField
          name="buyer_email"
          label="Email"
          type="email"
          value={d.buyer_email || ''}
          onChange={v => onFieldChange('buyer_email', v)}
          onBlur={() => validation?.markInteracted?.('buyer_email')}
          // surtout pas "required" ici
          maxLength={255}
          placeholder="jean.dupont@email.com"
          helpText="Pour recevoir une copie de votre lettre (facultatif)"
          validation={gatedValidation(
            'buyer_email',
            d.buyer_email || '',
            validation?.getFieldRules?.('buyer_email', {
              required: false,
              type: 'email',
              maxLength: 255,
            }),
            validation?.validateField,
            validation?.isInteracted
          )}
        />
      </div>

      {/* Boutons desktop/tablette uniquement (sur mobile, on garde la nav mobile) */}
      <div className="hidden sm:flex justify-end mt-8">
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Continuer vers le vendeur →
        </button>
      </div>
    </section>
  );
};

export default BuyerInfoStep;
