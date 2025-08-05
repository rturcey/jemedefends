import * as React from 'react';
import TopBar from './TopBar';
import Footer from './Footer';

function SiteLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header visible uniquement ≥ md */}
      <TopBar ctaHref="/eligibilite" />

      {/* Pas de décalage sur mobile, padding top seulement sur desktop */}
      <main className="pt-0 md:pt-20">{children}</main>

      {/* Footer visible uniquement ≥ md */}
      <Footer />
    </div>
  );
}

export default SiteLayout;
