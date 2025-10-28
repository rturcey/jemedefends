// src/app/(site)/formulaire/page.tsx - FORMULAIRE OPTIMISÉ AVEC LAZY LOADING
'use client';

import { useState, useEffect, Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import type { Metadata } from 'next';

// Import des skeletons
import { FormSkeleton, Skeleton } from '@/components/ui/SkeletonSystem';
import { LazyLoadWrapper } from '@/hooks/useLazyLoad';
import { deviceInfo, performanceMonitor } from '@/lib/performance';

// ==========================================
// LAZY IMPORTS DES COMPOSANTS
// ==========================================

// Étapes du formulaire - Chargées progressivement
const LazyStep1PersonalInfo = lazy(() => import('@/components/form/steps/Step1PersonalInfo'));

const LazyStep2SellerInfo = lazy(() => import('@/components/form/steps/Step2SellerInfo'));

const LazyStep3ProblemDetails = lazy(() => import('@/components/form/steps/Step3ProblemDetails'));

const LazyStep4Review = lazy(() => import('@/components/form/steps/Step4Review'));

// Preview de la lettre - Chargé à la demande
const LazyLetterPreview = dynamic(() => import('@/components/form/LetterPreview'), {
  loading: () => (
    <div className="bg-white rounded-lg p-8 shadow-lg animate-pulse">
      <Skeleton variant="text" width="60%" className="mb-4" />
      <Skeleton variant="text" lines={15} />
    </div>
  ),
  ssr: false,
});

// Composants de paiement - Chargés uniquement si nécessaire
const LazyPaymentModal = dynamic(() => import('@/components/payment/PaymentModal'), {
  loading: () => null,
  ssr: false,
});

// Legal references - Chargées en arrière-plan
const LazyLegalReferences = dynamic(() => import('@/components/legal/LegalReferences'), {
  loading: () => null,
  ssr: false,
});

// ==========================================
// SKELETON DU FORMULAIRE PERSONNALISÉ
// ==========================================

const FormStepSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
    {/* Header */}
    <div className="flex items-center gap-3 mb-6">
      <Skeleton variant="circular" width="48px" height="48px" />
      <div>
        <Skeleton variant="text" width="200px" className="mb-2" />
        <Skeleton variant="text" width="150px" height="16px" />
      </div>
    </div>

    {/* Form fields */}
    <div className="space-y-6">
      {[1, 2, 3].map(i => (
        <div key={i}>
          <Skeleton variant="text" width="120px" className="mb-2" />
          <Skeleton variant="rectangular" height="48px" className="rounded-lg" delay={i * 50} />
        </div>
      ))}
    </div>

    {/* Navigation */}
    <div className="flex justify-between mt-8">
      <Skeleton variant="button" width="100px" />
      <Skeleton variant="button" width="120px" />
    </div>
  </div>
);

// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================

interface FormData {
  // Étape 1 - Infos personnelles
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  zipCode: string;
  city: string;

  // Étape 2 - Infos vendeur
  sellerName: string;
  sellerType: 'company' | 'marketplace';
  sellerAddress?: string;
  orderNumber: string;
  orderDate: string;

  // Étape 3 - Détails du problème
  productName: string;
  productPrice: number;
  problemType: string;
  problemDescription: string;
  defectDate: string;
  previousAttempts: string;

  // Options
  formula: 'free' | 'premium' | 'pro';
  sendingMethod?: 'download' | 'email' | 'registered';
}

