// src/components/guides/GuideSummary.tsx
// Wrapper intelligent du TableOfContents existant

'use client';

import { BookOpen, Clock } from 'lucide-react';
import React from 'react';

import Container from '@/components/ui/Container';
import TableOfContents from '@/components/guides/TableOfContents';
import type { GuidePage } from '@/types/guides';

interface GuideSummaryProps {
  guide: GuidePage & { slug: string; readingTime: number };
}

export default function GuideSummary({ guide }: GuideSummaryProps) {
  return (
    <div className="bg-white border-y border-gray-200 sticky top-0 z-30 lg:relative lg:top-auto lg:z-auto">
      <Container className="max-w-4xl">
        <div className="py-4 lg:py-6">
          {/* Header du sommaire */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Sommaire du guide</h2>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>{guide.readingTime} min</span>
            </div>
          </div>

          {/* TableOfContents existant avec configuration optimale */}
          <TableOfContents
            sections={guide.sections}
            showProgress={true}
            showReadingTime={true}
            sticky={false} // Gérée par le wrapper
            className="bg-gray-50 rounded-xl p-4"
          />
        </div>
      </Container>
    </div>
  );
}
