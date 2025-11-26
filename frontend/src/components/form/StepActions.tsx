'use client';

import * as React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function StepActions({
                                      isFirstStep,
                                      isLastStep,
                                      onBack,
                                      onNext,
                                      backLabel = 'Retour',
                                      nextLabel = 'Continuer',
                                    }: {
  isFirstStep?: boolean;
  isLastStep?: boolean;
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
}) {
  return (
    <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 justify-between">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={isFirstStep}
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        {backLabel}
      </Button>

      <Button
        type="button"
        onClick={onNext}
        className="gap-2"
      >
        {nextLabel}
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
