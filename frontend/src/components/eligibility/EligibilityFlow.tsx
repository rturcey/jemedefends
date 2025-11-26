'use client';

import * as React from 'react';

import EligibilityForm from '@/components/eligibility/EligibilityForm';
import ResultPanel from '@/components/eligibility/ResultPanel';
import {Dialog, DialogContent} from '@/components/ui/dialog';

type Result = {
  isEligible: boolean;
  reasons?: string[];
  timing?: {
    monthsSincePurchase?: number;
    withinTwoYears?: boolean;
    presumptionSellerBurden?: boolean;
  };
};

export default function EligibilityFlow() {
  const [result, setResult] = React.useState<Result | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [formResetKey, setFormResetKey] = React.useState(0);

  const handleComplete = (res: Result) => {
    setResult(res);
    setDialogOpen(true);
  };

  const handleRestart = () => {
    setDialogOpen(false);
    setResult(null);
    setFormResetKey((key) => key + 1);
  };

  return (
    <div className="relative">
      <EligibilityForm key={formResetKey} onComplete={handleComplete} onStepChange={() => {}} />

      <Dialog
        open={dialogOpen && Boolean(result)}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) setResult(null);
        }}
      >
        <DialogContent className="p-0 sm:p-4">
          {result && <ResultPanel result={result} onRestart={handleRestart} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}