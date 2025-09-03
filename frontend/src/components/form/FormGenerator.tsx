// frontend/src/components/form/FormGenerator.tsx
import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import useFormManager from '@/hooks/form';
import { STEPS } from '@/types/form';
import FormLayout from './FormLayout';

import BuyerInfoStep from './steps/BuyerInfoStep';
import SellerInfoStep from './steps/SellerInfoStep';
import PurchaseInfoStep from './steps/PurchaseInfoStep';
import ProblemInfoStep from './steps/ProblemInfoStep';

interface FormGeneratorProps {
  formSlug: string;
}

interface FormContextValue {}

const FormContext = createContext<FormContextValue>({});
const useFormContext = () => useContext(FormContext);
const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <FormContext.Provider value={{}}>{children}</FormContext.Provider>
);

const PROBLEM_INFO_STEP_INDEX = 3; // adapte si besoin

const FormGenerator: React.FC<FormGeneratorProps> = ({ formSlug }) => {
  const {
    currentStepIndex,
    formData,
    validation,
    isSubmitting,
    globalError,
    saveStatus,
    goToStep,
    nextStep,
    prevStep,
    updateField,
    submitForm,
    clearGlobalError,
    fillTestData,
  } = useFormManager();

  // Ref vers la fonction "ouvrir la modale" fournie par le step
  const openImproveModalRef = React.useRef<(() => void) | null>(null);
  const registerOpenModalHandler = React.useCallback((fn: () => void) => {
    openImproveModalRef.current = fn;
  }, []);

  const currentStep = useMemo(() => STEPS[currentStepIndex], [currentStepIndex]);

  const canGoNext = React.useMemo(() => {
    if (!currentStep || !formData) return false;
    return currentStep.fields.every(f => {
      const v = (formData as any)[f];
      if (typeof v === 'string') return v.trim().length > 0;
      return v !== null && v !== undefined && v !== '';
    });
  }, [currentStep, formData]);

  const commonStepProps = useMemo(
    () => ({
      data: formData,
      validation,
      onFieldChange: updateField,
      onNext: () => goToStep(Math.min(currentStepIndex + 1, STEPS.length - 1)),
      onPrev: () => goToStep(Math.max(currentStepIndex - 1, 0), true),
      isSubmitting,
    }),
    [formData, validation, updateField, currentStepIndex, goToStep, isSubmitting]
  );

  const renderStepContent = useMemo(() => {
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
            onSubmit={submitForm} // la modale de l'étape l'appelle
            registerOpenModalHandler={registerOpenModalHandler} // mobile ouvrira la modale via ça
          />
        );
      default:
        return null;
    }
  }, [currentStepIndex, commonStepProps, submitForm, registerOpenModalHandler]);

  const progressPercent =
    STEPS.length > 0
      ? Math.max(0, Math.min(100, Math.round((currentStepIndex / (STEPS.length - 1)) * 100)))
      : 0;

  return (
    <FormProvider>
      <FormLayout
        currentStep={currentStepIndex}
        totalSteps={STEPS.length}
        stepTitle={currentStep?.title}
        progressPercent={progressPercent}
        canGoNext={canGoNext}
        canGoPrev={currentStepIndex > 0}
        onNext={() => goToStep(Math.min(currentStepIndex + 1, STEPS.length - 1))}
        onPrev={prevStep}
        // 👉 En dernière étape, mobile "Générer" ouvre la modale (et pas submitForm)
        onSubmit={
          currentStepIndex === PROBLEM_INFO_STEP_INDEX
            ? () => (openImproveModalRef.current ? openImproveModalRef.current() : undefined)
            : () => submitForm()
        }
        isLastStep={currentStepIndex === STEPS.length - 1}
        isSubmitting={isSubmitting}
        saveStatus={saveStatus}
        globalError={globalError}
        onClearGlobalError={clearGlobalError}
        showTestData={true}
        onTestData={fillTestData}
      >
        {renderStepContent}
      </FormLayout>
    </FormProvider>
  );
};

export default FormGenerator;
