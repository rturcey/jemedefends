'use client';

import { AlertTriangle, RefreshCw, MessageCircle } from 'lucide-react';
import React from 'react';

import { Container, Button } from '@/components/ui';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* Illustration d'erreur */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-gray-200 mb-4">500</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Erreur serveur</h2>
            <p className="text-gray-600 text-lg">
              Une erreur technique temporaire s'est produite. Nos équipes ont été automatiquement
              alertées.
            </p>
          </div>

          {/* Status et actions */}
          <div className="space-y-6 mb-8">
            {/* Status du service */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="font-bold text-red-900 mb-3">🔧 Que pouvez-vous faire ?</h3>
              <div className="space-y-2 text-sm text-red-800">
                <p>• Actualiser la page dans quelques minutes</p>
                <p>• Vérifier notre statut en temps réel</p>
                <p>• Nous signaler le problème si persistant</p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={reset}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl"
              >
                <RefreshCw className="w-5 h-5" />
                Réessayer
              </Button>

              <a
                href="/contact"
                className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-xl transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Signaler le problème
              </a>
            </div>
          </div>

          {/* Info support */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">🎧 Support technique</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                <strong>Email :</strong>{' '}
                <a
                  href="mailto:support@jemedefends.fr"
                  className="text-blue-600 hover:text-blue-700"
                >
                  support@jemedefends.fr
                </a>
              </p>
              <p>
                <strong>Délai de réponse :</strong> 24h maximum
              </p>
              <p className="text-xs text-gray-500 mt-4">
                Merci d'indiquer l'heure exacte de l'erreur et les actions que vous effectuiez.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
