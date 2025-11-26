// frontend/src/lib/guide-utils.ts
import yaml from 'js-yaml';
import { yamlToGuidePage } from '@/lib/yaml-guide-converter';
import { buildRelatedGuidesSmart } from '@/lib/guide-relations';
import type { EnrichedGuide } from '@/types/guides';
import { GENERATED_GUIDES_REGISTRY, GENERATION_META } from './generated-guides';

// ---------------------------------------------------------------------------
// Fallback catégorie (au cas très rare où le YAML serait incomplet)
// ---------------------------------------------------------------------------
const FALLBACK_CATEGORY = {
  id: 'general',
  name: 'Général',
  description: 'Guides généraux sur vos droits de consommateur',
  color: 'bg-gray-500',
  emoji: '⚖️',
};

// ---------------------------------------------------------------------------
// Reading time helpers (cache local, invalidé si la génération change)
// ---------------------------------------------------------------------------
const READING_TIME_CACHE = new Map<string, number>();
let READING_TIME_BUILD_STAMP = GENERATION_META.timestamp;

function ensureReadingTimeCacheFresh() {
  if (READING_TIME_BUILD_STAMP !== GENERATION_META.timestamp) {
    READING_TIME_CACHE.clear();
    READING_TIME_BUILD_STAMP = GENERATION_META.timestamp;
  }
}

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

function calculateReadingTimeFromYAML(yamlContent: string): number {
  try {
    const data = yaml.load(yamlContent) as any;
    if (!data || typeof data !== 'object') return 1;

    let total = 0;
    if (data.title) total += countWords(data.title);
    if (data.description) total += countWords(data.description);
    if (data.seo?.description) total += countWords(data.seo.description);
    data.seo?.keywords?.forEach((k: string) => (total += countWords(k)));

    (data.sections ?? []).forEach((s: any) => {
      if (s.title) total += countWords(s.title);
      if (s.content) total += countWords(s.content);
      (s.steps ?? []).forEach((st: any) => {
        total += countWords(st.title) + countWords(st.description);
      });
      (s.faqItems ?? []).forEach((f: any) => {
        total += countWords(f.q) + countWords(f.a);
      });
      (s.items ?? []).forEach((it: any) => {
        total += countWords(it.title) + countWords(it.description);
      });
      if (s.alert) {
        if (s.alert.title) total += countWords(s.alert.title);
        total += countWords(s.alert.content);
      }
      if (s.cta?.label) total += countWords(s.cta.label);
      (s.tableData ?? []).forEach((row: Record<string, any>) => {
        Object.values(row).forEach(val => {
          if (typeof val === 'string') total += countWords(val);
        });
      });
    });

    const wpm = 220;
    return Math.max(1, Math.ceil(total / wpm));
  } catch {
    return 1;
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

// ---------------------------------------------------------------------------
// Cache des guides (clé = slug)
// ---------------------------------------------------------------------------
const GUIDE_CACHE = new Map<string, EnrichedGuide>();

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------
export function getFullGuide(slug: string): EnrichedGuide | null {
  if (GUIDE_CACHE.has(slug)) return GUIDE_CACHE.get(slug)!;

  const yamlContent = GENERATED_GUIDES_REGISTRY[slug];
  if (!yamlContent) return null;

  try {
    const guide = yamlToGuidePage(yamlContent);
    if (!guide?.metadata || !guide.sections || !guide.legal?.mainArticles) return null;

    const readingTime = getReadingTimeFor(slug, yamlContent);

    const enriched: EnrichedGuide = {
      ...guide,
      slug,
      readingTime,
      // ✅ on prend l’objet de catégorie déjà fourni par le converter
      category: guide.metadata.category ?? FALLBACK_CATEGORY,
      relatedGuides: [],
    };

    try {
      enriched.relatedGuides = buildRelatedGuidesSmart(slug, GENERATED_GUIDES_REGISTRY, {
        limit: 4,
        minScore: 0.06,
        preferSameCategory: true,
      });
    } catch {
      // Fallback basique si le ranking “smart” plante
      enriched.relatedGuides = Object.keys(GENERATED_GUIDES_REGISTRY)
        .filter(s => s !== slug)
        .filter(s => {
          const raw = GENERATED_GUIDES_REGISTRY[s];
          if (!raw) return false;
          const parsed = yaml.load(raw) as { category?: string };
          const thisCatId = (enriched.category?.id ?? 'general').toLowerCase();
          return (parsed?.category ?? '').toLowerCase() === thisCatId;
        })
        .slice(0, 3);
    }

    GUIDE_CACHE.set(slug, enriched);
    return enriched;
  } catch {
    return null;
  }
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Helper pour les couleurs de catégorie
export const getCategoryColors = (color: string, isSelected?: boolean) => {
  const colors = {
    blue: isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700',
    green: isSelected ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700',
    red: isSelected ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700',
    purple: isSelected ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-700',
    yellow: isSelected ? 'bg-yellow-600 text-white' : 'bg-yellow-50 text-yellow-700',
    indigo: isSelected ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700',
    orange: isSelected ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-700',
    gray: isSelected ? 'bg-gray-600 text-white' : 'bg-gray-50 text-gray-700',
  };
  return colors[color as keyof typeof colors] || colors.gray;
};
