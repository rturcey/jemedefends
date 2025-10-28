// src/components/guides/GuidePageSkeleton.tsx
// Skeleton pour une page guide complète

import React from 'react';
import { Skeleton } from '@/components/ui/SkeletonSystem';

/**
 * Skeleton pour une page guide complète
 */
export default function GuidePageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-6 sm:py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>

            <Skeleton className="h-10 w-full max-w-3xl mb-3" />
            <Skeleton className="h-5 w-full max-w-2xl mb-6" />

            <div className="flex flex-col sm:flex-row gap-3">
              <Skeleton className="h-14 flex-1 sm:flex-initial w-full sm:w-64" />
              <Skeleton className="h-14 w-full sm:w-48" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="px-4 py-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Skeleton className="h-6 w-48" />

              <div className="flex gap-2">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col lg:flex-row gap-8 py-8">
        <div className="lg:flex-1 px-4">
          <div className="py-8 border-b border-gray-100">
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-8 w-3/4 mb-6" />

              <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </div>
          </div>

          <div className="py-8 border-b border-gray-100">
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-8 w-3/4 mb-6" />

              <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </div>
          </div>

          <div className="py-8 border-b border-gray-100">
            <div className="max-w-4xl mx-auto">
              <Skeleton className="h-8 w-3/4 mb-6" />

              <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block lg:w-80 lg:shrink-0 px-4">
          <div className="sticky top-24 space-y-6">
            {/* Sommaire */}
            <div
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-8" />
              </div>

              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-8 w-full" />
                    {i % 2 === 0 && (
                      <div className="ml-4 space-y-1">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Guides connexes */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-32" />
              </div>

              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
