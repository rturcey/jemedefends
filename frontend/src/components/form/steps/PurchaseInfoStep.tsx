'use client';

import React, {useEffect, useMemo, useRef, useState} from 'react';

import FormField from '@/components/form/FormField';
import RadioGroup from '@/components/form/RadioGroup';
import {gatedValidation, validatePrice, validateDate} from '@/lib/validation';
import type {StepProps} from '@/types/form';
import {API_ENDPOINTS} from '@/types/api'; // importe tes endpoints centralisés

type NormalizeResponse = {
    declared_type: 'service' | 'bien';
    raw_name: string;
    product_name_formatted?: string | null;
    success: boolean;
    error?: string | null;
};

const PurchaseInfoStep: React.FC<StepProps> = ({
                                                   data,
                                                   validation,
                                                   onFieldChange,
                                                   onNext,
                                                   onPrev,
                                               }) => {
    const d = (data ?? {}) as Record<string, any>;

    const conditionOptions = [
        {
            value: 'digital',
            label: 'Service numérique',
            description: 'App, SaaS, streaming, abonnement, etc.',
        },
        {value: 'new', label: 'Neuf', description: "Bien livré à l'état neuf"},
        {
            value: 'used',
            label: 'Occasion / reconditionné',
            description: "Bien d'occasion / reconditionné",
        },
    ];

    // --- Normalisation du prix (UX) ---
    const onPriceChange = (v: string) => {
        const cleaned = v.replace(/[^\d.,]/g, '');
        onFieldChange('product_price', cleaned);
        validation?.markInteracted?.('product_price');
    };

    // --- Validation stricte avant de continuer ---
    const canContinue = useMemo(() => {
        if (!d.product_name?.trim()) return false;
        if (!d.purchase_date?.trim()) return false;
        if (!d.product_price?.trim()) return false;
        if (!d.product_condition?.trim()) return false;

        const priceValidation = validatePrice(d.product_price || '');
        if (!priceValidation.valid) return false;

        const dateValidation = validateDate(d.purchase_date || '');
        if (!dateValidation.valid) return false;

        if ((d.product_name?.trim().length || 0) < 2) return false;

        return true;
    }, [d]);

    // --- Modale de proposition IA ---
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [proposal, setProposal] = useState<string | null>(null);

    const declaredType: 'service' | 'bien' = d.product_condition === 'digital' ? 'service' : 'bien';

    const fetchProposal = async () => {
        setLoading(true);
        setApiError(null);
        setProposal(null);

        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), 15000);

        try {
            const res = await fetch(API_ENDPOINTS.normalizeProductName, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    declared_type: declaredType,
                    raw_name: d.product_name?.trim(),
                }),
                signal: controller.signal,
            });

            const ctype = res.headers.get('content-type') || '';
            const raw = await res.text();

            let json: NormalizeResponse | null = null;
            if (ctype.includes('application/json')) {
                try {
                    json = JSON.parse(raw);
                } catch {
                    throw new Error('Réponse JSON invalide (parse).');
                }
            } else {
                const snippet = raw.slice(0, 200).replace(/\s+/g, ' ').trim();
                throw new Error(`Réponse non JSON (status ${res.status}). ${snippet || 'Aucun contenu.'}`);
            }

            if (!res.ok || !json?.success || !json?.product_name_formatted) {
                throw new Error(json?.error || `Normalisation échouée (status ${res.status}).`);
            }

            setProposal(json.product_name_formatted);
        } catch (e: any) {
            setApiError(
                e?.name === 'AbortError'
                    ? 'Temps de réponse dépassé. Réessayez ou continuez sans reformulation.'
                    : e?.message || 'Une erreur est survenue.',
            );
        } finally {
            clearTimeout(t);
            setLoading(false);
        }
    };

    // Ouverture modale → fetch
    const handleNextClick = () => {
        validation?.markInteracted?.('product_name');
        validation?.markInteracted?.('purchase_date');
        validation?.markInteracted?.('product_price');
        validation?.markInteracted?.('product_condition');

        if (!canContinue) return;

        setShowModal(true);
        void fetchProposal();
    };

    // A11y focus
    const primaryBtnRef = useRef<HTMLButtonElement | null>(null);
    useEffect(() => {
        if (showModal) {
            const t = setTimeout(() => primaryBtnRef.current?.focus(), 50);
            return () => clearTimeout(t);
        }
    }, [showModal, loading]);

    // Escape pour fermer
    useEffect(() => {
        if (!showModal) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowModal(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [showModal]);

    // Helper : phrase "acquisition de / d’" propre
    const acquisitionWithPrep = (gn: string) => {
        const name = (gn || '').trim();
        if (!name) return '…';
        const lower = name.toLowerCase();

        // l’/l' => "de l’Nom"
        if (lower.startsWith('l’') || lower.startsWith("l'")) {
            return `de ${name}`;
        }
        // des => remplacer par "d’{reste}" (ex : des écouteurs -> d’écouteurs)
        if (lower.startsWith('des ')) {
            const rest = name.replace(/^des\s+/i, '');
            return `d’${rest}`;
        }
        // un/une => "d’un/d’une {GN}"
        if (lower.startsWith('un ') || lower.startsWith('une ')) {
            return `d’${name}`;
        }
        // défaut : "de {GN}"
        return `de ${name}`;
    };

    const previewSentence = useMemo(() => {
        const price = d.product_price ? `${d.product_price} €` : '…';
        const date = d.purchase_date
            ? new Date(d.purchase_date).toLocaleDateString('fr-FR') // jj/mm/aaaa
            : '…';
        const name = (proposal || d.product_name || '…').trim();
        const nameL = name.toLowerCase();

        if (declaredType === 'service') {
            // GN pur (avec article) – pas de “à”
            return `J’ai souscrit le ${date} ${name} au prix de ${price}.`;
        }

        // Bien : calcule la bonne préposition
        let prep = 'de ';
        if (nameL.startsWith('l’') || nameL.startsWith("l'")) {
            prep = 'de ';
        } else if (nameL.startsWith('des ')) {
            prep = ''; // “de des …” -> “des …”
        } else if (nameL.startsWith('un ') || nameL.startsWith('une ')) {
            prep = 'd’'; // d’un / d’une
        } else {
            prep = 'de ';
        }

        return `J’ai fait l’acquisition le ${date} ${prep}${name} au prix de ${price}.`;
    }, [declaredType, d.product_price, d.purchase_date, d.product_name, proposal]);

    const keepOriginal = () => {
        onFieldChange('product_name', null);
        setShowModal(false);
        onNext();
    };

    const replaceFieldAndAccept = () => {
        if (proposal) {
            onFieldChange('product_name', proposal);
        }
        setShowModal(false);
        onNext();
    };

    return (
        <section className="step-section p-0" role="tabpanel"
                 aria-labelledby="purchase-title">
            <div className="flex items-center gap-3 mb-4">
                <div
                    className="p-2.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow">
                    <svg
                        className="w-6 h-6 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            d="M7 4h10l1 4h3v2h-2l-2 9H8L6 10H4V8h3l1-4Zm2.2 4h5.6l-.5-2H9.7l-.5 2Z"/>
                    </svg>
                </div>
                <div>
                    <h2 id="purchase-title"
                        className="text-lg md:text-xl font-bold text-gray-900">
                        Informations d'achat
                    </h2>
                    <p className="text-sm text-gray-600">Précisez le produit et la date
                        d'achat.</p>
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

                {/* Date d'achat + Prix */}
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
                                validation?.getFieldRules?.('purchase_date', {required: true}),
                                validation?.validateField,
                                validation?.isInteracted,
                            )}
                        />
                    </div>

                    <div className="flex-1">
                        <FormField
                            name="product_price"
                            label="Prix TTC"
                            type="text"
                            inputMode="decimal"
                            value={d.product_price || ''}
                            onChange={onPriceChange}
                            onBlur={() => {
                                validation?.markInteracted?.('product_price');
                                const v = (d.product_price || '').trim();
                                if (v) onFieldChange('product_price', v.replace(',', '.'));
                            }}
                            required
                            placeholder="Ex : 899.99"
                            helpText="Prix payé en euros (virgule ou point accepté)"
                            validation={gatedValidation(
                                'product_price',
                                d.product_price || '',
                                validation?.getFieldRules?.('product_price', {required: true}),
                                validation?.validateField,
                                validation?.isInteracted,
                            )}
                        />
                    </div>
                </div>

                {/* État du produit (neuf/occasion/service) */}
                <RadioGroup
                    name="product_condition"
                    label="État du produit à l'achat"
                    value={d.product_condition || ''}
                    onChange={v => {
                        onFieldChange('product_condition', v);
                        onFieldChange('used', v === 'used');
                        onFieldChange('digital', v === 'digital');
                        validation?.markInteracted?.('product_condition');
                    }}
                    options={conditionOptions}
                    required
                    validation={gatedValidation(
                        'product_condition',
                        d.product_condition || '',
                        validation?.getFieldRules?.('product_condition', {required: true}),
                        validation?.validateField,
                        validation?.isInteracted,
                    )}
                />
            </div>

            {/* Navigation desktop / tablette */}
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
                    onClick={handleNextClick}
                    disabled={!canContinue}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-2xl hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Continuer vers le problème →
                </button>
            </div>

            {/* Modale */}
            {showModal && (
                <div
                    className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
                    aria-labelledby="reform-proposal-title"
                    role="dialog"
                    aria-modal="true"
                    onClick={e => {
                        if (e.target === e.currentTarget) setShowModal(false);
                    }}
                >
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"/>

                    <div
                        className="relative w-full sm:max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 mx-2 sm:mx-0 p-5 sm:p-6 animate-[fadeIn_.2s_ease]">
                        <div className="flex items-start gap-3">
                            <div
                                className="shrink-0 p-2 rounded-xl bg-blue-50 border border-blue-100">
                                <svg
                                    className="w-5 h-5 text-blue-600"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M12 3l4 4-9 9H3v-4l9-9Zm7.7 3.3l-1 1-4-4 1-1a1 1 0 0 1 1.4 0l2.6 2.6a1 1 0 0 1 0 1.4ZM5 21h14v-2H5v2Z"/>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3
                                    id="reform-proposal-title"
                                    className="text-base sm:text-lg font-bold text-gray-900"
                                >
                                    Proposition de formulation du produit
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    Nous vous suggérons une désignation claire et
                                    conforme, telle qu’elle apparaîtra
                                    dans votre lettre.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Fermer"
                            >
                                <svg
                                    className="w-5 h-5 text-gray-600"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M18.3 5.7a1 1 0 0 0-1.4 0L12 10.6 7.1 5.7A1 1 0 1 0 5.7 7.1L10.6 12l-4.9 4.9a1 1 0 1 0 1.4 1.4L12 13.4l4.9 4.9a1 1 0 0 0 1.4-1.4L13.4 12l4.9-4.9a1 1 0 0 0 0-1.4Z"/>
                                </svg>
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            {loading && (
                                <div
                                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
                                    <span
                                        className="inline-block h-4 w-4 rounded-full border-2 border-gray-400 border-t-transparent animate-spin"/>
                                    <span className="text-sm text-gray-700">Analyse du produit…</span>
                                </div>
                            )}

                            {!loading && apiError && (
                                <div
                                    className="p-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-sm">
                                    {apiError} — Vous pouvez continuer sans
                                    reformulation.
                                    <div className="mt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setApiError(null);
                                                void fetchProposal();
                                            }}
                                            className="text-amber-900 underline hover:no-underline"
                                        >
                                            Réessayer
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!loading && !apiError && (
                                <>
                                    <div
                                        className="p-3 rounded-xl border border-blue-200 bg-blue-50">
                                        <p className="text-sm text-blue-900">
                                            <span
                                                className="font-semibold">Suggestion :</span> {proposal || '—'}
                                        </p>
                                    </div>

                                    <div
                                        className="p-3 rounded-xl border border-gray-200 bg-white">
                                        <p className="text-sm text-gray-800">
                                            <span className="font-semibold">Aperçu dans la lettre :</span>{' '}
                                            {previewSentence}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button
                                ref={primaryBtnRef}
                                type="button"
                                disabled={loading || !proposal}
                                onClick={replaceFieldAndAccept}
                                className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                Accepter et continuer
                            </button>

                            <button
                                type="button"
                                disabled={loading}
                                onClick={keepOriginal}
                                className="w-full py-3 px-4 rounded-xl font-semibold text-gray-800 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-50"
                            >
                                Garder tel quel
                            </button>

                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => setShowModal(false)}
                                className="w-full sm:col-span-2 py-2.5 px-4 rounded-xl font-medium text-gray-600 hover:text-gray-800 focus:outline-none"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PurchaseInfoStep;
