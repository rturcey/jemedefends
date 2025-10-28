/**
 * Système de Skeleton complet pour Je me défends
 * Composants de chargement réutilisables, mobile-first
 */

import React from 'react';

interface SkeletonProps {
    className?: string;
}

/**
 * Composant de base Skeleton
 */
export const Skeleton: React.FC<SkeletonProps> = ({className = ''}) => {
    return (
        <div
            className={`animate-pulse bg-gray-200 rounded ${className}`}
            role="status"
            aria-label="Chargement en cours"
        />
    );
};

/**
 * Skeleton pour le header/hero
 */
export const HeroSkeleton: React.FC = () => {
    return (
        <section
            className="w-full py-20 md:py-28 lg:py-36 bg-gradient-to-br from-blue-50 to-white"
            aria-busy="true"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Titre principal */}
                    <Skeleton
                        className="h-12 md:h-16 lg:h-20 w-full max-w-3xl mx-auto mb-6"/>
                    <Skeleton
                        className="h-12 md:h-16 lg:h-20 w-3/4 max-w-2xl mx-auto mb-8"/>

                    {/* Sous-titre */}
                    <Skeleton className="h-5 md:h-6 w-full max-w-2xl mx-auto mb-3"/>
                    <Skeleton
                        className="h-5 md:h-6 w-5/6 max-w-xl mx-auto mb-10 md:mb-12"/>

                    {/* Bouton principal */}
                    <Skeleton
                        className="h-14 md:h-16 w-64 md:w-72 mx-auto rounded-full mb-6"/>

                    {/* Éléments de confiance */}
                    <div
                        className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
                        <Skeleton className="h-5 w-28"/>
                        <Skeleton className="h-5 w-36"/>
                        <Skeleton className="h-5 w-32"/>
                    </div>
                </div>
            </div>
        </section>
    );
};

/**
 * Skeleton pour les formules/pricing
 */
export const PricingSkeleton: React.FC = () => {
    return (
        <section className="w-full py-12 md:py-16 lg:py-20" aria-busy="true">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8 md:mb-12 text-center">
                    <Skeleton className="h-8 md:h-10 w-48 md:w-64 mx-auto mb-4"/>
                    <Skeleton className="h-4 md:h-5 w-full max-w-xl mx-auto"/>
                </div>

                <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`bg-white rounded-lg shadow-lg p-6 md:p-8 ${
                                i === 2 ? 'ring-2 ring-blue-600' : ''
                            }`}
                        >
                            {i === 2 && (
                                <Skeleton
                                    className="h-6 w-24 mx-auto mb-4 rounded-full"/>
                            )}
                            <Skeleton className="h-8 w-32 mx-auto mb-3"/>
                            <Skeleton className="h-10 md:h-12 w-24 mx-auto mb-6"/>
                            <div className="space-y-3 mb-6">
                                <Skeleton className="h-4 w-full"/>
                                <Skeleton className="h-4 w-5/6"/>
                                <Skeleton className="h-4 w-4/5"/>
                                <Skeleton className="h-4 w-full"/>
                            </div>
                            <Skeleton className="h-12 w-full rounded-full"/>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

/**
 * Skeleton pour le footer
 */
export const FooterSkeleton: React.FC = () => {
    return (
        <footer className="w-full bg-gray-900 text-white py-12 md:py-16"
                aria-busy="true">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i}>
                            <Skeleton className="h-6 w-32 mb-4 bg-gray-700"/>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24 bg-gray-700"/>
                                <Skeleton className="h-4 w-28 bg-gray-700"/>
                                <Skeleton className="h-4 w-20 bg-gray-700"/>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-700 pt-8">
                    <Skeleton className="h-4 w-64 mx-auto bg-gray-700"/>
                </div>
            </div>
        </footer>
    );
};

/**
 * Skeleton pour une page complète
 */
export const PageSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <HeroSkeleton/>
            <SectionSkeleton/>
            <SectionSkeleton/>
            <FAQSkeleton/>
            <CTASkeleton/>
            <FooterSkeleton/>
        </div>
    );
};

// SKELETONS MANQUANTS POUR ClientDynamics
// À AJOUTER À LA FIN DE src/components/ui/SkeletonSystem.tsx
// ==========================================

/**
 * Skeleton pour les sections génériques (ProblemsSection, ProcessSection, TrustSection)
 * Variants: 'problems' | 'process' | 'trust'
 */
export const SectionSkeleton: React.FC<{
    variant?: 'problems' | 'process' | 'trust'
}> = ({
          variant = 'problems',
      }) => (
    <div className="py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            {/* Titre de section */}
            <div className="text-center mb-8 md:mb-12">
                <Skeleton
                    variant="text"
                    width="60%"
                    mobileHeight="32px"
                    desktopHeight="40px"
                    className="mx-auto mb-4"
                />
                <Skeleton variant="text" width="80%" className="mx-auto" lines={2}/>
            </div>

            {/* Contenu selon le variant */}
            {variant === 'problems' && (
                <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white rounded-xl p-6 border">
                            <Skeleton variant="circular" width="48px" height="48px"
                                      className="mb-4"/>
                            <Skeleton variant="text" width="70%" mobileHeight="24px"
                                      className="mb-3"/>
                            <Skeleton variant="text" lines={3}/>
                        </div>
                    ))}
                </div>
            )}

            {variant === 'process' && (
                <div className="space-y-8">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex gap-4">
                            <Skeleton variant="rectangular" width="60px" height="60px"
                                      className="rounded-lg"/>
                            <div className="flex-1 space-y-2">
                                <Skeleton variant="text" width="40%"
                                          mobileHeight="20px"/>
                                <Skeleton variant="text" lines={2}/>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {variant === 'trust' && (
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <Skeleton variant="text" lines={4}/>
                    </div>
                    <Skeleton variant="rectangular" height="300px"
                              className="rounded-xl"/>
                </div>
            )}
        </div>
    </div>
);

/**
 * Skeleton pour la section FAQ (TopFAQ)
 */
export const FAQSkeleton: React.FC = () => (
    <div className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
            {/* Titre FAQ */}
            <div className="text-center mb-8 md:mb-12">
                <Skeleton
                    variant="text"
                    width="50%"
                    mobileHeight="32px"
                    desktopHeight="40px"
                    className="mx-auto mb-4"
                />
                <Skeleton variant="text" width="70%" className="mx-auto"/>
            </div>

            {/* Questions FAQ */}
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="bg-white rounded-xl border p-5 md:p-6">
                        <div className="flex items-center justify-between">
                            <Skeleton variant="text" width="80%" mobileHeight="20px"/>
                            <Skeleton variant="circular" width="24px" height="24px"/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

/**
 * Skeleton pour la section CTA finale (FinalCTASection)
 */
export const CTASkeleton: React.FC = () => (
    <div className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
            <div
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 text-center border border-blue-200">
                {/* Titre CTA */}
                <Skeleton
                    variant="text"
                    width="70%"
                    mobileHeight="32px"
                    desktopHeight="40px"
                    className="mx-auto mb-4"
                />

                {/* Description */}
                <Skeleton variant="text" width="80%" className="mx-auto mb-8"
                          lines={2}/>

                {/* Bouton CTA */}
                <Skeleton
                    variant="button"
                    width="200px"
                    mobileHeight="52px"
                    desktopHeight="48px"
                    className="mx-auto"
                />

                {/* Éléments de confiance */}
                <div className="flex justify-center gap-6 mt-8 flex-wrap">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} variant="text" width="120px" height="20px"/>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
