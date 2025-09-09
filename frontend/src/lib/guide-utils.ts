// lib/guide-utils.ts - FONCTIONS UTILITAIRES PURES
// Pas de dépendances vers des registries ou caches

import type { GuidePage } from '@/types/guides';

/**
 * Calcule le temps de lecture estimé d'un guide
 */
export function calculateReadingTime(guide: GuidePage): number {
  let totalWords = 0;

  guide.sections.forEach(section => {
    // Contenu string
    if (typeof section.content === 'string') {
      totalWords += section.content.split(/\s+/).filter(word => word.length > 0).length;
    }

    // Steps (procédures)
    if (section.steps?.length) {
      totalWords += section.steps.length * 20;
    }

    // FAQ
    if (section.faqItems?.length) {
      totalWords += section.faqItems.length * 30;
    }

    // Items (grilles)
    if (section.items?.length) {
      totalWords += section.items.length * 15;
    }

    // Tables
    if (section.tableData?.length) {
      totalWords += section.tableData.length * 10;
    }
  });

  // Minimum 2 minutes, puis calcul basé sur 200 mots/minute
  return Math.max(Math.ceil(totalWords / 200), 2);
}

/**
 * Calcule la difficulté d'un guide basé sur sa complexité
 */
export function calculateDifficulty(guide: GuidePage): 'facile' | 'moyen' | 'difficile' {
  const articleCount = guide.legal.mainArticles.length;
  const sectionCount = guide.sections.length;
  const hasComplexTypes = guide.sections.some(s => s.type === 'table' || s.type === 'timeline');

  // Logique de calcul
  if (articleCount <= 3 && sectionCount <= 4 && !hasComplexTypes) {
    return 'facile';
  }
  if (articleCount <= 6 && sectionCount <= 6) {
    return 'moyen';
  }
  return 'difficile';
}

/**
 * Détermine la catégorie d'un guide basé sur son slug
 */
export function getCategoryFromSlug(slug: string): {
  name: string;
  color: string;
  emoji: string;
} {
  // High-Tech
  if (
    slug.includes('smartphone') ||
    slug.includes('ordinateur') ||
    slug.includes('tech') ||
    slug.includes('casque') ||
    slug.includes('ecouteurs') ||
    slug.includes('smartwatch') ||
    slug.includes('tablette') ||
    slug.includes('tv-') ||
    slug.includes('videoprojecteur') ||
    slug.includes('serveur-nas') ||
    slug.includes('imprimante') ||
    slug.includes('ecran-pc') ||
    slug.includes('console-') ||
    slug.includes('home-cinema') ||
    slug.includes('serrure-connectee')
  ) {
    return { name: 'High-Tech', color: 'blue', emoji: '📱' };
  }

  // Automobile
  if (
    slug.includes('voiture') ||
    slug.includes('auto') ||
    slug.includes('vehicule') ||
    slug.includes('camping-car') ||
    slug.includes('moto') ||
    slug.includes('borne-recharge') ||
    slug.includes('autoradio')
  ) {
    return { name: 'Automobile', color: 'red', emoji: '🚗' };
  }

  // Maison & Électroménager
  if (
    slug.includes('maison') ||
    slug.includes('electromenager') ||
    slug.includes('lave-') ||
    slug.includes('refrigerateur') ||
    slug.includes('micro-ondes') ||
    slug.includes('chauffe-eau') ||
    slug.includes('portail') ||
    slug.includes('aspirateur') ||
    slug.includes('purificateur') ||
    slug.includes('plaque-induction') ||
    slug.includes('four-') ||
    slug.includes('cafetiere') ||
    slug.includes('friteuse') ||
    slug.includes('mixeur') ||
    slug.includes('extracteur') ||
    slug.includes('yaourtiere') ||
    slug.includes('machine-a-pain') ||
    slug.includes('centrale-vapeur')
  ) {
    return { name: 'Maison', color: 'green', emoji: '🏠' };
  }

  // Général (par défaut)
  return { name: 'Général', color: 'purple', emoji: '⚖️' };
}

/**
 * Hash simple pour générer des valeurs déterministes
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Génère une valeur entre 0 et 1 basée sur un string
 */
export function hash01(str: string): number {
  return hashString(str) / 2147483647;
}

/**
 * Formate une date en français
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Slugifie un string (pour URLs)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9 -]/g, '') // Garde que alphanumeric, espaces et tirets
    .replace(/\s+/g, '-') // Remplace espaces par tirets
    .replace(/-+/g, '-') // Supprime tirets multiples
    .trim();
}

/**
 * Extrait un extrait de texte d'une longueur donnée
 */
export function excerpt(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text;

  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0 ? truncated.slice(0, lastSpace) + '...' : truncated + '...';
}

/**
 * Valide un slug de guide
 */
export function isValidGuideSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(slug) && slug.length > 0 && slug.length <= 100;
}
