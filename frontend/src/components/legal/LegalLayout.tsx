'use client';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { Reveal } from '@/components/ui';

function LegalLayout({
  title,
  subtitle,
  children,
}: React.PropsWithChildren<{ title: string; subtitle?: string }>) {
  return (
    <div className="min-h-screen">
      <Reveal>
        <main className="mx-auto w-full max-w-4xl px-4 py-6 md:py-10">
          {/* Breadcrumb mobile-first */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à l'accueil
            </Link>
          </div>

          <div className="w-full max-w-3xl mx-auto">
            {/* Header épuré mobile-first */}
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h1>
              {subtitle && <p className="text-gray-600 text-base md:text-lg">{subtitle}</p>}
            </div>

            {/* Contenu principal */}
            <div className="space-y-6 mb-12">{children}</div>

            {/* CTA vers l'éligibilité - réutilise le design des formulaires */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center flex flex-col items-center">
              <h3 className="font-semibold text-blue-900 mb-2">🚀 Besoin d'agir ?</h3>

              <p className="text-sm text-blue-700 mb-4">
                Générez gratuitement votre lettre fondée sur le Code de la consommation !
              </p>

              <Link
                href="/eligibilite"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Vérifier mon éligibilité
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>

            {/* Footer info - design cohérent avec les formulaires */}
            <div className="mt-8 p-5 bg-green-50 rounded-xl border border-green-200">
              <h3 className="font-semibold text-green-900 mb-3 text-center">💡 Transparence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-green-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🇫🇷</span>
                  <span>Hébergement Scaleway (France)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">💳</span>
                  <span>Paiements Stancer (France)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">📮</span>
                  <span>Envoi via Merci Facteur</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🆓</span>
                  <span>Service gratuit maintenu</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Reveal>
    </div>
  );
}

export default LegalLayout;
