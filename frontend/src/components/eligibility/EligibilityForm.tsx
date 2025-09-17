// src/components/eligibility/EligibilityForm.tsx - VERSION CORRIGÉE
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  User,
  ShoppingBag,
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
} from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';

import RadioGroup from '@/components/form/RadioGroup';
import BackOnlyNavigation from '@/components/form/BackOnlyNavigation';
import Container from '@/components/ui/Container';
import LegalReference from '@/components/ui/LegalReference';
import ValidationMessage from '@/components/ui/ValidationMessage';
import { ELIGIBILITY_STEPS } from '@/constants/eligibilitySteps';
import { useEligibilityForm } from '@/hooks/useEligibilityForm';
import { calculateEligibilityEngine, validateEligibilityData } from '@/eligibility/engine';
import type { EligibilityData, StepId } from '@/types/eligibility';
import type { EligibilityResult } from '@/eligibility/engine';

// ✅ MAPPING SÉCURISÉ DES CHAMPS
const FIELD_BY_ID: Record<StepId, keyof EligibilityData> = {
  seller: 'sellerType',
  usage: 'usage',
  product: 'productType',
  territory: 'territory',
  timing: 'withinTwoYears',
  defect: 'hasDefect',
};

// ✅ ARTICLES JURIDIQUES POUR LEGALNOTE
const STEP_LEGAL_ARTICLES: Record<StepId, { id: string; explanation?: string }[]> = {
  seller: [
    {
      id: 'L.217-3',
      explanation: "La garantie légale s'applique aux ventes entre professionnels et consommateurs",
    },
  ],
  usage: [
    {
      id: 'Article liminaire',
      explanation:
        'Définit le consommateur comme une personne physique agissant à des fins non professionnelles',
    },
  ],
  product: [
    {
      id: 'L.217-5',
      explanation: 'Critères de conformité pour les biens matériels et numériques',
    },
  ],
  territory: [
    {
      id: 'L.217-3',
      explanation: 'Application territoriale de la garantie légale de conformité',
    },
  ],
  timing: [
    {
      id: 'L.217-7',
      explanation:
        "Délai de garantie légale de 24 mois pour les biens neufs, 12 mois pour l'occasion",
    },
  ],
  defect: [
    {
      id: 'L.217-5',
      explanation: 'Définition des défauts de conformité couverts par la garantie',
    },
  ],
};

// ✅ ICÔNES COMPLÈTES PAR OPTION
const getOptionIcon = (stepId: StepId, value: string): React.ReactNode => {
  const iconMaps: Record<StepId, Record<string, React.ReactNode>> = {
    seller: {
      professional: <Building2 className="w-5 h-5" />,
      individual: <User className="w-5 h-5" />,
    },
    usage: {
      personal: <Home className="w-5 h-5" />,
      professional: <Briefcase className="w-5 h-5" />,
    },
    product: {
      physical: <Package className="w-5 h-5" />,
      digital: <Monitor className="w-5 h-5" />,
    },
    territory: {
      eu: <CheckCircle className="w-5 h-5" />,
      non_eu: <XCircle className="w-5 h-5" />,
    },
    timing: {
      true: <CheckCircle className="w-5 h-5" />,
      false: <XCircle className="w-5 h-5" />,
    },
    defect: {
      true: <AlertTriangle className="w-5 h-5" />,
      false: <CheckCircle className="w-5 h-5" />,
    },
  };

  return iconMaps[stepId]?.[value] || null;
};

// ✅ ICÔNES D'ÉTAPES
const STEP_ICONS: Record<StepId, React.ReactNode> = {
  seller: <Building2 className="w-5 h-5" />,
  usage: <User className="w-5 h-5" />,
  product: <Package className="w-5 h-5" />,
  territory: <Globe className="w-5 h-5" />,
  timing: <Clock className="w-5 h-5" />,
  defect: <AlertTriangle className="w-5 h-5" />,
};

// ✅ VARIANTS D'ANIMATION FLUIDES
const stepVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
};

