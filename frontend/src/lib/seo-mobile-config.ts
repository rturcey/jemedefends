import type { Metadata } from 'next';

// Types pour la configuration SEO mobile
export interface MobileSEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage?: string;
  structuredData?: Record<string, any>;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

// Configuration SEO de base mobile-first
export const createMobileSEO = (config: MobileSEOConfig): Metadata => {
  const baseUrl = 'https://jemedefends.fr';

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords.join(', '),

    // Viewport mobile-optimisé
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
      userScalable: true,
    },

    // Métadonnées de base
    authors: [{ name: 'Je me défends' }],
    creator: 'Je me défends',
    publisher: 'Je me défends',

    // Format detection
    formatDetection: {
      telephone: false,
      date: false,
      address: false,
      email: false,
    },

    // Canonical
    alternates: {
      canonical: config.canonicalUrl,
    },

    // Open Graph mobile-optimisé
    openGraph: {
      type: 'article',
      title: config.title,
      description: config.description,
      url: config.canonicalUrl,
      siteName: 'Je me défends',
      locale: 'fr_FR',
      images: [
        {
          url: config.ogImage || `${baseUrl}/images/og-default.jpg`,
          width: 1200,
          height: 630,
          alt: config.title,
          type: 'image/jpeg',
        },
        // Image spécifique mobile
        {
          url: config.ogImage?.replace('.jpg', '-mobile.jpg') || `${baseUrl}/images/og-mobile.jpg`,
          width: 600,
          height: 315,
          alt: `${config.title} - Version mobile`,
          type: 'image/jpeg',
        },
      ],
    },

    // Twitter Card mobile-optimisé
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      site: '@jemedefends_fr',
      creator: '@jemedefends_fr',
      images: [config.ogImage || `${baseUrl}/images/og-default.jpg`],
    },

    // Robots mobile-friendly
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

    // PWA et mobile
    manifest: '/manifest.json',
    themeColor: '#3B82F6',

    // Apple mobile
    appleWebApp: {
      capable: true,
      title: 'Je me défends',
      statusBarStyle: 'default',
    },

    // Autres métadonnées mobile
    other: {
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-touch-fullscreen': 'yes',
      'format-detection': 'telephone=no',
    },
  };
};

// Schémas JSON-LD mobile-optimisés
export const createMobileSchemas = (config: MobileSEOConfig) => {
  const baseUrl = 'https://jemedefends.fr';

  const schemas = [];

  // Schema Organization
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Je me défends',
    description: "Plateforme d'aide aux consommateurs pour faire valoir leurs droits",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contact@jemedefends.fr',
      availableLanguage: 'French',
    },
    sameAs: ['https://twitter.com/jemedefends_fr', 'https://linkedin.com/company/jemedefends'],
  });

  // Schema Article (pour les guides)
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: config.title,
    description: config.description,
    url: config.canonicalUrl,
    datePublished: '2025-01-15T00:00:00Z',
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Je me défends',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Je me défends',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 200,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': config.canonicalUrl,
    },
    image: config.ogImage || `${baseUrl}/images/og-default.jpg`,
    articleSection: 'Droit de la consommation',
    keywords: config.keywords,
    inLanguage: 'fr-FR',
  });

  // Schema Breadcrumbs si disponible
  if (config.breadcrumbs && config.breadcrumbs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: config.breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    });
  }

  // Schema supplémentaire si fourni
  if (config.structuredData) {
    schemas.push(config.structuredData);
  }

  return schemas;
};

// Configuration spécifique pour les guides mobile
export const GUIDE_MOBILE_SEO_DEFAULTS = {
  titleSuffix: ' | Je me défends',
  maxTitleLength: 60,
  maxDescriptionLength: 160,
  defaultKeywords: ['garantie légale', 'conformité', 'consommateur', 'recours', 'France', '2025'],
  ogImagePath: '/images/guides/',
  canonicalBase: 'https://jemedefends.fr/guides/',
};

