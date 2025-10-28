// ============================================================================
// yaml-guide-converter.tsx — CORRIGÉ COMPLET
// Conversion YAML -> GuidePage (server-safe) avec corrections des erreurs React
// ============================================================================

import React from 'react';
import yaml from 'js-yaml';

// UI existants (util only / server-safe)
import { getSectionIcon } from '@/lib/icon-utils';

import type {
  GuidePage,
  GuideMetadata,
  GuideSection,
  GuideLegal,
} from '@/types/guides';
import { isValidLegalArticleId, type LegalArticleId } from '@/legal/registry';
import { Smartphone } from 'lucide-react';

// ============================================================================
// Types YAML d'entrée
// ============================================================================
interface YAMLGuideConfig {
  title: string;
  description?: string;
  category: 'general' | 'tech' | 'automobile' | 'commerce' | 'maison' | 'mode' | 'numerique' | string;
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

// ============================================================================
// Helpers corrigés
// ============================================================================
function wordsOf(s?: string) {
  if (!s) return 0;
  const plain = s
    .replace(/`[^`]+`/g, ' ') // code inline
    .replace(/\*\*?|__|~~|>/g, ' ') // bold/italic/quote
    .replace(/#+\s/g, ' ') // titres markdown
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // liens [txt](url) -> txt
    .replace(/[\|\-\+\*]/g, ' '); // bullets/pipe
  return plain.split(/\s+/).filter(Boolean).length;
}

// utils: détecter liens markdown & URLs nues et produire des <a>
function tokenizeLinksInline(input: string): Array<{
  type: 'text' | 'link',
  value: string,
  href?: string
}> {
  const out: Array<{ type: 'text' | 'link', value: string, href?: string }> = [];
  if (!input) return out;

  // 1) protéger d’abord les URLs nues (http/https) pour éviter qu’elles soient cassées
  const URL_RE = /(https?:\/\/[^\s)]+)(?=[\s)|]|$)/gi;

  // 2) on split sur markdown links en conservant le reste
  //    [texte](url) – pas gourmand, tolère espaces dans texte
  const MD_RE = /\[([^\]]+)]\(([^)\s]+)\)/g;

  let cursor = 0;
  const src = input;

  // d’abord traiter les markdown links
  let m: RegExpExecArray | null;
  while ((m = MD_RE.exec(src)) !== null) {
    if (m.index > cursor) out.push({
      type: 'text',
      value: src.slice(cursor, m.index),
    });
    out.push({ type: 'link', value: m[1], href: m[2] });
    cursor = m.index + m[0].length;
  }
  if (cursor < src.length) out.push({ type: 'text', value: src.slice(cursor) });

  // puis transformer les URLs nues dans les segments texte
  const final: Array<{ type: 'text' | 'link', value: string, href?: string }> = [];
  for (const seg of out) {
    if (seg.type === 'link') {
      final.push(seg);
      continue;
    }
    let last = 0;
    let mm: RegExpExecArray | null;
    while ((mm = URL_RE.exec(seg.value)) !== null) {
      if (mm.index > last) final.push({
        type: 'text',
        value: seg.value.slice(last, mm.index),
      });
      final.push({ type: 'link', value: mm[1], href: mm[1] });
      last = mm.index + mm[0].length;
    }
    if (last < seg.value.length) final.push({
      type: 'text',
      value: seg.value.slice(last),
    });
  }
  return final;
}


function estimateSectionWords(section: any): number {
  let n = 0;

  if (typeof section.content === 'string') n += wordsOf(section.content);

  if (Array.isArray(section.steps)) {
    for (const s of section.steps) {
      n += wordsOf(s.title) + wordsOf(s.description);
    }
  }

  if (Array.isArray(section.faqItems)) {
    for (const it of section.faqItems) {
      n += wordsOf(it.q) + wordsOf(it.a);
    }
  }

  if (Array.isArray(section.items)) {
    for (const it of section.items) {
      n += wordsOf(it.title) + wordsOf(it.description);
    }
  }

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

function normalizeTypo(s: string): string {
  if (!s) return '';
  return s
    .replace(/[\u00A0\u202F\u2009]/g, ' ')     // NBSP → espace normal
    .replace(/[\u2011\u2013\u2014]/g, '-')     // tirets spéciaux → '-'
    // ne pas toucher aux \n ; on ne “compacte” que les espaces horizontaux
    .replace(/[ \t]+/g, ' ');
  // pas de .trim() ici (on laisse la mise en forme au parseur markdown)
}


/** Normalise "art. L 217-3" / "L.217-3" / "l 217-3" -> "L.217-3" si supporté */
function normalizeLegalId(raw: string): LegalArticleId | null {
  const t = normalizeTypo(raw);
  const m = t.match(
    /(?:^|[\s,;:.\(\[])\s*(?:art\.?\s*)?([LRD])\s*\.?\s*(\d{1,4})\s*-\s*(\d{1,3})(?=$|[\s,;:.\)\]])/i,
  );
  if (!m) return null;
  const id = `${m[1].toUpperCase()}.${m[2]}-${m[3]}`;
  return isValidLegalArticleId(id) ? (id as LegalArticleId) : null;
}

/** CORRIGÉ : Tokenise un texte en segments {text|legal} pour insertion de spans server-safe */
function tokenizeLegalInline(text: string): Array<
  | { type: 'text'; value: string }
  | {
  type: 'legal';
  id: LegalArticleId;
  raw: string;
}
> {
  const t = normalizeTypo(text);
  const re = /(?:art\.?\s*)?[LRD]\s*\.?\s*\d{1,4}\s*[-]\s*\d{1,3}/gi;
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
  while ((m = re.exec(t)) !== null) {
    const raw = m[0];
    const norm = normalizeLegalId(raw);
    if (m.index > last) out.push({ type: 'text', value: t.slice(last, m.index) });
    if (norm) out.push({ type: 'legal', id: norm, raw });
    else out.push({ type: 'text', value: raw });
    last = m.index + raw.length;
  }
  if (last < t.length) out.push({ type: 'text', value: t.slice(last) });
  return out;
}

/** Robust inline renderer: code -> links -> bold -> em -> legal */
function renderInlineWithLegal(text: string): React.ReactNode[] {
  let key = 0;

  // 1) code spans first to freeze content
  const codeSplit = String(text).split(/`([^`]+)`/g).map((chunk, i) => {
    if (i % 2 === 1) {
      return React.createElement('code', {
        key: `code-${key++}`,
        className: 'bg-gray-100 px-1 rounded',
        children: chunk,
      });
    }
    return chunk;
  });

  const out: React.ReactNode[] = [];

  // helper: push either string or array of nodes
  const push = (node: React.ReactNode | React.ReactNode[]) => {
    if (Array.isArray(node)) out.push(...node);
    else out.push(node);
  };

  // 2) process each segment that is not a <code>
  for (const seg of codeSplit) {
    if (React.isValidElement(seg)) {
      push(seg);
      continue;
    }
    const s = String(seg);

    // 2.a links: [label](url)
    // keep them as single nodes so further styling doesn't break URLs
    const linkParts: (string | React.ReactElement)[] = [];
    let last = 0;
    const linkRe = /\[([^\]]+)\]\(([^)\s]+)\)/g;
    let m: RegExpExecArray | null;
    while ((m = linkRe.exec(s))) {
      if (m.index > last) linkParts.push(s.slice(last, m.index));         // text before
      linkParts.push(
        React.createElement(
          'a',
          {
            key: `a-${key++}`,
            href: m[2],
            target: '_blank',
            rel: 'noopener noreferrer',
            className:
              'underline decoration-dotted underline-offset-2 hover:text-blue-700 focus-visible:text-blue-700',
          },
          ...renderInlineWithLegal(m[1]), // allow **bold** inside label
        ),
      );
      last = m.index + m[0].length;
    }
    if (last < s.length) linkParts.push(s.slice(last));

    // 2.b bold & em on *non-link* strings only
    const applyBoldEm = (frag: string | React.ReactElement): React.ReactNode[] => {
      if (React.isValidElement(frag)) return [frag]; // link/other element
      if (!frag) return [];

      // bold (**...**), supports punctuation/accents and multiline
      const boldSplit = frag.split(/\*\*([\s\S]+?)\*\*/g);
      const nodesAfterBold: React.ReactNode[] = [];
      boldSplit.forEach((b, bi) => {
        if (bi % 2 === 1) {
          nodesAfterBold.push(
            React.createElement('strong', { key: `b-${key++}` }, ...renderInlineWithLegal(b)),
          );
        } else {
          // em (*...*)
          const emSplit = b.split(/\*([\s\S]+?)\*/g);
          emSplit.forEach((e, ei) => {
            if (ei % 2 === 1) {
              nodesAfterBold.push(
                React.createElement('em', { key: `i-${key++}` }, ...renderInlineWithLegal(e)),
              );
            } else {
              // 2.c finally: legal refs inside the remaining plain text
              const tokens = tokenizeLegalInline(e);
              tokens.forEach(t => {
                if (t.type === 'text') {
                  if (t.value) nodesAfterBold.push(
                    React.createElement(React.Fragment, { key: `t-${key++}` }, t.value),
                  );
                } else {
                  nodesAfterBold.push(
                    React.createElement('span', {
                      key: `lr-${key++}`,
                      'data-legal-id': t.id,
                      className: 'inline-flex items-center',
                      children: t.raw,
                    }),
                  );
                }
              });
            }
          });
        }
      });
      return nodesAfterBold;
    };

    // run bold/em/legal on each non-link chunk
    linkParts.forEach(part => push(applyBoldEm(part)));
  }