// ✅ PROPS INTERFACE
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
  const { currentStep, data, validations, validateStep, setCurrentStep, setData, setValidations } =
    useEligibilityForm();

  const [showLegalNote, setShowLegalNote] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  // ✅ RÉCUPÉRATION SÉCURISÉE DE L'ÉTAPE
  const step = ELIGIBILITY_STEPS[currentStep];
  if (!step) {
    // Retour silencieux à la première étape au lieu d'afficher une erreur
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

  // ✅ CALCUL SÉCURISÉ DE L'ÉLIGIBILITÉ (CORRIGÉ)
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

  // ✅ GESTION SÉCURISÉE DES CHOIX (LOGIQUE CORRIGÉE AVEC INÉLIGIBILITÉ IMMÉDIATE)
  const handleChoice = useCallback(
    (value: string | boolean) => {
      try {
        if (!step) return;

        const fieldName = FIELD_BY_ID[step.id];
        if (!fieldName) return;

        // ✅ DÉTECTION DES RÉPONSES INÉLIGIBLES IMMÉDIATES (VALEURS CORRIGÉES)
        const isIneligibleChoice =
          (step.id === 'seller' && value === 'individual') ||
          (step.id === 'usage' && value === 'professional') ||
          (step.id === 'territory' && value === 'non_eu') ||
          (step.id === 'timing' && value === 'gte_2y') || // ✅ CORRIGÉ
          (step.id === 'defect' && value === 'no'); // ✅ CORRIGÉ

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

        // ✅ RÉPONSE ÉLIGIBLE : CONTINUER OU TERMINER
        if (currentStep < ELIGIBILITY_STEPS.length - 1) {
          setCurrentStep(currentStep + 1);
          onStepChange?.(currentStep + 1);
        } else {
          // ✅ DERNIÈRE ÉTAPE AVEC RÉPONSE ÉLIGIBLE : CALCULER ET RENVOYER
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
    ],
  );

  // ✅ GESTION DU RETOUR
  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      onStepChange?.(currentStep - 1);
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
  const legalArticles = STEP_LEGAL_ARTICLES[step.id];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 ${className}`}
    >
      {/* ✅ CONTAINER OPTIMISÉ POUR FORMULAIRES */}
      <Container variant="form" className="py-8 md:py-12">
        {/* ✅ INDICATEUR DE PROGRESSION MODERNE */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <span>
              Étape {currentStep + 1} sur {ELIGIBILITY_STEPS.length}
            </span>
            <span>{Math.round(((currentStep + 1) / ELIGIBILITY_STEPS.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
              initial={{ width: 0 }}
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
            {/* ✅ CARTE PRINCIPALE MODERNE */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              {/* ✅ EN-TÊTE DE L'ÉTAPE */}
              <div className="p-6 pb-0">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-lg">
                    {STEP_ICONS[step.id]}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h2>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      {step.question}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">{step.description}</p>
                  </div>
                </div>

                {/* ✅ DROPDOWN BASE LÉGALE AVEC LEGALNOTE */}
                {legalArticles && legalArticles.length > 0 && (
                  <div className="mt-6">
                    <button
                      onClick={() => setShowLegalNote(!showLegalNote)}
                      className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Info className="w-4 h-4" />
                      <span>Base légale</span>
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
                          className="mt-4 overflow-hidden"
                        >
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
                            {legalArticles.map((article, index) => (
                              <div key={index} className="space-y-2">
                                {article.id === 'Article liminaire' ? (
                                  // Cas spécial pour Article liminaire (non dans le registry)
                                  <div className="space-y-2">
                                    <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                      Article liminaire du Code de la consommation
                                    </div>
                                    <p className="text-sm text-blue-800 leading-relaxed">
                                      {article.explanation}
                                    </p>
                                    <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded border-l-4 border-blue-300">
                                      <strong>Définition légale :</strong> Le "consommateur" est
                                      toute personne physique qui agit à des fins qui n'entrent pas
                                      dans le cadre de son activité commerciale, industrielle,
                                      artisanale, libérale ou agricole.
                                    </div>
                                  </div>
                                ) : (
                                  // Articles normaux du registry
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <LegalReference
                                        code={article.id as any}
                                        variant="badge"
                                        size="sm"
                                        showStatus={false}
                                        immediate={true}
                                      />
                                    </div>
                                    {article.explanation && (
                                      <p className="text-sm text-blue-800 leading-relaxed">
                                        {article.explanation}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* ✅ CONTENU DU FORMULAIRE */}
              <div className="p-6 pt-6">
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
                    className="mt-6"
                  >
                    <ValidationMessage
                      type="error"
                      message={stepValidation.error}
                      className="bg-red-50 border-red-200 text-red-800 rounded-xl p-4"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ✅ NAVIGATION */}
        <div className="mt-8">
          <BackOnlyNavigation
            canGoPrev={canGoPrev}
            onPrev={handlePrevious}
            currentStep={currentStep}
            totalSteps={ELIGIBILITY_STEPS.length}
          />
        </div>

        {/* ✅ INDICATEURS DE CONFIANCE */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>RGPD compliant</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Données non conservées</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Gratuit</span>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default EligibilityForm;
