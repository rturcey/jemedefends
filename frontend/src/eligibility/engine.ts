// src/eligibility/engine.ts - VERSION CORRIGÉE
import type { EligibilityData } from '@/types/eligibility';

export type EligibilityReason =
  | 'seller_not_professional'
  | 'not_consumer'
  | 'territory_outside'
  | 'no_defect'
  | 'timing_too_old';

export type EligibilityTiming = {
  monthsSincePurchase?: number;
  withinTwoYears?: boolean; // <= 24 mois (biens)
  presumptionSellerBurden?: boolean; // true si <= 12 mois (si connu)
};

export type EligibilityResult = {
  isEligible: boolean;
  reasons?: EligibilityReason[];
  timing?: EligibilityTiming;
};

// FONCTION CORRIGÉE AVEC VÉRIFICATIONS DE SÉCURITÉ
export function calculateEligibilityEngine(
  data: EligibilityData | undefined | null,
): EligibilityResult {
  // VÉRIFICATION DE SÉCURITÉ : Si data est undefined/null, on retourne non éligible
  if (!data) {
    return {
      isEligible: false,
      reasons: ['seller_not_professional', 'not_consumer', 'territory_outside', 'no_defect'],
      timing: {},
    };
  }

  const reasons: EligibilityReason[] = [];

  // VÉRIFICATIONS SÉCURISÉES AVEC VALEURS PAR DÉFAUT
  const seller = data.seller ?? data.sellerType;
  const sellerIsProfessional = seller === 'professional';
  const isConsumer = data.usage === 'personal';
  const isEUorDirectedToFR = data.territory === 'eu';
  const defect = data.defect ?? (typeof data.hasDefect === 'boolean' ? (data.hasDefect ? 'yes' : 'no') : undefined);
  const timingAnswer = data.timing ?? data.timingAnswer ?? (typeof data.withinTwoYears === 'boolean'
    ? data.withinTwoYears
      ? 'ok'
      : 'ko'
    : undefined);

  // Évaluation des critères d'éligibilité
  if (!sellerIsProfessional) reasons.push('seller_not_professional');
  if (!isConsumer) reasons.push('not_consumer');
  if (!isEUorDirectedToFR) reasons.push('territory_outside');
  if (defect !== 'yes') reasons.push('no_defect');

  let timing: EligibilityTiming = {};

  if (timingAnswer === 'ok') {
    timing.withinTwoYears = true;
    timing.presumptionSellerBurden = true;
  }
  if (timingAnswer === 'ko') {
    timing.withinTwoYears = false;
    reasons.push('timing_too_old');
  }
  if (timingAnswer === 'during_contract') {
    timing.withinTwoYears = true;
  }
  if (timingAnswer === 'after_contract') {
    timing.withinTwoYears = false;
    reasons.push('timing_too_old');
  }

  const isEligible = reasons.length === 0;
  return { isEligible, reasons: isEligible ? undefined : reasons, timing };
}

// FONCTION UTILITAIRE POUR VALIDER LES DONNÉES AVANT CALCUL
export function validateEligibilityData(data: Partial<EligibilityData>): {
  isValid: boolean;
  missingFields: string[];
} {
  const requiredFields: (keyof EligibilityData)[] = [
    'seller',
    'sellerType',
    'usage',
    'itemCategory',
    'itemDetail',
    'territory',
    'defect',
  ];

  const missingFields = requiredFields.filter(
    field => data[field] === undefined || data[field] === null,
  );

  // Timing requis
  const timingValue = data.timing ?? data.timingAnswer ?? data.withinTwoYears;
  if (timingValue === undefined) {
    missingFields.push('timing');
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}
