// src/constants/eligibilitySteps.ts
import type { EligibilityStep } from '@/types/eligibility';

export const ELIGIBILITY_STEPS: EligibilityStep[] = [
  {
    id: 'seller',
    title: 'Type de vendeur',
    question: "Avez-vous acheté auprès d'un vendeur professionnel ?",
    description: "La garantie légale s'applique aux achats professionnel → consommateur.",
    legal: {
      article: 'L.217-3',
      explanation:
        'Garantie légale de conformité pour les ventes entre un professionnel et un consommateur.',
      references: ['L.217-3'],
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
          icon: 'Building',
        },
        {
          value: 'individual',
          label: 'Vente entre particuliers',
          description: 'ou enchères publiques',
          icon: 'Users',
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
      references: ['LIMINAIRE'],
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
        { value: 'personal', label: 'Usage personnel (consommateur)', icon: 'Heart' },
        { value: 'professional', label: 'Usage professionnel', icon: 'Briefcase' },
      ],
    },
  },
  // Étape 3 : Catégorie (bien vs service numérique)
  {
    id: 'itemCategory',
    title: "Catégorie de l'achat",
    question: 'Votre achat concerne-t-il un bien matériel, ou un contenu/service numérique ?',
    description: 'Cette distinction détermine les règles de délai applicables.',
    legal: {
      article: 'L.217-3 ; L.224-25-12 et s.',
      explanation:
        'Biens matériels (L.217-3) ; biens comportant un élément numérique / contenus & services numériques (L.224-25-12 et suivants).',
      references: ['L.217-3', 'L.224-25-12'],
      examples: [
        'Bien : smartphone, électroménager, voiture',
        'Numérique : application, SaaS, streaming',
      ],
    },
    ui: {
      type: 'radio',
      required: true,
      options: [
        {
          value: 'good',
          label: 'Bien matériel',
          description: 'Objet physique, reconditionné inclus',
          icon: 'Archive',
        },
        {
          value: 'digital_service',
          label: 'Contenu / Service numérique',
          description: 'Appli, SaaS, plateforme de streaming…',
          icon: 'Laptop',
        },
      ],
    },
  },
  // Étape 4 : Précision (neuf/occasion OU ponctuel/abonnement) — contenu dynamique
  {
    id: 'itemDetail',
    title: 'Précision',
    question: 'Précisez votre type d’achat',
    description: 'Nous adaptons ensuite la question de délai.',
    legal: {
      article: 'L.217-3 ; L.217-7 ; L.224-25-12',
      explanation:
        'Biens : neuf vs occasion (présomption 24/12 mois). Numérique : ponctuel vs abonnement.',
      references: ['L.217-3', 'L.217-7', 'L.224-25-12'],
      examples: ['Neuf / Occasion', 'Ponctuel / Abonnement'],
    },
    ui: {
      type: 'radio',
      required: true,
      options: [
        { value: 'new', label: 'Produit neuf', icon: 'Star' }, // écrasé si service numérique
        { value: 'used', label: "Produit d'occasion / reconditionné", icon: 'RefreshCw' },
      ],
    },
    dynamic: data => {
      if (data.itemCategory === 'good') {
        return {
          title: 'État du bien',
          question: "Votre bien est-il neuf ou d'occasion/reconditionné ?",
          description:
            "La présomption du défaut est de 24 mois pour le neuf, 12 mois pour l'occasion (L.217-7).",
          ui: {
            type: 'radio',
            required: true,
            options: [
              { value: 'new', label: 'Produit neuf', icon: 'Star' },
              { value: 'used', label: "Produit d'occasion / reconditionné", icon: 'RefreshCw' },
            ],
          },
        };
      }
      return {
        title: 'Type de service',
        question: 'Votre service est-il fourni une fois (ponctuel) ou en continu (abonnement) ?',
        description:
          'Ponctuel : action dans les 2 ans. Abonnement : obligation de conformité pendant toute la durée du contrat.',
        ui: {
            type: 'radio',
            required: true,
            options: [
              {
                value: 'one_off',
                label: 'Fourniture ponctuelle',
                description: 'ex. achat unique de contenu',
                icon: 'Download',
              },
              {
                value: 'subscription',
                label: 'Service par abonnement',
                description: 'ex. SaaS, streaming',
                icon: 'RefreshCw',
              },
            ],
          },
        };
    },
  },
  // Étape 5 : Territoire
  {
    id: 'territory',
    title: 'Zone géographique',
    question: 'Vendeur UE/EEE ou activité dirigée vers la France ?',
    description: 'Indices : site en français, €, livraison France, SAV FR.',
    legal: {
      article: 'Conditions d’application territoriales (appréciation par indices)',
      explanation:
        'Le Code conso s’applique quand le contrat vise un consommateur en France et que l’activité du pro est dirigée vers la France (langue/€, livraison, SAV…).',
      examples: ['Site en français + €', 'Livraison France', 'SAV FR'],
    },
    ui: {
      type: 'radio',
      required: true,
      options: [
        { value: 'eu', label: 'UE/EEE ou activité dirigée vers la France', icon: 'Globe' },
        { value: 'non_eu', label: 'Hors UE/EEE (indices FR insuffisants)', icon: 'MapPin' },
      ],
    },
  },
  // Étape 6 : Timing — dynamique selon la précision
  {
    id: 'timing',
    title: "Ancienneté / période d'exécution",
    question: 'Votre achat a-t-il moins de 2 ans ?',
    description: 'Question adaptée selon votre cas (neuf, occasion, ponctuel, abonnement).',
    legal: {
      article: 'L.217-3 ; L.217-7 ; L.224-25-12 et s.',
      explanation:
        'Biens : action dans les 2 ans (L.217-3). Présomption 24 mois (neuf) / 12 mois (occasion) - L.217-7. Numérique : 2 ans (ponctuel) ou pendant toute la durée de l’abonnement (continu).',
      references: ['L.217-3', 'L.217-7', 'L.224-25-12'],
      examples: [
        'Neuf : présomption 24 mois',
        'Occasion : présomption 12 mois',
        'Ponctuel : 2 ans',
        'Abonnement : pendant le contrat',
      ],
    },
    ui: {
      type: 'radio',
      required: true,
      options: [
        { value: 'ok', label: 'Oui', icon: 'Clock' }, // écrasé si abonnement
        { value: 'ko', label: 'Non', icon: 'AlertTriangle' },
      ],
    },
    dynamic: data => {
      const cat = data.itemCategory;
      const det = data.itemDetail;

      if (cat === 'good' && det === 'new') {
        return {
          title: 'Ancienneté',
          question: 'Votre achat neuf date-t-il de moins de 2 ans ?',
          description: 'Action 2 ans (L.217-3). Présomption d’antériorité 24 mois (L.217-7).',
          ui: {
            type: 'radio',
            required: true,
            options: [
              { value: 'ok', label: 'Oui (< 2 ans)', icon: 'Clock' },
              { value: 'ko', label: 'Non (≥ 2 ans)', icon: 'AlertTriangle' },
            ],
          },
        };
      }
      if (cat === 'good' && det === 'used') {
        return {
          title: 'Ancienneté',
          question: 'Votre achat d’occasion date-t-il de moins de 2 ans ?',
          description: 'Action 2 ans (L.217-3). Présomption 12 mois (L.217-7).',
          ui: {
            type: 'radio',
            required: true,
            options: [
              { value: 'ok', label: 'Oui (< 2 ans)', icon: 'Clock' },
              { value: 'ko', label: 'Non (≥ 2 ans)', icon: 'AlertTriangle' },
            ],
          },
        };
      }
      if (cat === 'digital_service' && det === 'one_off') {
        return {
          title: 'Ancienneté',
          question: 'La fourniture ponctuelle date-t-elle de moins de 2 ans ?',
          description: 'Contenu/Service numérique fourni en une fois : garantie 2 ans.',
          ui: {
            type: 'radio',
            required: true,
            options: [
              { value: 'ok', label: 'Oui (< 2 ans)', icon: 'Clock' },
              { value: 'ko', label: 'Non (≥ 2 ans)', icon: 'AlertTriangle' },
            ],
          },
        };
      }
      if (cat === 'digital_service' && det === 'subscription') {
        return {
          title: 'Période',
          question: 'Votre abonnement est-il en cours d’exécution ?',
          description:
            'Pour un service fourni en continu, la conformité est due pendant toute la durée du contrat.',
          ui: {
            type: 'radio',
            required: true,
            options: [
              { value: 'during_contract', label: 'Oui, abonnement en cours', icon: 'RefreshCw' },
              { value: 'after_contract', label: 'Non, abonnement terminé', icon: 'AlertTriangle' },
            ],
          },
        };
      }
      return {};
    },
  },
  {
    id: 'defect',
    title: 'Nature du problème',
    question: 'Le produit ou service présente-t-il un défaut de conformité ?',
    description:
      'Panne, dysfonctionnement, fonctionnalité manquante, absence de mises à jour requises… Pas un mauvais usage ou un dommage volontaire.',
    legal: {
      article: 'L.217-5',
      explanation:
        'Conformité : critères contractuels (usage spécial, accessoires, MAJ) + critères objectifs (qualités attendues, déclarations publiques, etc.).',
      references: ['L.217-5'],
      examples: [
        '✅ Panne prématurée',
        '✅ Fonction manquante',
        '❌ Usage anormal',
        '❌ Dégât volontaire',
      ],
    },
    ui: {
      type: 'radio',
      required: true,
      options: [
        { value: 'yes', label: 'Oui, défaut de conformité', icon: 'Wrench' },
        { value: 'no', label: 'Non, pas de défaut', icon: 'AlertCircle' },
      ],
    },
  },
];
