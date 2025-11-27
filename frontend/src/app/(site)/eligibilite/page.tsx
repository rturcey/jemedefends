'use client';

import * as React from 'react';
import EligibilityForm from '@/components/eligibility/EligibilityForm';
import ResultsOverlay from '@/components/eligibility/ResultsOverlay';
import type { EligibilityResult } from '@/eligibility/engine';
import type { EligibilityData } from '@/types/eligibility';

export default function EligibilityPage() {
  const [result, setResult] = React.useState<EligibilityResult | null>(null);
  const [data, setData] = React.useState<EligibilityData | null>(null);
  const [formRun, setFormRun] = React.useState(0);
  const [blockingReason, setBlockingReason] = React.useState<string | null>(null);

  const ALTERNATIVES_GUIDE_HREF = '/guide/telephonie-garantie-legale#alternatives';

  return (
    <>
      <EligibilityForm
        key={formRun}
        onCompleteAction={(r, d) => {
          setResult(r);
          setData(d);
        }}
        onBlockingAnswer={reason => {
          setBlockingReason(reason);
          setResult(null);
        }}
      />

      <ResultsOverlay
        open={!!result}
        onRestart={() => {
          setResult(null);
          setData(null);
          setFormRun(prev => prev + 1);
        }}
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

      <ResultsOverlay
        open={!!blockingReason}
        onRestart={() => setBlockingReason(null)}
        tone="error"
        title="Parcours alternatif recommandé"
        subtitle="Cette réponse ne permet pas d'activer la garantie légale. Consultez le guide des alternatives."
        bullets={blockingReason ? [blockingReason] : undefined}
        primaryCtaLabel="Voir le guide des alternatives"
        primaryCtaHref={ALTERNATIVES_GUIDE_HREF}
        secondaryCtaLabel="Modifier mes réponses"
      />
    </>
  );
}
