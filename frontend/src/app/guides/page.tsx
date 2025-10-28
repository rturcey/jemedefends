// src/app/guides/page.tsx - CORRIGÉ ET OPTIMISÉ
import type { Metadata } from 'next';

import GuidesClientPage from './client-page';

// Métadonnées SEO (côté serveur)
export const metadata: Metadata = {
  title: 'Guides pratiques - Garantie légale de conformité - Je me défends',
  description:
    'Découvrez tous nos guides pour faire valoir vos droits de consommateur. Garantie légale, réparation, remboursement : tout ce qu\'il faut savoir.',
  keywords: [
    'guides consommateur',
    'garantie légale conformité',
    'droits consommateur',
    'remboursement',
    'réparation',
    'mise en demeure',
  ],
  alternates: {
    canonical: 'https://jemedefends.fr/guides',
  },
  openGraph: {
    title: 'Guides pratiques - Garantie légale de conformité',
    description: 'Découvrez tous nos guides pour faire valoir vos droits de consommateur.',
    url: 'https://jemedefends.fr/guides',
    siteName: 'Je me défends',
    type: 'website',
    images: [
      {
        url: 'https://jemedefends.fr/images/og-guides.jpg',
        width: 1200,
        height: 630,
        alt: 'Guides pratiques Je me défends',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guides pratiques - Je me défends',
    description: 'Tous nos guides pour défendre vos droits de consommateur',
    images: ['https://jemedefends.fr/images/og-guides.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Composant serveur qui wrap le composant client
export default function GuidesPage() {
  return <GuidesClientPage />;
}
