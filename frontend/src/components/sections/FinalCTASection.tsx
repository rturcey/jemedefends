'use client';

import { ArrowRight, CheckCircle, Clock, Shield, Scale, Sparkles } from 'lucide-react';
import * as React from 'react';
import Link from 'next/link';

import { Container } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

export default function FinalCTASection() {
  const reassuranceItems = [
    { title: '100% Gratuit', icon: <CheckCircle className="w-5 h-5 text-green-600" /> },
    { title: '3 minutes', icon: <Clock className="w-5 h-5 text-blue-600" /> },
    { title: 'Fiable', icon: <Shield className="w-5 h-5 text-purple-600" /> },
    { title: 'Sans effort', icon: <Sparkles className="w-5 h-5 text-yellow-600" /> },
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.08),transparent_50%)]" />
        </div>

        <Container className="relative py-8 md:py-12 lg:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-4 md:mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-lg">
                <Scale
                  className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <div className="mb-6 md:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 md:mb-4 lg:mb-6 leading-tight">
                Prêt à faire valoir vos droits ?
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                Générez votre lettre juridique en 2 minutes et obtenez{' '}
                <strong>réparation, remplacement ou remboursement</strong>.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8 max-w-3xl mx-auto">
              {reassuranceItems.map(it => (
                <Card
                  key={it.title}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm"
                >
                  <CardHeader className="flex flex-row items-center gap-2 py-4 justify-center">
                    {it.icon}
                    <CardTitle className="text-sm md:text-base font-semibold text-gray-900">
                      {it.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto min-h-[56px] text-base font-semibold shadow-xl hover:shadow-2xl"
              >
                <Link href="/eligibilite" className="inline-flex items-center gap-2">
                  Générer ma lettre gratuitement
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto min-h-[56px] text-sm"
              >
                <Link href="/guides">Voir les guides</Link>
              </Button>
            </div>

            <div className="mt-4 md:mt-6">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <span>Aucune inscription requise</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span>Options de confort payantes</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                  <span>Références juridiques vérifiées</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
