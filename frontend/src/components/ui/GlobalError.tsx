import React from 'react';

interface GlobalErrorProps {
  error: string | null;
  onClose: () => void;
}

const GlobalError: React.FC<GlobalErrorProps> = ({ error, onClose }) => {
  if (!error) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-red-50 border border-red-200 rounded-xl p-4 shadow-lg z-50"
      role="alert"
    >
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <div>
          <h3 className="font-medium text-red-800">Erreur</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
        <button
          type="button"
          className="ml-auto text-red-400 hover:text-red-600 focus:outline-none"
          onClick={onClose}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GlobalError;
