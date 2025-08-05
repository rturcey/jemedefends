import React, { useRef, useState, useEffect } from 'react';
import TextAreaField from '@/components/form/TextAreaField';
import RadioGroup from '@/components/form/RadioGroup';
import ReformatDescriptionModal from '@/components/form/ReformatDescriptionModal';
import { gatedValidation } from '@/lib/fieldValidation';
import { StepProps } from '@/types/form';

const ProblemInfoStep: React.FC<StepProps> = ({
                                                  data,
                                                  validation,
                                                  onFieldChange,
                                                  onSubmit,
                                                  onPrev,
                                                  isSubmitting,
                                                  registerBeforeSubmit,
                                              }) => {
    const [showImprovementModal, setShowImprovementModal] = useState(false);
    const [hasImprovedText, setHasImprovedText] = useState(false);
    const [modalHasBeenShown, setModalHasBeenShown] = useState(false);

    const defectDescription = data.defect_description || '';
    const prevDescRef = useRef(defectDescription);

    // Intercepteur avant soumission : force l'ouverture de la modale
    useEffect(() => {
        registerBeforeSubmit?.(() => {
            // Si la modale n'a pas encore été montrée pour cette session
            if (!modalHasBeenShown) {
                setShowImprovementModal(true);
                return false; // BLOQUER la soumission
            }

            // Sinon, autoriser la soumission
            return true;
        });
    }, [registerBeforeSubmit, modalHasBeenShown]);

    const handleDescChange = (value: string) => {
        onFieldChange('defect_description', value);
        validation?.markInteracted?.('defect_description');

        // Reset le flag "amélioré" si le texte change
        if (hasImprovedText && value !== prevDescRef.current) {
            setHasImprovedText(false);
        }
        prevDescRef.current = value;
    };

    // Fonction appelée quand la modale applique une amélioration
    const applyImprovement = (newText: string, type: 'corrected' | 'reformulated') => {
        onFieldChange('defect_description', newText);
        setHasImprovedText(true);
        setShowImprovementModal(false);
        setModalHasBeenShown(true); // Marquer que la modale a été montrée
    };

    // Fermer la modale sans appliquer
    const handleCloseModal = () => {
        setShowImprovementModal(false);
        setModalHasBeenShown(true); // Marquer que la modale a été montrée même sans amélioration
    };

    const canSubmit = validation?.validateStep?.('problem_info', data) ?? true;

    return (
        <>
            <section className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                            Description du problème
                        </h2>
                        <p className="text-gray-600 text-sm md:text-base">
                            Décrivez précisément le défaut ou problème rencontré avec votre achat.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Type de produit/service */}
                        <RadioGroup
                            label="Type d'achat"
                            name="purchase_type"
                            options={[
                                { value: 'bien', label: 'Un bien (objet physique)' },
                                { value: 'service', label: 'Un service (prestation)' },
                                { value: 'contenu_numerique', label: 'Du contenu numérique' },
                            ]}
                            value={data.purchase_type || ''}
                            onChange={(value) => onFieldChange('purchase_type', value)}
                            required
                            validation={validation?.getFieldValidation?.('purchase_type')}
                        />

                        {/* Description du problème */}
                        <div className="space-y-2">
                            <TextAreaField
                                label="Description détaillée du problème"
                                name="defect_description"
                                value={defectDescription}
                                onChange={handleDescChange}
                                error={validation?.getFieldValidation?.('defect_description')}
                                required
                                minLength={20}
                                maxLength={1000}
                                rows={6}
                                placeholder="Décrivez précisément le problème : faits, dates, échanges…"
                                helpText="Plus vous êtes précis, plus votre lettre sera efficace. Notre IA vous aidera à optimiser cette description avant la génération de la lettre."
                                validation={gatedValidation(
                                    'defect_description',
                                    defectDescription || '',
                                    validation?.getFieldRules?.('defect_description', {
                                        required: true,
                                        minLength: 20,
                                        maxLength: 1000,
                                    } as any),
                                    validation?.validateField,
                                    validation?.isInteracted
                                )}
                            />

                            {/* Indicateur si texte amélioré */}
                            {hasImprovedText && (
                                <div className="mt-2 inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-medium">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Texte optimisé par l'IA
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions mobile */}
                <div className="flex flex-col gap-3 sm:hidden">
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={!canSubmit || isSubmitting}
                        className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-4 px-6 rounded-2xl disabled:opacity-50 hover:shadow-lg transition-all"
                    >
                        {isSubmitting ? 'Génération…' : 'Générer ma lettre'}
                    </button>
                    <button
                        type="button"
                        onClick={onPrev}
                        className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-2xl hover:bg-gray-200 transition-colors"
                    >
                        ← Retour
                    </button>
                </div>

                {/* Actions desktop */}
                <div className="hidden sm:flex justify-between mt-8">
                    <button
                        type="button"
                        onClick={onPrev}
                        className="bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-2xl hover:bg-gray-200 transition-colors"
                    >
                        ← Retour
                    </button>
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={!canSubmit || isSubmitting}
                        className="bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-3 px-6 rounded-2xl disabled:opacity-50 hover:shadow-lg transition-all"
                    >
                        {isSubmitting ? 'Génération…' : 'Générer ma lettre'}
                    </button>
                </div>
            </section>

            {/* Modale d'amélioration */}
            <ReformatDescriptionModal
                open={showImprovementModal}
                onClose={handleCloseModal}
                initialText={defectDescription}
                onApply={applyImprovement}
                maxChars={1200}
            />
        </>
    );
};

export default ProblemInfoStep;