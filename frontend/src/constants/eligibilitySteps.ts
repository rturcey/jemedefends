// src/constants/eligibilitySteps.ts
import type { EligibilityStep } from '@/types/eligibility';

export const ELIGIBILITY_STEPS: EligibilityStep[] = [
  {
    id: 'seller',
    title: 'Type de vendeur',
    question: "Avez-vous acheté auprès d'un vendeur professionnel ?",
    description: "La garantie légale s'applique uniquement aux achats pro ↔ consommateur",
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
          description: "La garantie légale ne s'applique pas",
        },
      ],
    },
  },
  {
    id: 'usage',
    title: 'Usage du produit',
    question: 'Achat pour un usage personnel (consommateur) ?',
    description: 'La garantie protège les achats destinés à un usage privé',
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
    description: 'Biens matériels et, selon les cas, contenus/services numériques',
    legal: {
      article: 'L.217-3 ; L.224-25-12',
      explanation:
        'Biens (L.217-3) et biens comportant des éléments numériques / contenus & services numériques (L.224-25-12 et s.).',
      examples: ['📱 Bien : smartphone, électroménager', '💻 Numérique : app, SaaS, streaming'],
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
    description: 'Indices : site en français, €, livraison France, SAV FR',
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
    question: 'Votre achat a-t-il moins de 2 ans ?',
    description:
      'Biens : éligible jusqu’à 24 mois. La présomption (charge de la preuve au vendeur) joue 24 mois (12 mois pour un bien d’occasion).',
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
        { value: 'lt_2y', label: 'Moins de 2 ans' },
        { value: 'gte_2y', label: 'Plus de 2 ans' },
      ],
    },
  },
  {
    id: 'defect',
    title: 'Nature du problème',
    question: 'Le produit présente-t-il un défaut de conformité ?',
    description: 'Panne, dysfonctionnement, non-conformité aux spécifications',
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
