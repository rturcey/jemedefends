'use client';

import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

interface ValidationMessageProps {
  type: 'error' | 'warning' | 'success' | 'info';
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({
  type,
  message,
  action,
  className = '',
}) => {
  const styles = {
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const icons = {
    error: XCircle,
    warning: AlertTriangle,
    success: CheckCircle,
    info: Info,
  };

  const Icon = icons[type];

  return (
    <div className={`p-4 rounded-lg border ${styles[type]} animate-bounce-in ${className}`}>
      <div className="flex items-start">
        <Icon className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-relaxed">{message}</p>
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 text-sm underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current rounded"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ValidationMessage;
