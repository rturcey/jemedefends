'use client';

import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type DivProps = React.HTMLAttributes<HTMLDivElement>;
type MotionDivProps = HTMLMotionProps<'div'>;

export type SectionBlockProps = {
  variants?: MotionDivProps['variants'];
} & Omit<DivProps, 'children'> &
  Omit<MotionDivProps, 'children' | 'variants'> & {
    children: React.ReactNode;
  };

export function SectionBlock({ children, className, variants, ...props }: SectionBlockProps) {
  if (variants) {
    return (
      <motion.div variants={variants} className={cn(className)} {...(props as MotionDivProps)}>
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn(className)} {...(props as DivProps)}>
      {children}
    </div>
  );
}

export default SectionBlock;
