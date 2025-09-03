'use client';
import * as React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ArrowRight, ChevronDown, ChevronUp, Star, Shield } from 'lucide-react';
import { Badge, Reveal } from '@/components/ui';
import Skeleton from '@/components/ui/Skeleton';
import MobileFAQItem from '@/components/marketing/MobileFAQItem';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

const FAQ_ITEMS = [
  {
    id: 'service-gratuit',
    question: 'Pourquoi ce service est-il gratuit ?',
    answer:
      'Nous proposons un outil gratuit, clair et juridiquement exact pour enclencher vos droits sans barrière financière. Les options payantes ajoutent du confort (PDF mis en forme, signature, recommandé en ligne).',
    category: 'site',
    icon: '💸',
  },
  {
    id: 'garantie-duree',
    question: 'Combien de temps dure la garantie légale ?',
    answer:
      "La garantie légale de conformité dure <strong>2 ans</strong> pour les biens neufs, <strong>1 an</strong> pour l'occasion (chez un professionnel).",
    category: 'legal',
    icon: '⏱️',
  },
  {
    id: 'donnees',
    question: 'Où sont mes données ?',
    answer:
      'Collecte minimale, <strong>hébergement français (Scaleway)</strong>, paiements <strong>Stancer</strong>, envoi via <strong>Merci Facteur</strong>. Transparence totale, pas de revente de données.',
    category: 'site',
    icon: '🇫🇷',
  },
  {
    id: 'remboursement',
    question: 'Puis-je demander un remboursement dès le départ ?',
    answer:
      "La loi impose d'abord la <strong>mise en conformité</strong>. À défaut dans un délai raisonnable : réduction du prix ou résolution (remboursement).",
    category: 'legal',
    icon: '💰',
  },
  {
    id: 'envoi-recommande',
    question: 'Pouvez-vous envoyer la lettre en recommandé ?',
    answer:
      "Oui, avec la formule <strong>Premium</strong>. La version gratuite et la version payante (PDF) ne comprennent pas l'envoi : tu récupères le document pour envoi par tes soins.",
    category: 'site',
    icon: '📮',
  },
  {
    id: 'occasion',
    question: "Les produits d'occasion sont-ils couverts ?",
    answer:
      "Oui s'ils sont achetés à un <strong>professionnel</strong> (GLC au moins 1 an). Entre particuliers : pas de GLC, voie des vices cachés (Code civil).",
    category: 'legal',
    icon: '♻️',
  },
  {
    id: 'disclaimer',
    question: 'Est-ce un conseil juridique personnalisé ?',
    answer:
      "Non. Il s'agit d'un <strong>outil d'assistance</strong> et d'informations générales. Pour un avis personnalisé, rapproche-toi d'un professionnel du droit.",
    category: 'site',
    icon: '📜',
  },
  {
    id: 'prix',
    question: 'Combien ça coûte ?',
    answer:
      '<ul><li><strong>Lettre gratuite</strong> : 0 €</li><li><strong>PDF signé</strong> : petit tarif (voir paiement)</li><li><strong>Premium recommandé</strong> : tarif incluant affranchissement & suivi</li></ul>',
    category: 'site',
    icon: '💶',
  },
];

type TopFAQProps = {
  className?: string;
  showHeader?: boolean;
};

