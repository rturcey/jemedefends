import * as React from 'react';
import { cn } from '@/lib/utils';

export default function LegalSection({
  id,
  title,
  children,
  className,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn('scroll-mt-28 space-y-3', className)}>
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
      <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}
