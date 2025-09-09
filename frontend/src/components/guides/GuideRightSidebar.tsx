'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Clock,
  Users,
  CheckCircle,
  TrendingUp,
  MessageSquare,
  ExternalLink,
  Bookmark,
  Share2,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui';
import type { EnrichedGuide } from '@/types/guides';

interface GuideRightSidebarProps {
  guide: EnrichedGuide;
  className?: string;
}

export default function GuideRightSidebar({ guide, className = '' }: GuideRightSidebarProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Progress de lecture
  useEffect(() => {
    const updateProgress = () => {
      const articleElement = document.querySelector('article');
      if (!articleElement) return;

      const articleTop = articleElement.offsetTop;
      const articleHeight = articleElement.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollTop = window.scrollY;

      const progress = Math.max(
        0,
        Math.min(100, ((scrollTop - articleTop + windowHeight) / articleHeight) * 100),
      );

      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* === CTA PRINCIPAL STICKY === */}
      <div className="sticky top-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
        <div className="text-center">
          <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6" />
          </div>

          <h3 className="font-bold text-lg mb-2">Problème similaire ?</h3>

          <p className="text-blue-100 text-sm mb-4 leading-relaxed">
            Générez automatiquement votre lettre personnalisée en 2 minutes
          </p>

          <Button
            href="/eligibilite"
            className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-md hover:shadow-lg"
          >
            🚀 Créer ma lettre
          </Button>

          <div className="text-xs text-blue-200 mt-3 flex items-center justify-center gap-2">
            <CheckCircle className="w-3 h-3" />
            <span>Gratuit • Immédiat • Conforme</span>
          </div>
        </div>
      </div>

      {/* === PROGRESS DE LECTURE === */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Progression</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{Math.round(scrollProgress)}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div className="text-xs text-gray-500 mt-2 flex items-center justify-between">
          <span>⏱️ {guide.readingTime} min de lecture</span>
          <span>📊 {guide.difficulty}</span>
        </div>
      </div>

      {/* === STATISTIQUES ENGAGEMENT === */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-600" />
          Popularité
        </h4>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Lectures ce mois</span>
            <span className="font-medium text-gray-900">2,847</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Lettres générées</span>
            <span className="font-medium text-green-600">429</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Taux de succès</span>
            <span className="font-medium text-blue-600">94%</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-900">4.8/5</span>
            <span className="text-xs text-gray-500">(156 avis)</span>
          </div>
        </div>
      </div>

      {/* === ACTIONS RAPIDES === */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-3">Actions rapides</h4>

        <div className="space-y-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`w-full text-left p-3 rounded-lg border transition-colors flex items-center gap-3 ${
              isBookmarked
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'hover:bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">
              {isBookmarked ? 'Guide sauvegardé' : 'Sauvegarder ce guide'}
            </span>
          </button>

          <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors flex items-center gap-3">
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">Partager</span>
          </button>

          <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors flex items-center gap-3">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">Poser une question</span>
          </button>
        </div>
      </div>

      {/* === GUIDES LIÉS SIDEBAR === */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <h4 className="font-semibold text-gray-900 mb-3">Guides complémentaires</h4>

        <div className="space-y-3">
          {[
            {
              title: 'Garantie commerciale vs légale',
              href: '/guides/garantie-commerciale-vs-legale',
              readers: '1.2k',
            },
            {
              title: 'Remboursement et rétractation',
              href: '/guides/remboursement-retractation',
              readers: '890',
            },
            {
              title: 'Litige avec un professionnel',
              href: '/guides/litige-professionnel',
              readers: '654',
            },
          ].map(relatedGuide => (
            <a
              key={relatedGuide.href}
              href={relatedGuide.href}
              className="block p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors group"
            >
              <h5 className="text-sm font-medium text-gray-900 group-hover:text-blue-700 mb-1">
                {relatedGuide.title}
              </h5>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{relatedGuide.readers} lectures</span>
                <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-blue-600" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* === CONTACT SUPPORT === */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="text-center">
          <div className="bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-3">
            <Users className="w-5 h-5 text-amber-600" />
          </div>

          <h4 className="font-medium text-amber-900 mb-2">Besoin d'aide ?</h4>

          <p className="text-amber-700 text-sm mb-3">Notre équipe juridique peut vous conseiller</p>

          <Button
            href="/contact"
            variant="outline"
            size="sm"
            className="w-full border-amber-300 text-amber-700 hover:bg-amber-100"
          >
            Contacter un expert
          </Button>
        </div>
      </div>
    </div>
  );
}
