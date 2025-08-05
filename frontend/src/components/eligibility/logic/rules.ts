import type { Answers, EligibilityResult } from './types';

function evaluateEligibility(a: Answers): EligibilityResult {
  const reasons: string[] = [];

  // Vente entre particuliers
  if (a.vendeur === 'particulier') {
    return {
      verdict: 'non_eligible',
      reasons: ["La garantie légale ne s'applique pas aux ventes entre particuliers."],
      hardIneligible: true,
    };
  }

  // Usage non personnel
  if (a.usagePersonnel === 'non') {
    return {
      verdict: 'non_eligible',
      reasons: ["La garantie s'applique uniquement aux consommateurs (usage privé)."],
      hardIneligible: true,
    };
  }

  // Service numérique sans défaut
  if (a.nature === 'numerique' && a.defautNumerique === 'non') {
    return {
      verdict: 'non_eligible',
      reasons: ['Le contenu/service numérique ne présente pas de défaut réel.'],
      hardIneligible: true,
    };
  }

  // Vendeur hors UE
  if (a.vendeurUE === 'non') {
    return {
      verdict: 'non_eligible',
      reasons: [
        "La garantie s'applique uniquement si le vendeur est UE/EEE ou cible le marché FR.",
      ],
      hardIneligible: true,
    };
  }

  // Délai dépassé
  if (a.delai === 'hors') {
    return {
      verdict: 'non_eligible',
      reasons: ['Le délai légal est dépassé.'],
      hardIneligible: true,
    };
  }

  // Aucun défaut
  if (a.defaut === 'aucun') {
    return {
      verdict: 'non_eligible',
      reasons: ["Aucun défaut constaté ne justifie l'application de la garantie légale."],
      hardIneligible: true,
    };
  }

  // Vérifier que toutes les questions obligatoires sont remplies
  const requiredFields: (keyof Answers)[] = [
    'vendeur',
    'usagePersonnel',
    'nature',
    'vendeurUE',
    'delai',
    'defaut',
  ];

  // Ajouter les champs conditionnels
  if (a.nature === 'bien') {
    requiredFields.push('etatBien');
  }
  if (a.nature === 'numerique') {
    requiredFields.push('defautNumerique');
  }

  const missingFields = requiredFields.filter(field => !a[field]);
  if (missingFields.length > 0) {
    return {
      verdict: 'incertain',
      reasons: ['Veuillez compléter toutes les questions pour obtenir un résultat.'],
    };
  }

  // Si tout est OK → éligible
  reasons.push('Votre situation relève a priori de la garantie légale de conformité.');
  return { verdict: 'eligible', reasons };
}

export default evaluateEligibility;
