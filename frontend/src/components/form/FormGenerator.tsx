'use client';

import {motion} from 'framer-motion';
import React, {useMemo} from 'react';

import useFormManager from '@/hooks/form';
import {STEPS} from '@/types/form';

import FormLayout from './FormLayout';
import BuyerInfoStep from './steps/BuyerInfoStep';
import ProblemInfoStep from './steps/ProblemInfoStep';
import PurchaseInfoStep from './steps/PurchaseInfoStep';
import SellerInfoStep from './steps/SellerInfoStep';


interface FormGeneratorProps {
    formSlug: string;
}

const PROBLEM_INFO_STEP_INDEX = 3;

const FormGenerator: React.FC<FormGeneratorProps> = () => {
    const {
        currentStepIndex,
        formData,
        validation,
        isSubmitting,
        globalError,
        saveStatus,
        goToStep,
        prevStep,
        updateField,
        submitForm,
        clearGlobalError,
        fillTestData,
    } = useFormManager();

    const openImproveModalRef = React.useRef<(() => void) | null>(null);
    const registerOpenModalHandler = React.useCallback((fn: () => void) => {
        openImproveModalRef.current = fn;
    }, []);

    const currentStep = useMemo(() => STEPS[currentStepIndex], [currentStepIndex]);

    const canGoNext = useMemo(() => {
        if (!currentStep || !formData) {
            return false;
        }
        return currentStep.fields.every((f) => {
            const v = (formData as Record<string, unknown>)[f];
            if (typeof v === 'string') {
                return v.trim().length > 0;
            }
            return v !== null && v !== undefined && v !== '';
        });
    }, [currentStep, formData]);

    const commonStepProps = useMemo(
        () => ({
            data: formData,
            validation,
            onFieldChange: updateField,
            onNext: () => goToStep(Math.min(currentStepIndex + 1, STEPS.length - 1)),
            onPrev: () => goToStep(Math.max(currentStepIndex - 1, 0)),
            isSubmitting,
        }),
        [formData, validation, updateField, currentStepIndex, goToStep, isSubmitting],
    );

    const renderStepContent = useMemo(() => {
        const stepContent = (() => {
            switch (currentStepIndex) {
                case 0:
                    return <BuyerInfoStep {...commonStepProps} />;
                case 1:
                    return <SellerInfoStep {...commonStepProps} />;
                case 2:
                    return <PurchaseInfoStep {...commonStepProps} />;
                case PROBLEM_INFO_STEP_INDEX:
                    return (
                        <ProblemInfoStep
                            {...commonStepProps}
                            onSubmit={submitForm}
                            registerOpenModalHandler={registerOpenModalHandler}
                        />
                    );
                default:
                    return null;
            }
        })();

        return (
            <div className="space-y-6">
                <motion.div
                    key={`step-${currentStepIndex}`}
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.2}}
                    className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
                >
                    {stepContent}
                </motion.div>

                {currentStepIndex === PROBLEM_INFO_STEP_INDEX && (
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.5}}
                        className="p-4 bg-green-50 rounded-xl border border-green-200"
                    >
                        <div className="text-center">
                            <h3 className="font-semibold text-green-900 mb-2">🔒 Vos
                                données sont protégées</h3>
                            <div
                                className="flex items-center justify-center gap-6 text-sm text-green-700">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2 h-2 rounded-full bg-green-600"></div>
                                    <span>Hébergement français</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2 h-2 rounded-full bg-green-600"></div>
                                    <span>RGPD compliant</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2 h-2 rounded-full bg-green-600"></div>
                                    <span>Articles juridiques vérifiés</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        );
    }, [currentStepIndex, commonStepProps, submitForm, registerOpenModalHandler]);

    return (
        <FormLayout
            currentStep={currentStepIndex}
            totalSteps={STEPS.length}
            canGoNext={canGoNext}
            canGoPrev={currentStepIndex > 0}
            onNext={() => goToStep(Math.min(currentStepIndex + 1, STEPS.length - 1))}
            onPrev={prevStep}
            onSubmit={
                currentStepIndex === PROBLEM_INFO_STEP_INDEX
                    ? () => (openImproveModalRef.current ? openImproveModalRef.current() : submitForm())
                    : submitForm
            }
            isLastStep={currentStepIndex === STEPS.length - 1}
            isSubmitting={isSubmitting}
            saveStatus={saveStatus}
            globalError={globalError}
            onClearGlobalError={clearGlobalError}
            showTestData={true}
            onTestData={fillTestData}
            formData={formData}
            onFieldChange={updateField}
            variant="default"
        >
            {renderStepContent}
        </FormLayout>
    );
};

export default FormGenerator;
