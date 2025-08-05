'use client';

import React from 'react';
import FormField from '@/components/form/FormField';
import AddressInput from '@/components/form/AddressInput';
import { gatedValidation } from '@/lib/fieldValidation';
import { normalizeName } from '@/lib/normalizeName';
import { StepProps } from '@/types/form';

const SellerInfoStep: React.FC<StepProps> = ({
  data,
  validation,
  onFieldChange,
  onNext,
  onPrev,
}) => {
  const d = (data ?? {}) as Record<string, any>;

  const canContinue =
    (validation?.validateStep?.('seller_info', d) ??
      Boolean(
        d.seller_name && d.seller_address_line_1 && d.seller_postal_code && d.seller_city
      )) === true;

  return (
    <section className="step-section p-0" role="tabpanel" aria-labelledby="seller-title">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl shadow">
          <svg
            className="w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M3 4h18v2H3V4zm2 4h14v12H5V8zm4 2v8h6v-8H9z" />
          </svg>
        </div>
        <div>
          <h2 id="seller-title" className="text-lg md:text-xl font-bold text-gray-900">
            Informations du vendeur
          </h2>
          <p className="text-sm text-gray-600">
            La personne ou société qui vous a vendu le produit.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <FormField
          name="seller_name"
          label="Nom du vendeur"
          value={d.seller_name || ''}
          onChange={v => onFieldChange('seller_name', v)}
          onBlur={() => {
            validation?.markInteracted?.('seller_name');
            const v = (d.seller_name || '').trim();
            if (v) onFieldChange('seller_name', normalizeName(v));
          }}
          required
          minLength={2}
          maxLength={100}
          placeholder="Ex : Boutique Tech SARL ou Marie Martin"
          helpText="Nom de la personne ou de l'entreprise"
          validation={gatedValidation(
            'seller_name',
            d.seller_name || '',
            validation?.getFieldRules?.('seller_name', {
              required: true,
              minLength: 2,
              maxLength: 100,
            }),
            validation?.validateField,
            validation?.isInteracted
          )}
        />

        <AddressInput prefix="seller" data={d} onChange={onFieldChange} validation={validation} />
      </div>

      <div className="hidden sm:flex justify-between mt-8">
        <button
          type="button"
          onClick={onPrev}
          className="bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-2xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          ← Retour
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Continuer vers l’achat →
        </button>
      </div>
    </section>
  );
};

export default SellerInfoStep;
