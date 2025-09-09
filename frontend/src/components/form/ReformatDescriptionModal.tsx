'use client';

import React, { useEffect, useRef, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  initialText: string;
  onApply: (text: string, type: 'corrected' | 'reformulated') => void;
  onGenerate: (finalText?: string) => Promise<void>; // Nouveau : génération directe
  maxChars?: number;
  isSubmitting?: boolean; // État de génération
};

const ReformatDescriptionModal: React.FC<Props> = ({
  open,
  onClose,
  initialText,
  onApply,
  onGenerate,
  maxChars = 1200,
  isSubmitting = false,
}) => {
  const [workingText, setWorkingText] = useState(initialText || '');
  const [isBusy, setIsBusy] = useState(false);
  const [hasImprovedText, setHasImprovedText] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setWorkingText(initialText || '');
      setHasImprovedText(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [open, initialText]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !isSubmitting && onClose();
    const onClick = (e: MouseEvent) => {
      if (e.target === overlayRef.current && !isSubmitting) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open, onClose, isSubmitting]);

  const over = workingText.length > maxChars;
  const canGenerate = workingText.trim().length >= 20 && !over;

  // Amélioration du texte via IA
  const improveText = async (kind: 'corrected' | 'reformulated') => {
    if (isBusy || isSubmitting) return;
    setIsBusy(true);
    try {
      // TODO: Appeler votre service IA ici
      // Pour l'instant, on simule une amélioration basique
      let improvedText = workingText;

      if (kind === 'corrected') {
        // Simulation de correction (orthographe, ponctuation)
        improvedText = workingText
          .replace(/\s+/g, ' ')
          .replace(/\.{2,}/g, '.')
          .trim();
      } else if (kind === 'reformulated') {
        // Simulation de reformulation plus professionnelle
        improvedText = `Suite à l'achat de ce produit, j'ai constaté ${workingText.toLowerCase()}`;
      }

      setWorkingText(improvedText);
      setHasImprovedText(true);
      onApply(improvedText, kind);
    } finally {
      setIsBusy(false);
    }
  };

  // Génération directe avec le texte actuel
  const handleGenerate = async () => {
    if (!canGenerate || isSubmitting) return;

    // Si le texte a été modifié, l'appliquer d'abord
    if (workingText !== initialText) {
      onApply(workingText, hasImprovedText ? 'reformulated' : 'corrected');
    }

    // Puis déclencher la génération
    await onGenerate(workingText);
  };

  // Continuer sans améliorer
  const handleSkipAndGenerate = async () => {
    if (!canGenerate || isSubmitting) return;
    await onGenerate(workingText);
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reformat-title"
      className="fixed inset-0 z-[100] bg-black/40 flex md:items-center md:justify-center"
    >
      <div className="relative w-full h-full md:h-auto md:w-[720px] bg-white md:rounded-2xl md:shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-3 md:px-6 flex items-center justify-between">
          <div className="min-w-0">
            <h2 id="reformat-title" className="text-base md:text-lg font-bold text-gray-900">
              Améliorer la description
            </h2>
            <div className="mt-0.5 inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-200">
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16Zm1 12H9v-2h2v2Zm0-4H9V6h2v4Z" />
                </svg>
                IA • offert
              </span>
              <span className="text-[11px] text-gray-500">
                Optionnel : corrige et reformule pour plus de clarté
              </span>
            </div>
          </div>

          {!isSubmitting && (
            <button
              type="button"
              aria-label="Fermer la modale"
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-4 py-4 md:px-6 md:py-6">
          <div className="flex items-start gap-2 text-xs md:text-sm text-gray-600 mb-3">
            <svg
              className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mt-0.5 flex-shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 10a8 8 0 1116 0A8 8 0 012 10zm8-3a1 1 0 100 2 1 1 0 000-2zm-1 4a1 1 0 012 0v3a1 1 0 11-2 0v-3z" />
            </svg>
            <p className="leading-relaxed">
              Votre texte sera ajusté pour être plus précis, clair et professionnel. Vous pouvez
              aussi générer directement votre lettre avec le texte actuel.
            </p>
          </div>

          <div className="relative">
            <textarea
              ref={textareaRef}
              value={workingText}
              onChange={e => setWorkingText(e.target.value)}
              rows={8}
              maxLength={20000}
              disabled={isBusy || isSubmitting}
              className="block w-full rounded-2xl border-2 px-4 py-3 text-base md:text-sm bg-gray-50/60 focus:outline-none focus:ring-2 border-gray-300 focus:border-blue-600 focus:ring-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Décrivez précisément le problème : faits, dates, échanges…"
            />
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                {hasImprovedText
                  ? '✨ Texte amélioré par IA'
                  : 'Conseil : restez concis et factuel'}
              </p>
              <p className={`text-xs ${over ? 'text-orange-600 font-medium' : 'text-gray-400'}`}>
                {workingText.length}/{maxChars}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 border-t border-gray-200 bg-white/90 backdrop-blur px-4 py-3 md:px-6">
          {isSubmitting ? (
            /* État de génération */
            <div className="flex items-center justify-center py-2">
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-green-600 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-green-700 font-semibold">
                  Génération de votre lettre en cours...
                </span>
              </div>
            </div>
          ) : (
            /* Boutons normaux */
            <div className="space-y-3">
              {/* Boutons d'amélioration IA */}
              <div className="flex flex-col md:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => improveText('corrected')}
                  disabled={isBusy || over || !workingText.trim()}
                  className="flex-1 md:flex-none inline-flex items-center justify-center py-2.5 px-4 rounded-xl font-medium text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBusy ? 'Correction...' : '✨ Corriger'}
                </button>
                <button
                  type="button"
                  onClick={() => improveText('reformulated')}
                  disabled={isBusy || over || !workingText.trim()}
                  className="flex-1 md:flex-none inline-flex items-center justify-center py-2.5 px-4 rounded-xl font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBusy ? 'Reformulation...' : '🔄 Reformuler'}
                </button>
              </div>

              {/* Ligne de séparation */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-400">ou</span>
                </div>
              </div>

              {/* Boutons principaux */}
              <div className="flex flex-col md:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  className="flex-1 inline-flex items-center justify-center py-3 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  Générer ma lettre
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="md:w-auto inline-flex items-center justify-center py-3 px-4 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReformatDescriptionModal;
