'use client';

import { ArrowRight, Book, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

import { Container, Reveal, Badge, Button } from '@/components/ui';
import { getIconFromCategoryId, getIconFromName } from '@/lib/icon-utils';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

const PROBLEMS = [
  {
    title: 'Smartphone & High-Tech',
    desc: 'Écran fissuré, batterie défaillante, surchauffe... Tous les défauts tech couverts.',
    icon: 'Smartphone',
    href: '/guides/smartphone-ecran-batterie-defaut-garantie-legale',
    legalHint: '2 ans neuf, 1 an occasion',
  },
  {
    title: 'Électroménager',
    desc: 'Panne de lave-linge, four qui ne chauffe plus, frigo défectueux...',
    icon: 'Home',
    href: '/guides/electromenager-garantie-legale',
    legalHint: 'Garantie légale 2 ans',
  },
  {
    title: 'Voiture & Auto',
    desc: 'Problème moteur, défaut électronique, véhicule non conforme...',
    icon: 'Car',
    href: '/guides/voiture-electrique-defaut-garantie-legale',
    legalHint: 'Garantie 2 ans',
  },
  {
    categoryName: 'Textile',
    title: 'Vêtements défaillants',
    desc: 'Décoloration, coutures qui lâchent, matière inadéquate...',
    icon: 'Shirt',
    href: '/guides/vetements-defaillants',
    legalHint: 'Garantie légale 2 ans',
  },
  {
    categoryName: 'Audio/Vidéo',
    title: 'Matériel audio/vidéo',
    desc: 'Son de mauvaise qualité, pannes, dysfonctionnements...',
    icon: 'Headphones',
    href: '/guides/audio-video-defectueux',
    legalHint: 'Garantie légale 2 ans',
  },
  {
    categoryName: 'Informatique',
    title: 'Laptop',
    desc: 'Lenteurs, surchauffe, problèmes logiciels, pannes matérielles récurrentes...',
    icon: 'Informatique',
    href: '/guides/ordinateurs-defectueux',
    legalHint: 'Garantie légale 2 ans',
  },
];

const ProblemCard = ({ problem }: { problem: (typeof PROBLEMS)[0] }) => {
  const { isMobile } = useMobileOptimization();
  const [isExpanded, setIsExpanded] = useState(false);

  // Sur desktop, toujours en lien
  if (!isMobile) {
    return (
      <Link
        href={problem.href}
        className="group flex flex-col p-3 sm:p-4 md:p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 h-full min-h-[44px]"
      >
        <div
          className="flex items-start gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
          <div
            className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
            {
              getIconFromName(problem.icon, 'lg', 'w-5 h-5')
            }
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-bold text-sm sm:text-base md:text-lg text-gray-900 mb-0 group-hover:text-blue-600 transition leading-tight">
              {problem.title}
            </h3>
            {problem.legalHint && (
              <p
                className="hidden xs:block text-[10px] sm:text-xs text-gray-500 mt-0.5">
                {problem.legalHint}
              </p>
            )}
          </div>
        </div>

        <p
          className="text-xs sm:text-sm md:text-base text-gray-600 flex-1 leading-relaxed">
          {problem.desc}
        </p>

        <div
          className="flex items-center justify-between mt-2 sm:mt-3 md:mt-4 pt-2 sm:pt-3 border-t border-gray-100">
          <span
            className="text-xs sm:text-sm font-medium text-blue-600">Voir le guide</span>
          <ArrowRight
            className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition" />
        </div>
      </Link>
    );
  }

  // Sur mobile : card déroulable
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-3 flex items-center justify-between gap-2 text-left"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
            {
              getIconFromName(problem.icon, 'lg', 'w-5 h-5')
            }
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-bold text-sm text-gray-900 leading-tight">{problem.title}</h3>
            {problem.legalHint && (
              <p className="text-[10px] text-gray-500 mt-0.5">{problem.legalHint}</p>
            )}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 space-y-3 border-t border-gray-100 pt-3">
          <p className="text-xs text-gray-600 leading-relaxed">{problem.desc}</p>
          <Link
            href={problem.href}
            className="flex items-center justify-between text-xs font-medium text-blue-600 hover:text-blue-700"
          >
            <span>Voir le guide complet</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default function ProblemsSection() {
  return (
    <section
      className="section-scroll-target section-mobile-centered relative overflow-hidden"
      id="problemes"
    >
      <Container>
        <div className="text-center mb-4 md:mb-8 lg:mb-10">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Votre produit vous pose problème ?
          </h2>
          <p
            className="text-sm md:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto">
            Découvrez nos guides spécialisés pour chaque type de produit
          </p>
        </div>

        {/* Grille adaptative : 1→2→3 colonnes */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {PROBLEMS.map((problem, index) => (
            <div key={problem.href}>
              <ProblemCard problem={problem} />
            </div>
          ))}
        </div>

        <div className="hidden md:flex justify-center mt-8">
          <Button href="/guides" variant="outline" icon={<BookOpen />}>
            Voir tous les guides
          </Button>
        </div>
      </Container>
    </section>
  );
}
