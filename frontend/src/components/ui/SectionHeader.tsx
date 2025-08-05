import * as React from 'react';
import { cn } from '@/lib/utils';

function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
}: {
  eyebrow?: string;
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center';
  return (
    <div className={cn('mb-10', alignClass, className)}>
      {eyebrow ? (
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 text-blue-700 px-3 py-1 text-xs font-semibold">
          {eyebrow}
        </div>
      ) : null}
      <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">{title}</h2>
      {description ? (
        <p className={cn('mt-3 text-gray-600', align === 'center' ? 'mx-auto max-w-3xl' : '')}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
export default SectionHeader;
