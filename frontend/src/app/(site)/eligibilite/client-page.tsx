// src/app/(site)/eligibilite/client-page.tsx - Version mise à jour avec nouveau ResultsDisplay
'use client';

import {motion, AnimatePresence} from 'framer-motion';
import {CheckCircle, ArrowRight, Shield, Clock, Lock} from 'lucide-react';
import dynamic from 'next/dynamic';
import React, {useState, useCallback} from 'react';

import EligibilityForm from '@/components/eligibility/EligibilityForm';
import ResultsDisplay from '@/components/eligibility/ResultsDisplay';
import Container from '@/components/ui/Container';
import {Skeleton} from '@/components/ui';
import {useAnalytics} from '@/hooks/useApi';
import {useExitIntent} from '@/hooks/useExitIntent';
import {trackEligibilityEvents} from '@/lib/analytics';
import type {EligibilityData} from '@/types/eligibility';
import type {EligibilityResult} from '@/eligibility/engine';
import {MobileHeader} from '@/components';

// Lazy loading pour les composants non critiques
const ExitIntentModal = dynamic(() => import('@/components/eligibility/ExitIntentModal'), {
    ssr: false,
    loading: () => null,
});

// Skeletons harmonisés avec le nouveau design
function FormSkeleton() {
    return (
        <Container variant="form" className="space-y-6">
            <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Skeleton key={i} className="w-10 h-10 rounded-full"/>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-3 mb-4">
                <Skeleton className="w-12 h-12 rounded-lg"/>
                <div className="space-y-2">
                    <Skeleton className="h-6 w-48"/>
                    <Skeleton className="h-4 w-64"/>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="space-y-3">
                    {[1, 2].map(i => (
                        <Skeleton key={i} className="h-16 w-full rounded-xl"/>
                    ))}
                </div>
            </div>
        </Container>
    );
}

// ErrorBoundary spécifique
class EligibilityErrorBoundary extends React.Component<
    { children: React.ReactNode; onError?: () => void },
    { hasError: boolean; error?: Error }
> {
    constructor(props: { children: React.ReactNode; onError?: () => void }) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error: Error) {
        return {hasError: true, error};
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('EligibilityErrorBoundary caught an error:', error, errorInfo);
        this.props.onError?.();
    }

    render() {
        if (this.state.hasError) {
            return (
                <Container variant="form" className="py-12 text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Une erreur
                        s'est produite</h2>
                    <p className="text-gray-600 mb-6">Veuillez rafraîchir la page ou
                        recommencer.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Rafraîchir la page
                    </button>
                </Container>
            );
        }

        return this.props.children;
    }
}

// Views du parcours
type CurrentView = 'hero' | 'form' | 'results';

// Interface pour les données d'éligibilité étendues
interface ExtendedEligibilityData extends EligibilityData {
    result?: EligibilityResult;
}

