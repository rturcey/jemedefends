// src/components/cta/StickyMobileCTA.tsx
'use client';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function StickyMobileCTA() {
  return (
    <div className="fixed inset-x-0 bottom-4 z-40 sm:hidden flex justify-center">
      <Link
        href="/eligibilite#start"
        className="inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold shadow-lg
                   bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <Sparkles className="h-5 w-5" />
        Commencer gratuitement
      </Link>
    </div>
  );
}
