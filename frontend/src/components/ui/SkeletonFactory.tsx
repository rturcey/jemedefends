'use client';

import React from 'react';

import Container from '@/components/ui/Container';
import Skeleton from '@/components/ui/Skeleton';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface SkeletonFactoryProps {
  variant: 'form' | 'hero' | 'results' | 'step-indicator' | 'radio-group' | 'navigation';
  className?: string;
}

export const SkeletonFactory: React.FC<SkeletonFactoryProps> = ({ variant, className = '' }) => {
  const { isMobile } = useMobileOptimization();

  const renderFormSkeleton = () => (
    <Container
      className={`max-w-[640px] mx-auto pt-6 md:pt-10 pb-24 md:pb-10 space-y-6 ${className}`}
    >
      {/* Step indicator skeleton */}
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Skeleton key={i} className="w-8 h-8 rounded-full" />
          ))}
        </div>
      </div>

      {/* Title + description skeleton */}
      <div>
        <Skeleton className="h-7 w-3/4 mb-1" />
        <Skeleton className="h-5 w-full mb-3" />

        {/* Content card skeleton with realistic structure */}
        <div className="min-h-[220px]">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            {/* Radio options skeleton */}
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div
                  key={i}
                  className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg"
                >
                  <Skeleton className="w-5 h-5 rounded-full mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>
    </Container>
  );

  const renderHeroSkeleton = () => (
    <div className={`p-6 ${className}`}>
      <div className="text-center space-y-4">
        <Skeleton className="h-8 w-48 mx-auto mb-4" />
        <Skeleton className="h-6 w-64 mx-auto" />
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {['2 minutes', '100% gratuit', 'Données sécurisées'].map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <Skeleton className="w-5 h-5 rounded" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
        <Skeleton className="h-12 w-48 mx-auto mt-6 rounded-lg" />
      </div>
    </div>
  );

  const renderResultsSkeleton = () => (
    <div className={`fixed inset-0 z-[80] bg-white ${className}`}>
      <Container className="max-w-[640px] mx-auto pt-6 md:pt-10 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Skeleton className="h-8 w-52 mx-auto mb-4" />
          <Skeleton className="h-6 w-3/4 mx-auto" />
        </div>

        {/* Result card */}
        <div className="bg-white border-2 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-start space-x-4">
            <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-10 w-32 mx-auto" />
        </div>
      </Container>
    </div>
  );

  const renderStepIndicatorSkeleton = () => (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <React.Fragment key={i}>
            <Skeleton className="w-8 h-8 rounded-full" />
            {i < 6 && <Skeleton className="w-8 h-0.5" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  const renderRadioGroupSkeleton = () => (
    <div className={`space-y-3 ${className}`}>
      {[1, 2].map(i => (
        <div key={i} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
          <Skeleton className="w-5 h-5 rounded-full mt-0.5 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-2/3" />
            {!isMobile && <Skeleton className="h-4 w-full" />}
          </div>
        </div>
      ))}
    </div>
  );

  const renderNavigationSkeleton = () => (
    <div className={`flex justify-between items-center ${className}`}>
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-24" />
    </div>
  );

  const renderBuyerStepSkeleton = () => (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      {/* Form fields */}
      <div className="space-y-6">
        {/* Nom */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        {/* Téléphone */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        {/* Adresse */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-11 w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-11 rounded-lg" />
            <Skeleton className="h-11 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSellerStepSkeleton = () => (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>

      {/* Seller fields */}
      <div className="space-y-6">
        {/* Nom vendeur */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        {/* Adresse vendeur */}
        <div className="space-y-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-11 w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-11 rounded-lg" />
            <Skeleton className="h-11 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPurchaseStepSkeleton = () => (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-52" />
        </div>
      </div>

      {/* Purchase fields */}
      <div className="space-y-6">
        {/* Date d'achat */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        {/* Produit */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>

        {/* Prix */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-11 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );

  const renderProblemStepSkeleton = () => (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      {/* Problem description */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>

        {/* Action demandée */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-36" />
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg"
              >
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFormLayoutSkeleton = () => (
    <div className={`max-w-3xl mx-auto px-4 py-8 md:py-12 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-6 w-64 mx-auto mb-2" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm mb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-3 w-full rounded-full" />
      </div>

      {/* Form content */}
      <div className="bg-white rounded-2xl shadow-xl border p-6">
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>

      {/* Navigation */}
      <div className="mt-6 flex justify-between items-center">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );

  const renderStepLoadingSkeleton = () => (
    <div className={`animate-pulse space-y-4 ${className}`}>
      <div className="flex items-center justify-center">
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
      <Skeleton className="h-32 w-full rounded-lg" />
    </div>
  );

  switch (variant) {
    case 'form':
      return renderFormSkeleton();
    case 'hero':
      return renderHeroSkeleton();
    case 'results':
      return renderResultsSkeleton();
    case 'step-indicator':
      return renderStepIndicatorSkeleton();
    case 'radio-group':
      return renderRadioGroupSkeleton();
    case 'navigation':
      return renderNavigationSkeleton();
    case 'buyer-step':
      return renderBuyerStepSkeleton();
    case 'seller-step':
      return renderSellerStepSkeleton();
    case 'purchase-step':
      return renderPurchaseStepSkeleton();
    case 'problem-step':
      return renderProblemStepSkeleton();
    case 'form-layout':
      return renderFormLayoutSkeleton();
    case 'step-loading':
      return renderStepLoadingSkeleton();
    default:
      return <Skeleton className={className} />;
  }
};

// Hook pour gérer le loading state des skeletons
export const useSkeletonState = (delay: number = 100) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const { isSlowConnection } = useMobileOptimization();

  React.useEffect(() => {
    const timeout = setTimeout(
      () => {
        setIsLoading(false);
      },
      isSlowConnection ? delay * 2 : delay,
    );

    return () => clearTimeout(timeout);
  }, [delay, isSlowConnection]);

  return isLoading;
};

export default SkeletonFactory;
