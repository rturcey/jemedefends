// src/legal/components/LegalReference.tsx
// Composant V2 - Mobile-first, variants flexibles, performance optimisée
// Remplace l'ancien components/ui/LegalReference.tsx

'use client';

import clsx from 'clsx';
import { ExternalLink, Info, AlertTriangle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import * as React from 'react';
import { useState, useMemo, useRef } from 'react';

import { useLegalArticle } from '@/legal/hooks';
import { type LegalArticleId } from '@/legal/registry';

// Types des variants
type LegalReferenceVariant =
  | 'inline' // Simple texte cliquable
  | 'tooltip' // Avec tooltip au hover
  | 'modal' // Ouvre une modal
  | 'expandable' // Se déploie inline
  | 'badge'; // Style badge coloré

type LegalReferenceSize = 'sm' | 'md' | 'lg';

interface LegalReferenceProps {
  /** ID de l'article à afficher */
  code: LegalArticleId;

  /** Variant d'affichage */
  variant?: LegalReferenceVariant;

  /** Taille du composant */
  size?: LegalReferenceSize;

  /** Affiche l'indicateur de statut (vigueur/abrogé) */
  showStatus?: boolean;

  /** Affiche un lien externe vers Légifrance */
  showExternalLink?: boolean;

  /** Texte custom à afficher (sinon utilise le label de l'article) */
  children?: React.ReactNode;

  /** Classes CSS additionnelles */
  className?: string;

  /** Si true, charge immédiatement l'article (sinon lazy) */
  immediate?: boolean;

  /** Callback appelé au clic */
  onClick?: () => void;

  /** Props HTML additionnelles */
  [key: string]: any;
}

// Composant pour indicateur de statut
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
      return <CheckCircle className={clsx(iconSize, 'text-green-500')} aria-label="En vigueur" />;
    case 'ABROGE':
      return <XCircle className={clsx(iconSize, 'text-red-500')} aria-label="Abrogé" />;
    case 'MODIFIE':
      return (
        <AlertTriangle
          className={clsx(iconSize, 'text-yellow-500')}
          aria-label="Modifié récemment"
        />
      );
    default:
      return <Info className={clsx(iconSize, 'text-gray-400')} aria-label="Statut inconnu" />;
  }
}

// Composant squelette pendant le chargement
function LegalReferenceSkeleton({
  variant,
  size,
}: {
  variant: LegalReferenceVariant;
  size: LegalReferenceSize;
}) {
  const sizeClasses = {
    sm: 'h-4 w-24',
    md: 'h-5 w-32',
    lg: 'h-6 w-40',
  };

  if (variant === 'badge') {
    return (
      <div
        className={clsx('animate-pulse bg-gray-200 rounded-full px-3 py-1', sizeClasses[size])}
      />
    );
  }

  return <div className={clsx('animate-pulse bg-gray-200 rounded', sizeClasses[size])} />;
}

