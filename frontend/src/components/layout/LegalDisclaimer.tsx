import * as React from 'react';
import { cn } from '@/lib/utils';

type Props = {
  /** Balise HTML à utiliser : "p" (par défaut), "div" ou "small" */
  as?: 'p' | 'div' | 'small';
  className?: string;
};

function LegalDisclaimer({ as = 'p', className = '' }: Props) {
  const Tag = as as keyof JSX.IntrinsicElements;

  return (
    <Tag className={cn('text-xs text-gray-500', className)}>
      Ce service fournit des informations générales basées sur le{' '}
      <strong>Code de la consommation</strong>. Il ne constitue pas un{' '}
      <strong>conseil juridique individualisé</strong>. Les versions payantes incluent un support
      e-mail illimité (hors conseil personnalisé).
    </Tag>
  );
}
export default LegalDisclaimer;
