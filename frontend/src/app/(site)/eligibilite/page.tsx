// frontend/src/app/(site)/eligibilite/page.tsx
'use client';

import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';

// Imports des skeletons
import { EligibilitySkeleton, ResultsSkeleton } from '@/components/ui/SkeletonSystem';

// Import du système de lazy load
import { deviceInfo, performanceMonitor } from '@/lib/performance';

// Types
import type { EligibilityResult } from '@/eligibility/engine';
import type { EligibilityData } from '@/types/eligibility';

// ==========================================
// LAZY LOADING DES COMPOSANTS
// ==========================================

// Header mobile - Chargé immédiatement sur mobile seulement
const MobileHeader = dynamic(() => import('@/components/layout/MobileHeader'), {
  loading: () => <div className="h-16 bg-white border-b animate-pulse" />,
  ssr: false,
});

// Formulaire d'éligibilité - Priorité haute
const LazyEligibilityForm = dynamic(
  () => import('@/components/eligibility/EligibilityForm'),
  {
    loading: () => <EligibilitySkeleton />,
    ssr: false,
  },
);

// Résultats - Préchargé pendant le remplissage du formulaire
const LazyResultsDisplay = dynamic(
  () => import('@/components/eligibility/ResultsDisplay'),
  {
    loading: () => <ResultsSkeleton />,
    ssr: false,
  },
);

// Modal exit intent - Chargé uniquement si nécessaire
const LazyExitIntentModal = dynamic(() => import('@/components/eligibility/ExitIntentModal'), {
  loading: () => null,
  ssr: false,
});

// Analytics - Chargé en arrière-plan
const LazyAnalytics = dynamic(
  () => import('@/hooks/useAnalytics').then(mod => ({
    default: mod.AnalyticsProvider,
  })),
  { ssr: false },
);

// ==========================================
// COMPOSANT PRINCIPAL OPTIMISÉ
// ==========================================
export default function OptimizedEligibilityPage() {
  const [currentView, setCurrentView] = useState<'form' | 'results'>('form');
  const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(null);
  const [formData, setFormData] = useState<EligibilityData | null>(null);
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [isFormLoaded, setIsFormLoaded] = useState(false);

  // Détection mobile
  const isMobile = deviceInfo.isMobile();
  const isSlowConnection = deviceInfo.isSlow();

  // ==========================================
  // PRÉCHARGEMENT INTELLIGENT
  // ==========================================
  useEffect(() => {
    // Démarrer le monitoring de performance
    performanceMonitor.start();

    // Précharger les composants suivants après 1 seconde
    const preloadTimer = setTimeout(() => {
      if (!isSlowConnection) {
        // Précharger les résultats
        import('@/components/eligibility/ResultsDisplay');
      }
    }, 1000);

    // Précharger l'exit intent après 3 secondes
    const exitTimer = setTimeout(() => {
      if (!isMobile && !isSlowConnection) {
        import('@/components/eligibility/ExitIntentModal');
      }
    }, 3000);

    return () => {
      clearTimeout(preloadTimer);
      clearTimeout(exitTimer);
      performanceMonitor.stop();
    };
  }, [isMobile, isSlowConnection]);

  // ==========================================
  // GESTION DE L'EXIT INTENT
  // ==========================================
  useEffect(() => {
    if (isMobile || currentView === 'results') return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !showExitIntent) {
        setShowExitIntent(true);
      }
    };

    // Activer uniquement après 5 secondes sur la page
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [currentView, showExitIntent, isMobile]);

  // ==========================================
  // HANDLERS
  // ==========================================
  const handleFormComplete = (result: EligibilityResult, data: EligibilityData) => {
    setEligibilityResult(result);
    setFormData(data);
    setCurrentView('results');

    // Scroll to top sur mobile
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToForm = () => {
    setCurrentView('form');
  };

  const handleFormLoad = () => {
    setIsFormLoaded(true);
  };

  // ==========================================
  // RENDU OPTIMISÉ
  // ==========================================
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Header mobile - Uniquement sur mobile */}
        {isMobile && (
          <Suspense fallback={<div className="h-16" />}>
            <MobileHeader />
          </Suspense>
        )}

        {/* Container principal avec padding adaptatif */}
        <main className={`${isMobile ? 'pt-16' : 'pt-8 md:pt-12'} pb-8 md:pb-16`}>
          <AnimatePresence mode="wait">
            {currentView === 'form' ? (
              // FORMULAIRE - Avec lazy loading optimisé
              <div key="form" className="w-full">
                {isMobile ? (
                  // Mobile: Chargement immédiat avec Suspense
                  <Suspense fallback={<EligibilitySkeleton />}>
                    <LazyEligibilityForm
                      onComplete={handleFormComplete}
                      onStepChange={step => {
                        // Précharger les composants des prochaines étapes
                        if (step === 3 && !isSlowConnection) {
                          import('@/components/eligibility/ResultsDisplay');
                        }
                      }}
                    />
                  </Suspense>
                ) : (
                  // Desktop: Direct import with fallback
                  <Suspense fallback={<EligibilitySkeleton />}>
                    <LazyEligibilityForm
                      onComplete={handleFormComplete}
                      onStepChange={step => {
                        // Précharger les composants des prochaines étapes
                        if (step === 3 && !isSlowConnection) {
                          import('@/components/eligibility/ResultsDisplay');
                        }
                      }}
                    />
                  </Suspense>
                )}
              </div>
            ) : (
              // RÉSULTATS - Lazy mais préchargé
              <div key="results" className="w-full">
                <Suspense fallback={<ResultsSkeleton />}>
                  <LazyResultsDisplay
                    result={eligibilityResult!}
                    data={formData!}
                    onRestart={handleBackToForm}
                  />
                </Suspense>
              </div>
            )}
          </AnimatePresence>
        </main>

        {/* Exit Intent Modal - Desktop uniquement */}
        {!isMobile && showExitIntent && (
          <Suspense fallback={null}>
            <LazyExitIntentModal
              isOpen={showExitIntent}
              onClose={() => setShowExitIntent(false)}
              currentStep={formData ? Object.keys(formData).length : 0}
            />
          </Suspense>
        )}
      </div>

      {/* Analytics Provider - Chargé en arrière-plan */}
      {isFormLoaded && (
        <Suspense fallback={null}>
          <LazyAnalytics />
        </Suspense>
      )}
    </>
  );
}