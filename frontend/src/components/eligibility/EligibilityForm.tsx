'use client';

import * as React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getSectionIcon } from '@/lib/icon-utils';
import { ELIGIBILITY_STEPS } from '@/constants/eligibilitySteps';
import { useEligibilityForm } from '@/hooks/useEligibilityForm';
import type { EligibilityData, TimingAnswer } from '@/types/eligibility';
import type { EligibilityResult } from '@/eligibility/engine';
import { cn } from '@/lib/utils';
import { ShieldCheck, Sparkles } from 'lucide-react';

type Props = {
  onCompleteAction: (result: EligibilityResult, data: EligibilityData) => void;
  onStepChange?: (stepIndex: number) => void;
};

export default function EligibilityForm({ onCompleteAction, onStepChange }: Props) {
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

  return (
    <section className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 py-6 sm:py-10">
      <div className="absolute inset-x-4 -top-6 bottom-4 bg-gradient-to-b from-blue-50 via-white to-white blur-[1px]" />
      <Card className="relative rounded-2xl border-gray-200 shadow-[0_10px_50px_rgba(15,23,42,0.08)]">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <Badge variant="outline" className="rounded-full border-blue-200 bg-blue-50 text-blue-800">
                  Étape {currentStep + 1} / {stepCount}
                </Badge>
                <span className="hidden sm:inline text-gray-400">Parcours garantie légale</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
                Vérifiez votre éligibilité
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                2 minutes pour confirmer si la garantie légale vous protège.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-900">
              <ShieldCheck className="h-4 w-4" />
              <span>{stepContent.title}</span>
            </div>
          </div>

          <Progress value={progress} className="h-2 rounded-full" />

          {stepContent.description && (
            <div className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-sm text-slate-700">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <p>{stepContent.description}</p>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {stepContent.legal && (
            <Alert className="bg-blue-50 border-blue-200 text-sm text-blue-900 rounded-xl">
              <div className="font-semibold">{stepContent.legal.article}</div>
              <div className="mt-1 text-blue-800">{stepContent.legal.explanation}</div>
              {stepContent.legal.examples?.length ? (
                <ul className="mt-2 list-disc pl-5 text-blue-800 space-y-1">
                  {stepContent.legal.examples.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              ) : null}
            </Alert>
          )}

          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">{stepContent.question}</h2>
              {validation.error && (
                <p className="text-sm font-medium text-red-600">{validation.error}</p>
              )}
            </div>

            <RadioGroup
              value={selected as string | undefined}
              onValueChange={handleSelect}
              className="grid gap-3"
            >
              {((stepContent.ui as any).options ?? []).map((opt: any) => {
                const icon = getSectionIcon(opt.icon, stepContent.id, 'radio', 'sm');
                const isSelected = selected === opt.value;
                return (
                  <Label
                    key={opt.value}
                    className={cn(
                      'flex items-start gap-3 rounded-xl border p-4 transition-colors',
                      'cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
                      isSelected
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50',
                    )}
                  >
                    <RadioGroupItem value={opt.value} className="mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="font-semibold text-gray-900 flex items-center gap-2">
                        {icon}
                        {opt.label}
                      </div>
                      {opt.description && (
                        <div className="text-sm text-gray-600 mt-0.5">{opt.description}</div>
                      )}
                    </div>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
              className="rounded-xl"
            >
              ← Retour
            </Button>

            <Button
              type="button"
              variant="brand"
              onClick={submitIfLast}
              disabled={!canNext}
              className={cn(
                'rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600',
                'hover:from-blue-700 hover:to-indigo-700',
              )}
            >
              {currentStep === stepCount - 1 ? 'Voir le résultat →' : 'Continuer'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
