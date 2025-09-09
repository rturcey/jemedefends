// lib/yaml-guide-converter.ts - CONVERSION PURE YAML → ReactNode
// Mobile-first, composants existants, TypeScript strict

import yaml from 'js-yaml';
import * as React from 'react';
import * as Icons from 'lucide-react';
import type { GuidePage, GuideMetadata, GuideSection, GuideLegal } from '@/types/guides';
import type { LegalArticleId } from '@/legal/registry';

// UI existants
import {
  Badge,
  Button,
  ErrorAlert,
  DefaultGrid,
  DefaultAlternatives,
  DefaultContacts,
} from '@/components/ui';

// Text / Légal
import TextWithLegalRefs from '@/components/ui/TextWithLegalRefs';
import LegalReference from '@/components/ui/LegalReference';

/* -------------------------------------------------------------------------- */
/*                                     Types                                   */

/* -------------------------------------------------------------------------- */

interface YAMLGuideConfig {
  title: string;
  description: string;
  category: 'general' | 'tech' | 'home' | 'auto';
  slug: string;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
  };
  legal: {
    mainArticles: string[];
    disclaimer: boolean;
    lastUpdated: string;
  };
  sections: YAMLSection[];
}

interface YAMLSection {
  id: string;
  title: string;
  icon?: string; // nom lucide-react, ex: "ShieldCheck"
  type?: 'timeline' | 'table' | 'faq' | 'grid' | 'alternatives' | 'contacts' | 'content';
  content?: string;

  alert?: {
    type: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    content: string;
  };
  badges?: Array<{
    text: string;
    tone?: 'blue' | 'green' | 'purple' | 'yellow' | 'indigo' | 'red' | 'emerald';
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
    icon?: string; // nom lucide-react, ex: "ChevronRight"
    variant?: 'primary' | 'secondary' | 'ghost';
  };

  tableData?: Array<Record<string, any>>;
}

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                    */
/* -------------------------------------------------------------------------- */

// Casts sûrs (évite les surcharges "input" de createElement côté TS)
const ButtonEl = Button as unknown as React.ElementType;
const LegalReferenceEl = LegalReference as unknown as React.ElementType;

// Articles légaux : L./R./D. + nombre + sous-parties éventuelles (ex. 217-5-1)
const LEGAL_CODE_PART = String.raw`(?:[LRD])\.\s?\d{1,4}(?:-\d+){0,3}`;
const LEGAL_REF_SRC = String.raw`\(?\s*(?:art(?:\.|icle)?\s*)?(${LEGAL_CODE_PART})\s*\)?`;

// Pour parser dans le texte (global)
const LEGAL_REF_RE = new RegExp(
  [
    // **gras**
    String.raw`(\*\*(.+?)\*\*)`,
    // _italique_
    String.raw`(_(.+?)_)`,
    // réf légale (avec ou sans "art." et parenthèses)
    String.raw`(${LEGAL_REF_SRC})`,
  ].join('|'),
  'gi',
);

// Détection simple "au moins une ref"
const LEGAL_REF_DETECT_RE = new RegExp(LEGAL_REF_SRC, 'i');

function hasLegalRef(text?: string): boolean {
  if (!text) return false;
  return LEGAL_REF_DETECT_RE.test(text);
}

function renderIcon(name?: string, className = 'w-6 h-6 text-blue-600', key?: React.Key) {
  if (!name) return null;
  const IconComp = (Icons as any)[name];
  return IconComp ? React.createElement(IconComp, { className, key }) : null;
}

/**
 * Parser inline minimal :
 * - **gras** → <strong>
 * - _italique_ → <em>
 * - (art. L.217-9) ou L.217-9 / R. / D. → <LegalReference code="..." />
 */
