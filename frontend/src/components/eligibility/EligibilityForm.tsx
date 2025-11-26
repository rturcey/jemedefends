// src/components/eligibility/EligibilityForm.tsx
'use client';

import {AnimatePresence, motion} from 'framer-motion';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {BadgeEuro, Earth, LucideIcon} from 'lucide-react';
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
    Info,
    Scale,
    BookOpen,
    Lightbulb,
    Tag,
    RefreshCw,
    Download,
    Repeat,
    PlayCircle,
    PauseCircle,
    ArrowLeft,
    ShieldCheck,
} from 'lucide-react';

import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion';
import {Progress} from '@/components/ui/progress';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import ValidationMessage from '@/components/ui/ValidationMessage';
import LegalReference from '@/components/ui/LegalReference';
import {ELIGIBILITY_STEPS} from '@/constants/eligibilitySteps';
import {useEligibilityForm} from '@/hooks/useEligibilityForm';
import {calculateEligibilityEngine} from '@/eligibility/engine';
import type {EligibilityData, StepId} from '@/types/eligibility';
import type {EligibilityResult} from '@/eligibility/engine';

// ✅ map vers composants (pas d’éléments JSX ici)
const STEP_ICON_MAP: Record<StepId, LucideIcon> = {
    seller: Building2,
    usage: Briefcase,
    itemCategory: Package,
    itemDetail: ShoppingBag,
    territory: Globe,
    timing: Clock,
    defect: AlertTriangle,
};

// ✅ map des options vers composants (pas d’éléments)
const OPTION_ICON_MAP: Record<string, LucideIcon> = {
    // --- Étape 3 (nouveau) : Catégorie
    'itemCategory-good': Package,
    'itemCategory-digital_service': Monitor,

    // --- Étape 4 (nouveau) : Détail
    'itemDetail-new': Tag,
    'itemDetail-used': RefreshCw,
    'itemDetail-one_off': Download,
    'itemDetail-subscription': Repeat,

    // --- Étape 6 (nouveau) : Timing
    'timing-ok': CheckCircle,
    'timing-ko': XCircle,
    'timing-during_contract': PlayCircle,
    'timing-after_contract': PauseCircle,
    'timing-generic': Clock,

    // ========= 👇 Anciennes questions à couvrir aussi =========
    // seller
    'seller-professional': Building2,
    'seller-individual': User,

    // usage
    'usage-personal': Home,
    'usage-professional': Briefcase,

    // territory
    'territory-eu': BadgeEuro,
    'territory-non_eu': Earth,

    // defect
    'defect-yes': AlertTriangle,
    'defect-no': CheckCircle,

    // (si l’ancienne étape "product" existe encore quelque part)
    'product-physical': Package,
    'product-digital': Monitor,
};

// Helpers d’instanciation dans le render
function StepIcon({stepId, className = 'w-6 h-6'}: {
    stepId: StepId;
    className?: string
}) {
    const Icon = STEP_ICON_MAP[stepId] ?? Info;
    return <Icon className={className} aria-hidden/>;
}

function getOptionIcon(stepId: string, value: string) {
    const Icon = OPTION_ICON_MAP[`${stepId}-${value}`];
    if (!Icon) return undefined;
    return <Icon className="w-5 h-5 text-blue-600" aria-hidden/>;
}

// Mapping des champs
const FIELD_BY_ID: Record<StepId, keyof EligibilityData> = {
    seller: 'sellerType',
    usage: 'usage',
    itemCategory: 'itemCategory',
    itemDetail: 'itemDetail',
    territory: 'territory',
    timing: 'timingAnswer',
    defect: 'hasDefect',
};

