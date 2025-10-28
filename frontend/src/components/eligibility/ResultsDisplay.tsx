// src/components/eligibility/ResultsDisplay.tsx
'use client';

import React from 'react';
import {motion} from 'framer-motion';
import {
    ArrowRight,
    CheckCircle,
    Clock,
    FileText,
    Info,
    Lock,
    ExternalLink,
    RefreshCw, Scale,
} from 'lucide-react';

import type {EligibilityResult} from '@/eligibility/engine';
import type {EligibilityData} from '@/types/eligibility';

interface ResultsDisplayProps {
    result: EligibilityResult;
    data: EligibilityData;
    onRestart: () => void;
}

/* ----------------------------- Design tokens ----------------------------- */
const cardClass =
    'rounded-3xl border border-gray-100 bg-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-sm';
const h1Class =
    'text-[1.35rem] md:text-[1.55rem] font-semibold tracking-[-0.01em] text-gray-900';
const subClass = 'text-[0.95rem] text-gray-600 leading-relaxed';
const ctaPrimary =
    'inline-flex items-center justify-center gap-2 h-11 md:h-12 w-full md:w-auto px-5 md:px-6 rounded-xl ' +
    'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold ' +
    'shadow-[0_6px_18px_rgba(37,99,235,0.25)] hover:from-blue-700 hover:to-indigo-700 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300';
const ctaGhost =
    'inline-flex items-center justify-center gap-2 h-11 md:h-12 px-4 rounded-xl ' +
    'border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300';
const pill =
    'inline-flex items-center gap-1 rounded-full border border-gray-200/80 px-2.5 py-1 bg-white/70 text-[11px] text-gray-600';

/* ----------------------- Alternatives constant (kept) --------------------- */
export const ALTERNATIVES = [
    // gardé pour usage ailleurs
    {id: 'signalconso', title: 'SignalConso', url: 'https://signal.conso.gouv.fr/'},
    {
        id: 'mediation',
        title: 'Médiation de la consommation',
        url: 'https://www.economie.gouv.fr/mediation-conso'
    },
    {
        id: 'conciliation',
        title: 'Conciliateur de justice',
        url: 'https://www.conciliateurs.fr/'
    },
    {
        id: 'assistance',
        title: 'Permanences juridiques',
        url: 'https://www.service-public.fr/particuliers/vosdroits/F20153'
    },
];

const INELIGIBILITY_MESSAGES: Record<
    string,
    { title: string; message: string }
> = {
    seller_not_professional: {
        title: 'Vente entre particuliers',
        message:
            "La garantie légale de conformité couvre uniquement les achats auprès de professionnels (B2C).",
    },
    not_consumer: {
        title: 'Usage professionnel',
        message: 'La protection est réservée aux achats pour un usage personnel.',
    },
    territory_outside: {
        title: 'Vendeur hors UE/EEE',
        message: "Hors champ, sauf activité dirigée vers la France (indices suffisants).",
    },
    timing_too_old: {
        title: 'Délai dépassé',
        message: "Le délai de la garantie légale (2 ans) est écoulé.",
    },
    no_defect: {
        title: 'Aucun défaut de conformité établi',
        message: 'La garantie s’applique uniquement en cas de non-conformité.',
    },
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({result, onRestart}) => {
    return (
        <div className="relative">
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-50 via-white to-white"/>
            <div className="relative max-w-3xl mx-auto p-4 md:p-8">
                {result.isEligible ? (
                    <EligibleView onRestart={onRestart}/>
                ) : (
                    <IneligibleView result={result} onRestart={onRestart}/>
                )}
            </div>
        </div>
    );
};

/* ============================ ELIGIBLE VIEW ============================ */
const EligibleView: React.FC<{ onRestart: () => void }> = ({onRestart}) => {
    const onContinue = () => (window.location.href = '/formulaire');
    const restart = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        setTimeout(onRestart, 60);
    };

    return (
        <motion.section
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.2}}
            className={`${cardClass} p-5 md:p-7`}
        >
            <header className="mb-4 md:mb-5">
                <div className="flex items-center gap-2.5">
          <span
              className="inline-grid place-items-center w-6 h-6 rounded-full bg-green-50 border border-green-200">
            <CheckCircle className="w-4 h-4 text-emerald-600"/>
          </span>
                    <h1 className={h1Class}>Vous êtes éligible</h1>
                </div>
                <p className={`${subClass} mt-1`}>
                    Modèle conforme au Code de la consommation, prêt à signer et
                    envoyer.
                </p>
            </header>

            <div
                className="rounded-2xl bg-white border border-gray-100 p-3 md:p-4 shadow-inner">
                <button onClick={onContinue} className={`${ctaPrimary} w-full`}>
                    <ArrowRight className="w-4 h-4"/>
                    Générer ma lettre maintenant
                </button>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className={pill}><Clock
                        className="w-3.5 h-3.5"/>2&nbsp;min</span>
                    <span className={pill}><FileText className="w-3.5 h-3.5"/>PDF prêt à l’emploi</span>
                    <span className={pill}><CheckCircle className="w-3.5 h-3.5"/>Conforme</span>
                    <span className={pill}><Lock className="w-3.5 h-3.5"/>Sans inscription</span>
                </div>
            </div>

            <div className="mt-5">
                <ol className="space-y-2 text-[0.95rem] text-gray-700">
                    {[
                        'Saisir vos informations — coordonnées, achat, défaut',
                        'Générer le PDF — modèle conforme, prêt à envoyer',
                        'Envoyer au vendeur — LRAR ou e-mail selon le cas',
                    ].map((t, i) => (
                        <li key={i} className="flex">
                            <span
                                className="w-6 text-gray-400 font-medium">{i + 1}.</span>
                            <span className="flex-1">{t}</span>
                        </li>
                    ))}
                </ol>
            </div>

            <div className="mt-5 flex justify-center">
                <button onClick={onRestart} className={ctaGhost}>
                    <RefreshCw className="w-4 h-4"/>
                    Recommencer
                </button>
            </div>

            <p className="mt-4 p-3 rounded-xl border border-emerald-200/70 bg-emerald-50 text-emerald-800 text-xs leading-relaxed flex items-center gap-2">
                <Scale className="w-4 h-4"/>
                Diagnostic fondé sur le Code de la consommation. Ceci n’est pas un
                conseil juridique personnalisé.
            </p>
        </motion.section>
    );
};

