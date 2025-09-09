// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

import { SiteLayout } from '@/components/layout';

const siteUrl = 'https://jemedefends.fr';

export const metadata: Metadata = {
  title: {
    template: '%s - Je me défends',
    default: 'Garantie légale de conformité : Obtenez réparation gratuitement - Je me défends',
  },
  description:
    'Panne, défaut, produit non conforme ? Générez votre lettre de mise en demeure gratuite en 3 minutes. Réparation, remplacement ou remboursement garantis par le Code de la consommation.',
  metadataBase: new URL(siteUrl),
  keywords:
    'garantie légale conformité, mise en demeure, défaut produit, réparation gratuite, Code consommation',
  authors: [{ name: 'Je me défends' }],
  creator: 'Je me défends',
  publisher: 'Je me défends',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',

  // === FAVICONS & ICONES ===
  icons: {
    icon: [
      { url: '/favicon-64x64.png', sizes: '64x64', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }, // fallback universel
    ],
    // si tu ajoutes le fichier, décommente la ligne ci-dessous :
    // apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },

  // === OPENGRAPH ===
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'Je me défends',
    title: 'Garantie légale : Obtenez réparation gratuitement',
    description:
      'Service gratuit de lettres de mise en demeure basées sur le Code de la consommation',
    images: [
      {
        url: '/og-image-homepage.jpg',
        width: 1200,
        height: 630,
        alt: 'Je me défends — Produit défaillant ? Récupérez votre argent',
      },
    ],
  },

  // === TWITTER / X ===
  twitter: {
    card: 'summary_large_image',
    creator: '@jemedefends',
    title: 'Récupérez votre argent en 3 minutes, légalement',
    description:
      'Garantie légale de conformité — lettre gratuite conforme au Code de la consommation.',
    images: ['/twitter-card.jpg'],
  },

  // === VERIFICATIONS ===
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },

  // (optionnel) Canonical global — utile si tu n’en mets pas par page
  alternates: { canonical: siteUrl },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="scroll-smooth" className="scroll-smooth" lang="fr">
      <body
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/50"
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/50"
        className="antialiased"
      >
        <RenderWatchdog maxRendersPerSecond={80} maxHeapMB={1024}>
          <SiteLayout>{children}</SiteLayout>
        </RenderWatchdog>
      </body>
    </html>
  );
}
