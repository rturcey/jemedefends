import type { ReformulationRequest, ReformulationResponse } from '@/types/api';
import { API_ENDPOINTS } from '@/types/api';

/**
 * Service pour les fonctionnalités IA (reformulation de texte)
 */
class AIService {
  private static readonly BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

  /**
   * Reformule un texte via l'IA générative Scaleway
   */
  static async reformulateText(request: ReformulationRequest): Promise<ReformulationResponse> {
    const url = `${this.BASE_URL}${API_ENDPOINTS.reformulateText}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: request.text.trim(),
          type: request.type,
          context: request.context,
        }),
      });

      if (!response.ok) {
        // Tenter de récupérer le détail de l'erreur
        let errorMessage = `Erreur HTTP ${response.status}`;

        try {
          const errorData = await response.json();
          if (errorData.detail) {
            errorMessage = errorData.detail;
          }
        } catch {
          // Si on ne peut pas parser l'erreur JSON, garder le message générique
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();

      // Validation basique de la réponse
      if (!result.reformulated_text) {
        throw new Error('Réponse invalide du service IA');
      }

      return result;
    } catch (error) {
      console.error('Error in reformulateText:', error);

      // Retourner une réponse d'erreur structurée
      return {
        original_text: request.text,
        reformulated_text: request.text, // Fallback vers le texte original
        type: request.type,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  /**
   * Corrige l'orthographe et la grammaire d'un texte
   */
  static async correctText(text: string, context?: string): Promise<ReformulationResponse> {
    return this.reformulateText({
      text,
      type: 'corrected',
      context,
    });
  }

  /**
   * Reformule un texte de manière professionnelle
   */
  static async reformulateTextProfessional(
    text: string,
    context?: string,
  ): Promise<ReformulationResponse> {
    return this.reformulateText({
      text,
      type: 'reformulated',
      context,
    });
  }

  /**
   * Valide qu'un texte peut être reformulé (longueur, contenu...)
   */
  static validateTextForReformulation(text: string): { valid: boolean; error?: string } {
    const trimmedText = text.trim();

    if (trimmedText.length < 10) {
      return {
        valid: false,
        error: 'Le texte doit contenir au moins 10 caractères',
      };
    }

    if (trimmedText.length > 2000) {
      return {
        valid: false,
        error: 'Le texte ne peut pas dépasser 2000 caractères',
      };
    }

    // Vérifier qu'il y a du contenu significatif (pas que des espaces/ponctuation)
    const meaningfulContent = trimmedText.replace(/[^\w\u00C0-\u024F\u1E00-\u1EFF]/g, '');
    if (meaningfulContent.length < 5) {
      return {
        valid: false,
        error: 'Le texte doit contenir du contenu significatif',
      };
    }

    return { valid: true };
  }
}

export default AIService;
