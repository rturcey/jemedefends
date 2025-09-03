// src/components/form/SaveStatus.tsx - Version corrigée
'use client';

import React from 'react';

// Types flexibles pour supporter les deux formats
type SaveStatusType =
  | 'saving'
  | 'saved'
  | 'error'
  | null
  | { type: 'saving' | 'saved' | 'error' | null; message: string };

interface SaveStatusProps {
  status: SaveStatusType;
}

const SaveStatus: React.FC<SaveStatusProps> = ({ status }) => {
  // Normaliser le status - supporter les deux formats
  const normalizedStatus = React.useMemo(() => {
    if (!status) return null;

    // Si c'est juste une string
    if (typeof status === 'string') {
      const messages = {
        saving: 'Sauvegarde...',
        saved: 'Sauvegardé',
        error: 'Erreur de sauvegarde',
      };

      return {
        type: status as 'saving' | 'saved' | 'error',
        message: messages[status as keyof typeof messages] || status,
      };
    }

    // Si c'est un objet
    if (typeof status === 'object' && status.type) {
      return status;
    }

    return null;
  }, [status]);

  if (!normalizedStatus?.type) return null;

  const getStatusConfig = () => {
    switch (normalizedStatus.type) {
      case 'saving':
        return {
          bgColor: 'bg-blue-500',
          textColor: 'text-white',
          icon: (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
                d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.14 5.82 3 7.94l3-2.65z"
              />
            </svg>
          ),
          show: true,
        };

      case 'saved':
        return {
          bgColor: 'bg-green-500',
          textColor: 'text-white',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          ),
          show: true,
        };

      case 'error':
        return {
          bgColor: 'bg-red-500',
          textColor: 'text-white',
          icon: (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          ),
          show: true,
        };

      default:
        return { show: false };
    }
  };

  const config = getStatusConfig();

  if (!config.show) return null;

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out
        ${config.bgColor} ${config.textColor}
        translate-y-0 opacity-100 scale-100
      `}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-center gap-2 px-4 py-2">
        {config.icon}
        <span className="text-sm font-medium">{normalizedStatus.message}</span>
      </div>
    </div>
  );
};

export default SaveStatus;
