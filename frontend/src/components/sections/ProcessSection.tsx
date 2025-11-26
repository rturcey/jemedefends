// src/components/sections/ProcessSection.tsx
'use client';

import { HelpCircle, Shield, FileText, Zap } from 'lucide-react';
import * as React from 'react';
import Link from 'next/link';

import { Container } from '@/components/ui';
import { Button } from '@/components/ui/button';
import GradientBlobs from '@/components/marketing/GradientBlobs';
import StepCard from '@/components/ui/StepCard';

const STEPS = [
  {
    icon: <HelpCircle className="w-6 h-6 md:w-8 md:h-8" />,
    title: 'Test gratuit',
    desc: 'Répondez à quelques questions sur votre achat et le problème rencontré, guidés par des examples et des bases légales.',
    time: '1 min',
  },
  {
    icon: <Shield className="w-6 h-6 md:w-8 md:h-8" />,
    title: 'Vérification légale',
    desc: 'Notre algorithme vérifie votre éligibilité selon le Code de la consommation.',
    time: 'Instantané',
  },
  {
    icon: <FileText className="w-6 h-6 md:w-8 md:h-8" />,
    title: 'Lettre personnalisée',
    desc: 'Obtenez votre lettre avec les articles de loi applicables à votre situation.',
    time: '30 sec',
  },
  {
    icon: <Zap className="w-6 h-6 md:w-8 md:h-8" />,
    title: 'Action immédiate',
    desc: "Imprimez et envoyez votre lettre, ou choisissez notre service d'envoi.",
    time: 'Votre choix',
  },
];

export default function ProcessSection() {
  return (
    <section
      id="process"
      className="section-scroll-target section-mobile-centered relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      aria-labelledby="process-title"
    >
      <GradientBlobs />

      <Container className="relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2
              id="process-title"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4"
            >
              Simple, rapide, efficace
            </h2>

            <p className="text-sm md:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto">
              En 3 minutes, générez votre lettre de mise en demeure conforme au Code de la
              consommation.
            </p>
          </div>

          <div className="relative">
            <div
              className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-purple-200 md:left-0 md:top-1/2 md:bottom-auto md:w-full md:h-0.5 md:bg-gradient-to-r"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-4 items-stretch">
              {STEPS.map((step, idx) => (
                <StepCard key={idx} {...step} />
              ))}
            </div>
          </div>

          <div className="hidden lg:block text-center mt-8 md:mt-12">
            <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              <Link href="/eligibilite">Tester mon éligibilité</Link>
            </Button>

            <p className="text-xs text-slate-500 mt-3">Gratuit • Sans engagement • 3 minutes</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
