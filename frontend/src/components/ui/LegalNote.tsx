// src/components/ui/LegalNote.tsx
'use client';

import * as React from 'react';
import { ShieldAlert, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';

interface LegalNoteProps {
  title?: string;
  article: string;
  explanation: string;
  examples?: string[];
  disclaimer?: string;
  /** ouvert par défaut ? (false = replié) */
  defaultOpen?: boolean;
  /** styles externes (ex: marges) */
  className?: string;
  /** pour l’accessibilité si rendu multiple sur la page */
  idPrefix?: string;
}

export default function LegalNote({
  title = 'Références légales',
  article,
  explanation,
  examples,
  disclaimer,
  defaultOpen = false,
  className,
  idPrefix = 'legalnote',
}: LegalNoteProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const contentId = `${idPrefix}-content`;
  const buttonId = `${idPrefix}-button`;

  return (
    <div
      className={clsx(
        // bloc visuel plus compact
        'rounded-2xl border border-blue-200 bg-blue-50/70',
        'shadow-[0_1px_0_rgba(0,0,0,0.02)]',
        className
      )}
    >
      {/* En-tête cliquable */}
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen(o => !o)}
        className={clsx('w-full flex items-center justify-between gap-3', 'px-4 py-3')}
      >
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-900">
          <ShieldAlert className="h-4 w-4 text-blue-700" />
          {title}
        </span>
        <ChevronDown
          className={clsx(
            'h-4 w-4 shrink-0 text-blue-700 transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      {/* Contenu repliable */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            id={contentId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0">
              <ul className="list-disc pl-5 text-sm text-blue-900/90 space-y-1.5">
                <li>
                  <strong>{article}</strong>
                </li>
                <li>{explanation}</li>
                {examples?.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>

              {disclaimer ? <p className="mt-2 text-xs text-blue-900/70">{disclaimer}</p> : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
