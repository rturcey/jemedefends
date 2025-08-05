// src/components/sections/ProcessSection.tsx
'use client';

import * as React from 'react';
import { Section, Container, Reveal, Badge, Button } from '@/components/ui';
import { HelpCircle, Shield, FileText, Zap, Sparkles } from 'lucide-react';

const STEPS = [
  {
    icon: <HelpCircle className="w-8 h-8" />,
    title: 'Test gratuit',
    desc: 'Répondez à quelques questions sur votre achat et le problème rencontré.',
    time: '1 min',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Vérification légale',
    desc: 'Notre algorithme vérifie votre éligibilité selon le Code de la consommation.',
    time: 'Instantané',
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: 'Lettre personnalisée',
    desc: 'Obtenez votre lettre avec les articles de loi applicables à votre situation.',
    time: '30 sec',
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Action immédiate',
    desc: "Imprimez et envoyez votre lettre, ou choisissez notre service d'envoi.",
    time: 'À vous de voir',
  },
];

const COLORS = [
  {
    ring: 'ring-blue-200',
    bgFrom: 'from-blue-50',
    bgTo: 'to-indigo-50',
    icon: 'text-blue-600',
    dot: 'bg-blue-600',
  },
  {
    ring: 'ring-purple-200',
    bgFrom: 'from-purple-50',
    bgTo: 'to-fuchsia-50',
    icon: 'text-purple-600',
    dot: 'bg-purple-600',
  },
  {
    ring: 'ring-emerald-200',
    bgFrom: 'from-emerald-50',
    bgTo: 'to-teal-50',
    icon: 'text-emerald-600',
    dot: 'bg-emerald-600',
  },
  {
    ring: 'ring-amber-200',
    bgFrom: 'from-amber-50',
    bgTo: 'to-yellow-50',
    icon: 'text-amber-600',
    dot: 'bg-amber-500',
  },
];

export default function ProcessSection() {
  return (
    <Section
      id="process"
      className="bg-white py-14 sm:py-16 lg:py-20 lg:min-h-screen flex items-center scroll-mt-24"
    >
      <Container>
        <Reveal>
          <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
            <Badge tone="purple" className="mb-8">
              Comment ça marche
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
              4 étapes pour récupérer votre argent
            </h2>
            <p className="text-lg text-slate-600">
              Un processus simple et rapide pour faire valoir vos droits de consommateur.
            </p>
          </div>
        </Reveal>

        {/* Mobile: cartes empilées (hauteurs égales) */}
        <div className="sm:hidden space-y-6">
          {STEPS.map((step, i) => {
            const c = COLORS[i % COLORS.length];
            return (
              <Reveal key={i} delay={i * 0.1}>
                <div
                  className={`rounded-xl p-6 border ${c.ring} ring-1 bg-gradient-to-r ${c.bgFrom} ${c.bgTo} h-full`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 ${c.dot} text-white rounded-full flex items-center justify-center font-bold text-lg`}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={c.icon}>{step.icon}</div>
                        <Badge tone="blue" className="text-xs">
                          {step.time}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-slate-900 text-lg mb-2">{step.title}</h3>
                      <p className="text-slate-700 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Desktop: timeline horizontale (hauteurs égales) */}
        <div className="hidden sm:block">
          <div className="relative">
            <div className="absolute top-8 left-8 right-8 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {STEPS.map((step, i) => {
                const c = COLORS[i % COLORS.length];
                return (
                  <Reveal key={i} delay={i * 0.1}>
                    <div
                      className={`relative rounded-xl p-6 border ${c.ring} ring-1 bg-white shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col`}
                    >
                      <div
                        className={`absolute -top-4 left-6 w-8 h-8 ${c.dot} text-white rounded-full flex items-center justify-center text-sm font-bold z-10`}
                      >
                        {i + 1}
                      </div>
                      <div className="pt-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`${c.icon}`}>{step.icon}</div>
                          <Badge tone="blue" className="text-xs">
                            {step.time}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed flex-1">{step.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>

        <Reveal delay={0.8}>
          <div className="text-center mt-10 sm:mt-12">
            <Button
              href="/eligibilite#start"
              size="lg"
              icon={<Sparkles className="w-5 h-5" />}
              className="shadow-lg hover:shadow-xl"
            >
              Commencer maintenant
            </Button>
            <p className="mt-3 text-sm text-slate-500">
              Gratuit • Sans engagement • Résultat en 2 minutes
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
