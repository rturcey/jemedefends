const steps = [
  {
    id: "seller",
    q: "Avez-vous acheté auprès d’un vendeur professionnel ?",
    desc: "Inclut les vendeurs pros sur marketplaces (Amazon, Cdiscount, etc.). Les particuliers ne sont pas couverts.",
    primaryYes: "Oui",
    primaryNo: "Non",
    yesLabel: "Oui, entreprise / magasin / site marchand (ou pro marketplace)",
    noLabel: "Non, achat auprès d’un particulier",
    yesNext: "usage",
    noNext: "ineligible",
    legal: [
      {
        title: "Pourquoi c’est clé ?",
        text: "La garantie légale de conformité s’applique aux contrats pro ↔ consommateur.",
      },
      {
        title: "Base légale",
        text: "C. consommation, art. L.217-3 s. (biens), L.224-25-12 s. (contenus/serv. numériques).",
      },
    ],
  },
  {
    id: "usage",
    q: "Achat pour un usage personnel (consommateur) ?",
    desc: "La garantie s’applique aux achats destinés à un usage privé.",
    primaryYes: "Oui",
    primaryNo: "Non",
    yesLabel: "Oui, usage privé",
    noLabel: "Non, usage professionnel",
    yesNext: "type",
    noNext: "ineligible",
    legal: [
      {
        title: "Définition consommateur",
        text: "Personne physique agissant à des fins non professionnelles.",
      },
      {
        title: "Base légale",
        text: "Code de la consommation (liminaire), L.217-3.",
      },
    ],
  },
  {
    id: "type",
    q: "Quel est le type de produit ?",
    desc: "La garantie couvre les biens matériels et les contenus/services numériques.",
    primaryYes: "Bien matériel",
    primaryNo: "Contenu / service numérique",
    yesLabel: "Objet physique (téléphone, électroménager, meuble…)",
    noLabel: "Appli, jeu démat., e-book, SaaS, cloud…",
    yesNext: "territory",
    noNext: "digital",
    legal: [
      {
        title: "Biens matériels",
        text: "Obligation de délivrer un bien conforme ; réparation/remplacement/remboursement sans frais.",
      },
      {
        title: "Base légale",
        text: "L.217-3, L.217-8 à L.217-11 (biens) ; L.224-25-12 s. (numérique).",
      },
    ],
  },
  {
    id: "digital",
    q: "Le contenu/service numérique présente-t-il un défaut réel ?",
    desc: "Accès, fonctionnalités ou mises à jour manquants = non-conformité.",
    primaryYes: "Oui, non-conformité",
    primaryNo: "Non",
    yesLabel: "Accès/MAJ/fonctionnalités manquants",
    noLabel: "Tout fonctionne",
    yesNext: "territory",
    noNext: "ineligible",
    legal: [
      {
        title: "Ce qui est couvert",
        text: "Accès, fonctionnalité, sécurité, et fourniture des mises à jour attendues.",
      },
      { title: "Base légale", text: "L.224-25-12 à L.224-25-26." },
    ],
  },
  {
    id: "territory",
    q: "Vendeur UE/EEE ou activité dirigée vers la France / livraison FR ?",
    desc: "Indices : site en €, livraison FR, pub FR, service client FR…",
    primaryYes: "Oui",
    primaryNo: "Non",
    yesLabel: "UE/EEE, ou livraison FR / indices clairs",
    noLabel: "Aucun de ces éléments",
    yesNext: "timing",
    noNext: "ineligible",
    legal: [
      {
        title: "Compétence appliquée",
        text: "La protection FR peut s’appliquer si l’activité est dirigée vers la France ou s’il y a livraison en FR.",
      },
      {
        title: "Références",
        text: "Puis application des régimes L.217-3 s. ou L.224-25-12 s.",
      },
    ],
  },
  {
    id: "timing",
    q: "Achat (ou mise à dispo numérique) < 2 ans ?",
    desc: "Biens neufs : 2 ans. Occasion : peut être réduite par contrat mais jamais < 1 an. Numérique : pendant l’exécution.",
    primaryYes: "Oui, dans les délais",
    primaryNo: "Non",
    yesLabel: "Moins de 2 ans (ou pendant exécution)",
    noLabel: "Délai dépassé",
    yesNext: "defect",
    noNext: "ineligible",
    legal: [
      {
        title: "Présomption de défaut",
        text: "24 mois (12 mois pour l’occasion) → au vendeur de prouver le contraire.",
      },
      {
        title: "Base légale",
        text: "L.217-7 (présomption) ; L.217-3 s. ; L.224-25-13 s. (numérique).",
      },
    ],
  },
  {
    id: "defect",
    q: "Le problème est-il significatif (pas de simple usure normale) ?",
    desc: "Panne, non-conformité, fonctionnalités manquantes, usure anormale prématurée…",
    primaryYes: "Oui, défaut réel",
    primaryNo: "Non",
    yesLabel: "Problème important avéré",
    noLabel: "Détail / usure normale",
    yesNext: "eligible",
    noNext: "ineligible",
    legal: [
      {
        title: "Solutions",
        text: "Réparation ou remplacement au choix du consommateur (sauf impossibilité/coût disproportionné). Remboursement si impossible.",
      },
      { title: "Base légale", text: "L.217-8 à L.217-11." },
    ],
  },
];

