// frontend/src/components/results/PDFDownloadButton.tsx
'use client';

import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

interface PDFDownloadButtonProps {
  onClick: () => Promise<void>;
  label?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  disabled?: boolean;
}

const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  onClick,
  label = 'Télécharger',
  icon,
  variant = 'primary',
  className = '',
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    try {
      await onClick();
    } catch (error) {
      console.error('Erreur téléchargement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const baseClasses =
    'flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      type="button"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Téléchargement...</span>
        </>
      ) : (
        <>
          {icon || <Download className="w-5 h-5" />}
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

export default PDFDownloadButton;
