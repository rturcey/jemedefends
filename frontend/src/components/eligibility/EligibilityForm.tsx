'use client';

import * as React from 'react';

import LegalReference from '@/components/ui/LegalReference';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { ELIGIBILITY_STEPS } from '@/constants/eligibilitySteps';
import type { EligibilityResult } from '@/eligibility/engine';
import { useEligibilityForm } from '@/hooks/useEligibilityForm';
import { getSectionIcon } from '@/lib/icon-utils';
import { cn } from '@/lib/utils';
import type { EligibilityData, TimingAnswer } from '@/types/eligibility';
import { Clock, ShieldCheck, Sparkles } from 'lucide-react';

type Props = {
  onCompleteAction: (result: EligibilityResult, data: EligibilityData) => void;
  onStepChange?: (stepIndex: number) => void;
  onBlockingAnswer?: (reason: string) => void;
};

export default function EligibilityForm({ onCompleteAction, onStepChange, onBlockingAnswer }: Props) {
  const {
    currentStep,
    data,
    setData,
    goToNextStep,
    goToPreviousStep,
    validateStep,
    calculateEligibility,
    setValidations,
  } = useEligibilityForm();

  const step = ELIGIBILITY_STEPS[currentStep];
  const stepCount = ELIGIBILITY_STEPS.length;

  const stepContent = React.useMemo(() => {
    const overrides = step.dynamic?.(data as EligibilityData) ?? {};
    return { ...step, ...overrides, ui: { ...step.ui, ...(overrides.ui ?? {}) } } as (typeof ELIGIBILITY_STEPS)[number];
  }, [data, step]);

  React.useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);

  const getValueForStep = (stepId: string) => {
    switch (stepId) {
      case 'seller':
        return (data as EligibilityData).seller ?? (data as EligibilityData).sellerType;
      case 'timing':
        return (data as EligibilityData).timing ?? (data as EligibilityData).timingAnswer;
      case 'defect':
        return (data as EligibilityData).defect ?? (data as EligibilityData).hasDefect;
      default:
        return (data as any)[stepId as keyof EligibilityData];
    }
  };

  const selected = getValueForStep(stepContent.id);
  const validation = validateStep(currentStep, selected);
  const canNext = validation.isValid;

  const persistValue = (stepId: string, value: string) => {
    let nextData = data as EligibilityData;

    setData(prevData => {
      const updated: EligibilityData = { ...prevData };

      switch (stepId) {
        case 'seller':
          updated.seller = value;
          updated.sellerType = value;
          break;
        case 'timing': {
          const timing = value as TimingAnswer;
          updated.timing = timing;
          updated.timingAnswer = timing;
          updated.withinTwoYears = timing === 'ok' || timing === 'during_contract';
          break;
        }
        case 'defect': {
          const defect = value as 'yes' | 'no';
          updated.defect = defect;
          updated.hasDefect = defect === 'yes';
          break;
        }
        default:
          updated[stepId as keyof EligibilityData] = value as any;
      }

      nextData = updated;
      return updated;
    });

    return nextData;
  };

  const handleSelect = (value: string) => {
    const nextData = persistValue(stepContent.id, value);
    const result = validateStep(currentStep, value);
    setValidations?.(prev => ({ ...prev, [currentStep]: result }));

    if (result.blocking) {
      onBlockingAnswer?.(
        result.error ?? "Cette réponse vous oriente vers les alternatives à la garantie légale de conformité.",
      );
    }

    if (!result.isValid) return;

    if (currentStep === stepCount - 1) {
      const eligibility = calculateEligibility(nextData as EligibilityData);
      return onCompleteAction(eligibility, nextData as EligibilityData);
    }

    goToNextStep();
  };

  const submitIfLast = () => {
    if (!canNext) return;

    if (currentStep < stepCount - 1) {
      return goToNextStep();
    }

    const result = calculateEligibility(data as EligibilityData);
    onCompleteAction(result, data as EligibilityData);
  };

  const progress = Math.round(((currentStep + 1) / stepCount) * 100);
  const legalReferences = stepContent.legal?.references ?? [];
  const options = ((stepContent.ui as any).options ?? []) as {
    value: string;
    label: string;
    description?: string;
    icon?: string;
  }[];

  return (
    <section className="relative isolate bg-slate-50 px-4 py-8 sm:py-12">
      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-blue-700">Parcours garantie légale</p>
            <h1 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
              Vérifiez votre éligibilité
            </h1>
            <p className="text-sm text-slate-600 sm:text-base">
              Un diagnostic guidé pour confirmer si la garantie légale vous protège.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            Vos réponses restent privées
          </div>
        </div>

        <Card className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_18px_70px_rgba(15,23,42,0.06)]">
          <CardHeader className="space-y-5 border-b border-slate-100 bg-white/80 px-4 pb-4 pt-6 backdrop-blur sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-700">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-800">Étape {currentStep + 1} / {stepCount}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-800">{stepContent.title}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 shadow-inner">
                <Clock className="h-4 w-4 text-blue-600" />
                <div className="leading-tight">
                  <div>Progression</div>
                  <div className="text-xs font-normal text-slate-500">{progress}% complété</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Progress
                value={progress}
                className="h-2 rounded-full bg-blue-100"
                indicatorClassName="bg-gradient-to-r from-blue-600 to-indigo-600"
              />
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Un diagnostic guidé, étape par étape</span>
                <span className="font-semibold text-blue-700">{progress}%</span>
              </div>
            </div>

            {stepContent.description && (
              <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm text-slate-800 shadow-inner">
                <Sparkles className="mt-0.5 h-4 w-4 text-blue-600" />
                <p className="leading-relaxed text-slate-800">{stepContent.description}</p>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6 px-4 pb-6 pt-4 sm:px-6">
            {stepContent.legal && (
              <Accordion
                type="single"
                collapsible
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]"
              >
                <AccordionItem value="legal" className="border-0">
                  <AccordionTrigger className="px-4 text-left text-sm font-semibold text-slate-900">
                    <div className="flex flex-wrap items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-blue-700" />
                      <span>En savoir plus</span>
                      {legalReferences.map(code => (
                        <LegalReference key={code} code={code} variant="badge" size="sm" className="ml-1" />
                      ))}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 text-sm leading-relaxed text-slate-700">
                    <p className="mb-3 text-slate-700">{stepContent.legal.explanation}</p>
                    {stepContent.legal.examples?.length ? (
                      <ul className="space-y-1 text-slate-700">
                        {stepContent.legal.examples.map((e, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="mt-0.5 h-1 w-1 rounded-full bg-blue-600" />
                            <span>{e}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-5 shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{stepContent.question}</h2>
                {validation.error && <p className="text-sm font-semibold text-red-600">{validation.error}</p>}
              </div>

              <RadioGroup value={selected as string | undefined} onValueChange={handleSelect} className="grid gap-3">
                {options.map(opt => {
                  const icon = getSectionIcon(opt.icon, stepContent.id, 'radio', 'sm', 'h-5 w-5 text-blue-700');
                  const isSelected = selected === opt.value;
                  const optionId = `${stepContent.id}-${opt.value}`;
                  return (
                    <div key={opt.value} className="relative">
                      <RadioGroupItem value={opt.value} id={optionId} className="peer sr-only" />
                      <Label
                        htmlFor={optionId}
                        className={cn(
                          'group relative flex items-start gap-3 rounded-2xl border p-4 transition-all duration-200',
                          'cursor-pointer bg-white/90 shadow-sm hover:shadow-md backdrop-blur',
                          isSelected
                            ? 'border-blue-500 ring-2 ring-blue-100'
                            : 'border-slate-200 hover:border-blue-200',
                        )}
                      >
                        <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                          {icon}
                        </span>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 font-semibold text-slate-900">{opt.label}</div>
                          {opt.description && <div className="text-sm leading-relaxed text-slate-600">{opt.description}</div>}
                        </div>
                        <div className="absolute inset-y-3 right-4 hidden items-center text-xs font-semibold text-blue-700 opacity-0 transition-opacity group-hover:opacity-100 sm:flex">
                          Choisir →
                        </div>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-100 bg-white/90 p-4 sm:p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <Sparkles className="h-4 w-4 text-blue-600" /> Navigation rapide
                </div>
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={goToPreviousStep}
                    disabled={currentStep === 0}
                    className="rounded-xl border border-slate-200 bg-white text-slate-800 shadow-sm hover:border-blue-200 hover:text-blue-800"
                  >
                    ← Retour
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    onClick={submitIfLast}
                    disabled={!canNext}
                    className={cn(
                      'rounded-xl px-5 text-white',
                      'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
                      'disabled:opacity-60',
                    )}
                  >
                    {currentStep === stepCount - 1 ? 'Voir le résultat →' : 'Continuer'}
                  </Button>
                </div>
              </div>
              <Separator className="bg-slate-100" />
              <div className="grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" /> Garantie légale expliquée en clair
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-600" /> Résultat personnalisé en 2 minutes
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
