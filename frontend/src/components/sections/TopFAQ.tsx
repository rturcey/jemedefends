'use client';

import {ChevronDown, ChevronUp, FileQuestion} from 'lucide-react';
import React, {useState} from 'react';

import {Badge, Button, Reveal} from '@/components/ui';
import {useMobileOptimization} from '@/hooks/useMobileOptimization';
import {getContextualIcon} from '@/lib/icon-utils';

const FAQ_ITEMS = [
    {
        id: 'service-gratuit',
        question: 'Pourquoi ce service est-il gratuit ?',
        answer:
            'Nous proposons un outil gratuit, clair et juridiquement sourcé pour enclencher vos droits sans barrière financière. Les options payantes ajoutent du confort (PDF mis en forme, recommandé en ligne).',
        category: 'Service',
        iconType: 'gratuit',
    },
    {
        id: 'garantie-duree',
        question: 'Combien de temps dure la garantie légale ?',
        answer:
            "La garantie légale de conformité dure <strong>2 ans</strong> pour les biens neufs, <strong>1 an</strong> pour les biens d'occasion achetés auprès d'un professionnel.",
        category: 'Juridique',
        iconType: 'temps',
    },
    {
        id: 'donnees',
        question: 'Où sont mes données ?',
        answer:
            'Collecte minimale, hébergement en France (Scaleway), paiements Stancer, envoi Merci Facteur. Transparence totale, aucune revente.',
        category: 'Service',
        iconType: 'france',
    },
    {
        id: 'remboursement',
        question: "Puis-je d'abord demander un remboursement ?",
        answer:
            "La loi impose d'abord la <strong>mise en conformité</strong>. En cas d'échec dans un délai raisonnable : réduction du prix ou remboursement.",
        category: 'Juridique',
        iconType: 'remboursement',
    },
    {
        id: 'envoi-recommande',
        question: 'Pouvez-vous envoyer la lettre en recommandé ?',
        answer:
            "Oui, avec la formule Premium. La version gratuite et la version PDF ne comprennent pas l'envoi : vous récupérez le document et l'envoyez vous-même.",
        category: 'Service',
        iconType: 'courrier',
    },
    {
        id: 'occasion',
        question: "Les produits d'occasion sont-ils couverts ?",
        answer:
            "Oui, s'ils sont achetés auprès d'un professionnel : garantie légale au moins 1 an. Entre particuliers : pas de garantie légale, mais recours possible pour vices cachés (Code civil).",
        category: 'Juridique',
        iconType: 'occasion',
    },
    {
        id: 'disclaimer',
        question: 'Est-ce un conseil juridique personnalisé ?',
        answer:
            "Non. C'est un outil d'assistance et d'informations générales. Pour un avis personnalisé, il faut consulter un professionnel du droit.",
        category: 'Service',
        iconType: 'juridique',
    },
    {
        id: 'prix',
        question: 'Combien ça coûte ?',
        answer:
            'Version gratuite : 0€. PDF mis en forme : quelques euros. Premium (avec envoi recommandé) : prix modique pour le service complet.',
        category: 'Service',
        iconType: 'prix',
    },
];

export default function TopFAQ() {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const {isMobile} = useMobileOptimization();

    // ✅ Sur mobile, limiter à 4 questions - sur desktop, afficher les 6
    const displayedItems = isMobile ? FAQ_ITEMS.slice(0, 4) : FAQ_ITEMS;

    return (
        <div className="py-6 md:py-12 lg:py-16 border-t border-gray-100">
            <div className="max-w-6xl mx-auto px-4">
                <Reveal>
                    <div className="text-center mb-6 md:mb-8 lg:mb-10">
                        <div className="mb-8 md:mb-10 lg:mb-12">
                            <Badge variant="secondary">FAQ</Badge>
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                            Questions fréquentes
                        </h2>
                        <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center">
                            Les réponses claires aux questions que l'on nous pose le
                            plus
                        </p>
                    </div>
                </Reveal>

                {/* ✅ Grille adaptative : 1 col mobile, 2 cols à partir de sm */}
                <div
                    className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-1 sm:grid-cols-2 items-start">
                    {displayedItems.map((item, index) => (
                        <Reveal key={item.id} delay={index * 0.05}>
                            <div
                                className="rounded-xl border border-gray-200 p-2 sm:p-3 md:p-4 hover:border-blue-300 hover:shadow-sm transition-all">
                                <button
                                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                    className="w-full text-left"
                                    aria-expanded={expandedId === item.id}
                                >
                                    <div
                                        className="flex items-start justify-between gap-2">
                                        <div
                                            className="flex items-start gap-2 flex-1 min-w-0">
                                            {/* ✅ Icône uniformisée au format ProblemsSection */}
                                            <div
                                                className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                                                {React.cloneElement(getContextualIcon(item.iconType, 'default'), {
                                                    className: 'w-4 h-4 sm:w-5 sm:h-5',
                                                    strokeWidth: 1.5,
                                                })}
                                            </div>
                                            <span
                                                className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 leading-snug">
                        {item.question}
                      </span>
                                        </div>
                                        <div className="flex-shrink-0 mt-1">
                                            {expandedId === item.id ? (
                                                <ChevronUp
                                                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"/>
                                            ) : (
                                                <ChevronDown
                                                    className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400"/>
                                            )}
                                        </div>
                                    </div>
                                </button>
                                {expandedId === item.id && (
                                    <div
                                        className="mt-2 text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed pl-12"
                                        dangerouslySetInnerHTML={{__html: item.answer}}
                                    />
                                )}
                            </div>
                        </Reveal>
                    ))}
                </div>

                {/* Lien vers la page FAQ complète - DESKTOP UNIQUEMENT */}
                <Reveal delay={0.4}>
                    <div className="hidden md:flex justify-center mt-8">
                        <Button
                            href="/faq"
                            variant="outline"
                            icon={<FileQuestion/>}
                        >
                            Voir toutes les questions
                        </Button>
                    </div>
                </Reveal>
            </div>
        </div>
    );
}