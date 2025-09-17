'use client';

import React from 'react';
import LegalReference from '@/components/ui/LegalReference';
import { isValidLegalArticleId } from '@/legal/registry';

/**
 * Remplace tout <span data-legal-id="…">…</span> par <LegalReference code="…"/>
 * Fonctionne récursivement sur l'arbre React.
 */
function transform(node: React.ReactNode): React.ReactNode {
  if (Array.isArray(node)) return node.map(transform);

  if (React.isValidElement(node)) {
    const props = (node.props ?? {}) as any;
    const id = props['data-legal-id'];

    if (typeof id === 'string' && isValidLegalArticleId(id)) {
      return <LegalReference code={id} variant="tooltip" size="sm" showExternalLink asSup={true} />;
    }

    const children = props.children;
    const newChildren = React.Children.map(children, transform);
    return React.cloneElement(node, undefined, newChildren);
  }

  return node;
}

export default function LegalHydrator({ children }: { children: React.ReactNode }) {
  return <>{transform(children)}</>;
}
