'use client';
import * as React from 'react';
import Button from '@/components/ui/Button';
import { ArrowRight, HelpCircle, ChevronDown, CheckCircle, Shield } from 'lucide-react';

type Item = { q: string; a: React.ReactNode };

const ITEMS: Item[] = [
  {
    q: 'Est-ce gratuit ?',
    a: (
      <>
        Oui, vous obtenez <strong>gratuitement</strong> le contenu complet de la lettre avec les
        <strong> articles pertinents</strong> du Code de la consommation.
      </>
    ),
  },
  {
    q: 'Combien de temps ?',
    a: (
      <>
        Moins de <strong>3 minutes</strong> : diagnostic d’éligibilité puis génération immédiate de
        la lettre.
      </>
    ),
  },
  {
    q: 'Base juridique ?',
    a: (
      <>
        Uniquement les <strong>articles pertinents</strong> du Code de la consommation (ex. L.217-3,
        L.217-8, L.217-10).
      </>
    ),
  },
];

export default function HeroRightFAQ() {
  return (
    <div className="hidden lg:block w-[22rem] max-w-full lg:ml-8 xl:ml-12">
      <div className="rounded-2xl border border-gray-200/70 bg-white/70 backdrop-blur-md shadow-md p-5">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
            <HelpCircle className="h-4 w-4" />
          </span>
          <h3 className="text-base font-extrabold tracking-tight">FAQ express</h3>
        </div>

        <div className="mt-3">
          <ul className="divide-y divide-gray-200/80">
            {ITEMS.map((item, i) => (
              <li key={i} className="py-1.5">
                <details className="group open:bg-white/60 rounded-lg">
                  <summary
                    className="flex w-full items-center justify-between gap-3 cursor-pointer select-none px-3 py-2.5
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-lg"
                  >
                    <span className="text-[15px] font-semibold text-gray-900 leading-6">
                      {item.q}
                    </span>
                    <ChevronDown
                      className="h-4 w-4 text-gray-500 transition-transform group-open:rotate-180"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="px-3 pb-3 -mt-1 text-[13px] leading-6 text-gray-700">
                    {item.a}
                  </div>
                </details>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex">
          <Button href="/eligibilite#start" size="sm" icon={<ArrowRight className="w-3.5 h-3.5" />}>
            Vérifier mon éligibilité
          </Button>
        </div>
      </div>

      <div className="mt-5 space-y-1.5 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span>
            Basé sur le <strong>Code de la consommation</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-600" />
          <span>
            Données minimales & <strong>hébergement 🇫🇷</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
