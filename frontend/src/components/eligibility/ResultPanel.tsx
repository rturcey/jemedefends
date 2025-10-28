// src/components/eligibility/ResultPanel.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Info,
  ExternalLink,
  Shield,
  Clock,
  Scale,
  ShieldCheck,
  MessageSquareWarning,
} from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface ResultPanelProps {
  result: {
    isEligible: boolean;
    reasons?: string[];
    timing?: {
      monthsSincePurchase?: number;
      withinTwoYears?: boolean;
      presumptionSellerBurden?: boolean;
      // autres champs possibles
    };
  };
  onRestart: () => void;
  onClose?: () => void;
}

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

const cardVariants = {
  initial: { opacity: 0, y: 8 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.25, ease: 'easeOut' },
  }),
};

const ContainerCard: React.FC<React.PropsWithChildren<{
  className?: string
}>> = ({ className = '', children }) => (
  <div
    className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 ${className}`}>{children}</div>
);

const SectionTitle: React.FC<React.PropsWithChildren<{
  className?: string
}>> = ({ className = '', children }) => (
  <h3 className={`text-sm font-medium text-gray-900 mb-3 ${className}`}>{children}</h3>
);

const HeaderBlock: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  tone: 'success' | 'danger' | 'info';
}> = ({ icon, title, subtitle, tone }) => {
  const tones = {
    success: 'from-green-50 to-emerald-50',
    danger: 'from-orange-50 to-amber-50',
    info: 'from-blue-50 to-indigo-50',
  } as const;

  return (
    <div className={`text-center mb-8`}>
      <div
        className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-gradient-to-br ${tones[tone]} border border-gray-200`}>
        {icon}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{title}</h2>
      {subtitle &&
        <p className="text-gray-600 text-sm md:text-base mt-2">{subtitle}</p>}
    </div>
  );
};

