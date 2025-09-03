'use client';

import * as React from 'react';
import Link from 'next/link';
import { Container, Reveal, Badge, Button } from '@/components/ui';
import { ArrowRight, Shield, Clock, CheckCircle } from 'lucide-react';

type Problem = {
  emoji: string;
  title: string;
  desc: string;
  href: string;
  tag?: string;
  severity?: 'high' | 'medium' | 'low';
};

const PROBLEMS: Problem[] = [
  {
    emoji: '📱',
    title: 'Téléphone en panne',
    desc: 'Écran fissuré, batterie défaillante, dysfonctionnements système...',
    href: '/guides/smartphones-telephone-en-panne',
    tag: 'High-Tech',
    severity: 'high',
  },
  {
    emoji: '💻',
    title: 'Ordinateur défectueux',
    desc: 'Lenteurs, surchauffe, pannes matérielles récurrentes...',
    href: '/guides/ordinateurs-defectueux',
    tag: 'High-Tech',
    severity: 'high',
  },
  {
    emoji: '🏠',
    title: 'Électroménager HS',
    desc: 'Lave-linge, réfrigérateur, four qui tombent en panne...',
    href: '/guides/electromenager-hs',
    tag: 'Électroménager',
    severity: 'medium',
  },
  {
    emoji: '🚗',
    title: 'Voiture avec défauts',
    desc: 'Problèmes moteur, équipements non conformes, défaut antérieur...',
    href: '/guides/voiture-defauts',
    tag: 'Automobile',
    severity: 'high',
  },
  {
    emoji: '👕',
    title: 'Vêtements défaillants',
    desc: 'Décoloration, coutures qui lâchent, matière inadéquate...',
    href: '/guides/vetements-defaillants',
    tag: 'Textile',
    severity: 'low',
  },
  {
    emoji: '🎧',
    title: 'Matériel audio/vidéo',
    desc: 'Son de mauvaise qualité, pannes, dysfonctionnements...',
    href: '/guides/audio-video-defectueux',
    tag: 'Général',
    severity: 'medium',
  },
];

