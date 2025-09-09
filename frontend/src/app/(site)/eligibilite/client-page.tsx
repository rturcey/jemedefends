// frontend/src/app/(site)/eligibilite/client-page.tsx - CORRECTION ERREUR 500

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import React, { useState, useCallback, Suspense } from 'react';

import EligibilityForm from '@/components/eligibility/EligibilityForm';
import EligibilityHero from '@/components/eligibility/EligibilityHero';
import ResultsDisplay from '@/components/eligibility/ResultsDisplay';
import { Skeleton } from '@/components/ui';
import { useAnalytics } from '@/hooks/useApi';
import { useExitIntent } from '@/hooks/useExitIntent';
import { trackEligibilityEvents } from '@/lib/analytics';
import type { EligibilityData } from '@/types/eligibility';

// CORRECTION: Imports statiques pour éviter les erreurs de lazy loading

// Seul le modal reste en lazy loading (non critique)
const ExitIntentModal = dynamic(() => import('@/components/eligibility/ExitIntentModal'), {
  ssr: false,
  loading: () => null, // Pas de skeleton pour le modal
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

// Fallback "overlay" pour le lazy-load des résultats : full-screen blanc + placeholders
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

// CORRECTION: ErrorBoundary spécifique pour les composants d'éligibilité
class EligibilityErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: () => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; onError?: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('EligibilityErrorBoundary caught error:', error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Eligibility component error:', error, errorInfo);
    this.props.onError?.();
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="max-w-md text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Erreur de chargement</h2>
            <p className="text-gray-600 mb-6">
              Une erreur s'est produite lors du chargement du test d'éligibilité.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const viewVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  out: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

// Variants pour l'overlay de résultat (backdrop + panel)
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
  // On garde les 3 "états de vue" existants, mais on NE démonte plus le form pendant les résultats
  const [currentView, setCurrentView] = useState<'hero' | 'form' | 'results'>('hero');
  const [eligibilityData, setEligibilityData] = useState<EligibilityData>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const [hasError, setHasError] = useState(false);

  // CORRECTION: Gestion sécurisée des hooks avec fallback
  let trackEvent = () => {};
  try {
    const analytics = useAnalytics();
    trackEvent = analytics.trackEvent;
  } catch (error) {
    console.warn('Analytics hook error:', error);
  }

  // CORRECTION: Exit-intent sécurisé
  try {
    useExitIntent(() => {
      if (currentView === 'form' && currentStep > 0 && !hasError) {
        setShowExitModal(true);
        try {
          trackEligibilityEvents.exitIntentTriggered(currentStep);
        } catch (error) {
          console.warn('Exit intent tracking error:', error);
        }
      }
    });
  } catch (error) {
    console.warn('Exit intent hook error:', error);
  }

  const handleStartTest = useCallback(() => {
    try {
      trackEligibilityEvents.testStarted('hero_cta');
    } catch (error) {
      console.warn('Tracking error:', error);
    }
    setCurrentView('form');
  }, []);

  const handleFormComplete = useCallback((data: EligibilityData) => {
    setEligibilityData(data);
    setCurrentView('results'); // ⚠️ on passe en "results" mais on ne démonte pas le form (voir rendu plus bas)

    try {
      trackEligibilityEvents.testCompleted((data as any).isEligible ? 'eligible' : 'not_eligible');
    } catch (error) {
      console.warn('Tracking error:', error);
    }
  }, []);

  const handleRestart = useCallback(() => {
    try {
      trackEvent('eligibility_test_restarted');
    } catch (error) {
      console.warn('Tracking error:', error);
    }
    setCurrentView('hero');
    setCurrentStep(0);
    setEligibilityData({});
  }, [trackEvent]);

  const handleStepChange = useCallback((step: number) => setCurrentStep(step), []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Erreur de chargement</h2>
          <p className="text-gray-600 mb-6">
            Une erreur s'est produite. Veuillez recharger la page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Recharger la page
          </button>
        </div>
      </div>
    );
  }

  return (
    <EligibilityErrorBoundary onError={handleError}>
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

        {/* Modale (lazy + no-SSR) - gestion d'erreur robuste */}
        {showExitModal && (
          <Suspense fallback={null}>
            <ExitIntentModal
              isOpen={showExitModal}
              onClose={() => setShowExitModal(false)}
              onContinue={() => setShowExitModal(false)}
            />
          </Suspense>
        )}
      </main>
    </EligibilityErrorBoundary>
  );
};

export default EligibilitePage;
