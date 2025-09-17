// src/components/shared/TrustIndicators.tsx - Nouveau composant
'use client';

import { motion } from 'framer-motion';
import { Shield, Clock, CheckCircle, Lock, FileText, MapPin } from 'lucide-react';
import * as React from 'react';

interface TrustIndicator {
  icon: React.ReactNode;
  label: string;
  color?: string;
}

interface TrustIndicatorsProps {
  variant?: 'eligibility' | 'form' | 'payment' | 'custom';
  indicators?: TrustIndicator[];
  layout?: 'horizontal' | 'grid';
  size?: 'sm' | 'md' | 'lg';
  showBackground?: boolean;
  className?: string;
}

/**
 * Badges de confiance standardisés pour tous les formulaires
 * Variations selon le contexte (éligibilité, formulaire, paiement)
 */
const TrustIndicators: React.FC<TrustIndicatorsProps> = ({
  variant = 'eligibility',
  indicators,
  layout = 'horizontal',
  size = 'md',
  showBackground = true,
  className = '',
}) => {
  // Indicateurs prédéfinis par contexte
  const defaultIndicators: Record<string, TrustIndicator[]> = {
    eligibility: [
      { icon: <CheckCircle className="w-4 h-4" />, label: '100% gratuit', color: 'text-green-700' },
      { icon: <Clock className="w-4 h-4" />, label: '2 minutes', color: 'text-blue-700' },
      { icon: <Shield className="w-4 h-4" />, label: 'Confidentiel', color: 'text-green-700' },
    ],
    form: [
      {
        icon: <MapPin className="w-4 h-4" />,
        label: 'Hébergement français',
        color: 'text-green-700',
      },
      { icon: <Shield className="w-4 h-4" />, label: 'RGPD compliant', color: 'text-green-700' },
      {
        icon: <FileText className="w-4 h-4" />,
        label: 'Articles vérifiés',
        color: 'text-green-700',
      },
    ],
    payment: [
      { icon: <Lock className="w-4 h-4" />, label: 'Paiement sécurisé', color: 'text-green-700' },
      { icon: <MapPin className="w-4 h-4" />, label: 'Stancer France', color: 'text-blue-700' },
      { icon: <Shield className="w-4 h-4" />, label: 'Données protégées', color: 'text-green-700' },
    ],
  };

  const displayIndicators =
    indicators || defaultIndicators[variant] || defaultIndicators.eligibility;

  const containerAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 },
    },
  };

  const sizeClasses = {
    sm: 'text-xs gap-4 p-3',
    md: 'text-sm gap-6 p-4',
    lg: 'text-base gap-8 p-6',
  };

  const backgroundClasses = showBackground
    ? variant === 'payment'
      ? 'bg-blue-50 border border-blue-200 rounded-xl'
      : 'bg-green-50 border border-green-200 rounded-xl'
    : '';

  return (
    <motion.div
      variants={containerAnimation}
      initial="hidden"
      animate="visible"
      className={`${backgroundClasses} ${sizeClasses[size]} ${className}`}
    >
      {/* Titre optionnel pour certains variants */}
      {(variant === 'form' || variant === 'payment') && showBackground && (
        <motion.h3
          variants={itemAnimation}
          className={`font-semibold mb-2 text-center ${
            variant === 'payment' ? 'text-blue-900' : 'text-green-900'
          }`}
        >
          {variant === 'payment' ? '🔒 Paiement sécurisé' : '💡 Vos données sont protégées'}
        </motion.h3>
      )}

      {/* Indicateurs */}
      <div
        className={`
        flex items-center justify-center
        ${layout === 'grid' ? 'grid grid-cols-2 md:grid-cols-3' : 'flex-wrap'}
        ${sizeClasses[size]}
      `}
      >
        {displayIndicators.map((indicator, index) => (
          <motion.div key={index} variants={itemAnimation} className="flex items-center gap-2">
            <div className={`flex-shrink-0 ${indicator.color || 'text-gray-600'}`}>
              {indicator.icon}
            </div>
            <span className={`font-medium ${indicator.color || 'text-gray-700'}`}>
              {indicator.label}
            </span>

            {/* Séparateur pour layout horizontal (sauf dernier) */}
            {layout === 'horizontal' && index < displayIndicators.length - 1 && (
              <div className="w-1 h-1 bg-current opacity-30 rounded-full ml-2" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Message de disclaimer pour le formulaire */}
      {variant === 'form' && showBackground && (
        <motion.p
          variants={itemAnimation}
          className="text-xs text-green-700 text-center mt-2 leading-relaxed"
        >
          Collecte minimale de données • Transparence totale • Hébergement Scaleway
        </motion.p>
      )}
    </motion.div>
  );
};

export default TrustIndicators;
