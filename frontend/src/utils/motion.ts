import { Variants } from 'framer-motion';

const createMobileOptimizedVariant = (): Variants => {
  return {
    hidden: {
      opacity: 0,
      y: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.1 : 0.6,
        ease: 'easeOut',
      },
    },
  };
};

export default createMobileOptimizedVariant;
