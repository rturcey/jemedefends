// src/components/guides/GuideEssentials.tsx
// Section "L'essentiel" critique renforcée pour guides complexes

'use client';

import { Zap, CheckCircle, AlertTriangle, ArrowRight, MessageSquare, Scale } from 'lucide-react';
import React from 'react';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import LegalReference from '@/components/ui/LegalReference';
import type { LegalArticleId } from '@/legal/registry';
import type { GuidePage } from '@/types/guides';

interface GuideEssentialsProps {
  guide: GuidePage & { slug: string };
}

// Extraction des points clés selon le contenu
function extractKeyPoints(guide: GuidePage): Array<{
  title: string;
  description: string;
}> {
  const slug = (guide as any).slug || '';

  // Points spécifiques selon le type de guide
  if (slug.includes('garantie') || slug.includes('conformite')) {
    return [
      { title: '2 ans de garantie', description: 'automatique sur tous vos achats' },
      {
        title: 'Réparation gratuite',
        description: 'le vendeur doit prendre en charge',
      },
      { title: 'Frais vendeur', description: "transport, main d'œuvre inclus" },
      { title: 'Remplacement', description: 'si réparation impossible' },
    ];
  }

  if (slug.includes('smartphone') || slug.includes('ordinateur')) {
    return [
      { title: 'Défauts matériels', description: 'écran, clavier, ports couverts' },
      { title: 'Performances', description: 'lenteurs anormales = défaut' },
      { title: 'Logiciels', description: 'programmes préinstallés inclus' },
      { title: 'Autonomie', description: 'batterie selon specs annoncées' },
    ];
  }

  if (slug.includes('electromenager') || slug.includes('maison')) {
    return [
      { title: 'Fonctionnement', description: "conforme à l'usage normal" },
      { title: 'Durabilité', description: 'résistance attendue du produit' },
      { title: 'Sécurité', description: 'normes et certifications' },
      { title: 'Consommation', description: 'énergétique selon étiquette' },
    ];
  }

  // Points génériques
  return [
    { title: 'Garantie légale', description: '2 ans automatique' },
    { title: 'Gratuité totale', description: 'vendeur prend en charge' },
    { title: 'Réparation priorité', description: 'puis remplacement' },
    { title: 'Remboursement', description: 'si échec des autres solutions' },
  ];
}

// Extraction des articles principaux
function extractMainLegalReferences(guide: GuidePage): LegalArticleId[] {
  const allContent = guide.sections
    .map(s => (typeof s.content === 'string' ? s.content : ''))
    .join(' ');

  const allRefs = allContent.match(/L\.\d{3}-\d+/gi) || [];

  // Prioriser les articles les plus importants de la garantie légale
  const priorityRefs = ['L.217-3', 'L.217-5', 'L.217-7', 'L.217-9', 'L.217-11', 'L.217-13'];

  return priorityRefs.filter(ref =>
    allRefs.some(foundRef => foundRef.toLowerCase() === ref.toLowerCase()),
  ) as LegalArticleId[];
}

// Vérifier si le guide a des délais critiques
function hasTimeLimit(guide: GuidePage): boolean {
  const content = guide.sections
    .map(s => (typeof s.content === 'string' ? s.content : ''))
    .join(' ')
    .toLowerCase();

  return content.includes('délai') || content.includes('2 ans') || content.includes('prescription');
}

export default function GuideEssentials({ guide }: GuideEssentialsProps) {
  const mainArticles = extractMainLegalReferences(guide);
  const keyPoints = extractKeyPoints(guide);
  const hasUrgency = hasTimeLimit(guide);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-blue-500 rounded-xl p-6 mb-8">
      <div className="flex items-start gap-4">
        <Zap className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">⚡ L'essentiel en 30 secondes</h2>

          {/* Points clés visuels */}
          <div className="grid sm:grid-cols-2 gap-3 mb-6">
            {keyPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm sm:text-base">
                  <strong>{point.title}</strong> {point.description}
                </span>
              </div>
            ))}

            {/* Point d'urgence si applicable */}
            {hasUrgency && (
              <div className="flex items-center gap-3 sm:col-span-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium text-orange-800">
                  <strong>Attention :</strong> Délai légal de 2 ans à respecter
                </span>
              </div>
            )}
          </div>

          {/* Articles principaux visibles */}
          {mainArticles.length > 0 && (
            <div className="bg-white rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Scale className="w-4 h-4 text-purple-600" />
                Articles de loi principaux
              </h3>
              <div className="flex flex-wrap gap-2">
                {mainArticles.slice(0, 6).map(ref => (
                  <LegalReference key={ref} code={ref} variant="badge" showStatus={true} />
                ))}
                {mainArticles.length > 6 && (
                  <Badge variant="outline">+{mainArticles.length - 6} autres articles</Badge>
                )}
              </div>
            </div>
          )}

          {/* CTA immédiat */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button href="/eligibilite" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              <ArrowRight className="w-4 h-4 mr-2" />
              Créer ma lettre maintenant
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-auto">
              <MessageSquare className="w-4 h-4 mr-2" />
              Parler à un expert
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
