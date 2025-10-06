// src/components/eligibility/ResultsDisplay.tsx - VERSION MOBILE-FIRST OPTIMISÉE
'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  ExternalLink,
  RefreshCw,
  ArrowRight,
  Shield,
  Clock,
  Info,
  User,
  Briefcase,
  Globe,
  MessageSquareWarning,
  Scale,
  Handshake,
  ShieldCheck,
} from 'lucide-react';
import React from 'react';

import Container from '@/components/ui/Container';
import type { EligibilityResult } from '@/eligibility/engine';
import type { EligibilityData } from '@/types/eligibility';

interface ResultsDisplayProps {
  result: EligibilityResult;
  data: EligibilityData;
  onRestart: () => void;
}

// ✅ ALTERNATIVES POUR LES CAS D'INÉLIGIBILITÉ
const ALTERNATIVES = [
  {
    id: 'signalconso',
    title: 'SignalConso',
    description: 'Signalez le problème à la DGCCRF pour enquête et sanctions potentielles',
    url: 'https://signal.conso.gouv.fr/',
    icon: MessageSquareWarning,
    color: 'text-orange-600',
    primary: true,
  },
  {
    id: 'mediation',
    title: 'Médiation de consommation',
    description: 'Résolution amiable gratuite avec un médiateur agréé',
    url: 'https://www.economie.gouv.fr/mediation-conso',
    icon: Scale,
    color: 'text-blue-600',
  },
  {
    id: 'conciliation',
    title: 'Conciliateur de justice',
    description: "Service gratuit pour résoudre les litiges à l'amiable",
    url: 'https://www.conciliateurs.fr/',
    icon: Handshake,
    color: 'text-green-600',
  },
  {
    id: 'assistance',
    title: 'Permanences juridiques',
    description: 'Consultations juridiques gratuites dans votre région',
    url: 'https://www.service-public.fr/particuliers/vosdroits/F20153',
    icon: ShieldCheck,
    color: 'text-purple-600',
  },
];

// ✅ MESSAGES D'INÉLIGIBILITÉ PAR RAISON
const INELIGIBILITY_MESSAGES: Record<
  string,
  {
    title: string;
    message: string;
    icon: React.ReactNode;
  }
> = {
  seller_not_professional: {
    title: 'Vente entre particuliers',
    message:
      "La garantie légale de conformité ne s'applique qu'aux achats auprès de professionnels.",
    icon: <User className="w-5 h-5 md:w-6 md:h-6" />,
  },
  not_consumer: {
    title: 'Usage professionnel',
    message: 'La garantie légale protège uniquement les consommateurs (usage personnel).',
    icon: <Briefcase className="w-5 h-5 md:w-6 md:h-6" />,
  },
  territory_outside: {
    title: 'Vendeur hors UE',
    message: "La garantie s'applique si le vendeur est dans l'UE ou cible le marché français.",
    icon: <Globe className="w-5 h-5 md:w-6 md:h-6" />,
  },
  timing_too_old: {
    title: 'Délai dépassé',
    message: "Le délai de garantie légale de 2 ans (ou 12 mois pour l'occasion) est écoulé.",
    icon: <Clock className="w-5 h-5 md:w-6 md:h-6" />,
  },
  no_defect: {
    title: 'Aucun défaut',
    message: "La garantie légale ne s'applique qu'en cas de défaut de conformité avéré.",
    icon: <CheckCircle className="w-5 h-5 md:w-6 md:h-6" />,
  },
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, data, onRestart }) => {
  if (result.isEligible) {
    return <EligibleResults data={data} onRestart={onRestart} />;
  }

  return <IneligibleResults result={result} data={data} onRestart={onRestart} />;
};

