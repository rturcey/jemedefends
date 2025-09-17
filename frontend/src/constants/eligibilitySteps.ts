// src/constants/eligibilitySteps.ts
import type { EligibilityStep } from '@/types/eligibility';

export const ELIGIBILITY_STEPS: EligibilityStep[] = [
  {
    id: 'seller',
    title: 'Type de vendeur',
    question: "Avez-vous acheté auprès d'un vendeur professionnel ?",
    description: "La garantie légale s'applique uniquement aux achats pro ↔ consommateur.",
    legal: {
      article: 'L.217-3',
      explanation:
        'Garantie légale de conformité pour les ventes entre un professionnel et un consommateur.',
      examples: [
        '✅ Darty, Fnac, Apple Store',
        '✅ Vendeur pro sur Amazon',
        '❌ Particulier ↔ particulier',
      ],
    },
    ui: {
      type: 'radio',
      required: true,
      options: [
        {
          value: 'professional',
          label: 'Acheté à un professionnel',
          description: 'Magasin, e-commerce, marketplace pro',
        },
        {
          value: 'individual',
          label: 'Vente entre particuliers',
          description: 'ou aux enchères publiques',
        },
      ],
    },
  },
  {
    id: 'usage',
    title: 'Usage du produit',
    question: 'Achat pour un usage personnel (consommateur) ?',
    description: 'La garantie protège les achats destinés à un usage privé.',
    legal: {
      article: 'Article liminaire (Code de la consommation)',
      explanation:
        'Le “consommateur” est une personne physique agissant à des fins non professionnelles.',
      examples: [
        '✅ Usage domestique',
        '✅ Cadeau à un proche',
        '❌ Achat pro / réutilisation commerciale',
      ],
    },
    ui: {
      type: 'radio',
      required: true,
      options: [
        { value: 'personal', label: 'Usage personnel (consommateur)' },
        { value: 'professional', label: 'Usage professionnel' },
      ],
    },
  },
  {
    id: 'product',
    title: 'Type de produit',
    question: 'Quel est le type de produit ?',
    description:
      'Biens matériels et, selon les cas, contenus/services numériques. Sont exclus les biens immatériels purs (hors numérique), comme les travaux.',
    legal: {
      article: 'L.217-3 ; L.224-25-12',
      explanation:
        'Biens (L.217-3) et biens comportant des éléments numériques / contenus & services numériques (L.224-25-12 et s.).',
      examples: [
        '✅ Bien : smartphone, véhicule, électroménager, vêtement, etc.',
        '✅ Numérique : app, SaaS, streaming, abonnement, etc.',
        '❌ Travaux, électricité/gaz non consignés, etc.',

        '📱 Bien : smartphone, électroménager',
        '💻 Numérique : app, SaaS, streaming',
      ],
    },
    ui: {
      type: 'radio',
      required: true,
      options: [
        { value: 'physical', label: 'Bien matériel' },
        { value: 'digital', label: 'Contenu ou service numérique' },
      ],
    },
  },
  {
    id: 'territory',
    title: 'Zone géographique',
    question: 'Vendeur UE/EEE ou activité dirigée vers la France ?',
    description: 'Indices : site en français, €, livraison France, SAV FR.',
    legal: {
      article: 'Conditions d’application territoriales (appréciation par indices)',
      explanation:
        'Le Code conso s’applique quand le contrat vise un consommateur en France et que l’activité du pro est dirigée vers la France (langue/€, livraison, SAV…).',
      examples: ['✅ Site en français + €', '✅ Livraison France', '✅ SAV FR'],
    },
    ui: {
      type: 'radio',
      required: true,
      options: [
        { value: 'eu', label: 'UE/EEE ou activité dirigée vers la France' },
        { value: 'non_eu', label: 'Hors UE/EEE (sans indices FR suffisants)' },
      ],
    },
  },
  {
    id: 'timing',
    title: "Ancienneté de l'achat",
    question: "Votre achat a-t-il moins de 2 ans (1 an pour l'occasion) ?",
    description:
      'Biens neufs : garantie 24 mois, présomption 24 mois (au vendeur de prouver la conformité du produit). ' +
      'Biens d’occasion : garantie 24 mois, mais présomption limitée à 12 mois (après, charge à l’acheteur). ' +
      'Contenus/services numériques : garantie 2 ans (fourniture ponctuelle) ou toute la durée du contrat (abonnement), présomption valable pendant toute cette période.',
    legal: {
      article: 'L.217-3 ; L.217-7',
      explanation:
        'Délai d’action de 2 ans (L.217-3). Présomption d’antériorité des défauts : 24 mois (12 mois pour l’occasion) — L.217-7.',
      examples: ['📅 < 2 ans : éligible', '📅 > 2 ans : trop tard (biens)'],
    },
    ui: {
      type: 'radio',
      required: true,
      options: [
        { value: 'lt_2y', label: 'Oui' },
        { value: 'gte_2y', label: 'Non' },
      ],
    },
  },
  {
    id: 'defect',
    title: 'Nature du problème',
    question: 'Le produit présente-t-il un défaut de conformité ?',
    description:
      'Un défaut de conformité correspond à une panne, un dysfonctionnement ou une caractéristique non conforme aux spécifications prévues. Il ne doit pas résulter d’une mauvaise utilisation, d’une négligence ou d’une intervention de votre part.',
    legal: {
      article: 'L.217-5',
      explanation:
        'Critères de conformité : aux stipulations du contrat (usage spécial, accessoires, mises à jour) et critères objectifs (qualités attendues, déclarations publiques, etc.).',
      examples: ['❌ Panne prématurée', '❌ Fonctionnalité manquante', '❌ Qualité insuffisante'],
    },
    ui: {
      type: 'radio',
      required: true,
      options: [
        { value: 'yes', label: 'Oui, défaut de conformité' },
        { value: 'no', label: 'Non, pas de défaut' },
      ],
    },
  },
];
