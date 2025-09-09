// frontend/src/components/common/ErrorBoundary.tsx - VERSION AMÉLIORÉE

'use client';

import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  fallback?: React.ComponentType<{
    error?: Error;
    errorInfo?: React.ErrorInfo;
    resetError: () => void;
  }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({ errorInfo });

    // Callback personnalisé pour la remontée d'erreur
    this.props.onError?.(error, errorInfo);

    // Analytics tracking
    try {
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'exception', {
          description: error.toString(),
          fatal: false,
          page_location: window.location.href,
          error_stack: error.stack?.substring(0, 150) || 'unknown',
        });
      }
    } catch (analyticsError) {
      console.warn('Analytics error tracking failed:', analyticsError);
    }

    // Tentative de récupération automatique après 5 secondes (optionnel)
    if (process.env.NODE_ENV === 'production') {
      this.resetTimeoutId = window.setTimeout(() => {
        this.resetError();
      }, 5000);
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetError = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
      this.resetTimeoutId = null;
    }
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Utilise le fallback personnalisé si fourni
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            resetError={this.resetError}
          />
        );
      }

      // Fallback par défaut mobile-first
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center">
            {/* Icône d'erreur */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            {/* Message principal */}
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Une erreur s'est produite</h1>

            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Nous nous excusons pour la gêne occasionnée. Vous pouvez essayer de rafraîchir la page
              ou revenir à l'accueil.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.resetError}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Réessayer
              </button>

              <a
                href="/"
                className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                Accueil
              </a>
            </div>

            {/* Bouton de rafraîchissement complet */}
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Ou rafraîchir la page complète
            </button>

            {/* Auto-recovery notice en production */}
            {process.env.NODE_ENV === 'production' && (
              <p className="mt-4 text-xs text-gray-400">
                Récupération automatique dans quelques secondes...
              </p>
            )}

            {/* Détails de l'erreur en développement */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer mb-2">
                  Détails de l'erreur (développement)
                </summary>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="text-xs text-red-600 font-mono mb-2">
                    {this.state.error.message}
                  </div>
                  <pre className="text-xs text-gray-600 overflow-auto max-h-32 whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Hook pour utiliser ErrorBoundary de manière programmatique
export function useErrorHandler() {
  return React.useCallback((error: Error, errorInfo?: React.ErrorInfo) => {
    // Force le re-render avec erreur pour déclencher l'ErrorBoundary
    throw error;
  }, []);
}

// HOC pour wrapper facilement des composants
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{
    error?: Error;
    errorInfo?: React.ErrorInfo;
    resetError: () => void;
  }>,
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
