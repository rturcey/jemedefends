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

function monthsBetween(from?: Date, to = new Date()): number | undefined {
  if (!from) return undefined;
  const ms = to.getTime() - from.getTime();
  if (Number.isNaN(ms)) return undefined;
  const days = ms / (1000 * 60 * 60 * 24);
  return Math.floor(days / 30.4375);
}

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
  const sellerIsProfessional = data.sellerType === 'professional';
  const isConsumer = data.usage === 'personal';
  const isDigital = data.productType === 'digital';
  const isEUorDirectedToFR = data.territory === 'eu';
  const hasDefect = data.hasDefect === 'yes';

  // Évaluation des critères d'éligibilité
  if (!sellerIsProfessional) reasons.push('seller_not_professional');
  if (!isConsumer) reasons.push('not_consumer');
  if (!isEUorDirectedToFR) reasons.push('territory_outside');
  if (!hasDefect) reasons.push('no_defect');

  let timing: EligibilityTiming = {};

  // Gestion du timing pour les biens physiques
  if (!isDigital) {
    // Priorité à withinTwoYears si l'utilisateur a répondu "±2 ans"
    if (typeof data.withinTwoYears === 'boolean') {
      timing.withinTwoYears = data.withinTwoYears;
      // On ne peut pas déduire la présomption sans mois exacts -> undefined
      if (data.withinTwoYears === false) reasons.push('timing_too_old');
    } else {
      // fallback sur une vraie date si disponible
      const months = monthsBetween(data.purchaseDate);
      const withinTwoYears = months !== undefined ? months <= 24 : undefined;
      const presumptionSellerBurden = months !== undefined ? months <= 12 : undefined;

      timing = {
        monthsSincePurchase: months,
        withinTwoYears,
        presumptionSellerBurden,
      };
      if (withinTwoYears === false) reasons.push('timing_too_old');
    }
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
    'sellerType',
    'usage',
    'productType',
    'territory',
    'hasDefect',
  ];

  const missingFields = requiredFields.filter(
    field => data[field] === undefined || data[field] === null,
  );

  // Pour les biens physiques, timing est requis
  if (data.productType === 'physical' && data.withinTwoYears === undefined && !data.purchaseDate) {
    missingFields.push('withinTwoYears or purchaseDate');
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}
