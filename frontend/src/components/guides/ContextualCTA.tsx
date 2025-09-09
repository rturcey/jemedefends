// src/components/guides/ContextualCTA.tsx
// CTA contextuels adaptatifs selon la position dans le guide

'use client';

import { Zap, FileText, ArrowRight, Phone, Download, AlertTriangle } from 'lucide-react';
import React from 'react';

import Button from '@/components/ui/Button';

interface ContextualCTAProps {
  position: 'early-guide' | 'mid-guide' | 'late-guide';
  urgency?: string;
}

interface CTAConfig {
  title: string;
  description: string;
  primary: {
    text: string;
    icon: React.ComponentType<{ className?: string }>;
    href?: string;
    action?: string;
  };
  secondary: {
    text: string;
    icon: React.ComponentType<{ className?: string }>;
    href?: string;
    action?: string;
  };
}

// Configuration des CTA selon la position
const CTA_CONFIGS: Record<string, CTAConfig> = {
  'early-guide': {
    title: 'Déjà convaincu ?',
    description: 'Créez votre lettre maintenant ou continuez la lecture',
    primary: {
      text: 'Créer ma lettre',
      icon: Zap,
      href: '/eligibilite',
    },
    secondary: {
      text: 'Continuer le guide',
      icon: ArrowRight,
      action: 'scroll',
    },
  },
  'mid-guide': {
    title: 'Vous avez toutes les infos nécessaires',
    description: "Passez à l'action ou explorez les cas spécifiques",
    primary: {
      text: 'Générer ma mise en demeure',
      icon: FileText,
      href: '/eligibilite',
    },
    secondary: {
      text: 'Parler à un expert',
      icon: Phone,
      href: '/contact',
    },
  },
  'late-guide': {
    title: 'Prêt à défendre vos droits ?',
    description: 'Créez votre lettre professionnelle en 5 minutes',
    primary: {
      text: 'Créer ma lettre maintenant',
      icon: ArrowRight,
      href: '/eligibilite',
    },
    secondary: {
      text: 'Télécharger le guide',
      icon: Download,
      action: 'download',
    },
  },
};

// Fonction pour gérer les actions spéciales
function handleAction(action: string) {
  switch (action) {
    case 'scroll':
      // Scroll vers la prochaine section
      const nextSection = document.querySelector('section:not([data-visited])');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
        nextSection.setAttribute('data-visited', 'true');
      }
      break;
    case 'download':
      // Simulation de téléchargement du guide
      console.log('Téléchargement du guide PDF...');
      break;
    default:
      break;
  }
}

export default function ContextualCTA({ position, urgency }: ContextualCTAProps) {
  const config = CTA_CONFIGS[position];

  if (!config) return null;

  return (
    <div className="my-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
      <div className="text-center">
        <h3 className="text-lg font-bold text-blue-900 mb-2">{config.title}</h3>
        <p className="text-blue-700 mb-4">{config.description}</p>

        {/* Message d'urgence si applicable */}
        {urgency && (
          <div className="flex items-center justify-center gap-2 mb-4 text-sm text-orange-700 bg-orange-50 rounded-lg py-2 px-4 inline-flex">
            <AlertTriangle className="w-4 h-4" />
            {urgency}
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* CTA Principal */}
          {config.primary.href ? (
            <Button
              href={config.primary.href}
              className="sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              <config.primary.icon className="w-4 h-4 mr-2" />
              {config.primary.text}
            </Button>
          ) : (
            <Button
              onClick={() => config.primary.action && handleAction(config.primary.action)}
              className="sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              <config.primary.icon className="w-4 h-4 mr-2" />
              {config.primary.text}
            </Button>
          )}

          {/* CTA Secondaire */}
          {config.secondary.href ? (
            <Button variant="outline" href={config.secondary.href} className="sm:w-auto">
              <config.secondary.icon className="w-4 h-4 mr-2" />
              {config.secondary.text}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => config.secondary.action && handleAction(config.secondary.action)}
              className="sm:w-auto"
            >
              <config.secondary.icon className="w-4 h-4 mr-2" />
              {config.secondary.text}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
