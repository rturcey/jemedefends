// frontend/src/components/form/steps/PurchaseInfoStep.tsx
'use client';

import React from 'react';

import FormField from '@/components/form/FormField';
import RadioGroup from '@/components/form/RadioGroup';
import { gatedValidation, validatePrice, validateDate } from '@/lib/validation';
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
    { value: 'new', label: 'Neuf', description: "Produit livré à l'état neuf" },
    {
      value: 'used',
      label: 'Occasion / reconditionné',
      description: "Produit d'occasion / reconditionné",
    },
  ];

  // ✅ Normalisation du prix : remplace virgule par point
  const onPriceChange = (v: string) => {
    // Autoriser uniquement chiffres, point et virgule pendant la saisie
    const cleaned = v.replace(/[^\d.,]/g, '');
    onFieldChange('product_price', cleaned);
    validation?.markInteracted?.('product_price');
  };

  // ✅ Validation stricte des champs avant de continuer
  const canContinue = React.useMemo(() => {
    // Vérifier que tous les champs requis sont remplis
    if (!d.product_name?.trim()) return false;
    if (!d.purchase_date?.trim()) return false;
    if (!d.product_price?.trim()) return false;
    if (!d.product_condition?.trim()) return false;
    if (!d.order_reference?.trim()) return false;

    // ✅ Validation stricte du prix
    const priceValidation = validatePrice(d.product_price || '');
    if (!priceValidation.valid) return false;

    // ✅ Validation stricte de la date
    const dateValidation = validateDate(d.purchase_date || '');
    if (!dateValidation.valid) return false;

    // ✅ Validation de la longueur des champs texte
    if ((d.product_name?.trim().length || 0) < 2) return false;
    if ((d.order_reference?.trim().length || 0) < 2) return false;

    return true;
  }, [d]);

  // Handler pour le bouton continuer
  const handleNext = () => {
    // Marquer tous les champs comme interactés pour afficher les erreurs
    validation?.markInteracted?.('product_name');
    validation?.markInteracted?.('purchase_date');
    validation?.markInteracted?.('product_price');
    validation?.markInteracted?.('order_reference');
    validation?.markInteracted?.('product_condition');

    // Ne continuer que si tout est valide
    if (canContinue) {
      onNext();
    }
  };

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
            Informations d'achat
          </h2>
          <p className="text-sm text-gray-600">Précisez le produit et la date d'achat.</p>
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
          helpText="Votre produit tel qu'il apparaît sur la facture"
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

        {/* Date d'achat + Prix (côte à côte sur desktop, empilés sur mobile) */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <FormField
              name="purchase_date"
              label="Date d'achat"
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
          </div>

          <div className="flex-1">
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
              pattern="^\d+(?:[.,]\d{1,2})?$"
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
            />
          </div>
        </div>

        <FormField
          name="order_reference"
          label="Référence"
          value={d.order_reference || ''}
          onChange={v => onFieldChange('order_reference', v)}
          onBlur={() => validation?.markInteracted?.('order_reference')}
          minLength={2}
          maxLength={120}
          placeholder="Ex : 2025-45678-XX"
          helpText="La référence de facture ou de commande."
          validation={gatedValidation(
            'order_reference',
            d.order_reference || '',
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
          className="bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-2xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          ← Retour
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!canContinue}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Continuer vers le problème →
        </button>
      </div>
    </section>
  );
};

export default PurchaseInfoStep;
