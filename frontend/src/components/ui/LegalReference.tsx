// src/components/ui/LegalReference.tsx
'use client';

import clsx from 'clsx';
import { ExternalLink, Info, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import * as React from 'react';
import { useState, useMemo, useRef } from 'react';

import { useLegalArticle } from '@/legal/hooks';
import { type LegalArticleId } from '@/legal/registry';

type LegalReferenceVariant = 'inline' | 'tooltip' | 'badge';
type LegalReferenceSize = 'sm' | 'md' | 'lg';

interface LegalReferenceProps {
  code: LegalArticleId;
  variant?: LegalReferenceVariant;
  size?: LegalReferenceSize;

  /** Inline/tooltip – affiche en exposant compact */
  asSup?: boolean; // NEW

  showStatus?: boolean;
  showExternalLink?: boolean;
  children?: React.ReactNode; // remplace l’affichage du code si fourni
  className?: string;
  immediate?: boolean;
  onClick?: () => void;

  [key: string]: any;
}

// -- Status icon (tooltip uniquement) ----------------------------------------
function StatusIndicator({
  status,
  size = 'sm',
}: {
  status: 'VIGUEUR' | 'ABROGE' | 'MODIFIE' | 'UNKNOWN';
  size?: 'sm' | 'md';
}) {
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  switch (status) {
    case 'VIGUEUR':
      return <CheckCircle className={clsx(iconSize, 'text-current')} aria-label="En vigueur" />;
    case 'ABROGE':
      return <XCircle className={clsx(iconSize, 'text-current')} aria-label="Abrogé" />;
    case 'MODIFIE':
      return <AlertTriangle className={clsx(iconSize, 'text-current')} aria-label="Modifié" />;
    default:
      return <Info className={clsx(iconSize, 'text-current')} aria-label="Inconnu" />;
  }
}

// -- Skeleton -----------------------------------------------------------------
function LegalReferenceSkeleton({
  variant,
  size,
}: {
  variant: LegalReferenceVariant;
  size: LegalReferenceSize;
}) {
  const h = size === 'sm' ? 'h-3' : size === 'md' ? 'h-4' : 'h-5';
  if (variant === 'badge') {
    return (
      <span
        className={clsx('inline-block animate-pulse bg-gray-200 rounded-md', 'px-1.5 py-0.5', h)}
        style={{ width: 72 }}
      />
    );
  }
  return <span className={clsx('inline-block animate-pulse bg-gray-200 rounded w-16', h)} />;
}

// Tooltip (label + extrait scrollable) — 100% inline-safe (span-only)
function LegalTooltip({
  children,
  article,
  showExternalLink,
  showStatus,
}: {
  children: React.ReactNode;
  article: any;
  showExternalLink: boolean;
  showStatus: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const hideTimer = useRef<number | null>(null);

  const show = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    setIsVisible(true);
  };
  const hide = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setIsVisible(false), 180) as unknown as number;
  };

  return (
    <span
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}

      {isVisible && (
        // container de la popover (inline)
        <span
          role="tooltip"
          className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-[20rem] max-w-[85vw] inline-block"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {/* boîte visuelle (inline-block) */}
          <span className="inline-block bg-white border border-gray-200 rounded-lg shadow-md p-3 align-top">
            {/* header: label + statut (tout en span) */}
            <span className="flex items-start justify-between gap-2">
              <span className="font-medium text-sm text-gray-900 leading-tight">
                {article?.url ? (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-blue-700 focus-visible:text-blue-700"
                    onClick={e => e.stopPropagation()}
                  >
                    {article?.label || 'Article'}
                  </a>
                ) : (
                  article?.label || 'Article'
                )}
              </span>

              {showStatus && article?.status && (
                <span className="text-gray-500">
                  <StatusIndicator status={article.status} size="sm" />
                </span>
              )}
            </span>

            {/* extrait scrollable (toujours en span) */}
            {article?.text && (
              <span
                className={`
                  block mt-2 text-xs text-gray-700 leading-relaxed whitespace-pre-wrap
                  max-h-24 overflow-y-auto pr-1
                  [scrollbar-width:thin] [-ms-overflow-style:none]
                `}
                style={{ scrollbarGutter: 'stable' }}
              >
                {article.text}
              </span>
            )}

            {/* footer */}
            <span className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100">
              <span className="text-[11px] text-gray-500">
                {article?.lastVerified && (
                  <span>Vérifié {new Date(article.lastVerified).toLocaleDateString('fr-FR')}</span>
                )}
              </span>

              {showExternalLink && article?.url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-700"
                  onClick={e => e.stopPropagation()}
                  aria-label="Voir sur Légifrance"
                  title="Voir sur Légifrance"
                >
                  Légifrance <ExternalLink className="w-3 h-3 text-current" />
                </a>
              )}
            </span>
          </span>

          {/* triangle (inline) */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
        </span>
      )}
    </span>
  );
}

