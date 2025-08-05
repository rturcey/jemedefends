import React from 'react';
import { SaveStatus as SaveStatusType } from '@/types/form';

interface SaveStatusProps {
  status: SaveStatusType;
}

const SaveStatus: React.FC<SaveStatusProps> = ({ status }) => {
  if (!status.type) return null;

  const getClassName = () => {
    const base =
      'auto-save-indicator fixed top-4 right-4 padding-3 rounded-lg text-sm font-medium transform transition-transform duration-250 z-50';

    switch (status.type) {
      case 'success':
        return `${base} bg-green-500 text-white translate-y-0`;
      case 'error':
        return `${base} bg-red-500 text-white translate-y-0`;
      case 'saving':
        return `${base} bg-blue-500 text-white translate-y-0`;
      default:
        return `${base} -translate-y-24`;
    }
  };

  return (
    <div className={getClassName()} aria-live="polite" aria-atomic="true">
      <div className="flex items-center gap-2 px-4 py-3">
        <span className="w-2 h-2 bg-current rounded-full animate-pulse"></span>
        <span>{status.message}</span>
      </div>
    </div>
  );
};

export default SaveStatus;
