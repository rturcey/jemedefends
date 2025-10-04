'use client';

import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Badge, Reveal, Button } from '@/components/ui';
import { getContextualIcon } from '@/lib/icon-utils';

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

  return (
    <div className="py-8 md:py-12 lg:py-20 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <Reveal>
          <div className="text-center mb-6 md:mb-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Badge variant="secondary">FAQ</Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Questions fréquentes
            </h2>
            <p className="text-sm md:text-base text-gray-600 text-center">
              Les réponses claires aux questions que l'on nous pose le plus
            </p>
          </div>
        </Reveal>

        <div className="grid gap-3 md:gap-4 sm:grid-cols-2 items-start">
          {FAQ_ITEMS.map(item => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-200 p-3 md:p-4 hover:border-blue-300 transition"
            >
              <button
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className="flex items-center justify-between w-full text-left gap-2"
              >
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                  <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 flex-shrink-0">
                    {getContextualIcon(item.iconType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm md:text-base text-gray-900 leading-tight">
                      {item.question}
                    </h3>
                    <span className="text-[10px] md:text-xs text-gray-500">{item.category}</span>
                  </div>
                </div>
                {expandedId === item.id ? (
                  <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {expandedId === item.id && (
                <div
                  className="mt-2 md:mt-3 text-xs md:text-sm text-gray-600 leading-relaxed border-t pt-2 md:pt-3"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              )}
            </div>
          ))}
        </div>

        <Reveal delay={0.4}>
          <div className="text-center mt-6 md:mt-8">
            <Button
              href="/faq"
              variant="outline"
              size="lg"
              icon={<HelpCircle className="w-4 h-4" />}
            >
              Voir toutes les questions
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
