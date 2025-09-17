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

import ProcedureSteps from '@/components/guides/ProcedureSteps'; // ✅ Import du vrai composant
import type { ProcedureStep } from '@/components/guides/ProcedureSteps'; // ✅ Import du vrai type
import TableComparison from '@/components/guides/TableComparison';
import DefaultAlternatives from '@/components/ui/DefaultAlternatives';
import DefaultContacts from '@/components/ui/DefaultContacts';
import DefaultGrid from '@/components/ui/DefaultGrid';
import FAQ from '@/components/ui/FAQ';
import LegalNote from '@/components/ui/LegalNote';
import TextWithLegalRefs from '@/components/ui/TextWithLegalRefs';
import type { GuideSection } from '@/types/guides'; // ✅ Vrais types

interface GuideSectionProps {
  section: GuideSection;
  guideSlug?: string;
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

export default function GuideSection({ section, guideSlug }: GuideSectionProps) {
  const sectionType = detectSectionType(section);
  const sectionIcon = getSectionIcon(section.id, sectionType, guideSlug);

  // ✅ Conversion des steps du type officiel vers le composant ProcedureSteps
  const convertStepsToProcedureSteps = (steps: GuideSection['steps']): ProcedureStep[] => {
    if (!steps) return [];

    return steps.map((step, index) => ({
      number: index + 1,
      title: step.title,
      descriptionNode: (
        <TextWithLegalRefs
          text={step.description}
          variant="tooltip"
          showStatus={true}
          showExternalLink={true}
        />
      ),
      duration: step.duration,
      id: step.id,
    }));
  };

  // ✅ Données par défaut pour la procédure de garantie légale
  const defaultProcedureSteps: ProcedureStep[] = [
    {
      number: 1,
      title: 'Constater et documenter',
      descriptionNode: (
        <TextWithLegalRefs
          text="Photos, vidéos, examens de défaut. Gardez votre facture sauvegardée art. L.217-5."
          variant="tooltip"
          showStatus={true}
          showExternalLink={true}
        />
      ),
      duration: 'Immédiat',
    },
    {
      number: 2,
      title: 'Demande amiable écrite',
      descriptionNode: (
        <TextWithLegalRefs
          text="Rappelez vos droits (**réparation ou remplacement**) art. L.217-9, exigez un **délai ≤ 30 jours** art. L.217-10 et **zéro frais** art. L.217-11. Laissez **15 jours ouvrés** pour la réponse."
          variant="tooltip"
          showStatus={true}
          showExternalLink={true}
        />
      ),
      duration: 'Sous 30 jours',
    },
    {
      number: 3,
      title: 'Mise en demeure (LRAR)',
      descriptionNode: (
        <TextWithLegalRefs
          text="Citez **art. L.217-9**, **art. L.217-10**, **art. L.217-11**. Exigez mise en conformité sous **30 jours**, à défaut **réduction**/**résolution** art. L.217-14. Envoyez en **LRAR**."
          variant="tooltip"
          showStatus={true}
          showExternalLink={true}
        />
      ),
      duration: '30 jours max',
    },
    {
      number: 4,
      title: 'Recours',
      descriptionNode: (
        <TextWithLegalRefs
          text="**Médiation de la consommation** (gratuite), puis **tribunal** (proximité/judiciaire) avec l'ensemble des pièces."
          variant="tooltip"
          showStatus={true}
          showExternalLink={true}
        />
      ),
      duration: 'Variable',
    },
  ];

  return (
    <section id={section.id} className="scroll-mt-24 mb-8">
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-sm">
        {/* Header avec icône */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          {sectionIcon}
          {section.title}
        </h2>

        {/* ✅ Contenu principal selon le type - Respecte les vrais types */}
        {sectionType === 'timeline' && section.steps ? (
          <ProcedureSteps steps={convertStepsToProcedureSteps(section.steps)} accent="blue" />
        ) : sectionType === 'procedure' ? (
          // ✅ Procédure par défaut pour garantie légale
          <ProcedureSteps steps={defaultProcedureSteps} accent="blue" />
        ) : sectionType === 'table' && section.tableData ? (
          <TableComparison
            data={section.tableData}
            title={section.title}
            highlightColumn="garantie-legale"
          />
        ) : sectionType === 'faq' && section.faqItems ? (
          <FAQ
            items={section.faqItems.map(item => ({
              question: item.q,
              answer: item.a,
            }))}
            className="space-y-4"
          />
        ) : sectionType === 'grid' && section.items ? (
          <DefaultGrid items={section.items} columns={3} />
        ) : sectionType === 'alternatives' ? (
          <DefaultAlternatives />
        ) : sectionType === 'contacts' ? (
          <DefaultContacts />
        ) : (
          // ✅ Contenu texte avec prose styling correct et références légales
          <div className="prose prose-gray prose-lg max-w-none prose-headings:text-gray-900 prose-a:text-blue-600 prose-strong:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed">
            {typeof section.content === 'string' ? (
              <TextWithLegalRefs
                text={section.content}
                variant="tooltip"
                showStatus={true}
                showExternalLink={true}
                preloadArticles={true}
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
