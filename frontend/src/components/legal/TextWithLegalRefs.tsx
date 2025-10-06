// src/legal/components/TextWithLegalRefs.tsx
// Parser V2 - Utilise la nouvelle architecture centralisée
// Mobile-first, performance optimisée, regex améliorée

'use client';

import * as React from 'react';
import { useMemo } from 'react';

import { type LegalArticleId, isValidLegalArticleId } from '@/legal/registry';

import LegalReference from './LegalReference';

interface TextWithLegalRefsProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Texte à parser */
  text: string;

  /** Variant à utiliser pour les références trouvées */
  variant?: 'inline' | 'tooltip' | 'badge' | 'expandable' | 'modal';

  /** Taille des références */
  size?: 'sm' | 'md' | 'lg';

  /** Affiche l'indicateur de statut */
  showStatus?: boolean;

  /** Affiche les liens externes */
  showExternalLink?: boolean;

  /** Classes CSS pour le conteneur */
  className?: string;

  /** Si true, charge immédiatement tous les articles trouvés */
  preloadArticles?: boolean;
}

/**
 * Regex améliorée pour détecter les références légales
 * Couvre tous les patterns utilisés dans le système
 */
const LEGAL_PATTERNS = [
  // Articles Code de la consommation: L.217-3, L.612-1, L.811-1
  /L\.(?:217-(?:3|4|5|6|7|8|9|1[0-9]|2[0-8])|612-[1-5]|811-1)\b/g,

  // Articles Code civil: 1641, 1642, 1642.1, etc.
  /\b(?:164[1-9]|1642\.1|1646\.1)\b/g,

  // Articles Code procédure civile: 808, 843-847
  /\b(?:808|84[3-7])\b/g,
];

/**
 * Interface pour un match trouvé
 */
interface LegalMatch {
  text: string;
  start: number;
  end: number;
  articleId: LegalArticleId;
  isValid: boolean;
}

/**
 * Utilitaires de parsing
 */
class LegalTextParser {
  /**
   * Parse le texte et trouve toutes les références légales
   */
  static findLegalReferences(text: string): LegalMatch[] {
    const matches: LegalMatch[] = [];

    for (const regex of LEGAL_PATTERNS) {
      // Reset regex pour éviter les états partagés
      regex.lastIndex = 0;

      let match: RegExpExecArray | null;
      while ((match = regex.exec(text)) !== null) {
        const matchText = match[0];
        const normalizedId = this.normalizeArticleId(matchText);

        if (isValidLegalArticleId(normalizedId)) {
          matches.push({
            text: matchText,
            start: match.index,
            end: match.index + matchText.length,
            articleId: normalizedId,
            isValid: true,
          });
        }

        // Éviter les boucles infinies sur regex globales
        if (regex.global && regex.lastIndex === match.index) {
          regex.lastIndex++;
        }
      }
    }

    // Trier par position dans le texte
    return matches.sort((a, b) => a.start - b.start);
  }

  /**
   * Normalise un ID d'article pour correspondre aux types TS
   */
  static normalizeArticleId(text: string): string {
    // Déjà normalisé (L.217-3, 1641, etc.)
    return text.trim();
  }

  /**
   * Supprime les matches qui se chevauchent
   */
  static deduplicateMatches(matches: LegalMatch[]): LegalMatch[] {
    if (matches.length === 0) return matches;

    const deduplicated: LegalMatch[] = [matches[0]];

    for (let i = 1; i < matches.length; i++) {
      const current = matches[i];
      const previous = deduplicated[deduplicated.length - 1];

      // Si pas de chevauchement, ajouter
      if (current.start >= previous.end) {
        deduplicated.push(current);
      }
      // Si chevauchement, garder le plus long
      else if (current.end - current.start > previous.end - previous.start) {
        deduplicated[deduplicated.length - 1] = current;
      }
    }

    return deduplicated;
  }

  /**
   * Split le texte en segments avec les références identifiées
   */
  static splitTextWithReferences(
    text: string,
    matches: LegalMatch[],
  ): Array<{
    type: 'text' | 'legal';
    content: string;
    articleId?: LegalArticleId;
  }> {
    if (matches.length === 0) {
      return [{ type: 'text', content: text }];
    }

    const segments: Array<{
      type: 'text' | 'legal';
      content: string;
      articleId?: LegalArticleId;
    }> = [];

    let lastIndex = 0;

    for (const match of matches) {
      // Texte avant la référence
      if (match.start > lastIndex) {
        segments.push({
          type: 'text',
          content: text.slice(lastIndex, match.start),
        });
      }

      // Référence légale
      segments.push({
        type: 'legal',
        content: match.text,
        articleId: match.articleId,
      });

      lastIndex = match.end;
    }

    // Texte après la dernière référence
    if (lastIndex < text.length) {
      segments.push({
        type: 'text',
        content: text.slice(lastIndex),
      });
    }

    return segments;
  }
}

/**
 * Hook pour parser un texte et extraire les références
 */
function useLegalTextParsing(text: string) {
  return useMemo(() => {
    const matches = LegalTextParser.findLegalReferences(text);
    const deduplicatedMatches = LegalTextParser.deduplicateMatches(matches);
    const segments = LegalTextParser.splitTextWithReferences(text, deduplicatedMatches);

    const foundArticles = deduplicatedMatches.filter(m => m.isValid).map(m => m.articleId);

    return {
      segments,
      foundArticles: [...new Set(foundArticles)], // Deduplicate
      matchCount: deduplicatedMatches.length,
    };
  }, [text]);
}

/**
 * Composant principal
 */
export default function TextWithLegalRefs({
  text,
  variant = 'tooltip', // Par défaut tooltip pour interactivité
  size = 'md',
  showStatus = true, // Activé par défaut
  showExternalLink = true, // Activé par défaut
  className,
  preloadArticles = true, // Chargement immédiat
  ...props
}: TextWithLegalRefsProps) {
  const { segments, foundArticles } = useLegalTextParsing(text);

  // Rendu des segments avec références interactives
  const content = segments.map((segment, index) => {
    if (segment.type === 'text') {
      return <React.Fragment key={index}>{segment.content}</React.Fragment>;
    }

    // Segment de référence légale - FORCÉ en tooltip interactif
    return (
      <LegalReference
        key={`${segment.articleId}-${index}`}
        code={segment.articleId}
        variant="tooltip" // FORCÉ en tooltip
        size={size}
        showStatus={true} // FORCÉ
        showExternalLink={true} // FORCÉ
        immediate={true} // FORCÉ en immédiat
        className="text-blue-600 hover:text-blue-800 underline cursor-pointer" // Styles cliquables
      >
        {segment.content}
      </LegalReference>
    );
  });

  return (
    <span className={className} {...props}>
      {content}
    </span>
  );
}
