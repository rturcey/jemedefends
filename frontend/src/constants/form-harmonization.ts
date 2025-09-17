// src/constants/form-harmonization.ts - Constantes pour l'harmonisation

import { User, ShoppingBag, Globe, Clock, Bug, Smartphone, Building, ShoppingCart } from 'lucide-react';
import type { TrustIndicator, AnimationConfig, FormConfig } from '@/types/shared-form';

// ============================================================================
// COULEURS HARMONISÉES
// ============================================================================

export const FORM_COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
} as const;

// ============================================================================
// ANIMATIONS STANDARDISÉES
// ============================================================================

export const ANIMATION_PRESETS: Record<string, AnimationConfig> = {
  instant: { duration: 0, disabled: true },
  fast: { duration: 0.15, easing: 'easeOut' },
  normal: { duration: 0.3, easing: 'easeOut' },
  slow: { duration: 0.5, easing: 'easeInOut' },
  bouncy: { duration: 0.4, easing: 'spring' },
} as const;

export const STEP_TRANSITIONS = {
  slide: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  },
} as const;

// ============================================================================
// ICÔNES PAR CONTEXTE
// ============================================================================

export const ELIGIBILITY_STEP_ICONS = {
  seller: <User className="w-5 h-5" />,
  usage: <ShoppingBag className="w-5 h-5" />,
  product: <Smartphone className="w-5 h-5" />,
  territory: <Globe className="w-5 h-5" />,
  timing: <Clock className="w-5 h-5" />,
  defect: <Bug className="w-5 h-5" />,
} as const;

export const FORM_STEP_ICONS = {
  buyer: <User className="w-5 h-5" />,
  seller: <Building className="w-5 h-5" />,
  purchase: <ShoppingCart className="w-5 h-5" />,
  problem: <Bug className="w-5 h-5" />,
} as const;

// ============================================================================
// TRUST INDICATORS PRÉDÉFINIS
// ============================================================================

export const TRUST_INDICATORS_PRESETS: Record<string, TrustIndicator[]> = {
  eligibility: [
    { 
      icon: <span className="text-green-600">✓</span>,
      label: '100% gratuit',
      color: 'text-green-700'
    },
    {
      icon: <Clock className="w-4 h-4" />,
      label: '2 minutes',
      color: 'text-blue-700'
    },
    {
      icon: <span className="text-green-600">🔒</span>,
      label: 'Confidentiel',
      color: 'text-green-700'
    },
  ],
  form: [
    {
      icon: <span className="text-green-600">🇫🇷</span>,
      label: 'Hébergement français',
      color: 'text-green-700'
    },
    {
      icon: <span className="text-green-600">🔒</span>,
      label: 'RGPD compliant',
      color: 'text-green-700'
    },
    {
      icon: <span className="text-green-600">⚖️</span>,
      label: 'Articles vérifiés',
      color: 'text-green-700'
    },
  ],
  payment: [
    {
      icon: <span className="text-green-600">🔐</span>,
      label: 'Paiement sécurisé',
      color: 'text-green-700'
    },
    {
      icon: <span className="text-blue-600">🇫🇷</span>,
      label: 'Stancer France',
      color: 'text-blue-700'
    },
    {
      icon: <span className="text-green-600">🔒</span>,
      label: 'Données protégées',
      color: 'text-green-700'
    },
  ],
} as const;

// ============================================================================
// CONFIGURATIONS PAR DÉFAUT
// ============================================================================

export const DEFAULT_FORM_CONFIGS: Record<string, FormConfig> = {
  eligibility: {
    container: {
      variant: 'eligibility',
      showTrustIndicators: true,
      showStepIndicator: true,
    },
    stepIndicator: {
      variant: 'default',
      showLabels: false,
      animated: true,
    },
    trustIndicators: {
      variant: 'eligibility',
      size: 'md',
      layout: 'horizontal',
      showBackground: true,
    },
    animation: ANIMATION_PRESETS.normal,
    analytics: true,
  },
  form: {
    container: {
      variant: 'form',
      showTrustIndicators: true,
      showProgress: true,
    },
    stepIndicator: {
      variant: 'default',
      showLabels: false,
      animated: true,
    },
    trustIndicators: {
      variant: 'form',
      size: 'md',
      layout: 'horizontal',
      showBackground: true,
    },
    animation: ANIMATION_PRESETS.normal,
    analytics: true,
  },
} as const;

// ============================================================================
// BREAKPOINTS HARMONISÉS
// ============================================================================

export const FORM_BREAKPOINTS = {
  xs: '320px',
  sm: '640px',   // Mobile → Tablet
  md: '768px',   // Tablet → Desktop
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large Desktop
} as const;

// ============================================================================
// TOUCH TARGETS
// ============================================================================

export const TOUCH_TARGETS = {
  minimum: '44px',    // Minimum recommandé
  comfortable: '48px', // Confortable
  large: '56px',      // Large pour actions importantes
} as const;

// ============================================================================
// MESSAGES DE VALIDATION
// ============================================================================

export const VALIDATION_MESSAGES = {
  required: 'Ce champ est obligatoire',
  email: 'Format d\'email invalide',
  minLength: (min: number) => `Minimum ${min} caractères requis`,
  maxLength: (max: number) => `Maximum ${max} caractères autorisés`,
  pattern: 'Format invalide',
  custom: 'Valeur invalide',
} as const;

// ============================================================================
// DURÉES D'ANIMATION RECOMMANDÉES
// ============================================================================

export const ANIMATION_DURATIONS = {
  micro: 150,        // Hover effects, button states
  short: 250,        // UI feedback, form validation
  medium: 350,       // Step transitions, modal open/close
  long: 500,         // Page transitions, complex animations
  extra: 750,        // Special effects, loading states
} as const;

// ============================================================================
// Z-INDEX HARMONISÉS
// ============================================================================

export const Z_INDEX = {
  base: 0,
  dropdown: 10,
  overlay: 20,
  modal: 30,
  navigation: 40,
  tooltip: 50,
  toast: 60,
} as const;
