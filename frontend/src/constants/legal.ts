// src/constants/legal.ts

// Libellés centralisés — Code de la consommation
// ⚖️ IMPORTANT : formulations exactes et non ambiguës (références sûres).
// Ces libellés sont des rappels informatifs et ne constituent pas un conseil juridique individualisé.

export const LEGAL = {
  // Définition du consommateur (article liminaire du Code de la consommation)
  ARTICLE_LIMINAIRE: {
    ref: 'Article liminaire du Code de la consommation',
    summary:
      'Est consommateur toute personne physique qui agit à des fins n’entrant pas dans le cadre de son activité commerciale, industrielle, artisanale, libérale ou agricole.',
  },

  // Biens (garantie légale de conformité)
  L217_3: {
    ref: 'Art. L.217-3 Code de la consommation',
    summary:
      'Le vendeur professionnel doit délivrer un bien conforme au contrat et répond des défauts de conformité existant au moment de la délivrance qui apparaissent dans un délai de deux ans à compter de celle-ci.',
  },

  L217_5: {
    ref: 'Art. L.217-5 Code de la consommation',
    summary:
      'Le bien est conforme s’il correspond à la description, est propre à l’usage habituellement attendu d’un bien similaire, et présente la qualité et les performances qu’un consommateur peut légitimement attendre.',
  },

  L217_7: {
    ref: 'Art. L.217-7 Code de la consommation',
    summary:
      'Les défauts de conformité qui apparaissent dans un délai de vingt-quatre mois à compter de la délivrance sont présumés exister au moment de la délivrance. Pour les biens d’occasion, ce délai est de douze mois.',
  },

  // Contenus et services numériques (régime spécifique)
  L224_25_12: {
    ref: 'Art. L.224-25-12 Code de la consommation',
    summary:
      'Le professionnel délivre un contenu ou un service numérique conforme au contrat et aux critères de qualité, de fonctionnalité, de compatibilité, d’accessibilité et de sécurité prévus par la loi.',
  },

  L224_25_13: {
    ref: 'Art. L.224-25-13 Code de la consommation',
    summary:
      'En cas de fourniture continue d’un contenu ou service numérique, l’obligation de conformité s’apprécie pendant toute la durée de fourniture prévue au contrat.',
  },
} as const;

export type LegalKey = keyof typeof LEGAL;
