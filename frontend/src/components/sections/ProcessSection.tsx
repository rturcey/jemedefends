'use client';

import { HelpCircle, Shield, FileText, Zap, Sparkles } from 'lucide-react';
import * as React from 'react';

import { Section, Container, Reveal, Badge, Button } from '@/components/ui';
import Skeleton from '@/components/ui/Skeleton';
import SectionChevron from '@/components/ui/SectionChevron';

const STEPS = [
  {
    icon: <HelpCircle className="w-6 h-6 md:w-8 md:h-8" />,
    title: 'Test gratuit',
    desc: 'Répondez à quelques questions sur votre achat et le problème rencontré.',
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
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Section
      id="process"
      className="bg-white py-10 md:py-14 lg:py-20 min-h-screen md:h-[calc(100vh-5rem)] flex items-center section-scroll-target relative"
    >
      <Container>
        {/* Header compact mobile */}
        <Skeleton
          loading={!isLoaded}
          className="h-24 md:h-32 w-full mx-auto mb-8 md:mb-12 lg:mb-16"
        >
          <Reveal>
            <div className="max-w-3xl mx-auto text-center mb-8 md:mb-12 lg:mb-16">
              <Badge tone="purple" className="mb-4 md:mb-8 lg:mb-10">
                Comment ça marche
              </Badge>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 md:mb-6">
                4 étapes pour obtenir réparation
              </h2>
              <p className="text-base md:text-lg text-slate-600 text-center">
                Un processus simple et rapide pour faire valoir vos droits de consommateur.
              </p>
            </div>
          </Reveal>
        </Skeleton>

        {/* Steps grid compact mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {STEPS.map((step, i) => {
            const colors = COLORS[i];
            return (
              <Skeleton key={step.title} loading={!isLoaded} className="h-64 md:h-80 rounded-xl">
                <Reveal delay={i * 0.15}>
                  <div className="relative text-center group">
                    {/* Ligne de connexion (masquée sur mobile) */}
                    {i < STEPS.length - 1 && (
                      <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200">
                        <div
                          className={`h-full ${colors.dot} transition-all duration-1000`}
                          style={{ width: isLoaded ? '100%' : '0%' }}
                        />
                      </div>
                    )}

                    {/* Icône compact mobile */}
                    <div
                      className={`relative mx-auto w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${colors.bgFrom} ${colors.bgTo} flex items-center justify-center mb-4 md:mb-6 ring-4 ${colors.ring} group-hover:ring-8 transition-all duration-300`}
                    >
                      <div className={colors.icon}>{step.icon}</div>
                      <div className="absolute -top-2 -right-2 w-7 h-7 md:w-8 md:h-8 bg-slate-900 text-white text-sm font-bold rounded-full flex items-center justify-center">
                        {i + 1}
                      </div>
                    </div>

                    {/* Contenu compact */}
                    <div className="space-y-2 md:space-y-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-600">
                        <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                        {step.time}
                      </div>
                      <h3 className="font-bold text-lg md:text-xl text-slate-900">{step.title}</h3>
                      <p className="text-sm md:text-base text-slate-600 leading-relaxed px-2">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </Skeleton>
            );
          })}
        </div>

        {/* CTA compact mobile */}
        <Skeleton loading={!isLoaded} className="h-16 md:h-20 w-80 mx-auto mt-8 md:mt-12 lg:mt-16">
          <Reveal delay={0.8}>
            <div className="text-center mt-8 md:mt-12 lg:mt-16">
              <Button href="/eligibilite#start" size="lg" icon={<Sparkles />}>
                Tester gratuitement mes droits
              </Button>
              <p className="text-xs md:text-sm text-slate-500 mt-3 text-center">
                Gratuit • 2 minutes • Résultat immédiat
              </p>
            </div>
          </Reveal>
        </Skeleton>
      </Container>

      <SectionChevron targetId="fiabilite" />
    </Section>
  );
}
