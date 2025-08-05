// src/components/form/ReformatDescriptionModal.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  initialText: string;
  onApply: (text: string, type: 'corrected' | 'reformulated') => void;
  maxChars?: number;
};

const ReformatDescriptionModal: React.FC<Props> = ({
  open,
  onClose,
  initialText,
  onApply,
  maxChars = 1200,
}) => {
  const [workingText, setWorkingText] = useState(initialText || '');
  const [isBusy, setIsBusy] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setWorkingText(initialText || '');
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
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const onClick = (e: MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open, onClose]);

  const over = workingText.length > maxChars;

  const apply = async (kind: 'corrected' | 'reformulated') => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      onApply(workingText, kind);
    } finally {
      setIsBusy(false);
    }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reformat-title"
      className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center"
    >
      <div className="relative w-full h-full md:h-auto md:w-[720px] bg-white md:rounded-2xl md:shadow-2xl flex flex-col max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-3 md:px-6 flex items-center justify-between">
          <div className="min-w-0">
            <h2 id="reformat-title" className="text-base md:text-lg font-bold text-gray-900">
              Améliorer la description
            </h2>
            <div className="mt-0.5 inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-200">
                IA • offert
              </span>
              <span className="text-[11px] text-gray-500">
                Corrige et reformule pour plus de clarté.
              </span>
            </div>
          </div>

          <button
            type="button"
            aria-label="Fermer la modale"
            onClick={onClose}
            className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            ✕
          </button>
        </div>

        {/* Corps avec textarea scrollable */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <textarea
            ref={textareaRef}
            value={workingText}
            onChange={e => setWorkingText(e.target.value)}
            className="w-full h-48 md:h-60 resize-none border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            maxLength={maxChars}
          />
          {over && (
            <p className="mt-2 text-sm text-red-600">
              Le texte dépasse la limite de {maxChars} caractères.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white/90 backdrop-blur border-t border-gray-200 p-4 md:px-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => apply('corrected')}
            disabled={isBusy || over}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            Corriger
          </button>
          <button
            type="button"
            onClick={() => apply('reformulated')}
            disabled={isBusy || over}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50"
          >
            Reformuler
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReformatDescriptionModal;
