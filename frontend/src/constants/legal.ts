// src/constants/legal.ts
// Système moderne des articles de loi - TypeScript strict

export type LegalCode = 'CODE_CONSOMMATION' | 'CODE_CIVIL' | 'CODE_PROCEDURE_CIVILE';

export type LegalArticleId =
  // Garantie légale — Code de la consommation L.217-3 à L.217-28
  | `L.217-${3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28}`
  // Médiation — Code de la consommation L.612-1 à L.612-5
  | `L.612-${1 | 2 | 3 | 4 | 5}`
  // Associations — Code de la consommation L.811-1
  | 'L.811-1'
  // Vices cachés — Code civil 1641 à 1649
  | `${1641 | 1642 | 1642.1 | 1643 | 1644 | 1645 | 1646 | 1646.1 | 1647 | 1648 | 1649}`
  // Procédure — CPC 808, 843 à 847
  | `${808 | 843 | 844 | 845 | 846 | 847}`;

export interface LegalArticle {
  readonly code: LegalCode;
  readonly id: LegalArticleId;
  readonly label: string;
  readonly source: 'LEGIFRANCE';
}

export interface EnrichedLegalArticle extends LegalArticle {
  readonly text: string;
  readonly lastVerified: string;
  readonly lastModified?: string;
  readonly status: 'VIGUEUR' | 'ABROGE' | 'UNKNOWN';
  readonly wordCount: number;
  readonly isValid: boolean;
  readonly url?: string;
}

