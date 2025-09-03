// types/api.ts - Types partagés entre frontend et backend

// === TYPES DE BASE ===

export interface Address {
  street: string;
  postal_code: string;
  city: string;
  country?: string;
}

export interface Consumer {
  first_name: string;
  last_name: string;
  address: Address;
  email: string;
  phone?: string;
}

export interface Seller {
  name: string;
  address: Address;
  email?: string;
  siret?: string;
}

export interface Product {
  name: string;
  brand?: string;
  model?: string;
  purchase_date: string; // ISO date
  purchase_price: number;
  invoice_number?: string;
}

// === TYPES DÉFAUTS ===

export type DefectType =
  | 'malfunction'
  | 'missing_feature'
  | 'quality'
  | 'description'
  | 'delivery_delay'
  | 'other';

export interface Defect {
  type: DefectType;
  description: string;
  previous_contact_date?: string;
  previous_contact_method?: string;
}

// === TYPES DEMANDES ===

export type RequestedAction = 'repair' | 'replacement' | 'refund';

export interface LetterRequest {
  consumer: Consumer;
  seller: Seller;
  product: Product;
  defect: Defect;
  requested_action: RequestedAction;
}

// === TYPES BROUILLONS ===

export type DraftStatus = 'active' | 'submitted' | 'expired';

export type DraftEventType =
  | 'form_started'
  | 'step_completed'
  | 'form_abandoned'
  | 'form_submitted'
  | 'payment_completed';

export interface FormDraft {
  id: string;
  form_slug: string;
  data: Record<string, any>;
  status: DraftStatus;
  created_at: string;
  updated_at: string;
  last_event?: string;
}

export interface DraftUpdateResult {
  success: boolean;
  draft_id: string;
  updated_at: string;
}

// === TYPES LETTRES ===

export type LetterStatus = 'draft' | 'generated' | 'sent' | 'delivered';

export interface Letter {
  id: string;
  consumer: Consumer;
  seller: Seller;
  product: Product;
  defect: Defect;
  requested_action: RequestedAction;
  status: LetterStatus;
  generated_at: string;
  content?: string;
  legal_articles: string[];
}

// === TYPES API RESPONSES ===

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface GetFormDraftResponse {
  data: Record<string, any> | null;
  draft_id: string;
  status: DraftStatus;
  last_event: string | null;
}

export interface SubmitFormResponse {
  ok: boolean;
  draft_id: string | null;
  letter_id: string | null;
  redirect_url: string | null;
}

// === TYPES PAIEMENT ===

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  client_secret?: string;
}

// === TYPES FORMULES ===

export type FormulaType = 'free' | 'pdf' | 'complete';

export interface Formula {
  type: FormulaType;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
}

// === TYPES ÉLIGIBILITÉ ===

export interface EligibilityTest {
  seller_type: 'professional' | 'individual';
  usage_type: 'personal' | 'professional';
  product_type: 'physical' | 'digital';
  purchase_date: string;
  defect_exists: boolean;
  within_warranty: boolean;
}

export type EligibilityResult =
  | 'eligible'
  | 'ineligible_seller'
  | 'ineligible_usage'
  | 'ineligible_time'
  | 'no_defect';

// === HOOKS ET UTILITAIRES ===

export interface UseFormOptions {
  autosave?: boolean;
  autosaveDelay?: number;
  validation?: boolean;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'number' | 'textarea' | 'select' | 'checkbox';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    required?: boolean;
    email?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}

// === CONSTANTES ===

export const DEFECT_TYPE_LABELS: Record<DefectType, string> = {
  malfunction: 'Panne / Dysfonctionnement',
  missing_feature: 'Fonctionnalité manquante',
  quality: 'Qualité insuffisante',
  description: 'Non conforme à la description',
  delivery_delay: 'Retard de livraison',
  other: 'Autre défaut de conformité',
};

export const REQUESTED_ACTION_LABELS: Record<RequestedAction, string> = {
  repair: 'Réparation gratuite',
  replacement: 'Remplacement',
  refund: 'Remboursement',
};

export const FORMULA_CONFIG: Record<FormulaType, Formula> = {
  free: {
    type: 'free',
    name: 'Gratuite',
    price: 0,
    features: [
      'Lettre de mise en demeure',
      'Articles de loi pertinents',
      'Format texte à imprimer',
      'Signature manuelle',
    ],
  },
  pdf: {
    type: 'pdf',
    name: 'PDF Premium',
    price: 2.99,
    features: [
      'Tout de la version gratuite',
      'PDF professionnel avec logo',
      'Signature électronique',
      'Support email illimité',
    ],
    popular: true,
  },
  complete: {
    type: 'complete',
    name: 'Complète',
    price: 12.99,
    features: [
      'Tout de la version PDF',
      'Envoi en recommandé',
      'Suivi de livraison',
      "Preuve juridique d'envoi",
    ],
  },
};

// === ARTICLES JURIDIQUES ===

export const LEGAL_ARTICLES = {
  conformity_obligation: 'L.217-3',
  conformity_criteria: 'L.217-5',
  warranty_duration: 'L.217-7',
  consumer_remedies: 'L.217-9',
  free_remedies: 'L.217-14',
  digital_content: 'L.224-25-12',
} as const;

// === VALIDATION HELPERS ===

export const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(?:(?:\+33|0)[1-9](?:[0-9]{8}))$/,
  postalCode: /^[0-9]{5}$/,
  siret: /^[0-9]{14}$/,
} as const;

// === API ENDPOINTS ===

export const API_ENDPOINTS = {
  // Form drafts
  getDraft: (formSlug: string) => `/api/v1/form-drafts/${formSlug}`,
  autosave: (formSlug: string) => `/api/v1/form-drafts/${formSlug}/autosave`,
  submitForm: (formSlug: string) => `/api/v1/form-drafts/${formSlug}/submit`,

  // Letters
  getLetter: (letterId: string) => `/api/v1/letters/${letterId}`,
  previewBasic: '/api/v1/letters/preview-basic',
  generatePDF: '/api/v1/letters/generate-pdf',
  completeService: '/api/v1/letters/complete-service',

  // Health
  health: '/api/v1/health',
} as const;
