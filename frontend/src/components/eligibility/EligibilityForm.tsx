// src/components/eligibility/EligibilityForm.tsx - VERSION AMÉLIORÉE
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  User,
  Building2,
  Home,
  Briefcase,
  Package,
  Monitor,
  CheckCircle,
  XCircle,
  Globe,
  Clock,
  AlertTriangle,
  ChevronDown,
  Info,
  Scale,
  BookOpen,
  Lightbulb,
} from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';

import BackOnlyNavigation from '@/components/form/BackOnlyNavigation';
import RadioGroup from '@/components/form/RadioGroup';
import LegalReference from '@/components/legal/LegalReference';
import Container from '@/components/ui/Container';
import ValidationMessage from '@/components/ui/ValidationMessage';
import { ELIGIBILITY_STEPS } from '@/constants/eligibilitySteps';
import { calculateEligibilityEngine } from '@/eligibility/engine';
import type { EligibilityResult } from '@/eligibility/engine';
import { useEligibilityForm } from '@/hooks/useEligibilityForm';
import type { EligibilityData, StepId } from '@/types/eligibility';

// ✅ MAPPING SÉCURISÉ DES CHAMPS
const FIELD_BY_ID: Record<StepId, keyof EligibilityData> = {
  seller: 'sellerType',
  usage: 'usage',
  product: 'productType',
  territory: 'territory',
  timing: 'withinTwoYears',
  defect: 'hasDefect',
};

// ✅ ICÔNES PAR ÉTAPE
const STEP_ICONS: Record<StepId, React.ReactNode> = {
  seller: <Building2 className="w-6 h-6" />,
  usage: <Briefcase className="w-6 h-6" />,
  product: <Package className="w-6 h-6" />,
  territory: <Globe className="w-6 h-6" />,
  timing: <Clock className="w-6 h-6" />,
  defect: <AlertTriangle className="w-6 h-6" />,
};

// ✅ ICÔNES DES OPTIONS
function getOptionIcon(stepId: StepId, value: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    'seller-professional': <Building2 className="w-5 h-5" />,
    'seller-individual': <User className="w-5 h-5" />,
    'usage-personal': <Home className="w-5 h-5" />,
    'usage-professional': <Briefcase className="w-5 h-5" />,
    'product-physical': <Package className="w-5 h-5" />,
    'product-digital': <Monitor className="w-5 h-5" />,
    'territory-eu': <CheckCircle className="w-5 h-5" />,
    'territory-non_eu': <XCircle className="w-5 h-5" />,
    'timing-lt_2y': <CheckCircle className="w-5 h-5" />,
    'timing-gte_2y': <XCircle className="w-5 h-5" />,
    'defect-yes': <AlertTriangle className="w-5 h-5" />,
    'defect-no': <CheckCircle className="w-5 h-5" />,
  };
  return iconMap[`${stepId}-${value}`];
}

// ✅ ANIMATIONS
const stepVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

interface EligibilityFormProps {
  onComplete?: (result: EligibilityResult, data: EligibilityData) => void;
  onStepChange?: (step: number) => void;
  className?: string;
}

