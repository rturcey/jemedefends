// frontend/src/types/guide-components.ts
// Types spécifiques pour les composants guides
import type { GuideCategory, EnrichedGuide, GuideSection } from './guides';

// Props communes à tous les composants guides
export interface GuideComponentBaseProps {
  className?: string;
}

// Props pour GuideCard
export interface GuideCardProps extends GuideComponentBaseProps {
  slug: string;
  title: string;
  description: string;
  category: GuideCategory;
  readingTime: number;
  lastUpdated: Date;
}

// Props pour GuideHero
export interface GuideHeroProps extends GuideComponentBaseProps {
  title: string;
  description: string;
  category: GuideCategory;
  readingTime: number;
  lastUpdated: Date;
  onGenerateLetter?: () => void;
}

// Props pour GuideNavigation
export interface GuideNavigationProps extends GuideComponentBaseProps {
  currentSlug: string;
  relatedGuides: Array<{
    slug: string;
    title: string;
  }>;
  onGuideChange?: (slug: string) => void;
}

// Props pour GuideTOC
export interface GuideTOCProps extends GuideComponentBaseProps {
  /**
   * Le sélecteur CSS pour l'élément dont on veut extraire le sommaire
   * @default 'main article'
   */
  selector?: string;
  /**
   * Permet de forcer un ID actif (utile pour le SSR ou les tests)
   */
  activeId?: string | null;
  /**
   * Callback appelé quand l'utilisateur clique sur un élément du sommaire
   */
  onNavigate?: (id: string) => void;
}

// Props pour GuideSection
export interface GuideSectionProps extends GuideComponentBaseProps {
  section: GuideSection;
}

// Props pour GuideEssentials
export interface GuideEssentialsProps extends GuideComponentBaseProps {
  mainArticles: string[];
  disclaimer: boolean;
}

// Props pour ProcedureSteps
export interface ProcedureStepsProps extends GuideComponentBaseProps {
  steps: Array<{
    id?: string;
    title: string;
    description: string;
    duration?: string;
    legalRef?: string;
  }>;
}

// Props pour OptionsTable
export interface OptionsTableProps extends GuideComponentBaseProps {
  options: Array<{
    name: string;
    description: string;
    pros: string[];
    cons: string[];
    recommended?: boolean;
  }>;
}

// Props pour RelatedGuides
export interface RelatedGuidesProps extends GuideComponentBaseProps {
  guides: Array<{
    slug: string;
    title: string;
    description: string;
    category: GuideCategory;
  }>;
  title?: string;
}

// Props pour ContextualCTA
export interface ContextualCTAProps extends GuideComponentBaseProps {
  title: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
}

// Props pour EligibilityChecklist
export interface EligibilityChecklistProps extends GuideComponentBaseProps {
  items: Array<{
    id: string;
    label: string;
    description?: string;
    legalRef?: string;
  }>;
  onCheck?: (id: string, checked: boolean) => void;
}

// Props pour GuideDisclaimer
export interface GuideDisclaimerProps extends GuideComponentBaseProps {
  lastUpdated: Date;
}

// Props pour GuideProgress
export interface GuideProgressProps extends GuideComponentBaseProps {
  currentStep: number;
  totalSteps: number;
  onStepChange?: (step: number) => void;
}

// Props pour GuideRightSidebar
export interface GuideRightSidebarProps extends GuideComponentBaseProps {
  tableOfContents: Array<{
    id: string;
    title: string;
    level: number;
  }>;
  relatedGuides: Array<{
    slug: string;
    title: string;
  }>;
  onGuideNavigate?: (slug: string) => void;
  onTOCClick?: (id: string) => void;
}