// src/app/(site)/layout.tsx
import type {Metadata, Viewport} from 'next';
import {Inter} from 'next/font/google';
import Script from 'next/script';
import {Suspense} from 'react';
import dynamic from 'next/dynamic';

import './globals.css';
import {cn} from '@/lib/utils';

// Fonts (server)
const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
    preload: true,
});

// Lazy SSR components (design d'origine conservé)
const DesktopNav = dynamic(() => import('@/components/layout/TopBar'), {ssr: true});
const LazyFooter = dynamic(() => import('@/components/layout/Footer'), {
    loading: () => (
        <footer className="bg-gray-900 text-white py-12 animate-pulse">
            <div className="h-40"/>
        </footer>
    ),
    ssr: true,
});

// Composants client globaux (analytics, cookie banner, preloads, etc.)
import ClientGlobals from './ClientGlobals';

// ===================
// METADATA (Server)
// ===================
export const metadata: Metadata = {
    title: {
        default: 'Je me défends - Défendez vos droits de consommateur',
        template: '%s | Je me défends',
    },
    description:
        'Service gratuit pour faire valoir la garantie légale de conformité. Générez votre lettre de mise en demeure en 3 minutes.',
    keywords: [
        'garantie légale',
        'conformité',
        'défense consommateur',
        'mise en demeure',
        'droits consommateur',
        'réclamation',
        'litige',
    ],
    authors: [{name: 'Je me défends'}],
    creator: 'Je me défends',
    publisher: 'Je me défends',
    formatDetection: {email: false, address: false, telephone: false},
    metadataBase: new URL('https://jemedefends.fr'),
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        url: 'https://jemedefends.fr',
        siteName: 'Je me défends',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'Je me défends - Défendez vos droits',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@jemedefends',
        creator: '@jemedefends',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: [
            {url: '/favicon.ico'},
            {url: '/icon-192.png', sizes: '192x192', type: 'image/png'},
            {url: '/icon-512.png', sizes: '512x512', type: 'image/png'},
        ],
        apple: [{url: '/apple-icon.png'}],
    },
    manifest: '/manifest.json',
};

// ===================
// VIEWPORT (Server)
// ===================
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: [
        {media: '(prefers-color-scheme: light)', color: '#ffffff'},
        {media: '(prefers-color-scheme: dark)', color: '#0f172a'},
    ],
};

// ===================
// LAYOUT (Server)
// ===================
export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="fr" className={cn(inter.className, 'scroll-smooth')}>
        <head>
            {/* Préconnexion aux domaines critiques */}
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com"
                  crossOrigin="anonymous"/>

            {/* DNS Prefetch pour les ressources tierces */}
            <link rel="dns-prefetch" href="https://www.googletagmanager.com"/>
        </head>

        <body
            className={cn(
                'min-h-screen bg-white text-gray-900 antialiased',
                'selection:bg-blue-100 selection:text-blue-900',
            )}
        >
        {/* Skip to content */}
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-50"
        >
            Aller au contenu principal
        </a>

        {/* Nav desktop (SSR) */}
        <div className="hidden lg:block">
            <Suspense fallback={<div className="h-16 bg-white border-b"/>}>
                <DesktopNav/>
            </Suspense>
        </div>

        {/* Main */}
        <main id="main-content" className="relative">
            {children}
        </main>

        {/* Footer (SSR) + skeleton fallback */}
        <Suspense
            fallback={
                <footer className="bg-gray-900 text-white py-12">
                    <div className="container mx-auto px-4">
                        <div className="h-40 animate-pulse bg-gray-800 rounded"/>
                    </div>
                </footer>
            }
        >
            <LazyFooter/>
        </Suspense>

        {/* Tout ce qui nécessite hooks / ssr:false / timers → composant client */}
        <ClientGlobals/>

        {/* Scripts (OK dans un Server Component) */}
        <Script
            id="structured-data"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'WebSite',
                    name: 'Je me défends',
                    description:
                        'Service gratuit pour faire valoir la garantie légale de conformité',
                    url: 'https://jemedefends.fr',
                    potentialAction: {
                        '@type': 'SearchAction',
                        target: 'https://jemedefends.fr/search?q={search_term_string}',
                        'query-input': 'required name=search_term_string',
                    },
                }),
            }}
        />

        {/* Google Analytics */}
        <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
            strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure',
            });
          `}
        </Script>
        </body>
        </html>
    );
}
