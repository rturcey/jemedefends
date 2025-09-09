// *** src/lib/yaml-guide-validator.ts ***
import { validateGuideYAML } from './yaml-guide-converter';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export function validateGuideYAMLAdvanced(yamlContent: string): ValidationResult {
  const baseResult = validateGuideYAML(yamlContent);
  const warnings: string[] = [];
  const suggestions: string[] = [];

  try {
    const data = JSON.parse(JSON.stringify(require('js-yaml').load(yamlContent)));

    // Vérifications avancées
    if (!data.seo?.keywords?.length) {
      warnings.push('Aucun mot-clé SEO défini');
    }

    if (data.sections?.length < 2) {
      warnings.push('Guide avec moins de 2 sections');
    }

    if (data.legal?.mainArticles?.length === 0) {
      warnings.push('Aucun article de loi principal');
    }

    // Suggestions d'amélioration
    const titleLength = data.title?.length || 0;
    if (titleLength > 60) {
      suggestions.push('Titre trop long pour le SEO (>60 caractères)');
    }

    const descLength = data.description?.length || 0;
    if (descLength > 160) {
      suggestions.push('Description trop longue pour le SEO (>160 caractères)');
    }

    // Vérifier cohérence slug/titre
    if (data.slug && data.title) {
      const slugWords = data.slug.split('-');
      const titleWords = data.title.toLowerCase().split(/\s+/);
      const commonWords = slugWords.filter(word =>
        titleWords.some(titleWord => titleWord.includes(word)),
      );

      if (commonWords.length / slugWords.length < 0.5) {
        suggestions.push('Le slug ne reflète pas bien le titre');
      }
    }

    return {
      isValid: baseResult.valid,
      errors: baseResult.errors,
      warnings,
      suggestions,
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [...baseResult.errors, 'Erreur parsing pour validation avancée'],
      warnings: [],
      suggestions: [],
    };
  }
}
