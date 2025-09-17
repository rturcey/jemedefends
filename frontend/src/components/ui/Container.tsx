// src/components/ui/Container.tsx - Version harmonisée mobile-first
'use client';

import clsx from 'clsx';
import * as React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  variant?: 'default' | 'form' | 'narrow' | 'wide';
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Container harmonisé pour une expérience cohérente entre tous les formulaires
 *
 * Variants:
 * - default: Container standard pour le contenu général
 * - form: Optimisé pour les formulaires (éligibilité + génération)
 * - narrow: Plus étroit pour les pages de contenu
 * - wide: Plus large pour les dashboards
 */
const Container: React.FC<ContainerProps> = ({
  children,
  variant = 'default',
  className = '',
  as: Component = 'div',
  ...props
}) => {
  const containerClasses = clsx(
    // Base mobile-first
    'mx-auto px-4 sm:px-6',

    // Variants avec largeurs harmonisées
    {
      // Container standard - pages générales
      'max-w-7xl': variant === 'default',

      // Container formulaires - largeur optimisée pour UX formulaires
      'max-w-[640px]': variant === 'form',

      // Container étroit - articles, guides
      'max-w-4xl': variant === 'narrow',

      // Container large - dashboards, admin
      'max-w-[1400px]': variant === 'wide',
    },

    className,
  );

  return (
    <Component className={containerClasses} {...props}>
      {children}
    </Component>
  );
};

export default Container;
