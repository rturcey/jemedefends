import React, { useState, useCallback, useEffect } from 'react';

const steps = [
  {
    id: "seller",
    q: "Où avez-vous acheté votre produit ?",
    desc: "La garantie légale ne s'applique qu'aux achats chez des professionnels",
    emoji: "🏪",
    primaryYes: "Chez un professionnel",
    primaryNo: "Entre particuliers",
    yesLabel: "Magasin, site e-commerce, marketplace...",
    noLabel: "Particulier, vide-grenier, occasion...",
    yesNext: "product_type",
    noNext: "ineligible_seller",
    legal: [
      {
        title: "✅ Professionnels couverts",
        text: "Magasins, sites e-commerce, vendeurs pro sur Amazon/Cdiscount, artisans, auto-entrepreneurs..."
      },
      { title: "📜 Base légale", text: "Code de la consommation, art. L.217-3" }
    ]
  },
  {
    id: "product_type",
    q: "Quel type de produit avez-vous acheté ?",
    desc: "La garantie légale couvre les biens mobiliers et les contenus/services numériques",
    emoji: "📦",
    primaryYes: "Objet physique",
    primaryNo: "Service numérique",
    yesLabel: "Électronique, électroménager, meuble, vêtement...",
    noLabel: "App, logiciel, streaming, abonnement...",
    yesNext: "product_condition",
    noNext: "digital_check",
    legal: [
      {
        title: "📦 Biens mobiliers couverts",
        text: "Objets physiques : hi-tech, électroménager, mobilier, textile, véhicules..."
      },
      { title: "💻 Services numériques couverts", text: "Apps, logiciels, streaming, cloud, jeux en ligne (depuis 2022)" }
    ]
  },
  {
    id: "digital_check",
    q: "Votre service numérique fonctionne-t-il correctement ?",
    desc: "Bug, accès refusé, fonctionnalités manquantes = non-conformité",
    emoji: "💻",
    primaryYes: "Non, ça ne marche pas",
    primaryNo: "Oui, tout fonctionne",
    yesLabel: "Bugs, plantages, accès limité...",
    noLabel: "Fonctionne parfaitement",
    yesNext: "timing_digital",
    noNext: "ineligible_no_defect",
    legal: [
      {
        title: "🔧 Défauts numériques",
        text: "Accès refusé, bugs récurrents, fonctions payées indisponibles, mises à jour manquantes..."
      },
      { title: "⚖️ Même droits", text: "Services numériques = mêmes protections que biens physiques" }
    ]
  },
  {
    id: "product_condition",
    q: "Votre produit était-il neuf ou d'occasion ?",
    desc: "La durée de garantie varie selon l'état du produit",
    emoji: "🔖",
    primaryYes: "Neuf",
    primaryNo: "D'occasion",
    yesLabel: "Produit neuf, jamais utilisé",
    noLabel: "Produit d'occasion, reconditionné...",
    yesNext: "timing_new",
    noNext: "timing_used",
    legal: [
      {
        title: "🆕 Neuf = 24 mois",
        text: "Garantie légale de 2 ans à compter de la livraison pour tous les biens neufs"
      },
      { title: "♻️ Occasion = 12 mois", text: "Présomption réduite à 1 an pour les biens d'occasion" }
    ]
  },
  {
    id: "timing_new",
    q: "Depuis quand avez-vous ce produit neuf ?",
    desc: "Pour un produit neuf, vous avez 2 ans de protection automatique",
    emoji: "📅",
    primaryYes: "Moins de 2 ans",
    primaryNo: "Plus de 2 ans",
    yesLabel: "Achat récent (< 24 mois)",
    noLabel: "Achat ancien (> 24 mois)",
    yesNext: "defect_check",
    noNext: "ineligible_timing_new",
    legal: [
      {
        title: "⭐ Présomption légale",
        text: "Pendant 24 mois, tout défaut est automatiquement présumé exister dès l'achat"
      },
      { title: "🛡️ Pas de preuves à fournir", text: "C'est au vendeur de prouver que vous êtes responsable du défaut" }
    ]
  },
  {
    id: "timing_used",
    q: "Depuis quand avez-vous ce produit d'occasion ?",
    desc: "Pour un produit d'occasion, vous avez 1 an de présomption légale",
    emoji: "📅",
    primaryYes: "Moins de 12 mois",
    primaryNo: "Plus de 12 mois",
    yesLabel: "Achat récent (< 12 mois)",
    noLabel: "Achat ancien (> 12 mois)",
    yesNext: "defect_check",
    noNext: "ineligible_timing_used",
    legal: [
      {
        title: "♻️ Occasion = 12 mois",
        text: "Présomption d'antériorité réduite à 1 an pour les biens d'occasion"
      },
      { title: "⚖️ Après 12 mois", text: "Vous devrez prouver que le défaut existait dès l'achat" }
    ]
  },
  {
    id: "timing_digital",
    q: "Depuis quand utilisez-vous ce service numérique ?",
    desc: "Les services numériques sont protégés pendant toute la durée d'utilisation",
    emoji: "📅",
    primaryYes: "Moins de 2 ans",
    primaryNo: "Plus de 2 ans",
    yesLabel: "Service récent ou abonnement actif",
    noLabel: "Service ancien et terminé",
    yesNext: "defect_check",
    noNext: "ineligible_timing_digital",
    legal: [
      {
        title: "🔄 Services continus",
        text: "Abonnements et services actifs : protection pendant toute la durée d'utilisation"
      },
      { title: "📱 Services ponctuels", text: "Téléchargements : 2 ans comme pour les biens physiques" }
    ]
  },
  {
    id: "defect_check",
    q: "Quel est le problème avec votre produit ?",
    desc: "Tous les défauts significatifs sont couverts par la garantie légale",
    emoji: "🔧",
    primaryYes: "Défaut avéré",
    primaryNo: "Pas de problème",
    yesLabel: "Panne, dysfonctionnement, non-conformité...",
    noLabel: "Produit conforme et fonctionnel",
    yesNext: "eligible",
    noNext: "ineligible_no_defect",
    legal: [
      {
        title: "🛠️ Solutions garanties",
        text: "Réparation, remplacement ou remboursement au choix du consommateur"
      },
      { title: "💰 Entièrement gratuit", text: "Aucun frais ne peut vous être facturé (diagnostic, transport, main d'œuvre)" }
    ]
  }
];