const EligibleCards: React.FC<{
  timing?: ResultPanelProps['result']['timing'];
}> = ({ timing }) => {
  const items = [
    {
      key: 'legal',
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      title: 'Base juridique solide',
      lines: ['Garantie légale de conformité', 'Critères réunis pour votre cas'],
    },
    {
      key: 'rgpd',
      icon: <CheckCircle className="w-6 h-6 text-green-600" />,
      title: 'Démarche sécurisée',
      lines: ['Données minimisées', 'Processus transparent'],
    },
    {
      key: 'time',
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      title: 'Délai conforme',
      lines: [
        timing?.withinTwoYears === false ? 'Attention au délai' : 'Dans le délai utile',
        timing?.presumptionSellerBurden ? 'Présomption 24/12 mois' : 'Conservez vos preuves',
      ],
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      {items.map((item, i) => (
        <motion.div key={item.key} variants={cardVariants} initial="initial"
                    animate="animate" custom={i}>
          <ContainerCard>
            <div className="flex items-start gap-4">
              <div className="shrink-0">{item.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">{item.title}</div>
                {item.lines.map((l, idx) => (
                  <p key={idx} className="text-sm text-gray-600">
                    {l}
                  </p>
                ))}
              </div>
            </div>
          </ContainerCard>
        </motion.div>
      ))}
    </div>
  );
};

const IneligibleCards: React.FC<{ reasons?: string[] }> = ({ reasons }) => {
  // On formate quelques motifs en texte lisible
  const normalized = (reasons ?? []).slice(0, 3).map((r) => {
    switch (r) {
      case 'seller_not_professional':
        return 'Achat auprès d’un particulier (hors champ de la garantie légale).';
      case 'not_consumer_use':
        return 'Achat pour un usage professionnel (hors définition de consommateur).';
      case 'territory_out_of_scope':
        return 'Vendeur hors UE/EEE ou activité non dirigée vers la France.';
      case 'time_barred_2y':
        return 'Dépassement du délai de 2 ans pour agir.';
      case 'subscription_ended':
        return 'Abonnement terminé (obligation de conformité non continue).';
      case 'no_defect':
        return 'Aucun défaut de conformité identifié.';
      default:
        return 'Conditions légales non réunies.';
    }
  });

  const items = [
    {
      key: 'why',
      icon: <Info className="w-6 h-6 text-orange-600" />,
      title: 'Pourquoi non éligible ?',
      lines: normalized.length ? normalized : ['Conditions légales non réunies.'],
    },
    {
      key: 'alt',
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
      title: 'Alternatives utiles',
      lines: ['SignalConso (DGCCRF)', 'Médiation de la consommation', 'Aides juridiques gratuites'],
    },
    {
      key: 'next',
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      title: 'Que faire maintenant ?',
      lines: ['Consultez notre guide dédié', 'Conservez vos pièces et preuves', 'Contactez le SAV/Pro par écrit'],
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      {items.map((item, i) => (
        <motion.div key={item.key} variants={cardVariants} initial="initial"
                    animate="animate" custom={i}>
          <ContainerCard>
            <div className="flex items-start gap-4">
              <div className="shrink-0">{item.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">{item.title}</div>
                {item.lines.map((l, idx) => (
                  <p key={idx} className="text-sm text-gray-600">
                    {l}
                  </p>
                ))}
              </div>
            </div>
          </ContainerCard>
        </motion.div>
      ))}
    </div>
  );
};

const EligibleCTAs: React.FC<{
  onContinue: () => void;
  onRestart: () => void
}> = ({ onContinue, onRestart }) => (
  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
    <button
      onClick={onContinue}
      className="h-14 w-full sm:w-64 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold px-6 transition-all transform hover:scale-[1.02] active:scale-[0.99]"
    >
      <ArrowRight className="w-4 h-4 mr-2 inline" />
      Générer ma lettre
    </button>
    <button
      onClick={onRestart}
      className="h-14 w-full sm:w-64 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 transition-colors"
    >
      <RefreshCw className="w-4 h-4 mr-2 inline" />
      Recommencer
    </button>
  </div>
);

const IneligibleCTAs: React.FC<{ onRestart: () => void }> = ({ onRestart }) => (
  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
    <a
      href="http://localhost:3000/guides/recours-non-eligible.yml"
      className="h-14 w-full sm:w-64 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold px-6 transition-all text-center flex items-center justify-center"
    >
      <ExternalLink className="w-4 h-4 mr-2" />
      Voir le guide dédié
    </a>
    <button
      onClick={onRestart}
      className="h-14 w-full sm:w-64 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-6 transition-colors"
    >
      <RefreshCw className="w-4 h-4 mr-2 inline" />
      Recommencer
    </button>
  </div>
);

const InfoFooter: React.FC<{
  tone?: 'blue' | 'green' | 'orange'
}> = ({ tone = 'blue' }) => {
  const map = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
  } as const;
  return (
    <div className={`rounded-xl p-4 border ${map[tone]}`}>
      <p className="text-xs md:text-sm leading-relaxed">
        ⚖️ Diagnostic fondé sur le Code de la consommation. Ceci n’est pas un conseil
        juridique personnalisé.
      </p>
    </div>
  );
};

const ResultPanel: React.FC<ResultPanelProps> = ({ result, onRestart, onClose }) => {
  const handleContinue = () => {
    window.location.href = '/formulaire';
  };

  // WRAPPER principal — mêmes largeurs que le Skeleton
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="max-w-4xl mx-auto p-4 md:p-8"
    >
      {/* Header + Close (optionnel) */}
      {onClose && (
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <XCircle className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      )}

      {/* Header visuel (aligné sur le skeleton) */}
      {result.isEligible ? (
        <HeaderBlock
          tone="success"
          icon={<CheckCircle className="w-8 h-8 text-green-600" />}
          title="🎉 Vous êtes éligible !"
          subtitle="Votre situation correspond aux critères de la garantie légale de conformité."
        />
      ) : (
        <HeaderBlock
          tone="danger"
          icon={<Info className="w-8 h-8 text-orange-600" />}
          title="Non éligible"
          subtitle="Votre situation ne correspond pas aux critères légaux. Des alternatives existent."
        />
      )}

      {/* Cards (mêmes blocs que le skeleton) */}
      {result.isEligible ? (
        <EligibleCards timing={result.timing} />
      ) : (
        <IneligibleCards reasons={result.reasons} />
      )}

      {/* CTAs alignés sur le skeleton */}
      {result.isEligible ? (
        <EligibleCTAs onContinue={handleContinue} onRestart={onRestart} />
      ) : (
        <IneligibleCTAs onRestart={onRestart} />
      )}

      {/* Info footer (cohérent avec skeleton “Additional info”) */}
      <InfoFooter tone={result.isEligible ? 'green' : 'blue'} />
    </motion.div>
  );
};

export default ResultPanel;