export default function EligibilityClientPage() {
    const [currentView, setCurrentView] = useState<CurrentView>('hero');
    const [currentStep, setCurrentStep] = useState(0);
    const [eligibilityData, setEligibilityData] = useState<ExtendedEligibilityData | null>(null);

    // Hooks pour analytics et exit intent
    const {trackEvent} = useAnalytics();
    const {resetExitIntent} = useExitIntent({
        enabled: currentView === 'form',
        onExitIntent: () => {
            // Logique d'exit intent si nécessaire
        },
    });

    // Démarrer le test
    const startTest = useCallback(() => {
        setCurrentView('form');
        setCurrentStep(0);
        setEligibilityData(null);
        trackEvent?.('eligibility_test_started');

        // Utilisation sécurisée de trackEligibilityEvents
        if (typeof trackEligibilityEvents !== 'undefined' && trackEligibilityEvents.testStarted) {
            trackEligibilityEvents.testStarted();
        }
    }, [trackEvent]);

    // Gérer la completion du formulaire
    const handleFormComplete = useCallback(
        (result: EligibilityResult, data: EligibilityData) => {
            const extendedData: ExtendedEligibilityData = {
                ...data,
                result,
            };

            setEligibilityData(extendedData);
            setCurrentView('results');

            trackEvent?.('eligibility_test_completed', {
                verdict: result.isEligible ? 'eligible' : 'ineligible',
            });

            // Utilisation sécurisée de trackEligibilityEvents
            if (typeof trackEligibilityEvents !== 'undefined' && trackEligibilityEvents.testCompleted) {
                trackEligibilityEvents.testCompleted(result.isEligible ? 'eligible' : 'ineligible');
            }
        },
        [trackEvent],
    );

    // Recommencer le test
    const handleRestart = useCallback(() => {
        setCurrentView('hero');
        setEligibilityData(null);
        setCurrentStep(0);
        resetExitIntent();
        trackEvent?.('eligibility_test_restarted');

        // Utilisation sécurisée de trackEligibilityEvents
        if (typeof trackEligibilityEvents !== 'undefined' && trackEligibilityEvents.testRestarted) {
            trackEligibilityEvents.testRestarted();
        }
    }, [trackEvent, resetExitIntent]);

    // Gérer les changements d'étape
    const handleStepChange = useCallback((step: number) => {
        setCurrentStep(step);

        // Utilisation sécurisée de trackEligibilityEvents
        if (typeof trackEligibilityEvents !== 'undefined' && trackEligibilityEvents.stepCompleted) {
            trackEligibilityEvents.stepCompleted(step);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <EligibilityErrorBoundary onError={() => setCurrentView('hero')}>
                <AnimatePresence mode="wait">
                    {currentView === 'hero' && (
                        <motion.div
                            key="hero"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.3}}
                        >
                            <MobileHeader/>
                            <HeroSection onStartTest={startTest}/>
                        </motion.div>
                    )}

                    {currentView === 'form' && (
                        <motion.div
                            key="form"
                            initial={{opacity: 0, x: 50}}
                            animate={{opacity: 1, x: 0}}
                            transition={{duration: 0.4}}
                        >
                            <EligibilityForm onComplete={handleFormComplete}
                                             onStepChange={handleStepChange}/>
                        </motion.div>
                    )}

                    {currentView === 'results' && eligibilityData && eligibilityData.result && (
                        <motion.div
                            key="results"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            transition={{duration: 0.4}}
                        >
                            <ResultsDisplay
                                result={eligibilityData.result}
                                data={eligibilityData}
                                onRestart={handleRestart}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Exit Intent Modal */}
                <ExitIntentModal/>
            </EligibilityErrorBoundary>
        </div>
    );
}

// HERO SECTION MODERNE
const HeroSection: React.FC<{ onStartTest: () => void }> = ({onStartTest}) => {
    return (
        <div
            className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center">
            <Container variant="form" className="py-6 md:py-12">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                    className="text-center"
                >
                    {/* TITRE - COMPACT MOBILE */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-6 leading-tight px-4">
                        Test d'éligibilité
                        <span
                            className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              gratuit et rapide
            </span>
                    </h1>

                    {/* DESCRIPTION - RÉDUITE MOBILE */}
                    <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-4 md:mb-6 max-w-3xl mx-auto leading-relaxed px-4">
                        Vérifiez en 2 minutes et <strong className="text-blue-800">sans
                        inscription</strong> si
                        votre situation relève de la garantie légale de conformité.
                    </p>

                    {/* TRUST INDICATORS - COMPACT MOBILE */}
                    <div
                        className="flex flex-col md:flex-row items-start md:items-center justify-center gap-2 md:gap-6 mb-5 md:mb-8 text-xs md:text-sm text-gray-600 px-4 w-fit mx-auto">
                        <div className="flex items-center gap-1.5">
                            <CheckCircle
                                className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0"/>
                            <span>100% gratuit</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle
                                className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0"/>
                            <span>2 minutes</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CheckCircle
                                className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0"/>
                            <span>RGPD conforme</span>
                        </div>
                    </div>

                    {/* BOUTON - PLUS COMPACT MOBILE */}
                    <button
                        onClick={onStartTest}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl transition-all transform hover:scale-105 shadow-lg text-base md:text-lg"
                    >
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 mr-2 inline"/>
                        Commencer le test
                    </button>

                    {/* INFORMATIONS - MASQUÉES MOBILE, VISIBLES DESKTOP */}
                    <div className="hidden md:grid md:grid-cols-3 gap-4 lg:gap-6 mt-12">
                        <div
                            className="bg-white rounded-xl p-5 lg:p-6 shadow-sm border border-gray-200">
                            <Shield
                                className="w-7 h-7 lg:w-8 lg:h-8 text-blue-600 mx-auto mb-3"/>
                            <h3 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base">
                                Sources juridiques
                            </h3>
                            <p className="text-xs lg:text-sm text-gray-600">
                                Basé sur le Code de la consommation, régulièrement mis à
                                jour
                            </p>
                        </div>
                        <div
                            className="bg-white rounded-xl p-5 lg:p-6 shadow-sm border border-gray-200">
                            <Lock
                                className="w-7 h-7 lg:w-8 lg:h-8 text-green-600 mx-auto mb-3"/>
                            <h3 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base">
                                Données sécurisées
                            </h3>
                            <p className="text-xs lg:text-sm text-gray-600">
                                Aucune donnée conservée, hébergement français sécurisé
                            </p>
                        </div>
                        <div
                            className="bg-white rounded-xl p-5 lg:p-6 shadow-sm border border-gray-200">
                            <Clock
                                className="w-7 h-7 lg:w-8 lg:h-8 text-purple-600 mx-auto mb-3"/>
                            <h3 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base">
                                Rapide et simple
                            </h3>
                            <p className="text-xs lg:text-sm text-gray-600">
                                Diagnostic en 2 minutes chrono, <strong>sans
                                inscription</strong>, bases légales
                                claires
                            </p>
                        </div>
                    </div>

                    {/* MICRO TRUST BAR - VISIBLE UNIQUEMENT MOBILE */}
                    <div className="md:hidden mt-6 px-4">
                        <div
                            className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-3 shadow-sm">
                            <div
                                className="flex items-center justify-center gap-4 text-[11px] text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Shield className="w-3.5 h-3.5 text-blue-600"/>
                                    <span>Code conso</span>
                                </div>
                                <div className="w-px h-4 bg-gray-300"/>
                                <div className="flex items-center gap-1">
                                    <Lock className="w-3.5 h-3.5 text-green-600"/>
                                    <span>Sécurisé</span>
                                </div>
                                <div className="w-px h-4 bg-gray-300"/>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-purple-600"/>
                                    <span>2 min</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </Container>
        </div>
    );
};
