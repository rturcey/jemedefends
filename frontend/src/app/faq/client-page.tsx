// app/faq/client-page.tsx - Mise à jour avec recherche unifiée
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  HelpCircle,
  FileText,
  ArrowRight,
  Shield,
  Settings,
  User,
  X,
  Star,
} from 'lucide-react';

import Container from '@/components/ui/Container';
import Skeleton from '@/components/ui/Skeleton';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import MobileFAQItem from '@/components/marketing/MobileFAQItem';
import SearchBar from '@/components/guides/SearchBar';
import { Reveal } from '@/components';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import {
  createAdvancedUnifiedSearchFilter,
  FAQ_SEARCH_CONFIG,
  type SearchableItem,
} from '@/lib/search-utils';

// Interface FAQ étendue pour la recherche unifiée
interface FAQItem extends SearchableItem {
  question: string;
  answer: string;
  category: 'legal' | 'service' | 'technique';
  keywords: string[];
  icon?: string;
}

// --- LÉGAL / SERVICE / TECHNIQUE : FAQ optimisée SEO + conversion, conforme L.217-3 à L.217-28
const ALL_FAQ_ITEMS: FAQItem[] = [
  // --- LÉGAL ---
  {
    id: 'garantie-duree',
    question: 'Combien de temps dure la garantie légale de conformité ?',
    answer: `La garantie légale de conformité dure <strong>2 ans</strong> pour les biens neufs <em>et</em> d’occasion achetés chez un professionnel. 
      La <strong>présomption de défaut</strong> est de <strong>24 mois</strong> (neuf) et d’au moins <strong>12 mois</strong> (occasion). 
      Le délai court à partir de la <strong>délivrance</strong> (réception du bien).`,
    category: 'legal',
    keywords: ['garantie légale', 'durée 2 ans', 'occasion 12 mois', 'présomption', 'délivrance'],
    isPopular: true,
    icon: '⏱️',
  },
  {
    id: 'gratuit-obligatoire',
    question: 'La garantie légale est-elle vraiment gratuite et obligatoire ?',
    answer: `Oui. Elle est <strong>gratuite</strong> et <strong>automatique</strong> dès l’achat auprès d’un professionnel (L.217-3 et s.). 
      Elle s’impose au vendeur, qui ne peut ni la limiter ni vous renvoyer vers le fabricant.`,
    category: 'legal',
    keywords: ['gratuite', 'obligatoire', 'automatique', 'vendeur', 'fabricant'],
    isPopular: true,
    icon: '💸',
  },
  {
    id: 'preuve-defaut',
    question: 'Dois-je prouver que le défaut existait à l’achat ?',
    answer: `Pendant la période de présomption (24 mois neuf ; au moins 12 mois occasion), le défaut est <strong>présumé</strong> exister à la livraison (L.217-7). 
      Le vendeur peut renverser cette présomption en prouvant un mauvais usage ou une cause externe.`,
    category: 'legal',
    keywords: ['preuve', 'présomption', 'L.217-7', 'livraison', 'occasion'],
    isPopular: true,
    icon: '🔍',
  },
  {
    id: 'recours-possibles',
    question: 'Quels sont mes recours si mon produit ne marche pas ?',
    answer: `Vous disposez de 4 recours (L.217-9, L.217-13) : <strong>réparation</strong> ou <strong>remplacement</strong> ; 
      si impossibles ou échouent, <strong>réduction du prix</strong> ou <strong>remboursement</strong>. 
      Tous les frais de mise en conformité sont à la charge du <strong>vendeur</strong> (L.217-11).`,
    category: 'legal',
    keywords: ['réparation', 'remplacement', 'réduction du prix', 'remboursement', 'frais vendeur'],
    isPopular: true,
    icon: '⚖️',
  },
  {
    id: 'vendeur-refuse',
    question: 'Le vendeur refuse d’appliquer la garantie légale, que faire ?',
    answer: `Rappelez-lui par écrit la garantie légale (L.217-3, L.217-9) et exigez une <strong>mise en conformité</strong> sous <em>délai raisonnable</em>. 
      À défaut, adressez une <strong>mise en demeure</strong> et demandez le <strong>remboursement</strong> ou la <strong>réduction de prix</strong> (L.217-13).`,
    category: 'legal',
    keywords: [
      'vendeur refuse',
      'mise en demeure',
      'délai raisonnable',
      'remboursement',
      'L.217-13',
    ],
    icon: '📝',
  },
  {
    id: 'frais-a-la-charge-du-vendeur',
    question: 'Qui paie les frais de retour, transport et main-d’œuvre ?',
    answer: `Tous les frais liés à la <strong>mise en conformité</strong> (diagnostic, transport, pièces, main-d’œuvre) 
      sont à la charge du <strong>vendeur</strong> (L.217-11). Refusez tout devis “hors garantie légale”.`,
    category: 'legal',
    keywords: ['frais', 'transport', 'diagnostic', 'main-d’œuvre', 'L.217-11'],
    icon: '🚚',
  },
  {
    id: 'delai-raisonnable',
    question: 'Quel délai pour réparer ou remplacer ?',
    answer: `Le vendeur doit agir dans un <strong>délai raisonnable</strong> après votre demande (L.217-9). 
      Si l’immobilisation est longue ou si l’intervention échoue, exigez <strong>remplacement</strong> ou <strong>remboursement</strong> (L.217-13).`,
    category: 'legal',
    keywords: ['délai raisonnable', 'immobilisation', 'réparation', 'remplacement', 'L.217-9'],
    icon: '⏳',
  },
  {
    id: 'maj-logicielle-obligation',
    question: 'Les mises à jour logicielles sont-elles obligatoires ?',
    answer: `Pour un bien avec <strong>éléments numériques</strong> (smartphone, TV connectée, etc.), 
      les mises à jour <strong>nécessaires au maintien de la conformité</strong> doivent être fournies pendant la période prévue (L.217-19 à L.217-21).`,
    category: 'legal',
    keywords: ['mises à jour', 'éléments numériques', 'L.217-19', 'L.217-21', 'conformité'],
    icon: '🔄',
  },
  {
    id: 'occasion-presomption',
    question: 'Et pour un produit d’occasion ?',
    answer: `La garantie légale dure <strong>2 ans</strong>. 
      La <strong>présomption</strong> d’existence du défaut est d’au moins <strong>12 mois</strong> (L.217-7). 
      Le vendeur doit prouver une cause excluante pour refuser la garantie.`,
    category: 'legal',
    keywords: ['occasion', '2 ans', '12 mois', 'présomption', 'L.217-7'],
    icon: '♻️',
  },
  {
    id: 'choix-consommateur',
    question: 'Qui choisit entre réparation et remplacement ?',
    answer: `Vous choisissez <strong>réparation</strong> ou <strong>remplacement</strong> (L.217-9). 
      Le vendeur ne peut imposer l’autre option que si la vôtre est <strong>impossible</strong> ou <strong>disproportionnée</strong> au regard du coût.`,
    category: 'legal',
    keywords: ['choix réparation', 'remplacement', 'disproportionné', 'L.217-9'],
    icon: '🎛️',
  },
  {
    id: 'extension-garantie',
    question: 'Différence entre garantie légale et « extension de garantie » ?',
    answer: `La <strong>garantie légale</strong> (L.217-3 à L.217-28) est <strong>obligatoire et gratuite</strong>. 
      L’<strong>extension</strong> est un contrat payant <em>facultatif</em> qui n’affecte pas vos droits légaux. 
      Faites d’abord valoir la garantie légale auprès du vendeur.`,
    category: 'legal',
    keywords: ['extension de garantie', 'contrat payant', 'garantie légale', 'obligatoire'],
    icon: '📜',
  },
  {
    id: 'diagnostic-payant',
    question: 'Le vendeur peut-il me facturer un diagnostic ?',
    answer: `Non, si le diagnostic est nécessaire à la <strong>mise en conformité</strong> : il reste à la charge du vendeur (L.217-11). 
      Demandez un écrit si on vous le réclame et rappelez l’article.`,
    category: 'legal',
    keywords: ['diagnostic payant', 'mise en conformité', 'L.217-11', 'frais'],
    icon: '🧾',
  },

  // --- SERVICE ---
  {
    id: 'service-gratuit',
    question: 'Votre service est-il vraiment gratuit ?',
    answer: `La version de base est <strong>100% gratuite</strong> : génération de lettre, bases légales, conseils. 
      Les options payantes ajoutent <strong>PDF pro</strong> et <strong>envoi postal suivi</strong>.`,
    category: 'service',
    keywords: ['service gratuit', 'PDF pro', 'envoi postal', 'prix', 'offre'],
    isPopular: true,
    icon: '💰',
  },
  {
    id: 'documents-necessaires',
    question: 'Quels documents dois-je fournir ?',
    answer: `Il vous faut : <strong>facture ou ticket</strong>, <strong>description/preuves du défaut</strong> (photos/vidéos utiles) 
      et <strong>coordonnées du vendeur</strong>. Notre assistant les intègre à la lettre.`,
    category: 'service',
    keywords: ['documents', 'facture', 'preuves', 'photos', 'vidéos', 'vendeur'],
    isPopular: true,
    icon: '📄',
  },
  {
    id: 'combien-temps',
    question: 'Combien de temps pour générer ma lettre ?',
    answer: `<strong>Moins de 3 minutes</strong> en moyenne. Formulaire guidé, lettre disponible immédiatement (téléchargement ou envoi).`,
    category: 'service',
    keywords: ['3 minutes', 'rapide', 'immédiat', 'générateur de lettre'],
    icon: '⚡',
  },
  {
    id: 'aide-redaction',
    question: 'Aidez-vous à rédiger ma réclamation ?',
    answer: `Oui. Nous insérons automatiquement les <strong>bons articles</strong> (L.217-3, L.217-7, L.217-9, L.217-11, L.217-13) 
      et structurons vos <strong>preuves</strong> pour renforcer votre demande.`,
    category: 'service',
    keywords: ['aide rédaction', 'articles de loi', 'mise en demeure', 'preuves'],
    icon: '✍️',
  },
  {
    id: 'reussite-taux',
    question: 'Quel est votre taux de réussite ?',
    answer: `Pas de pourcentages invérifiables. Nos modèles sont <strong>conformes au Code</strong> (L.217-3 à L.217-28) 
      et optimisés pour une <strong>mise en conformité</strong> rapide.`,
    category: 'service',
    keywords: ['taux de réussite', 'efficacité', 'conforme', 'code consommation'],
    icon: '📊',
  },
  {
    id: 'suivi-dossier',
    question: 'Pouvez-vous m’indiquer la suite après l’envoi ?',
    answer: `Oui : nous fournissons une <strong>timeline</strong> (relance, mise en demeure, étapes suivantes) 
      et des <strong>modèles</strong> prêts à l’emploi. Vous gardez la main sur chaque étape.`,
    category: 'service',
    keywords: ['timeline', 'relance', 'mise en demeure', 'modèles'],
    icon: '🧭',
  },
  {
    id: 'lettre-recommandee',
    question: 'Faut-il envoyer en recommandé ?',
    answer: `Le recommandé est <strong>conseillé</strong> pour la mise en demeure : preuve de date et de contenu. 
      Notre générateur prépare une lettre <strong>prête à poster</strong> (ou envoi via partenaires).`,
    category: 'service',
    keywords: ['lettre recommandée', 'preuve', 'mise en demeure', 'date certaine'],
    icon: '📬',
  },

  // --- TECHNIQUE ---
  {
    id: 'site-mobile',
    question: 'Le site fonctionne-t-il sur mobile ?',
    answer: `Oui, le site est <strong>mobile-first</strong> : interface optimisée pour smartphone, tablette et ordinateur.`,
    category: 'technique',
    keywords: ['mobile-first', 'responsive', 'smartphone', 'tablette'],
    icon: '📱',
  },
  {
    id: 'sauvegarde-donnees',
    question: 'Mes informations sont-elles sauvegardées ?',
    answer: `Par <strong>respect de votre vie privée</strong>, nous ne conservons pas vos données personnelles. 
      Téléchargez et sauvegardez votre lettre après génération.`,
    category: 'technique',
    keywords: ['données personnelles', 'confidentialité', 'sauvegarde', 'vie privée'],
    icon: '🔒',
  },
  {
    id: 'probleme-technique',
    question: 'J’ai un problème technique, qui contacter ?',
    answer: `Utilisez le formulaire de contact ou l’email support. 
      Indiquez votre navigateur, appareil et une capture d’écran pour accélérer le diagnostic.`,
    category: 'technique',
    keywords: ['support', 'bug', 'contact', 'navigateur', 'capture d’écran'],
    icon: '🔧',
  },
  {
    id: 'pieces-disponibilite',
    question: 'Et si la pièce n’est plus disponible ?',
    answer: `Si la <strong>réparation</strong> est impossible (pièce indisponible) ou <strong>disproportionnée</strong>, 
      demandez le <strong>remplacement</strong> ou, à défaut, la <strong>réduction du prix</strong> / le <strong>remboursement</strong> (L.217-9, L.217-13).`,
    category: 'technique',
    keywords: ['pièce indisponible', 'réparation impossible', 'remplacement', 'remboursement'],
    icon: '🧩',
  },
  {
    id: 'donnees-personnelles-produit',
    question: 'Que faire de mes données avant un retour SAV ?',
    answer: `Sauvegardez vos données et <strong>réinitialisez</strong> l’appareil si possible. 
      La garantie légale porte sur la <strong>conformité</strong> (L.217-5) ; protégez votre confidentialité par précaution.`,
    category: 'technique',
    keywords: ['réinitialisation', 'données', 'confidentialité', 'L.217-5', 'SAV'],
    icon: '🗂️',
  },
];

