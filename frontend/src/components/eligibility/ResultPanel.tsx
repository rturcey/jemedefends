'use client';

import * as React from 'react';

export default function ResultPanel({
  result,
  onRestart,
  onContinue, // optionnel : si tu veux un bouton "Continuer" ici, tu lui passes une callback depuis le parent
}: {
  result: any;
  onRestart: () => void;
  onContinue?: () => void;
}) {
  const ok = Boolean(result?.isEligible);

  return (
    <div className="w-full max-w-[640px]">
      <div
        className={`rounded-2xl border p-6 ${
          ok ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'
        }`}
      >
        <h2 className="text-xl font-semibold">
          {ok ? 'Éligible à la garantie légale ✅' : 'Non éligible à la garantie légale ❌'}
        </h2>

        {result?.timing && (
          <p className="mt-2 text-sm text-gray-700">
            {typeof result.timing.withinTwoYears === 'boolean' && (
              <>Ancienneté : {result.timing.withinTwoYears ? '≤ 24 mois' : '> 24 mois'}.</>
            )}
            {result.timing?.presumptionSellerBurden === false && (
              <> La présomption ne s’applique plus automatiquement (&gt; 12 mois).</>
            )}
          </p>
        )}

        {Array.isArray(result?.reasons) && result.reasons.length > 0 && (
          <ul className="mt-3 list-disc pl-5 text-sm text-gray-700">
            {result.reasons.map((r: string, i: number) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {ok ? (
            // Laisse onContinue déclencher /formulaire ailleurs ; pas de transition gérée ici
            <button
              type="button"
              onClick={onContinue}
              className="inline-flex items-center rounded-xl bg-gray-900 text-white px-4 py-2 font-medium"
            >
              Continuer
            </button>
          ) : (
            <button
              type="button"
              onClick={onRestart}
              className="inline-flex items-center rounded-xl bg-gray-100 text-gray-800 px-4 py-2 font-medium"
            >
              Recommencer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
