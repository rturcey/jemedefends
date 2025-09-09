'use client';

import React from 'react';

import FormField from '@/components/form/FormField';
import RadioGroup from '@/components/form/RadioGroup';
import { gatedValidation } from '@/lib/validation';
import type { StepProps } from '@/types/form';

const PurchaseInfoStep: React.FC<StepProps> = ({
  data,
  validation,
  onFieldChange,
  onNext,
  onPrev,
}) => {
  const d = (data ?? {}) as Record<string, any>;

  const conditionOptions = [
    { value: 'new', label: 'Neuf', description: 'Produit livré à l’état neuf' },
    { value: 'used', label: 'Occasion', description: 'Produit d’occasion / reconditionné' },
  ];

  // Prix : autoriser chiffres + virgule/point → on stocke avec un point
  const onPriceChange = (v: string) => {
    const normalized = v.replace(',', '.');
    onFieldChange('product_price', normalized);
    validation?.markInteracted?.('product_price');
  };

  const canContinue =
    (validation?.validateStep?.('purchase_info', d) ??
      Boolean(d.product_name && d.purchase_date && d.product_price && d.product_condition)) ===
    true;

  return (
    <section className="step-section p-0" role="tabpanel" aria-labelledby="purchase-title">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow">
          <svg
            className="w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M7 4h10l1 4h3v2h-2l-2 9H8L6 10H4V8h3l1-4Zm2.2 4h5.6l-.5-2H9.7l-.5 2Z" />
          </svg>
        </div>
        <div>
          <h2 id="purchase-title" className="text-lg md:text-xl font-bold text-gray-900">
            Informations d’achat
          </h2>
          <p className="text-sm text-gray-600">Précisez le produit et la date d’achat.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Produit */}
        <FormField
          name="product_name"
          label="Produit"
          value={d.product_name || ''}
          onChange={v => onFieldChange('product_name', v)}
          onBlur={() => validation?.markInteracted?.('product_name')}
          required
          minLength={2}
          maxLength={120}
          placeholder="Ex : Smartphone XYZ Pro 256 Go"
          helpText="Votre produit tel qu’il apparaît sur la facture"
          validation={gatedValidation(
            'product_name',
            d.product_name || '',
            validation?.getFieldRules?.('product_name', {
              required: true,
              minLength: 2,
              maxLength: 120,
            }),
            validation?.validateField,
            validation?.isInteracted,
          )}
        />

        {/* Date d’achat */}
        <FormField
          name="purchase_date"
          label="Date d’achat"
          type="date"
          value={d.purchase_date || ''}
          onChange={v => onFieldChange('purchase_date', v)}
          onBlur={() => validation?.markInteracted?.('purchase_date')}
          required
          openPickerOnClick
          validation={gatedValidation(
            'purchase_date',
            d.purchase_date || '',
            validation?.getFieldRules?.('purchase_date', { required: true }),
            validation?.validateField,
            validation?.isInteracted,
          )}
        />

        {/* Prix payé (2 décimales max) */}
        <FormField
          name="product_price"
          label="Prix payé"
          value={d.product_price || ''}
          onChange={onPriceChange}
          onBlur={() => validation?.markInteracted?.('product_price')}
          inputMode="decimal"
          placeholder="Ex : 899,99"
          endAdornment={<span className="text-gray-500 font-medium">€</span>}
          required
          pattern="^\d+([.,]\d{1,2})?$"
          validation={gatedValidation(
            'product_price',
            d.product_price || '',
            validation?.getFieldRules?.('product_price', {
              required: true,
              pattern: '^\\d+(?:[.,]\\d{1,2})?$',
              maxLength: 12,
            }),
            validation?.validateField,
            validation?.isInteracted,
          )}
          helpText="Utilisez une virgule ou un point (ex. 149,90)."
        />
        <FormField
          name="order_reference"
          label="Référence"
          value={d.product_name || ''}
          onChange={v => onFieldChange('order_reference', v)}
          onBlur={() => validation?.markInteracted?.('order_reference')}
          minLength={2}
          maxLength={120}
          placeholder="Ex : 2025-45678-XX"
          helpText="Le référence de facture ou de commande."
          validation={gatedValidation(
            'order_reference',
            d.product_name || '',
            validation?.getFieldRules?.('order_reference', {
              required: true,
              minLength: 2,
              maxLength: 120,
            }),
            validation?.validateField,
            validation?.isInteracted,
          )}
        />

        {/* État du produit */}
        <RadioGroup
          name="product_condition"
          legend="État du produit"
          value={d.product_condition}
          onChange={value => {
            onFieldChange('product_condition', value);
            validation?.markInteracted?.('product_condition');
          }}
          options={conditionOptions}
          required
          validation={gatedValidation(
            'product_condition',
            d.product_condition || '',
            validation?.getFieldRules?.('product_condition', { required: true }),
            validation?.validateField,
            validation?.isInteracted,
          )}
        />
      </div>

      {/* Navigation desktop / tablette (cachée sur mobile) */}
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
          Continuer vers le problème →
        </button>
      </div>
    </section>
  );
};

export default PurchaseInfoStep;
