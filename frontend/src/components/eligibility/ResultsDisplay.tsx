// src/components/eligibility/ResultsDisplay.tsx - VERSION MODERNE REFACTORISÉE
'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  RefreshCw,
  ArrowRight,
  Shield,
  Phone,
  MapPin,
  Mail,
  MessageSquareWarning,
  Scale,
  Handshake,
  ShieldCheck,
  AlertTriangle,
  Info,
  Clock,
  User,
  Briefcase,
  Globe,
} from 'lucide-react';
import React from 'react';

import Container from '@/components/ui/Container';
import Badge from '@/components/ui/Badge';
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
    action: 'Faire un signalement',
    url: 'https://signal.conso.gouv.fr/',
    icon: MessageSquareWarning,
    color: 'text-orange-600',
    primary: true,
  },
  {
    id: 'mediation',
    title: 'Médiation de consommation',
    description: 'Résolution amiable gratuite avec un médiateur agréé',
    action: 'Trouver un médiateur',
    url: 'https://www.economie.gouv.fr/mediation-conso',
    icon: Scale,
    color: 'text-blue-600',
  },
  {
    id: 'conciliation',
    title: 'Conciliateur de justice',
    description: "Service gratuit pour résoudre les litiges à l'amiable",
    action: 'Trouver un conciliateur',
    url: 'https://www.conciliateurs.fr/',
    icon: Handshake,
    color: 'text-green-600',
  },
  {
    id: 'assistance',
    title: 'Permanences juridiques',
    description: 'Consultations juridiques gratuites dans votre région',
    action: 'Localiser une permanence',
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
    icon: <User className="w-6 h-6" />,
  },
  not_consumer: {
    title: 'Usage professionnel',
    message: 'La garantie légale protège uniquement les consommateurs (usage personnel).',
    icon: <Briefcase className="w-6 h-6" />,
  },
  territory_outside: {
    title: 'Vendeur hors UE',
    message: "La garantie s'applique si le vendeur est dans l'UE ou cible le marché français.",
    icon: <Globe className="w-6 h-6" />,
  },
  timing_too_old: {
    title: 'Délai dépassé',
    message: "Le délai de garantie légale de 2 ans (ou 12 mois pour l'occasion) est écoulé.",
    icon: <Clock className="w-6 h-6" />,
  },
  no_defect: {
    title: 'Aucun défaut',
    message: "La garantie légale ne s'applique qu'en cas de défaut de conformité avéré.",
    icon: <CheckCircle className="w-6 h-6" />,
  },
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, data, onRestart }) => {
  if (result.isEligible) {
    return <EligibleResults data={data} onRestart={onRestart} />;
  }

  return <IneligibleResults result={result} data={data} onRestart={onRestart} />;
};

// ✅ COMPOSANT POUR LES RÉSULTATS ÉLIGIBLES
const EligibleResults: React.FC<{ data: EligibilityData; onRestart: () => void }> = ({
  data,
  onRestart,
}) => {
  const handleContinue = () => {
    window.location.href = '/formulaire';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100"
    >
      <Container variant="form" className="py-12">
        <div className="text-center">
          {/* ✅ ICÔNE DE SUCCÈS ANIMÉE */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          {/* ✅ TITRE PRINCIPAL */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🎉 Vous êtes éligible !
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Votre situation correspond parfaitement aux critères de la{' '}
            <strong>garantie légale de conformité</strong>. Vous pouvez exiger la réparation, le
            remplacement ou le remboursement.
          </p>

          {/* ✅ RÉCAPITULATIF MODERNE */}
          <div className="bg-white rounded-2xl shadow-lg border border-green-200 p-6 mb-8 text-left">
            <h2 className="font-bold text-gray-900 mb-6 text-center text-lg">
              ✅ Résumé de votre situation
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium">Vendeur professionnel</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium">Usage personnel</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium">
                  {data.productType === 'physical' ? 'Bien matériel' : 'Contenu numérique'}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium">Dans les délais</span>
              </div>
            </div>
          </div>

          {/* ✅ GARANTIES ET TRUST INDICATORS */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900 text-sm">Sources juridiques</div>
              <div className="text-xs text-gray-600">Code de la consommation</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900 text-sm">RGPD compliant</div>
              <div className="text-xs text-gray-600">Données non conservées</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
              <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="font-medium text-gray-900 text-sm">Rapide et efficace</div>
              <div className="text-xs text-gray-600">Généré en 2 minutes</div>
            </div>
          </div>

          {/* ✅ BOUTONS D'ACTION PRINCIPAUX */}
          <div className="space-y-4">
            <button
              onClick={handleContinue}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl transition-all transform hover:scale-105 shadow-lg"
            >
              <ArrowRight className="w-5 h-5 mr-2 inline" />
              Générer ma lettre de mise en demeure
            </button>

            <button
              onClick={onRestart}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              Recommencer pour un autre cas
            </button>
          </div>
        </div>
      </Container>
    </motion.div>
  );
};

// ✅ COMPOSANT POUR LES RÉSULTATS INÉLIGIBLES
const IneligibleResults: React.FC<{
  result: EligibilityResult;
  data: EligibilityData;
  onRestart: () => void;
}> = ({ result, data, onRestart }) => {
  const primaryReason = result.reasons?.[0] || 'no_defect';
  const reasonInfo = INELIGIBILITY_MESSAGES[primaryReason];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50"
    >
      <Container variant="form" className="py-12">
        <div className="text-center">
          {/* ✅ ICÔNE D'INFO */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-orange-100 rounded-full mb-8"
          >
            <Info className="w-12 h-12 text-orange-600" />
          </motion.div>

          {/* ✅ TITRE */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Situation non éligible
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Votre situation ne correspond pas aux critères de la garantie légale de conformité, mais{' '}
            <strong>d'autres solutions existent</strong> pour vous aider.
          </p>

          {/* ✅ RAISON PRINCIPALE */}
          {reasonInfo && (
            <div className="bg-white rounded-2xl shadow-lg border border-orange-200 p-6 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-orange-100 rounded-xl text-orange-600">
                  {reasonInfo.icon}
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{reasonInfo.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{reasonInfo.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* ✅ SOLUTIONS ALTERNATIVES MODERNES */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
            <h2 className="font-bold text-gray-900 mb-6 text-lg">
              🔧 Solutions alternatives recommandées
            </h2>
            <div className="grid gap-4">
              {ALTERNATIVES.map(alternative => {
                const Icon = alternative.icon;
                return (
                  <a
                    key={alternative.id}
                    href={alternative.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group"
                  >
                    <div className={`p-3 rounded-xl bg-white ${alternative.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {alternative.title}
                        {alternative.primary && (
                          <Badge className="ml-2 bg-orange-100 text-orange-700 text-xs">
                            Recommandé
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 leading-relaxed">
                        {alternative.description}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* ✅ BOUTONS D'ACTION */}
          <div className="space-y-4">
            <button
              onClick={onRestart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg"
            >
              <RefreshCw className="w-5 h-5 mr-2 inline" />
              Recommencer le test d'éligibilité
            </button>

            <a
              href="/guides"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors text-center"
            >
              Consulter tous nos guides
            </a>
          </div>

          {/* ✅ DISCLAIMER JURIDIQUE */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-xs text-blue-800 leading-relaxed">
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
