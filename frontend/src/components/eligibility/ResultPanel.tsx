// src/components/eligibility/ResultPanel.tsx - VERSION MODERNE REFACTORISÉE
'use client';

import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  X,
  Info,
  ExternalLink,
  Shield,
  Clock,
  MessageSquareWarning,
  Scale,
  Handshake,
  ShieldCheck,
} from 'lucide-react';
import React from 'react';

import Badge from '@/components/ui/Badge';

interface ResultPanelProps {
  result: {
    isEligible: boolean;
    reasons?: string[];
    timing?: {
      monthsSincePurchase?: number;
      withinTwoYears?: boolean;
      presumptionSellerBurden?: boolean;
    };
  };
  onRestart: () => void;
  onClose?: () => void;
}

// ✅ ALTERNATIVES COMPACTES POUR LE PANEL
const ALTERNATIVES_COMPACT = [
  {
    id: 'signalconso',
    title: 'SignalConso',
    description: 'Signaler à la DGCCRF',
    url: 'https://signal.conso.gouv.fr/',
    icon: MessageSquareWarning,
    color: 'text-orange-600',
    primary: true,
  },
  {
    id: 'mediation',
    title: 'Médiation',
    description: 'Résolution amiable gratuite',
    url: 'https://www.economie.gouv.fr/mediation-conso',
    icon: Scale,
    color: 'text-blue-600',
  },
  {
    id: 'assistance',
    title: 'Aide juridique',
    description: 'Consultations gratuites',
    url: 'https://www.service-public.fr/particuliers/vosdroits/F20153',
    icon: ShieldCheck,
    color: 'text-purple-600',
  },
];

const ResultPanel: React.FC<ResultPanelProps> = ({ result, onRestart, onClose }) => {
  const handleContinue = () => {
    window.location.href = '/formulaire';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-md w-full mx-4 overflow-hidden"
    >
      {/* ✅ HEADER AVEC BOUTON FERMER */}
      {onClose && (
        <div className="flex justify-end p-4 pb-0">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      )}

      {result.isEligible ? (
        <EligiblePanel onContinue={handleContinue} onRestart={onRestart} />
      ) : (
        <IneligiblePanel reasons={result.reasons} onRestart={onRestart} />
      )}
    </motion.div>
  );
};

// ✅ PANEL ÉLIGIBLE
const EligiblePanel: React.FC<{
  onContinue: () => void;
  onRestart: () => void;
}> = ({ onContinue, onRestart }) => {
  return (
    <div className="p-6 text-center">
      {/* ✅ ICÔNE DE SUCCÈS */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
      >
        <CheckCircle className="w-8 h-8 text-green-600" />
      </motion.div>

      {/* ✅ TITRE ET MESSAGE */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">🎉 Vous êtes éligible !</h2>
      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
        Votre situation correspond aux critères de la <strong>garantie légale de conformité</strong>
        . Générons votre lettre de mise en demeure.
      </p>

      {/* ✅ TRUST INDICATORS COMPACTS */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="text-center">
          <Shield className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <div className="text-xs text-gray-600">Juridique</div>
        </div>
        <div className="text-center">
          <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <div className="text-xs text-gray-600">RGPD</div>
        </div>
        <div className="text-center">
          <Clock className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <div className="text-xs text-gray-600">Rapide</div>
        </div>
      </div>

      {/* ✅ BOUTONS D'ACTION */}
      <div className="space-y-3">
        <button
          onClick={onContinue}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
        >
          <ArrowRight className="w-4 h-4 mr-2 inline" />
          Générer ma lettre
        </button>

        <button
          onClick={onRestart}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4 mr-2 inline" />
          Autre cas
        </button>
      </div>
    </div>
  );
};

// ✅ PANEL INÉLIGIBLE
const IneligiblePanel: React.FC<{
  reasons?: string[];
  onRestart: () => void;
}> = ({ reasons, onRestart }) => {
  return (
    <div className="p-6 text-center">
      {/* ✅ ICÔNE D'INFO */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4"
      >
        <Info className="w-8 h-8 text-orange-600" />
      </motion.div>

      {/* ✅ TITRE ET MESSAGE */}
      <h2 className="text-xl font-bold text-gray-900 mb-2">Non éligible</h2>
      <p className="text-gray-600 text-sm mb-6 leading-relaxed">
        Votre situation ne correspond pas aux critères de la garantie légale, mais{' '}
        <strong>d'autres solutions existent</strong>.
      </p>

      {/* ✅ ALTERNATIVES COMPACTES */}
      <div className="space-y-3 mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Solutions alternatives :</h3>
        {ALTERNATIVES_COMPACT.map(alternative => {
          const Icon = alternative.icon;
          return (
            <a
              key={alternative.id}
              href={alternative.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group text-left"
            >
              <div className={`p-2 rounded-lg bg-white ${alternative.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                  {alternative.title}
                  {alternative.primary && (
                    <Badge className="ml-1 bg-orange-100 text-orange-700 text-xs">Top</Badge>
                  )}
                </div>
                <div className="text-xs text-gray-600">{alternative.description}</div>
              </div>
              <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
            </a>
          );
        })}
      </div>

      {/* ✅ BOUTONS D'ACTION */}
      <div className="space-y-3">
        <button
          onClick={onRestart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
        >
          <RefreshCw className="w-4 h-4 mr-2 inline" />
          Recommencer le test
        </button>

        <a
          href="/guides"
          className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
        >
          Voir tous les guides
        </a>
      </div>

      {/* ✅ DISCLAIMER COMPACT */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800 leading-relaxed">
          ⚖️ Diagnostic basé sur le Code de la consommation. Ne constitue pas un conseil juridique
          personnalisé.
        </p>
      </div>
    </div>
  );
};

export default ResultPanel;
