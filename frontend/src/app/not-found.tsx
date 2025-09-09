import { AlertTriangle, Home, Search, MessageCircle } from 'lucide-react';
import React from 'react';

import { Container } from '@/components/ui';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* Illustration d'erreur */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-12 h-12 text-amber-600" />
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-gray-200 mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Page introuvable</h2>
            <p className="text-gray-600 text-lg">Cette page n'existe pas ou a été déplacée.</p>
          </div>

          {/* Actions rapides */}
          <div className="space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl transition-colors"
              >
                <Home className="w-5 h-5" />
                Accueil
              </a>

              <a
                href="/guides"
                className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-xl transition-colors"
              >
                <Search className="w-5 h-5" />
                Guides
              </a>

              <a
                href="/contact"
                className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-6 rounded-xl transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Contact
              </a>
            </div>
          </div>

          {/* Liens utiles */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">🔍 Peut-être cherchiez-vous :</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <a href="/eligibilite" className="text-blue-600 hover:text-blue-700 text-left">
                → Vérifier mon éligibilité
              </a>
              <a href="/faq" className="text-blue-600 hover:text-blue-700 text-left">
                → Questions fréquentes
              </a>
              <a href="/formulaire" className="text-blue-600 hover:text-blue-700 text-left">
                → Créer ma lettre
              </a>
              <a
                href="/guides/garantie-legale"
                className="text-blue-600 hover:text-blue-700 text-left"
              >
                → Guide garantie légale
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
