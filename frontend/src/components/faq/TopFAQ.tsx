// src/components/faq/TopFAQ.tsx - Refonte complète avec 2 colonnes
'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight, Star, HelpCircle, Shield } from 'lucide-react';
import { Reveal } from '@/components/ui';

// Questions mélangées : garantie légale + fonctionnement du site
const FAQ_ITEMS = [
  // GARANTIE LÉGALE - Les essentielles
  {
    id: 'garantie-duree',
    question: 'Combien de temps dure la garantie légale ?',
    answer: 'La garantie légale de conformité dure <strong>2 ans</strong> pour un produit neuf et <strong>1 an minimum</strong> pour un produit d’occasion, à partir de la réception du produit (article L.217-7).',
    category: 'legal',
    icon: '⏰',
    popular: true,
  },
  {
    id: 'service-gratuit',
    question: 'Pourquoi ce service est-il gratuit ?',
    answer: 'Nous croyons que <strong>défendre ses droits ne doit pas être un luxe</strong>. Les options payantes ajoutent du confort (PDF professionnel, signature, envoi) pour ceux qui le souhaitent.',
    category: 'site',
    icon: '🆓',
    popular: true,
  },
  {
    id: 'recours-possible',
    question: 'Quels recours concrets puis-je demander ?',
    answer: 'D’abord la <strong>mise en conformité</strong> (réparation/remplacement). À défaut dans un délai raisonnable : <strong>réduction du prix</strong> ou <strong>résolution</strong> (remboursement).',
    category: 'legal',
    icon: '🔁',
    popular: true,
  },
  {
    id: 'pieces-constructeur',
    question: 'Doit-on utiliser des pièces d’origine constructeur ?',
    answer: 'La réparation doit rendre le bien conforme sans frais pour le consommateur. Les pièces doivent être <strong>adaptées et conformes</strong> au résultat attendu (les conditions varient selon les cas).',
    category: 'legal',
    icon: '🧩',
    popular: true,
  },
  // FONCTIONNEMENT DU SITE
  {
    id: 'formules',
    question: 'Quelles sont les formules disponibles ?',
    answer: '<ul><li><strong>Gratuite :</strong> lettre avec infos et articles de loi, à imprimer et signer.</li><li><strong>Payante :</strong> PDF propre avec logo et signature en ligne.</li><li><strong>Premium :</strong> PDF + envoi en recommandé avec suivi.</li></ul><p>Support mail illimité inclus dans les formules payantes (hors conseil personnalisé).</p>',
    category: 'site',
    icon: '💼',
  },
  {
    id: 'rgpd',
    question: 'Êtes-vous conformes RGPD ? Où sont mes données ?',
    answer: 'Collecte minimale, <strong>hébergement français (Scaleway)</strong>, paiements <strong>Stancer</strong>, envoi via <strong>Merci Facteur</strong>. Transparence totale, pas de revente de données.',
    category: 'site',
    icon: '🇫🇷',
  },
  {
    id: 'envoi-recommande',
    question: 'Pouvez-vous envoyer la lettre en recommandé ?',
    answer: 'Oui, avec la formule <strong>Premium</strong>. La version gratuite et la version payante (PDF) ne comprennent pas l’envoi : tu récupères le document pour envoi par tes soins.',
    category: 'site',
    icon: '📮',
  },
  {
    id: 'disclaimer',
    question: 'Est-ce un conseil juridique personnalisé ?',
    answer: 'Non. Il s’agit d’un <strong>outil d’assistance</strong> et d’informations générales. Pour un avis personnalisé, rapproche-toi d’un professionnel du droit.',
    category: 'site',
    icon: '📜',
  },
  // Autres essentielles côté garantie/site…
  {
    id: 'occasion',
    question: 'Les produits d’occasion sont-ils couverts ?',
    answer: 'Oui s’ils sont achetés à un <strong>professionnel</strong> (GLC au moins 1 an). Entre particuliers : pas de GLC, voie des vices cachés (Code civil).',
    category: 'legal',
    icon: '♻️',
  },
  {
    id: 'preuve',
    question: 'Dois-je prouver le défaut ?',
    answer: 'Pendant <strong>24 mois</strong> (12 pour l’occasion), le défaut est présumé exister au jour de la vente : c’est au vendeur de prouver le contraire (sauf cas particuliers).',
    category: 'legal',
    icon: '⚖️',
  },
  {
    id: 'prix',
    question: 'Combien ça coûte ?',
    answer: '<ul><li><strong>Lettre gratuite</strong> : 0 €</li><li><strong>PDF signé</strong> : petit tarif (voir paiement)</li><li><strong>Premium recommandé</strong> : tarif incluant affranchissement & suivi</li></ul>',
    category: 'site',
    icon: '💶',
  },
];

