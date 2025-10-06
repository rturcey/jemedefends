// src/components/ui/Button.tsx
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import * as React from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface BaseButtonProps {
  children: React.ReactNode;
  asChild?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  /** Mobile: w-full en <sm>, auto au-delà */
  fullWidthOnMobile?: boolean;
  /** Autoriser le libellé multi-lignes (icône reste alignée) */
  allowWrap?: boolean;
  'data-umami-event'?: string;
}

interface ButtonProps
  extends BaseButtonProps,
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  href?: never;
}

interface LinkButtonProps
  extends BaseButtonProps,
    Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'size'> {
  href: string;
  onClick?: never;
  type?: never;
}

type CombinedButtonProps = ButtonProps | LinkButtonProps;

// ============================================================================
// CONSTANTS
// ============================================================================

const MOBILE_TOUCH_CLASS = 'min-h-[44px] min-w-[44px] touch-manipulation';

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg border-blue-600',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 shadow-md hover:shadow-lg border-gray-600',
  outline: 'border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400',
  ghost: 'text-blue-700 hover:bg-blue-50 hover:text-blue-800 border-transparent',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg border-red-600',
} as const;

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Heuristique améliorée pour reconnaître une icône React
 */
function isIconElement(node: React.ReactNode): node is React.ReactElement {
  if (!React.isValidElement(node)) return false;

  const element = node as React.ReactElement;
  const displayName = (element.type as any)?.displayName || '';
  const className = element.props?.className || '';

  // Détection par displayName (Lucide, React Icons, etc.)
  if (/icon|Icon|Svg/i.test(displayName)) return true;

  // Détection par className
  if (/icon|lucide|feather|heroicon/i.test(className)) return true;

  // Détection par props SVG
  if (
    element.type === 'svg' ||
    (element.props && ('width' in element.props || 'viewBox' in element.props))
  ) {
    return true;
  }

  // Détection par fonction (composants d'icônes)
  if (typeof element.type === 'function') {
    const functionName = element.type.name || '';
    if (/^[A-Z].*Icon|^Icon|^Svg/i.test(functionName)) return true;
  }

  return false;
}

/**
 * Normalise les classes d'une icône pour un alignement cohérent
 */
