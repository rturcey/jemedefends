// src/components/sections/ProblemsSection.tsx
// MODIFIÉ - Utilise des icônes React au lieu des emojis

'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { Container, Reveal, Badge, Button } from '@/components/ui';
import { getIconForCategory, getSeverityIcon } from '@/lib/icon-utils';

type Problem = {
  categoryName: string; // ✅ MODIFIÉ : Plus d'emoji, nom de catégorie
  title: string;
  desc: string;
  href: string;
  tag?: string;
  severity?: 'high' | 'medium' | 'low';
};

const PROBLEMS: Problem[] = [
  {
    categoryName: 'High-Tech', // ✅ Plus d'emoji hardcodé
    title: 'Téléphone en panne',
    desc: 'Écran fissuré, batterie défaillante, dysfonctionnements système...',
    href: '/guides/smartphones-telephone-en-panne',
    tag: 'High-Tech',
    severity: 'high',
  },
  {
    categoryName: 'High-Tech',
    title: 'Ordinateur défectueux',
    desc: 'Lenteurs, surchauffe, pannes matérielles récurrentes...',
    href: '/guides/ordinateurs-defectueux',
    tag: 'High-Tech',
    severity: 'high',
  },
  {
    categoryName: 'Électroménager',
    title: 'Électroménager HS',
    desc: 'Lave-linge, réfrigérateur, four qui tombent en panne...',
    href: '/guides/electromenager-hs',
    tag: 'Électroménager',
    severity: 'medium',
  },
  {
    categoryName: 'Automobile',
    title: 'Voiture avec défauts',
    desc: 'Problèmes moteur, équipements non conformes, défaut antérieur...',
    href: '/guides/voiture-defauts',
    tag: 'Automobile',
    severity: 'high',
  },
  {
    categoryName: 'Textile',
    title: 'Vêtements défaillants',
    desc: 'Décoloration, coutures qui lâchent, matière inadéquate...',
    href: '/guides/vetements-defaillants',
    tag: 'Textile',
    severity: 'low',
  },
  {
    categoryName: 'Audio/Vidéo',
    title: 'Matériel audio/vidéo',
    desc: 'Son de mauvaise qualité, pannes, dysfonctionnements...',
    href: '/guides/audio-video-defectueux',
    tag: 'Audio/Vidéo',
    severity: 'medium',
  },
];

const getSeverityColor = (severity?: string) => {
  switch (severity) {
    case 'high':
      return 'border-red-200 bg-red-50';
    case 'medium':
      return 'border-yellow-200 bg-yellow-50';
    case 'low':
      return 'border-green-200 bg-green-50';
    default:
      return 'border-gray-200 bg-gray-50';
  }
};

const getSeverityText = (severity?: string) => {
  switch (severity) {
    case 'high':
      return 'Fréquent';
    case 'medium':
      return 'Occasionnel';
    case 'low':
      return 'Rare';
    default:
      return '';
  }
};

const ProblemCard: React.FC<{ problem: Problem }> = ({ problem }) => {
  return (
    <Link
      href={problem.href}
      className={`
        group block p-4 sm:p-6 
        border rounded-xl transition-all duration-200
        hover:shadow-lg hover:border-blue-300
        min-h-[44px] touch-manipulation
        ${getSeverityColor(problem.severity)}
      `}
    >
      {/* Header avec icône et tag */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 p-2 bg-white rounded-lg shadow-sm">
            {/* ✅ UTILISE LA FONCTION CENTRALISÉE */}
            {getIconForCategory(problem.categoryName, 'lg')}
          </div>

          {problem.tag && (
            <Badge variant="secondary" className="text-xs">
              {problem.tag}
            </Badge>
          )}
        </div>

        {/* Indicateur de sévérité */}
        {problem.severity && (
          <div className="flex items-center gap-1">
            {/* ✅ UTILISE LA FONCTION CENTRALISÉE */}
            {getSeverityIcon(problem.severity)}
            <span className="text-xs text-gray-600 hidden sm:inline">
              {getSeverityText(problem.severity)}
            </span>
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="space-y-2">
        <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
          {problem.title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{problem.desc}</p>
      </div>

      {/* Footer avec CTA */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
        <span className="text-xs text-gray-500">Voir le guide</span>
        <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </Link>
  );
};

export default function ProblemsSection() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white">
      <Container>
        <Reveal>
          <div className="text-center mb-8 lg:mb-12">
            <Badge variant="secondary" className="mb-4">
              Cas d'usage fréquents
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Votre produit vous pose problème ?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez nos guides spécialisés pour chaque type de problème de consommation
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 lg:mb-12">
          {PROBLEMS.map((problem, index) => (
            <Reveal key={problem.href} delay={index * 0.1}>
              <ProblemCard problem={problem} />
            </Reveal>
          ))}
        </div>

        {/* CTA vers tous les guides */}
        <Reveal delay={0.6}>
          <div className="text-center">
            <Button
              href="/guides"
              variant="outline"
              size="lg"
              className="min-h-[44px] touch-manipulation"
            >
              {getIconForCategory('Général', 'sm')}
              <span className="ml-2">Voir tous les guides</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