const ineligibilityReasons = {
  ineligible_seller: {
    title: "Achat entre particuliers",
    reason: "Vous avez acheté ce produit auprès d'un particulier, pas d'un professionnel.",
    explanation: "La garantie légale de conformité ne s'applique qu'aux ventes entre professionnels et consommateurs. Les ventes entre particuliers n'en bénéficient pas.",
    alternatives: [
      "**Garantie des vices cachés** - Si le défaut était caché et rend le produit inutilisable",
      "**Négociation amiable** - Contactez le vendeur pour trouver un arrangement",
      "**Tribunal de proximité** - Si le préjudice est important (< 10 000€)",
      "**Médiation** - Certaines plateformes (LeBonCoin, Vinted) proposent une médiation"
    ]
  },
  ineligible_no_defect: {
    title: "Aucun défaut constaté",
    reason: "Votre produit semble fonctionner correctement selon vos réponses.",
    explanation: "La garantie légale ne s'applique qu'en cas de défaut, panne ou non-conformité avérés. Un produit qui fonctionne normalement n'ouvre pas droit à cette garantie.",
    alternatives: [
      "**Droit de rétractation** - Si achat en ligne il y a moins de 14 jours",
      "**Garantie commerciale** - Vérifiez si une garantie fabricant s'applique",
      "**Échange/remboursement commercial** - Négociez avec le vendeur",
      "**Revente** - Si le produit ne vous convient plus"
    ]
  },
  ineligible_timing_new: {
    title: "Délai dépassé pour un produit neuf",
    reason: "Votre produit neuf a plus de 2 ans, la présomption légale ne s'applique plus.",
    explanation: "Pour un bien neuf, la garantie légale dure 2 ans. Au-delà, vous devez prouver que le défaut existait dès l'achat, ce qui est souvent difficile.",
    alternatives: [
      "**Garantie commerciale** - Vérifiez si elle est encore valable",
      "**Vice caché** - Si le défaut était présent mais non détectable à l'achat",
      "**Expertise technique** - Pour prouver l'antériorité du défaut",
      "**Négociation** - Le vendeur peut accepter un geste commercial"
    ]
  },
  ineligible_timing_used: {
    title: "Délai dépassé pour un produit d'occasion",
    reason: "Votre produit d'occasion a plus de 12 mois, la présomption légale ne s'applique plus.",
    explanation: "Pour un bien d'occasion, la présomption d'antériorité est réduite à 1 an. Au-delà, vous devez prouver que le défaut existait lors de l'achat.",
    alternatives: [
      "**Expertise technique** - Pour démontrer que le défaut était présent dès l'achat",
      "**Témoignages** - Si d'autres personnes peuvent attester du défaut précoce",
      "**Défaut de série connu** - Recherchez si c'est un problème récurrent sur ce modèle",
      "**Négociation** - Tentez un arrangement amiable avec le vendeur"
    ]
  },
  ineligible_timing_digital: {
    title: "Service numérique expiré",
    reason: "Votre service numérique est terminé depuis plus de 2 ans.",
    explanation: "Pour les services numériques ponctuels, la protection dure 2 ans. Pour les abonnements, elle s'applique pendant toute la durée d'utilisation.",
    alternatives: [
      "**Réabonnement** - Si c'est un service que vous souhaitez utiliser à nouveau",
      "**Contact éditeur** - Certains proposent un support même après expiration",
      "**Alternatives** - Recherchez des services similaires plus fiables",
      "**Avis consommateurs** - Partagez votre expérience pour alerter d'autres utilisateurs"
    ]
  }
};

