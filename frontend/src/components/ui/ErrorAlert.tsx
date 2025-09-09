'use client';
import clsx from 'clsx';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';
import * as React from 'react';

export type AlertType = 'error' | 'warning' | 'success' | 'info';

export interface ErrorAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Type d'alerte */
  type?: AlertType;
  /** Titre de l'alerte */
  title?: string;
  /** Message principal */
  message?: string | React.ReactNode;
  /** Contenu children */
  children?: React.ReactNode;
  /** Permettre de fermer l'alerte */
  dismissible?: boolean;
  /** Callback lors de la fermeture */
  onDismiss?: () => void;
  /** Variante compact */
  compact?: boolean;
}

/** Component d'alerte polyvalent pour messages d'erreur, avertissement, succès ou info. */
export default function ErrorAlert({
  type = 'info',
  title,
  message,
  children,
  dismissible = false,
  onDismiss,
  compact = false,
  className,
  ...rest
}: ErrorAlertProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const config = {
    error: {
      icon: XCircle,
      bgClass: 'bg-red-50',
      borderClass: 'border-red-200',
      iconClass: 'text-red-600',
      titleClass: 'text-red-800',
      textClass: 'text-red-700',
    },
    warning: {
      icon: AlertTriangle,
      bgClass: 'bg-yellow-50',
      borderClass: 'border-yellow-200',
      iconClass: 'text-yellow-600',
      titleClass: 'text-yellow-800',
      textClass: 'text-yellow-700',
    },
    success: {
      icon: CheckCircle,
      bgClass: 'bg-green-50',
      borderClass: 'border-green-200',
      iconClass: 'text-green-600',
      titleClass: 'text-green-800',
      textClass: 'text-green-700',
    },
    info: {
      icon: Info,
      bgClass: 'bg-blue-50',
      borderClass: 'border-blue-200',
      iconClass: 'text-blue-600',
      titleClass: 'text-blue-800',
      textClass: 'text-blue-700',
    },
  };

  const { icon: Icon, bgClass, borderClass, iconClass, titleClass, textClass } = config[type];

  return (
    <div
      role="alert"
      className={clsx(
        'rounded-xl border',
        bgClass,
        borderClass,
        compact ? 'p-3' : 'p-4',
        className,
      )}
      {...rest}
    >
      <div className="flex items-start gap-3">
        <div className={clsx('flex-shrink-0', compact ? 'mt-0.5' : 'mt-1')}>
          <Icon className={clsx(iconClass, compact ? 'h-4 w-4' : 'h-5 w-5')} aria-hidden="true" />
        </div>

        <div className="flex-1 min-w-0">
          {title && (
            <h3
              className={clsx(
                'font-semibold',
                titleClass,
                compact ? 'text-sm' : 'text-base',
                !message && !children && 'mb-0',
              )}
            >
              {title}
            </h3>
          )}

          {message && (
            <div className={clsx(textClass, compact ? 'text-xs' : 'text-sm', title && 'mt-1')}>
              {message}
            </div>
          )}

          {children && (
            <div
              className={clsx(
                textClass,
                compact ? 'text-xs' : 'text-sm',
                (title || message) && 'mt-2',
              )}
            >
              {children}
            </div>
          )}
        </div>

        {dismissible && (
          <button
            type="button"
            onClick={handleDismiss}
            className={clsx(
              'flex-shrink-0 rounded-lg p-1 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2',
              textClass,
              'focus:ring-current',
            )}
            aria-label="Fermer l'alerte"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
