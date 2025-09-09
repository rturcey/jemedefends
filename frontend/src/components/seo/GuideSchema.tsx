// src/components/seo/GuideSchema.tsx - Version sans erreur hydratation
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
    difficulty?: string;
    category?: {
      name: string;
      emoji: string;
    };
    metadata?: {
      title: string;
      seo?: {
        description: string;
        keywords: string[];
      };
    };
    sections?: Array<{
      type?: string;
      faqItems?: Array<{ q: string; a: string }>;
    }>;
    relatedGuides?: string[];
  };
  steps?: Array<{
    title: string;
    content: string;
    image?: string;
  }>;
  isHowTo?: boolean;
  readingTime?: number;
  difficulty?: string;
  relatedGuides?: string[];
  additionalSchema?: any;
}

const GuideSchema: React.FC<GuideSchemaProps> = ({
  guide,
  steps,
  isHowTo = false,
  readingTime,
  difficulty,
  relatedGuides,
  additionalSchema,
}) => {
  // Valeurs fixes pour éviter les différences serveur/client
  const baseUrl = 'https://jemedefends.fr'; // Valeur fixe
  const guideUrl = `${baseUrl}/guides/${guide.slug}`;
  const publishedDate = new Date('2024-11-01').toISOString(); // Date fixe

  // Date de modification fixe ou fournie
  const modifiedDate = guide.lastUpdated
    ? guide.lastUpdated.toISOString()
    : new Date('2024-11-01').toISOString(); // Date fixe par défaut

  // Utiliser les valeurs enrichies ou fallback
  const finalReadingTime = readingTime || guide.readingTime || 5;
  const finalTitle = guide.metadata?.title || guide.title;
  const finalDescription = guide.metadata?.seo?.description || guide.description;
  const finalKeywords = guide.metadata?.seo?.keywords || guide.keywords || [];

  // Schema Article de base (stable)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: finalTitle,
    description: finalDescription,
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
    datePublished: publishedDate,
    dateModified: modifiedDate,
    articleSection: guide.category?.name || 'Guides consommateur',
    keywords: Array.isArray(finalKeywords) ? finalKeywords.join(', ') : '',
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
    wordCount: guide.content?.split(' ').length || 1000,
    timeRequired: `PT${finalReadingTime}M`,
    // Difficulté seulement si fournie
    ...(difficulty && {
      educationalLevel:
        difficulty === 'facile' ? 'Beginner' : difficulty === 'moyen' ? 'Intermediate' : 'Advanced',
    }),
  };

  // Auto-detect FAQ dans les sections (stable)
  const faqItems =
    guide.sections?.filter(s => s.type === 'faq').flatMap(s => s.faqItems || []) || [];

  // Schema FAQ seulement si FAQ présentes
  const faqSchema =
    faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map(item => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.a.replace(/<[^>]*>/g, ''), // Strip HTML
            },
          })),
        }
      : null;

  // Schema HowTo seulement si demandé
  const howToSchema =
    isHowTo && steps
      ? {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: finalTitle,
          description: finalDescription,
          image: `${baseUrl}/images/guides/${guide.slug}-og.jpg`,
          totalTime: `PT${finalReadingTime}M`,
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

  // Assembler seulement les schémas non-null
  const schemas = [articleSchema, faqSchema, howToSchema, additionalSchema].filter(Boolean);

  // Schema final (un seul ou array selon le nombre)
  const finalSchema = schemas.length === 1 ? schemas[0] : schemas;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(finalSchema, null, 0), // Pas d'indentation pour éviter les différences
      }}
    />
  );
};

export default GuideSchema;
