// src/components/form/FormGenerator.tsx - Version corrigée
'use client';

import { motion } from 'framer-motion';
import { User, Building, ShoppingCart, Bug } from 'lucide-react';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useMemo } from 'react';

import useFormManager from '@/hooks/form';
import { STEPS } from '@/types/form';

import FormLayout from './FormLayout';
import BuyerInfoStep from './steps/BuyerInfoStep';
import ProblemInfoStep from './steps/ProblemInfoStep';
import PurchaseInfoStep from './steps/PurchaseInfoStep';
import SellerInfoStep from './steps/SellerInfoStep';

interface FormGeneratorProps {
  formSlug: string;
}

interface FormContextValue {}

const FormContext = createContext<FormContextValue>({});
const useFormContext = () => useContext(FormContext);
const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
  <FormContext.Provider value={{}}>{children}</FormContext.Provider>
);

const PROBLEM_INFO_STEP_INDEX = 3;

// Icônes pour les étapes
const STEP_ICONS = {
  0: <User className="w-5 h-5" />,
  1: <Building className="w-5 h-5" />,
  2: <ShoppingCart className="w-5 h-5" />,
  3: <Bug className="w-5 h-5" />,
};

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
    [formData, validation, updateField, currentStepIndex, goToStep, isSubmitting],
  );

  // DÉPLACÉ AVANT utilisation - Descriptions contextuelles par étape
  const getStepDescription = () => {
    switch (currentStepIndex) {
      case 0:
        return 'Ces informations apparaîtront sur votre lettre officielle';
      case 1:
        return "Informations sur l'entreprise ou le professionnel concerné";
      case 2:
        return 'Détails de la transaction et du produit concerné';
      case 3:
        return 'Décrivez précisément le défaut constaté pour appuyer votre demande';
      default:
        return '';
    }
  };

  const getContextualHelp = () => {
    switch (currentStepIndex) {
      case 0:
        return 'Ces informations seront utilisées pour personnaliser votre lettre officielle.';
      case 1:
        return 'Nous avons besoin de ces informations pour adresser correctement votre courrier.';
      case 2:
        return 'Plus vous êtes précis, plus votre lettre sera efficace.';
      case 3:
        return 'Décrivez le problème avec précision pour appuyer votre demande juridiquement.';
      default:
        return 'Remplissez les champs requis pour continuer.';
    }
  };

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

    // Wrapper avec en-tête harmonisé
    return (
      <div className="space-y-6">
        {/* Contenu de l'étape dans une card harmonisée */}
        <motion.div
          key={`step-${currentStepIndex}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          {stepContent}
        </motion.div>

        {/* Helper text contextuel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-3 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div className="text-sm text-blue-700">💡 {getContextualHelp()}</div>
        </motion.div>

        {/* Trust indicators pour la dernière étape */}
        {currentStepIndex === PROBLEM_INFO_STEP_INDEX && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4 bg-green-50 rounded-xl border border-green-200"
          >
            <div className="text-center">
              <h3 className="font-semibold text-green-900 mb-2">🔒 Vos données sont protégées</h3>
              <div className="flex items-center justify-center gap-6 text-sm text-green-700">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Hébergement français</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>RGPD compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span>Articles juridiques vérifiés</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    );
  }, [
    currentStepIndex,
    commonStepProps,
    submitForm,
    registerOpenModalHandler,
    currentStep,
    getStepDescription,
    getContextualHelp,
  ]);

  return (
    <FormProvider>
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
    </FormProvider>
  );
};

export default FormGenerator;
