// src/components/guides/GuideSection.tsx
// Section avec gestion automatique références légales et types de contenu

'use client';

import {
  BookOpen,
  Clock,
  Shield,
  FileText,
  AlertTriangle,
  Phone,
  Settings,
  Scale,
  BarChart3,
  MessageSquare,
  Home,
  Car,
  Smartphone,
} from 'lucide-react';
import React from 'react';

import TextWithLegalRefs from '@/components/ui/TextWithLegalRefs';
import LegalNote from '@/components/ui/LegalNote';
import TimelineProcess from '@/components/ui/TimelineProcess';
import FAQ from '@/components/ui/FAQ';
import DefaultGrid from '@/components/ui/DefaultGrid';
import DefaultAlternatives from '@/components/ui/DefaultAlternatives';
import DefaultContacts from '@/components/ui/DefaultContacts';
import TableComparison from '@/components/guides/TableComparison';
import type { GuideSection } from '@/types/guides';

interface GuideSectionProps {
  section: GuideSection;
  guideSlug?: string;
}

// ✅ Nouveau composant ProcedureSteps intégré
interface ProcedureStep {
  number: number;
  title: string;
  description: string;
  duration?: string;
}

function ProcedureSteps({ steps }: { steps: ProcedureStep[] }) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-200 transition-colors"
        >
          {/* Badge numéro élégant avec couleurs du site */}
          <div className="flex-shrink-0">
            <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-sm">
              {step.number}
            </div>
          </div>

          {/* Contenu step */}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 text-sm mb-1">{step.title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>

            {/* Duration badge si présent */}
            {step.duration && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                  <Clock className="w-3 h-3" />
                  {step.duration}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Détection automatique du type de section
function detectSectionType(section: GuideSection): string {
  if (section.type) return section.type;
  if (section.steps?.length) return 'timeline';
  if (section.tableData?.length) return 'table';
  if (section.faqItems?.length) return 'faq';
  if (section.items?.length) return 'grid';
  if (section.id.includes('alternative')) return 'alternatives';
  if (section.id.includes('contact')) return 'contacts';
  if (section.id.includes('procedure') || section.id.includes('demarche')) return 'procedure';
  return 'content';
}

// Obtenir l'icône appropriée pour la section
function getSectionIcon(sectionId: string, sectionType: string, guideSlug?: string) {
  // Icônes spécifiques par ID de section
  const iconMap: Record<string, any> = {
    essentiel: Shield,
    droits: Shield,
    procedure: FileText,
    demarche: FileText,
    timeline: Clock,
    table: BarChart3,
    faq: MessageSquare,
    alternatives: AlertTriangle,
    contacts: Phone,
    'cas-specifiques': Settings,
    defauts: AlertTriangle,
    garantie: Shield,
    vendeur: Scale,
  };

  // Icônes par type de guide
  if (guideSlug) {
    if (guideSlug.includes('smartphone') || guideSlug.includes('ordinateur')) {
      if (sectionId.includes('defaut') || sectionId.includes('panne')) return Smartphone;
    }
    if (guideSlug.includes('electromenager') || guideSlug.includes('maison')) {
      if (sectionId.includes('defaut') || sectionId.includes('panne')) return Home;
    }
    if (guideSlug.includes('voiture') || guideSlug.includes('auto')) {
      if (sectionId.includes('defaut') || sectionId.includes('panne')) return Car;
    }
  }

  // Fallback par type de section
  const typeIconMap: Record<string, any> = {
    timeline: Clock,
    procedure: FileText,
    table: BarChart3,
    faq: MessageSquare,
    alternatives: AlertTriangle,
    contacts: Phone,
    grid: Settings,
  };

  const IconComponent = iconMap[sectionId] || typeIconMap[sectionType] || BookOpen;
  return <IconComponent className="w-6 h-6 text-blue-600 flex-shrink-0" />;
}

// Obtenir l'icône pour une étape de timeline
function getStepIcon(stepTitle: string) {
  const title = stepTitle.toLowerCase();

  if (title.includes('constat') || title.includes('document')) return FileText;
  if (title.includes('contact') || title.includes('appel')) return Phone;
  if (title.includes('délai') || title.includes('attendre')) return Clock;
  if (title.includes('mise en demeure') || title.includes('lrar')) return AlertTriangle;
  if (title.includes('tribunal') || title.includes('recours')) return Scale;

  return FileText; // Icône par défaut
}

export default function GuideSection({ section, guideSlug }: GuideSectionProps) {
  const sectionType = detectSectionType(section);
  const sectionIcon = getSectionIcon(section.id, sectionType, guideSlug);

  // ✅ Données par défaut pour la procédure de garantie légale
  const defaultProcedureSteps: ProcedureStep[] = [
    {
      number: 1,
      title: 'Constater et documenter',
      description: 'Photos, vidéos, examens de défaut. Gardez votre facture.',
      duration: 'Immédiat',
    },
    {
      number: 2,
      title: 'Contacter le vendeur',
      description: 'Mise en demeure par écrit avec délai précis.',
      duration: 'Sous 30 jours',
    },
    {
      number: 3,
      title: 'Délai vendeur',
      description: 'Le vendeur a 30 jours pour réparer, échanger ou rembourser.',
      duration: '30 jours max',
    },
    {
      number: 4,
      title: 'Escalade si nécessaire',
      description: 'Médiateur, associations, tribunal en cas de refus.',
      duration: 'Variable',
    },
  ];

  return (
    <section id={section.id} className="scroll-mt-24 mb-8">
      {' '}
      {/* ✅ Réduit mb-12 à mb-8 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        {/* Header avec icône */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          {sectionIcon}
          {section.title}
        </h2>

        {/* ✅ CORRECTION : Rendu conditionnel fixé avec syntaxe correcte */}
        {sectionType === 'timeline' && section.steps ? (
          <ProcedureSteps
            steps={section.steps.map((step, index) => ({
              number: index + 1,
              title: step.title,
              description: step.description || step.content || '',
              duration: step.duration,
            }))}
          />
        ) : sectionType === 'procedure' ? (
          // ✅ Procédure par défaut pour garantie légale
          <ProcedureSteps steps={defaultProcedureSteps} />
        ) : sectionType === 'table' && section.tableData ? (
          <TableComparison
            data={section.tableData}
            title={section.title}
            highlightColumn="garantie-legale" // Colonne à mettre en évidence
          />
        ) : sectionType === 'faq' && section.faqItems ? (
          <FAQ items={section.faqItems} className="space-y-4" />
        ) : sectionType === 'grid' && section.items ? (
          <DefaultGrid items={section.items} columns={3} />
        ) : sectionType === 'alternatives' ? (
          <DefaultAlternatives />
        ) : sectionType === 'contacts' ? (
          <DefaultContacts />
        ) : (
          // ✅ Contenu texte avec références légales automatiques FORCÉES en interactif
          <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 prose-lg">
            {typeof section.content === 'string' ? (
              <TextWithLegalRefs
                text={section.content}
                variant="tooltip" // ✅ Forcé en tooltip
                showStatus={true} // ✅ Forcé
                showExternalLink={true} // ✅ Forcé
                preloadArticles={true} // ✅ Forcé
              />
            ) : (
              section.content
            )}
          </div>
        )}

        {/* Références légales spécifiques à la section */}
        {section.legalReferences?.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <LegalNote
              articles={section.legalReferences.map(ref => ({ id: ref }))}
              title={`Références légales - ${section.title}`}
              variant="compact"
              defaultOpen={false}
            />
          </div>
        )}
      </div>
    </section>
  );
}
