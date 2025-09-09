// types/guides.ts
import type * as React from 'react';

/** Ex: 'L.217-3', 'L.217-14', etc. (libre si tu préfères juste `string`) */
export type LegalArticleId = `L.${number}-${number}` | string;

export interface GuideSEO {
  title: string;
  description: string;
  keywords?: string[];
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface GuideMetadata {
  title: string;
  seo: GuideSEO;
  breadcrumb?: BreadcrumbItem[];
}

/** Base commune à toutes les sections */
export interface GuideSectionBase {
  id: string;
  title: string;
}

/** Section en JSX (ton cas courant) */
export interface GuideSectionJSX extends GuideSectionBase {
  content: React.ReactNode;
  html?: never;
}

/** Section en HTML pur si besoin (fallback/SSR, import CMS, etc.) */
export interface GuideSectionHTML extends GuideSectionBase {
  html: string;
  content?: never;
}

/** Union discriminée : une section est soit en JSX, soit en HTML */
export type GuideSection = GuideSectionJSX | GuideSectionHTML;

export interface GuideLegal {
  /** articles mis en avant, ex. ['L.217-11', 'L.217-9'] */
  mainArticles: LegalArticleId[];
  disclaimer?: boolean;
  /** format ISO YYYY-MM-DD */
  lastUpdated?: string;
}

export interface GuidePage {
  metadata: GuideMetadata;
  sections: GuideSection[];
  legal?: GuideLegal;

  /** Données schema.org pré-générées si besoin */
  schema?: Record<string, any>;
  faqSchema?: Record<string, any>;

  /** Champs optionnels utiles à la recherche interne, etc. */
  keywords?: string[];
  disclaimer?: string;
}