// Fonction pour optimiser automatiquement le SEO mobile
export const optimizeForMobile = (config: Partial<MobileSEOConfig>): MobileSEOConfig => {
  const defaults = GUIDE_MOBILE_SEO_DEFAULTS;

  // Optimisation du titre
  let title = config.title || '';
  if (title.length > defaults.maxTitleLength) {
    title = title.substring(0, defaults.maxTitleLength - 3) + '...';
  }
  if (!title.includes(defaults.titleSuffix)) {
    title += defaults.titleSuffix;
  }

  // Optimisation de la description
  let description = config.description || '';
  if (description.length > defaults.maxDescriptionLength) {
    description = description.substring(0, defaults.maxDescriptionLength - 3) + '...';
  }

  // Fusion des mots-clés
  const keywords = [...defaults.defaultKeywords, ...(config.keywords || [])].filter(
    (keyword, index, array) => array.indexOf(keyword) === index,
  );

  return {
    title,
    description,
    keywords,
    canonicalUrl: config.canonicalUrl || '',
    ogImage: config.ogImage,
    structuredData: config.structuredData,
    breadcrumbs: config.breadcrumbs,
  };
};

// Hook React pour gérer le SEO mobile en temps réel
export const useMobileSEO = (config: MobileSEOConfig) => {
  React.useEffect(() => {
    // Mise à jour dynamique du viewport si nécessaire
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0');
    }

    // Ajout des schémas JSON-LD
    const schemas = createMobileSchemas(config);
    schemas.forEach((schema, index) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      script.id = `schema-${index}`;
      document.head.appendChild(script);
    });

    // Nettoyage
    return () => {
      schemas.forEach((_, index) => {
        const script = document.getElementById(`schema-${index}`);
        if (script) {
          document.head.removeChild(script);
        }
      });
    };
  }, [config]);
};

// Validation SEO mobile
export const validateMobileSEO = (
  config: MobileSEOConfig,
): { valid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validations critiques
  if (!config.title || config.title.length < 10) {
    errors.push('Titre trop court (minimum 10 caractères)');
  }
  if (config.title && config.title.length > 60) {
    errors.push('Titre trop long (maximum 60 caractères)');
  }

  if (!config.description || config.description.length < 50) {
    errors.push('Description trop courte (minimum 50 caractères)');
  }
  if (config.description && config.description.length > 160) {
    errors.push('Description trop longue (maximum 160 caractères)');
  }

  if (!config.canonicalUrl) {
    errors.push('URL canonique manquante');
  }

  // Avertissements
  if (!config.keywords || config.keywords.length < 3) {
    warnings.push('Moins de 3 mots-clés définis');
  }

  if (!config.ogImage) {
    warnings.push('Image Open Graph manquante');
  }

  if (!config.breadcrumbs || config.breadcrumbs.length === 0) {
    warnings.push('Breadcrumbs manquants');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
};

// Export des configurations prêtes à l'emploi
export const MOBILE_SEO_TEMPLATES = {
  guide: (title: string, description: string, slug: string): MobileSEOConfig => ({
    title: `${title} | Je me défends`,
    description,
    keywords: [...GUIDE_MOBILE_SEO_DEFAULTS.defaultKeywords, 'guide'],
    canonicalUrl: `${GUIDE_MOBILE_SEO_DEFAULTS.canonicalBase}${slug}`,
    breadcrumbs: [
      { name: 'Accueil', url: 'https://jemedefends.fr' },
      { name: 'Guides', url: 'https://jemedefends.fr/guides' },
      { name: title, url: `https://jemedefends.fr/guides/${slug}` },
    ],
  }),

  page: (title: string, description: string, path: string): MobileSEOConfig => ({
    title: `${title} | Je me défends`,
    description,
    keywords: GUIDE_MOBILE_SEO_DEFAULTS.defaultKeywords,
    canonicalUrl: `https://jemedefends.fr${path}`,
  }),

  homepage: (): MobileSEOConfig => ({
    title: 'Je me défends - Vos droits de consommateur simplifiés',
    description:
      'Plateforme gratuite pour faire valoir vos droits de consommateur. Générez vos lettres de mise en demeure en 3 minutes. Garantie légale, SAV, recours.',
    keywords: [
      'droits consommateur',
      'garantie légale',
      'mise en demeure',
      'SAV',
      'recours consommateur',
      'France',
    ],
    canonicalUrl: 'https://jemedefends.fr',
  }),
};

// Import React pour le hook
import React from 'react';

export default {
  createMobileSEO,
  createMobileSchemas,
  optimizeForMobile,
  useMobileSEO,
  validateMobileSEO,
  MOBILE_SEO_TEMPLATES,
  GUIDE_MOBILE_SEO_DEFAULTS,
};
