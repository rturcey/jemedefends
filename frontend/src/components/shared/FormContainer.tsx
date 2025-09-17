// src/components/shared/FormContainer.tsx - Container spécialisé pour formulaires
'use client';

import { motion } from 'framer-motion';
import * as React from 'react';

import Container from '@/components/ui/Container';
import TrustIndicators from './TrustIndicators';

interface FormContainerProps {
  children: React.ReactNode;
  variant?: 'eligibility' | 'form';
  showTrustIndicators?: boolean;
  trustVariant?: 'eligibility' | 'form' | 'payment';
  className?: string;
  withBackground?: boolean;
}

/**
 * Container spécialisé pour les formulaires avec trust indicators intégrés
 * Hérite de Container mais ajoute des optimisations formulaires
 */
const FormContainer: React.FC<FormContainerProps> = ({
  children,
  variant = 'form',
  showTrustIndicators = true,
  trustVariant,
  className = '',
  withBackground = true,
}) => {
  const containerAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
        staggerChildren: 0.1,
      },
    },
  };

  const childAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className={withBackground ? 'min-h-screen bg-gray-50' : ''}>
      <Container variant="form" className={`space-y-6 ${className}`}>
        <motion.div
          variants={containerAnimation}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Contenu principal */}
          <motion.div variants={childAnimation}>{children}</motion.div>

          {/* Trust indicators automatiques */}
          {showTrustIndicators && (
            <motion.div variants={childAnimation}>
              <TrustIndicators variant={trustVariant || variant} size="md" showBackground={true} />
            </motion.div>
          )}
        </motion.div>
      </Container>
    </div>
  );
};

export default FormContainer;
