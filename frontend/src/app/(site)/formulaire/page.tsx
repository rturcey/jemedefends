// src/app/(site)/formulaire/page.tsx
'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

import { FormSkeleton } from '@/components/ui/SkeletonSystem';
import { deviceInfo, performanceMonitor } from '@/lib/performance';

const LazyFormGenerator = dynamic(() => import('@/components/form/FormGenerator'), {
  loading: () => <FormSkeleton />,
  ssr: false,
});

export default function FormulairePage() {
  useEffect(() => {
    performanceMonitor.start();
    return () => performanceMonitor.stop();
  }, []);

  useEffect(() => {
    if (!deviceInfo.isSlow()) {
      import('@/components/form/FormGenerator');
    }
  }, []);

  return <LazyFormGenerator formSlug="mise_en_demeure_v1" />;
}
