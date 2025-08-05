'use client';

import * as React from 'react';
import { Shield, ArrowRight } from 'lucide-react';

// Layout centralisé
import FormLayout from '@/components/form/FormLayout';

// UI Components réutilisables
import { Button, Badge, ContextTip, LegalNote, Reveal } from '@/components/ui';

// Composants réutilisables
import QuestionCard from '@/components/eligibility/QuestionCard';
import RadioGroup from '@/components/form/RadioGroup';
import evaluateEligibility from '@/components/eligibility/logic/rules';
import type { Answers } from '@/components/eligibility/logic/types';

// Nouveaux composants d'annonce mobile-first
import {
  EligibleAnnouncement,
  IneligibleAnnouncement,
  UncertainAnnouncement,
} from '@/components/eligibility/EligibilityResults';

function EligibilityWizard() {
  const [step, setStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Answers>({});
  const [editing, setEditing] = React.useState(true);

  const steps = [
    'Vendeur pro',
    'Usage personnel',
    'Type de produit',
    'État du bien',
    'Défaut numérique',
    'Vendeur UE/EEE',
    "Date d'achat",
    'Type de problème',
  ] as const;

  const total = steps.length;

  const isVisible = (s: number, a: Answers) => {
    if (s === 3) return a.nature === 'bien';
    if (s === 4) return a.nature === 'numerique';
    return true;
  };

  const nextVisible = (s: number, a: Answers) => {
    let n = Math.min(total - 1, s + 1);
    while (n <= total - 1 && !isVisible(n, a)) n++;
    return n;
  };

  const prevVisible = (s: number, a: Answers) => {
    let p = Math.max(0, s - 1);
    while (p >= 0 && !isVisible(p, a)) p--;
    return p;
  };

  const result = evaluateEligibility(answers);
  const hardIneligible = result.hardIneligible === true;

  function canProceed(s: number) {
    switch (s) {
      case 0:
        return !!answers.vendeur;
      case 1:
        return !!answers.usagePersonnel;
      case 2:
        return !!answers.nature;
      case 3:
        return answers.nature === 'bien' ? !!answers.etatBien : true;
      case 4:
        return answers.nature === 'numerique' ? !!answers.defautNumerique : true;
      case 5:
        return !!answers.vendeurUE;
      case 6:
        return !!answers.delai;
      case 7:
        return !!answers.defaut;
      default:
        return false;
    }
  }

  function canProceedWith(s: number, a: Answers) {
    switch (s) {
      case 0:
        return !!a.vendeur;
      case 1:
        return !!a.usagePersonnel;
      case 2:
        return !!a.nature;
      case 3:
        return a.nature === 'bien' ? !!a.etatBien : true;
      case 4:
        return a.nature === 'numerique' ? !!a.defautNumerique : true;
      case 5:
        return !!a.vendeurUE;
      case 6:
        return !!a.delai;
      case 7:
        return !!a.defaut;
      default:
        return false;
    }
  }

  function update<K extends keyof Answers>(key: K, value: Answers[K]) {
    setAnswers(prev => {
      const next = { ...prev, [key]: value };

      // Auto-avance
      setStep(current => {
        if (!isVisible(current, next)) {
          const fwd = nextVisible(current, next);
          if (isVisible(fwd, next) && fwd !== current) return fwd;
          const back = prevVisible(current, next);
          if (isVisible(back, next) && back !== current) return back;
          return current;
        }
        if (canProceedWith(current, next)) {
          return nextVisible(current, next);
        }
        return current;
      });

      // Gestion résultat immédiat
      const evalNow = evaluateEligibility(next);
      if (evalNow.hardIneligible === true) {
        setEditing(false);
      } else {
        const vis: number[] = [];
        for (let i = 0; i < total; i++) if (isVisible(i, next)) vis.push(i);
        const lastVisible = vis[vis.length - 1];
        if (lastVisible !== undefined && canProceedWith(lastVisible, next)) {
          setEditing(false);
        }
      }

      return next;
    });
  }

  const handlePrev = () => setStep(s => prevVisible(s, answers));
  const handleNext = () => setStep(s => nextVisible(s, answers));

  const pedagogy: Record<number, string> = {
    0: 'Inclut les vendeurs pros sur marketplaces. Les particuliers ne sont pas couverts.',
    1: 'La garantie vise les consommateurs (usage privé).',
    2: 'Biens matériels & contenus/services numériques sont couverts.',
    3: "Durée de garantie différente selon l'état du produit.",
    4: 'Accès, fonctionnalités ou mises à jour manquants = non-conformité.',
    5: 'Indices : site en €, livraison FR, pub FR, service client FR…',
    6: 'Biens neufs : 2 ans. Occasion : 1 an min. Numérique : pendant exécution.',
    7: 'Défaut de conformité, retard de livraison ou aucun problème.',
  };

  // Contexte légal détaillé pour aider les utilisateurs
  const legalContext: Record<
    number,
    { article: string; explanation: string; examples?: string[] }
  > = {
    0: {
      article: 'Art. L.217-3 Code de la consommation',
      explanation:
        'Le vendeur professionnel est tenu de livrer un bien conforme au contrat. Cela inclut les vendeurs sur Amazon, Cdiscount, etc. Les ventes entre particuliers ne sont pas couvertes.',
      examples: [
        '✅ Darty, Fnac, Apple Store',
        '✅ Vendeur pro sur Amazon',
        '❌ Vente sur Le Bon Coin entre particuliers',
      ],
    },
    1: {
      article: 'Art. L.217-1 Code de la consommation',
      explanation:
        'La garantie légale protège uniquement les consommateurs (personnes physiques agissant à des fins non professionnelles).',
      examples: [
        '✅ Achat pour votre domicile',
        '✅ Cadeau pour un proche',
        '❌ Achat pour votre entreprise',
      ],
    },
    2: {
      article: 'Art. L.217-3 et L.224-25-12 Code de la consommation',
      explanation:
        'La garantie couvre les biens matériels ET les contenus/services numériques (logiciels, apps, streaming, etc.).',
      examples: [
        '📱 Biens : smartphone, électroménager',
        '💻 Numérique : Netflix, Spotify, jeux vidéo',
      ],
    },
    3: {
      article: 'Art. L.217-7 Code de la consommation',
      explanation:
        "Durée de la garantie légale : 2 ans pour les biens neufs, minimum 1 an pour l'occasion (ou durée de vie normale du bien si plus courte).",
      examples: ['🆕 Neuf : garantie 2 ans', '🔄 Occasion : au moins 1 an'],
    },
    4: {
      article: 'Art. L.224-25-14 Code de la consommation',
      explanation:
        'Un contenu numérique doit être exempt de défaut et conforme aux fonctionnalités annoncées.',
      examples: ['❌ App qui plante', '❌ Streaming qui coupe', '❌ Fonctionnalité manquante'],
    },
    5: {
      article: 'Art. L.217-1 Code de la consommation',
      explanation:
        "La garantie s'applique si le vendeur est établi dans l'UE/EEE ou cible le marché français.",
      examples: ['✅ Site en français + €', '✅ Livraison en France', '✅ Service client français'],
    },
    6: {
      article: 'Art. L.217-7 et L.224-25-17 Code de la consommation',
      explanation:
        "Vous avez 2 ans pour agir (biens neufs), 1 an minimum (occasion). Pour le numérique, pendant toute la durée d'exécution du contrat.",
      examples: [
        '📅 Bien acheté il y a 18 mois : OK',
        '📅 Bien acheté il y a 3 ans : trop tard',
        '💻 Abonnement en cours : OK',
      ],
    },
    7: {
      article: 'Art. L.217-5 et L.217-9 Code de la consommation',
      explanation:
        'Défaut de conformité = le bien ne correspond pas à ce qui était prévu au contrat (description, usage normal, qualité attendue).',
      examples: [
        '⚠️ Panne sans cause',
        '⚠️ Ne fait pas ce qui était promis',
        '⚠️ Livraison en retard',
      ],
    },
  };

  // Calcul du progress
  const visibleSteps = Array.from({ length: total }, (_, i) => i).filter(s =>
    isVisible(s, answers)
  );
  const currentVisibleIndex = visibleSteps.indexOf(step);
  const totalVisible = visibleSteps.length;
  const progressPercent =
    totalVisible > 0 ? Math.round((currentVisibleIndex / (totalVisible - 1)) * 100) : 0;

  // Gestion des résultats
  const showEligibleResult = !editing && result.verdict === 'eligible';
  const showIneligibleResult = !editing && (result.verdict === 'non_eligible' || hardIneligible);
  const showIncertainResult = !editing && result.verdict === 'incertain';

  const renderQuestionContent = () => {
    switch (step) {
      case 0:
        return (
          <QuestionCard
            title="Avez-vous acheté auprès d'un vendeur professionnel ?"
            help="Inclut les vendeurs pros sur marketplaces. Les particuliers ne sont pas couverts."
          >
            <RadioGroup
              name="vendeur"
              value={answers.vendeur}
              onChange={value => update('vendeur', value as any)}
              options={[
                { value: 'pro', label: 'Vendeur professionnel' },
                { value: 'particulier', label: 'Particulier' },
              ]}
              columns={2}
            />
          </QuestionCard>
        );

      case 1:
        return (
          <QuestionCard
            title="Achat pour usage personnel ?"
            help="La garantie vise les consommateurs (usage privé)."
          >
            <RadioGroup
              name="usagePersonnel"
              value={answers.usagePersonnel}
              onChange={value => update('usagePersonnel', value as any)}
              options={[
                { value: 'oui', label: 'Usage personnel' },
                { value: 'non', label: 'Usage professionnel' },
              ]}
              columns={2}
            />
          </QuestionCard>
        );

      case 2:
        return (
          <QuestionCard
            title="Type de produit acheté ?"
            help="Biens matériels & contenus/services numériques sont couverts."
          >
            <RadioGroup
              name="nature"
              value={answers.nature}
              onChange={value => update('nature', value as any)}
              options={[
                { value: 'bien', label: 'Bien matériel' },
                { value: 'numerique', label: 'Contenu/service numérique' },
                { value: 'service', label: 'Service (ex: réparation)' },
              ]}
              layout="stack"
            />
          </QuestionCard>
        );

      case 3:
        if (answers.nature !== 'bien') return null;
        return (
          <QuestionCard
            title="État du bien lors de l'achat ?"
            help="Durée de garantie : 2 ans pour neuf, 1 an minimum pour occasion."
          >
            <RadioGroup
              name="etatBien"
              value={answers.etatBien}
              onChange={value => update('etatBien', value as any)}
              options={[
                { value: 'neuf', label: 'Neuf' },
                { value: 'occasion', label: "D'occasion" },
              ]}
              columns={2}
            />
          </QuestionCard>
        );

      case 4:
        if (answers.nature !== 'numerique') return null;
        return (
          <QuestionCard
            title="Le service numérique présente-t-il un défaut ?"
            help="Accès, fonctionnalités ou mises à jour manquants = non-conformité."
          >
            <RadioGroup
              name="defautNumerique"
              value={answers.defautNumerique}
              onChange={value => update('defautNumerique', value as any)}
              options={[
                { value: 'oui', label: 'Défaut constaté' },
                { value: 'non', label: 'Tout fonctionne' },
              ]}
              columns={2}
            />
          </QuestionCard>
        );

      case 5:
        return (
          <QuestionCard
            title="Vendeur UE/EEE ou livraison en France ?"
            help="Indices : site en €, livraison FR, pub FR, service client FR…"
          >
            <RadioGroup
              name="vendeurUE"
              value={answers.vendeurUE}
              onChange={value => update('vendeurUE', value as any)}
              options={[
                { value: 'oui', label: 'UE/EEE ou ciblé FR' },
                { value: 'non', label: 'Hors UE/EEE' },
              ]}
              columns={2}
            />
          </QuestionCard>
        );

      case 6:
        return (
          <QuestionCard
            title="Achat dans les délais légaux ?"
            help="Biens neufs : 2 ans. Occasion : 1 an min. Numérique : pendant exécution."
          >
            <RadioGroup
              name="delai"
              value={answers.delai}
              onChange={value => update('delai', value as any)}
              options={[
                { value: 'dans', label: 'Dans les délais' },
                { value: 'hors', label: 'Délai dépassé' },
              ]}
              columns={2}
            />
          </QuestionCard>
        );

      case 7:
        return (
          <QuestionCard
            title="Type de problème rencontré ?"
            help="Défaut de conformité, retard de livraison ou aucun problème."
          >
            <RadioGroup
              name="defaut"
              value={answers.defaut}
              onChange={value => update('defaut', value as any)}
              options={[
                { value: 'defaut_conformite', label: 'Défaut de conformité' },
                { value: 'retard', label: 'Retard de livraison' },
                { value: 'aucun', label: 'Aucun problème' },
              ]}
              layout="stack"
            />
          </QuestionCard>
        );

      default:
        return null;
    }
  };

  // Supprimé : renderSidebar() et EligibleNextSteps() - remplacés par composants dédiés

  if (editing) {
    // Mode questions - utilise FormLayout SANS sidebar
    return (
      <FormLayout
        currentStep={step}
        totalSteps={total}
        stepTitle={steps[step]}
        progressPercent={progressPercent}
        canGoNext={canProceed(step)}
        canGoPrev={step > 0}
        onNext={handleNext}
        onPrev={handlePrev}
        isLastStep={false}
        isSubmitting={false}
        saveStatus="saved"
        // PAS de sidebar - navigation uniquement par boutons comme le formulaire
      >
        {renderQuestionContent()}

        {/* Contexte légal didactique */}
        {legalContext[step] && (
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-blue-100 rounded-lg shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                  {legalContext[step].article}
                </div>
                <p className="text-sm text-slate-700 mb-3 leading-relaxed">
                  {legalContext[step].explanation}
                </p>
                {legalContext[step].examples && (
                  <div className="text-xs text-slate-600 space-y-1">
                    {legalContext[step].examples.map((example, i) => (
                      <div key={i}>• {example}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Pédagogie supplémentaire si nécessaire */}
        {pedagogy[step] && !legalContext[step] && <ContextTip>{pedagogy[step]}</ContextTip>}
      </FormLayout>
    );
  }

  // Mode résultats - utilise les nouveaux composants mobile-first
  return (
    <>
      {showEligibleResult && (
        <EligibleAnnouncement
          result={result}
          onGenerateLetter={() => (window.location.href = '/formulaire')}
          onModifyAnswers={() => setEditing(true)}
        />
      )}

      {showIneligibleResult && (
        <IneligibleAnnouncement
          result={result}
          answers={answers}
          onBackToStart={() => {
            setStep(0);
            setAnswers({});
            setEditing(true);
          }}
        />
      )}

      {showIncertainResult && (
        <UncertainAnnouncement result={result} onCompleteInfo={() => setEditing(true)} />
      )}
    </>
  );
}

export default EligibilityWizard;