  return out;
}


/** CORRIGÉ : Rendu riche avec références légales - SPREAD CHILDREN */
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

    // Spread des children au lieu de passer l'array
    const inlineElements = renderInlineWithLegal(txt);
    acc.push(
      React.createElement(
        'p',
        {
          key: `para-${keySeq++}`,
          className: 'mb-4 leading-relaxed text-gray-800 text-justify',
        },
        ...inlineElements, // SPREAD !
      ),
    );
    para = [];
  };

  const flushList = () => {
    if (!listType || listItems.length === 0) return;
    listItems.forEach(li =>
      tokenizeLegalInline(li).forEach(t => t.type === 'legal' && found.add(t.id)),
    );

    // Clé unique pour chaque élément de liste
    const listChildren = listItems.map((li, i) => {
      const inlineElements = renderInlineWithLegal(li);
      return React.createElement(
        'li',
        {
          key: `listitem-${keySeq}-${i}`,
          className: 'leading-relaxed text-gray-800 text-justify',
        },
        ...inlineElements, // SPREAD !
      );
    });

    const listClass =
      listType === 'ul' ? 'list-disc pl-5 mb-4 space-y-1' : 'list-decimal pl-5 mb-4 space-y-1';

    acc.push(
      React.createElement(
        listType,
        { key: `list-${keySeq++}`, className: listClass },
        ...listChildren, // SPREAD !
      ),
    );

    listType = null;
    listItems = [];
  };

  // Traitement des lignes
  for (const raw of lines) {
    const line = raw;

    // H2
    if (/^##\s+/.test(line)) {
      flushPara();
      flushList();
      const text = line.replace(/^##\s+/, '');
      const headerElements = renderInlineWithLegal(text);
      acc.push(
        React.createElement(
          'h2',
          {
            key: `h2-${keySeq++}`,
            className: 'text-xl font-semibold mb-4 mt-8 text-gray-900',
          },
          ...headerElements, // SPREAD !
        ),
      );
      continue;
    }

    // H3
    if (/^###\s+/.test(line)) {
      flushPara();
      flushList();
      const text = line.replace(/^###\s+/, '');
      const headerElements = renderInlineWithLegal(text);
      acc.push(
        React.createElement(
          'h3',
          {
            key: `h3-${keySeq++}`,
            className: 'text-lg font-semibold mb-3 mt-6 text-gray-900',
          },
          ...headerElements, // SPREAD !
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

  // Retourner avec spread des éléments
  return {
    node: React.createElement(
      'div',
      { className: 'prose prose-gray max-w-none mb-6 text-justify' },
      ...acc, // SPREAD !
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

/** CORRIGÉ : Rendu des sections avec gestion appropriée des éléments */
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
    const sectionIcon = rawIcon ? React.cloneElement(rawIcon, { key: 'section-icon' }) : null;

    elements.push(
      React.createElement(
        'h2',
        {
          key: 'section-header',
          className: 'text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3',
        },
        sectionIcon,
        section.title,
      ),
    );
  }

  // ErrorAlert

  if (section.alert) {
    const ErrorAlert = require('@/components/ui/ErrorAlert').default;

    // parse **bold**, *em*, links, legal refs inside the alert body
    const inline = renderInlineWithLegal(section.alert.content || '');

    elements.push(
      React.createElement(
        ErrorAlert,
        {
          key: 'section-alert',
          type: section.alert.type,
          title: section.alert.title, // avoids double icon
          className: 'mb-6',
        },
        React.createElement(
          'p',
          { className: 'text-sm leading-relaxed' },
          ...inline, // spread parsed nodes
        ),
      ),
    );
  }

  // Badges
  if (section.badges?.length) {
    const Badge = require('@/components/ui/Badge').default;
    elements.push(
      React.createElement(
        'div',
        { key: 'section-badges', className: 'flex flex-wrap gap-2 mb-6' },
        ...section.badges.map((badge, i) =>
          React.createElement(
            Badge,
            {
              key: `badge-${i}`, // Clé unique
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

        const ProcedureSteps = require('@/components/guides/ProcedureSteps').default;
        elements.push(
          React.createElement(ProcedureSteps, {
            key: 'procedure-steps',
            steps: stepsForUi,
          }),
        );
        break;
      }

      if (section.content) {
        const {
          introText,
          rawSteps,
        } = splitStepsFromContent(section.id, section.content);

        if (introText) {
          const introParsed = renderRichTextWithLegal(introText);
          introParsed.found.forEach(id => foundInThis.add(id));
          elements.push(React.cloneElement(introParsed.node as any, { key: 'intro-text' }));
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
        // Transformer les données du tableau pour OptionsTable
        const optionsData = section.tableData.map(row => {
          const keys = Object.keys(row);
          return {
            option: String(row[keys[0]] || ''),
            when: String(row[keys[1]] || ''),
            cost: String(row[keys[2]] || ''),
            delay: String(row[keys[3]] || ''),
            details: String(row[keys[4]] || ''),
          };
        });

        // Le composant utilise TextWithLegalRefs pour traiter automatiquement les legal refs
        const OptionsTable = require('@/components/guides/OptionsTable').default;
        elements.push(
          React.createElement(OptionsTable, {
            key: 'options-table',
            data: optionsData,
            className: 'mb-6',
          }),
        );
      }
      break;
    }

    case 'faq': {
      if (section.faqItems?.length) {
        const FAQ = require('@/components/ui/FAQ').default;
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
        // Filtrer et préparer les items pour EligibilityChecklist
        const eligibilityItems = section.items
          .filter(item => item && typeof item === 'object' && typeof item.title === 'string')
          .map(item => ({
            title: item.title,
            description: item.description || '',
          }));

        // Le composant utilise TextWithLegalRefs pour traiter automatiquement les legal refs
        const EligibilityChecklist = require('@/components/guides/EligibilityChecklist').default;
        elements.push(
          React.createElement(EligibilityChecklist, {
            key: 'eligibility-checklist',
            items: eligibilityItems,
            className: 'mb-6',
          }),
        );
      }
      break;
    }

    case 'alternatives': {
      const DefaultAlternatives = require('@/components/ui/DefaultAlternatives').default;
      elements.push(
        React.createElement(DefaultAlternatives, {
          key: 'alternatives',
          className: 'mb-6',
        }),
      );
      break;
    }

    case 'contacts': {
      const DefaultContacts = require('@/components/ui/DefaultContacts').default;
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
        elements.push(React.cloneElement(node as any, { key: 'content' }));
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

    const Button = require('@/components/ui/Button').default;

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
      ...elements, // SPREAD !
    ),
    found: Array.from(foundInThis),
  };
}

const CATEGORY_REGISTRY = {
  general: {
    id: 'general',
    name: 'Général',
    description: 'Guides généraux sur vos droits de consommateur',
    color: 'blue',
  },
  tech: {
    id: 'tech',
    name: 'Électronique & High-Tech',
    description: 'Smartphones, ordinateurs, électronique grand public',
    color: 'green',
  },
  automobile: {
    id: 'automobile',
    name: 'Automobile & Mobilité',
    description: 'Voitures, motos, véhicules et garages',
    color: 'red',
  },
  maison: {
    id: 'maison',
    name: 'Maison & Électroménager',
    description: 'Électroménager, chauffage, équipements domestiques',
    color: 'purple',
  },
  mode: {
    id: 'mode',
    name: 'Textile & Mode',
    description: 'Vêtements, chaussures, accessoires',
    color: 'yellow',
  },
  numerique: {
    id: 'numerique',
    name: 'Services & Numérique',
    description: 'Logiciels, plateformes, réservations, abonnements, cloud, IA',
    color: 'indigo',
  },
  commerce: {
    id: 'commerce',
    name: 'Grands commerces & Enseignes',
    description: 'Achat en magasin, en ligne, marketplaces et SAV',
    color: 'orange',
  },
} as const;

type CategoryId = keyof typeof CATEGORY_REGISTRY;

/** Résout une catégorie YAML vers l’objet d’affichage (fallback 'general') */
function resolveCategory(raw?: string) {
  const id = String(raw ?? '').trim().toLowerCase() as CategoryId;
  return CATEGORY_REGISTRY[id];
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
    const categoryObj = resolveCategory(data.category);

    const metadata: GuideMetadata = {
      title: data.title,
      seo: {
        title: data.seo?.title || data.title,
        description: data.seo?.description || data.description || '',
        keywords: data.seo?.keywords || [],
      },
      // expose deux champs : l’ID brut + l’objet riche (pour UI/SEO/breadcrumbs)
      categoryId: categoryObj.id,
      category: categoryObj,
      breadcrumb: [
        { label: 'Accueil', href: '/' },
        { label: 'Guides', href: '/guides' },
        // 👉 si tu veux injecter la catégorie au breadcrumb, dé-commente la ligne suivante :
        // { label: categoryObj.name, href: `/guides?category=${categoryObj.id}` },
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
          wordCount: estimateSectionWords(section),
        } as GuideSection;
      } catch (err) {
        console.error(`[YAML Converter] Erreur section ${index}:`, err);
        return {
          id: section.id || `section-${index}`,
          title: section.title || `Section ${index + 1}`,
          type: 'content',
          content: React.createElement(
            'p',
            {
              key: `error-section-${index}`,
              className: 'text-red-600 p-4 bg-red-50 border border-red-200 rounded',
            },
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

    if (!data.category) {
      errors.push('Catégorie manquante (champ "category")');
    } else {
      const resolved = resolveCategory(data.category);
      if (!resolved) {
        errors.push(`Catégorie inconnue: "${String(data.category)}"`);
      }
    }


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
