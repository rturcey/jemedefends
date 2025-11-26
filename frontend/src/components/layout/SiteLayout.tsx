// src/components/layout/SiteLayout.tsx
import * as React from 'react';

import Footer from '@/components/layout/Footer';
import TopBar from '@/components/layout/TopBar';

export default function SiteLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <TopBar ctaHref="/eligibilite" />
      <main className="pt-0 md:pt-20">{children}</main>
      <Footer />
    </div>
  );
}
