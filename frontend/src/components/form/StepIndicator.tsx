import React from 'react';
import { Step } from '@/types/form';

interface StepIndicatorProps {
  step: Step;
  index: number;
  currentIndex: number;
  isCompleted: boolean;
  onClick: () => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  step,
  index,
  currentIndex,
  isCompleted,
  onClick,
}) => {
  const getClassName = () => {
    const base =
      'step-indicator px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500';

    if (index === currentIndex) {
      return `${base} active bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg`;
    } else if (isCompleted) {
      return `${base} completed bg-gradient-to-r from-green-500 to-emerald-600 text-white`;
    } else {
      return `${base} pending bg-gray-100 text-gray-600 hover:bg-gray-200`;
    }
  };

  return (
    <button
      type="button"
      className={getClassName()}
      onClick={onClick}
      role="tab"
      aria-selected={index === currentIndex}
      tabIndex={index === currentIndex ? 0 : -1}
    >
      <span>
        {index + 1}. {step.title}
      </span>
    </button>
  );
};

export default StepIndicator;