// -- Main ---------------------------------------------------------------------
export default function LegalReference({
  code,
  variant = 'tooltip',
  size = 'md',
  asSup = false, // NEW
  showStatus = false,
  showExternalLink = true,
  children,
  className,
  immediate = false,
  onClick,
  ...props
}: LegalReferenceProps) {
  const { article, loading, error } = useLegalArticle(code, {
    immediate: immediate || variant !== 'inline',
    strict: false,
  });

  // Texte visible : le code (ou children forcé)
  const codeText = String(children ?? code);

  // Styles de base par variant
  const baseClasses = useMemo(() => {
    const pad: Record<LegalReferenceSize, string> = {
      sm: 'px-1.5 py-0.5 text-[11px]',
      md: 'px-2 py-0.5 text-xs',
      lg: 'px-2.5 py-1 text-sm',
    };
    switch (variant) {
      case 'badge':
        return clsx(
          'inline-flex items-center gap-1 align-baseline rounded-md',
          'border border-blue-200 bg-blue-50 text-blue-600',
          'hover:bg-blue-100 hover:border-blue-300 hover:text-blue-700',
          'hover:shadow-sm focus:outline-none',
          'focus-visible:ring-2 focus-visible:ring-blue-400/40',
          'active:translate-y-0 transition-all',
          pad[size],
        );
      case 'inline':
        return 'inline text-gray-900 font-medium';
      default:
        return 'inline'; // color hérite du parent; lien gère hover/focus
    }
  }, [variant, size]);

  // rendu “exposant compact” (texte + éventuelles parenthèses)
  const InlineShell: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    asSup ? (
      <sup className="align-super text-[11px] leading-none opacity-90">{children}</sup>
    ) : (
      <span className="align-baseline">{children}</span>
    );

  if (error && variant !== 'inline') {
    return (
      <InlineShell>
        <span className={clsx('text-red-500 text-xs', className)} {...props}>
          {codeText}
        </span>
      </InlineShell>
    );
  }
  if (loading && (variant === 'badge' || variant === 'tooltip')) {
    return <LegalReferenceSkeleton variant={variant} size={size} />;
  }

  // BADGE : toute la puce est cliquable
  if (variant === 'badge') {
    const href = article?.url || '#';
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(baseClasses, className)}
        {...props}
      >
        <span className="whitespace-nowrap">{codeText}</span>
        <ExternalLink className="w-3 h-3 text-current" />
      </a>
    );
  }

  // INLINE : juste le code (optionnellement en exposant/parenthèses)
  if (variant === 'inline') {
    return (
      <InlineShell>
        <span className={clsx(baseClasses, className)} {...props}>
          {codeText}
        </span>
      </InlineShell>
    );
  }

  // TOOLTIP : le code est cliquable + tooltip au hover, en look compact
  const href = article?.url;
  // --- TOOLTIP trigger: icon same color as text, visible even without hover -
  const trigger = (
    <InlineShell>
      <span className={clsx(baseClasses, 'text-blue-600', className)} {...props}>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              'inline-flex items-center gap-1 whitespace-nowrap',
              'underline decoration-dotted underline-offset-2',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/40 rounded',
            )}
            title="Ouvrir sur Légifrance"
            aria-label={`Voir ${String(code)} sur Légifrance (nouvel onglet)`}
          >
            <span>{codeText}</span>
            {<ExternalLink className="w-3 h-3 text-current" />}
          </a>
        ) : (
          <span className="underline decoration-dotted underline-offset-2">{codeText}</span>
        )}
      </span>
    </InlineShell>
  );

  return (
    <LegalTooltip article={article} showExternalLink={showExternalLink} showStatus={showStatus}>
      {trigger}
    </LegalTooltip>
  );
}

// Helpers
export function LegalReferenceBadge(props: Omit<LegalReferenceProps, 'variant'>) {
  return <LegalReference {...props} variant="badge" size={props.size ?? 'sm'} />;
}

export function LegalReferenceTooltip(props: Omit<LegalReferenceProps, 'variant'>) {
  return <LegalReference {...props} variant="tooltip" />;
}

export function LegalReferenceInline(props: Omit<LegalReferenceProps, 'variant'>) {
  return <LegalReference {...props} variant="inline" />;
}
