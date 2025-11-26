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

// === TYPES IA REFORMULATION ===

export type ReformulationType = 'corrected' | 'reformulated';

export interface ReformulationRequest {
  text: string;
  type: ReformulationType;
  context?: string;
}

export interface ReformulationResponse {
  original_text: string;
  reformulated_text: string;
  type: ReformulationType;
  success: boolean;
  error?: string;
}

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

  // IA
  reformulateText: '/api/v1/letters/reformulate-text',
  normalizeProductName: '/api/v1/letters/normalize-product-name', // NOUVEAU

  // Health
  health: '/api/v1/health',
} as const;
