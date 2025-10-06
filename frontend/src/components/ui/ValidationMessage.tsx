// src/components/ui/ValidationMessage.tsx - Version harmonisée
'use client';

import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import React, { useState } from 'react';

interface ValidationMessageProps {
  type: 'error' | 'warning' | 'success' | 'info';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  variant?: 'default' | 'compact' | 'inline';
}

/**
 * Message de validation harmonisé avec animations fluides
 * Optimisé mobile-first avec variants adaptatifs
 */
const ValidationMessage: React.FC<ValidationMessageProps> = ({
  type,
  message,
  action,
  className = '',
  dismissible = false,
  onDismiss,
  variant = 'default',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 200);
  };

  const styles = {
    error: {
      container: 'bg-red-50 text-red-800 border-red-200',
      icon: 'text-red-500',
      button: 'text-red-600 hover:text-red-800 focus:ring-red-500',
    },
    warning: {
      container: 'bg-yellow-50 text-yellow-800 border-yellow-200',
      icon: 'text-yellow-500',
      button: 'text-yellow-600 hover:text-yellow-800 focus:ring-yellow-500',
    },
    success: {
      container: 'bg-green-50 text-green-800 border-green-200',
      icon: 'text-green-500',
      button: 'text-green-600 hover:text-green-800 focus:ring-green-500',
    },
    info: {
      container: 'bg-blue-50 text-blue-800 border-blue-200',
      icon: 'text-blue-500',
      button: 'text-blue-600 hover:text-blue-800 focus:ring-blue-500',
    },
  };

  const icons = {
    error: XCircle,
    warning: AlertTriangle,
    success: CheckCircle,
    info: Info,
  };

  const Icon = icons[type];
  const style = styles[type];

  const containerClasses = clsx(
    'border transition-all duration-200',
    style.container,
    {
      // Variants de taille
      'p-4 rounded-xl': variant === 'default',
      'p-3 rounded-lg': variant === 'compact',
      'p-2 rounded-md': variant === 'inline',
    },
    className,
  );

  const iconSize = variant === 'compact' || variant === 'inline' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={containerClasses}
          role="alert"
        >
          <div className="flex items-start">
            {/* Icône */}
            <div className={clsx('flex-shrink-0 mt-0.5 mr-3', style.icon)}>
              <Icon className={iconSize} />
            </div>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <p
                className={clsx('font-medium leading-relaxed', {
                  'text-sm': variant === 'compact' || variant === 'inline',
                  'text-base': variant === 'default',
                })}
              >
                {message}
              </p>

              {/* Action optionnelle */}
              {action && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  onClick={action.onClick}
                  className={clsx(
                    'mt-2 text-sm underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded transition-colors',
                    style.button,
                  )}
                >
                  {action.label}
                </motion.button>
              )}
            </div>

            {/* Bouton de fermeture */}
            {dismissible && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                type="button"
                className={clsx(
                  'flex-shrink-0 ml-3 p-1 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
                  style.button,
                )}
                onClick={handleDismiss}
              >
                <span className="sr-only">Fermer</span>
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ValidationMessage;