// Tooltip pour les détails de l'article
function LegalTooltip({
  children,
  article,
  showExternalLink,
}: {
  children: React.ReactNode;
  article: any;
  showExternalLink: boolean;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const hideTimer = useRef<number | null>(null);

  const show = () => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setIsVisible(true);
  };

  const hide = () => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
    }
    // Laisse un petit délai pour permettre de viser/cliquer le lien
    hideTimer.current = window.setTimeout(() => setIsVisible(false), 250) as unknown as number;
  };

  // Position et contenu du tooltip
  const tooltipContent = (
    <div
      className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-80 max-w-sm"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
        <div className="space-y-2">
          {/* Header avec statut */}
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm text-gray-900 leading-tight">
              {article.url ? (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-blue-700 focus-visible:text-blue-700"
                  onClick={e => e.stopPropagation()}
                >
                  {article.label}
                </a>
              ) : (
                article.label
              )}
            </h4>
            <StatusIndicator status={article.status} size="sm" />
          </div>

          {/* Extrait du texte */}
          {article.text && (
            <p className="text-xs text-gray-700 leading-relaxed">
              {article.text.slice(0, 200)}
              {article.text.length > 200 && '...'}
            </p>
          )}

          {/* Footer avec infos */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              {article.lastVerified && (
                <span>Vérifié {new Date(article.lastVerified).toLocaleDateString('fr-FR')}</span>
              )}
            </div>

            {showExternalLink && article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                onClick={e => e.stopPropagation()}
              >
                Légifrance
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
      {/* Triangle pointer */}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
    </div>
  );

  return (
    <span
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {isVisible && tooltipContent}
    </span>
  );
}

// Composant principal
export default function LegalReference({
  code,
  variant = 'tooltip',
  size = 'md',
  showStatus = false,
  showExternalLink = true,
  children,
  className,
  immediate = false,
  onClick,
  ...props
}: LegalReferenceProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Hook pour charger l'article
  const { article, loading, error, load } = useLegalArticle(code, {
    immediate: immediate || variant === 'tooltip', // Tooltip = immediate load
    strict: false, // Mode gracieux
  });

  // Classes de base selon le variant
  const baseClasses = useMemo(() => {
    const sizeClasses = {
      sm: 'text-xs px-2 py-1',
      md: 'text-sm px-3 py-1.5',
      lg: 'text-base px-4 py-2',
    };

    switch (variant) {
      case 'badge':
        return clsx(
          'inline-flex items-center gap-2 rounded-full font-medium',
          'bg-blue-50 text-blue-700 border border-blue-200',
          'hover:bg-blue-100 transition-colors cursor-pointer',
          'touch-manipulation min-h-[44px]', // Mobile-friendly
          sizeClasses[size],
        );

      case 'expandable':
        return clsx(
          'inline-flex items-center gap-2 rounded-lg font-medium',
          'bg-gray-50 text-gray-700 border border-gray-200',
          'hover:bg-gray-100 transition-colors cursor-pointer',
          'touch-manipulation min-h-[44px]',
          sizeClasses[size],
        );

      case 'modal':
        return clsx(
          'inline text-blue-600 hover:text-blue-700 underline',
          'decoration-dotted underline-offset-2 cursor-pointer',
          'transition-colors',
        );

      case 'inline':
        return clsx('inline text-gray-900 font-medium cursor-default');

      default: // tooltip
        return clsx(
          'inline text-blue-600 hover:text-blue-700 underline',
          'decoration-dotted underline-offset-2 cursor-help',
          'transition-colors',
        );
    }
  }, [variant, size]);

  // Gestion du clic
  const handleClick = () => {
    if (variant === 'expandable') {
      if (!article && !loading) {
        load(); // Lazy load on first expand
      }
      setIsExpanded(!isExpanded);
    }

    onClick?.();
  };

  // Contenu à afficher (le titre devient cliquable si article.url est fourni)
  const baseInlineClasses = 'inline-flex items-center gap-1 align-baseline whitespace-nowrap';
  const displayTextNode = (() => {
    const textContent = children || article?.label || code;
    if (showExternalLink && article?.url) {
      return (
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className={clsx(
            // garder une ligne + feedback accessible
            'inline-flex items-center whitespace-nowrap underline underline-offset-2',
            variant === 'inline' ? 'text-gray-900' : 'text-blue-600 hover:text-blue-700',
          )}
          onClick={e => e.stopPropagation()}
        >
          {textContent}
        </a>
      );
    }
    return <span className="inline-flex items-center whitespace-nowrap">{textContent}</span>;
  })();

  // Erreur ou article non trouvé
  if (error && variant !== 'inline') {
    return (
      <span className={clsx('text-red-500 text-sm', className)} {...props}>
        {code} (erreur)
      </span>
    );
  }

  // Loading state
  if (loading && immediate) {
    return <LegalReferenceSkeleton variant={variant} size={size} />;
  }

  // Contenu principal selon variant
  const content = (
    <span className={clsx(baseInlineClasses, className)} onClick={handleClick} {...props}>
      {displayTextNode}

      {/* Indicateur de statut */}
      {showStatus && article && (
        <StatusIndicator status={article.status} size={size === 'sm' ? 'sm' : 'md'} />
      )}

      {/* Indicateur de chargement pour expandable */}
      {variant === 'expandable' && loading && <Loader2 className="w-4 h-4 animate-spin" />}

      {/* Lien externe (icône) */}
      {showExternalLink && article?.url && (
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 inline-flex items-center text-blue-600 hover:text-blue-700"
          onClick={e => e.stopPropagation()}
          aria-label="Voir sur Légifrance"
          title="Voir sur Légifrance"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </span>
  );

  // Variant avec tooltip
  if (variant === 'tooltip' && article) {
    return (
      <LegalTooltip article={article} showExternalLink={showExternalLink}>
        <span className={baseClasses}>{content}</span>
      </LegalTooltip>
    );
  }

  // Variant expandable avec contenu
  if (variant === 'expandable' && isExpanded && article) {
    return (
      <div className={clsx('inline-block', className)}>
        <span className={baseClasses}>{content}</span>

        {/* Contenu étendu */}
        <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm">
          <div className="space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">
                {article.url ? (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-blue-700 focus-visible:text-blue-700"
                    onClick={e => e.stopPropagation()}
                  >
                    {article.label}
                  </a>
                ) : (
                  article.label
                )}
              </span>
              <StatusIndicator status={article.status} />
            </div>

            {/* Texte */}
            {article.text && (
              <div className="text-gray-700 leading-relaxed">
                {article.text.slice(0, 500)}
                {article.text.length > 500 && (
                  <>
                    ...
                    <button
                      onClick={() => {
                        /* Ouvrir modal complète */
                      }}
                      className="ml-2 text-blue-600 hover:text-blue-700 underline"
                    >
                      Lire la suite
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                {article.lastVerified && (
                  <span>Vérifié {new Date(article.lastVerified).toLocaleDateString('fr-FR')}</span>
                )}
              </div>

              {showExternalLink && article.url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
                  onClick={e => e.stopPropagation()}
                >
                  Légifrance
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default: rendu simple
  return <span className={baseClasses}>{content}</span>;
}

// Composants de convenance
export function LegalReferenceBadge(props: Omit<LegalReferenceProps, 'variant'>) {
  return <LegalReference {...props} variant="badge" />;
}

export function LegalReferenceTooltip(props: Omit<LegalReferenceProps, 'variant'>) {
  return <LegalReference {...props} variant="tooltip" />;
}

export function LegalReferenceInline(props: Omit<LegalReferenceProps, 'variant'>) {
  return <LegalReference {...props} variant="inline" />;
}

export function LegalReferenceExpandable(props: Omit<LegalReferenceProps, 'variant'>) {
  return <LegalReference {...props} variant="expandable" />;
}
