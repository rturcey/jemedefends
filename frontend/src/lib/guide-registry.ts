import yaml from 'js-yaml';

import { yamlToGuidePage } from '@/lib/yaml-guide-converter';
import { buildRelatedGuidesSmart } from '@/lib/guide-relations';
import type { EnrichedGuide } from '@/types/guides';
import { GENERATED_GUIDES_REGISTRY, GENERATION_META, ALL_GUIDE_SLUGS } from './generated-guides';

// ============================================================================
// TYPES YAML
// ============================================================================

interface YAMLGuideForReading {
  title?: string;
  description?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  sections?: Array<{
    id: string;
    title?: string;
    content?: string;
    steps?: Array<{ title: string; description: string; duration?: string }>;
    faqItems?: Array<{ q: string; a: string }>;
    items?: Array<{ title: string; description: string }>;
    alert?: { title?: string; content: string };
    cta?: { label: string };
    tableData?: Array<Record<string, any>>;
  }>;
}

// ============================================================================
// UTILS WORD COUNT
// ============================================================================

function cleanTextForWordCount(text: string): string {
  if (!text) return '';
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]+`/g, ' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+(.+)$/gm, '$1')
    .replace(/^[-*+]\s+(.+)$/gm, '$1')
    .replace(/^\d+\.\s+(.+)$/gm, '$1')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, ' ')
    .trim();
}

function countWords(text: string): number {
  if (!text) return 0;
  const cleaned = cleanTextForWordCount(text);
  if (!cleaned) return 0;
  return cleaned
    .split(/\s+/)
    .filter(w => w.length > 0)
    .filter(w => !/^\W+$/.test(w)).length;
}

// ============================================================================
// READING TIME
// ============================================================================

export function calculateReadingTimeFromYAML(yamlContent: string): number {
  try {
    const yamlData = yaml.load(yamlContent) as YAMLGuideForReading;
    if (!yamlData || typeof yamlData !== 'object') return 1;

    let total = 0;
    if (yamlData.title) total += countWords(yamlData.title);
    if (yamlData.description) total += countWords(yamlData.description);
    if (yamlData.seo?.description) total += countWords(yamlData.seo.description);
    yamlData.seo?.keywords?.forEach(k => (total += countWords(k)));

    yamlData.sections?.forEach(section => {
      if (section.title) total += countWords(section.title);
      if (section.content) total += countWords(section.content);
      section.steps?.forEach(s => {
        total += countWords(s.title) + countWords(s.description);
      });
      section.faqItems?.forEach(f => {
        total += countWords(f.q) + countWords(f.a);
      });
      section.items?.forEach(it => {
        total += countWords(it.title) + countWords(it.description);
      });
      if (section.alert) {
        if (section.alert.title) total += countWords(section.alert.title);
        total += countWords(section.alert.content);
      }
      if (section.cta?.label) total += countWords(section.cta.label);
      section.tableData?.forEach(row => {
        Object.values(row).forEach(val => {
          if (typeof val === 'string') total += countWords(val);
        });
      });
    });

    const wordsPerMinute = 220;
    return Math.max(1, Math.ceil(total / wordsPerMinute));
  } catch {
    return 1;
  }
}

// cache lecture par slug
const READING_TIME_CACHE = new Map<string, number>();
let READING_TIME_BUILD_STAMP = GENERATION_META.timestamp;

function ensureReadingTimeCacheFresh() {
  if (READING_TIME_BUILD_STAMP !== GENERATION_META.timestamp) {
    READING_TIME_CACHE.clear();
    READING_TIME_BUILD_STAMP = GENERATION_META.timestamp;
  }
}

function getReadingTimeFor(slug: string, yamlContent: string): number {
  ensureReadingTimeCacheFresh();
  const hit = READING_TIME_CACHE.get(slug);
  if (hit != null) return hit;
  const rt = calculateReadingTimeFromYAML(yamlContent);
  READING_TIME_CACHE.set(slug, rt);
  return rt;
}

// ============================================================================
// CACHE GUIDES
// ============================================================================

const GUIDE_CACHE = new Map<string, EnrichedGuide>();

// ============================================================================
// API PRINCIPALE
// ============================================================================

export function getFullGuide(slug: string): EnrichedGuide | null {
  if (GUIDE_CACHE.has(slug)) return GUIDE_CACHE.get(slug)!;

  const yamlContent = GENERATED_GUIDES_REGISTRY[slug];
  if (!yamlContent) return null;

  try {
    const guide = yamlToGuidePage(yamlContent);
    if (!guide || !guide.metadata || !guide.sections || !guide.legal) return null;
    if (!guide.legal.mainArticles) return null;

    const readingTime = getReadingTimeFor(slug, yamlContent);

    const enriched: EnrichedGuide = {
      ...guide,
      slug,
      readingTime,
      category: guide.metadata.category,
      relatedGuides: [],
    };

    try {
      enriched.relatedGuides = buildRelatedGuidesSmart(slug, GENERATED_GUIDES_REGISTRY, {
        limit: 4,
        minScore: 0.06,
        preferSameCategory: true,
      });
    } catch {
      enriched.relatedGuides = Object.keys(GENERATED_GUIDES_REGISTRY)
        .filter(s => {
          const raw = GENERATED_GUIDES_REGISTRY[s];
          if (!raw) return false;
          const parsed = yaml.load(raw) as { category?: string };
          return parsed?.category && parsed.category.toLowerCase() === enriched.category.id;
        })
        .slice(0, 3);
    }

    GUIDE_CACHE.set(slug, enriched);
    return enriched;
  } catch {
    return null;
  }
}

export function getAllGuides(): Record<string, EnrichedGuide> {
  const out: Record<string, EnrichedGuide> = {};
  Object.keys(GENERATED_GUIDES_REGISTRY).forEach(slug => {
    const g = getFullGuide(slug);
    if (g) out[slug] = g;
  });
  return out;
}

export function getOriginalYAMLForSlug(slug: string): string | null {
  return GENERATED_GUIDES_REGISTRY[slug] || null;
}

export function getAllGuideSlugs(): string[] {
  return ALL_GUIDE_SLUGS;
}

export function addGuideYAML(slug: string, yamlContent: string): void {
  if (process.env.NODE_ENV === 'development') {
    (GENERATED_GUIDES_REGISTRY as any)[slug] = yamlContent;
    GUIDE_CACHE.delete(slug);
    READING_TIME_CACHE.delete(slug);
  }
}

export function getGenerationInfo() {
  return GENERATION_META;
}
