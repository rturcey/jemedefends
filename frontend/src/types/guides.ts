export interface GuideSection {
  id: string;
  title: string;
  html: string;
}

export interface GuidePage {
  title: string;
  subtitle?: string;
  description?: string; // AJOUT
  seo: {
    title: string;
    description: string;
    keywords?: string[];
  };
  sections: GuideSection[];
  schema?: Record<string, any>;
  faqSchema?: Record<string, any>;
  disclaimer?: string;
  keywords?: string[]; // AJOUT pour la recherche
}