/* =========================== INELIGIBLE VIEW =========================== */
const IneligibleView: React.FC<{
    result: EligibilityResult;
    onRestart: () => void
}> = ({
          result,
          onRestart,
      }) => {
    const reasonKey = result.reasons?.[0] ?? 'no_defect';
    const meta = INELIGIBILITY_MESSAGES[reasonKey];

    const restart = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        setTimeout(onRestart, 60);
    };

    return (
        <motion.section
            initial={{opacity: 0, y: 8}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.2}}
            className={`${cardClass} p-5 md:p-7`}
        >
            {/* Titre + sous-titre */}
            <header className="mb-3">
                <div className="flex items-center gap-2.5">
          <span
              className="inline-grid place-items-center w-6 h-6 rounded-full bg-blue-50 border border-blue-200">
            <Info className="w-4 h-4 text-blue-600"/>
          </span>
                    <h1 className={h1Class}>Votre situation n’entre pas dans la
                        garantie</h1>
                </div>
                <p className={`${subClass} mt-1`}>
                    Pas d’inquiétude : suivez ce guide clair pour agir efficacement.
                </p>
            </header>

            {/* RAISON — amber (charte-compatible, contrastée) */}
            <div
                className="mt-2 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
        <span
            className="inline-grid place-items-center w-7 h-7 rounded-lg bg-white border border-amber-200">
          <Info className="w-4 h-4 text-amber-700"/>
        </span>
                <div className="text-sm">
                    <div
                        className="font-semibold text-gray-900">{meta?.title ?? 'Conditions non remplies'}</div>
                    <p className="text-gray-700 mt-0.5">{meta?.message ?? 'Les conditions légales ne sont pas réunies.'}</p>
                </div>
            </div>

            {/* Bloc guide + actions — layout aligné */}
            <div
                className="mt-4 rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50 to-white p-4">
                {/* Grid pour alignement parfait à droite sur desktop, stack sur mobile */}
                <div className="grid gap-3 md:grid-cols-[1fr,auto] md:items-center">
                    <div className="min-w-0">
                        <div
                            className="font-semibold text-gray-900 leading-tight">D’autres
                            solutions existent
                        </div>
                        <p className="text-sm text-gray-700 mt-1">
                            Garantie expirée, achat entre particuliers ou casse ? Le
                            guide explique pas-à-pas
                            les démarches utiles (amiables et judiciaires) avec des
                            modèles prêts à l’emploi.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
                        <a
                            href="http://localhost:3000/guides/recours-non-eligible.yml"
                            className={ctaPrimary}
                        >
                            <ExternalLink className="w-4 h-4"/>
                            Ouvrir le guide
                        </a>
                        <button onClick={restart} className={ctaGhost}>
                            <RefreshCw className="w-4 h-4"/>
                            Recommencer le test
                        </button>
                    </div>
                </div>
                <p className="mt-2 text-xs text-gray-600">
                    Lecture 3–4&nbsp;min • Modèles réutilisables • Démarches pas-à-pas
                </p>
            </div>

            {/* Disclaimer (Scale) */}
            <p className="mt-4 p-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-800 text-xs leading-relaxed flex items-center gap-2">
                <Scale className="w-4 h-4"/>
                Diagnostic fondé sur le Code de la consommation et le Code civil. Ceci
                n’est pas un conseil juridique personnalisé.
            </p>
        </motion.section>
    );
};

export default ResultsDisplay;