// ✅ COMPOSANT POUR LES RÉSULTATS ÉLIGIBLES - MOBILE-FIRST
const EligibleResults: React.FC<{ data: EligibilityData; onRestart: () => void }> = ({
  data,
  onRestart,
}) => {
  const handleContinue = () => {
    window.location.href = '/formulaire';
  };

  const handleRestart = () => {
    // Scroll en haut avant de redémarrer
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => onRestart(), 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100"
    >
      <Container variant="form" className="py-6 md:py-12">
        <div className="text-center">
          {/* ✅ ICÔNE DE SUCCÈS - MOBILE OPTIMISÉ */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-green-100 rounded-full mb-4 md:mb-8"
          >
            <CheckCircle className="w-8 h-8 md:w-12 md:h-12 text-green-600" />
          </motion.div>

          {/* ✅ TITRE - MOBILE OPTIMISÉ */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
            🎉 Vous êtes éligible !
          </h1>

          <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Votre situation correspond parfaitement aux critères de la{' '}
            <strong>garantie légale de conformité</strong>. Vous pouvez exiger la réparation, le
            remplacement ou le remboursement.
          </p>

          {/* ✅ RÉCAPITULATIF - COMPACT MOBILE */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 mb-6 md:mb-8 text-left">
            <h2 className="font-bold text-gray-900 mb-3 md:mb-4 text-base md:text-lg">
              📋 Récapitulatif de votre situation
            </h2>
            <div className="grid gap-2 md:gap-3">
              <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-green-50 rounded-lg md:rounded-xl">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium">
                  Achat auprès d'un professionnel
                </span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-green-50 rounded-lg md:rounded-xl">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium">
                  Usage personnel (consommateur)
                </span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-green-50 rounded-lg md:rounded-xl">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium">
                  {data.productType === 'physical' ? 'Bien matériel' : 'Contenu numérique'}
                </span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-green-50 rounded-lg md:rounded-xl">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium">Dans les délais</span>
              </div>
            </div>
          </div>

          {/* ✅ TRUST INDICATORS - COMPACT MOBILE */}
          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
            <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200 text-center">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-blue-600 mx-auto mb-1 md:mb-2" />
              <div className="font-medium text-gray-900 text-xs md:text-sm">Sources juridiques</div>
              <div className="text-[10px] md:text-xs text-gray-600 hidden md:block">
                Code de la consommation
              </div>
            </div>
            <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200 text-center">
              <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-green-600 mx-auto mb-1 md:mb-2" />
              <div className="font-medium text-gray-900 text-xs md:text-sm">RGPD compliant</div>
              <div className="text-[10px] md:text-xs text-gray-600 hidden md:block">
                Données non conservées
              </div>
            </div>
            <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200 text-center">
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-purple-600 mx-auto mb-1 md:mb-2" />
              <div className="font-medium text-gray-900 text-xs md:text-sm">Rapide</div>
              <div className="text-[10px] md:text-xs text-gray-600 hidden md:block">
                Généré en 2 min
              </div>
            </div>
          </div>

          {/* ✅ BOUTONS - MOBILE OPTIMISÉ */}
          <div className="space-y-3 md:space-y-4">
            <button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl transition-all transform hover:scale-105 shadow-lg text-sm md:text-base"
            >
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 mr-2 inline" />
              Générer ma lettre de mise en demeure
            </button>

            <button
              onClick={handleRestart}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl transition-colors text-sm md:text-base"
            >
              <RefreshCw className="w-3.5 h-3.5 md:w-4 md:h-4 mr-2 inline" />
              Recommencer pour un autre cas
            </button>
          </div>
        </div>
      </Container>
    </motion.div>
  );
};

// ✅ COMPOSANT POUR LES RÉSULTATS INÉLIGIBLES - MOBILE-FIRST
const IneligibleResults: React.FC<{
  result: EligibilityResult;
  data: EligibilityData;
  onRestart: () => void;
}> = ({ result, data, onRestart }) => {
  const primaryReason = result.reasons?.[0] || 'no_defect';
  const reasonInfo = INELIGIBILITY_MESSAGES[primaryReason];

  const handleRestart = () => {
    // Scroll en haut avant de redémarrer
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => onRestart(), 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50"
    >
      <Container variant="form" className="py-6 md:py-12">
        <div className="text-center">
          {/* ✅ ICÔNE - MOBILE OPTIMISÉ */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 bg-orange-100 rounded-full mb-4 md:mb-8"
          >
            <Info className="w-8 h-8 md:w-12 md:h-12 text-orange-600" />
          </motion.div>

          {/* ✅ TITRE - MOBILE OPTIMISÉ */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-4">
            Situation non éligible
          </h1>

          <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Votre situation ne correspond pas aux critères de la garantie légale de conformité, mais{' '}
            <strong>d'autres solutions existent</strong> pour vous aider.
          </p>

          {/* ✅ RAISON - COMPACT MOBILE */}
          {reasonInfo && (
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-orange-200 p-4 md:p-6 mb-6 md:mb-8">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-orange-100 rounded-lg md:rounded-xl text-orange-600 flex-shrink-0">
                  {reasonInfo.icon}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-sm md:text-lg">{reasonInfo.title}</h3>
                  <p className="text-gray-600 text-xs md:text-sm mt-0.5 md:mt-1">
                    {reasonInfo.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ✅ ALTERNATIVES - COMPACT MOBILE */}
          <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6 mb-6 md:mb-8">
            <h2 className="font-bold text-gray-900 mb-4 md:mb-6 text-base md:text-lg">
              🔧 Solutions alternatives recommandées
            </h2>
            <div className="grid gap-3 md:gap-4">
              {ALTERNATIVES.map(alternative => {
                const Icon = alternative.icon;
                return (
                  <a
                    key={alternative.id}
                    href={alternative.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg md:rounded-xl transition-colors group"
                  >
                    <div
                      className={`p-2 md:p-3 rounded-lg md:rounded-xl bg-white ${alternative.color} flex-shrink-0`}
                    >
                      <Icon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="font-medium text-gray-900 text-xs md:text-base mb-0.5 md:mb-1 group-hover:text-blue-600 transition-colors">
                        {alternative.title}
                      </div>
                      <div className="text-[11px] md:text-sm text-gray-600 leading-relaxed">
                        {alternative.description}
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* ✅ BOUTONS - MOBILE OPTIMISÉ */}
          <div className="space-y-3 md:space-y-4">
            <button
              onClick={handleRestart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl md:rounded-2xl transition-all shadow-lg text-sm md:text-base"
            >
              <RefreshCw className="w-4 h-4 md:w-5 md:h-5 mr-2 inline" />
              Recommencer le test d'éligibilité
            </button>

            <a
              href="/guides"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl transition-colors text-center text-sm md:text-base"
            >
              Consulter tous nos guides
            </a>
          </div>

          {/* ✅ DISCLAIMER - COMPACT MOBILE */}
          <div className="mt-6 md:mt-8 p-3 md:p-4 bg-blue-50 rounded-lg md:rounded-xl border border-blue-200">
            <p className="text-[11px] md:text-xs text-blue-800 leading-relaxed">
              ⚖️ <strong>Disclaimer :</strong> Ce diagnostic est basé sur vos réponses et le Code de
              la consommation. Il ne constitue pas un conseil juridique personnalisé. En cas de
              doute, consultez un professionnel du droit.
            </p>
          </div>
        </div>
      </Container>
    </motion.div>
  );
};

export default ResultsDisplay;
