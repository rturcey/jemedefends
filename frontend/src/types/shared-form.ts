// src/types/shared-form.ts - Types harmonisés pour les formulaires

import { ReactNode } from 'react';

// ============================================================================
// TYPES DE BASE PARTAGÉS
// ============================================================================

export type FormVariant = 'eligibility' | 'form' | 'payment';
export type FormSize = 'sm' | 'md' | 'lg';
export type FormValidationType = 'error' | 'warning' | 'success' | 'info';

// ============================================================================
// STEP INDICATOR
// ============================================================================

export interface StepData {
  id: string;
  title: string;
  description: string;
  icon?: ReactNode;
  legalRef?: string;
  completed?: boolean;
  active?: boolean;
}

export interface StepIndicatorConfig {
  showLabels?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
  animated?: boolean;
}

// ============================================================================
// NAVIGATION
// ============================================================================

export interface NavigationState {
  canGoNext: boolean;
  canGoPrev: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
  currentStep: number;
  totalSteps: number;
}

export interface NavigationCallbacks {
  onNext: () => void;
  onPrev: () => void;
  onSubmit?: () => Promise<void>;
  onCancel?: () => void;
}

export interface MobileNavigationProps extends NavigationState, NavigationCallbacks {
  isSubmitting?: boolean;
  variant?: FormVariant;
  submitLabel?: string;
  nextLabel?: string;
  prevLabel?: string;
}

// ============================================================================
// VALIDATION
// ============================================================================

export interface ValidationMessage {
  type: FormValidationType;
  message: string;
  field?: string;
  code?: string;
}

export interface ValidationState {
  isValid: boolean;
  messages: ValidationMessage[];
  touchedFields: Set<string>;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

// ============================================================================
// FORM CONTAINER
// ============================================================================

export interface FormContainerConfig {
  variant: FormVariant;
  showTrustIndicators?: boolean;
  showProgress?: boolean;
  showStepIndicator?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

// ============================================================================
// TRUST INDICATORS
// ============================================================================

export interface TrustIndicator {
  icon: ReactNode;
  label: string;
  color?: string;
  tooltip?: string;
}

export interface TrustIndicatorsConfig {
  variant: 'eligibility' | 'form' | 'payment' | 'custom';
  size: FormSize;
  layout: 'horizontal' | 'grid' | 'vertical';
  showBackground: boolean;
  indicators?: TrustIndicator[];
}

// ============================================================================
// RADIO GROUP
// ============================================================================

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: ReactNode;
  badge?: string;
}

export interface RadioGroupConfig {
  variant: 'default' | 'compact' | 'card';
  size: FormSize;
  columns?: 1 | 2 | 3;
  required?: boolean;
  disabled?: boolean;
}

// ============================================================================
// STEP HEADER
// ============================================================================

export interface StepHeaderConfig {
  showStepNumber?: boolean;
  showProgress?: boolean;
  showLegalRef?: boolean;
  variant?: 'default' | 'compact' | 'minimal';
}

// ============================================================================
// FORM EVENTS
// ============================================================================

export interface FormEventCallbacks {
  onStepChange?: (step: number) => void;
  onFieldChange?: (field: string, value: any) => void;
  onValidationChange?: (validation: ValidationState) => void;
  onSubmitStart?: () => void;
  onSubmitSuccess?: (data: any) => void;
  onSubmitError?: (error: Error) => void;
}

// ============================================================================
// ANIMATION CONFIGS
// ============================================================================

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  easing?: string;
  disabled?: boolean;
}

export interface StepTransitionConfig extends AnimationConfig {
  direction?: 'forward' | 'backward';
  type?: 'slide' | 'fade' | 'scale';
}

// ============================================================================
// RESPONSIVE BREAKPOINTS
// ============================================================================

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ResponsiveConfig {
  mobile?: any;
  tablet?: any;
  desktop?: any;
}

// ============================================================================
// ANALYTICS
// ============================================================================

export interface FormAnalyticsEvents {
  form_started: { formType: FormVariant };
  step_completed: { step: number; formType: FormVariant };
  form_submitted: { formType: FormVariant; duration: number };
  form_abandoned: { step: number; formType: FormVariant };
  validation_error: { field: string; error: string };
}

// ============================================================================
// UTILITÉ
// ============================================================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type FormConfig = DeepPartial<{
  container: FormContainerConfig;
  navigation: MobileNavigationProps;
  stepIndicator: StepIndicatorConfig;
  trustIndicators: TrustIndicatorsConfig;
  validation: ValidationState;
  animation: AnimationConfig;
  analytics: boolean;
}>;
