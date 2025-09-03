// src/eligibility/engine.ts
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

function monthsBetween(from?: Date, to = new Date()): number | undefined {
  if (!from) return undefined;
  const ms = to.getTime() - from.getTime();
  if (Number.isNaN(ms)) return undefined;
  const days = ms / (1000 * 60 * 60 * 24);
  return Math.floor(days / 30.4375);
}

export function calculateEligibilityEngine(data: EligibilityData): EligibilityResult {
  const reasons: EligibilityReason[] = [];

  const sellerIsProfessional = data.sellerType === 'professional';
  const isConsumer = data.usage === 'personal';
  const isDigital = data.productType === 'digital';
  const isEUorDirectedToFR = data.territory === 'eu';
  const hasDefect = data.hasDefect === true;

  if (!sellerIsProfessional) reasons.push('seller_not_professional');
  if (!isConsumer) reasons.push('not_consumer');
  if (!isEUorDirectedToFR) reasons.push('territory_outside');
  if (!hasDefect) reasons.push('no_defect');

  let timing: EligibilityTiming = {};

  if (!isDigital) {
    // Priorité à withinTwoYears si l’utilisateur a répondu "±2 ans"
    if (typeof data.withinTwoYears === 'boolean') {
      timing.withinTwoYears = data.withinTwoYears;
      // On ne peut pas déduire la présomption sans mois exacts -> undefined
      if (data.withinTwoYears === false) reasons.push('timing_too_old');
    } else {
      // fallback sur une vraie date si disponible
      const months = monthsBetween(data.purchaseDate);
      const withinTwoYears = months !== undefined ? months <= 24 : undefined;
      const presumptionSellerBurden = months !== undefined ? months <= 12 : undefined;

      timing = { monthsSincePurchase: months, withinTwoYears, presumptionSellerBurden };
      if (withinTwoYears === false) reasons.push('timing_too_old');
    }
  }

  const isEligible = reasons.length === 0;
  return { isEligible, reasons: isEligible ? undefined : reasons, timing };
}
