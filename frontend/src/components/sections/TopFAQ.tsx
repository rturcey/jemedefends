// src/components/sections/TopFAQ.tsx
// MODIFIÉ - Utilise des icônes contextuelles au lieu des emojis

'use client';
import { HelpCircle, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';
import { useState } from 'react';

import MobileFAQItem from '@/components/marketing/MobileFAQItem';
import { Badge, Reveal } from '@/components/ui';
import Skeleton from '@/components/ui/Skeleton';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { getContextualIcon } from '@/lib/icon-utils';

const FAQ_ITEMS = [
  {
    id: 'service-gratuit',
    question: 'Pourquoi ce service est-il gratuit ?',
    answer:
      'Nous proposons un outil gratuit, clair et juridiquement exact pour enclencher vos droits sans barrière financière. Les options payantes ajoutent du confort (PDF mis en forme, signature, recommandé en ligne).',
    category: 'site',
    iconType: 'gratuit', // ✅ MODIFIÉ : Plus d'emoji, type contextuel
  },
  {
    id: 'garantie-duree',
    question: 'Combien de temps dure la garantie légale ?',
    answer:
      "La garantie légale de conformité dure <strong>2 ans</strong> pour les biens neufs, <strong>1 an</strong> pour l'occasion (chez un professionnel).",
    category: 'legal',
    iconType: 'temps',
  },
  {
    id: 'donnees',
    question: 'Où sont mes données ?',
    answer:
      'Collecte minimale, <strong>hébergement français (Scaleway)</strong>, paiements <strong>Stancer</strong>, envoi via <strong>Merci Facteur</strong>. Transparence totale, pas de revente de données.',
    category: 'site',
    iconType: 'france',
  },
  {
    id: 'remboursement',
    question: 'Puis-je demander un remboursement dès le départ ?',
    answer:
      "La loi impose d'abord la <strong>mise en conformité</strong>. À défaut dans un délai raisonnable : réduction du prix ou résolution (remboursement).",
    category: 'legal',
    iconType: 'remboursement',
  },
  {
    id: 'envoi-recommande',
    question: 'Pouvez-vous envoyer la lettre en recommandé ?',
    answer:
      "Oui, avec la formule <strong>Premium</strong>. La version gratuite et la version payante (PDF) ne comprennent pas l'envoi : tu récupères le document pour envoi par tes soins.",
    category: 'site',
    iconType: 'courrier',
  },
  {
    id: 'occasion',
    question: "Les produits d'occasion sont-ils couverts ?",
    answer:
      "Oui s'ils sont achetés à un <strong>professionnel</strong> (GLC au moins 1 an). Entre particuliers : pas de GLC, voie des vices cachés (Code civil).",
    category: 'legal',
    iconType: 'occasion',
  },
  {
    id: 'disclaimer',
    question: 'Est-ce un conseil juridique personnalisé ?',
    answer:
      "Non. Il s'agit d'un <strong>outil d'assistance</strong> et d'informations générales. Pour un avis personnalisé, rapproche-toi d'un professionnel du droit.",
    category: 'site',
    iconType: 'juridique',
  },
  {
    id: 'prix',
    question: 'Combien ça coûte ?',
    answer:
      'Version <strong>gratuite</strong> : 0€. PDF propre : quelques euros. Premium (avec envoi) : prix modique pour le service complet.',
    category: 'site',
    iconType: 'prix',
  },
];

export default function TopFAQ() {
  const { isMobile, shouldUseSimpleAnimations } = useMobileOptimization();
  const [isLoaded, setIsLoaded] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  React.useEffect(() => {
    const loadTimer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(loadTimer);
  }, []);

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getCategoryColor = (category: string) => {
    return category === 'legal'
      ? 'bg-blue-100 text-blue-700 border-blue-200'
      : 'bg-purple-100 text-purple-700 border-purple-200';
  };

  const getCategoryLabel = (category: string) => {
    return category === 'legal' ? 'Juridique' : 'Service';
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <Reveal>
          <div className="text-center mb-8 lg:mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <Badge variant="secondary">FAQ</Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              Tout ce que vous devez savoir sur Je me défends
            </p>
          </div>
        </Reveal>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.1}>
              <Skeleton loading={!isLoaded} className="h-16 rounded-lg">
                {isMobile ? (
                  <MobileFAQItem
                    question={item.question}
                    answer={item.answer}
                    category={item.category}
                    icon={getContextualIcon(item.iconType)}
                    isExpanded={expandedId === item.id}
                    onToggle={() => toggleExpanded(item.id)}
                  />
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="w-full p-6 text-left flex items-center justify-between min-h-[44px] touch-manipulation"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg">
                            {/* ✅ UTILISE LA CONVERSION CONTEXTUELLE */}
                            {getContextualIcon(item.iconType)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg mb-1">
                              {item.question}
                            </h3>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${getCategoryColor(item.category)}`}
                            >
                              {getCategoryLabel(item.category)}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0 ml-4">
                        {expandedId === item.id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {expandedId === item.id && (
                      <div className="px-6 pb-6">
                        <div className="ml-14 text-gray-600 leading-relaxed">
                          <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Skeleton>
            </Reveal>
          ))}
        </div>

        {/* CTA vers page FAQ complète */}
        <Reveal delay={0.8}>
          <div className="text-center mt-8 lg:mt-12">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors min-h-[44px] touch-manipulation px-4 py-2"
            >
              <span>Voir toutes les questions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
