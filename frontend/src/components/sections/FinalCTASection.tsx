'use client';

import { ArrowRight, CheckCircle, Clock, Shield, Scale, Sparkles } from 'lucide-react';
import * as React from 'react';

import { Container, Reveal, Button } from '@/components/ui';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

export default function FinalCTASection() {
  const { isMobile } = useMobileOptimization();

  return (
    <div className="relative overflow-hidden">
      {/* ✅ Fond simplifié avec gradient subtil */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.08),transparent_50%)]" />
        </div>

        <Container className="relative py-8 md:py-12 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* ✅ AJOUT : Illustration symbolique forte */}
            <Reveal>
              <div className="mb-4 md:mb-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg">
                  <Scale
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </Reveal>

            {/* ✅ Titre réduit sur mobile */}
            <Reveal>
              <div className="mb-6 md:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 md:mb-4 lg:mb-6 leading-tight">
                  Prêt à faire valoir vos droits ?
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  Générez votre lettre juridique en 2 minutes et obtenez{' '}
                  <strong>réparation, remplacement ou remboursement</strong>.
                </p>
              </div>
            </Reveal>

            {/* ✅ AJOUT : Liste de bénéfices avec icônes (2 cols mobile, 4 cols desktop) */}
            <Reveal delay={0.1}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8 max-w-3xl mx-auto">
                <div className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" strokeWidth={2} />
                  <span className="text-xs sm:text-sm font-medium text-gray-900 text-center sm:text-left">
                    100% Gratuit
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" strokeWidth={2} />
                  <span className="text-xs sm:text-sm font-medium text-gray-900 text-center sm:text-left">
                    3 minutes
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
                  <Shield className="w-5 h-5 text-purple-600 flex-shrink-0" strokeWidth={2} />
                  <span className="text-xs sm:text-sm font-medium text-gray-900 text-center sm:text-left">
                    Bases juridiques
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
                  <Sparkles className="w-5 h-5 text-yellow-600 flex-shrink-0" strokeWidth={2} />
                  <span className="text-xs sm:text-sm font-medium text-gray-900 text-center sm:text-left">
                    Sans effort
                  </span>
                </div>
              </div>
            </Reveal>

            {/* ✅ CTA principal optimisé mobile (56px min-height pour touch target) */}
            <Reveal delay={0.15}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <Button
                  href="/eligibilite#start"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" strokeWidth={2} />}
                  className="w-full sm:w-auto min-h-[56px] text-base font-semibold shadow-xl hover:shadow-2xl"
                >
                  Générer ma lettre gratuitement
                </Button>

                {/* ✅ CTA secondaire en ghost (moins visible) */}
                <Button
                  href="/guides"
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto min-h-[56px] text-sm"
                >
                  Voir les guides
                </Button>
              </div>
            </Reveal>

            {/* ✅ Réassurance finale */}
            <Reveal delay={0.2}>
              <div className="mt-4 md:mt-6">
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Aucune carte bancaire requise</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>Articles de loi inclus</span>
                  </div>
                  <div className="hidden sm:flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Références juridiques vérifiées</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>
    </div>
  );
}
