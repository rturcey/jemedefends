// src/components/guides/GuideHero.tsx - VERSION AMÉLIORÉE
// Hero avec design moderne, breadcrumbs fonctionnels et badges colorés

'use client';

import { Clock, Scale, FileText, Zap, ArrowRight, Home, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import type { GuidePage } from '@/types/guides';

interface GuideHeroProps {
  guide: GuidePage & { slug: string; readingTime: number; difficulty: string };
  readingTime: number;
  difficulty: string;
}

// Utilitaire pour obtenir les couleurs de difficulté
function getDifficultyConfig(difficulty: string) {
  switch (difficulty) {
    case 'facile':
      return {
        color: 'bg-green-100 text-green-800 border-green-300',
        icon: '✅',
        label: 'Facile',
      };
    case 'moyen':
      return {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        icon: '⚠️',
        label: 'Moyen',
      };
    case 'difficile':
      return {
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: '🔥',
        label: 'Difficile',
      };
    default:
      return {
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: '📖',
        label: 'Guide',
      };
  }
}

// Utilitaire pour obtenir la catégorie depuis le slug
function getCategoryConfig(slug: string) {
  if (slug.includes('smartphone') || slug.includes('ordinateur') || slug.includes('tech')) {
    return {
      name: 'High-Tech',
      emoji: '📱',
      color: 'bg-blue-100 text-blue-800 border-blue-300',
    };
  }
  if (slug.includes('electromenager') || slug.includes('maison') || slug.includes('lave-')) {
    return {
      name: 'Électroménager',
      emoji: '🏠',
      color: 'bg-green-100 text-green-800 border-green-300',
    };
  }
  if (slug.includes('voiture') || slug.includes('auto')) {
    return {
      name: 'Automobile',
      emoji: '🚗',
      color: 'bg-red-100 text-red-800 border-red-300',
    };
  }
  return {
    name: 'Général',
    emoji: '⚖️',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
  };
}

// Composant Breadcrumbs fonctionnel
function FunctionalBreadcrumbs({ guide }: { guide: GuidePage & { slug: string } }) {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-4" aria-label="Fil d'Ariane">
      <Link href="/" className="hover:text-blue-600 transition-colors flex items-center">
        <Home className="w-4 h-4 mr-1" />
        Accueil
      </Link>

      <ChevronRight className="w-4 h-4 mx-2" />

      <Link href="/guides" className="hover:text-blue-600 transition-colors">
        Guides
      </Link>

      <ChevronRight className="w-4 h-4 mx-2" />

      <span className="text-gray-900 font-medium truncate">{guide.metadata.title}</span>
    </nav>
  );
}

// Utilitaire pour compter les références légales
function countLegalReferences(guide: GuidePage): number {
  return guide.legal.mainArticles.length;
}

const GuideHero = ({ guide, readingTime, difficulty }: any) => {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white overflow-hidden">
      {/* Pattern background subtil */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge catégorie */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-6">
            <span>{guide.category.emoji}</span>
            <span>{guide.category.name}</span>
          </div>

          {/* Titre principal */}
          <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 leading-tight">
            {guide.metadata.title}
          </h1>

          {/* Description */}
          <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
            {guide.metadata.seo?.description}
          </p>

          {/* Métriques en pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
              <span>⏱️</span>
              <span className="text-sm font-medium">{readingTime} min de lecture</span>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
              <span>📊</span>
              <span className="text-sm font-medium">Niveau {difficulty}</span>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
              <span>✅</span>
              <span className="text-sm font-medium">Juridiquement vérifié</span>
            </div>
          </div>

          {/* CTA principal */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/eligibilite"
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-4 text-lg shadow-xl hover:shadow-2xl"
            >
              🚀 Créer ma lettre maintenant
            </Button>

            <Button
              href="#content"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 font-medium px-8 py-4 text-lg"
            >
              📖 Lire le guide
            </Button>
          </div>
        </div>
      </div>

      {/* Gradient fade vers le contenu */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent" />
    </section>
  );
};

export default GuideHero;
