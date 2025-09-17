// ============================================================================
// yaml-guide-converter.ts — Conversion YAML -> GuidePage (server-safe)
// - Rend du JSX serveur uniquement (AUCUN composant client).
// - Réfs légales insérées en <span data-legal-id="...">...</span>
//   (hydratées en <LegalReference/> côté client par LegalHydrator).
// ============================================================================

import React from 'react';
import yaml from 'js-yaml';

// UI existants
import { getSectionIcon } from '@/lib/icon-utils';
import ProcedureSteps, { type ProcedureStep } from '@/components/guides/ProcedureSteps';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import TableComparison from '@/components/guides/TableComparison';
import FAQ from '@/components/ui/FAQ';
import DefaultGrid from '@/components/ui/DefaultGrid';
import DefaultAlternatives from '@/components/ui/DefaultAlternatives';
import DefaultContacts from '@/components/ui/DefaultContacts';

// Légal (types/guard uniquement — PAS de composant client ici)
import { isValidLegalArticleId, type LegalArticleId } from '@/legal/registry';

// Types guide
import type { GuidePage, GuideMetadata, GuideSection, GuideLegal } from '@/types/guides';

// ============================================================================
// Types YAML d'entrée
// ============================================================================
interface YAMLGuideConfig {
  title: string;
  description?: string;
  category: 'general' | 'tech' | 'home' | 'auto' | string;
  slug: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  legal?: {
    mainArticles?: string[];
    disclaimer?: boolean;
    lastUpdated?: string;
  };
  sections: YAMLSection[];
}

interface YAMLSection {
  id: string;
  title?: string;
  icon?: string;
  type?: 'timeline' | 'table' | 'faq' | 'grid' | 'alternatives' | 'contacts' | 'content';
  content?: string;

  alert?: {
    type: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    content: string;
  };

  badges?: Array<{
    text: string;
    tone?: 'blue' | 'green' | 'purple' | 'yellow' | 'indigo' | 'red' | 'emerald' | 'gray';
  }>;

  steps?: Array<{
    title: string;
    description: string;
    duration?: string;
    legalRef?: string;
  }>;

  faqItems?: Array<{ q: string; a: string }>;
  items?: Array<{ title: string; description: string }>;

  cta?: {
    label: string;
    href: string;
    icon?: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  };

  tableData?: Array<Record<string, any>>;
}

