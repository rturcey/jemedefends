'use client';

import * as React from 'react';
import { Section, Container, Button, Reveal } from '@/components/ui';
import { Zap, CheckCircle, ArrowRight, Shield, Clock } from 'lucide-react';

export default function FinalCTASection() {
  return (
      <div className="relative">
        {/* Pattern de fond subtil */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 opacity-40" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
        </div>

        <div className="relative">
          <Container>
            <div className="py-16 sm:py-20 lg:py-24 px-4"> {/* Padding mobile ajouté */}
              {/* Header principal */}
              <Reveal>
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
                    <Zap className="w-4 h-4" />
                    Action immédiate possible
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    Prêt à récupérer
                    <span className="block sm:inline text-blue-600"> votre argent ?</span>
                  </h2>

                  <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                    Ne laissez pas un vendeur ignorer vos droits. Générez votre lettre juridique en 2 minutes
                    et obtenez <strong>réparation, remplacement ou remboursement</strong>.
                  </p>
                </div>
              </Reveal>

              {/* Avantages en chips */}
              <Reveal delay={0.1}>
                <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    100% gratuit
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium text-gray-700">
                    <Clock className="w-4 h-4 text-blue-600" />
                    2 minutes chrono
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-sm font-medium text-gray-700">
                    <Shield className="w-4 h-4 text-purple-600" />
                    Articles de loi inclus
                  </div>
                </div>
              </Reveal>

              {/* CTA Principal avec design moderne */}
              <Reveal delay={0.2}>
                <div className="text-center mb-12">
                  <div className="inline-block">
                    <Button
                        href="/eligibilite#start"
                        size="xl"
                        className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 px-8 py-4 text-lg"
                        icon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                    >
                      Vérifier mes droits maintenant
                    </Button>
                  </div>

                  <p className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Résultat immédiat • Sans inscription • Références légales incluses
                  </p>
                </div>
              </Reveal>

              {/* Témoignage/Statistique */}
              <Reveal delay={0.3}>
                <div className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                          </svg>
                      ))}
                    </div>

                    <blockquote className="text-gray-700 mb-4 italic text-base sm:text-lg">
                      "Lettre reçue en 30 secondes avec tous les articles de loi.
                      Le vendeur m'a remboursé sous 8 jours !"
                    </blockquote>

                    <div className="text-sm text-gray-500">
                      <strong>Marie L.</strong> • Smartphone défectueux • Remboursée 450€
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