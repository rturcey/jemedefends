'use client';
import { motion, useReducedMotion } from 'framer-motion';
import * as React from 'react';

function Reveal({
  children,
  delay = 0,
  y = 16,
}: React.PropsWithChildren<{ delay?: number; y?: number }>) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;
