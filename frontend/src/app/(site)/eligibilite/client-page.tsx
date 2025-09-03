// src/app/(site)/eligibilite/client-page.tsx
'use client';

import React, { useState, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';

import { useExitIntent } from '@/hooks/useExitIntent';
import { useAnalytics } from '@/hooks/useApi';
import { trackEligibilityEvents } from '@/lib/analytics';
import type { EligibilityData } from '@/types/eligibility';
import Skeleton from '@/components/ui/Skeleton';

// ✅ Lazy (évite de charger tout d'un coup)
const EligibilityHero = dynamic(() => import('@/components/eligibility/EligibilityHero'), {
  loading: () => (
    <div className="p-6">
      <Skeleton className="h-8 w-48 mb-4" />
      <Skeleton className="h-10 w-64" />
    </div>
  ),
});

const EligibilityForm = dynamic(() => import('@/components/eligibility/EligibilityForm'), {
  loading: () => <FormSkeleton />,
});

const ResultsDisplay = dynamic(() => import('@/components/eligibility/ResultsDisplay'), {
  // IMPORTANT : fallback plein écran blanc pour ne jamais voir le form en-dessous
  loading: () => <ResultsOverlayFallback />,
});

// La modale peut être lourde (portals, etc.)
const ExitIntentModal = dynamic(() => import('@/components/eligibility/ExitIntentModal'), {
  ssr: false,
});

// ---- Skeletons spécifiques (mobile-first, simples et lisibles)
function FormSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Skeleton className="h-4 w-40 mb-4" />
      <Skeleton className="h-8 w-3/4 mb-6" />
      <div className="space-y-3">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="mt-6">
        <Skeleton className="h-10 w-44" />
      </div>
    </div>
  );
}

// Fallback “overlay” pour le lazy-load des résultats : full-screen blanc + placeholders
function ResultsOverlayFallback() {
  return (
    <div className="fixed inset-0 z-[80] bg-white">
      <div className="max-w-[640px] mx-auto pt-6 md:pt-10 px-4">
        <Skeleton className="h-8 w-52 mb-4" />
        <Skeleton className="h-6 w-80 mb-6" />
        <div className="space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </div>
  );
}

const viewVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  out: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

// Variants pour l’overlay de résultat (backdrop + panel)
const overlayBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

const overlayPanel = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.18, ease: 'easeIn' } },
};

const EligibilitePage: React.FC = () => {
  // On garde les 3 “états de vue” existants, mais on NE démonte plus le form pendant les résultats
  const [currentView, setCurrentView] = useState<'hero' | 'form' | 'results'>('hero');
  const [eligibilityData, setEligibilityData] = useState<EligibilityData>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);

  const { trackEvent } = useAnalytics();

  // Exit-intent uniquement pendant le form
  useExitIntent(() => {
    if (currentView === 'form' && currentStep > 0) {
      setShowExitModal(true);
      trackEligibilityEvents.exitIntentTriggered(currentStep);
    }
  });

  const handleStartTest = useCallback(() => {
    trackEligibilityEvents.testStarted('hero_cta');
    setCurrentView('form');
  }, []);

  const handleFormComplete = useCallback((data: EligibilityData) => {
    setEligibilityData(data);
    setCurrentView('results'); // ⚠️ on passe en "results" mais on ne démonte pas le form (voir rendu plus bas)
    trackEligibilityEvents.testCompleted((data as any).isEligible ? 'eligible' : 'not_eligible');
  }, []);

  const handleRestart = useCallback(() => {
    trackEvent('eligibility_test_restarted');
    setCurrentView('hero');
    setCurrentStep(0);
    setEligibilityData({});
  }, [trackEvent]);

  const handleStepChange = useCallback((step: number) => setCurrentStep(step), []);

  return (
    <main className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {currentView === 'hero' && (
          <motion.section
            key="hero"
            variants={viewVariants}
            initial="initial"
            animate="in"
            exit="out"
          >
            <Suspense
              fallback={
                <div className="p-6">
                  <Skeleton className="h-10 w-64" />
                </div>
              }
            >
              <EligibilityHero onStartTest={handleStartTest} />
            </Suspense>
          </motion.section>
        )}

        {/* ⚠️ Le formulaire reste monté pendant 'form' ET 'results' */}
        {(currentView === 'form' || currentView === 'results') && (
          <motion.section
            key="form"
            variants={viewVariants}
            initial="initial"
            animate="in"
            exit="out"
          >
            <Suspense fallback={<FormSkeleton />}>
              <EligibilityForm onComplete={handleFormComplete} onStepChange={handleStepChange} />
            </Suspense>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Overlay des résultats : couvre le form, transition douce, aucun skeleton visible derrière */}
      <AnimatePresence>
        {currentView === 'results' && (
          <>
            {/* Backdrop blanc couvrant */}
            <motion.div
              key="results-backdrop"
              {...overlayBackdrop}
              className="fixed inset-0 z-[70] bg-white"
              aria-hidden="true"
            />
            {/* Panel résultats centré */}
            <motion.div
              key="results-panel"
              {...overlayPanel}
              className="fixed inset-0 z-[80] overflow-auto"
            >
              <div className="min-h-full flex items-start md:items-center justify-center pt-6 md:pt-10 px-4">
                <Suspense fallback={<ResultsOverlayFallback />}>
                  <ResultsDisplay data={eligibilityData} onRestart={handleRestart} />
                </Suspense>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modale (lazy + no-SSR) */}
      <ExitIntentModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onContinue={() => setShowExitModal(false)}
      />
    </main>
  );
};

export default EligibilitePage;
