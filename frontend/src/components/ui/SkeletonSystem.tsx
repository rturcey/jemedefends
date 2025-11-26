// src/components/ui/SkeletonSystem.tsx
/**
 * Système de Skeleton complet pour Je me défends
 * Composants de chargement réutilisables, mobile-first
 */

import React from 'react';
import Container from './Container';

interface SkeletonProps {
  className?: string;
}

/**
 * Composant de base Skeleton
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      role="status"
      aria-label="Chargement en cours"
    />
  );
};

/**
 * Skeleton pour le Hero - RESPECTE LA STRUCTURE EXACTE DU HERO
 */
export const HeroSkeleton: React.FC = () => {
  return (
    <section
      className="min-h-[100vh] md:min-h-[calc(100vh-5rem)] flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 to-white"
      aria-busy="true"
    >
      <Container className="h-full flex items-center py-4 md:py-6">
        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:justify-center gap-6 lg:gap-10 w-full">
          {/* Hero Left - flex-1 max-w-xl */}
          <div className="flex-1 max-w-xl w-full text-center lg:text-left space-y-6">
            {/* Badge gratuit */}
            <Skeleton className="h-10 w-64 rounded-full mx-auto lg:mx-0" />

            {/* Titre principal */}
            <div className="space-y-4">
              <Skeleton className="h-12 md:h-16 w-full" />
              <Skeleton className="h-12 md:h-16 w-5/6 mx-auto lg:mx-0" />
            </div>

            {/* Sous-titre */}
            <div className="space-y-3">
              <Skeleton className="h-5 md:h-6 w-full" />
              <Skeleton className="h-5 md:h-6 w-4/5 mx-auto lg:mx-0" />
            </div>

            {/* CTA */}
            <Skeleton className="h-14 w-64 rounded-full mx-auto lg:mx-0" />

            {/* Éléments de confiance - Mobile (grid 2 cols) */}
            <div className="md:hidden grid grid-cols-2 gap-4 mt-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Éléments de confiance - Desktop (flex horizontal) */}
            <div className="hidden md:flex flex-wrap items-center gap-5 lg:gap-7">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-5 w-40" />
                </div>
              ))}
            </div>
          </div>

          {/* Hero Right FAQ - hidden lg:block lg:w-[22rem] */}
          <div className="hidden lg:block lg:w-[22rem] lg:flex-shrink-0">
            <div className="rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur-md shadow-md p-5">
              {/* Header FAQ */}
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-6 w-32" />
              </div>

              {/* Questions FAQ */}
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="p-3 bg-gray-50/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-36" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Bouton */}
              <Skeleton className="h-10 w-48 rounded-lg mt-4" />
            </div>

            {/* Trust éléments sous la FAQ */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-56" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

/**
 * Skeleton pour les sections génériques (ProblemsSection, ProcessSection, TrustSection)
 */
export const SectionSkeleton: React.FC<{
  variant?: 'problems' | 'process' | 'trust';
}> = ({ variant = 'problems' }) => (
  <section className="py-12 md:py-16 lg:py-20">
    <Container>
      {/* Titre de section */}
      <div className="text-center mb-8 md:mb-12">
        <Skeleton className="h-10 w-3/4 md:w-1/2 mx-auto mb-4" />
        <Skeleton className="h-5 w-full md:w-2/3 mx-auto" />
      </div>

      {/* Contenu selon le variant */}
      {variant === 'problems' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
              <Skeleton className="h-12 w-12 rounded-lg mb-4" />
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      )}

      {variant === 'process' && (
        <div className="space-y-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-16 w-16 rounded-lg flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      )}

      {variant === 'trust' && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-6 w-full" />
          </div>
          <Skeleton className="h-80 rounded-xl" />
        </div>
      )}
    </Container>
  </section>
);

/**
 * Skeleton pour la section FAQ (TopFAQ)
 */
export const FAQSkeleton: React.FC = () => (
  <section className="py-12 md:py-16">
    <Container>
      <div className="max-w-4xl mx-auto">
        {/* Titre FAQ */}
        <div className="text-center mb-8 md:mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-5 w-96 mx-auto" />
        </div>

        {/* Questions FAQ */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 md:p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  </section>
);

/**
 * Skeleton pour la section CTA finale (FinalCTASection)
 */
export const CTASkeleton: React.FC = () => (
  <section className="py-16 md:py-20">
    <Container>
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 text-center border border-blue-200">
          {/* Titre CTA */}
          <Skeleton className="h-10 w-3/4 md:w-1/2 mx-auto mb-4" />

          {/* Description */}
          <Skeleton className="h-5 w-full mx-auto mb-2" />
          <Skeleton className="h-5 w-5/6 mx-auto mb-8" />

          {/* Bouton CTA */}
          <Skeleton className="h-14 w-64 mx-auto rounded-full mb-8" />

          {/* Éléments de confiance */}
          <div className="flex justify-center gap-6 flex-wrap">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-5 w-32" />
            ))}
          </div>
        </div>
      </div>
    </Container>
  </section>
);