// helpers en haut du fichier
function wordsOf(s?: string) {
  if (!s) return 0;
  // on “dé-markdownise” très grossièrement
  const plain = s
    .replace(/`[^`]+`/g, ' ') // code inline
    .replace(/\*\*?|__|~~|>/g, ' ') // bold/italic/quote
    .replace(/#+\s/g, ' ') // titres markdown
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // liens [txt](url) -> txt
    .replace(/[\|\-\+\*]/g, ' '); // bullets/pipe
  return plain.split(/\s+/).filter(Boolean).length;
}

function estimateSectionWords(section: any): number {
  let n = 0;

  // contenu brut YAML (avant rendu React)
  if (typeof section.content === 'string') n += wordsOf(section.content);

  // steps (si fournis)
  if (Array.isArray(section.steps)) {
    for (const s of section.steps) {
      n += wordsOf(s.title) + wordsOf(s.description);
    }
  }

  // FAQ
  if (Array.isArray(section.faqItems)) {
    for (const it of section.faqItems) {
      n += wordsOf(it.q) + wordsOf(it.a);
    }
  }

  // items (grilles)
  if (Array.isArray(section.items)) {
    for (const it of section.items) {
      n += wordsOf(it.title) + wordsOf(it.description);
    }
  }

  // tableaux (concatène les cellules texte)
  if (Array.isArray(section.tableData)) {
    for (const row of section.tableData) {
      for (const v of Object.values(row)) {
        if (typeof v === 'string') n += wordsOf(v);
      }
    }
  }

  return n;
}

function detectSectionType(section: YAMLSection): YAMLSection['type'] {
  if (section.type) return section.type;
  if (section.steps?.length) return 'timeline';
  if (section.tableData?.length) return 'table';
  if (section.faqItems?.length) return 'faq';
  if (section.items?.length) return 'grid';
  if (section.id?.includes('alternative')) return 'alternatives';
  if (section.id?.includes('contact')) return 'contacts';
  return 'content';
}

/** Normalise "art. L 217-3" / "L.217-3" / "l 217-3" -> "L.217-3" si supporté */
function normalizeLegalId(raw: string): LegalArticleId | null {
  const t = raw.replace(/\u00A0/g, ' ').trim();
  const m = t.match(
    /(?:^|[\s,;(\[]) *(?:art\.?\s*)?([LRD])\s*\.?\s*(\d{1,4})\s*-\s*(\d{1,3}) *(?=$|[\s,;)\]])/i,
  );
  if (!m) return null;
  const id = `${m[1].toUpperCase()}.${m[2]}-${m[3]}`;
  return isValidLegalArticleId(id) ? (id as LegalArticleId) : null;
}

/** Tokenise un texte en segments {text|legal} pour insertion de spans server-safe */
function tokenizeLegalInline(text: string): Array<
  | { type: 'text'; value: string }
  | {
      type: 'legal';
      id: LegalArticleId;
      raw: string;
    }
> {
  const re = /(?:art\.?\s*)?[LRD]\s*\.?\s*\d{1,4}\s*-\s*\d{1,3}/gi;
  const out: Array<
    | { type: 'text'; value: string }
    | {
        type: 'legal';
        id: LegalArticleId;
        raw: string;
      }
  > = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const raw = m[0];
    const norm = normalizeLegalId(raw);
    if (m.index > last) out.push({ type: 'text', value: text.slice(last, m.index) });
    if (norm) out.push({ type: 'legal', id: norm, raw });
    else out.push({ type: 'text', value: raw });
    last = m.index + raw.length;
  }
  if (last < text.length) out.push({ type: 'text', value: text.slice(last) });
  return out;
}

function renderInlineWithLegal(text: string): React.ReactNode[] {
  const codeSplit = text.split(/`([^`]+)`/g);
  const codeNodes = codeSplit.map((chunk, i) => {
    if (i % 2 === 1)
      return React.createElement(
        'code',
        { key: `c${i}`, className: 'bg-gray-100 px-1 rounded' },
        chunk,
      );
    return chunk;
  });

  const nodes: React.ReactNode[] = [];
  codeNodes.forEach((piece, idx) => {
    if (typeof piece !== 'string') {
      nodes.push(React.cloneElement(piece as any, { key: `n${idx}` }));
      return;
    }
    const boldSplit = piece.split(/\*\*(.+?)\*\*/g);
    boldSplit.forEach((b, bi) => {
      if (bi % 2 === 1) {
        nodes.push(React.createElement('strong', { key: `b${idx}-${bi}` }, b));
      } else {
        const emSplit = b.split(/\*(.+?)\*/g);
        emSplit.forEach((e, ei) => {
          const key = `e${idx}-${bi}-${ei}`;
          if (ei % 2 === 1) {
            nodes.push(React.createElement('em', { key }, e));
          } else {
            const tokens = tokenizeLegalInline(e);
            tokens.forEach((t, ti) => {
              if (t.type === 'text') {
                nodes.push(React.createElement(React.Fragment, { key: `${key}-t${ti}` }, t.value));
              } else {
                nodes.push(
                  React.createElement('span', {
                    key: `${key}-l${ti}`,
                    'data-legal-id': t.id,
                    className: 'inline-flex items-center',
                  }), // ✅ no children
                );
              }
            });
          }
        });
      }
    });
  });

  return nodes;
}

function renderRichTextWithLegal(content: string): {
  node: React.ReactNode;
  found: LegalArticleId[];
} {
  const lines = (content || '').replace(/\r\n/g, '\n').split('\n');
  const acc: React.ReactNode[] = [];
  const found = new Set<LegalArticleId>();

  let para: string[] = [];
  let listType: 'ul' | 'ol' | null = null;
  let listItems: string[] = [];
  let keySeq = 0;

  const flushPara = () => {
    if (!para.length) return;
    const txt = para.join('\n');
    tokenizeLegalInline(txt).forEach(t => t.type === 'legal' && found.add(t.id));
    acc.push(
      React.createElement(
        'p',
        {
          key: `p-${keySeq++}`,
          className: 'mb-4 leading-relaxed text-gray-800 text-justify',
        },
        renderInlineWithLegal(txt),
      ),
    );
    para = [];
  };

  const flushList = () => {
    if (!listType || listItems.length === 0) return;
    listItems.forEach(li =>
      tokenizeLegalInline(li).forEach(t => t.type === 'legal' && found.add(t.id)),
    );

    const listChildren = listItems.map((li, i) =>
      React.createElement(
        'li',
        { key: `li-${i}`, className: 'leading-relaxed text-gray-800 text-justify' },
        renderInlineWithLegal(li),
      ),
    );

    const listClass =
      listType === 'ul' ? 'list-disc pl-5 mb-4 space-y-1' : 'list-decimal pl-5 mb-4 space-y-1';

    acc.push(
      React.createElement(
        listType,
        { key: `${listType}-${keySeq++}`, className: listClass },
        listChildren,
      ),
    );

    listType = null;
    listItems = [];
  };

  for (const raw of lines) {
    const line = raw;

    // H2
    if (/^##\s+/.test(line)) {
      flushPara();
      flushList();
      const text = line.replace(/^##\s+/, '');
      acc.push(
        React.createElement(
          'h2',
          {
            key: `h2-${keySeq++}`,
            className: 'text-xl font-semibold mb-4 mt-8 text-gray-900',
          },
          renderInlineWithLegal(text),
        ),
      );
      continue;
    }
    // H3
    if (/^###\s+/.test(line)) {
      flushPara();
      flushList();
      const text = line.replace(/^###\s+/, '');
      acc.push(
        React.createElement(
          'h3',
          {
            key: `h3-${keySeq++}`,
            className: 'text-lg font-semibold mb-3 mt-6 text-gray-900',
          },
          renderInlineWithLegal(text),
        ),
      );
      continue;
    }

    // UL
    if (/^\s*[-*]\s+/.test(line)) {
      if (listType === 'ol') flushList();
      listType = 'ul';
      listItems.push(line.replace(/^\s*[-*]\s+/, ''));
      continue;
    }

    // OL
    if (/^\s*\d+\.\s+/.test(line)) {
      if (listType === 'ul') flushList();
      listType = 'ol';
      listItems.push(line.replace(/^\s*\d+\.\s+/, ''));
      continue;
    }

    // Ligne vide
    if (line.trim() === '') {
      flushPara();
      flushList();
      continue;
    }

    // Paragraphe
    flushList();
    para.push(line);
  }

  flushPara();
  flushList();

  // ⬇️ NEW: s’assurer que chaque enfant a une key unique
  const keyedChildren = acc.map((child, i) => {
    if (React.isValidElement(child)) {
      // si l’élément a déjà une key, on garde ; sinon on clone avec une key
      // @ts-expect-error - key est en lecture seule au runtime, on utilise cloneElement
      return child.key != null ? child : React.cloneElement(child, { key: `rk-${i}` });
    }
    // Au cas (rare) d’un enfant qui serait une string/fragment sans key
    return React.createElement(React.Fragment, { key: `rk-${i}` }, child as any);
  });

  return {
    node: React.createElement(
      'div',
      { className: 'prose prose-gray max-w-none mb-6 text-justify' },
      // ✅ on normalise TOUS les enfants avec une key
      ...acc.map((child, i) => {
        if (React.isValidElement(child)) {
          // s'il a déjà une key, on la garde ; sinon on clone avec une key
          return (child as any).key != null ? child : React.cloneElement(child, { key: `rt-${i}` });
        }
        // si c’est une string/number/array déguisée → on l’emballe dans un Fragment keyé
        return React.createElement(React.Fragment, { key: `rt-${i}` }, child as any);
      }),
    ),
    found: Array.from(found),
  };
}

function splitStepsFromContent(sectionId: string, content: string) {
  const lines = (content || '').replace(/\r\n/g, '\n').split('\n');

  const intro: string[] = [];
  type RawStep = { title: string; lines: string[] };
  const rawSteps: RawStep[] = [];

  let current: RawStep | null = null;

  for (const line of lines) {
    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      // nouveau step
      if (current) rawSteps.push(current);
      current = { title: h3[1].trim(), lines: [] };
    } else {
      if (current) current.lines.push(line);
      else intro.push(line);
    }
  }
  if (current) rawSteps.push(current);

  return { introText: intro.join('\n').trim(), rawSteps };
}

function renderSection(section: YAMLSection): {
  node: React.ReactNode;
  found: LegalArticleId[];
} {
  const elements: React.ReactNode[] = [];
  const sectionType = detectSectionType(section);
  const foundInThis: Set<LegalArticleId> = new Set();

  // Header
  if (section.title) {
    const rawIcon = getSectionIcon(
      section.icon,
      section.id,
      sectionType,
      'md',
      'text-blue-600 flex-shrink-0',
    );
    const sectionIcon = rawIcon
      ? React.cloneElement(rawIcon as React.ReactElement, { key: 'icon' })
      : null;

    elements.push(
      React.createElement(
        'div',
        { key: 'section-header', className: 'flex items-center gap-3 mb-6' },
        [
          sectionIcon,
          React.createElement(
            'h2',
            {
              key: 'title',
              id: `section-${section.id}`,
              className: 'text-2xl font-bold text-gray-900 scroll-mt-24',
            },
            section.title,
          ),
        ],
      ),
    );
  }

  // Alert
  if (section.alert) {
    const tone = section.alert.type;
    const alertClasses: Record<string, string> = {
      info: 'bg-blue-50 border-blue-200 text-blue-900',
      success: 'bg-green-50 border-green-200 text-green-900',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
      error: 'bg-red-50 border-red-200 text-red-900',
    };
    elements.push(
      React.createElement(
        'div',
        {
          key: 'alert',
          className: `p-4 mb-6 border rounded-lg ${alertClasses[tone]}`,
          role: 'alert',
        },
        [
          section.alert.title &&
            React.createElement(
              'h4',
              { key: 'alert-title', className: 'font-semibold mb-2' },
              section.alert.title,
            ),
          React.createElement(
            'p',
            { key: 'alert-content', className: 'text-justify' },
            renderInlineWithLegal(section.alert.content),
          ),
        ].filter(Boolean),
      ),
    );
  }

  // Badges
  if (section.badges && section.badges.length > 0) {
    elements.push(
      React.createElement(
        'div',
        { key: 'badges', className: 'flex flex-wrap gap-2 mb-4' },
        section.badges.map((badge, index) =>
          React.createElement(
            Badge,
            {
              key: `badge-${index}`,
              variant:
                badge.tone === 'blue'
                  ? 'primary'
                  : badge.tone === 'green'
                    ? 'success'
                    : badge.tone === 'red'
                      ? 'danger'
                      : 'secondary',
              className: 'text-xs',
            },
            badge.text,
          ),
        ),
      ),
    );
  }

  // Corps selon type
  switch (sectionType) {
    case 'timeline': {
      // MODE A: steps fournis
      if (section.steps?.length) {
        const stepsForUi = section.steps.map((s, i) => {
          const parsed = renderRichTextWithLegal(s.description || '');
          parsed.found.forEach(id => foundInThis.add(id));
          return {
            number: i + 1,
            id: `${section.id}-step-${i + 1}`,
            title: s.title,
            descriptionNode: parsed.node,
            duration: s.duration,
          };
        });

        elements.push(
          React.createElement(
            // @ts-ignore: client component ok en boundary
            require('@/components/guides/ProcedureSteps').default,
            { key: 'procedure-steps', steps: stepsForUi },
          ),
        );
        break;
      }

      // MODE B: pas de steps → on découpe le content (intro + ### titres)
      if (section.content) {
        const { introText, rawSteps } = splitStepsFromContent(section.id, section.content);

        // intro au-dessus des cartes
        if (introText) {
          const introParsed = renderRichTextWithLegal(introText);
          introParsed.found.forEach(id => foundInThis.add(id));
          // justification déjà gérée par renderRichTextWithLegal (text-justify)
          elements.push(introParsed.node);
        }

        if (rawSteps.length) {
          const ProcedureSteps = require('@/components/guides/ProcedureSteps').default;

          const stepsForUi = rawSteps.map((st, i) => {
            const parsed = renderRichTextWithLegal(st.lines.join('\n'));
            parsed.found.forEach(id => foundInThis.add(id));
            return {
              number: i + 1,
              id: `${section.id}-step-${i + 1}`,
              title: st.title,
              descriptionNode: parsed.node,
            };
          });

          elements.push(
            React.createElement(ProcedureSteps, {
              key: 'procedure-steps',
              steps: stepsForUi,
            }),
          );
        }
      }
      break;
    }

    case 'table': {
      if (section.tableData?.length) {
        elements.push(
          React.createElement(TableComparison, {
            key: 'table',
            data: section.tableData,
            className: 'mb-6',
          }),
        );
      }
      break;
    }
    case 'faq': {
      if (section.faqItems?.length) {
        elements.push(
          React.createElement(FAQ, {
            key: 'faq',
            items: section.faqItems,
            className: 'mb-6',
          }),
        );
      }
      break;
    }
    case 'grid': {
      if (section.items?.length) {
        elements.push(
          React.createElement(DefaultGrid, {
            key: 'grid',
            items: section.items,
            columns: 3,
            className: 'mb-6',
          }),
        );
      }
      break;
    }
    case 'alternatives': {
      elements.push(
        React.createElement(DefaultAlternatives, {
          key: 'alternatives',
          className: 'mb-6',
        }),
      );
      break;
    }
    case 'contacts': {
      elements.push(
        React.createElement(DefaultContacts, {
          key: 'contacts',
          className: 'mb-6',
        }),
      );
      break;
    }
    case 'content':
    default: {
      if (section.content) {
        const { node, found } = renderRichTextWithLegal(section.content);
        found.forEach(id => foundInThis.add(id));
        elements.push(node);
      }
      break;
    }
  }

  // CTA
  if (section.cta) {
    const variant =
      section.cta.variant === 'primary'
        ? 'primary'
        : section.cta.variant === 'secondary'
          ? 'secondary'
          : section.cta.variant === 'outline'
            ? 'outline'
            : 'ghost';

    elements.push(
      React.createElement(
        'div',
        { key: 'cta', className: 'mt-6 text-center' },
        React.createElement(
          Button,
          {
            href: section.cta.href,
            variant,
            size: 'lg',
            icon: section.cta.icon
              ? getSectionIcon(section.cta.icon, undefined, undefined, 'sm')
              : undefined,
            className: 'touch-manipulation',
          },
          section.cta.label,
        ),
      ),
    );
  }

  return {
    node: React.createElement(
      'div',
      {
        key: `section-${section.id}`,
        className: 'mb-8 last:mb-0',
        'data-section-type': sectionType,
      },
      elements,
    ),
    found: Array.from(foundInThis),
  };
}

// ============================================================================
// Conversion principale
// ============================================================================
export function yamlToGuidePage(yamlContent: string): GuidePage {
  try {
    const data = yaml.load(yamlContent) as YAMLGuideConfig;

    if (!data || !data.title || !data.sections) {
      throw new Error('YAML invalide: titre ou sections manquants');
    }

    const metadata: GuideMetadata = {
      title: data.title,
      seo: {
        title: data.seo?.title || data.title,
        description: data.seo?.description || data.description || '',
        keywords: data.seo?.keywords || [],
      },
      breadcrumb: [
        { label: 'Accueil', href: '/' },
        { label: 'Guides', href: '/guides' },
        { label: data.title, href: `/guides/${data.slug}` },
      ],
    } as any;

    // Sections + refs trouvées
    const allFound = new Set<LegalArticleId>();
    const sections: GuideSection[] = data.sections.map((section, index) => {
      try {
        const { node, found } = renderSection(section);
        found.forEach(id => allFound.add(id));

        return {
          id: section.id || `section-${index}`,
          title: section.title || undefined,
          type: detectSectionType(section) || 'content',
          content: node,
          steps: section.steps,
          faqItems: section.faqItems,
          items: section.items,
          tableData: section.tableData,
          legalReferences: found.length ? found : undefined,
          wordCount: estimateSectionWords(section), // ⬅️ AJOUT
        } as GuideSection;
      } catch (err) {
        console.error(`[YAML Converter] Erreur section ${index}:`, err);
        return {
          id: section.id || `section-${index}`,
          title: section.title || `Section ${index + 1}`,
          type: 'content',
          content: React.createElement(
            'p',
            { className: 'text-red-600 p-4 bg-red-50 border border-red-200 rounded' },
            `Erreur de rendu de la section "${section.title || index}". Vérifiez le YAML.`,
          ),
        } as GuideSection;
      }
    });

    // Legal
    const yamlMain = (data.legal?.mainArticles || [])
      .map(s => (typeof s === 'string' ? normalizeLegalId(s) : null))
      .filter(Boolean) as LegalArticleId[];

    const legal: GuideLegal = {
      mainArticles: yamlMain,
      disclaimer: data.legal?.disclaimer ?? true,
      lastUpdated: data.legal?.lastUpdated || new Date().toISOString().split('T')[0],
    } as GuideLegal;

    // Fusion YAML + détectées
    const merged = new Set<LegalArticleId>(legal.mainArticles);
    for (const id of allFound) merged.add(id);
    legal.mainArticles = Array.from(merged);

    return {
      metadata,
      sections,
      legal,
    } as GuidePage;
  } catch (error) {
    console.error('[YAML Converter] Erreur conversion YAML:', error);
    throw new Error(
      `Impossible de convertir le YAML: ${
        error instanceof Error ? error.message : 'erreur inconnue'
      }`,
    );
  }
}

// ============================================================================
// Validation simple
// ============================================================================
export function validateGuideYAML(yamlContent: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  try {
    const data = yaml.load(yamlContent) as any;
    if (!data) {
      errors.push('YAML vide ou invalide');
      return { valid: false, errors };
    }
    if (!data.title) errors.push('Titre manquant');
    if (!data.slug) errors.push('Slug manquant');
    if (!Array.isArray(data.sections) || data.sections.length === 0)
      errors.push('Sections manquantes ou vides');
    if (!data.legal) errors.push('Bloc legal manquant');

    if (Array.isArray(data.sections)) {
      data.sections.forEach((s: any, i: number) => {
        if (!s.id) errors.push(`Section ${i + 1}: ID manquant`);
        if (
          s.type &&
          !['timeline', 'table', 'faq', 'grid', 'alternatives', 'contacts', 'content'].includes(
            s.type,
          )
        ) {
          errors.push(`Section ${i + 1}: type "${s.type}" invalide`);
        }
      });
    }
  } catch (e) {
    errors.push(`Erreur parsing YAML: ${e instanceof Error ? e.message : 'inconnue'}`);
  }
  return { valid: errors.length === 0, errors };
}

// ============================================================================
// Extraction méta rapide
// ============================================================================
export function extractYAMLMetadata(yamlContent: string): Partial<YAMLGuideConfig> | null {
  try {
    const data = yaml.load(yamlContent) as YAMLGuideConfig;
    return {
      title: data.title,
      description: data.description,
      category: data.category,
      slug: data.slug,
      seo: data.seo,
    };
  } catch (error) {
    console.error('Erreur extraction métadonnées YAML:', error);
    return null;
  }
}
