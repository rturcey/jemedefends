// src/app/(site)/eligibilite/page.tsx - VERSION OPTIMISÉE
'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence } from 'framer-motion';

// Imports des skeletons
import { EligibilitySkeleton, ResultsSkeleton } from '@/components/ui/SkeletonSystem';

// Import du système de lazy load
import { LazyLoadWrapper, useLazyLoad } from '@/hooks/useLazyLoad';
import { deviceInfo, performanceMonitor } from '@/lib/performance';

// Types
import type { EligibilityResult } from '@/eligibility/engine';
import type { EligibilityData } from '@/types/eligibility';

// ==========================================
// LAZY LOADING DES COMPOSANTS
// ==========================================

// Header mobile - Chargé immédiatement sur mobile seulement
const MobileHeader = dynamic(() => import('@/components/MobileHeader'), {
  loading: () => <div className="h-16 bg-white border-b animate-pulse" />,
  ssr: false,
});

// Formulaire d'éligibilité - Priorité haute
const LazyEligibilityForm = lazy(() =>
  import('@/components/eligibility/EligibilityForm').then(mod => ({
    default: mod.default,
  })),
);

// Résultats - Préchargé pendant le remplissage du formulaire
const LazyResultsDisplay = lazy(() => import('@/components/eligibility/ResultsDisplay'));

// Modal exit intent - Chargé uniquement si nécessaire
const LazyExitIntentModal = dynamic(() => import('@/components/eligibility/ExitIntentModal'), {
  loading: () => null,
  ssr: false,
});

// Analytics - Chargé en arrière-plan
const LazyAnalytics = dynamic(
  () =>
    import('@/hooks/useAnalytics').then(mod => ({
      default: mod.AnalyticsProvider,
    })),
  { ssr: false },
);

// ==========================================
// SKELETON SPÉCIFIQUE ÉLIGIBILITÉ
// ==========================================

function EligibilityFormSkeleton() {
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      {/* Progress bar */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div
              key={i}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 animate-pulse"
              style={{ animationDelay: `${i * 50}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Question card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="h-7 md:h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 md:h-5 w-1/2 bg-gray-100 rounded animate-pulse mb-6" />

        {/* Options */}
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="h-16 md:h-18 bg-gray-100 rounded-xl animate-pulse"
              style={{ animationDelay: `${100 + i * 50}ms` }}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <div className="w-24 h-11 bg-gray-200 rounded-lg animate-pulse" />
          <div className="w-32 h-11 bg-blue-100 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Info box */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <div className="h-4 w-full bg-blue-100 rounded animate-pulse mb-2" />
        <div className="h-4 w-3/4 bg-blue-100 rounded animate-pulse" />
      </div>
    </div>
  );
}

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
        // Précharger les sections de résultats
        import('@/components/eligibility/EligibleResult');
        import('@/components/eligibility/IneligibleResult');
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
                  <Suspense fallback={<EligibilityFormSkeleton />}>
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
                  // Desktop: LazyLoadWrapper avec IntersectionObserver
                  <LazyLoadWrapper
                    importFn={() => import('@/components/eligibility/EligibilityForm')}
                    fallback={<EligibilityFormSkeleton />}
                    options={{
                      threshold: 0,
                      rootMargin: '0px',
                      priority: 'high',
                      onLoad: handleFormLoad,
                    }}
                    componentProps={{
                      onComplete: handleFormComplete,
                      onStepChange: (step: number) => {
                        if (step === 3 && !isSlowConnection) {
                          import('@/components/eligibility/ResultsDisplay');
                        }
                      },
                    }}
                  />
                )}
              </div>
            ) : (
              // RÉSULTATS - Lazy mais préchargé
              <div key="results" className="w-full">
                <Suspense fallback={<ResultsSkeleton />}>
                  <LazyResultsDisplay
                    result={eligibilityResult!}
                    data={formData!}
                    onBack={handleBackToForm}
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

// ==========================================
// EXPORT DE LA METADATA POUR NEXT.JS
// ==========================================

export const metadata = {
  title: 'Vérifiez votre éligibilité - Je me défends',
  description: 'Testez en 2 minutes si vous pouvez bénéficier de la garantie légale de conformité.',
  openGraph: {
    title: 'Testez votre éligibilité à la garantie légale',
    description: 'Découvrez en quelques questions si vous pouvez faire valoir vos droits.',
  },
};
