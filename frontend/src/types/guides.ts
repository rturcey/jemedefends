import type { LegalArticleId } from '@/legal/registry';

export interface GuidePage {
  metadata: GuideMetadata;
  sections: GuideSection[];
  legal: GuideLegal;
}

export interface GuideMetadata {
  title: string;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  breadcrumb?: Array<{
    name: string;
    url: string;
  }>;
}

export interface GuideSection {
  id: string;
  title: string;
  content?: string | React.ReactNode;
  type?: 'timeline' | 'table' | 'faq' | 'grid' | 'alternatives' | 'contacts' | 'content';

  steps?: Array<{
    id?: string;
    title: string;
    description: string;
    duration?: string;
    legalRef?: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;

  tableData?: Array<Record<string, any>>;
  faqItems?: Array<{ q: string; a: string }>;
  items?: Array<{
    title: string;
    description: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;

  legalReferences?: LegalArticleId[];
}

export interface GuideLegal {
  mainArticles: LegalArticleId[];
  disclaimer: boolean;
  lastUpdated: string;
}

export interface EnrichedGuide extends GuidePage {
  slug: string;
  readingTime: number;
  relatedGuides: string[];
  category: {
    name: string;
    color: string;
    emoji: string;
  };
}
