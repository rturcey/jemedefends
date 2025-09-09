'use client';

import { ChevronRight, Shield, Clock, FileText } from 'lucide-react';
import React from 'react';

interface EligibilityHeroProps {
  onStartTest: () => void;
}

const EligibilityHero: React.FC<EligibilityHeroProps> = ({ onStartTest }) => {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto text-center">
        {/* Badge de confiance */}
        <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-in slide-in-from-top-1">
          <Shield className="w-4 h-4 mr-2" />
          Gratuit • Confidentiel • Sans engagement
        </div>

        {/* Titre principal */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
          Testez votre éligibilité à la
          <span className="text-blue-600"> garantie légale</span>
        </h1>

        {/* Sous-titre */}
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto">
          Découvrez en 2 minutes si vous pouvez obtenir la réparation, le remplacement ou le
          remboursement de votre achat défectueux.
        </p>

        {/* Points de réassurance */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-sm">
          <div className="flex items-center justify-center bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <Clock className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" />
            <span className="font-medium">2 minutes</span>
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <FileText className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
            <span className="font-medium">100% gratuit</span>
          </div>
          <div className="flex items-center justify-center bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <Shield className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0" />
            <span className="font-medium">Données sécurisées</span>
          </div>
        </div>

        {/* CTA principal */}
        <button
          onClick={onStartTest}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 text-lg shadow-button hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 min-h-button"
          aria-label="Commencer le test d'éligibilité gratuit"
        >
          Commencer le test
          <ChevronRight className="w-5 h-5 ml-2 inline" />
        </button>

        {/* Social proof */}
        <p className="text-xs text-gray-500 mt-6">
          <strong>15 247</strong> consommateurs accompagnés cette année
        </p>

        {/* Mentions légales courtes */}
        <p className="text-xs text-gray-400 mt-4 max-w-md mx-auto">
          Test basé sur le Code de la consommation. Ne constitue pas un conseil juridique
          individualisé.
        </p>
      </div>
    </section>
  );
};

export default EligibilityHero;
