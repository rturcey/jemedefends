// src/types/eligibility.ts

export type StepId = 'seller' | 'usage' | 'product' | 'territory' | 'timing' | 'defect';

export type RadioUI = {
  type: 'radio';
  required?: boolean;
  options: { value: string; label: string; description?: string }[];
};
export type DateUI = { type: 'date'; required?: boolean };
export type StepUI = RadioUI | DateUI;

export interface StepLegal {
  article: string;
  explanation: string;
  examples?: string[];
}

export interface EligibilityStep {
  id: StepId;
  title: string;
  question: string;
  description: string;
  legal: StepLegal;
  ui: StepUI;
}

export interface EligibilityData {
  sellerType?: 'professional' | 'individual';
  usage?: 'personal' | 'professional';
  productType?: 'physical' | 'digital';
  territory?: 'eu' | 'non_eu';

  // NEW: on demande directement "<= 2 ans ?"
  withinTwoYears?: boolean;

  // On conserve purchaseDate (facultatif) si tu veux revenir à une date plus tard
  purchaseDate?: Date;

  hasDefect?: boolean;
}

export type StepValidationType = 'error' | 'warning' | 'info' | 'success';
export interface StepValidation {
  isValid: boolean;
  message?: string;
  type?: StepValidationType;
}
