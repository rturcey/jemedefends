// frontend/src/components/form/MagicImprovement.tsx - Design original + Fix

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AIService from '@/services/aiService';

interface MagicImprovementProps {
  userText: string;
  onTextChange: (newText: string) => void;
  onValidationStateChange: (isValidated: boolean) => void;
  isDigital: boolean;
  productName?: string;
  className?: string;
}

type MagicState = 'idle' | 'improving' | 'ready' | 'user-chosen' | 'ai-chosen' | 'error';

const MagicImprovement: React.FC<MagicImprovementProps> = ({
  userText,
  onTextChange,
  onValidationStateChange,
  isDigital,
  productName,
  className = '',
}) => {
  const [magicState, setMagicState] = useState<MagicState>('idle');
  const [improvedText, setImprovedText] = useState('');

  const canImprove = userText.trim().length >= 15;
  const needsChoice = magicState === 'ready';
  const hasValidated = magicState === 'user-chosen' || magicState === 'ai-chosen';

  // Informer le parent de l'état de validation
  useEffect(() => {
    console.log('🔧 MagicImprovement state change:', { magicState, hasValidated });
    onValidationStateChange(hasValidated);
  }, [hasValidated, onValidationStateChange, magicState]);

  // Reset state when user text changes significantly (mais pas quand on vient de choisir l'IA)
  useEffect(() => {
    if (magicState !== 'idle' && magicState !== 'improving' && magicState !== 'ai-chosen') {
      setMagicState('idle');
    }
  }, [userText]);

  const handleMagicImprovement = async () => {
    if (!canImprove) return;

    setMagicState('improving');

    try {
      const response = await AIService.reformulateTextProfessional(
        userText,
        'défaut de conformité pour lettre juridique de garantie légale',
      );

      if (response.success && response.reformulated_text !== userText.trim()) {
        setImprovedText(response.reformulated_text);
        setMagicState('ready');
      } else {
        // Si pas d'amélioration possible, considérer comme validé
        setMagicState('user-chosen');
      }
    } catch (error) {
      console.error('Erreur amélioration:', error);
      setMagicState('error');
      setTimeout(() => setMagicState('idle'), 3000);
    }
  };

  const chooseAI = () => {
    console.log('🔧 Choix IA - Avant:', { magicState, hasValidated });
    // ✅ FIX: Changer l'état AVANT de changer le texte
    setMagicState('ai-chosen');
    onTextChange(improvedText);
    console.log('🔧 Choix IA - Après setMagicState');
  };

  const chooseUser = () => {
    console.log('🔧 Choix User - Avant:', { magicState, hasValidated });
    setMagicState('user-chosen');
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Magic Button - Design sobre */}
      <AnimatePresence mode="wait">
        {magicState === 'idle' && canImprove && (
          <motion.div
            key="magic-button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-center"
          >
            <button
              onClick={handleMagicImprovement}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Améliorer avec l'IA
            </button>
          </motion.div>
        )}

        {magicState === 'improving' && (
          <motion.div
            key="improving"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-3 py-4"
          >
            <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="text-sm text-blue-600 font-medium">Amélioration en cours...</span>
          </motion.div>
        )}

        {magicState === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-2"
          >
            <span className="text-sm text-red-600">❌ Erreur lors de l'amélioration</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison et choix - Design sobre ORIGINAL */}
      <AnimatePresence>
        {needsChoice && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4"
          >
            {/* En-tête discret */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">Suggestion d'amélioration</span>
            </div>

            {/* Aperçu dans la lettre */}
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
                Aperçu dans votre lettre
              </div>
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  Or, ce <span className="font-medium">{isDigital ? 'service' : 'bien'}</span>{' '}
                  présente un{' '}
                  <span className="font-semibold text-red-700">défaut de conformité</span>.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-2 rounded">
                  <span className="font-semibold text-gray-900">{improvedText}</span>
                </div>
              </div>
            </div>

            {/* Comparaison discrète */}
            <div className="grid grid-cols-1 gap-3 text-xs">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="text-gray-500 font-medium">Votre version :</span>
                  <p className="text-gray-600 italic">"{userText}"</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="text-blue-600 font-medium">Version optimisée :</span>
                  <p className="text-blue-800">"{improvedText}"</p>
                </div>
              </div>
            </div>

            {/* Boutons de choix - Design sobre */}
            <div className="flex gap-3 pt-2 border-t border-gray-200">
              <button
                onClick={chooseUser}
                className="flex-1 bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Garder ma version
              </button>
              <button
                onClick={chooseAI}
                className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Utiliser la version IA
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ SUPPRIMÉ: Badge de validation (plus de badge du tout) */}

      {/* Conseil discret si pas assez de contenu */}
      {!canImprove && userText.length > 0 && (
        <div className="text-center text-xs text-gray-500">
          💡 Continuez à décrire pour débloquer l'amélioration automatique
        </div>
      )}
    </div>
  );
};

export default MagicImprovement;