function renderInlineWithLegal(text: string, keyBase = 'i'): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  if (!text) return out;

  let idx = 0;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = LEGAL_REF_RE.exec(text))) {
    const [whole] = m;
    const start = m.index;
    if (start > last) out.push(text.slice(last, start));

    // **bold**
    if (m[1] && m[2] !== undefined) {
      out.push(
        React.createElement(
          'strong',
          { key: `${keyBase}-b-${idx}` },
          renderInlineWithLegal(m[2], `${keyBase}-b-${idx}`),
        ),
      );
    }
    // _italic_
    else if (m[3] && m[4] !== undefined) {
      out.push(
        React.createElement(
          'em',
          { key: `${keyBase}-em-${idx}` },
          renderInlineWithLegal(m[4], `${keyBase}-em-${idx}`),
        ),
      );
    }
    // legal ref (group 5 = capture complète, group 6 = code)
    else if (m[5] && m[6]) {
      const raw = m[5];
      const code = m[6].replace(/\.\s?/, '.'); // normalise "L. 217-9" → "L.217-9"

      const trimmed = raw.trim();
      const hasParens = trimmed.startsWith('(') && trimmed.endsWith(')');
      const hasArt = /art(?:\.|icle)?/i.test(raw);

      if (hasParens) out.push('(');
      if (hasArt) out.push('art. ');

      out.push(
        React.createElement(LegalReferenceEl, {
          key: `${keyBase}-ref-${idx}`,
          code,
          variant: 'inline',
          className: 'align-baseline',
        }),
      );

      if (hasParens) out.push(')');
    }

    last = start + whole.length;
    idx++;
  }

  if (last < text.length) out.push(text.slice(last));
  return out;
}

// Rend un contenu multi-paragraphes (double \n) + <br> pour simple \n, justifié
function renderRichContent(content: string): React.ReactNode {
  const paragraphs = content.split(/\n{2,}/);
  const children = paragraphs.map((para, pIdx) => {
    const lines = para.split('\n');
    const lineNodes = lines.flatMap((line, lIdx) => {
      const parts = renderInlineWithLegal(line, `p${pIdx}-l${lIdx}`);
      return lIdx < lines.length - 1
        ? [...parts, React.createElement('br', { key: `br-${pIdx}-${lIdx}` })]
        : parts;
    });
    return React.createElement('p', { key: `p-${pIdx}` }, lineNodes);
  });

  return React.createElement(
    'div',
    {
      key: 'content',
      className: 'prose prose-blue max-w-none mb-4 text-justify prose-p:my-3',
    },
    children,
  );
}

function renderCTA(section: YAMLSection) {
  if (!section.cta) return null;

  const IconComp =
    (section.cta.icon && (Icons as any)[section.cta.icon]) || (Icons as any).ChevronRight;

  const variant =
    section.cta.variant === 'secondary'
      ? 'secondary'
      : section.cta.variant === 'ghost'
        ? 'ghost'
        : 'primary';

  return React.createElement(
    'div',
    { key: 'cta', className: 'mt-4' },
    React.createElement(
      ButtonEl,
      {
        href: section.cta.href,
        variant,
        className: 'inline-flex items-center gap-2',
      } as any,
      [
        React.createElement('span', { key: 'label' }, section.cta.label),
        IconComp &&
          React.createElement(IconComp, {
            key: 'icon',
            className: 'w-4 h-4',
          }),
      ],
    ),
  );
}

/* -------------------------------------------------------------------------- */
/*                          Rendu par type de section                          */

/* -------------------------------------------------------------------------- */

