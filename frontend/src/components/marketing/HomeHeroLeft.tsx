'use client';
import * as React from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { FileText, Shield, Sparkles, Zap, ArrowRight } from 'lucide-react';
import PlayIcon from '@/components/icons/PlayIcon';

export default function HomeHeroLeft() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Badge tone="green">Conforme au Code de la consommation</Badge>
        <Badge tone="blue">3 minutes max</Badge>
        <Badge tone="purple">Contenu gratuit</Badge>
      </div>

      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
        Obtenez réparation
        <span className="block bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
          en 3 minutes chrono
        </span>
      </h1>

      <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-2xl">
        <strong>Panne, défaut, produit non conforme ?</strong> Obtenez gratuitement le{' '}
        <em>contenu de votre lettre</em> de mise en demeure. Réparation, remplacement ou
        remboursement garantis par la loi.
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            label: 'Garantie légale obligatoire',
            icon: <Shield className="w-5 h-5 text-blue-700" />,
          },
          { label: 'Lettre prête à envoyer', icon: <FileText className="w-5 h-5 text-blue-700" /> },
          { label: 'Service gratuit', icon: <Sparkles className="w-5 h-5 text-blue-700" /> },
        ].map((it, i) => (
          <li
            key={i}
            className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3"
          >
            {it.icon}
            <span className="text-sm font-semibold text-gray-800">{it.label}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 items-stretch sm:items-center">
        <Button href="/eligibilite#start" icon={<Zap className="w-5 h-5" />}>
          Tester gratuitement mes droits
        </Button>
        <Button href="/#process" variant="outline" icon={<PlayIcon />}>
          Comment ça marche
        </Button>
      </div>
    </div>
  );
}