// Sélecteurs
const els = {
  qNumber: document.getElementById("q-number"),
  qTitle: document.getElementById("step-title"),
  qDesc: document.getElementById("step-desc"),
  yesBtn: document.getElementById("btn-yes"),
  noBtn: document.getElementById("btn-no"),
  yesTitle: document.getElementById("btn-yes-title"),
  noTitle: document.getElementById("btn-no-title"),
  yesLab: document.getElementById("yes-label"),
  noLab: document.getElementById("no-label"),
  group: document.getElementById("answer-options"),
  legal: document.getElementById("legal-panel"),
  result: document.getElementById("result-container"),
  bar: document.getElementById("progress-bar"),
  pct: document.getElementById("progress-percent"),
  txt: document.getElementById("progress-text"),
  live: document.getElementById("progress-live"),
  tplLegal: document.getElementById("tpl-legal-item"),
  tplEligible: document.getElementById("tpl-eligible"),
  tplIneligible: document.getElementById("tpl-ineligible"),
};

let i = 0;

function render() {
  const stepCount = 6;
  const step = steps[i];
  const num = Math.min(i + 1, stepCount);

  els.qNumber.textContent = String(num);
  els.qTitle.textContent = step.q;
  els.qDesc.textContent = step.desc;

  els.yesTitle.textContent = step.primaryYes || "Oui";
  els.noTitle.textContent = step.primaryNo || "Non";
  els.yesLab.textContent = step.yesLabel || "Oui";
  els.noLab.textContent = step.noLabel || "Non";

  els.yesBtn.setAttribute("aria-checked", "false");
  els.noBtn.setAttribute("aria-checked", "false");

  const p = Math.round(((num - 1) / stepCount) * 100);
  els.txt.textContent = `Question ${num} / ${stepCount}`;
  els.pct.textContent = `${p}% terminé`;
  els.live.textContent = `Question ${num} sur ${stepCount}. ${p}% terminé.`;
  els.bar.style.width = `${p}%`;

  renderLegal(step.legal);

  els.result.classList.add("hidden");
  els.result.innerHTML = "";
}

function renderLegal(items) {
  els.legal.innerHTML = "";
  (Array.isArray(items) ? items : []).forEach(({ title, text }) => {
    const node = els.tplLegal.content.cloneNode(true);
    node.querySelector("h3").textContent = title || "";
    node.querySelector("p").textContent = text || "";
    els.legal.appendChild(node);
  });
}

function go(nextId) {
  if (nextId === "eligible") return showEligible();
  if (nextId === "ineligible") return showIneligible();
  const nextIndex = steps.findIndex((s) => s.id === nextId);
  if (nextIndex >= 0) {
    i = nextIndex;
    render();
  }
}

els.group.addEventListener("click", (e) => {
  const btn = e.target.closest('button[role="radio"]');
  if (!btn) return;
  const isYes = btn.dataset.answer === "true";
  els.yesBtn.setAttribute("aria-checked", isYes ? "true" : "false");
  els.noBtn.setAttribute("aria-checked", isYes ? "false" : "true");
  const step = steps[i];
  go(isYes ? step.yesNext : step.noNext);
});

function showEligible() {
  els.bar.style.width = "100%";
  els.txt.textContent = "Question 6 / 6";
  els.pct.textContent = "100% terminé";
  els.result.className =
    "mt-6 rounded-2xl p-5 md:p-6 border border-emerald-200 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 shadow";
  els.result.innerHTML = ""; // reset
  els.result.appendChild(els.tplEligible.content.cloneNode(true));
  els.result.classList.remove("hidden");
  els.result.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showIneligible() {
  els.bar.style.width = "100%";
  els.txt.textContent = "Fin du test";
  els.pct.textContent = "-";
  els.result.className =
    "mt-6 rounded-2xl p-5 md:p-6 border border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 shadow";
  els.result.innerHTML = ""; // reset
  els.result.appendChild(els.tplIneligible.content.cloneNode(true));
  els.result.classList.remove("hidden");
  els.result.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Init
render();
