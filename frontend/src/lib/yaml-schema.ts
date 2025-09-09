// ============================================================================
// SCHÉMA YAML POUR AUTO-COMPLETION MONACO
// ============================================================================

// *** src/lib/yaml-schema.ts ***
export const YAML_GUIDE_SCHEMA = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description: 'Titre principal du guide',
    },
    description: {
      type: 'string',
      description: 'Description courte du guide',
    },
    category: {
      type: 'string',
      enum: ['general', 'tech', 'home', 'auto'],
      description: 'Catégorie du guide',
    },
    slug: {
      type: 'string',
      pattern: '^[a-z0-9-]+$',
      description: 'Identifiant URL unique',
    },
    seo: {
      type: 'object',
      properties: {
        title: { type: 'string', description: 'Titre SEO' },
        description: { type: 'string', description: 'Description SEO' },
        keywords: {
          type: 'array',
          items: { type: 'string' },
          description: 'Mots-clés SEO',
        },
      },
    },
    legal: {
      type: 'object',
      required: ['mainArticles', 'disclaimer', 'lastUpdated'],
      properties: {
        mainArticles: {
          type: 'array',
          items: {
            type: 'string',
            pattern: '^[LRD]\\.\\d{1,4}(?:-\\d+)*$',
          },
          description: 'Articles de loi principaux (ex: L.217-9)',
        },
        disclaimer: {
          type: 'boolean',
          description: 'Afficher disclaimer juridique',
        },
        lastUpdated: {
          type: 'string',
          format: 'date',
          description: 'Date dernière mise à jour',
        },
      },
    },
    sections: {
      type: 'array',
      items: {
        type: 'object',
        required: ['id', 'title'],
        properties: {
          id: {
            type: 'string',
            pattern: '^[a-z0-9-]+$',
            description: 'Identifiant unique de section',
          },
          title: {
            type: 'string',
            description: 'Titre de la section',
          },
          icon: {
            type: 'string',
            description: 'Nom icône Lucide React',
          },
          type: {
            type: 'string',
            enum: ['content', 'timeline', 'table', 'faq', 'grid', 'alternatives', 'contacts'],
            default: 'content',
            description: 'Type de rendu de section',
          },
          content: {
            type: 'string',
            description: 'Contenu texte avec markdown',
          },
          alert: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: ['info', 'success', 'warning', 'error'],
              },
              title: { type: 'string' },
              content: { type: 'string' },
            },
          },
          badges: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                text: { type: 'string' },
                tone: {
                  type: 'string',
                  enum: ['blue', 'green', 'purple', 'yellow', 'indigo', 'red', 'emerald'],
                },
              },
            },
          },
          cta: {
            type: 'object',
            properties: {
              label: { type: 'string' },
              href: { type: 'string' },
              icon: { type: 'string' },
              variant: {
                type: 'string',
                enum: ['primary', 'secondary', 'ghost'],
              },
            },
          },
        },
      },
    },
  },
  required: ['title', 'description', 'category', 'slug', 'legal', 'sections'],
};
