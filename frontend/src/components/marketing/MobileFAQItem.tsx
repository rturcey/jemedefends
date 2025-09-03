'use client';
import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MobileFAQItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  defaultOpen?: boolean;
}

export default function MobileFAQItem({
  question,
  answer,
  isOpen: controlledIsOpen,
  onToggle,
  defaultOpen = false,
}: MobileFAQItemProps) {
  const [internalIsOpen, setInternalIsOpen] = React.useState(defaultOpen);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const toggle = onToggle || (() => setInternalIsOpen(!internalIsOpen));

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <button
        onClick={toggle}
        className={cn(
          'w-full px-4 py-3 text-left font-semibold text-gray-900',
          'hover:bg-gray-50 focus:outline-none focus-visible:ring-2',
          'focus-visible:ring-blue-500 focus-visible:ring-inset',
          'flex items-center justify-between gap-3',
          'transition-colors duration-200',
          'min-h-[44px] touch-manipulation'
        )}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${question.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <span className="text-sm font-medium leading-tight">{question}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: 'easeInOut',
              opacity: { duration: 0.15 },
            }}
            className="overflow-hidden"
          >
            <div
              id={`faq-answer-${question.replace(/\s+/g, '-').toLowerCase()}`}
              className="px-4 pb-3 text-sm text-gray-700 leading-relaxed"
            >
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
