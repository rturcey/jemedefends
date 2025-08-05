// content/guides.ts
export type GuideSection = { id: string; title: string; html: string };
export type GuidePage = {
  title: string;
  subtitle?: string;
  seo: { title: string; description: string };
  sections: GuideSection[];
  schema?: Record<string, any>;
  disclaimer?: string;
};

const D =
  'Informations générales fondées sur le Code de la consommation (L.217-3 s. et/ou L.224-25-12 s.). Ce contenu ne constitue pas un conseil juridique individualisé.';

export const PAGES: Record<string, GuidePage> = {
  // === PILIER GÉNÉRAL ===
  'garantie-legale-conformite': {
    title: 'Garantie légale de conformité : vos droits et vos recours',
    subtitle: 'Biens matériels et services numériques - Base légale, durée, preuve et procédure.',
    seo: {
      title: 'Garantie légale de conformité : guide complet (biens & services numériques)',
      description:
        '2 ans, charge de la preuve, recours (réparation, remplacement, remboursement). C. conso L.217-3 s. et L.224-25-12 s.',
    },
    sections: [
      {
        id: 'def',
        title: 'Définition et base légale',
        html: `<p>La garantie légale de conformité protège le <strong>consommateur</strong> ayant acheté auprès d’un <strong>professionnel</strong>. <br/>Biens : <strong>L.217-3 s.</strong> ; Contenus/Services numériques : <strong>L.224-25-12 s.</strong></p>`,
      },
      {
        id: 'duree',
        title: 'Durée et charge de la preuve',
        html: `<p><strong>2 ans</strong> (biens : L.217-3). Pour le numérique, la garantie couvre aussi la <strong>durée du contrat si &gt; 2 ans</strong> (L.224-25-13). Présomption en faveur du consommateur pendant 2 ans : <strong>L.217-7</strong>.</p>`,
      },
      {
        id: 'recours',
        title: 'Recours (biens et numérique)',
        html: `<ul class="list-disc list-inside"><li>Biens : réparation, remplacement, ou réduction du prix / résolution (L.217-9).</li><li>Numérique : mise en conformité (correctif/MAJ), réduction du prix, ou résolution sans frais (L.224-25-20).</li></ul>`,
      },
      {
        id: 'procedure',
        title: 'Procédure pratique',
        html: `<ol class="list-decimal list-inside"><li><strong>Mise en demeure</strong> adressée au vendeur (écrit recommandé conseillé).</li><li>En cas d’échec : conciliateur, <em>SignalConso</em>, association de consommateurs.</li><li>Ultime recours : action judiciaire.</li></ol>`,
      },
      {
        id: 'confusions',
        title: 'À ne pas confondre',
        html: `<ul class="list-disc list-inside"><li>Garantie commerciale (extension) : <em>facultative</em>, ne remplace jamais la garantie légale.</li><li>Vices cachés (Code civil, art. 1641) : nécessite de prouver l’antériorité et la gravité du défaut.</li></ul>`,
      },
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Garantie légale de conformité : vos droits',
    },
    disclaimer: D,
  },

  // === SATELLITES PRODUITS ===
  'voiture-occasion-garantie-legale': {
    title: 'Voiture d’occasion en panne : vos droits avec la garantie légale',
    subtitle: 'Valable si achat auprès d’un professionnel (garage, concession).',
    seo: {
      title: 'Voiture d’occasion : garantie légale 2 ans (L.217-3 s.)',
      description:
        'Panne moteur, boîte de vitesses, vice constaté après achat : réparation, remplacement ou résolution.',
    },
    sections: [
      {
        id: 'champ',
        title: 'Quand s’applique la garantie ?',
        html: `<p>Achat auprès d’un <strong>professionnel</strong> : garantie légale <strong>2 ans</strong> (L.217-3 s.). Achat entre particuliers : pas de garantie légale (éventuels <em>vices cachés</em>).</p>`,
      },
      {
        id: 'exemples',
        title: 'Exemples concrets',
        html: `<ul class="list-disc list-inside"><li>Boîte de vitesses HS après 2 mois : non-conformité.</li><li>Contrôle technique mentionnant un défaut non corrigé : non-conformité.</li></ul>`,
      },
      {
        id: 'recours',
        title: 'Recours',
        html: `<p>Réparation, voire résolution du contrat si le défaut rend le véhicule impropre à l’usage (L.217-9).</p>`,
      },
    ],
    disclaimer: D,
  },

  'electromenager-garantie-legale': {
    title: 'Électroménager en panne : vos droits (garantie légale)',
    subtitle: 'Lave-linge, lave-vaisselle, frigo, four…',
    seo: {
      title: 'Électroménager : garantie légale 2 ans - recours',
      description:
        'Pannes précoces couvertes par la garantie légale. Vendeur responsable (L.217-3 s.).',
    },
    sections: [
      {
        id: 'cas',
        title: 'Cas fréquents couverts',
        html: `<ul class="list-disc list-inside"><li>Lave-linge qui fuit après 3 semaines.</li><li>Four qui ne chauffe plus après 2 mois.</li><li>Frigo qui ne refroidit pas.</li></ul>`,
      },
      {
        id: 'vendeur',
        title: 'Vendeur responsable',
        html: `<p>Le <strong>vendeur</strong> est l’interlocuteur légal (et non le fabricant). Frais à sa charge (L.217-11).</p>`,
      },
      {
        id: 'recours',
        title: 'Recours (L.217-9)',
        html: `<p>Réparation, remplacement, ou réduction du prix / résolution.</p>`,
      },
    ],
    disclaimer: D,
  },

  'smartphones-garantie-legale': {
    title: 'Smartphones : batterie, écran, réseau - garantie légale',
    subtitle: 'iPhone, Android et autres marques achetés neufs chez un pro.',
    seo: {
      title: 'Téléphone neuf en panne : garantie légale 2 ans',
      description:
        'Batterie défaillante, écran noir, réseau annoncé absent : recours légaux (L.217-3 s.).',
    },
    sections: [
      {
        id: 'defauts',
        title: 'Défauts couverts',
        html: `<ul class="list-disc list-inside"><li>Batterie qui ne tient pas.</li><li>Écran qui ne s’allume plus.</li><li>Incompatibilité 4G/5G annoncée.</li></ul>`,
      },
      {
        id: 'exclusions',
        title: 'Exclusions',
        html: `<p>Mauvaise utilisation (chute, immersion non prévue) et usure normale ne sont pas couvertes.</p>`,
      },
      {
        id: 'recours',
        title: 'Recours (L.217-9)',
        html: `<p>Réparation / remplacement ou, si impossible, réduction du prix / résolution.</p>`,
      },
    ],
    disclaimer: D,
  },

  'ordinateurs-informatique-garantie-legale': {
    title: 'Ordinateurs & informatique : garantie légale',
    subtitle: 'PC portables, composants, écrans - achetés auprès d’un pro.',
    seo: {
      title: 'PC en panne : garantie légale 2 ans',
      description: 'Carte graphique HS, batterie, écran : vendeur responsable (L.217-3 s.).',
    },
    sections: [
      {
        id: 'defauts',
        title: 'Défauts fréquents',
        html: `<ul class="list-disc list-inside"><li>PC qui ne démarre pas.</li><li>GPU défaillant.</li><li>Clavier/écran inopérant.</li></ul>`,
      },
      {
        id: 'vendeur',
        title: 'Responsabilité du vendeur',
        html: `<p>C’est au vendeur professionnel d’appliquer la garantie légale.</p>`,
      },
      {
        id: 'recours',
        title: 'Recours (L.217-9)',
        html: `<p>Réparation, remplacement, ou réduction du prix / résolution.</p>`,
      },
    ],
    disclaimer: D,
  },

  'consoles-jeux-garantie-legale': {
    title: 'Consoles de jeux : pannes et garantie légale',
    subtitle: 'Lecteur optique, Wi‑Fi/Bluetooth, manettes…',
    seo: {
      title: 'PS5/Switch/Xbox : garantie légale et recours',
      description:
        'Console qui ne s’allume pas ou ne lit pas les disques : non-conformité (L.217-3 s.).',
    },
    sections: [
      {
        id: 'defauts',
        title: 'Défauts fréquents couverts',
        html: `<ul class="list-disc list-inside"><li>Console qui ne s’allume pas.</li><li>Lecteur qui ne lit aucun disque.</li><li>Problème Wi‑Fi/Bluetooth.</li></ul>`,
      },
      {
        id: 'recours',
        title: 'Recours (L.217-9)',
        html: `<p>Réparation / remplacement ou réduction du prix / résolution.</p>`,
      },
    ],
    disclaimer: D,
  },

  'meubles-garantie-legale': {
    title: 'Meubles : affaissement, visserie, stabilité - garantie légale',
    subtitle: 'Canapés, lits, tables, chaises achetés neufs chez un pro.',
    seo: {
      title: 'Meuble neuf défectueux : vos droits',
      description: 'Affaissement rapide, instabilité : recours légaux (L.217-3 s.).',
    },
    sections: [
      {
        id: 'cas',
        title: 'Cas typiques',
        html: `<ul class="list-disc list-inside"><li>Canapé qui s’affaisse en quelques mois.</li><li>Lit dont les lattes se brisent.</li><li>Pieds qui se décollent.</li></ul>`,
      },
      {
        id: 'recours',
        title: 'Recours (L.217-9)',
        html: `<p>Réparation / remplacement ; à défaut, réduction du prix / résolution.</p>`,
      },
    ],
    disclaimer: D,
  },

  'jouets-garantie-legale': {
    title: 'Jouets : casse rapide ou panne - garantie légale',
    subtitle: 'Jouets électroniques, télécommandés, interactifs.',
    seo: {
      title: 'Jouet cassé juste après achat : que faire ?',
      description: 'Non-conformité si le jouet cesse de fonctionner rapidement (L.217-3 s.).',
    },
    sections: [
      {
        id: 'cas',
        title: 'Cas couverts',
        html: `<ul class="list-disc list-inside"><li>Jouet qui ne s’allume plus.</li><li>Voiture télécommandée qui ne répond pas.</li><li>Peluche interactive inopérante.</li></ul>`,
      },
      {
        id: 'exclusion',
        title: 'Exclusion',
        html: `<p>Mauvaise utilisation (chute, immersion) : pas couvert.</p>`,
      },
      {
        id: 'recours',
        title: 'Recours',
        html: `<p>Réparation / remplacement, ou réduction du prix / résolution (L.217-9).</p>`,
      },
    ],
    disclaimer: D,
  },

  'puericulture-garantie-legale': {
    title: 'Puériculture : poussettes, sièges auto - garantie légale',
    subtitle: 'Sécurité et conformité des produits pour enfants.',
    seo: {
      title: 'Poussette/siège auto défectueux : recours',
      description: 'Frein inopérant, structure défectueuse : vendeur responsable (L.217-3 s.).',
    },
    sections: [
      {
        id: 'exemples',
        title: 'Exemples',
        html: `<ul class="list-disc list-inside"><li>Frein de poussette inopérant.</li><li>Siège auto avec ancrage défectueux.</li></ul>`,
      },
      {
        id: 'exclusions',
        title: 'Exclusions',
        html: `<p>Usure normale et mauvaise utilisation exclues.</p>`,
      },
      {
        id: 'recours',
        title: 'Recours',
        html: `<p>Réparation/remplacement ou réduction du prix/résolution (L.217-9).</p>`,
      },
    ],
    disclaimer: D,
  },

  'bricolage-jardinage-garantie-legale': {
    title: 'Bricolage & jardinage : perceuses, tondeuses - garantie légale',
    subtitle: 'Matériel acheté neuf chez un pro.',
    seo: {
      title: 'Perceuse/Tondeuse en panne : garantie légale',
      description: 'Pannes précoces couvertes ; vendeur responsable (L.217-3 s.).',
    },
    sections: [
      {
        id: 'cas',
        title: 'Cas fréquents',
        html: `<ul class="list-disc list-inside"><li>Perceuse qui ne tourne plus.</li><li>Tondeuse qui ne démarre pas.</li><li>Tronçonneuse avec moteur HS.</li></ul>`,
      },
      {
        id: 'recours',
        title: 'Recours (L.217-9)',
        html: `<p>Réparation/remplacement, ou réduction du prix/résolution.</p>`,
      },
    ],
    disclaimer: D,
  },

  'gros-electromenager-livre-garantie-legale': {
    title: 'Gros électroménager livré : frigo, four, lave-linge - garantie légale',
    subtitle: 'Même règles qu’en magasin : vendeur responsable.',
    seo: {
      title: 'Frigo/Four/Lave-linge en panne : vos droits',
      description: 'Garantie légale 2 ans, frais à la charge du vendeur (L.217-11).',
    },
    sections: [
      {
        id: 'ex',
        title: 'Exemples',
        html: `<p>Frigo qui ne refroidit pas après 2 mois, four qui ne chauffe plus, lave-linge bloqué en cycle : non-conformité.</p>`,
      },
      {
        id: 'frais',
        title: 'Frais et responsabilité',
        html: `<p>Frais de retour et d’intervention à la charge du vendeur (L.217-11).</p>`,
      },
    ],
    disclaimer: D,
  },

  'achats-en-ligne-garantie-legale': {
    title: 'Achats en ligne : garantie légale et droit de rétractation',
    subtitle: 'Amazon, Cdiscount, Fnac.com et autres marketplaces.',
    seo: {
      title: 'Produit défectueux acheté en ligne : recours',
      description:
        'Garantie légale identique au magasin (L.217-3 s.). Rétractation 14 jours distincte.',
    },
    sections: [
      {
        id: 'regle',
        title: 'Même règle que le magasin',
        html: `<p>Vendeur professionnel = garantie légale. Vendeur particulier via marketplace = pas de garantie légale.</p>`,
      },
      {
        id: 'double',
        title: 'Double droit',
        html: `<p><strong>Droit de rétractation</strong> 14 jours (sauf exceptions) + <strong>garantie légale</strong> 2 ans (L.217-3 s.).</p>`,
      },
    ],
    disclaimer: D,
  },

  // === SATELLITES SERVICES NUMÉRIQUES ===
  'services-numeriques-streaming': {
    title: 'Streaming (Netflix, Spotify, Disney+) : garantie légale',
    subtitle: 'Contenus et services numériques - non-conformités fréquentes et recours.',
    seo: {
      title: 'Netflix/Spotify qui bug ? Vos droits (L.224-25-12 s.)',
      description:
        'Correctif, réduction du prix, résolution sans frais si le défaut persiste (L.224-25-20).',
    },
    sections: [
      {
        id: 'base',
        title: 'Base légale',
        html: `<p>Art. <strong>L.224-25-12 à L.224-25-26</strong> C. conso.</p>`,
      },
      {
        id: 'ex',
        title: 'Exemples',
        html: `<ul class="list-disc list-inside"><li>Appli incompatible alors qu’annoncée compatible.</li><li>Lecture hors ligne premium absente.</li><li>Catalogue promis durablement indisponible.</li></ul>`,
      },
      {
        id: 'recours',
        title: 'Recours (L.224-25-20)',
        html: `<p>Mise en conformité, réduction du prix, résolution sans frais.</p>`,
      },
    ],
    disclaimer: D,
  },

  'services-numeriques-jeux-en-ligne': {
    title: 'Jeux vidéo en ligne : serveurs, DLC, modes - garantie légale',
    subtitle: 'Modes promis inaccessibles, plantages répétés, DLC non livrés.',
    seo: {
      title: 'Jeu en ligne inaccessible : recours (L.224-25-13 s.)',
      description: 'Non-conformité si les fonctions promises ne sont pas fournies.',
    },
    sections: [
      {
        id: 'ex',
        title: 'Exemples concrets',
        html: `<ul class="list-disc list-inside"><li>Mode en ligne promis mais indisponible.</li><li>Jeu qui plante à chaque lancement.</li><li>DLC/season pass non livré.</li></ul>`,
      },
      {
        id: 'recours',
        title: 'Recours (L.224-25-20)',
        html: `<p>Correctif/MAJ, réduction du prix, résolution.</p>`,
      },
    ],
    disclaimer: D,
  },

  'services-numeriques-apps-logiciels': {
    title: 'Applications et logiciels : garantie légale',
    subtitle: 'Compatibilité annoncée, stabilité, fonctions premium.',
    seo: {
      title: 'Appli payante qui plante : que dit la loi ?',
      description: 'Non-conformité si l’appli ne fonctionne pas comme prévu (L.224-25-12 s.).',
    },
    sections: [
      {
        id: 'defauts',
        title: 'Défauts couverts',
        html: `<ul class="list-disc list-inside"><li>Plantages répétés.</li><li>Fonctions promises absentes.</li><li>Incompatibilité malgré compatibilité annoncée.</li></ul>`,
      },
      {
        id: 'recours',
        title: 'Recours (L.224-25-20)',
        html: `<p>Mise en conformité, réduction du prix ou résolution.</p>`,
      },
    ],
    disclaimer: D,
  },

  'services-numeriques-cloud': {
    title: 'Cloud & stockage en ligne : garantie légale',
    subtitle: 'Espace, accès, collaboration annoncés au contrat.',
    seo: {
      title: 'Cloud non conforme : vos droits',
      description: 'Espace insuffisant, fonctions manquantes : non-conformité (L.224-25-12 s.).',
    },
    sections: [
      {
        id: 'ex',
        title: 'Exemples',
        html: `<ul class="list-disc list-inside"><li>Abonnement 200 Go livré 50 Go.</li><li>Perte d’accès durable aux fonctions annoncées.</li></ul>`,
      },
      {
        id: 'recours',
        title: 'Recours',
        html: `<p>Correctif, réduction du prix, résolution (L.224-25-20).</p>`,
      },
    ],
    disclaimer: D,
  },

  'services-numeriques-ebooks-presse-formations': {
    title: 'E‑books, presse, cours en ligne : garantie légale',
    subtitle: 'Accès promis, modules complets, lisibilité.',
    seo: {
      title: 'E‑book/formation inaccessibles : recours',
      description: 'Absence d’accès ou modules manquants = non-conformité (L.224-25-12 s.).',
    },
    sections: [
      {
        id: 'ex',
        title: 'Exemples',
        html: `<ul class="list-disc list-inside"><li>E‑book qui ne s’ouvre jamais.</li><li>Abonnement presse bloqué.</li><li>Formation avec modules non livrés.</li></ul>`,
      },
      {
        id: 'recours',
        title: 'Recours (L.224-25-20)',
        html: `<p>Mise en conformité ou remboursement (réduction du prix / résolution).</p>`,
      },
    ],
    disclaimer: D,
  },

  'services-numeriques-saas-particuliers': {
    title: 'SaaS pour particuliers : garantie légale',
    subtitle: 'Logiciels d’abonnement (budget, santé, photo).',
    seo: {
      title: 'SaaS non conforme : droits et démarches',
      description: 'Fonctions premium absentes, export promis manquant : non-conformité.',
    },
    sections: [
      {
        id: 'ex',
        title: 'Exemples',
        html: `<ul class="list-disc list-inside"><li>Export promis absent.</li><li>Sauvegarde qui échoue.</li></ul>`,
      },
      {
        id: 'recours',
        title: 'Recours (L.224-25-20)',
        html: `<p>Mise en conformité, réduction du prix, résolution.</p>`,
      },
    ],
    disclaimer: D,
  },

  // === PAGES TRANSVERSALES ===
  'garantie-vs-garantie-commerciale': {
    title: 'Garantie légale vs garantie commerciale (extension)',
    subtitle: 'Ne confondez pas : l’extension ne remplace jamais la garantie légale.',
    seo: {
      title: 'Garantie légale ou commerciale ? Différences',
      description: 'Légale = obligatoire et gratuite ; commerciale = optionnelle et payante.',
    },
    sections: [
      {
        id: 'legale',
        title: 'Garantie légale (L.217-3 s.)',
        html: `<p>Obligatoire, gratuite, 2 ans, vendeur responsable.</p>`,
      },
      {
        id: 'commerciale',
        title: 'Garantie commerciale (contrat)',
        html: `<p>Optionnelle, ne peut restreindre la légale.</p>`,
      },
    ],
    disclaimer: D,
  },

  'faire-jouer-garantie': {
    title: 'Comment faire jouer la garantie légale de conformité',
    subtitle: 'Modèle de mise en demeure et étapes pratiques.',
    seo: {
      title: 'Procédure : faire valoir la garantie (L.217-3 s.)',
      description: 'Mise en demeure → réparation/remplacement → réduction du prix/résolution.',
    },
    sections: [
      {
        id: 'etapes',
        title: 'Étapes',
        html: `<ol class="list-decimal list-inside"><li>Rassemblez achat + preuves.</li><li>Écrivez au vendeur (LRAR conseillée).</li><li>Fixez un délai raisonnable.</li></ol>`,
      },
      {
        id: 'modele',
        title: 'Modèle court de mise en demeure',
        html: `<p>Je vous mets en demeure d'exécuter la garantie légale (L.217-3 s.). À défaut sous X jours, je solliciterai réduction du prix ou résolution (L.217-9).</p>`,
      },
    ],
    disclaimer: D,
  },

  'droit-retractation-vs-garantie': {
    title: 'Droit de rétractation (14 jours) vs garantie légale',
    subtitle: 'Deux droits distincts et cumulables dans certains cas.',
    seo: {
      title: 'Rétractation 14 jours ou garantie légale ?',
      description: 'Rétractation = changer d’avis ; garantie = défaut de conformité.',
    },
    sections: [
      {
        id: 'diff',
        title: 'Différences clés',
        html: `<ul class="list-disc list-inside"><li><strong>Rétractation</strong> (vente à distance) : 14 jours, sans motif.</li><li><strong>Garantie</strong> : 2 ans, couvre non-conformité.</li></ul>`,
      },
    ],
    disclaimer: D,
  },

  'refus-vendeur-que-faire': {
    title: 'Le vendeur refuse ? Vos solutions concrètes',
    subtitle: 'Amiable, signalement, conciliation, judiciaire.',
    seo: {
      title: 'Refus d’appliquer la garantie : que faire ?',
      description: 'SignalConso, associations, conciliateur, action en justice.',
    },
    sections: [
      { id: 'amiable', title: 'Amiable', html: `<p>Relance écrite, délai raisonnable.</p>` },
      {
        id: 'signal',
        title: 'Signalement et médiation',
        html: `<p><em>SignalConso</em>, associations de consommateurs, conciliateur de justice.</p>`,
      },
      {
        id: 'jud',
        title: 'Judiciaire',
        html: `<p>Assignation si nécessaire (en dernier recours).</p>`,
      },
    ],
    disclaimer: D,
  },

  // === FAQS ===
  'faq-services-numeriques': {
    title: 'FAQ - Services numériques et garantie légale',
    subtitle: 'Streaming, apps, jeux en ligne, cloud - 15 Q/R',
    seo: {
      title: 'FAQ garantie légale - services numériques',
      description:
        'Questions fréquentes sur L.224-25-12 s. (mise en conformité, réduction, résolution).',
    },
    sections: [
      {
        id: 'faq',
        title: 'Questions fréquentes',
        html: `<div class="space-y-3">
      <details><summary><strong>Netflix ne fonctionne pas sur ma TV compatible ?</strong></summary><div class="mt-2">Non-conformité potentielle (L.224-25-12). Mise en conformité ou résolution.</div></details>
      <details><summary><strong>Appli payante qui plante ?</strong></summary><div class="mt-2">Mise en conformité, réduction du prix ou résolution (L.224-25-20).</div></details>
      <details><summary><strong>Jeu en ligne inaccessible ?</strong></summary><div class="mt-2">Non-conformité si la fonction en ligne était au contrat.</div></details>
      </div>`,
      },
    ],
    schema: { '@context': 'https://schema.org', '@type': 'FAQPage' },
    disclaimer: D,
  },

  'faq-garantie-legale': {
    title: 'FAQ - Garantie légale de conformité (50 questions)',
    subtitle: 'Biens et services numériques - durée, preuve, frais, recours.',
    seo: {
      title: 'FAQ complète garantie légale (50 Q/R)',
      description: 'Tout sur L.217-3 s. et L.224-25-12 s. - réponses brèves et sourcées.',
    },
    sections: [
      {
        id: 'faq',
        title: 'Questions fréquentes',
        html: `<div class="space-y-3">
        <details><summary><strong>Durée ?</strong></summary><div class="mt-2">2 ans (biens), durée du contrat si &gt; 2 ans (numérique). L.217-3 ; L.224-25-13.</div></details>
        <details><summary><strong>Preuve ?</strong></summary><div class="mt-2">Présomption en faveur du consommateur 2 ans : L.217-7.</div></details>
        <details><summary><strong>Frais de retour ?</strong></summary><div class="mt-2">À la charge du vendeur : L.217-11.</div></details>
        <details><summary><strong>Recours ?</strong></summary><div class="mt-2">Réparation/remplacement ou réduction du prix/résolution : L.217-9. Numérique : L.224-25-20.</div></details>
        <details><summary><strong>Produits d’occasion ?</strong></summary><div class="mt-2">Oui si achat auprès d’un professionnel.</div></details>
        <details><summary><strong>Entre particuliers ?</strong></summary><div class="mt-2">Pas de garantie légale ; voie des vices cachés (C. civil 1641).</div></details>
      </div>`,
      },
    ],
    schema: { '@context': 'https://schema.org', '@type': 'FAQPage' },
    disclaimer: D,
  },
  'smartphones-telephone-en-panne': {
    title: 'Téléphone en panne : que faire ?',
    seo: {
      title: 'Téléphone en panne : réparation, remplacement, remboursement',
      description:
        'Votre smartphone a un défaut ? Quand et comment invoquer la garantie légale de conformité.',
    },
    sections: [
      {
        id: 'quand-sapplique',
        title: 'Quand la garantie s’applique',
        html: '<ul><li>Achat auprès d’un <strong>professionnel</strong>.</li><li>Défaut sans mauvaise utilisation.</li><li>Fonctionnalité annoncée qui ne fonctionne pas.</li></ul>',
      },
      {
        id: 'vos-demandes',
        title: 'Ce que vous pouvez demander',
        html: '<p><strong>Réparation</strong> ou <strong>remplacement</strong> (L.217-8). Sinon <strong>réduction</strong> du prix ou <strong>résolution</strong> (L.217-10).</p>',
      },
    ],
    disclaimer: 'Information générale. Pas de conseil juridique individualisé.',
  },

  'ordinateurs-defectueux': {
    title: 'Ordinateur défectueux : vos droits',
    seo: {
      title: 'Ordinateur défectueux : exiger la mise en conformité',
      description:
        'Lenteurs, surchauffe, pannes récurrentes : comment faire jouer la garantie légale de conformité.',
    },
    sections: [
      {
        id: 'exemples',
        title: 'Exemples fréquents',
        html: '<ul><li>Surchauffe, ventilateur en panne.</li><li>Écran avec défauts.</li><li>Performances promises non tenues.</li></ul>',
      },
      {
        id: 'demarches',
        title: 'Démarches',
        html: '<p><strong>Réparation/remplacement</strong> (L.217-8), sinon <strong>réduction/résolution</strong> (L.217-10).</p>',
      },
    ],
    disclaimer: 'Information générale. Pas de conseil juridique individualisé.',
  },

  'electromenager-hs': {
    title: 'Électroménager HS : faire jouer la conformité',
    seo: {
      title: 'Électroménager HS : réparation, remplacement, remboursement',
      description: 'Fuite, panne répétée, usage empêché : vos droits avec la garantie légale.',
    },
    sections: [
      {
        id: 'situations',
        title: 'Situations fréquentes',
        html: '<ul><li>Fuite, panne récurrente, impossibilité d’usage normal.</li></ul>',
      },
      {
        id: 'textes',
        title: 'Textes utiles',
        html: '<p>L.217-3, L.217-5, L.217-8, L.217-10. Services numériques essentiels : L.224-25-12 s.</p>',
      },
    ],
    disclaimer: 'Information générale. Pas de conseil juridique individualisé.',
  },

  'voiture-defauts': {
    title: 'Voiture présentant des défauts : options',
    seo: {
      title: 'Voiture avec défauts : conformité (vendeur pro)',
      description:
        'Défauts d’équipement, immobilisation rapide : ce que permet la garantie légale de conformité (vendeur pro).',
    },
    sections: [
      {
        id: 'attention',
        title: 'Attention aux régimes',
        html: '<p>Conformité vs vices cachés. Ici, <strong>conformité</strong> pour vendeur professionnel.</p>',
      },
      {
        id: 'exemples',
        title: 'Exemples',
        html: '<ul><li>Équipement promis manquant/non fonctionnel.</li><li>Défaut immobilisant peu après l’achat.</li></ul>',
      },
    ],
    disclaimer: 'Information générale. Pas de conseil juridique individualisé.',
  },

  'vetements-defaillants': {
    title: 'Vêtements défaillants : agir simplement',
    seo: {
      title: 'Vêtements défaillants : que faire ?',
      description:
        'Décoloration rapide, coutures qui lâchent : faites valoir la garantie légale de conformité.',
    },
    sections: [
      {
        id: 'cas',
        title: 'Cas typiques',
        html: '<ul><li>Décoloration anormale avec entretien conforme.</li><li>Coutures qui lâchent rapidement.</li></ul>',
      },
      {
        id: 'action',
        title: 'Action',
        html: '<p><strong>Réparation/remplacement</strong> (L.217-8), sinon <strong>réduction/résolution</strong> (L.217-10).</p>',
      },
    ],
    disclaimer: 'Information générale. Pas de conseil juridique individualisé.',
  },

  'audio-video-defectueux': {
    title: 'Matériel audio/vidéo défectueux : mode d’emploi',
    seo: {
      title: 'Audio/vidéo : défauts et conformité',
      description:
        'Son médiocre, fonctionnalités inopérantes, panne précoce : les étapes pour faire valoir vos droits.',
    },
    sections: [
      {
        id: 'symptomes',
        title: 'Symptômes fréquents',
        html: '<ul><li>Désynchronisation, fonctionnalités annoncées inopérantes, panne précoce.</li></ul>',
      },
      {
        id: 'base-juridique',
        title: 'Base juridique',
        html: '<p>L.217-3, L.217-8, L.217-10 — services numériques associés : L.224-25-12 s.</p>',
      },
    ],
    disclaimer: 'Information générale. Pas de conseil juridique individualisé.',
  },
};
