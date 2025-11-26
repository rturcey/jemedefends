// src/app/layout.tsx
import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';

import RenderWatchdog from '@/app/_watchdog/RenderWatchdog';
import { SiteLayout } from '@/components/layout';
import ClientGlobals from './ClientGlobals';

// ===================
// FONT
// ===================
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

// ===================
// SITE URL & CONFIG
// ===================
const siteUrl = 'https://jemedefends.fr';

// ===================
// METADATA (Server)
// ===================
export const metadata: Metadata = {
  title: {
    template: '%s | Je me défends',
    default: 'Je me défends - Défendez vos droits de consommateur',
  },
  description:
    'Service gratuit pour faire valoir la garantie légale de conformité. Générez votre lettre de mise en demeure en 3 minutes.',
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
      { url: '/favicon.ico', sizes: 'any' },
    ],
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
        alt: 'Je me défends — Produit défaillant ? Obtenez réparation',
      },
    ],
  },

  // === TWITTER / X ===
  twitter: {
    card: 'summary_large_image',
    creator: '@jemedefends',
    title: 'Obtenez réparation en 3 minutes, légalement',
    description:
      'Garantie légale de conformité — lettre gratuite conforme au Code de la consommation.',
    images: ['/twitter-card.jpg'],
  },

  // === VERIFICATIONS ===
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },

  // Canonical global
  alternates: { canonical: siteUrl },
};

// ===================
// VIEWPORT
// ===================
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

// ===================
// LAYOUT (Server)
// ===================
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.className} scroll-smooth`}>
      <head>
        {/* Préconnexion aux domaines critiques */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch pour les ressources tierces */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>

      <body className="min-h-screen bg-white text-gray-900 antialiased selection:bg-blue-100 selection:text-blue-900">
        {/* Skip to content pour l'accessibilité */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/50"
        >
          Aller au contenu principal
        </a>

        {/* RenderWatchdog pour la surveillance des performances */}
        <RenderWatchdog maxRendersPerSecond={80} maxHeapMB={1024}>
          {/* SiteLayout gère le TopBar sticky et le Footer */}
          <SiteLayout>{children}</SiteLayout>
        </RenderWatchdog>

        {/* Composants client globaux (analytics, cookies, etc.) */}
        <ClientGlobals />

        {/* Scripts analytics si nécessaire */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics ou autre */}
            <Script
              id="gtm-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  // Votre script Google Tag Manager ici si nécessaire
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}