type TopFAQProps = {
  className?: string;
  showHeader?: boolean;
};

export function TopFAQ({ className = '', showHeader = true }: TopFAQProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);
  // Colonnes strictement équilibrées en gardant l’ordre d’origine
  const popularItems = FAQ_ITEMS.filter((_, idx) => idx % 2 === 0);
  const otherItems = FAQ_ITEMS.filter((_, idx) => idx % 2 === 1);

  const toggle = (id: string) => {
    setOpenItems(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  return (
      <Reveal>
        {/* Empêche le débordement horizontal */}
        <div className={`px-2 sm:px-4 lg:px-0 overflow-x-hidden ${className}`}> {/* Plus de padding mobile */}
          {/* Header conditionnel (inchangé) */}
          {showHeader && (
              <div className="text-center mb-12 sm:mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-10 sm:mb-12">
                  <HelpCircle className="w-4 h-4" />
                  Questions essentielles
                </div>

                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Questions fréquentes
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Tout ce qu'il faut savoir sur vos droits et notre service
                </p>
              </div>
          )}

          {/* Grille d’origine : 2 colonnes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">{/* ✅ force largeur pleine */}
            {/* Colonne 1 : Essentielles (équilibrées) */}
            <div className="space-y-4 min-w-0">{/* ✅ empêche l’élargissement par contenu */}
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-yellow-500" />
                <h3 className="font-bold text-gray-900">Questions essentielles</h3>
              </div>

              {popularItems.map(item => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow w-full">{/* ✅ width fixe */}
                    <button
                        type="button"
                        aria-expanded={openItems.includes(item.id)}
                        onClick={() => toggle(item.id)}
                        className="w-full flex items-start gap-2 sm:gap-3 p-3 sm:p-4 lg:p-5 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-50 rounded-lg flex items-center justify-center text-sm sm:text-base">
                        {item.icon ?? '❓'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm leading-snug mb-1">
                          {item.question}
                        </h4>
                        <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-gray-500">
                        <Shield className="w-3 h-3" />
                        {item.category === 'legal' ? 'Garantie légale' : 'Fonctionnement du site'}
                      </span>
                          {openItems.includes(item.id) ? (
                              <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </button>

                    {openItems.includes(item.id) && (
                        <div className="px-3 sm:px-4 lg:px-5 pb-3 sm:pb-4 lg:pb-5 pl-8 sm:pl-12 lg:pl-16">
                          <div
                              className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words"
                              dangerouslySetInnerHTML={{ __html: item.answer }}
                          />
                        </div>
                    )}
                  </div>
              ))}
            </div>

            {/* Colonne 2 : À connaître aussi (équilibrées) */}
            <div className="space-y-4 min-w-0">{/* ✅ empêche l’élargissement par contenu */}
              <div className="flex items-center gap-2 mb-6">
                <Shield className="w-5 h-5 text-blue-500" />
                <h3 className="font-bold text-gray-900">À connaître aussi</h3>
              </div>

              {otherItems.map(item => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow w-full">{/* ✅ width fixe */}
                    <button
                        type="button"
                        aria-expanded={openItems.includes(item.id)}
                        onClick={() => toggle(item.id)}
                        className="w-full flex items-start gap-3 p-5 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-base">
                        {item.icon ?? '❓'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-snug mb-1">
                          {item.question}
                        </h4>
                        <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-gray-500">
                        <Shield className="w-3 h-3" />
                        {item.category === 'legal' ? 'Garantie légale' : 'Fonctionnement du site'}
                      </span>
                          {openItems.includes(item.id) ? (
                              <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </button>

                    {openItems.includes(item.id) && (
                        <div className="px-5 pb-5 pl-16">
                          <div
                              className="text-gray-700 text-sm leading-relaxed break-words"
                              dangerouslySetInnerHTML={{ __html: item.answer }}
                          />
                        </div>
                    )}
                  </div>
              ))}
            </div>
          </div>

          {/* CTA bas (inchangé) */}
          <div className="mt-10 sm:mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              <HelpCircle className="w-5 h-5" />
              Voir toute la FAQ
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Reveal>
  );
}

export default TopFAQ;
