'use client';

import * as React from 'react';
import EligibilityForm from '@/components/eligibility/EligibilityForm';
import ResultsOverlay from '@/components/eligibility/ResultsOverlay';
import type { EligibilityResult } from '@/eligibility/engine';
import type { EligibilityData } from '@/types/eligibility';

export default function EligibilityPage() {
  const [result, setResult] = React.useState<EligibilityResult | null>(null);
  const [data, setData] = React.useState<EligibilityData | null>(null);

  return (
    <>
      <EligibilityForm
        onCompleteAction={(r, d) => {
          setResult(r);
          setData(d);
        }}
      />

      <ResultsOverlay
        open={!!result}
        onRestart={() => setResult(null)}
        tone={result?.isEligible ? 'success' : 'error'}
        title={result?.isEligible ? 'Bonne nouvelle !' : 'Pas éligible'}
        subtitle={
          result?.isEligible
            ? 'Vous pouvez invoquer la garantie légale de conformité.'
            : 'Les conditions légales ne semblent pas réunies.'
        }
        bullets={result?.reasons}
        primaryCtaLabel={result?.isEligible ? 'Créer ma lettre' : undefined}
        primaryCtaHref={result?.isEligible ? '/formulaire' : undefined}
      />
    </>
  );
}
