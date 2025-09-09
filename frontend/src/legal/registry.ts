// src/legal/registry.ts
// Source de vérité unique pour toutes les références légales
// Mobile-first, TypeScript strict, performance optimisée

export type LegalCode = 'CODE_CONSOMMATION' | 'CODE_CIVIL' | 'CODE_PROCEDURE_CIVILE';

export type LegalArticleId =
  // Garantie légale — Code de la consommation L.217-3 à L.217-28
  | `L.217-${3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28}`
  // Médiation — Code de la consommation L.612-1 à L.612-5
  | `L.612-${1 | 2 | 3 | 4 | 5}`
  // Associations — Code de la consommation L.811-1
  | 'L.811-1'
  // Vices cachés — Code civil 1641 à 1649
  | '1642-1'
  | '1646-1'
  | `${1641 | 1642 | 1643 | 1644 | 1645 | 1646 | 1647 | 1648 | 1649}`
  // Procédure — CPC 808, 843 à 847
  | `${808 | 843 | 844 | 845 | 846 | 847}`;

/**
 * Définition complète d'un article - source unique de vérité
 */
export interface LegalArticleDefinition {
  // Métadonnées de base (identité)
  readonly code: LegalCode;
  readonly id: LegalArticleId;
  readonly label: string;
  readonly source: 'LEGIFRANCE';

  // Contenu enrichi (récupéré via API)
  readonly text?: string;
  readonly lastVerified?: string;
  readonly lastModified?: string;
  readonly status: 'VIGUEUR' | 'ABROGE' | 'MODIFIE' | 'UNKNOWN';
  readonly url?: string;
  readonly wordCount?: number;
  readonly checksum?: string;

  // Méta-info technique
  readonly isValid: boolean;
  readonly priority: number; // Pour tri/importance
}

/**
 * Registry global - remplace les anciens LEGAL_ARTICLES + textes générés
 */
export interface LegalRegistry {
  readonly articles: Record<LegalArticleId, LegalArticleDefinition>;
  readonly metadata: {
    readonly lastUpdated: string;
    readonly version: string;
    readonly totalArticles: number;
    readonly validArticles: number;
    readonly coverage: number; // % d'articles avec texte
    readonly checksum: string; // Hash global pour détection changements
  };
}

/**
 * Mapping des codes vers leurs noms complets
 */
export const CODE_NAMES: Record<LegalCode, string> = {
  CODE_CONSOMMATION: 'Code de la consommation',
  CODE_CIVIL: 'Code civil',
  CODE_PROCEDURE_CIVILE: 'Code de procédure civile',
} as const;

/**
 * Mapping vers les LEGITEXT (pour API PISTE)
 */
export const CODE_TO_LEGITEXT: Record<string, string> = {
  'Code de la consommation': 'LEGITEXT000006069565',
  'Code civil': 'LEGITEXT000006070721',
  'Code de procédure civile': 'LEGITEXT000006070716',
} as const;

/**
 * Définitions de base des articles (métadonnées uniquement)
 * ⚠️ Le contenu réel est dans registry.generated.json
 */
export const LEGAL_ARTICLE_DEFINITIONS: Record<
  LegalArticleId,
  Omit<
    LegalArticleDefinition,
    | 'text'
    | 'lastVerified'
    | 'lastModified'
    | 'status'
    | 'url'
    | 'wordCount'
    | 'checksum'
    | 'isValid'
  >
