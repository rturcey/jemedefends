import * as React from 'react';
import { cn } from '@/lib/utils';

type Props = React.PropsWithChildren<{
  id?: string;
  className?: string;
  ariaLabel?: string;
  tone?: 'plain' | 'tinted' | 'gradient';
}>;

function Section({ id, className = '', ariaLabel, children, tone = 'plain' }: Props) {
  const toneClass =
    tone === 'gradient'
      ? 'bg-[radial-gradient(40rem_20rem_at_50%_-8rem,rgba(59,130,246,0.06),transparent)]'
      : tone === 'tinted'
        ? 'bg-slate-50'
        : '';

  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn('py-20 relative scroll-mt-28', toneClass, className)}
    >
      {children}
    </section>
  );
}

export default Section;
