// frontend/src/components/ui/IconWrapper.tsx
'use client';

import { LucideIcon } from 'lucide-react';
import React from 'react';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type IconVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface IconWrapperProps {
  icon: LucideIcon;
  size?: IconSize;
  variant?: IconVariant;
  className?: string;
  containerClassName?: string;
  strokeWidth?: number;
  showContainer?: boolean;
}

/**
 * Composant utilitaire pour garantir l'uniformité des icônes
 *
 * @example
 * // Simple icône sans conteneur
 * <IconWrapper icon={Shield} size="md" />
 *
 * @example
 * // Icône avec conteneur coloré
 * <IconWrapper
 *   icon={Shield}
 *   size="lg"
 *   variant="primary"
 *   showContainer
 * />
 */
export default function IconWrapper({
  icon: Icon,
  size = 'md',
  variant = 'default',
  className = '',
  containerClassName = '',
  strokeWidth = 1.5,
  showContainer = false,
}: IconWrapperProps) {
  // ✅ Tailles d'icônes cohérentes (mobile → desktop)
  const iconSizes: Record<IconSize, string> = {
    xs: 'w-4 h-4', // 16px (badges, petits éléments)
    sm: 'w-5 h-5 md:w-5 md:h-5', // 20px (icônes moyennes)
    md: 'w-5 h-5 md:w-6 md:h-6', // 20px mobile, 24px desktop (standard)
    lg: 'w-6 h-6 md:w-8 md:h-8', // 24px mobile, 32px desktop (grandes sections)
    xl: 'w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12', // 32px → 48px (hero)
  };

  // ✅ Tailles de conteneurs cohérentes
  const containerSizes: Record<IconSize, string> = {
    xs: 'w-7 h-7 md:w-8 md:h-8',
    sm: 'w-8 h-8 md:w-10 md:h-10',
    md: 'w-10 h-10 md:w-12 md:h-12',
    lg: 'w-12 h-12 md:w-14 md:h-14',
    xl: 'w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20',
  };

  // ✅ Variantes de couleurs cohérentes
  const variantStyles: Record<IconVariant, { container: string; icon: string }> = {
    default: {
      container: 'bg-gray-50 text-gray-600',
      icon: 'text-gray-600',
    },
    primary: {
      container: 'bg-blue-50 text-blue-600',
      icon: 'text-blue-600',
    },
    success: {
      container: 'bg-green-50 text-green-600',
      icon: 'text-green-600',
    },
    warning: {
      container: 'bg-orange-50 text-orange-600',
      icon: 'text-orange-600',
    },
    danger: {
      container: 'bg-red-50 text-red-600',
      icon: 'text-red-600',
    },
    info: {
      container: 'bg-purple-50 text-purple-600',
      icon: 'text-purple-600',
    },
  };

  const iconClasses = `${iconSizes[size]} ${showContainer ? '' : variantStyles[variant].icon} ${className}`;

  // Sans conteneur : juste l'icône
  if (!showContainer) {
    return <Icon className={iconClasses} strokeWidth={strokeWidth} />;
  }

  // Avec conteneur
  const containerClasses = `
    ${containerSizes[size]}
    ${variantStyles[variant].container}
    rounded-xl
    flex items-center justify-center
    flex-shrink-0
    ${containerClassName}
  `
    .trim()
    .replace(/\s+/g, ' ');

  return (
    <div className={containerClasses}>
      <Icon className={iconClasses} strokeWidth={strokeWidth} />
    </div>
  );
}

/**
 * Hook pour obtenir les bonnes classes d'icônes selon le contexte
 */
export function useIconClasses(size: IconSize = 'md') {
  const iconSizes: Record<IconSize, string> = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5 md:w-5 md:h-5',
    md: 'w-5 h-5 md:w-6 md:h-6',
    lg: 'w-6 h-6 md:w-8 md:h-8',
    xl: 'w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12',
  };

  const containerSizes: Record<IconSize, string> = {
    xs: 'w-7 h-7 md:w-8 md:h-8',
    sm: 'w-8 h-8 md:w-10 md:h-10',
    md: 'w-10 h-10 md:w-12 md:h-12',
    lg: 'w-12 h-12 md:w-14 md:h-14',
    xl: 'w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20',
  };

  return {
    icon: iconSizes[size],
    container: containerSizes[size],
    strokeWidth: 1.5,
  };
}

// ✅ Export des types pour réutilisation
export type { IconSize, IconVariant };
