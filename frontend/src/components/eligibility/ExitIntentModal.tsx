'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ExitIntentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

const ExitIntentModal: React.FC<ExitIntentModalProps> = ({ isOpen, onClose, onContinue }) => {
  // Gestion de l'échappement clavier
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-in fade-in-0 duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-modal-title"
    >
      <div
        className="bg-white rounded-lg max-w-md w-full p-6 animate-in zoom-in-95 duration-200 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Bouton fermeture */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 touch-target"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          {/* Icône d'attention */}
          <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-full mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>

          {/* Titre */}
          <h3 id="exit-modal-title" className="text-xl font-semibold text-gray-900 mb-3">
            Ne partez pas maintenant !
          </h3>

          {/* Message */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            Il ne vous reste que quelques questions pour connaître vos droits. Continuez pour
            découvrir si vous pouvez obtenir une réparation gratuite.
          </p>

          {/* Motivations */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                Test 100% gratuit et confidentiel
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                Résultat en moins de 2 minutes
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></span>
                Conseils juridiques gratuits inclus
              </li>
            </ul>
          </div>

          {/* Boutons d'action */}
          <div className="space-y-3">
            <button
              onClick={onContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors touch-target"
            >
              Continuer le test (moins d'1 minute)
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors touch-target"
            >
              Quitter définitivement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitIntentModal;