> = {
  // === GARANTIE LÉGALE DE CONFORMITÉ ===
  'L.217-3': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-3',
    label: 'Code de la consommation, art. L. 217-3',
    source: 'LEGIFRANCE',
    priority: 10, // Article clé
  },
  'L.217-4': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-4',
    label: 'Code de la consommation, art. L. 217-4',
    source: 'LEGIFRANCE',
    priority: 9,
  },
  'L.217-5': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-5',
    label: 'Code de la consommation, art. L. 217-5',
    source: 'LEGIFRANCE',
    priority: 8,
  },
  'L.217-6': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-6',
    label: 'Code de la consommation, art. L. 217-6',
    source: 'LEGIFRANCE',
    priority: 7,
  },
  'L.217-7': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-7',
    label: 'Code de la consommation, art. L. 217-7',
    source: 'LEGIFRANCE',
    priority: 10, // Durée de garantie - critique
  },
  'L.217-8': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-8',
    label: 'Code de la consommation, art. L. 217-8',
    source: 'LEGIFRANCE',
    priority: 6,
  },
  'L.217-9': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-9',
    label: 'Code de la consommation, art. L. 217-9',
    source: 'LEGIFRANCE',
    priority: 10, // Réparation/remplacement - critique
  },
  'L.217-10': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-10',
    label: 'Code de la consommation, art. L. 217-10',
    source: 'LEGIFRANCE',
    priority: 8,
  },
  'L.217-11': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-11',
    label: 'Code de la consommation, art. L. 217-11',
    source: 'LEGIFRANCE',
    priority: 9, // Remboursement - important
  },
  'L.217-12': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-12',
    label: 'Code de la consommation, art. L. 217-12',
    source: 'LEGIFRANCE',
    priority: 8,
  },
  'L.217-13': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-13',
    label: 'Code de la consommation, art. L. 217-13',
    source: 'LEGIFRANCE',
    priority: 7,
  },
  'L.217-14': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-14',
    label: 'Code de la consommation, art. L. 217-14',
    source: 'LEGIFRANCE',
    priority: 6,
  },
  'L.217-15': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-15',
    label: 'Code de la consommation, art. L. 217-15',
    source: 'LEGIFRANCE',
    priority: 5,
  },
  'L.217-16': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-16',
    label: 'Code de la consommation, art. L. 217-16',
    source: 'LEGIFRANCE',
    priority: 5,
  },
  'L.217-17': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-17',
    label: 'Code de la consommation, art. L. 217-17',
    source: 'LEGIFRANCE',
    priority: 4,
  },
  'L.217-18': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-18',
    label: 'Code de la consommation, art. L. 217-18',
    source: 'LEGIFRANCE',
    priority: 4,
  },
  'L.217-19': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-19',
    label: 'Code de la consommation, art. L. 217-19',
    source: 'LEGIFRANCE',
    priority: 3,
  },
  'L.217-20': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-20',
    label: 'Code de la consommation, art. L. 217-20',
    source: 'LEGIFRANCE',
    priority: 3,
  },
  'L.217-21': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-21',
    label: 'Code de la consommation, art. L. 217-21',
    source: 'LEGIFRANCE',
    priority: 2,
  },
  'L.217-22': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-22',
    label: 'Code de la consommation, art. L. 217-22',
    source: 'LEGIFRANCE',
    priority: 2,
  },
  'L.217-23': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-23',
    label: 'Code de la consommation, art. L. 217-23',
    source: 'LEGIFRANCE',
    priority: 1,
  },
  'L.217-24': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-24',
    label: 'Code de la consommation, art. L. 217-24',
    source: 'LEGIFRANCE',
    priority: 1,
  },
  'L.217-25': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-25',
    label: 'Code de la consommation, art. L. 217-25',
    source: 'LEGIFRANCE',
    priority: 1,
  },
  'L.217-26': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-26',
    label: 'Code de la consommation, art. L. 217-26',
    source: 'LEGIFRANCE',
    priority: 1,
  },
  'L.217-27': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-27',
    label: 'Code de la consommation, art. L. 217-27',
    source: 'LEGIFRANCE',
    priority: 1,
  },
  'L.217-28': {
    code: 'CODE_CONSOMMATION',
    id: 'L.217-28',
    label: 'Code de la consommation, art. L. 217-28',
    source: 'LEGIFRANCE',
    priority: 1,
  },

  // === MÉDIATION ===
  'L.612-1': {
    code: 'CODE_CONSOMMATION',
    id: 'L.612-1',
    label: 'Code de la consommation, art. L. 612-1',
    source: 'LEGIFRANCE',
    priority: 9, // Médiation obligatoire - important
  },
  'L.612-2': {
    code: 'CODE_CONSOMMATION',
    id: 'L.612-2',
    label: 'Code de la consommation, art. L. 612-2',
    source: 'LEGIFRANCE',
    priority: 8,
  },
  'L.612-3': {
    code: 'CODE_CONSOMMATION',
    id: 'L.612-3',
    label: 'Code de la consommation, art. L. 612-3',
    source: 'LEGIFRANCE',
    priority: 7,
  },
  'L.612-4': {
    code: 'CODE_CONSOMMATION',
    id: 'L.612-4',
    label: 'Code de la consommation, art. L. 612-4',
    source: 'LEGIFRANCE',
    priority: 6,
  },
  'L.612-5': {
    code: 'CODE_CONSOMMATION',
    id: 'L.612-5',
    label: 'Code de la consommation, art. L. 612-5',
    source: 'LEGIFRANCE',
    priority: 5,
  },

  // === ASSOCIATIONS CONSOMMATEURS ===
  'L.811-1': {
    code: 'CODE_CONSOMMATION',
    id: 'L.811-1',
    label: 'Code de la consommation, art. L. 811-1',
    source: 'LEGIFRANCE',
    priority: 6,
  },

  // === VICES CACHÉS (CODE CIVIL) ===
  '1641': {
    code: 'CODE_CIVIL',
    id: '1641',
    label: 'Code civil, art. 1641',
    source: 'LEGIFRANCE',
    priority: 8, // Vice caché - important fallback
  },
  '1642': {
    code: 'CODE_CIVIL',
    id: '1642',
    label: 'Code civil, art. 1642',
    source: 'LEGIFRANCE',
    priority: 7,
  },
  '1642-1': {
    code: 'CODE_CIVIL',
    id: '1642-1',
    label: 'Code civil, art. 1642-1',
    source: 'LEGIFRANCE',
    priority: 5,
  },
  '1643': {
    code: 'CODE_CIVIL',
    id: '1643',
    label: 'Code civil, art. 1643',
    source: 'LEGIFRANCE',
    priority: 6,
  },
  '1644': {
    code: 'CODE_CIVIL',
    id: '1644',
    label: 'Code civil, art. 1644',
    source: 'LEGIFRANCE',
    priority: 7, // Délais action - important
  },
  '1645': {
    code: 'CODE_CIVIL',
    id: '1645',
    label: 'Code civil, art. 1645',
    source: 'LEGIFRANCE',
    priority: 5,
  },
  '1646': {
    code: 'CODE_CIVIL',
    id: '1646',
    label: 'Code civil, art. 1646',
    source: 'LEGIFRANCE',
    priority: 5,
  },
  '1646-1': {
    code: 'CODE_CIVIL',
    id: '1646-1',
    label: 'Code civil, art. 1646-1',
    source: 'LEGIFRANCE',
    priority: 4,
  },
  '1647': {
    code: 'CODE_CIVIL',
    id: '1647',
    label: 'Code civil, art. 1647',
    source: 'LEGIFRANCE',
    priority: 4,
  },
  '1648': {
    code: 'CODE_CIVIL',
    id: '1648',
    label: 'Code civil, art. 1648',
    source: 'LEGIFRANCE',
    priority: 4,
  },
  '1649': {
    code: 'CODE_CIVIL',
    id: '1649',
    label: 'Code civil, art. 1649',
    source: 'LEGIFRANCE',
    priority: 3,
  },

  // === PROCÉDURE CIVILE ===
  '808': {
    code: 'CODE_PROCEDURE_CIVILE',
    id: '808',
    label: 'Code de procédure civile, art. 808',
    source: 'LEGIFRANCE',
    priority: 6, // Référé - utile pour urgence
  },
  '843': {
    code: 'CODE_PROCEDURE_CIVILE',
    id: '843',
    label: 'Code de procédure civile, art. 843',
    source: 'LEGIFRANCE',
    priority: 5,
  },
  '844': {
    code: 'CODE_PROCEDURE_CIVILE',
    id: '844',
    label: 'Code de procédure civile, art. 844',
    source: 'LEGIFRANCE',
    priority: 4,
  },
  '845': {
    code: 'CODE_PROCEDURE_CIVILE',
    id: '845',
    label: 'Code de procédure civile, art. 845',
    source: 'LEGIFRANCE',
    priority: 4,
  },
  '846': {
    code: 'CODE_PROCEDURE_CIVILE',
    id: '846',
    label: 'Code de procédure civile, art. 846',
    source: 'LEGIFRANCE',
    priority: 3,
  },
  '847': {
    code: 'CODE_PROCEDURE_CIVILE',
    id: '847',
    label: 'Code de procédure civile, art. 847',
    source: 'LEGIFRANCE',
    priority: 3,
  },
} as const;

