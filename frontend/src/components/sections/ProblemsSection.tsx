'use client';

import { BookOpen, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Container, Reveal, Badge, Button } from '@/components/ui';
import SectionChevron from '@/components/ui/SectionChevron';
import { getContextualIcon } from '@/lib/icon-utils';

const PROBLEMS = [
  {
    title: 'Smartphone & High-Tech',
    desc: 'Écran fissuré, batterie défaillante, surchauffe... Tous les défauts tech couverts.',
    icon: 'smartphone',
    href: '/guides/smartphone-ecran-batterie-defaut-garantie-legale',
    legalHint: '2 ans neuf, 1 an occasion',
  },
  {
    title: 'Électroménager',
    desc: 'Panne de lave-linge, four qui ne chauffe plus, frigo défectueux...',
    icon: 'electromenager',
    href: '/guides/electromenager-garantie-legale',
    legalHint: 'Garantie légale 2 ans',
  },
  {
    title: 'Voiture & Auto',
    desc: 'Problème moteur, défaut électronique, véhicule non conforme...',
    icon: 'voiture',
    href: '/guides/voiture-electrique-defaut-garantie-legale',
    legalHint: 'Garantie 2 ans',
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

const ProblemCard = ({ problem }: { problem: (typeof PROBLEMS)[0] }) => (
  <Link
    href={problem.href}
    className="group flex flex-col p-4 md:p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full min-h-[44px]"
  >
    <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
      <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
        {getContextualIcon(problem.icon, 'lg')}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-base md:text-lg text-gray-900 mb-0 group-hover:text-blue-600 transition">
          {problem.title}
        </h3>
        {problem.legalHint && <p className="text-xs text-gray-500 mt-1">{problem.legalHint}</p>}
      </div>
    </div>

    <p className="text-sm text-gray-600 flex-1 leading-relaxed">{problem.desc}</p>

    <div className="flex items-center justify-between mt-3 md:mt-4 pt-3 border-t border-gray-100">
      <span className="text-sm font-medium text-blue-600">Voir le guide</span>
      <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition" />
    </div>
  </Link>
);

export default function ProblemsSection() {
  return (
    <section className="py-8 md:py-12 lg:py-20 relative" id="problemes">
      <Container>
        <Reveal>
          <div className="text-center mb-6 md:mb-10">
            <Badge variant="secondary" className="mb-3 md:mb-4">
              Cas d'usage fréquents
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Votre produit vous pose problème ?
            </h2>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Découvrez nos guides spécialisés selon le type de produit ou service
            </p>
          </div>
        </Reveal>

        <div className="grid gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.href} delay={i * 0.1}>
              <ProblemCard problem={p} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.6}>
          <div className="text-center mt-6 md:mt-10">
            <Button
              href="/guides"
              variant="outline"
              size="lg"
              icon={<BookOpen className="w-4 h-4" />}
            >
              Voir tous les guides
            </Button>
          </div>
        </Reveal>
      </Container>

      <SectionChevron targetId="process" />
    </section>
  );
}
