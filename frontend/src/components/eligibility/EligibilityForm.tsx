'use client';

import * as React from 'react';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { getSectionIcon } from '@/lib/icon-utils';
import { ELIGIBILITY_STEPS } from '@/constants/eligibilitySteps';
import { useEligibilityForm } from '@/hooks/useEligibilityForm';
import type { EligibilityData, TimingAnswer } from '@/types/eligibility';
import type { EligibilityResult } from '@/eligibility/engine';
import { cn } from '@/lib/utils';
import { Clock, ShieldCheck, Sparkles, Zap } from 'lucide-react';

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
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#eef4ff] via-white to-white px-4 py-8 sm:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_-10%,rgba(59,130,246,0.12),transparent_35%),radial-gradient(circle_at_90%_0%,rgba(99,102,241,0.12),transparent_32%)]" />
      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600">
            <Badge variant="outline" className="rounded-full border-blue-200 bg-blue-50 text-blue-900">
              Parcours garantie légale
            </Badge>
            <Badge variant="outline" className="rounded-full border-slate-200 bg-white text-slate-800">
              Test gratuit
            </Badge>
            <div className="flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
              <Zap className="h-3.5 w-3.5" /> 2 min chrono
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            Vos réponses restent privées
          </div>
        </div>

        <Card className="relative overflow-hidden rounded-3xl border-slate-100 shadow-[0_18px_70px_rgba(15,23,42,0.08)]">
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-blue-50 via-white to-indigo-50" />
          <CardHeader className="relative space-y-4 pb-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-600">
                  <Badge variant="secondary" className="rounded-full bg-white text-slate-900 shadow-sm">
                    Étape {currentStep + 1} / {stepCount}
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-blue-200 bg-blue-50 text-blue-900">
                    {stepContent.title}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                    Vérifiez votre éligibilité
                  </h1>
                  <p className="text-sm sm:text-base text-slate-600">
                    Un diagnostic guidé pour confirmer si la garantie légale vous protège.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                <div className="leading-tight">
                  <div>Progression</div>
                  <div className="text-xs font-normal text-slate-500">{progress}% complété</div>
                </div>
              </div>
            </div>

            <Progress value={progress} className="h-2 rounded-full bg-slate-100" />

            {stepContent.description && (
              <div className="flex items-start gap-2 rounded-2xl border border-blue-100 bg-blue-50/80 px-3 py-2 text-sm text-slate-800 shadow-inner">
                <Sparkles className="h-4 w-4 text-blue-500" />
                <p className="leading-relaxed">{stepContent.description}</p>
              </div>
            )}
          </CardHeader>

          <CardContent className="relative space-y-6 pb-6">
            {stepContent.legal && (
              <Alert className="border-blue-200 bg-blue-50/80 text-sm text-blue-900 rounded-2xl shadow-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="font-semibold">{stepContent.legal.article}</div>
                  <Badge variant="outline" className="rounded-full border-white/40 bg-white/80 text-blue-900">
                    Garantie légale = vendeur pro → consommateur
                  </Badge>
                </div>
                <div className="mt-2 text-blue-900/90 leading-relaxed">{stepContent.legal.explanation}</div>
                {stepContent.legal.examples?.length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-blue-900/90">
                    {stepContent.legal.examples.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                ) : null}
              </Alert>
            )}

            <div className="space-y-4 rounded-2xl border border-slate-100 bg-white/80 p-4 shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">{stepContent.question}</h2>
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
                        'group relative flex items-start gap-3 rounded-2xl border p-4 transition-all duration-200',
                        'cursor-pointer bg-white/90 shadow-sm hover:shadow-md backdrop-blur',
                        isSelected ? 'border-blue-300 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-200',
                      )}
                    >
                      <RadioGroupItem value={opt.value} className="mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 font-semibold text-slate-900">
                          {icon}
                          {opt.label}
                        </div>
                        {opt.description && (
                          <div className="text-sm text-slate-600 leading-relaxed">{opt.description}</div>
                        )}
                      </div>
                      <div className="absolute inset-y-3 right-4 hidden sm:flex items-center text-xs font-semibold text-blue-700 opacity-0 transition-opacity group-hover:opacity-100">
                        Choisir →
                      </div>
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-100 bg-white/80 p-4 sm:p-5 shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
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
                    variant="brand"
                    onClick={submitIfLast}
                    disabled={!canNext}
                    className={cn(
                      'rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 px-5',
                      'hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60',
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