/**
 * Utilitaires pour le registry
 */
export class LegalRegistryUtils {
  /**
   * Génère un checksum pour détecter les modifications
   */
  static generateChecksum(content: string): string {
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Valide qu'un registry est bien formé
   */
  static validateRegistry(registry: LegalRegistry): boolean {
    const requiredArticles = Object.keys(LEGAL_ARTICLE_DEFINITIONS);
    const registryArticles = Object.keys(registry.articles);

    // Tous les articles définis doivent être présents
    const missingArticles = requiredArticles.filter(id => !registryArticles.includes(id));
    if (missingArticles.length > 0) {
      console.warn('Articles manquants dans le registry:', missingArticles);
      return false;
    }

    // Pas d'articles en trop
    const extraArticles = registryArticles.filter(id => !requiredArticles.includes(id));
    if (extraArticles.length > 0) {
      console.warn('Articles non définis dans le registry:', extraArticles);
      return false;
    }

    return true;
  }

  /**
   * Calcule les statistiques du registry
   */
  static computeMetadata(
    articles: Record<LegalArticleId, LegalArticleDefinition>,
  ): LegalRegistry['metadata'] {
    const articlesList = Object.values(articles);
    const totalArticles = articlesList.length;
    const validArticles = articlesList.filter(a => a.isValid).length;
    const articlesWithText = articlesList.filter(a => a.text && a.text.length > 0).length;

    return {
      lastUpdated: new Date().toISOString(),
      version: '2.0.0',
      totalArticles,
      validArticles,
      coverage: Math.round((articlesWithText / totalArticles) * 100),
      checksum: this.generateChecksum(JSON.stringify(articles)),
    };
  }
}

/**
 * Type guards pour la validation TypeScript
 */
export function isValidLegalArticleId(id: string): id is LegalArticleId {
  return id in LEGAL_ARTICLE_DEFINITIONS;
}

export function isValidLegalCode(code: string): code is LegalCode {
  return ['CODE_CONSOMMATION', 'CODE_CIVIL', 'CODE_PROCEDURE_CIVILE'].includes(code);
}