const EligibilityForm: React.FC<EligibilityFormProps> = ({
  onComplete,
  onStepChange,
  className = '',
}) => {
  const { currentStep, data, validations, setCurrentStep, setData } = useEligibilityForm();

  const [showLegalNote, setShowLegalNote] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // ✅ RÉCUPÉRATION SÉCURISÉE DE L'ÉTAPE
  const step = ELIGIBILITY_STEPS[currentStep];
  if (!step) {
    React.useEffect(() => {
      setCurrentStep(0);
    }, [setCurrentStep]);
    return null;
  }

  // ✅ FONCTION POUR RÉCUPÉRER LA VALEUR ACTUELLE
  const getCurrentStepData = useCallback(() => {
    const fieldName = FIELD_BY_ID[step.id];
    return fieldName && data ? data[fieldName] : undefined;
  }, [step, data]);

  // ✅ CALCUL SÉCURISÉ DE L'ÉLIGIBILITÉ
  const calculateEligibility = useCallback((formData: EligibilityData): EligibilityResult => {
    try {
      return calculateEligibilityEngine(formData);
    } catch (error) {
      console.error("Erreur lors du calcul d'éligibilité:", error);
      return {
        isEligible: false,
        reasons: ['no_defect'],
        timing: {},
      };
    }
  }, []);

  // ✅ GESTION SÉCURISÉE DES CHOIX - FIX BUG RETOUR
  const handleChoice = useCallback(
    (value: string | boolean) => {
      try {
        setShowLegalNote(false);
        if (!step) return;

        const fieldName = FIELD_BY_ID[step.id];
        if (!fieldName) return;

        // ✅ FIX: Vérifier AVANT la mise à jour si on re-sélectionne la même option
        const currentValue = getCurrentStepData();
        const isReSelectingSameOption = currentValue === value;

        // ✅ DÉTECTION DES RÉPONSES INÉLIGIBLES IMMÉDIATES
        const isIneligibleChoice =
          (step.id === 'seller' && value === 'individual') ||
          (step.id === 'usage' && value === 'professional') ||
          (step.id === 'territory' && value === 'non_eu') ||
          (step.id === 'timing' && value === 'gte_2y') ||
          (step.id === 'defect' && value === 'no');

        // ✅ MISE À JOUR DES DONNÉES
        const newData = {
          ...data,
          [fieldName]: value,
        };
        setData(newData);

        // ✅ SI RÉPONSE INÉLIGIBLE : REDIRIGER IMMÉDIATEMENT
        if (isIneligibleChoice) {
          const result = calculateEligibility(newData);
          onComplete?.(result, newData);
          return;
        }

        // ✅ FIX: Si on clique sur une option (même déjà sélectionnée), on avance toujours
        // Cela permet de "valider" et continuer après un retour en arrière
        if (currentStep < ELIGIBILITY_STEPS.length - 1) {
          setCurrentStep(currentStep + 1);
          onStepChange?.(currentStep + 1);
        } else {
          // ✅ DERNIÈRE ÉTAPE : CALCULER ET RENVOYER
          const result = calculateEligibility(newData);
          onComplete?.(result, newData);
        }
      } catch (error) {
        console.error('Erreur dans handleChoice:', error);
      }
    },
    [
      currentStep,
      data,
      step,
      setData,
      setCurrentStep,
      calculateEligibility,
      onComplete,
      onStepChange,
      getCurrentStepData,
    ],
  );

  // ✅ GESTION DU RETOUR
  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      onStepChange?.(currentStep - 1);
      setShowLegalNote(false);
    }
  }, [currentStep, setCurrentStep, onStepChange]);

  // ✅ ENRICHISSEMENT DES OPTIONS AVEC ICÔNES
  const enrichedOptions = step.ui.options?.map(option => ({
    ...option,
    icon: getOptionIcon(step.id, option.value),
  }));

  const value = getCurrentStepData();
  const canGoPrev = currentStep > 0;
  const stepValidation = validations[currentStep];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 ${className}`}
    >
      {/* ✅ CONTAINER OPTIMISÉ POUR FORMULAIRES */}
      <Container variant="form" className="py-6 md:py-12">
        {/* ✅ INDICATEUR DE PROGRESSION MODERNE */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <span>
              Étape {currentStep + 1} sur {ELIGIBILITY_STEPS.length}
            </span>
            <span>{Math.round((currentStep / ELIGIBILITY_STEPS.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{
                width: `${((currentStep + 1) / ELIGIBILITY_STEPS.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* ✅ CARTE PRINCIPALE MODERNE - PROPORTIONS MOBILE OPTIMISÉES */}
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              {/* ✅ EN-TÊTE DE L'ÉTAPE - SPACING MOBILE OPTIMISÉ */}
              <div className="p-4 md:p-6 pb-0">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="flex-shrink-0 p-2.5 md:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl md:rounded-2xl text-white shadow-lg">
                    {STEP_ICONS[step.id]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-1.5 md:mb-2">
                      {step.title}
                    </h2>
                    <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed">
                      {step.question}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1.5 md:mt-2">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* ✅ DROPDOWN "EN SAVOIR PLUS" - AVEC ICONS ET LEGALREFERENCE */}
                <div className="mt-3 md:mt-6">
                  <button
                    onClick={() => setShowLegalNote(!showLegalNote)}
                    className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    type="button"
                  >
                    <Info className="w-4 h-4" />
                    <span>En savoir plus</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${showLegalNote ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <AnimatePresence>
                    {showLegalNote && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-3 md:mt-4 overflow-hidden"
                      >
                        <div className="p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3 md:space-y-4">
                          {/* ✅ BASE LÉGALE avec LegalReference */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-blue-900">
                              <Scale className="w-4 h-4" />
                              <span>Base légale</span>
                            </div>
                            {/* On affiche les références selon l'article */}
                            {step.id === 'seller' && (
                              <LegalReference code="L.217-3" variant="badge" size="sm" />
                            )}
                            {step.id === 'usage' && (
                              <LegalReference code="LIMINAIRE" variant="badge" size="sm" />
                            )}
                            {step.id === 'product' && (
                              <div className="flex flex-wrap gap-2">
                                <LegalReference code="L.217-3" variant="badge" size="sm" />
                                <LegalReference code="L.224-25-12" variant="badge" size="sm" />
                              </div>
                            )}
                            {step.id === 'timing' && (
                              <div className="flex flex-wrap gap-2">
                                <LegalReference code="L.217-3" variant="badge" size="sm" />
                                <LegalReference code="L.217-7" variant="badge" size="sm" />
                              </div>
                            )}
                            {step.id === 'defect' && (
                              <LegalReference code="L.217-5" variant="badge" size="sm" />
                            )}
                            {step.id === 'territory' && (
                              <p className="text-xs md:text-sm text-blue-800 italic">
                                {step.legal.article}
                              </p>
                            )}
                          </div>

                          {/* ✅ EXPLICATION */}
                          {step.legal.explanation && (
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-blue-900">
                                <BookOpen className="w-4 h-4" />
                                <span>Explication</span>
                              </div>
                              <p className="text-xs md:text-sm text-blue-800 leading-relaxed">
                                {step.legal.explanation}
                              </p>
                            </div>
                          )}

                          {/* ✅ EXEMPLES avec icons CheckCircle/XCircle */}
                          {step.legal.examples && step.legal.examples.length > 0 && (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs md:text-sm font-medium text-blue-900">
                                <Lightbulb className="w-4 h-4" />
                                <span>Exemples</span>
                              </div>
                              <ul className="space-y-1.5">
                                {step.legal.examples.map((example, idx) => {
                                  // Détecte si l'exemple commence par ✅ ou ❌
                                  const isPositive = example.trim().startsWith('✅');
                                  const isNegative = example.trim().startsWith('❌');
                                  // Enlève l'emoji du texte
                                  const cleanExample = example.replace(/^[✅❌]\s*/, '');

                                  return (
                                    <li
                                      key={idx}
                                      className="flex items-start gap-2 text-xs md:text-sm text-blue-800 leading-relaxed"
                                    >
                                      {isPositive && (
                                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                      )}
                                      {isNegative && (
                                        <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                      )}
                                      {!isPositive && !isNegative && (
                                        <div className="w-1 h-1 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                                      )}
                                      <span>{cleanExample}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* ✅ CONTENU DU FORMULAIRE - SPACING MOBILE OPTIMISÉ */}
              <div className="p-4 md:p-6 pt-4 md:pt-6">
                <RadioGroup
                  inputRef={firstFieldRef as any}
                  name={String(step.id)}
                  onChange={handleChoice}
                  options={enrichedOptions || step.ui.options}
                  value={value}
                  required={step.ui.required}
                  variant="card"
                />

                {/* ✅ MESSAGE DE VALIDATION AMÉLIORÉ */}
                {stepValidation && !stepValidation.isValid && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 md:mt-6"
                  >
                    <ValidationMessage
                      type="error"
                      message={stepValidation.error}
                      className="bg-red-50 border-red-200 text-red-800 rounded-xl p-3 md:p-4"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ✅ BARRE DE CONFIANCE - STYLE STRIPE/PAYPAL */}
        <div className="mt-4 md:mt-6">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl md:rounded-2xl shadow-sm p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-center gap-3 md:gap-8">
              <div className="flex items-center gap-2.5">
                <div className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4.5 h-4.5 md:w-5 md:h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm md:text-base font-semibold text-gray-900">
                    RGPD compliant
                  </div>
                  <div className="text-xs text-gray-500">Conforme aux réglementations</div>
                </div>
              </div>

              <div className="hidden md:block w-px h-10 bg-gray-200" />

              <div className="flex items-center gap-2.5">
                <div className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4.5 h-4.5 md:w-5 md:h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm md:text-base font-semibold text-gray-900">
                    Données non conservées
                  </div>
                  <div className="text-xs text-gray-500">Confidentialité garantie</div>
                </div>
              </div>

              <div className="hidden md:block w-px h-10 bg-gray-200" />

              <div className="flex items-center gap-2.5">
                <div className="flex-shrink-0 w-8 h-8 md:w-9 md:h-9 bg-green-50 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4.5 h-4.5 md:w-5 md:h-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm md:text-base font-semibold text-gray-900">
                    100% gratuit
                  </div>
                  <div className="text-xs text-gray-500">Aucun engagement</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ NAVIGATION */}
        <div className="mt-6 md:mt-8">
          <BackOnlyNavigation
            canGoPrev={canGoPrev}
            onPrev={handlePrevious}
            currentStep={currentStep}
            totalSteps={ELIGIBILITY_STEPS.length}
          />
        </div>
      </Container>
    </div>
  );
};

export default EligibilityForm;
