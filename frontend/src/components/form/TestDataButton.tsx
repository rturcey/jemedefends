// src/components/form/TestDataButton.tsx
'use client';

import React, { memo } from 'react';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface TestDataButtonProps {
  onTestData?: () => void;
  className?: string;
  disabled?: boolean;
}

const TestDataButton = memo<TestDataButtonProps>(
  ({ onTestData, className = '', disabled = false }) => {
    const { isMobile } = useMobileOptimization();

    // Afficher seulement en développement
    if (process.env.NODE_ENV !== 'development') {
      return null;
    }

    return (
      <button
        type="button"
        onClick={onTestData}
        disabled={disabled}
        className={`
        fixed bottom-4 right-4 z-50
        ${isMobile ? 'w-10 h-10 rounded-full' : 'px-4 py-2 rounded-lg'}
        bg-blue-600 text-white shadow-lg hover:bg-blue-700 disabled:bg-gray-400 
        disabled:cursor-not-allowed transition-colors focus:outline-none 
        focus:ring-2 focus:ring-blue-500/20 touch-manipulation
        ${isMobile ? 'mb-20' : ''} 
        ${className}
      `}
        aria-label={isMobile ? 'Données de test' : 'Remplir avec des données de test'}
        title={isMobile ? 'Données de test' : undefined}
      >
        {isMobile ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
        ) : (
          <span className="text-sm font-medium">Test Data</span>
        )}
      </button>
    );
  }
);

TestDataButton.displayName = 'TestDataButton';

export default TestDataButton;
