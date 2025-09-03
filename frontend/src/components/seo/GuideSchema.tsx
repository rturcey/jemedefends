// src/components/seo/GuideSchema.tsx
'use client';

import React from 'react';

interface GuideSchemaProps {
  guide: {
    slug: string;
    title: string;
    description: string;
    content?: string;
    keywords?: string[];
    lastUpdated?: Date;
    readingTime?: number;
    category?: {
      name: string;
      emoji: string;
    };
  };
  steps?: Array<{
    title: string;
    content: string;
    image?: string;
  }>;
  isHowTo?: boolean;
}

const GuideSchema: React.FC<GuideSchemaProps> = ({ guide, steps, isHowTo = false }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jemedefends.fr';
  const guideUrl = `${baseUrl}/guides/${guide.slug}`;
  const publishedDate = new Date(2024, 10, 1); // Date de publication par défaut
  const modifiedDate = guide.lastUpdated || new Date();

  // Schema Article de base
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    image: `${baseUrl}/images/guides/${guide.slug}-og.jpg`,
    author: {
      '@type': 'Organization',
      name: 'Je me défends',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 200,
        height: 200,
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Je me défends',
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 200,
        height: 200,
      },
    },
    datePublished: publishedDate.toISOString(),
    dateModified: modifiedDate.toISOString(),
    articleSection: guide.category?.name || 'Guides consommateur',
    keywords: guide.keywords?.join(', ') || '',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': guideUrl,
    },
    about: {
      '@type': 'Thing',
      name: 'Garantie légale de conformité',
      description: 'Droits des consommateurs en France',
    },
    inLanguage: 'fr-FR',
    wordCount: guide.content?.split(' ').length || 0,
    timeRequired: guide.readingTime ? `PT${guide.readingTime}M` : 'PT5M',
  };

  // Schema HowTo si applicable
  const howToSchema =
    isHowTo && steps
      ? {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: guide.title,
          description: guide.description,
          image: `${baseUrl}/images/guides/${guide.slug}-og.jpg`,
          totalTime: guide.readingTime ? `PT${guide.readingTime}M` : 'PT10M',
          estimatedCost: {
            '@type': 'MonetaryAmount',
            currency: 'EUR',
            value: '0',
          },
          supply: [
            {
              '@type': 'HowToSupply',
              name: "Facture d'achat",
            },
            {
              '@type': 'HowToSupply',
              name: 'Photos du défaut',
            },
          ],
          tool: [
            {
              '@type': 'HowToTool',
              name: 'Ordinateur ou smartphone',
            },
          ],
          step: steps.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step.title,
            text: step.content,
            ...(step.image && {
              image: {
                '@type': 'ImageObject',
                url: step.image,
                caption: step.title,
              },
            }),
          })),
        }
      : null;

  // Schema combiné
  const schema = howToSchema ? [articleSchema, howToSchema] : articleSchema;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2),
      }}
    />
  );
};

export default GuideSchema;

// Schema FAQ Page
interface FAQSchemaProps {
  faqItems: Array<{
    question: string;
    answer: string;
    category?: string;
  }>;
  title?: string;
  description?: string;
}

export const FAQSchema: React.FC<FAQSchemaProps> = ({
  faqItems,
  title = 'FAQ - Je me défends',
  description = 'Foire aux questions sur la garantie légale de conformité',
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jemedefends.fr';

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: title,
    description: description,
    url: `${baseUrl}/faq`,
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.replace(/<[^>]*>/g, ''), // Strip HTML tags for schema
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema, null, 2),
      }}
    />
  );
};

// Schema pour la page index des guides
interface GuidesIndexSchemaProps {
  guides: Array<{
    slug: string;
    title: string;
    description: string;
    category?: string;
  }>;
}

export const GuidesIndexSchema: React.FC<GuidesIndexSchemaProps> = ({ guides }) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jemedefends.fr';

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Guides pratiques - Garantie légale de conformité',
    description: 'Collection complète de guides pour défendre vos droits de consommateur',
    url: `${baseUrl}/guides`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: guides.length,
      itemListElement: guides.map((guide, index) => ({
        '@type': 'Article',
        position: index + 1,
        headline: guide.title,
        description: guide.description,
        url: `${baseUrl}/guides/${guide.slug}`,
        author: {
          '@type': 'Organization',
          name: 'Je me défends',
        },
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Accueil',
          item: baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Guides',
          item: `${baseUrl}/guides`,
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(collectionSchema, null, 2),
      }}
    />
  );
};

// Schema pour les témoignages/avis
interface ReviewSchemaProps {
  reviews: Array<{
    author: string;
    rating: number;
    text: string;
    date: Date;
  }>;
  itemName: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export const ReviewSchema: React.FC<ReviewSchemaProps> = ({
  reviews,
  itemName,
  aggregateRating,
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jemedefends.fr';

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: itemName,
    url: baseUrl,
    ...(aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: aggregateRating.ratingValue,
        reviewCount: aggregateRating.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.text,
      datePublished: review.date.toISOString(),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(reviewSchema, null, 2),
      }}
    />
  );
};

// Schema pour les étapes du processus (service)
interface ProcessSchemaProps {
  steps: Array<{
    name: string;
    description: string;
    image?: string;
  }>;
  serviceName: string;
  serviceDescription: string;
}

export const ProcessSchema: React.FC<ProcessSchemaProps> = ({
  steps,
  serviceName,
  serviceDescription,
}) => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jemedefends.fr';

  const processSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: serviceDescription,
    provider: {
      '@type': 'Organization',
      name: 'Je me défends',
      url: baseUrl,
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Lettres de mise en demeure',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Lettre gratuite',
            description: 'Génération gratuite de lettre à imprimer',
          },
          price: '0',
          priceCurrency: 'EUR',
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Lettre premium',
            description: 'PDF professionnel + envoi recommandé',
          },
          price: '9.90',
          priceCurrency: 'EUR',
        },
      ],
    },
    serviceType: 'Aide juridique consommateur',
    areaServed: {
      '@type': 'Country',
      name: 'France',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(processSchema, null, 2),
      }}
    />
  );
};

// Hook pour générer automatiquement les schemas
export const useGuideSchema = (guide: any, isHowTo = false) => {
  // Détecter automatiquement si c'est un HowTo basé sur le contenu
  const detectHowTo = (content: string) => {
    const howToKeywords = [
      'étape',
      'étapes',
      'procédure',
      'comment faire',
      'marche à suivre',
      'démarche',
      'processus',
      'méthode',
      'tutoriel',
    ];

    return howToKeywords.some(keyword => content.toLowerCase().includes(keyword));
  };

  // Extraire les étapes du contenu si c'est un HowTo
  const extractSteps = (content: string) => {
    // Simple extraction basée sur les titres h3 ou listes ordonnées
    // À adapter selon votre format de contenu
    const stepPattern = /<h3[^>]*>([^<]+)<\/h3>[\s\S]*?(?=<h3|$)/gi;
    const steps = [];
    let match;

    while ((match = stepPattern.exec(content)) !== null) {
      steps.push({
        title: match[1],
        content: match[0].replace(/<[^>]*>/g, '').slice(0, 200) + '...',
      });
    }

    return steps.length > 1 ? steps : null;
  };

  const shouldBeHowTo = isHowTo || (guide.content && detectHowTo(guide.content));
  const steps = shouldBeHowTo ? extractSteps(guide.content || '') : null;

  return {
    shouldBeHowTo,
    steps,
    schema: { guide, steps, isHowTo: shouldBeHowTo },
  };
};