export default function OptimizedFormulairePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);

  // Détection de l'appareil
  const isMobile = deviceInfo.isMobile();
  const isSlow = deviceInfo.isSlow();

  // ==========================================
  // PRÉCHARGEMENT INTELLIGENT DES ÉTAPES
  // ==========================================

  useEffect(() => {
    // Précharger la prochaine étape
    const preloadNextStep = () => {
      if (!isSlow) {
        switch (currentStep) {
          case 1:
            import('@/components/form/steps/Step2SellerInfo');
            break;
          case 2:
            import('@/components/form/steps/Step3ProblemDetails');
            break;
          case 3:
            import('@/components/form/steps/Step4Review');
            import('@/components/form/LetterPreview'); // Précharger le preview
            break;
        }
      }
    };

    // Délai pour éviter de surcharger
    const timer = setTimeout(preloadNextStep, 500);
    return () => clearTimeout(timer);
  }, [currentStep, isSlow]);

  // ==========================================
  // HANDLERS
  // ==========================================

  const handleNextStep = (stepData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      // Scroll to top sur mobile
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Dernière étape - Générer la lettre
      handleGenerateLetter();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateLetter = async () => {
    setIsGenerating(true);

    try {
      // Simuler la génération (remplacer par l'appel API réel)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Selon la formule choisie
      if (formData.formula === 'free') {
        // Version gratuite - Afficher directement
        setGeneratedLetter('Contenu de la lettre générée...');
        setShowPreview(true);
      } else {
        // Version payante - Afficher le paiement
        setShowPayment(true);
      }
    } catch (error) {
      console.error('Erreur génération:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // ==========================================
  // RENDU DES ÉTAPES AVEC LAZY LOADING
  // ==========================================

  const renderStep = () => {
    const stepProps = {
      data: formData,
      onNext: handleNextStep,
      onPrevious: handlePreviousStep,
    };

    switch (currentStep) {
      case 1:
        return (
          <Suspense fallback={<FormStepSkeleton />}>
            <LazyStep1PersonalInfo {...stepProps} />
          </Suspense>
        );
      case 2:
        return (
          <Suspense fallback={<FormStepSkeleton />}>
            <LazyStep2SellerInfo {...stepProps} />
          </Suspense>
        );
      case 3:
        return (
          <Suspense fallback={<FormStepSkeleton />}>
            <LazyStep3ProblemDetails {...stepProps} />
          </Suspense>
        );
      case 4:
        return (
          <Suspense fallback={<FormStepSkeleton />}>
            <LazyStep4Review {...stepProps} isGenerating={isGenerating} />
          </Suspense>
        );
      default:
        return null;
    }
  };

  // ==========================================
  // RENDU PRINCIPAL
  // ==========================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header avec progress bar */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl md:text-2xl font-bold">Créer ma lettre de mise en demeure</h1>
            <span className="text-sm text-gray-500">Étape {currentStep} sur 4</span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Container principal */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire - 2/3 sur desktop */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar - 1/3 sur desktop */}
          <div className="lg:col-span-1">
            {/* Aide contextuelle */}
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Aide
              </h3>
              <p className="text-sm text-gray-700">
                {currentStep === 1 &&
                  'Vos informations personnelles sont nécessaires pour établir votre identité dans la lettre.'}
                {currentStep === 2 &&
                  "Les informations du vendeur permettent d'adresser correctement votre réclamation."}
                {currentStep === 3 && 'Décrivez précisément le problème pour une lettre efficace.'}
                {currentStep === 4 &&
                  'Vérifiez toutes les informations avant de générer votre lettre.'}
              </p>
            </div>

            {/* Références légales - Lazy loadées */}
            {currentStep >= 3 && (
              <Suspense
                fallback={
                  <div className="bg-white rounded-lg p-6 animate-pulse">
                    <Skeleton variant="text" width="150px" className="mb-3" />
                    <Skeleton variant="text" lines={4} />
                  </div>
                }
              >
                <LazyLegalReferences
                  problemType={formData.problemType}
                  productType={formData.productName}
                />
              </Suspense>
            )}

            {/* Formules - Visible à partir de l'étape 3 */}
            {currentStep >= 3 && (
              <div className="bg-white rounded-lg p-6 border mt-6">
                <h3 className="font-semibold mb-4">Choisir ma formule</h3>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="formula"
                      value="free"
                      checked={formData.formula === 'free' || !formData.formula}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          formula: 'free',
                        }))
                      }
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">Gratuit</div>
                      <div className="text-sm text-gray-600">Lettre à télécharger et imprimer</div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="formula"
                      value="premium"
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          formula: 'premium',
                        }))
                      }
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">Premium - 4,90€</div>
                      <div className="text-sm text-gray-600">
                        PDF professionnel + signature en ligne
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="formula"
                      value="pro"
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          formula: 'pro',
                        }))
                      }
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">Pro - 12,90€</div>
                      <div className="text-sm text-gray-600">
                        Premium + envoi recommandé électronique
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <Suspense
                fallback={
                  <div className="p-8">
                    <Skeleton variant="text" width="60%" className="mb-4" />
                    <Skeleton variant="text" lines={20} />
                  </div>
                }
              >
                <LazyLetterPreview
                  content={generatedLetter!}
                  onClose={() => setShowPreview(false)}
                  onDownload={() => {
                    /* Logique de téléchargement */
                  }}
                />
              </Suspense>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      {showPayment && (
        <Suspense fallback={null}>
          <LazyPaymentModal
            isOpen={showPayment}
            onClose={() => setShowPayment(false)}
            formula={formData.formula!}
            onSuccess={() => {
              setShowPayment(false);
              setShowPreview(true);
            }}
          />
        </Suspense>
      )}
    </div>
  );
}

// ==========================================
// METADATA POUR NEXT.JS
// ==========================================

export const metadata: Metadata = {
  title: 'Créer ma lettre de mise en demeure - Je me défends',
  description:
    'Générez votre lettre personnalisée avec les bons articles du Code de la consommation.',
  openGraph: {
    title: 'Générateur de lettre de mise en demeure',
    description: 'Créez votre lettre juridique en 4 étapes simples.',
  },
};