export function TopFAQ({ className = '', showHeader = true }: TopFAQProps) {
  const { isMobile } = useMobileOptimization();
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Colonnes strictement équilibrées en gardant l'ordre d'origine
  const popularItems = FAQ_ITEMS.filter((_, idx) => idx % 2 === 0);
  const otherItems = FAQ_ITEMS.filter((_, idx) => idx % 2 === 1);

  // CORRECTION : Ouverture exclusive - ferme les autres items
  const toggle = (id: string) => {
    setOpenItems(
      prev =>
        prev.includes(id)
          ? prev.filter(x => x !== id) // Ferme l'item si déjà ouvert
          : [id] // Ouvre seulement cet item (ferme tous les autres)
    );
  };

  return (
    <Reveal>
      <div className={`px-2 sm:px-4 lg:px-0 overflow-x-hidden ${className}`}>
        {/* Header conditionnel avec skeleton */}
        {showHeader && (
          <Skeleton loading={!isLoaded} className="h-32 w-full mx-auto mb-12 sm:mb-16">
            <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
              <Badge tone="red" className="mb-8 sm:mb-10">
                Problèmes courants
              </Badge>
              <div className="h-3"></div>

              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                Questions fréquentes
              </h2>
              <p className="text-lg text-slate-600">
                Découvrez les situations où vous pouvez <strong>légalement</strong> exiger
                réparation, remplacement ou remboursement.
              </p>
            </div>
          </Skeleton>
        )}

        {/* Adaptation mobile/desktop */}
        {isMobile ? (
          // VERSION MOBILE avec MobileFAQItem optimisé
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, itemIndex) => (
              <Skeleton key={item.id} loading={!isLoaded} className="h-16 rounded-xl">
                <MobileFAQItem
                  question={item.question}
                  answer={<div dangerouslySetInnerHTML={{ __html: item.answer }} />}
                  isOpen={openItems.includes(item.id)}
                  onToggle={() => toggle(item.id)}
                />
              </Skeleton>
            ))}
          </div>
        ) : (
          // VERSION DESKTOP - VOTRE DESIGN ORIGINAL
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Colonne 1 : Questions essentielles */}
            <div className="space-y-4 min-w-0">
              <Skeleton loading={!isLoaded} className="h-8 w-48 mb-6">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <h3 className="font-bold text-gray-900">Questions essentielles</h3>
                </div>
              </Skeleton>

              {popularItems.map((item, index) => (
                <Skeleton key={item.id} loading={!isLoaded} className="h-20 rounded-xl">
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow w-full">
                    <button
                      type="button"
                      aria-expanded={openItems.includes(item.id)}
                      onClick={() => toggle(item.id)}
                      className="w-full flex items-start gap-2 sm:gap-3 p-3 sm:p-4 lg:p-5 text-left hover:bg-gray-50 transition-colors min-h-[44px] touch-manipulation"
                    >
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-50 rounded-lg flex items-center justify-center text-sm sm:text-base">
                        {item.icon ?? '❓'}
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* CORRECTION : Hauteur fixe pour le titre pour éviter les changements de layout */}
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug mb-1 min-h-[1.25rem]">
                          {item.question}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-gray-500">
                            <Shield className="w-3 h-3" />
                            {item.category === 'legal'
                              ? 'Garantie légale'
                              : 'Fonctionnement du site'}
                          </span>
                          {openItems.includes(item.id) ? (
                            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* CORRECTION : Animation fluide pour le contenu sans affecter la largeur */}
                    {openItems.includes(item.id) && (
                      <div className="px-3 sm:px-4 lg:px-5 pb-3 sm:pb-4 lg:pb-5 pl-8 sm:pl-12 lg:pl-16">
                        <div
                          className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words"
                          dangerouslySetInnerHTML={{ __html: item.answer }}
                        />
                      </div>
                    )}
                  </div>
                </Skeleton>
              ))}
            </div>

            {/* Colonne 2 : À connaître aussi */}
            <div className="space-y-4 min-w-0">
              <Skeleton loading={!isLoaded} className="h-8 w-48 mb-6">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-gray-900">À connaître aussi</h3>
                </div>
              </Skeleton>

              {otherItems.map((item, index) => (
                <Skeleton key={item.id} loading={!isLoaded} className="h-20 rounded-xl">
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow w-full">
                    <button
                      type="button"
                      aria-expanded={openItems.includes(item.id)}
                      onClick={() => toggle(item.id)}
                      className="w-full flex items-start gap-2 sm:gap-3 p-3 sm:p-4 lg:p-5 text-left hover:bg-gray-50 transition-colors min-h-[44px] touch-manipulation"
                    >
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-purple-50 rounded-lg flex items-center justify-center text-sm sm:text-base">
                        {item.icon ?? '❓'}
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* CORRECTION : Hauteur fixe pour le titre pour éviter les changements de layout */}
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug mb-1 min-h-[1.25rem]">
                          {item.question}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-gray-500">
                            <Shield className="w-3 h-3" />
                            {item.category === 'legal'
                              ? 'Garantie légale'
                              : 'Fonctionnement du site'}
                          </span>
                          {openItems.includes(item.id) ? (
                            <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* CORRECTION : Animation fluide pour le contenu sans affecter la largeur */}
                    {openItems.includes(item.id) && (
                      <div className="px-3 sm:px-4 lg:px-5 pb-3 sm:pb-4 lg:pb-5 pl-8 sm:pl-12 lg:pl-16">
                        <div
                          className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words"
                          dangerouslySetInnerHTML={{ __html: item.answer }}
                        />
                      </div>
                    )}
                  </div>
                </Skeleton>
              ))}
            </div>
          </div>
        )}

        {/* CTA bas avec skeleton */}
        <Skeleton loading={!isLoaded} className="h-12 w-64 mx-auto mt-10 sm:mt-12">
          <div className="mt-10 sm:mt-12 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors min-h-[44px] touch-manipulation"
            >
              <HelpCircle className="w-5 h-5" />
              Voir toute la FAQ
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Skeleton>
      </div>
    </Reveal>
  );
}

export default TopFAQ;
