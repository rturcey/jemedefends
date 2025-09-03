// src/constants/eligibilitySteps.ts
import type { EligibilityStep } from '@/types/eligibility';
import { LEGAL } from '@/constants/legal';

export const ELIGIBILITY_STEPS: EligibilityStep[] = [
  {
    id: 'seller',
    title: 'Type de vendeur',
    question: "Avez-vous acheté auprès d'un vendeur professionnel ?",
    description: "La garantie légale s'applique uniquement aux achats pro ↔ consommateur",
    legal: {
      article: LEGAL.L217_3.ref,
      explanation: LEGAL.L217_3.summary,
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
      article: LEGAL.ARTICLE_LIMINAIRE.ref,
      explanation: LEGAL.ARTICLE_LIMINAIRE.summary,
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
      article: `${LEGAL.L217_3.ref} ; ${LEGAL.L224_25_12.ref}`,
      explanation: `${LEGAL.L217_3.summary} ${LEGAL.L224_25_12.summary}`,
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
        'Le Code conso s’applique lorsque le contrat concerne un consommateur en France et que l’activité du pro est dirigée vers la France (langue/€, livraison, SAV…).',
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
      'Biens : éligible jusqu’à 24 mois. La présomption (charge de la preuve au vendeur) joue pendant 12 mois — au-delà, vous restez éligible mais la présomption est moins favorable.',
    legal: {
      article: `${LEGAL.L217_3.ref} ; ${LEGAL.L217_7.ref}`,
      explanation: `Biens : délai de 2 ans (${LEGAL.L217_3.ref}). Présomption d’antériorité jusqu’à 12 mois pour l’occasion (${LEGAL.L217_7.ref}).`,
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
      article: LEGAL.L217_5.ref,
      explanation: LEGAL.L217_5.summary,
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