// Métadonnées des articles (sans texte pour optimiser le bundle)
export const LEGAL_ARTICLES: Readonly<Record<LegalArticleId, LegalArticle>> = {
  // Garantie légale de conformité
  'L.217-3': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-3',
    label: 'Code de la consommation, art. L.217-3',
    source: 'LEGIFRANCE',
  },
  'L.217-4': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-4',
    label: 'Code de la consommation, art. L.217-4',
    source: 'LEGIFRANCE',
  },
  'L.217-5': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-5',
    label: 'Code de la consommation, art. L.217-5',
    source: 'LEGIFRANCE',
  },
  'L.217-6': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-6',
    label: 'Code de la consommation, art. L.217-6',
    source: 'LEGIFRANCE',
  },
  'L.217-7': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-7',
    label: 'Code de la consommation, art. L.217-7',
    source: 'LEGIFRANCE',
  },
  'L.217-8': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-8',
    label: 'Code de la consommation, art. L.217-8',
    source: 'LEGIFRANCE',
  },
  'L.217-9': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-9',
    label: 'Code de la consommation, art. L.217-9',
    source: 'LEGIFRANCE',
  },
  'L.217-10': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-10',
    label: 'Code de la consommation, art. L.217-10',
    source: 'LEGIFRANCE',
  },
  'L.217-11': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-11',
    label: 'Code de la consommation, art. L.217-11',
    source: 'LEGIFRANCE',
  },
  'L.217-12': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-12',
    label: 'Code de la consommation, art. L.217-12',
    source: 'LEGIFRANCE',
  },
  'L.217-13': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-13',
    label: 'Code de la consommation, art. L.217-13',
    source: 'LEGIFRANCE',
  },
  'L.217-14': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-14',
    label: 'Code de la consommation, art. L.217-14',
    source: 'LEGIFRANCE',
  },
  'L.217-15': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-15',
    label: 'Code de la consommation, art. L.217-15',
    source: 'LEGIFRANCE',
  },
  'L.217-16': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-16',
    label: 'Code de la consommation, art. L.217-16',
    source: 'LEGIFRANCE',
  },
  'L.217-17': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-17',
    label: 'Code de la consommation, art. L.217-17',
    source: 'LEGIFRANCE',
  },
  'L.217-18': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-18',
    label: 'Code de la consommation, art. L.217-18',
    source: 'LEGIFRANCE',
  },
  'L.217-19': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-19',
    label: 'Code de la consommation, art. L.217-19',
    source: 'LEGIFRANCE',
  },
  'L.217-20': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-20',
    label: 'Code de la consommation, art. L.217-20',
    source: 'LEGIFRANCE',
  },
  'L.217-21': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-21',
    label: 'Code de la consommation, art. L.217-21',
    source: 'LEGIFRANCE',
  },
  'L.217-22': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-22',
    label: 'Code de la consommation, art. L.217-22',
    source: 'LEGIFRANCE',
  },
  'L.217-23': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-23',
    label: 'Code de la consommation, art. L.217-23',
    source: 'LEGIFRANCE',
  },
  'L.217-24': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-24',
    label: 'Code de la consommation, art. L.217-24',
    source: 'LEGIFRANCE',
  },
  'L.217-25': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-25',
    label: 'Code de la consommation, art. L.217-25',
    source: 'LEGIFRANCE',
  },
  'L.217-26': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-26',
    label: 'Code de la consommation, art. L.217-26',
    source: 'LEGIFRANCE',
  },
  'L.217-27': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-27',
    label: 'Code de la consommation, art. L.217-27',
    source: 'LEGIFRANCE',
  },
  'L.217-28': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-28',
    label: 'Code de la consommation, art. L.217-28',
    source: 'LEGIFRANCE',
  },

  // Médiation
  'L.612-1': {
    code: 'CODE_CONSOMMATION',
    id: 'L.612-1',
    label: 'Code de la consommation, art. L.612-1',
    source: 'LEGIFRANCE',
  },
  'L.612-2': {
    code: 'CODE_CONSOMMATION',
    id: 'L.612-2',
    label: 'Code de la consommation, art. L.612-2',
    source: 'LEGIFRANCE',
  },
  'L.612-3': {
    code: 'CODE_CONSOMMATION',
    id: 'L.612-3',
    label: 'Code de la consommation, art. L.612-3',
    source: 'LEGIFRANCE',
  },
  'L.612-4': {
    code: 'CODE_CONSOMMATION',
    id: 'L.612-4',
    label: 'Code de la consommation, art. L.612-4',
    source: 'LEGIFRANCE',
  },
  'L.612-5': {
    code: 'CODE_CONSOMMATION',
    id: 'L.612-5',
    label: 'Code de la consommation, art. L.612-5',
    source: 'LEGIFRANCE',
  },

  // Associations
  'L.811-1': {
    code: 'CODE_CONSOMMATION',
    id: 'L.811-1',
    label: 'Code de la consommation, art. L.811-1',
    source: 'LEGIFRANCE',
  },

  // Vices cachés
  '1641': { code: 'CODE_CIVIL', id: '1641', label: 'Code civil, art. 1641', source: 'LEGIFRANCE' },
  '1642': { code: 'CODE_CIVIL', id: '1642', label: 'Code civil, art. 1642', source: 'LEGIFRANCE' },
  '1642.1': {
    code: 'CODE_CIVIL',
    id: '1642.1',
    label: 'Code civil, art. 1642-1',
    source: 'LEGIFRANCE',
  },
  '1643': { code: 'CODE_CIVIL', id: '1643', label: 'Code civil, art. 1643', source: 'LEGIFRANCE' },
  '1644': { code: 'CODE_CIVIL', id: '1644', label: 'Code civil, art. 1644', source: 'LEGIFRANCE' },
  '1645': { code: 'CODE_CIVIL', id: '1645', label: 'Code civil, art. 1645', source: 'LEGIFRANCE' },
  '1646': { code: 'CODE_CIVIL', id: '1646', label: 'Code civil, art. 1646', source: 'LEGIFRANCE' },
  '1646.1': {
    code: 'CODE_CIVIL',
    id: '1646.1',
    label: 'Code civil, art. 1646-1',
    source: 'LEGIFRANCE',
  },
  '1647': { code: 'CODE_CIVIL', id: '1647', label: 'Code civil, art. 1647', source: 'LEGIFRANCE' },
  '1648': { code: 'CODE_CIVIL', id: '1648', label: 'Code civil, art. 1648', source: 'LEGIFRANCE' },
  '1649': { code: 'CODE_CIVIL', id: '1649', label: 'Code civil, art. 1649', source: 'LEGIFRANCE' },

  // Procédure civile
  '808': {
    code: 'CODE_PROCEDURE_CIVILE',
    id: '808',
    label: 'Code de procédure civile, art. 808',
    source: 'LEGIFRANCE',
  },
  '843': {
    code: 'CODE_PROCEDURE_CIVILE',
    id: '843',
    label: 'Code de procédure civile, art. 843',
    source: 'LEGIFRANCE',
  },
  '844': {
    code: 'CODE_PROCEDURE_CIVILE',
    id: '844',
    label: 'Code de procédure civile, art. 844',
    source: 'LEGIFRANCE',
  },
  '845': {
    code: 'CODE_PROCEDURE_CIVILE',
    id: '845',
    label: 'Code de procédure civile, art. 845',
    source: 'LEGIFRANCE',
  },
  '846': {
    code: 'CODE_PROCEDURE_CIVILE',
    id: '846',
    label: 'Code de procédure civile, art. 846',
    source: 'LEGIFRANCE',
  },
  '847': {
    code: 'CODE_PROCEDURE_CIVILE',
    id: '847',
    label: 'Code de procédure civile, art. 847',
    source: 'LEGIFRANCE',
  },
} as const;

// Groupes logiques
export const LEGAL_GROUPS = {
  GARANTIE_LEGALE_CONFORMITE: Object.values(LEGAL_ARTICLES).filter(a => a.id.startsWith('L.217')),
  MEDIATION_CONSOMMATION: Object.values(LEGAL_ARTICLES).filter(a => a.id.startsWith('L.612')),
  ASSOCIATIONS_CONSOMMATEURS: Object.values(LEGAL_ARTICLES).filter(a => a.id === 'L.811-1'),
  VICES_CACHES: Object.values(LEGAL_ARTICLES).filter(a => a.code === 'CODE_CIVIL'),
  PROCEDURE_CIVILE: Object.values(LEGAL_ARTICLES).filter(a => a.code === 'CODE_PROCEDURE_CIVILE'),
} as const;
