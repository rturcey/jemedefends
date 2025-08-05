// src/components/marketing/Hero.tsx
'use client';
import * as React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Container from '@/components/ui/Container';
import GradientBlobs from './GradientBlobs';

type HeroProps = {
  title: React.ReactNode;
  right?: React.ReactNode;
  id?: string;
  className?: string;
};

export default function Hero({ title, right, id = 'hero', className = '' }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">
      <GradientBlobs />
      <Container>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-12">
          <div className="flex-1 max-w-xl">{title}</div>
          {right ? <div className="lg:w-[22rem] lg:flex-shrink-0">{right}</div> : null}
        </div>
      </Container>
    </section>
  );
}
