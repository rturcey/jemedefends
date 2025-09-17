'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Container, Reveal, Badge, Button } from '@/components/ui';
import { getIconForCategory } from '@/lib/icon-utils';

type Problem = {
  categoryName: string;
  title: string;
  desc: string;
  href: string;
  legalHint?: string;
};

const PROBLEMS: Problem[] = [
  {
    categoryName: 'High-Tech',
    title: 'Téléphone en panne',
    desc: 'Écran fissuré, batterie défaillante, dysfonctionnements système...',
    href: '/guides/smartphones-telephone-en-panne',
    legalHint: 'Garantie légale 2 ans',
  },
  {
    categoryName: 'Automobile',
    title: 'Voiture avec défauts',
    desc: 'Problèmes moteur, équipements non conformes, défaut antérieur...',
    href: '/guides/voiture-defauts',
    legalHint: 'Garantie légale 12 mois (occasion)',
  },
  {
    categoryName: 'Électroménager',
    title: 'Électroménager HS',
    desc: 'Lave-linge, lave-vaisselle, réfrigérateur, four qui tombent en panne...',
    href: '/guides/electromenager-hs',
    legalHint: 'Garantie légale 2 ans',
  },
  {
    categoryName: 'Textile',
    title: 'Vêtements défaillants',
    desc: 'Décoloration, coutures qui lâchent, matière inadéquate...',
    href: '/guides/vetements-defaillants',
    legalHint: 'Garantie légale 2 ans',
  },
  {
    categoryName: 'Audio/Vidéo',
    title: 'Matériel audio/vidéo',
    desc: 'Son de mauvaise qualité, pannes, dysfonctionnements...',
    href: '/guides/audio-video-defectueux',
    legalHint: 'Garantie légale 2 ans',
  },
  {
    categoryName: 'Informatique',
    title: 'Ordinateur défectueux',
    desc: 'Lenteurs, surchauffe, problèmes logiciels, pannes matérielles récurrentes...',
    href: '/guides/ordinateurs-defectueux',
    legalHint: 'Garantie légale 2 ans',
  },
];

const ProblemCard = ({ problem }: { problem: Problem }) => (
  <Link
    href={problem.href}
    className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
  >
    <div className="flex items-start gap-3 mb-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {getIconForCategory(problem.categoryName, 'md')}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
          {problem.title}
        </h3>
        {problem.legalHint && <p className="text-xs text-gray-500 mt-1">{problem.legalHint}</p>}
      </div>
    </div>

    <p className="text-sm text-gray-600 flex-1">{problem.desc}</p>

    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
      <span className="text-sm font-medium text-blue-600">Voir le guide</span>
      <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition" />
    </div>
  </Link>
);

export default function ProblemsSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20" id={'problemes'}>
      <Container>
        <Reveal>
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-4">
              Cas d’usage fréquents
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Votre produit vous pose problème ?
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Découvrez nos guides spécialisés selon le type de produit ou service
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.href} delay={i * 0.1}>
              <ProblemCard problem={p} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.6}>
          <div className="text-center mt-10">
            <Button
              href="/guides"
              variant="outline"
              size="lg"
              icon={<ArrowRight className="w-4 h-4 ml-2" />}
            >
              Voir tous les guides
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
