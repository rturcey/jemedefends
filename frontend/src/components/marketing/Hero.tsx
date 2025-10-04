'use client';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import Container from '@/components/ui/Container';
import Skeleton from '@/components/ui/Skeleton';

import GradientBlobs from './GradientBlobs';

type HeroProps = {
  title: React.ReactNode;
  right?: React.ReactNode;
  id?: string;
  className?: string;
};

export default function Hero({ title, right, id = 'hero', className = '' }: HeroProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className={`min-h-[100vh] md:min-h-[calc(100vh-5rem)] flex items-center justify-center relative overflow-hidden ${className}`}
    >
      <GradientBlobs />
      <div
        aria-hidden
        className="
        pointer-events-none select-none
        absolute
        hidden md:block
        z-[1]
        opacity-[0.035] lg:opacity-[0.03]
      "
        style={{
          WebkitMaskImage:
            'radial-gradient(closest-side at 70% 30%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)',
          maskImage:
            'radial-gradient(closest-side at 70% 30%, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)',
        }}
      >
        <div>
          <Image
            src="/images/filigrane.png"
            alt=""
            width={859}
            height={855}
            priority
            className="w-full h-auto"
          />
        </div>
      </div>
      <Container className="h-full flex items-center py-4 md:py-6">
        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:justify-center gap-6 lg:gap-10 w-full">
          <div className="flex-1 max-w-xl w-full text-center lg:text-left">
            <Skeleton loading={!isLoaded} className="h-80 w-full">
              {title}
            </Skeleton>
          </div>
          {right && (
            <div className="hidden lg:block lg:w-[22rem] lg:flex-shrink-0">
              <Skeleton loading={!isLoaded} className="h-80 w-full lg:w-[22rem]">
                {right}
              </Skeleton>
            </div>
          )}
        </div>
      </Container>

      <Skeleton
        loading={!isLoaded}
        variant="circular"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block w-6 h-6"
      >
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </motion.div>
      </Skeleton>
    </section>
  );
}
