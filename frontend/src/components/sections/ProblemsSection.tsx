'use client';

import * as React from 'react';
import { Section, Container, Reveal, Badge, Button } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

type Problem = { emoji: string; title: string; desc: string; href: string; tag?: string };

const PROBLEMS: Problem[] = [
  {
    emoji: '📱',
    title: 'Téléphone en panne',
    desc: 'Écran fissuré, batterie défaillante, dysfonctionnements...',
    href: '/guides/smartphones-telephone-en-panne',
    tag: 'High-Tech',
  },
  {
    emoji: '💻',
    title: 'Ordinateur défectueux',
    desc: 'Lenteurs, surchauffe, pannes matérielles récurrentes...',
    href: '/guides/ordinateurs-defectueux',
    tag: 'High-Tech',
  },
  {
    emoji: '🏠',
    title: 'Électroménager HS',
    desc: 'Lave-linge, réfrigérateur, four... qui tombent en panne.',
    href: '/guides/electromenager-hs',
    tag: 'Électroménager',
  },
  {
    emoji: '🚗',
    title: 'Voiture avec défauts',
    desc: 'Problèmes moteur, équipements non conformes...',
    href: '/guides/voiture-defauts',
    tag: 'Automobile',
  },
  {
    emoji: '👕',
    title: 'Vêtements défaillants',
    desc: 'Décoloration, coutures qui lâchent, matière inadéquate...',
    href: '/guides/vetements-defaillants',
    tag: 'Textile',
  },
  {
    emoji: '🎧',
    title: 'Matériel audio/vidéo',
    desc: 'Son de mauvaise qualité, pannes, dysfonctionnements...',
    href: '/guides/audio-video-defectueux',
    tag: 'Général',
  },
];

export default function ProblemsSection() {
  return (
    <section
      id="problemes"
      className="bg-slate-50 min-h-screen md:h-[calc(100vh-5rem)] flex items-center justify-center section-scroll-target"
    >
      <Container>
        <div className="w-full">
          <Reveal>
            <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
              <Badge tone="blue" className="mb-8 sm:mb-10">
                Problèmes courants
              </Badge>
              {/* AJOUT : Espace supplémentaire entre Badge et Titre */}
              <div className="h-3"></div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Votre produit a un défaut ?
              </h2>
              <p className="text-lg text-slate-600">
                Découvrez les situations où vous pouvez <strong>légalement</strong> exiger
                réparation, remplacement ou remboursement.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROBLEMS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <a
                  href={p.href}
                  className="block bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:border-blue-300 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  aria-label={`${p.title} — lire le guide`}
                >
                  <div className="text-4xl mb-4">{p.emoji}</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-lg">{p.title}</h3>
                    {p.tag ? <Badge tone="blue">{p.tag}</Badge> : null}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mt-1">{p.desc}</p>
                  <div className="mt-3 inline-flex items-center text-blue-700">
                    <span className="text-sm font-medium">Lire le guide</span>
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.6}>
            <div className="text-center mt-8 sm:mt-10">
              <p className="text-slate-600 mb-4">
                Votre problème n&apos;est pas dans cette liste ?
              </p>
              <Button href="/eligibilite#start" variant="outline" icon={<ArrowRight />}>
                Tester mon cas spécifique
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