// Composant Card mobile-optimisé
const ProblemCard: React.FC<{ problem: Problem }> = ({ problem }) => {
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-200 bg-red-50 hover:bg-red-100';
      case 'medium':
        return 'border-orange-200 bg-orange-50 hover:bg-orange-100';
      case 'low':
        return 'border-green-200 bg-green-50 hover:bg-green-100';
      default:
        return 'border-gray-200 bg-gray-50 hover:bg-gray-100';
    }
  };

  return (
    <Link
      href={problem.href}
      prefetch={false}
      className={`
        group block p-4 sm:p-6 rounded-xl border-2 transition-all duration-200
        ${getSeverityColor(problem.severity)}
        hover:scale-[1.02] hover:shadow-lg
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white
        touch-manipulation active:scale-[0.98]
      `}
      aria-label={`Consulter le guide : ${problem.title}`}
    >
      {/* Header avec emoji et tag */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl sm:text-3xl" aria-hidden="true">
          {problem.emoji}
        </span>
        {problem.tag && (
          <span className="text-xs px-2 py-1 bg-white rounded-full font-medium text-gray-600 border">
            {problem.tag}
          </span>
        )}
      </div>

      {/* Titre */}
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight">
        {problem.title}
      </h3>

      {/* Description */}
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">{problem.desc}</p>

      {/* CTA avec icône */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-blue-600">Voir le guide</span>
        <ArrowRight className="h-4 w-4 text-blue-600 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
};

// Composant Stats mobile-optimisé
const StatsBar: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8">
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Shield className="h-5 w-5 text-blue-600 mr-2" />
          <span className="text-2xl sm:text-3xl font-bold text-blue-600">2 ans</span>
        </div>
        <p className="text-xs sm:text-sm text-gray-600">de protection légale</p>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Clock className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-2xl sm:text-3xl font-bold text-green-600">3 min</span>
        </div>
        <p className="text-xs sm:text-sm text-gray-600">pour créer votre lettre</p>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <CheckCircle className="h-5 w-5 text-purple-600 mr-2" />
          <span className="text-2xl sm:text-3xl font-bold text-purple-600">Conforme</span>
        </div>
        <p className="text-xs sm:text-sm text-gray-600">au Code de la consommation</p>
      </div>
    </div>
  </div>
);

export default function ProblemsSection() {
  return (
    <section
      id="problemes"
      className="bg-slate-50 min-h-screen py-12 sm:py-16 lg:py-20 section-scroll-target"
      aria-labelledby="problems-title"
    >
      <Container>
        <div className="w-full max-w-6xl mx-auto">
          <Reveal>
            {/* Header mobile-optimisé */}
            <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-12">
              <Badge tone="blue" className="mb-6 sm:mb-8 text-sm sm:text-base">
                Problèmes courants
              </Badge>

              <h2
                id="problems-title"
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4 sm:mb-6 leading-tight"
              >
                Votre produit a un défaut ?
              </h2>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed px-4 sm:px-0">
                Découvrez les situations où vous pouvez <strong>légalement</strong> exiger
                réparation, remplacement ou remboursement.
              </p>
            </div>

            {/* Stats bar */}
            <StatsBar />

            {/* Grid de problèmes mobile-first */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {PROBLEMS.map((problem, index) => (
                <Reveal key={problem.href} delay={index * 0.1}>
                  <ProblemCard problem={problem} />
                </Reveal>
              ))}
            </div>

            {/* CTA section mobile-optimisée */}
            {/* CTA section mobile-optimisée */}
            <div
              aria-labelledby="cta-title"
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-6 sm:p-8 text-center shadow-lg ring-1 ring-white/10"
            >
              <h3 id="cta-title" className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                <span aria-hidden="true" className="mr-1">
                  💪
                </span>
                Problème non listé ?
              </h3>

              <p className="text-blue-50 mb-6 sm:mb-8 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                Notre formulaire d’éligibilité analyse votre situation spécifique et détermine si
                vous pouvez faire valoir la garantie légale.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
                {/* Bouton principal : blanc avec texte bleu (override garanti) */}
                <Button
                  href="/eligibilite"
                  // on neutralise le variant 'primary' : on force bg + texte avec '!'
                  className="!bg-white !text-blue-700 font-bold py-3 px-6 rounded-lg hover:!bg-white/90 active:scale-[0.98] transition
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-blue-700"
                >
                  🔍 Tester mon cas
                </Button>

                {/* Bouton secondaire : transparent, bord blanc, texte blanc */}
                <Button
                  href="/guides"
                  // on force le style pour éviter toute régression de variant
                  className="!bg-transparent !text-white font-bold py-3 px-6 rounded-lg border-2 border-white/90
                 hover:!bg-white hover:!text-blue-700 active:scale-[0.98] transition
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-blue-700"
                >
                  📚 Tous les guides
                </Button>
              </div>

              {/* Centrage durci (au cas où un style global remet du text-left) */}
              <p className="text-[11px] sm:text-xs text-blue-100 mt-4 sm:mt-6 !text-center w-full mx-auto">
                ✅ Analyse gratuite • ✅ Résultat immédiat • ✅ Conforme au Code de la consommation
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

// Hook pour la gestion responsive
const useResponsive = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);

  React.useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { isMobile, isTablet, isDesktop: !isMobile && !isTablet };
};

// Composant Layout mobile-optimisé pour les guides
const GuideLayout: React.FC<{
  children: React.ReactNode;
  title: string;
  breadcrumbs?: Array<{ name: string; href: string }>;
}> = ({ children, title, breadcrumbs = [] }) => {
  const { isMobile } = useResponsive();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header mobile sticky */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 sm:relative sm:bg-transparent sm:border-0">
        <Container>
          <div className="py-3 sm:py-6">
            {/* Breadcrumbs mobile */}
            {breadcrumbs.length > 0 && (
              <nav className="mb-2 sm:mb-4" aria-label="Fil d'ariane">
                <ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500">
                  {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return (
                      <li key={crumb.href} className="flex items-center">
                        {index > 0 && <span className="mx-1 sm:mx-2 text-gray-300">/</span>}
                        {isLast ? (
                          <span
                            aria-current="page"
                            className="truncate max-w-[80px] sm:max-w-none text-gray-700"
                            title={crumb.name}
                          >
                            {crumb.name}
                          </span>
                        ) : (
                          <Link
                            href={crumb.href}
                            prefetch={false}
                            className="hover:text-blue-600 transition-colors truncate max-w-[80px] sm:max-w-none"
                            title={crumb.name}
                          >
                            {crumb.name}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </nav>
            )}

            {/* Titre responsive */}
            <h1
              className={`
              font-bold text-gray-900 leading-tight
              ${isMobile ? 'text-lg' : 'text-2xl sm:text-3xl lg:text-4xl'}
            `}
            >
              {title}
            </h1>
          </div>
        </Container>
      </div>

      {/* Contenu */}
      <Container>
        <div className="pb-12 sm:pb-16 lg:pb-20">{children}</div>
      </Container>
    </div>
  );
};

// Export des utilitaires mobile
export { ProblemCard, StatsBar, useResponsive, GuideLayout };