/**
 * Skeleton pour le footer
 */
export const FooterSkeleton: React.FC = () => {
  return (
    <footer className="w-full bg-gray-900 text-white py-12 md:py-16" aria-busy="true">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i}>
              <Skeleton className="h-6 w-32 mb-4 bg-gray-700" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-gray-700" />
                <Skeleton className="h-4 w-28 bg-gray-700" />
                <Skeleton className="h-4 w-20 bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-700 pt-8">
          <Skeleton className="h-4 w-64 mx-auto bg-gray-700" />
        </div>
      </Container>
    </footer>
  );
};

/**
 * Skeleton pour une page complète
 */
export const PageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSkeleton />
      <SectionSkeleton variant="problems" />
      <SectionSkeleton variant="process" />
      <FAQSkeleton />
      <CTASkeleton />
      <FooterSkeleton />
    </div>
  );
};

/**
 * Skeleton pour le formulaire d'éligibilité
 */
export const EligibilitySkeleton: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      {/* Progress bar - Remplacement des cercles par une vraie barre de progression */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span>Étape 1 sur 6</span>
          <span>16%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-1/6 animate-pulse"></div>
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
};

export const ResultsSkeleton: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      {/* Header compact */}
      <div className="mb-4">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-6 w-6 rounded-md" />
          <Skeleton className="h-7 w-2/3 rounded" />
        </div>
        <Skeleton className="h-4 w-4/5 mt-2 rounded" />
      </div>

      {/* Liste (remplace les grosses cards) */}
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="divide-y divide-gray-100">
          {[0, 1, 2].map(i => (
            <div key={i} className="p-4 md:p-5">
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-2/3 mb-2 rounded" />
                  <Skeleton className="h-4 w-11/12 mb-1.5 rounded" />
                  <Skeleton className="h-4 w-3/4 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTAs compacts */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Skeleton className="h-11 rounded-lg" />
        <Skeleton className="h-11 rounded-lg" />
      </div>

      {/* Note discrète */}
      <div className="mt-4 p-3 rounded-lg border border-gray-200 bg-gray-50">
        <Skeleton className="h-4 w-2/3 rounded" />
      </div>
    </div>
  );
};

// ==========================================
// FORM SKELETON (Formulaire) — structure alignée sur FormLayout + Step 1
// ==========================================
export const FormSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-[640px] mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Progress bar (comme FormLayout / EligibilitySkeleton) */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-10" />
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full w-1/4 animate-pulse" />
          </div>
        </div>

        {/* Step card */}
        <div className="rounded-3xl border border-gray-100 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-5 md:p-7">
          {/* Header de step (icône + titre + sous-titre) */}
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-11 w-11 rounded-2xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>

          {/* Champs (pattern BuyerInfoStep / SellerInfoStep) */}
          <div className="space-y-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ))}

            {/* Bloc "Adresse" avec sous-champs */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>

            {/* Deux champs côte à côte (email/tel etc.) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              ))}
            </div>
          </div>

          {/* CTA desktop dans les steps */}
          <div className="hidden sm:flex justify-end mt-8">
            <Skeleton className="h-11 w-48 rounded-xl" />
          </div>
        </div>

        {/* Placeholder navigation mobile (MobileNavigation fixed) */}
        <div className="sm:hidden mt-6">
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
};
