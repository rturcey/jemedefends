// src/types/eligibility.ts

// --- Étapes du flow (7 étapes fixes) ---
export type StepId =
  | 'seller'
  | 'usage'
  | 'itemCategory'  // Bien matériel / Contenu-Service numérique
  | 'itemDetail'    // Neuf / Occasion OU Ponctuel / Abonnement
  | 'territory'
  | 'timing'
  | 'defect';

// --- UI types inchangés ---
export type RadioUI = {
  type: 'radio';
  required?: boolean;
  options: { value: string; label: string; description?: string }[];
};
export type DateUI = { type: 'date'; required?: boolean };
export type StepUI = RadioUI | DateUI;

// --- Références légales / explications ---
export interface StepLegal {
  article: string;
  explanation: string;
  examples?: string[];
}

// --- Nouvelles catégories & détails (2 niveaux) ---
export type ItemCategory = 'good' | 'digital_service';
export type ItemDetail = 'new' | 'used' | 'one_off' | 'subscription';

// --- Réponse de timing unifiée (biens/ponctuel vs abonnement) ---
export type TimingAnswer = 'ok' | 'ko' | 'during_contract' | 'after_contract';

// --- Étape d'éligibilité (avec contenu dynamique optionnel) ---
export interface EligibilityStep {
  id: StepId;
  title: string;
  question: string;
  description: string;
  legal: StepLegal;
  ui: StepUI;

  /**
   * Optionnel : permet d’adapter dynamiquement le libellé, la question,
   * la description, les options, et/ou les références légales en fonction
   * des réponses précédentes, SANS changer le nombre d’étapes.
   */
  dynamic?: (
    data: EligibilityData,
  ) => Partial<
    Pick<
      EligibilityStep,
      'title' | 'question' | 'description' | 'ui' | 'legal'
    >
  >;
}

// --- Données du formulaire ---
// NOTE: on conserve les anciens champs (dépréciés) pour compat descendante.
export interface EligibilityData {
  sellerType?: 'professional' | 'individual';
  usage?: 'personal' | 'professional';

  // ✅ Nouveau découpage en 2 niveaux
  itemCategory?: ItemCategory;   // Bien matériel / Contenu/Service numérique
  itemDetail?: ItemDetail;       // Neuf / Occasion // Ponctuel / Abonnement

  territory?: 'eu' | 'non_eu';

  // ✅ Nouveau timing unifié
  // - Biens & service ponctuel : 'ok' (<2 ans) | 'ko' (≥2 ans)
  // - Abonnement : 'during_contract' | 'after_contract'
  timingAnswer?: TimingAnswer;

  hasDefect?: boolean;

  // ❗ Dépréciés : à retirer une fois le refactor terminé
  /** @deprecated Utiliser itemCategory à la place */
  productType?: 'physical' | 'digital';
  /** @deprecated Utiliser timingAnswer à la place */
  withinTwoYears?: boolean;
}

// --- Validation par étape (inchangé) ---
export type StepValidationType = 'error' | 'warning' | 'info' | 'success';

export interface StepValidation {
  isValid: boolean;
  message?: string;
  type?: StepValidationType;
}
