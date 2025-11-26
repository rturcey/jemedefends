// src/eligibility/engine.ts - VERSION CORRIGÉE
import type {EligibilityData} from '@/types/eligibility';

export type EligibilityReason =
    | 'seller_not_professional'
    | 'not_consumer_use'
    | 'territory_out_of_scope'
    | 'no_defect'
    | 'time_barred_2y'
    | 'subscription_ended';

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
            reasons: [
                'seller_not_professional',
                'not_consumer_use',
                'territory_out_of_scope',
                'no_defect',
            ],
            timing: {},
        };
    }

    const reasons: EligibilityReason[] = [];

    // Normalisation des nouvelles clés (avec compat héritée)
    const itemCategory = data.itemCategory ?? (data.productType === 'digital' ? 'digital_service' : data.productType === 'physical' ? 'good' : undefined);
    const itemDetail = data.itemDetail;
    const timingAnswer = data.timingAnswer ?? (typeof data.withinTwoYears === 'boolean' ? (data.withinTwoYears ? 'ok' : 'ko') : undefined);

    // VÉRIFICATIONS SÉCURISÉES AVEC VALEURS PAR DÉFAUT
    const sellerIsProfessional = data.sellerType === 'professional';
    const isConsumer = data.usage === 'personal';
    const isEUorDirectedToFR = data.territory === 'eu';
    const hasDefect = data.hasDefect === true || data.hasDefect === 'yes';

    if (!sellerIsProfessional) reasons.push('seller_not_professional');
    if (!isConsumer) reasons.push('not_consumer_use');
    if (!isEUorDirectedToFR) reasons.push('territory_out_of_scope');
    if (!hasDefect) reasons.push('no_defect');

    let timing: EligibilityTiming = {};

    // Gestion du timing avec les nouvelles réponses unifiées
    if (timingAnswer) {
        const isSubscription = itemCategory === 'digital_service' && itemDetail === 'subscription';

        if (isSubscription) {
            timing.withinTwoYears = timingAnswer === 'during_contract';
            if (timingAnswer === 'after_contract') reasons.push('subscription_ended');
        } else {
            timing.withinTwoYears = timingAnswer === 'ok';
            if (timingAnswer === 'ko') reasons.push('time_barred_2y');
        }

        if (itemCategory === 'good') {
            // Présomption : 24 mois (neuf) / 12 mois (occasion) si dans le délai
            if (timing.withinTwoYears) {
                timing.presumptionSellerBurden = itemDetail === 'new' ? true : itemDetail === 'used' ? false : undefined;
            } else {
                timing.presumptionSellerBurden = undefined;
            }
        }
    }

    const isEligible = reasons.length === 0;
    return {isEligible, reasons: isEligible ? undefined : reasons, timing};
}

// FONCTION UTILITAIRE POUR VALIDER LES DONNÉES AVANT CALCUL
export function validateEligibilityData(data: Partial<EligibilityData>): {
    isValid: boolean;
    missingFields: string[];
} {
    const missingFields: string[] = [];

    if (!data.sellerType) missingFields.push('sellerType');
    if (!data.usage) missingFields.push('usage');
    if (!data.territory) missingFields.push('territory');
    if (data.hasDefect === undefined || data.hasDefect === null) missingFields.push('hasDefect');

    // Nouveau découpage : itemCategory + itemDetail sont attendus
    if (!data.itemCategory) missingFields.push('itemCategory');
    if (!data.itemDetail) missingFields.push('itemDetail');

    // Timing : soit timingAnswer, soit l'ancien withinTwoYears
    const hasTiming =
        data.timingAnswer !== undefined && data.timingAnswer !== null
        || typeof data.withinTwoYears === 'boolean';
    if (!hasTiming) missingFields.push('timingAnswer');

    return {
        isValid: missingFields.length === 0,
        missingFields,
    };
}
