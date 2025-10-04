'use client';

import { ArrowRight, CheckCircle, Clock, Shield } from 'lucide-react';
import * as React from 'react';

import { Container, Reveal, Button } from '@/components/ui';

export default function FinalCTASection() {
  return (
    <div className="relative overflow-hidden">
      {/* Fond avec gradients */}
      <div className="relative bg-gradient-to-br from-surface-soft to-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-40" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
        </div>

        <Container className="relative py-12 md:py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Titre principal */}
            <Reveal>
              <div className="mb-8 md:mb-10">
                <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                  Prêt à faire valoir vos droits ?
                </h2>
                <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                  Générez votre lettre juridique en 2 minutes et obtenez{' '}
                  <strong>réparation, remplacement ou remboursement</strong>.
                </p>
              </div>
            </Reveal>

            {/* Avantages en chips */}
            <Reveal delay={0.1}>
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-8 md:mb-10">
                <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-xs md:text-sm font-medium text-gray-700">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                  100% gratuit
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-xs md:text-sm font-medium text-gray-700">
                  <Clock className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />2 minutes chrono
                </div>
                <div className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-xs md:text-sm font-medium text-gray-700">
                  <Shield className="w-3 h-3 md:w-4 md:h-4 text-purple-600" />
                  Articles de loi inclus
                </div>
              </div>
            </Reveal>

            {/* CTA Principal */}
            <Reveal delay={0.2}>
              <div className="text-center mb-8 md:mb-12">
                <div className="inline-block">
                  <Button
                    href="/eligibilite#start"
                    size="xl"
                    className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg"
                    icon={
                      <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                    }
                  >
                    Vérifier mes droits maintenant
                  </Button>
                </div>

                <p className="mt-4 md:mt-6 text-xs md:text-sm text-gray-500 flex flex-wrap items-center justify-center gap-1 md:gap-2 text-center">
                  <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                  <span>Résultat immédiat • Sans inscription • Références légales incluses</span>
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>
    </div>
  );
}
