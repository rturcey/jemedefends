// src/components/ui/ErrorAlert.tsx
'use client';

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
  className?: string;
  variant?: 'error' | 'warning' | 'info';
  showIcon?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const ErrorAlert = memo<ErrorAlertProps>(
  ({
    message,
    onDismiss,
    className = '',
    variant = 'error',
    showIcon = true,
    autoClose = false,
    autoCloseDelay = 5000,
  }) => {
    const { shouldUseSimpleAnimations, isMobile } = useMobileOptimization();
    const [isVisible, setIsVisible] = React.useState(true);

    // Auto close
    React.useEffect(() => {
      if (autoClose && autoCloseDelay > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => onDismiss?.(), 300);
        }, autoCloseDelay);

        return () => clearTimeout(timer);
      }
    }, [autoClose, autoCloseDelay, onDismiss]);

    const handleDismiss = () => {
      setIsVisible(false);
      setTimeout(() => onDismiss?.(), shouldUseSimpleAnimations ? 100 : 300);
    };

    // Styles selon le variant
    const getAlertStyles = () => {
      const baseStyles = 'rounded-lg border p-4 flex items-start gap-3';

      switch (variant) {
        case 'error':
          return `${baseStyles} bg-red-50 border-red-200 text-red-800`;
        case 'warning':
          return `${baseStyles} bg-yellow-50 border-yellow-200 text-yellow-800`;
        case 'info':
          return `${baseStyles} bg-blue-50 border-blue-200 text-blue-800`;
        default:
          return `${baseStyles} bg-red-50 border-red-200 text-red-800`;
      }
    };

    // Icônes selon le variant
    const renderIcon = () => {
      if (!showIcon) return null;

      const iconClass = `w-5 h-5 flex-shrink-0 ${isMobile ? 'mt-0.5' : ''}`;

      switch (variant) {
        case 'error':
          return (
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          );
        case 'warning':
          return (
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          );
        case 'info':
          return (
            <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          );
        default:
          return null;
      }
    };

    // Animations adaptées mobile
    const alertVariants = {
      hidden: {
        opacity: 0,
        y: shouldUseSimpleAnimations ? 0 : -10,
        scale: shouldUseSimpleAnimations ? 1 : 0.95,
      },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: shouldUseSimpleAnimations ? 0.15 : 0.3,
          ease: 'easeOut',
        },
      },
      exit: {
        opacity: 0,
        y: shouldUseSimpleAnimations ? 0 : -10,
        scale: shouldUseSimpleAnimations ? 1 : 0.95,
        transition: {
          duration: shouldUseSimpleAnimations ? 0.1 : 0.2,
          ease: 'easeIn',
        },
      },
    };

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            variants={alertVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`${getAlertStyles()} ${className}`}
            role="alert"
            aria-live="polite"
            aria-atomic="true"
          >
            {renderIcon()}

            <div className="flex-1">
              <p className={`font-medium ${isMobile ? 'text-sm' : 'text-sm'}`}>{message}</p>
            </div>

            {onDismiss && (
              <button
                type="button"
                onClick={handleDismiss}
                className={`
                flex-shrink-0 rounded-md p-1.5 hover:bg-black/10 focus:outline-none 
                transition-colors touch-manipulation
                ${isMobile ? 'min-w-[44px] min-h-[44px] -m-1' : ''}
              `}
                aria-label="Fermer l'alerte"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }
);

ErrorAlert.displayName = 'ErrorAlert';

export default ErrorAlert;
