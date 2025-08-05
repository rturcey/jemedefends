'use client';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClass?: string; // ex: "max-w-2xl"
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  maxWidthClass = 'max-w-2xl',
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLDivElement>(null);

  // Fermer sur ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Trap focus simple
  useEffect(() => {
    if (!open) return;
    const focusable = () =>
      Array.from(
        (
          overlayRef.current?.querySelector('[data-dialog]') as HTMLElement
        )?.querySelectorAll<HTMLElement>(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        ) || []
      ).filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const els = focusable();
      if (!els.length) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    initialFocusRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      onMouseDown={e => {
        // close on outside click
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        data-dialog
        className={`relative w-full ${maxWidthClass} bg-white rounded-2xl shadow-2xl border border-gray-200`}
      >
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <button
            ref={initialFocusRef}
            className="h-8 w-8 rounded-full grid place-items-center hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4">{children}</div>

        {footer && (
          <div className="px-5 py-4 border-t border-gray-100 bg-white/80 backdrop-blur sticky bottom-0 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