function renderSectionContent(section: YAMLSection): React.ReactNode {
  const elements: React.ReactNode[] = [];

  // Header local (titre + icône) — source de vérité
  elements.push(
    React.createElement(
      'header',
      { key: 'header', className: 'mb-4' },
      React.createElement(
        'h2',
        {
          id: `section-${section.id}`,
          className: 'scroll-mt-24 text-2xl font-bold text-gray-900 flex items-center gap-2',
        },
        [
          renderIcon(section.icon, 'w-6 h-6 text-blue-600', 'icon'),
          React.createElement('span', { key: 'title' }, section.title),
        ],
      ),
    ),
  );

  // Contenu riche (avec LegalReference inline)
  if (section.content) {
    elements.push(renderRichContent(section.content));
  }

  // Rendu spécifique
  switch (section.type) {
    case 'content': {
      if (section.alert) {
        elements.push(
          React.createElement(
            ErrorAlert,
            {
              key: 'alert',
              type: section.alert.type,
              title: section.alert.title,
              className: 'mb-4',
            },
            React.createElement(TextWithLegalRefs, { text: section.alert.content }),
          ),
        );
      }

      if (section.badges?.length) {
        elements.push(
          React.createElement(
            'div',
            { key: 'badges', className: 'flex flex-wrap gap-2 mb-4' },
            section.badges.map((badge, i) =>
              React.createElement(
                Badge,
                {
                  key: i,
                  tone: badge.tone || 'blue',
                },
                badge.text,
              ),
            ),
          ),
        );
      }

      const ctaNode = renderCTA(section);
      if (ctaNode) elements.push(ctaNode);

      break;
    }

    case 'grid': {
      if (section.items?.length) {
        const gridItems = section.items.map((item, i) =>
          React.createElement('div', { key: i, className: 'space-y-2' }, [
            React.createElement(
              'h4',
              { key: 'title', className: 'font-semibold text-gray-900' },
              item.title,
            ),
            React.createElement(
              'p',
              { key: 'desc', className: 'text-sm text-gray-600' },
              renderInlineWithLegal(item.description || '', `grid${i}`),
            ),
          ]),
        );

        elements.push(
          React.createElement(DefaultGrid, {
            key: 'grid',
            items: gridItems,
            columns: section.items.length > 2 ? 3 : 2,
          }),
        );
      }

      const ctaNode = renderCTA(section);
      if (ctaNode) elements.push(ctaNode);

      break;
    }

    case 'timeline': {
      if (section.steps?.length) {
        const timelineItems = section.steps.map((step, i) =>
          React.createElement(
            'div',
            {
              key: i,
              className: 'relative pl-8 pb-6 border-l-2 border-blue-200 last:border-l-0',
            },
            [
              React.createElement(
                'div',
                {
                  key: 'number',
                  className:
                    'absolute -left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold',
                },
                (i + 1).toString(),
              ),
              React.createElement('div', { key: 'content', className: 'space-y-2' }, [
                React.createElement(
                  'div',
                  { key: 'header', className: 'flex items-center gap-3' },
                  [
                    React.createElement(
                      'h4',
                      { key: 'title', className: 'font-semibold text-gray-900' },
                      step.title,
                    ),
                    step.duration &&
                      React.createElement(
                        Badge,
                        {
                          key: 'duration',
                          tone: 'purple',
                        },
                        step.duration,
                      ),
                  ],
                ),

                // description rendue avec refs légales inline
                React.createElement(
                  'p',
                  { key: 'desc', className: 'text-gray-600' },
                  renderInlineWithLegal(step.description || '', `step${i}`),
                ),

                // évite le doublon : n'affiche LegalReference séparée que si la description n'en contient pas
                step.legalRef &&
                  !hasLegalRef(step.description) &&
                  React.createElement(LegalReferenceEl, {
                    key: 'legal',
                    code: step.legalRef.replace(/\.\s?/, '.'),
                    variant: 'inline',
                    className: 'text-xs',
                  }),
              ]),
            ],
          ),
        );

        elements.push(
          React.createElement(
            'div',
            {
              key: 'timeline',
              className: 'space-y-0 mt-4',
            },
            timelineItems,
          ),
        );
      }
      break;
    }

    case 'faq': {
      if (section.faqItems?.length) {
        const faqItems = section.faqItems.map((faq, i) =>
          React.createElement(
            'details',
            {
              key: i,
              className: 'group border border-gray-200 rounded-lg overflow-hidden',
            },
            [
              React.createElement(
                'summary',
                {
                  key: 'question',
                  className:
                    'px-4 py-3 bg-gray-50 font-medium text-gray-900 cursor-pointer hover:bg-gray-100 group-open:bg-blue-50 group-open:text-blue-900',
                },
                faq.q,
              ),
              React.createElement(
                'div',
                { key: 'answer', className: 'px-4 py-3 border-t border-gray-200' },
                React.createElement(TextWithLegalRefs, {
                  text: faq.a,
                  className: 'text-gray-700',
                }),
              ),
            ],
          ),
        );

        elements.push(
          React.createElement(
            'div',
            {
              key: 'faq',
              className: 'space-y-2 mt-4',
            },
            faqItems,
          ),
        );
      }
      break;
    }

    case 'alternatives': {
      elements.push(React.createElement(DefaultAlternatives, { key: 'alternatives' }));
      break;
    }

    case 'contacts': {
      elements.push(React.createElement(DefaultContacts, { key: 'contacts' }));
      break;
    }

    case 'table': {
      if (section.tableData?.length) {
        const headers = Object.keys(section.tableData[0]);

        elements.push(
          React.createElement(
            'div',
            { key: 'table', className: 'overflow-x-auto mt-4' },
            React.createElement(
              'table',
              { className: 'w-full border-collapse border border-gray-200' },
              [
                React.createElement(
                  'thead',
                  { key: 'thead' },
                  React.createElement(
                    'tr',
                    { className: 'bg-gray-50' },
                    headers.map(header =>
                      React.createElement(
                        'th',
                        {
                          key: header,
                          className:
                            'border border-gray-200 px-3 py-2 text-left font-semibold text-gray-900',
                        },
                        header,
                      ),
                    ),
                  ),
                ),
                React.createElement(
                  'tbody',
                  { key: 'tbody' },
                  section.tableData.map((row, i) =>
                    React.createElement(
                      'tr',
                      { key: i, className: 'hover:bg-gray-50' },
                      headers.map(header =>
                        React.createElement(
                          'td',
                          {
                            key: header,
                            className: 'border border-gray-200 px-3 py-2',
                          },
                          React.createElement(TextWithLegalRefs, {
                            text: String(row[header] ?? ''),
                            className: 'text-sm',
                          }),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      }
      break;
    }

    default:
      break;
  }

  return React.createElement('div', { className: 'space-y-4' }, elements);
}

/* -------------------------------------------------------------------------- */
/*                              YAML → GuidePage                               */

/* -------------------------------------------------------------------------- */

export function yamlToGuidePage(yamlContent: string): GuidePage {
  try {
    const data = yaml.load(yamlContent) as YAMLGuideConfig;

    if (!data || !data.title || !data.sections) {
      throw new Error('YAML invalide: titre ou sections manquants');
    }

    const metadata: GuideMetadata = {
      title: data.title,
      seo: data.seo || {
        title: data.title,
        description: data.description,
        keywords: [],
      },
      breadcrumb: [
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guides' },
        { name: data.title, url: `/guides/${data.slug}` },
      ],
    };

    const sections: GuideSection[] = data.sections.map(section => ({
      id: section.id,
      title: section.title,
      type: section.type || 'content',
      content: renderSectionContent(section),
      steps: section.steps,
      faqItems: section.faqItems,
      items: section.items,
      tableData: section.tableData,
    }));

    const legal: GuideLegal = {
      mainArticles: (data.legal.mainArticles || []) as LegalArticleId[],
      disclaimer: data.legal.disclaimer,
      lastUpdated: data.legal.lastUpdated,
    };

    return { metadata, sections, legal };
  } catch (error) {
    console.error('Erreur conversion YAML:', error);
    throw new Error(
      `Impossible de convertir le YAML: ${error instanceof Error ? error.message : 'erreur inconnue'}`,
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                       Validation / Extraction métadonnées                   */

/* -------------------------------------------------------------------------- */

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
    if (!data.description) errors.push('Description manquante');
    if (!data.slug) errors.push('Slug manquant');
    if (!data.sections || !Array.isArray(data.sections)) {
      errors.push('Sections manquantes ou invalides');
    }
    if (!data.legal) errors.push('Section legal manquante');

    if (data.sections) {
      data.sections.forEach((section: any, index: number) => {
        if (!section.id) errors.push(`Section ${index + 1}: ID manquant`);
        if (!section.title) errors.push(`Section ${index + 1}: titre manquant`);
      });
    }
  } catch (error) {
    errors.push(
      `Erreur parsing YAML: ${error instanceof Error ? error.message : 'erreur inconnue'}`,
    );
  }

  return { valid: errors.length === 0, errors };
}

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
