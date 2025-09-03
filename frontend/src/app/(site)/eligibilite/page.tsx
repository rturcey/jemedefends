import { Metadata } from 'next';
import EligibilityClientPage from './client-page';

export const metadata: Metadata = {
  title: "Test d'éligibilité gratuit - Garantie légale de conformité | Je me défends",
  description:
    'Découvrez en 2 minutes si vous pouvez faire valoir la garantie légale. Test gratuit, confidentiel et sans engagement.',
  keywords: [
    'test éligibilité garantie légale',
    'vérifier mes droits consommateur',
    'diagnostic gratuit défaut produit',
    'éligibilité remboursement',
    'test conformité produit',
  ],
  openGraph: {
    title: 'Testez votre éligibilité à la garantie légale en 2 minutes',
    description:
      'Outil gratuit pour vérifier si vous pouvez obtenir réparation, remplacement ou remboursement.',
    type: 'website',
    url: 'https://jemedefends.fr/eligibilite',
    siteName: 'Je me défends',
    images: [
      {
        url: '/images/og-eligibilite.jpg',
        width: 1200,
        height: 630,
        alt: "Test d'éligibilité garantie légale",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Testez votre éligibilité à la garantie légale',
    description: 'Outil gratuit en 2 minutes pour vérifier vos droits',
    images: ['/images/twitter-eligibilite.jpg'],
  },
  alternates: {
    canonical: 'https://jemedefends.fr/eligibilite',
  },
  robots: 'index, follow',
  authors: [{ name: 'Je me défends' }],
};

// Données structurées Schema.org
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: "Test d'éligibilité garantie légale",
  description: "Outil gratuit pour vérifier l'éligibilité à la garantie légale de conformité",
  url: 'https://jemedefends.fr/eligibilite',
  applicationCategory: 'LegalService',
  operatingSystem: 'Web Browser',
  permissions: 'none',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    reviewCount: '1247',
    bestRating: '5',
  },
  provider: {
    '@type': 'Organization',
    name: 'Je me défends',
    url: 'https://jemedefends.fr',
    logo: 'https://jemedefends.fr/logo.png',
  },
  mainEntity: {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Qui peut bénéficier de la garantie légale de conformité ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Tout consommateur ayant acheté un bien ou service auprès d'un professionnel peut bénéficier de la garantie légale de conformité pendant 2 ans.",
        },
      },
      {
        '@type': 'Question',
        name: "Combien coûte ce test d'éligibilité ?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Le test d'éligibilité est entièrement gratuit, confidentiel et sans engagement.",
        },
      },
    ],
  },
};

export default function EligibilitePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <EligibilityClientPage />
    </>
  );
}
