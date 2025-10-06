// src/components/ui/Breadcrumbs.tsx
'use client';

import { ChevronRight, Home, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  isCurrentPage?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
  maxItems?: number; // Limite pour mobile
  className?: string;
  separator?: React.ReactNode;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  showHomeIcon = true,
  maxItems = 3, // Maximum sur mobile
  className = '',
  separator = <ChevronRight className="w-4 h-4 text-gray-400" />,
}) => {
  const { isMobile } = useMobileOptimization();

  // Préparer les items avec home si nécessaire
  const allItems: BreadcrumbItem[] = [
    ...(showHomeIcon && items[0]?.href !== '/'
      ? [{ label: 'Accueil', href: '/', icon: <Home className="w-4 h-4" /> }]
      : []),
    ...items,
  ];

  // Logique de troncature pour mobile
  const getDisplayItems = () => {
    if (!isMobile || allItems.length <= maxItems) {
      return allItems;
    }

    // Sur mobile, montrer: [Premier] ... [Avant-dernier] [Dernier]
    const first = allItems[0];
    const last = allItems[allItems.length - 1];
    const secondLast = allItems[allItems.length - 2];

    if (allItems.length === maxItems + 1) {
      // Juste un de trop, on affiche tout
      return allItems;
    }

    return [
      first,
      {
        label: '...',
        isEllipsis: true,
      },
      ...(secondLast ? [secondLast] : []),
      last,
    ];
  };

  const displayItems = getDisplayItems();

  // Génération du JSON-LD Schema.org
  const generateBreadcrumbSchema = () => {
    const itemListElement = allItems
      .filter(item => item.href && !item.isCurrentPage)
      .map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jemedefends.fr'}${item.href}`,
      }));

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement,
    };
  };

  if (allItems.length <= 1) return null;

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema()),
        }}
      />

      {/* Breadcrumbs visuels */}
      <nav aria-label="Fil d'ariane" className={`${className}`} role="navigation">
        <ol className="flex items-center gap-1 sm:gap-2">
          {displayItems.map((item, index) => (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {/* Séparateur (sauf pour le premier) */}
              {index > 0 && (
                <span className="mx-1 sm:mx-2" aria-hidden="true">
                  {separator}
                </span>
              )}

              {/* Item de breadcrumb */}
              {(item as any).isEllipsis ? (
                <span className="px-2 py-1 text-gray-400">
                  <MoreHorizontal className="w-4 h-4" />
                </span>
              ) : item.isCurrentPage || !item.href ? (
                <span
                  className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg"
                  aria-current="page"
                >
                  {item.icon}
                  <span className={`${isMobile ? 'max-w-[120px] truncate' : ''}`}>
                    {item.label}
                  </span>
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-1.5 px-2 py-1 text-sm text-gray-600 
                    hover:text-blue-600 hover:bg-blue-50 rounded-lg 
                    transition-colors duration-200
                    min-h-[44px] sm:min-h-auto touch-manipulation
                    ${isMobile ? 'active:bg-blue-100' : ''}
                  `}
                >
                  {item.icon}
                  <span className={`${isMobile ? 'max-w-[120px] truncate' : ''}`}>
                    {item.label}
                  </span>
                </Link>
              )}
            </li>
          ))}
        </ol>

        {/* Indication mobile qu'il y a plus d'éléments */}
        {isMobile && allItems.length > maxItems && (
          <div className="mt-2 text-xs text-gray-500">{allItems.length} niveaux de navigation</div>
        )}
      </nav>
    </>
  );
};

export default Breadcrumbs;

// Fonction utilitaire pour générer des breadcrumbs automatiquement
export const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [];
  let currentPath = '';

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;

    // Mapping des segments vers des labels lisibles
    const getLabel = (seg: string) => {
      const labelMap: Record<string, string> = {
        guides: 'Guides',
        faq: 'FAQ',
        eligibilite: 'Éligibilité',
        contact: 'Contact',
        'mentions-legales': 'Mentions légales',
        'politique-confidentialite': 'Politique de confidentialité',
        // Catégories de guides
        electromenager: 'Électroménager',
        smartphones: 'Smartphones',
        ordinateurs: 'Ordinateurs',
        voiture: 'Automobile',
        'services-numeriques': 'Services numériques',
      };

      return labelMap[seg] || seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ');
    };

    breadcrumbs.push({
      label: getLabel(segment),
      href: isLast ? undefined : currentPath,
      isCurrentPage: isLast,
    });
  });

  return breadcrumbs;
};
