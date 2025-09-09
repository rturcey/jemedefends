'use client';

import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';

import EligibilityForm from '@/components/eligibility/EligibilityForm';
import ResultPanel from '@/components/eligibility/ResultPanel';

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
  // le form reste monté en dessous
  const [result, setResult] = React.useState<Result | null>(null);
  const [leaving, setLeaving] = React.useState(false); // sortie animée du panel si besoin (recommencer)

  const handleComplete = (res: Result) => {
    setLeaving(false);
    setResult(res); // déclenche l’overlay résultat
  };

  const handleRestart = () => {
    setLeaving(true);
    // synchro avec l'animation d'exit du panel
    setTimeout(() => {
      setResult(null);
      setLeaving(false);
    }, 220);
  };

  return (
    <div className="relative">
      {/* Le formulaire reste TOUJOURS monté, donc pas de skeleton visible */}
      <EligibilityForm onComplete={handleComplete} onStepChange={() => {}} />

      {/* Overlay résultat au-dessus du form */}
      <AnimatePresence>
        {result && !leaving && (
          <>
            {/* Backdrop blanc qui masque tout ce qu’il y a dessous (form + éventuels skeletons) */}
            <motion.div
              key="eligibility-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="fixed inset-0 z-[70] bg-white"
              aria-hidden="true"
            />

            {/* Panneau résultat centré, avec une petite transition douce */}
            <motion.div
              key="eligibility-panel-wrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="fixed inset-0 z-[80] overflow-auto"
            >
              <div className="min-h-full flex items-start md:items-center justify-center pt-6 md:pt-10 px-4">
                <ResultPanel
                  result={result}
                  onRestart={handleRestart}
                  // pas de navigation ici : laisse ton bouton "Continuer" gérer /formulaire ailleurs
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
