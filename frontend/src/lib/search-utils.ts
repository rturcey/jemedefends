// lib/unified-search.ts

/**
 * Interface générique pour les éléments recherchables
 */
export interface SearchableItem {
  id: string;
  isPopular?: boolean;

  [key: string]: any; // Autres propriétés spécifiques
}

/**
 * Configuration des champs de recherche avec pondération
 */
export interface SearchField {
  key: string; // Nom du champ dans l'objet
  weight: number; // Poids pour le scoring (1-20)
  isArray?: boolean; // Si le champ est un tableau (ex: keywords)
}

/**
 * Normalise le texte pour la recherche
 */
export function normalizeText(text: string): string {
  if (!text) return '';

  return (
    text
      .toLowerCase()
      // Supprimer les accents
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // Supprimer la ponctuation et caractères spéciaux
      .replace(/[^\w\s]/g, ' ')
      // Normaliser les espaces
      .replace(/\s+/g, ' ')
      .trim()
  );
}

/**
 * Crée un filtre de recherche avec scoring générique
 */
export function createUnifiedSearchFilter<T extends SearchableItem>(
  searchQuery: string,
  searchFields: SearchField[],
) {
  if (!searchQuery.trim()) return (items: T[]) => items;

  const normalizedQuery = normalizeText(searchQuery);
  const searchTerms = normalizedQuery.split(' ').filter(term => term.length > 0);

  return (items: T[]) => {
    const scoredItems = items.map(item => {
      let score = 0;

      searchFields.forEach(({ key, weight, isArray }) => {
        const value = item[key];
        if (!value) return;

        const texts = isArray ? value : [value];

        texts.forEach((text: string) => {
          const normalized = normalizeText(text);

          searchTerms.forEach(term => {
            // Match exact
            if (normalized.includes(term)) {
              score += weight * 2;
            }

            // Match au début d'un mot
            const words = normalized.split(' ');
            if (words.some(word => word.startsWith(term))) {
              score += weight * 1.5;
            }

            // Match partiel pour mots longs
            if (term.length >= 3) {
              words.forEach(word => {
                if (word.includes(term) && word !== term) {
                  score += weight * 0.7;
                }
              });
            }
          });
        });
      });

      return { item, score };
    });

    return scoredItems
      .filter(({ score }) => score > 0)
      .sort((a, b) => {
        // Tri par score décroissant
        if (b.score !== a.score) return b.score - a.score;
        // Puis par popularité
        if (a.item.isPopular && !b.item.isPopular) return -1;
        if (!a.item.isPopular && b.item.isPopular) return 1;
        return 0;
      })
      .map(({ item }) => item);
  };
}

/**
 * Configuration pour les guides
 */
export const GUIDE_SEARCH_CONFIG: SearchField[] = [
  { key: 'title', weight: 10 },
  { key: 'description', weight: 5 },
  { key: 'keywords', weight: 7, isArray: true },
  { key: 'category.name', weight: 3 }, // Accès propriété imbriquée
];

/**
 * Configuration pour les FAQ
 */
export const FAQ_SEARCH_CONFIG: SearchField[] = [
  { key: 'question', weight: 15 },
  { key: 'answer', weight: 8 },
  { key: 'keywords', weight: 10, isArray: true },
];

/**
 * Utilitaire pour accéder aux propriétés imbriquées
 */
function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Version améliorée qui gère les propriétés imbriquées
 */
export function createAdvancedUnifiedSearchFilter<T extends SearchableItem>(
  searchQuery: string,
  searchFields: SearchField[],
) {
  if (!searchQuery.trim()) return (items: T[]) => items;

  const normalizedQuery = normalizeText(searchQuery);
  const searchTerms = normalizedQuery.split(' ').filter(term => term.length > 0);

  return (items: T[]) => {
    const scoredItems = items.map(item => {
      let score = 0;

      searchFields.forEach(({ key, weight, isArray }) => {
        const value = getNestedProperty(item, key);
        if (!value) return;

        const texts = isArray ? value : [value];

        texts.forEach((text: string) => {
          const normalized = normalizeText(String(text));

          searchTerms.forEach(term => {
            // Match exact
            if (normalized.includes(term)) {
              score += weight * 2;
            }

            // Match au début d'un mot
            const words = normalized.split(' ');
            if (words.some(word => word.startsWith(term))) {
              score += weight * 1.5;
            }

            // Match partiel pour mots longs
            if (term.length >= 3) {
              words.forEach(word => {
                if (word.includes(term) && word !== term) {
                  score += weight * 0.7;
                }
              });
            }
          });
        });
      });

      return { item, score };
    });

    return scoredItems
      .filter(({ score }) => score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.item.isPopular && !b.item.isPopular) return -1;
        if (!a.item.isPopular && b.item.isPopular) return 1;
        return 0;
      })
      .map(({ item }) => item);
  };
}
