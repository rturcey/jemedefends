// src/components/guides/GuideErrorFallback.tsx
// Composant de fallback pour les erreurs de chargement des guides

'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import React from 'react';

interface GuideErrorFallbackProps {
  error: Error;
  onRetry?: () => void;
  className?: string;
}

export default function GuideErrorFallback({
  error,
  onRetry,
  className = '',
}: GuideErrorFallbackProps) {
  return (
    <div className={`bg-white rounded-xl border border-red-200 p-6 shadow-sm ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Une erreur est survenue
          </h3>
          
          <div className="space-y-3">
            <p className="text-red-800 leading-relaxed">
              {error.message || 'Une erreur inattendue s\'est produite lors du chargement du guide.'}
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">
                <strong>Cause probable :</strong> Problème de connexion ou contenu temporairement indisponible.
              </p>
            </div>
            
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Réessayer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}