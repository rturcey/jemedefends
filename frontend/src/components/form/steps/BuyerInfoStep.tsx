'use client';

import React from 'react';

import AddressInput from '@/components/form/AddressInput';
import FormField from '@/components/form/FormField';
import {gatedValidation, normalizeName} from '@/lib/validation';
import type {StepProps} from '@/types/form';

const BuyerInfoStep: React.FC<StepProps> = ({
                                                data,
                                                validation,
                                                onFieldChange,
                                                onNext
                                            }) => {
    const d = (data ?? {}) as Record<string, any>;

    // Validation : seuls les champs requis (nom + adresse)
    const canContinue =
        (validation?.validateStep?.('buyer_info', d) ??
            Boolean(d.buyer_name && d.buyer_address_line_1 && d.buyer_postal_code && d.buyer_city)) ===
        true;

    return (
        <section className="step-section p-0" role="tabpanel"
                 aria-labelledby="buyer-title">
            <div className="flex items-center gap-3 mb-4">
                <div
                    className="p-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow">
                    <svg
                        className="w-6 h-6 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            d="M12 12a4 4 0 100-8 4 4 0 000 8Zm0 2c-3 0-9 1.5-9 4v2h18v-2c0-2.5-6-4-9-4Z"/>
                    </svg>
                </div>
                <div>
                    <h2 id="buyer-title"
                        className="text-lg md:text-xl font-bold text-gray-900">
                        Vos informations
                    </h2>
                    <p className="text-sm text-gray-600">Ces informations apparaîtront
                        sur votre lettre.</p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Nom complet */}
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
                        validation?.isInteracted,
                    )}
                />

                {/* Adresse complète */}
                <AddressInput prefix="buyer" data={d} onChange={onFieldChange}
                              validation={validation}/>

                {/* NOUVEAU : Message de réassurance avant email/phone */}
                <div
                    className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-gray-700">
                    <p className="flex items-start gap-2">
                        <svg
                            className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>
              <strong className="font-semibold text-blue-900">
                Vos coordonnées sont facultatives.
              </strong>
              <br/>
              Nous n'utiliserons jamais votre numéro de téléphone, et n'utiliserons votre mail que
              dans le cadre de votre litige.
            </span>
                    </p>
                </div>

                {/* Email et téléphone facultatifs en grille responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email facultatif */}
                    <FormField
                        name="buyer_email"
                        label="Email (facultatif)"
                        type="email"
                        value={d.buyer_email || ''}
                        onChange={v => onFieldChange('buyer_email', v)}
                        onBlur={() => validation?.markInteracted?.('buyer_email')}
                        placeholder="votre@email.com"
                        helpText="Apparaîtra dans la lettre si rempli"
                        validation={gatedValidation(
                            'buyer_email',
                            d.buyer_email || '',
                            validation?.getFieldRules?.('buyer_email', {
                                email: true,
                            }),
                            validation?.validateField,
                            validation?.isInteracted,
                        )}
                    />

                    {/* NOUVEAU : Téléphone facultatif */}
                    <FormField
                        name="buyer_phone"
                        label="Téléphone (facultatif)"
                        type="tel"
                        value={d.buyer_phone || ''}
                        onChange={v => onFieldChange('buyer_phone', v)}
                        onBlur={() => validation?.markInteracted?.('buyer_phone')}
                        placeholder="06 12 34 56 78"
                        helpText="Apparaîtra dans la lettre si rempli"
                        minLength={10}
                        maxLength={20}
                        validation={gatedValidation(
                            'buyer_phone',
                            d.buyer_phone || '',
                            validation?.getFieldRules?.('buyer_phone', {
                                minLength: 10,
                                maxLength: 20,
                            }),
                            validation?.validateField,
                            validation?.isInteracted,
                        )}
                    />
                </div>
            </div>

            {/* Navigation - cachée sur mobile (gérée par MobileNavigation) */}
            <div className="hidden sm:flex justify-end mt-8">
                <button
                    type="button"
                    onClick={onNext}
                    disabled={!canContinue}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Continuer vers le vendeur →
                </button>
            </div>
        </section>
    );
};

export default BuyerInfoStep;