// Catégories avec compteurs dynamiques
const FAQ_CATEGORIES = [
  {
    id: 'all',
    name: 'Toutes',
    icon: <HelpCircle className="w-5 h-5" />,
    color: 'gray',
    count: ALL_FAQ_ITEMS.length,
  },
  {
    id: 'legal',
    name: 'Vos droits légaux',
    icon: <Shield className="w-5 h-5" />,
    color: 'blue',
    count: ALL_FAQ_ITEMS.filter(i => i.category === 'legal').length,
  },
  {
    id: 'service',
    name: 'Notre service',
    icon: <User className="w-5 h-5" />,
    color: 'green',
    count: ALL_FAQ_ITEMS.filter(i => i.category === 'service').length,
  },
  {
    id: 'technique',
    name: 'Questions techniques',
    icon: <Settings className="w-5 h-5" />,
    color: 'orange',
    count: ALL_FAQ_ITEMS.filter(i => i.category === 'technique').length,
  },
];

export default function FAQClientPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const { isMobile } = useMobileOptimization();

  // Simulation de chargement
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 600);
    return () => clearTimeout(timer);
  }, []);

  // Filtrage avec recherche unifiée
  const filteredFAQs = useMemo(() => {
    let list = ALL_FAQ_ITEMS;

    // Filtrage par catégorie
    if (selectedCategory !== 'all') {
      list = list.filter(i => i.category === selectedCategory);
    }

    // Recherche unifiée avec scoring
    if (searchQuery.trim()) {
      const unifiedFilter = createAdvancedUnifiedSearchFilter(searchQuery, FAQ_SEARCH_CONFIG);
      list = unifiedFilter(list);
    } else {
      // Tri normal : populaires d'abord
      list = [...list].sort((a, b) => {
        const ap = a.isPopular ? 1 : 0;
        const bp = b.isPopular ? 1 : 0;
        return bp - ap;
      });
    }

    return list;
  }, [selectedCategory, searchQuery]);

  // Handler de recherche simplifié
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Toggle d'un item FAQ
  const toggleFAQItem = (id: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const breadcrumbItems = [{ label: 'FAQ', isCurrentPage: true }];

  const getCategoryColors = (color: string, isSelected: boolean) => {
    const colors = {
      gray: isSelected ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100',
      blue: isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
      green: isSelected
        ? 'bg-green-600 text-white'
        : 'bg-green-50 text-green-700 hover:bg-green-100',
      orange: isSelected
        ? 'bg-orange-600 text-white'
        : 'bg-orange-50 text-orange-700 hover:bg-orange-100',
    } as const;
    return colors[color as keyof typeof colors] ?? colors.gray;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="px-4 py-6 sm:py-8">
            <Skeleton loading={!isLoaded} className="h-8 w-32 mb-4">
              <Breadcrumbs items={breadcrumbItems} />
            </Skeleton>

            <Skeleton loading={!isLoaded} className="h-16 w-3/4 mb-4">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Questions fréquentes
              </h1>
            </Skeleton>

            <Skeleton loading={!isLoaded} className="h-12 w-full mb-6">
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Tout savoir sur vos droits de consommateur et notre service.
                <span className="hidden sm:inline">
                  {' '}
                  Réponses claires et vérifiées par nos experts juridiques.
                </span>
              </p>
            </Skeleton>

            <Skeleton loading={!isLoaded} className="h-12 w-full">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Rechercher dans la FAQ..."
                isLoading={false}
                popularSearches={[
                  'garantie légale',
                  '2 ans',
                  'gratuit',
                  'documents',
                  'remboursement',
                ]}
              />
            </Skeleton>
          </div>
        </Container>
      </div>

      {/* Contenu */}
      <Container>
        <div className="px-4 py-8">
          <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Filtres */}
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <h3 className="font-semibold text-gray-900">Filtrer par catégorie</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {FAQ_CATEGORIES.map(cat => (
                    <Skeleton key={cat.id} loading={!isLoaded} className="h-10 w-36 rounded-xl">
                      <button
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 min-h-[44px] touch-manipulation ${getCategoryColors(
                          cat.color,
                          selectedCategory === cat.id
                        )}`}
                      >
                        {cat.icon}
                        <span>{cat.name}</span>
                        <span className="text-xs opacity-75">({cat.count})</span>
                      </button>
                    </Skeleton>
                  ))}
                </div>

                {(searchQuery.trim() || selectedCategory !== 'all') && isLoaded && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {filteredFAQs.length} résultat{filteredFAQs.length > 1 ? 's' : ''}{' '}
                        {searchQuery.trim() && `pour "${searchQuery.trim()}"`}
                      </span>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                        }}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <X className="w-4 h-4" />
                        Effacer
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Liste FAQ */}
              <div className="space-y-4">
                {isLoaded ? (
                  filteredFAQs.length > 0 ? (
                    filteredFAQs.map((item, index) => (
                      <Reveal key={item.id} delay={index * 0.05}>
                        {isMobile ? (
                          <MobileFAQItem
                            question={item.question}
                            answer={<div dangerouslySetInnerHTML={{ __html: item.answer }} />}
                            isOpen={openItems.has(item.id)}
                            onToggle={() => toggleFAQItem(item.id)}
                          />
                        ) : (
                          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                            <button
                              onClick={() => toggleFAQItem(item.id)}
                              className="w-full flex items-start gap-4 p-6 text-left hover:bg-gray-50 transition-colors"
                              aria-expanded={openItems.has(item.id)}
                              aria-controls={`faq-panel-${item.id}`}
                            >
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-base">
                                {item.icon ?? '❓'}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                                  {item.question}
                                </h3>

                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span className="capitalize">
                                    {FAQ_CATEGORIES.find(c => c.id === item.category)?.name}
                                  </span>
                                  {item.isPopular && (
                                    <span className="inline-flex items-center gap-1 text-yellow-600">
                                      <Star className="w-3 h-3" />
                                      Populaire
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex-shrink-0">
                                {openItems.has(item.id) ? (
                                  <X className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <ArrowRight className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                            </button>

                            {openItems.has(item.id) && (
                              <div id={`faq-panel-${item.id}`} className="px-6 pb-6">
                                <div
                                  className="text-gray-700 leading-relaxed"
                                  dangerouslySetInnerHTML={{ __html: item.answer }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </Reveal>
                    ))
                  ) : (
                    // État vide
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Aucune réponse trouvée
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {searchQuery.trim()
                          ? `Aucun résultat pour "${searchQuery.trim()}". Essayez d'autres mots-clés.`
                          : 'Aucune question dans cette catégorie.'}
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategory('all');
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Voir toutes les questions
                      </button>
                    </div>
                  )
                ) : (
                  // Skeletons de chargement
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-24 rounded-xl" />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* CTA */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Une question spécifique ?</h3>
                <p className="text-blue-800 text-sm mb-4">
                  Créez votre lettre personnalisée en quelques minutes.
                </p>
                <Link
                  href="/eligibilite"
                  className="inline-flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors min-h-[44px] touch-manipulation"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Commencer maintenant
                </Link>
              </div>

              {/* Guides populaires */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Guides populaires</h3>
                <div className="space-y-3">
                  <Link
                    href="/guides/garantie-legale-conformite-guide-complet"
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900 mb-1">
                      Guide complet garantie légale
                    </div>
                    <div className="text-sm text-gray-600">Tous vos droits expliqués</div>
                  </Link>
                  <Link
                    href="/guides/smartphone-telephone-panne-garantie-legale"
                    className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900 mb-1">Smartphone en panne</div>
                    <div className="text-sm text-gray-600">Réparation ou remboursement</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