interface LegalItem {
  title: string;
  text: string;
}

interface Step {
  id: string;
  q: string;
  desc: string;
  emoji: string;
  primaryYes: string;
  primaryNo: string;
  yesLabel: string;
  noLabel: string;
  yesNext: string;
  noNext: string;
  legal: LegalItem[];
}

export default function EligibilityForm() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [ineligibilityReason, setIneligibilityReason] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stepHistory, setStepHistory] = useState<string[]>([]);
  const [completedAnswers, setCompletedAnswers] = useState<boolean[]>([]);

  const currentStep = steps[currentStepIndex];
  const totalSteps = 6;
  const currentStepNumber = stepHistory.length + 1;
  const progressPercent = stepHistory.length === 0 ? 0 : Math.round((stepHistory.length / totalSteps) * 100);

  // Helper functions pour les styles de boutons selon le contexte
  const getButtonColors = (stepId: string, answer: boolean) => {
    // Questions discriminantes : vert pour favorable, rouge pour défavorable
    if (stepId === 'seller') return answer ? 'green' : 'red';
    if (stepId === 'digital_check') return answer ? 'green' : 'red'; // Oui = défaut = bon
    if (stepId === 'timing_new') return answer ? 'green' : 'red';
    if (stepId === 'timing_used') return answer ? 'green' : 'red';
    if (stepId === 'timing_digital') return answer ? 'green' : 'red';
    if (stepId === 'defect_check') return answer ? 'green' : 'red';

    // Questions neutres : bleu/indigo
    if (stepId === 'product_type') return answer ? 'blue' : 'indigo';
    if (stepId === 'product_condition') return answer ? 'blue' : 'indigo';

    return 'gray';
  };

  const getSelectedButtonStyle = (stepId: string, answer: boolean) => {
    const color = getButtonColors(stepId, answer);
    if (color === 'green') return 'border-green-500 bg-green-50 shadow-lg scale-[1.02] focus:ring-4 focus:ring-green-200';
    if (color === 'red') return 'border-red-500 bg-red-50 shadow-lg scale-[1.02] focus:ring-4 focus:ring-red-200';
    if (color === 'blue') return 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02] focus:ring-4 focus:ring-blue-200';
    if (color === 'indigo') return 'border-indigo-500 bg-indigo-50 shadow-lg scale-[1.02] focus:ring-4 focus:ring-indigo-200';
    return 'border-gray-400 bg-gray-50 shadow-lg scale-[1.02] focus:ring-4 focus:ring-gray-200';
  };

  const getDefaultButtonStyle = (stepId: string, answer: boolean) => {
    const color = getButtonColors(stepId, answer);
    if (color === 'green') return 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-50 focus:ring-4 focus:ring-green-200';
    if (color === 'red') return 'border-gray-200 bg-white hover:border-red-300 hover:bg-red-50 focus:ring-4 focus:ring-red-200';
    if (color === 'blue') return 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 focus:ring-4 focus:ring-blue-200';
    if (color === 'indigo') return 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 focus:ring-4 focus:ring-indigo-200';
    return 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 focus:ring-4 focus:ring-gray-200';
  };

  const getSelectedIconStyle = (stepId: string, answer: boolean) => {
    const color = getButtonColors(stepId, answer);
    if (color === 'green') return 'border-green-500 bg-green-500 text-white shadow-md';
    if (color === 'red') return 'border-red-500 bg-red-500 text-white shadow-md';
    if (color === 'blue') return 'border-blue-500 bg-blue-500 text-white shadow-md';
    if (color === 'indigo') return 'border-indigo-500 bg-indigo-500 text-white shadow-md';
    return 'border-gray-500 bg-gray-500 text-white shadow-md';
  };

  const getDefaultIconStyle = (stepId: string, answer: boolean) => {
    const color = getButtonColors(stepId, answer);
    if (color === 'green') return 'border-green-300 text-green-600 group-hover:border-green-400 group-hover:bg-green-100';
    if (color === 'red') return 'border-red-300 text-red-600 group-hover:border-red-400 group-hover:bg-red-100';
    if (color === 'blue') return 'border-blue-300 text-blue-600 group-hover:border-blue-400 group-hover:bg-blue-100';
    if (color === 'indigo') return 'border-indigo-300 text-indigo-600 group-hover:border-indigo-400 group-hover:bg-indigo-100';
    return 'border-gray-300 text-gray-600 group-hover:border-gray-400 group-hover:bg-gray-100';
  };

  const getStatusIndicator = (stepId: string, answer: boolean) => {
    const color = getButtonColors(stepId, answer);
    if (color === 'green') return 'bg-green-500';
    if (color === 'red') return 'bg-red-500';
    if (color === 'blue') return 'bg-blue-500';
    if (color === 'indigo') return 'bg-indigo-500';
    return 'bg-gray-500';
  };

  const handleAnswer = useCallback((answer: boolean) => {
    setSelectedAnswer(answer);
    setIsTransitioning(true);

    setTimeout(() => {
      const nextId = answer ? currentStep.yesNext : currentStep.noNext;

      if (nextId === "eligible") {
        setIsEligible(true);
        setShowResult(true);
        setCompletedAnswers(prev => [...prev, answer]);
      } else if (nextId.startsWith("ineligible_")) {
        setIsEligible(false);
        setIneligibilityReason(nextId);
        setShowResult(true);
        setCompletedAnswers(prev => [...prev, answer]);
      } else {
        const nextIndex = steps.findIndex(s => s.id === nextId);
        if (nextIndex >= 0) {
          setStepHistory(prev => [...prev, currentStep.id]);
          setCompletedAnswers(prev => [...prev, answer]);
          setCurrentStepIndex(nextIndex);
          setSelectedAnswer(null);
          setIsTransitioning(false);
        }
      }
    }, 800);
  }, [currentStep, stepHistory]);

  useEffect(() => {
    if (showResult) {
      const element = document.getElementById('result-container');
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showResult]);

  const resetTest = () => {
    setCurrentStepIndex(0);
    setShowResult(false);
    setIsEligible(false);
    setIneligibilityReason(null);
    setSelectedAnswer(null);
    setIsTransitioning(false);
    setStepHistory([]);
    setCompletedAnswers([]);
  };

  const goBack = () => {
    if (stepHistory.length > 0) {
      const previousStepId = stepHistory[stepHistory.length - 1];
      const previousIndex = steps.findIndex(s => s.id === previousStepId);

      setStepHistory(prev => prev.slice(0, -1));
      setCompletedAnswers(prev => prev.slice(0, -1));
      setCurrentStepIndex(previousIndex);
      setSelectedAnswer(null);
      setIsTransitioning(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Header identique aux autres pages */}
        <header className="bg-white shadow-md sticky top-0 z-50">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16 md:h-18">
              <a href="/" className="flex-shrink-0" aria-label="Retour à l'accueil">
                <img
                    src="/static/images/logo_jemedefends.svg"
                    alt="Je me défends – logo balance"
                    className="h-8 md:h-10 w-auto"
                    width="192"
                    height="48"
                />
              </a>
              <ul className="hidden md:flex gap-6 lg:gap-8 text-gray-700 font-semibold text-sm lg:text-base">
                <li>
                  <a href="/" className="hover:text-blue-600 transition-colors">
                    Accueil
                  </a>
                </li>
                <li>
                  <a
                      href="/eligibilite"
                      className="text-blue-700"
                  >
                    Éligibilité
                  </a>
                </li>
                <li>
                  <a
                      href="/mentions-legales"
                      className="hover:text-blue-600 transition-colors"
                  >
                    Mentions légales
                  </a>
                </li>
                <li>
                  <a
                      href="/politique-confidentialite"
                      className="hover:text-blue-600 transition-colors"
                  >
                    Politique de confidentialité
                  </a>
                </li>
              </ul>
              <a
                  href="/eligibilite"
                  className="hidden md:inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-bold shadow-lg transition-transform hover:-translate-y-0.5 text-sm lg:text-base"
              >
                🚀 Tester mon éligibilité
              </a>

              {/* Menu mobile */}
              <button
                  className="md:hidden p-2"
                  onClick={() => {
                    const menu = document.getElementById('mobile-menu');
                    menu?.classList.toggle('hidden');
                  }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Menu mobile */}
            <div id="mobile-menu" className="hidden md:hidden bg-white border-t border-gray-200 py-4">
              <div className="space-y-2">
                <a href="/" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Accueil</a>
                <a href="/eligibilite" className="block px-4 py-2 text-blue-700 font-semibold bg-blue-50">Éligibilité</a>
                <a href="/mentions-legales" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Mentions légales</a>
                <a href="/politique-confidentialite" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Politique de confidentialité</a>
              </div>
            </div>
          </nav>
        </header>

        <main className="py-8 md:py-12">
          {showResult ? (
              <section className="min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Breadcrumb */}
                  <nav className="mb-8">
                    <ol className="flex items-center gap-2 text-gray-600 text-sm">
                      <li><a href="/" className="hover:text-blue-600 transition-colors">Accueil</a></li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <a href="/eligibilite" className="hover:text-blue-600 transition-colors">Test d'éligibilité</a>
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                        </svg>
                        <span className="text-gray-900 font-medium">Résultat</span>
                      </li>
                    </ol>
                  </nav>

                  <div id="result-container">
                    {isEligible ? (
                        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                          <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-green-400 to-teal-500"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          <div className="relative p-8 md:p-12 text-white">
                            <div className="flex items-center justify-center mb-8">
                              <div className="relative">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                                  <span className="text-xl">🎉</span>
                                </div>
                              </div>
                            </div>

                            <div className="text-center mb-10">
                              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
                                <span className="font-bold text-sm">✅ ÉLIGIBLE</span>
                              </div>
                              <h1 className="text-4xl md:text-5xl font-black mb-4">
                                Excellent ! Vous avez tous les droits
                              </h1>
                              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                                Votre situation correspond parfaitement à la garantie légale de conformité.
                                Le vendeur doit vous proposer <strong>gratuitement</strong> une solution.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10 px-4">
                              <div className="bg-white/15 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-white/20 hover:bg-white/20 transition-all">
                                <div className="text-3xl md:text-4xl mb-2 md:mb-3">🔧</div>
                                <div className="font-bold mb-1 md:mb-2 text-sm md:text-base">Réparation</div>
                                <div className="text-xs md:text-sm text-white/80">Gratuite sous 30 jours</div>
                              </div>
                              <div className="bg-white/15 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-white/20 hover:bg-white/20 transition-all">
                                <div className="text-3xl md:text-4xl mb-2 md:mb-3">🔄</div>
                                <div className="font-bold mb-1 md:mb-2 text-sm md:text-base">Échange</div>
                                <div className="text-xs md:text-sm text-white/80">Produit équivalent</div>
                              </div>
                              <div className="bg-white/15 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 text-center border border-white/20 hover:bg-white/20 transition-all">
                                <div className="text-3xl md:text-4xl mb-2 md:mb-3">💰</div>
                                <div className="font-bold mb-1 md:mb-2 text-sm md:text-base">Remboursement</div>
                                <div className="text-xs md:text-sm text-white/80">Si impossible</div>
                              </div>
                            </div>

                            <div className="text-center space-y-4 md:space-y-6 px-4">
                              <button
                                  onClick={() => window.location.href = '/formulaire'}
                                  className="group bg-white text-emerald-700 font-black py-3 md:py-4 px-8 md:px-10 rounded-xl md:rounded-2xl text-lg md:text-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 inline-flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-center"
                              >
                                <span className="text-xl md:text-2xl group-hover:animate-bounce">🚀</span>
                                <span className="hidden sm:inline">Générer ma mise en demeure</span>
                                <span className="sm:hidden">Générer mon courrier</span>
                                <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                              </button>

                              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center text-white/80 text-sm md:text-base">
                                <button
                                    onClick={resetTest}
                                    className="hover:text-white underline underline-offset-4 transition-all"
                                >
                                  ↺ Refaire le test
                                </button>
                                <span className="hidden sm:block">•</span>
                                <a href="/#comment-ca-marche" className="hover:text-white underline underline-offset-4 transition-all">
                                  📚 Comment ça marche
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                    ) : (
                        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-red-400"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          <div className="relative p-8 md:p-12 text-white">
                            {ineligibilityReason && ineligibilityReasons[ineligibilityReason] && (
                                <>
                                  <div className="flex items-center justify-center mb-8">
                                    <div className="relative">
                                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
                                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                      </div>
                                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center animate-bounce">
                                        <span className="text-xl">💡</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-center mb-10">
                                    <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
                                      <span className="font-bold text-sm">ℹ️ {ineligibilityReasons[ineligibilityReason].title.toUpperCase()}</span>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                                      {ineligibilityReasons[ineligibilityReason].reason}
                                    </h1>
                                    <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
                                      {ineligibilityReasons[ineligibilityReason].explanation}
                                    </p>
                                  </div>

                                  <div className="bg-white/15 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 mb-8 md:mb-10 border border-white/20 mx-4">
                                    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
                                      <span className="text-2xl md:text-3xl">💡</span>
                                      <span>Solutions alternatives</span>
                                    </h2>
                                    <div className="grid gap-3 md:gap-4 md:grid-cols-2 px-4">
                                      {ineligibilityReasons[ineligibilityReason].alternatives.map((alt, index) => {
                                        const [title, ...descParts] = alt.split(' - ');
                                        const desc = descParts.join(' - ');
                                        return (
                                            <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                                              <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 bg-white text-amber-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                  {index + 1}
                                                </div>
                                                <div className="min-w-0">
                                                  <div className="font-bold mb-1 text-sm md:text-base leading-tight" dangerouslySetInnerHTML={{ __html: title.replace(/\*\*(.*?)\*\*/g, '$1') }} />
                                                  {desc && <div className="text-xs md:text-sm text-white/80 leading-relaxed">{desc}</div>}
                                                </div>
                                              </div>
                                            </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  <div className="text-center space-y-4 md:space-y-6 px-4">
                                    <a
                                        href="/#ressources"
                                        className="group bg-white text-amber-700 font-black py-3 md:py-4 px-8 md:px-10 rounded-xl md:rounded-2xl text-lg md:text-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-105 inline-flex items-center gap-2 md:gap-3 w-full sm:w-auto justify-center"
                                    >
                                      <span className="text-xl md:text-2xl group-hover:animate-bounce">📚</span>
                                      <span className="hidden sm:inline">Explorer d'autres solutions</span>
                                      <span className="sm:hidden">Autres solutions</span>
                                      <svg className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                      </svg>
                                    </a>

                                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center text-white/80 text-sm md:text-base">
                                      <button
                                          onClick={resetTest}
                                          className="hover:text-white underline underline-offset-4 transition-all"
                                      >
                                        ↺ Refaire le test
                                      </button>
                                      <span className="hidden sm:block">•</span>
                                      <a href="/mentions-legales" className="hover:text-white underline underline-offset-4 transition-all">
                                        ⚖️ Vos droits en détail
                                      </a>
                                    </div>
                                  </div>
                                </>
                            )}
                          </div>
                        </div>
                    )}
                  </div>
                </div>
              </section>
          ) : (
              <section className="min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Header */}
                  <div className="text-center mb-8 md:mb-12">
                    <nav className="mb-4 md:mb-8">
                      <ol className="flex items-center justify-center gap-1 md:gap-2 text-gray-600 text-xs md:text-sm">
                        <li><a href="/" className="hover:text-blue-600 transition-colors">Accueil</a></li>
                        <li className="flex items-center gap-1 md:gap-2">
                          <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                          </svg>
                          <span className="text-gray-900 font-medium">Test d'éligibilité</span>
                        </li>
                      </ol>
                    </nav>

                    <div className="mb-6 md:mb-8 px-2">
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full px-4 md:px-6 py-2 md:py-3 mb-4 md:mb-6 shadow-sm">
                        <div className="relative">
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
                          <div className="absolute top-0 left-0 w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-ping opacity-40"></div>
                        </div>
                        <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent font-bold text-xs md:text-sm">
                      TEST GRATUIT EN COURS
                    </span>
                      </div>

                      <h1 className="text-2xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3 md:mb-4 leading-tight">
                        Vérifiez vos droits
                      </h1>
                      <p className="text-base md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
                        Découvrez en 6 questions si vous pouvez obtenir
                        <span className="font-bold text-emerald-600"> réparation, remplacement ou remboursement</span>
                      </p>
                    </div>

                    {/* Progress */}
                    <div className="max-w-sm md:max-w-md mx-auto mb-8 md:mb-12 px-2">
                      <div className="flex items-center justify-between mb-2 md:mb-4">
                        <div className="text-xs md:text-sm font-semibold text-gray-600">
                          Question {currentStepNumber} / {totalSteps}
                        </div>
                        <div className="text-xs md:text-sm text-gray-500">
                          {progressPercent}% terminé
                        </div>
                      </div>
                      <div className="relative w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-2 md:h-3 shadow-inner">
                        <div
                            className="absolute top-0 left-0 h-2 md:h-3 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 shadow-lg transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercent}%` }}
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 md:w-4 md:h-4 bg-white border-2 border-indigo-500 rounded-full shadow-md"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Question Card */}
                  <div className={`transition-all duration-800 ${isTransitioning ? 'opacity-60 scale-95' : 'opacity-100 scale-100'}`}>
                    <div className="relative max-w-4xl mx-auto px-2 md:px-4">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-indigo-50/30 to-purple-100/30 rounded-xl md:rounded-2xl lg:rounded-3xl blur-xl"></div>
                      <div className="relative bg-white/80 backdrop-blur-xl rounded-xl md:rounded-2xl lg:rounded-3xl shadow-2xl border border-white/60 p-4 md:p-6 lg:p-8 hover:shadow-3xl transition-all duration-500">
                        {/* Question Header */}
                        <div className="text-center mb-6 md:mb-8">
                          <div className="text-3xl md:text-4xl mb-3 md:mb-4" style={{ lineHeight: 1 }}>
                            {currentStep.emoji}
                          </div>

                          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full font-bold mb-3 md:mb-4 shadow-md text-xs md:text-sm">
                            <div className="w-5 h-5 md:w-6 md:h-6 bg-white/20 rounded-full flex items-center justify-center">
                              <span className="text-xs font-black">{currentStepNumber}</span>
                            </div>
                            <span>QUESTION {currentStepNumber}</span>
                          </div>

                          <h2 className="text-lg md:text-2xl lg:text-3xl font-black text-gray-900 mb-2 md:mb-3 leading-tight px-2">
                            {currentStep.q}
                          </h2>

                          <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto px-2">
                            {currentStep.desc}
                          </p>
                        </div>

                        {/* Answer Options */}
                        <div className="grid gap-3 md:gap-4 mb-6 md:mb-8 px-2">
                          {/* Option 1 */}
                          <button
                              type="button"
                              onClick={() => !isTransitioning && handleAnswer(true)}
                              disabled={isTransitioning}
                              className={`group relative p-4 md:p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg hover:-translate-y-1 focus:outline-none disabled:opacity-60 disabled:pointer-events-none ${
                                  selectedAnswer === true
                                      ? getSelectedButtonStyle(currentStep.id, true)
                                      : getDefaultButtonStyle(currentStep.id, true)
                              } ${isTransitioning ? 'pointer-events-none' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                                  selectedAnswer === true
                                      ? getSelectedIconStyle(currentStep.id, true)
                                      : getDefaultIconStyle(currentStep.id, true)
                              }`}>
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors">
                                  {currentStep.primaryYes}
                                </h3>
                                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                                  {currentStep.yesLabel}
                                </p>
                              </div>

                              {selectedAnswer === true && (
                                  <div className="absolute top-2 right-2 md:top-3 md:right-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse ${getStatusIndicator(currentStep.id, true)}`}>
                                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                    </div>
                                  </div>
                              )}
                            </div>
                          </button>

                          {/* Option 2 */}
                          <button
                              type="button"
                              onClick={() => !isTransitioning && handleAnswer(false)}
                              disabled={isTransitioning}
                              className={`group relative p-4 md:p-6 rounded-xl border-2 transition-all duration-300 text-left hover:shadow-lg hover:-translate-y-1 focus:outline-none disabled:opacity-60 disabled:pointer-events-none ${
                                  selectedAnswer === false
                                      ? getSelectedButtonStyle(currentStep.id, false)
                                      : getDefaultButtonStyle(currentStep.id, false)
                              } ${isTransitioning ? 'pointer-events-none' : ''}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                                  selectedAnswer === false
                                      ? getSelectedIconStyle(currentStep.id, false)
                                      : getDefaultIconStyle(currentStep.id, false)
                              }`}>
                                <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors">
                                  {currentStep.primaryNo}
                                </h3>
                                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                                  {currentStep.noLabel}
                                </p>
                              </div>

                              {selectedAnswer === false && (
                                  <div className="absolute top-2 right-2 md:top-3 md:right-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse ${getStatusIndicator(currentStep.id, false)}`}>
                                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                    </div>
                                  </div>
                              )}
                            </div>
                          </button>
                        </div>

                        {/* Navigation */}
                        {stepHistory.length > 0 && (
                            <div className="flex justify-center mb-4 md:mb-6 px-2">
                              <button
                                  onClick={goBack}
                                  className="group inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg md:rounded-xl font-semibold transition-all duration-300 hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm md:text-base"
                              >
                                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span className="hidden sm:inline">Question précédente</span>
                                <span className="sm:hidden">Précédent</span>
                              </button>
                            </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Legal Info */}
                  {currentStep.legal && currentStep.legal.length > 0 && (
                      <div className="max-w-4xl mx-auto mt-6 md:mt-8 px-2 md:px-4">
                        <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl md:rounded-2xl p-4 md:p-6 border border-blue-100 shadow-lg">
                          <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                              <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <h3 className="text-base md:text-xl font-black text-gray-900">
                              Informations légales
                            </h3>
                          </div>

                          <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                            {currentStep.legal.map((item, index) => (
                                <div key={index} className="group relative overflow-hidden bg-white rounded-lg md:rounded-xl p-3 md:p-4 border border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                                  <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -translate-y-6 md:-translate-y-8 translate-x-6 md:translate-x-8 opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                  <div className="relative">
                                    <div className="flex items-start gap-2 md:gap-3 mb-2">
                                      <div className="w-5 h-5 md:w-6 md:h-6 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                        {index + 1}
                                      </div>
                                      <h4 className="font-black text-blue-900 text-xs md:text-sm leading-tight">
                                        {item.title}
                                      </h4>
                                    </div>
                                    <p className="text-xs text-blue-700 leading-relaxed pl-7 md:pl-9">
                                      {item.text}
                                    </p>
                                  </div>
                                </div>
                            ))}
                          </div>
                        </div>
                      </div>
                  )}

                  {/* Privacy */}
                  <div className="text-center mt-8 md:mt-12 px-4">
                    <div className="inline-flex items-center gap-2 md:gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full px-6 md:px-8 py-3 md:py-4 shadow-sm hover:shadow-md transition-all">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a5 5 0 0110 0z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm md:text-base text-green-800 font-semibold">
                        <span className="hidden sm:inline">🔒 Données protégées •{' '}</span>
                        <a href="/politique-confidentialite" className="text-green-600 hover:text-green-700 underline underline-offset-2 transition-colors">
                          <span className="sm:hidden">🔒 Confidentialité</span>
                          <span className="hidden sm:inline">Confidentialité</span>
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </section>
          )}
        </main>

        <noscript>
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl md:rounded-3xl p-6 md:p-10 max-w-sm md:max-w-md shadow-2xl">
              <div className="text-center">
                <div className="text-4xl md:text-5xl mb-4 md:mb-6">⚠️</div>
                <h2 className="text-xl md:text-2xl font-bold text-amber-900 mb-3 md:mb-4">JavaScript requis</h2>
                <p className="text-amber-800 mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                  Ce test d'éligibilité nécessite JavaScript pour fonctionner.
                  Veuillez l'activer dans votre navigateur.
                </p>
                <div className="space-y-3 md:space-y-4">
                  <a href="/mentions-legales" className="block text-amber-700 hover:text-amber-800 font-semibold underline text-sm md:text-base">
                    📚 Consulter nos références légales
                  </a>
                  <a href="/" className="block text-amber-700 hover:text-amber-800 font-semibold underline text-sm md:text-base">
                    ← Retour à l'accueil
                  </a>
                </div>
              </div>
            </div>
          </div>
        </noscript>
      </div>
  );
}