// Animations
const stepVariants = {
    initial: {opacity: 0, x: 0},
    animate: {opacity: 1, x: 0},
    exit: {opacity: 0, x: 0},
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
    const {
        currentStep,
        data,
        validations,
        setCurrentStep,
        setData,
    } = useEligibilityForm();
    const [showLegalNote, setShowLegalNote] = useState(false);
    const firstFieldRef = useRef<HTMLInputElement>(null);

    // Steps visibles = constants + projection dynamique
    const visibleSteps = React.useMemo(
        () => ELIGIBILITY_STEPS.map((s) => (s.dynamic ? {...s, ...s.dynamic(data)} : s)),
        [data],
    );

    useEffect(() => {
        if (currentStep >= visibleSteps.length) {
            setCurrentStep(Math.max(visibleSteps.length - 1, 0));
        }
    }, [currentStep, setCurrentStep, visibleSteps.length]);

    if (!visibleSteps.length) return null;

    const step = visibleSteps[currentStep];

    const getCurrentStepData = useCallback(() => {
        const fieldName = FIELD_BY_ID[step.id];
        return fieldName && data ? data[fieldName] : undefined;
    }, [step, data]);

    const calculateEligibility = useCallback((formData: EligibilityData): EligibilityResult => {
        try {
            return calculateEligibilityEngine(formData);
        } catch (error) {
            console.error('Erreur lors du calcul d’éligibilité:', error);
            return {isEligible: false, reasons: ['no_defect'], timing: {}};
        }
    }, []);

    const handleChoice = useCallback(
        (value: string | boolean) => {
            try {
                setShowLegalNote(false);
                if (!step) return;

                const fieldName = FIELD_BY_ID[step.id];
                if (!fieldName) return;

                const normalizedValue =
                    step.id === 'defect'
                        ? value === true || value === 'yes'
                        : value;

                const newData = {...data, [fieldName]: normalizedValue} as EligibilityData;
                setData(newData);

                const isIneligibleChoice =
                    (step.id === 'seller' && value === 'individual') ||
                    (step.id === 'usage' && value === 'professional') ||
                    (step.id === 'territory' && value === 'non_eu') ||
                    (step.id === 'timing' && (value === 'ko' || value === 'after_contract')) ||
                    (step.id === 'defect' && value === 'no');

                if (isIneligibleChoice) {
                    const result = calculateEligibility(newData);
                    onComplete?.(result, newData);
                    return;
                }

                if (currentStep < visibleSteps.length - 1) {
                    setCurrentStep(currentStep + 1);
                    onStepChange?.(currentStep + 1);
                } else {
                    const result = calculateEligibility(newData);
                    onComplete?.(result, newData);
                }
            } catch (error) {
                console.error('Erreur dans handleChoice:', error);
            }
        },
        [currentStep, data, step, setData, setCurrentStep, calculateEligibility, onComplete, onStepChange, visibleSteps.length],
    );

    const handlePrevious = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            onStepChange?.(currentStep - 1);
            setShowLegalNote(false);
        }
    }, [currentStep, setCurrentStep, onStepChange]);

    // Options + icônes instanciées à l’affichage (pas au niveau module)
    const enrichedOptions = step.ui.options?.map((option) => ({
        ...option,
        icon: getOptionIcon(step.id, option.value),
    }));

    const value = getCurrentStepData();
    const radioValue =
        step.id === 'defect' && typeof value === 'boolean'
            ? value
                ? 'yes'
                : 'no'
            : (value as string);
    const stepValidation = validations[currentStep];
    const progressValue = Math.round(((currentStep + 1) / visibleSteps.length) * 100);

    return (
        <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 ${className}`}>
            <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
                <div className="mb-4 flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-2 font-semibold text-gray-900">
                        <ShieldCheck className="h-4 w-4 text-blue-600" />
                        Diagnostic en {visibleSteps.length} étapes
                    </span>
                    <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-blue-700 shadow-sm">
                        {progressValue}%
                    </span>
                </div>
                <Progress value={progressValue} className="mb-6 shadow-inner" />

                <AnimatePresence mode="wait">
                    <motion.div key={currentStep} variants={stepVariants} initial="initial" animate="animate" exit="exit">
                        <Card className="border-blue-100 shadow-xl">
                            <CardHeader className="flex flex-row items-start gap-4 pb-4">
                                <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-3 text-white shadow-lg">
                                    <StepIcon stepId={step.id} />
                                </div>
                                <div className="space-y-1">
                                    <CardTitle className="text-xl md:text-2xl leading-tight">{step.title}</CardTitle>
                                    <CardDescription className="text-base text-gray-700">{step.question}</CardDescription>
                                    {step.description && (
                                        <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                                    )}
                                    <Badge className="mt-2 w-fit bg-blue-50 text-blue-700">Étape {currentStep + 1}</Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-0 space-y-4">
                                <Accordion
                                    type="single"
                                    collapsible
                                    value={showLegalNote ? 'legal' : ''}
                                    onValueChange={(val) => setShowLegalNote(Boolean(val))}
                                >
                                    <AccordionItem value="legal">
                                        <AccordionTrigger className="text-sm text-blue-700">
                                            <span className="flex items-center gap-2">
                                                <Info className="h-4 w-4" /> En savoir plus (bases légales)
                                            </span>
                                        </AccordionTrigger>
                                        <AccordionContent className="bg-white">
                                            <div className="space-y-3 text-sm text-gray-800">
                                                <div className="flex items-center gap-2 font-semibold text-blue-900">
                                                    <Scale className="h-4 w-4" /> Base légale
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {step.id === 'seller' && <LegalReference code="L.217-3" variant="badge" size="sm" />}
                                                    {step.id === 'usage' && <LegalReference code="LIMINAIRE" variant="badge" size="sm" />}
                                                    {step.id === 'itemCategory' && (
                                                        <>
                                                            <LegalReference code="L.217-3" variant="badge" size="sm" />
                                                            <LegalReference code="L.224-25-12" variant="badge" size="sm" />
                                                        </>
                                                    )}
                                                    {step.id === 'itemDetail' && (
                                                        <>
                                                            <LegalReference code="L.217-3" variant="badge" size="sm" />
                                                            <LegalReference code="L.217-7" variant="badge" size="sm" />
                                                            <LegalReference code="L.224-25-12" variant="badge" size="sm" />
                                                        </>
                                                    )}
                                                    {step.id === 'territory' && step.legal.article && (
                                                        <span className="text-xs italic text-blue-800">{step.legal.article}</span>
                                                    )}
                                                    {step.id === 'timing' && (
                                                        <>
                                                            <LegalReference code="L.217-3" variant="badge" size="sm" />
                                                            <LegalReference code="L.217-7" variant="badge" size="sm" />
                                                            <LegalReference code="L.224-25-12" variant="badge" size="sm" />
                                                        </>
                                                    )}
                                                    {step.id === 'defect' && <LegalReference code="L.217-5" variant="badge" size="sm" />}
                                                </div>

                                                {step.legal.explanation && (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 font-semibold text-blue-900">
                                                            <BookOpen className="h-4 w-4" /> Explication
                                                        </div>
                                                        <p className="leading-relaxed text-gray-700">{step.legal.explanation}</p>
                                                    </div>
                                                )}

                                                {step.legal.examples && step.legal.examples.length > 0 && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 font-semibold text-blue-900">
                                                            <Lightbulb className="h-4 w-4" /> Exemples
                                                        </div>
                                                        <ul className="space-y-1 text-gray-700">
                                                            {step.legal.examples.map((example, idx) => {
                                                                const isPositive = example.trim().startsWith('✅');
                                                                const isNegative = example.trim().startsWith('❌');
                                                                const cleanExample = example.replace(/^[✅❌]\s*/, '');
                                                                return (
                                                                    <li key={idx} className="flex items-start gap-2">
                                                                        {isPositive && <CheckCircle className="h-4 w-4 text-green-600" />}
                                                                        {isNegative && <XCircle className="h-4 w-4 text-orange-500" />}
                                                                        {!isPositive && !isNegative && <div className="mt-1 h-1 w-1 rounded-full bg-blue-600" />}
                                                                        <span>{cleanExample}</span>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>

                                <RadioGroup
                                    ref={firstFieldRef as any}
                                    value={radioValue}
                                    onValueChange={(val) => handleChoice(val)}
                                    className="space-y-3"
                                >
                                    {(enrichedOptions || step.ui.options)?.map((option) => (
                                        <RadioGroupItem
                                            key={`${step.id}-${option.value}`}
                                            value={String(option.value)}
                                            label={option.label}
                                            description={option.description}
                                            icon={getOptionIcon(step.id, option.value)}
                                        />
                                    ))}
                                </RadioGroup>

                                {stepValidation && !stepValidation.isValid && (
                                    <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} className="mt-2">
                                        <ValidationMessage
                                            type="error"
                                            message={stepValidation.error}
                                            className="rounded-xl border border-red-200 bg-red-50 text-red-800"
                                        />
                                    </motion.div>
                                )}
                            </CardContent>

                            <CardContent className="pt-0">
                                <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-gradient-to-r from-slate-50 to-white p-4 shadow-inner md:flex-row md:items-center md:justify-between">
                                    {['RGPD compliant', 'Simple & rapide', 'Service gratuit'].map((title) => (
                                        <div key={title} className="flex items-center gap-2">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-700">
                                                <CheckCircle className="h-5 w-5" />
                                            </div>
                                            <div className="text-sm font-semibold text-gray-800">{title}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>

                            <CardContent className="pt-0 pb-6">
                                <div className="flex items-center justify-between gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-fit"
                                        onClick={handlePrevious}
                                        disabled={currentStep === 0}
                                    >
                                        <ArrowLeft className="h-4 w-4" /> Retour
                                    </Button>
                                    <span className="text-xs text-gray-500">Répondez en moins de 60 secondes</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default EligibilityForm;