function normalizeIconClasses(
  existingClasses: string = '',
  size: 'sm' | 'md' | 'lg' = 'md',
): string {
  // Tailles d'icônes selon la taille du bouton
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  // Nettoyer les classes existantes (supprimer les tailles potentiellement conflictuelles)
  const cleanedClasses = existingClasses
    .replace(/\b(w-\d+|h-\d+|inline-block|block|inline|inline-flex)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Classes optimales pour l'alignement dans flex
  return `${iconSizes[size]} shrink-0 ${cleanedClasses}`.trim();
}

/**
 * Extrait une icône des children si aucune prop icon n'est fournie
 */
function extractIconFromChildren(
  children: React.ReactNode,
  position: 'left' | 'right',
  size: 'sm' | 'md' | 'lg' = 'md',
): { label: React.ReactNode; iconEl: React.ReactElement | null } {
  const childArray = React.Children.toArray(children);

  if (!childArray.length) {
    return { label: children, iconEl: null };
  }

  const iconIndex = position === 'left' ? 0 : childArray.length - 1;
  const potentialIcon = childArray[iconIndex];

  if (isIconElement(potentialIcon)) {
    // Cloner l'icône avec les classes normalisées
    const iconEl = React.cloneElement(potentialIcon, {
      className: normalizeIconClasses(potentialIcon.props?.className, size),
      'aria-hidden': 'true', // Les icônes décoratives doivent être cachées des screen readers
    });

    // Extraire le texte restant
    const label = position === 'left' ? childArray.slice(1) : childArray.slice(0, -1);

    return { label, iconEl };
  }

  return { label: children, iconEl: null };
}

// ============================================================================
// BUTTON INNER COMPONENT
// ============================================================================

function ButtonInner({
  children,
  icon,
  iconPosition = 'left',
  loading,
  allowWrap = true,
  size = 'md',
}: Pick<BaseButtonProps, 'children' | 'icon' | 'iconPosition' | 'loading' | 'allowWrap'> & {
  size?: 'sm' | 'md' | 'lg';
}) {
  const { label, iconEl } = React.useMemo(() => {
    // Si une icône est fournie via props, l'utiliser directement
    if (icon && React.isValidElement(icon)) {
      const normalizedIcon = React.cloneElement(icon, {
        className: normalizeIconClasses(icon.props?.className, size),
        'aria-hidden': 'true',
      });
      return { label: children, iconEl: normalizedIcon };
    }

    // Sinon, essayer d'extraire depuis les children
    return extractIconFromChildren(children, iconPosition, size);
  }, [children, icon, iconPosition, size]);

  // Classes pour le conteneur - toujours en ligne horizontale
  const containerClasses = [
    'inline-flex',
    'flex-row',
    'items-center',
    'justify-center',
    'gap-2',
    'min-w-0', // Évite l'overflow
    'w-full', // Prend toute la largeur disponible
  ].join(' ');

  // Classes pour le label
  const labelClasses = allowWrap
    ? 'flex-1 text-center leading-tight' // Permet le wrap, centré
    : 'flex-1 text-center truncate leading-tight'; // Truncate si pas de wrap

  // Loading state
  if (loading) {
    return (
      <span className={containerClasses}>
        <span
          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"
          aria-hidden="true"
        />
        {label && <span className={labelClasses}>{label}</span>}
      </span>
    );
  }

  // Normal state avec icône
  return (
    <span className={containerClasses}>
      {/* Icône à gauche */}
      {iconEl && iconPosition === 'left' && iconEl}

      {/* Label au centre */}
      {label && <span className={labelClasses}>{label}</span>}

      {/* Icône à droite */}
      {iconEl && iconPosition === 'right' && iconEl}
    </span>
  );
}

// ============================================================================
// MAIN BUTTON COMPONENT
// ============================================================================

export default function Button({
  children,
  href,
  asChild = false,
  variant = 'primary',
  size = 'md',
  className = '',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidthOnMobile = true,
  allowWrap = true,
  ...props
}: CombinedButtonProps) {
  // Classes de largeur responsive
  const widthClasses = fullWidthOnMobile ? 'w-full sm:w-auto' : '';

  // Classes de base du bouton
  const baseClasses = [
    MOBILE_TOUCH_CLASS,
    'inline-flex',
    'items-center',
    'justify-center',
    'font-semibold',
    'rounded-xl',
    'border',
    'transition-all',
    'duration-200',
    'ease-out',
    'focus:outline-none',
    'focus-visible:ring-2',
    'focus-visible:ring-blue-500',
    'focus-visible:ring-offset-2',
    'active:scale-95',
    'active:transition-transform',
    'active:duration-75',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'disabled:transform-none',
    variants[variant],
    sizes[size],
    widthClasses,
    className,
  ]
    .filter(Boolean) // Supprimer les classes vides
    .join(' ')
    .replace(/\s+/g, ' ') // Normaliser les espaces
    .trim();

  // Rendu conditionnel selon le type

  // AsChild pattern (délègue le rendu à l'enfant)
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: `${baseClasses} ${children.props.className || ''}`.trim(),
      'aria-busy': loading || undefined,
      'aria-disabled': disabled || loading || undefined,
      ...props,
    } as any);
  }

  // Link button (NextJS Link)
  if (href) {
    const { asChild: _omit, ...linkProps } = props as any;
    return (
      <Link href={href} className={baseClasses} {...linkProps}>
        <ButtonInner
          icon={icon}
          iconPosition={iconPosition}
          loading={loading}
          allowWrap={allowWrap}
          size={size}
        >
          {children}
        </ButtonInner>
      </Link>
    );
  }

  // Regular button (avec animation Framer Motion)
  const { asChild: _omit2, ...buttonProps } = props as any;
  return (
    <motion.button
      className={baseClasses}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-disabled={disabled || loading || undefined}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      transition={{ duration: 0.1 }}
      {...buttonProps}
    >
      <ButtonInner
        icon={icon}
        iconPosition={iconPosition}
        loading={loading}
        allowWrap={allowWrap}
        size={size}
      >
        {children}
      </ButtonInner>
    </motion.button>
  );
}
