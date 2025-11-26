'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  HelpCircle,
  FileText,
  Shield,
  Settings,
  User,
  X,
  BookOpen,
  Sparkles,
  BadgeCheck,
  Wrench,
} from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';

import Container from '@/components/ui/Container';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SearchBar from '@/components/guides/SearchBar';
import { cn } from '@/lib/utils';
import {
  createAdvancedUnifiedSearchFilter,
  FAQ_SEARCH_CONFIG,
  type SearchableItem,
} from '@/lib/search-utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------
interface FAQItem extends SearchableItem {
  question: string;
  answer: React.ReactNode;
  category: 'legal' | 'service' | 'technique';
  keywords: string[];
}

// ------------------------------------------------------------
// Data (reprend tes contenus legacy, mais en ReactNode)
// ------------------------------------------------------------
const ALL_FAQ_ITEMS: FAQItem[] = [
  {
    id: 'garantie-duree',
    question: 'Combien de temps dure la garantie légale de conformité ?',
    answer: (
      <>
        La garantie légale de conformité dure <strong>2 ans</strong> pour les biens neufs{' '}
        <em>et</em> d’occasion achetés chez un professionnel. La{' '}
        <strong>présomption de défaut</strong> est de <strong>24 mois</strong> (neuf) et d’au moins{' '}
        <strong>12 mois</strong> (occasion). Le délai court à partir de la{' '}
        <strong>délivrance</strong> (réception du bien).
      </>
    ),
    category: 'legal',
    keywords: ['garantie légale', 'durée 2 ans', 'occasion 12 mois', 'présomption', 'délivrance'],
  },
  {
    id: 'gratuit-obligatoire',
    question: 'La garantie légale est-elle vraiment gratuite et obligatoire ?',
    answer: (
      <>
        Oui. Elle est <strong>gratuite</strong> et <strong>automatique</strong> dès l’achat auprès
        d’un professionnel (L.217-3 et s.). Elle s’impose au vendeur, qui ne peut ni la limiter ni
        vous renvoyer vers le fabricant.
      </>
    ),
    category: 'legal',
    keywords: ['gratuite', 'obligatoire', 'automatique', 'vendeur', 'fabricant'],
  },
  {
    id: 'preuve-defaut',
    question: 'Dois-je prouver que le défaut existait à l’achat ?',
    answer: (
      <>
        Pendant la période de présomption (24 mois neuf ; au moins 12 mois occasion), le défaut est{' '}
        <strong>présumé</strong> exister à la livraison (L.217-7). Le vendeur peut renverser cette
        présomption en prouvant un mauvais usage ou une cause externe.
      </>
    ),
    category: 'legal',
    keywords: ['preuve', 'présomption', 'L.217-7', 'livraison', 'occasion'],
  },
  {
    id: 'recours-possibles',
    question: 'Quels sont mes recours si mon produit ne marche pas ?',
    answer: (
      <>
        Vous disposez de 4 recours (L.217-9, L.217-13) : <strong>réparation</strong> ou{' '}
        <strong>remplacement</strong> ; si impossibles ou échouent,{' '}
        <strong>réduction du prix</strong> ou <strong>remboursement</strong>. Tous les frais de mise
        en conformité sont à la charge du <strong>vendeur</strong> (L.217-11).
      </>
    ),
    category: 'legal',
    keywords: ['réparation', 'remplacement', 'réduction du prix', 'remboursement', 'frais vendeur'],
  },
  {
    id: 'vendeur-refuse',
    question: 'Le vendeur refuse d’appliquer la garantie légale, que faire ?',
    answer: (
      <>
        Rappelez-lui par écrit la garantie légale (L.217-3, L.217-9) et exigez une{' '}
        <strong>mise en conformité</strong> sous délai raisonnable. À défaut, adressez une{' '}
        <strong>mise en demeure</strong> et demandez le <strong>remboursement</strong> ou la{' '}
        <strong>réduction de prix</strong> (L.217-13).
      </>
    ),
    category: 'legal',
    keywords: ['vendeur refuse', 'mise en demeure', 'délai raisonnable', 'remboursement'],
  },
  {
    id: 'service-gratuit',
    question: 'Votre service est-il vraiment gratuit ?',
    answer: (
      <>
        La version de base est <strong>100% gratuite</strong> : génération de lettre, bases légales,
        conseils. Les options payantes ajoutent <strong>PDF pro</strong> et{' '}
        <strong>envoi postal suivi</strong>.
      </>
    ),
    category: 'service',
    keywords: ['service gratuit', 'PDF pro', 'envoi postal', 'prix', 'offre'],
  },
  {
    id: 'combien-temps',
    question: 'Combien de temps pour générer ma lettre ?',
    answer: (
      <>
        <strong>Moins de 3 minutes</strong> en moyenne. Formulaire guidé, lettre disponible
        immédiatement.
      </>
    ),
    category: 'service',
    keywords: ['3 minutes', 'rapide', 'immédiat', 'générateur de lettre'],
  },
  {
    id: 'site-mobile',
    question: 'Le site fonctionne-t-il sur mobile ?',
    answer: (
      <>
        Oui, le site est <strong>mobile-first</strong> : interface optimisée pour smartphone,
        tablette et ordinateur.
      </>
    ),
    category: 'technique',
    keywords: ['mobile-first', 'responsive', 'smartphone', 'tablette'],
  },
  {
    id: 'sauvegarde-donnees',
    question: 'Mes informations sont-elles sauvegardées ?',
    answer: (
      <>
        Par respect de votre vie privée, nous ne conservons pas vos données personnelles.
        Téléchargez et sauvegardez votre lettre après génération.
      </>
    ),
    category: 'technique',
    keywords: ['données personnelles', 'confidentialité', 'sauvegarde', 'vie privée'],
  },
];

// ------------------------------------------------------------
// Categories config
// ------------------------------------------------------------
type CategoryId = 'all' | 'legal' | 'service' | 'technique';

const CATEGORY_CONFIG: Array<{
  id: CategoryId;
  name: string;
  icon: React.ReactNode;
  color: 'gray' | 'blue' | 'green' | 'orange';
  description?: string;
}> = [
  { id: 'all', name: 'Toutes', icon: <HelpCircle className="w-4 h-4" />, color: 'gray' },
  {
    id: 'legal',
    name: 'Vos droits légaux',
    icon: <Shield className="w-4 h-4" />,
    color: 'blue',
    description: 'Garantie légale, recours, preuves…',
  },
  {
    id: 'service',
    name: 'Notre service',
    icon: <User className="w-4 h-4" />,
    color: 'green',
    description: 'Tarifs, génération, envoi postal…',
  },
  {
    id: 'technique',
    name: 'Questions techniques',
    icon: <Settings className="w-4 h-4" />,
    color: 'orange',
    description: 'Mobile, données, SAV, bugs…',
  },
];

function categoryButtonClasses(color: string, selected: boolean) {
  const map = {
    gray: selected
      ? 'bg-gray-900 text-white'
      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200',
    blue: selected
      ? 'bg-blue-600 text-white'
      : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-100',
    green: selected
      ? 'bg-green-600 text-white'
      : 'bg-green-50 text-green-800 hover:bg-green-100 border border-green-100',
    orange: selected
      ? 'bg-orange-600 text-white'
      : 'bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-100',
  } as const;

  return map[color as keyof typeof map] ?? map.gray;
}

function itemCategoryIcon(cat: FAQItem['category']) {
  switch (cat) {
    case 'legal':
      return <BadgeCheck className="w-4 h-4 text-blue-700" />;
    case 'service':
      return <Sparkles className="w-4 h-4 text-green-700" />;
    case 'technique':
      return <Wrench className="w-4 h-4 text-orange-700" />;
  }
}

// ------------------------------------------------------------
// Component
// ------------------------------------------------------------
export default function FAQClientPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [openIds, setOpenIds] = React.useState<string[]>([]);

  const filteredFAQs = React.useMemo(() => {
    let list = ALL_FAQ_ITEMS;

    if (selectedCategory !== 'all') list = list.filter(i => i.category === selectedCategory);

    if (searchQuery.trim()) {
      const unifiedFilter = createAdvancedUnifiedSearchFilter(searchQuery, FAQ_SEARCH_CONFIG);
      list = unifiedFilter(list);
    }

    return list;
  }, [selectedCategory, searchQuery]);

  const countsByCategory = React.useMemo(() => {
    return {
      all: ALL_FAQ_ITEMS.length,
      legal: ALL_FAQ_ITEMS.filter(i => i.category === 'legal').length,
      service: ALL_FAQ_ITEMS.filter(i => i.category === 'service').length,
      technique: ALL_FAQ_ITEMS.filter(i => i.category === 'technique').length,
    } as Record<CategoryId, number>;
  }, []);

  const hasFilter = Boolean(searchQuery.trim() || selectedCategory !== 'all');
  const breadcrumbItems = [{ label: 'FAQ', isCurrentPage: true }];

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative border-b border-gray-100">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/50"
        />
        <Container>
          <div className="px-4 py-8 sm:py-10">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="mt-2 max-w-3xl">
              <Badge className="mb-3">FAQ</Badge>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
                Questions fréquentes
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                Réponses claires sur la garantie légale, vos droits et l’utilisation de Je me
                défends.
              </p>

              <div className="mt-5">
                <SearchBar
                  onSearch={setSearchQuery}
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
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CONTENT */}
      <Container>
        <div className="px-4 py-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8">
            {/* MAIN */}
            <div className="space-y-6">
              {/* Tabs/filter */}
              <Tabs.Root
                value={selectedCategory}
                onValueChange={v => setSelectedCategory(v as CategoryId)}
                className="w-full"
              >
                <Card className="shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-500" />
                      Filtrer par catégorie
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <Tabs.List className="flex flex-wrap gap-2">
                      {CATEGORY_CONFIG.map(cat => {
                        const selected = selectedCategory === cat.id;
                        return (
                          <Tabs.Trigger key={cat.id} value={cat.id} asChild>
                            <button
                              type="button"
                              className={cn(
                                'inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                                'min-h-[40px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30',
                                categoryButtonClasses(cat.color, selected),
                              )}
                            >
                              {cat.icon}
                              <span>{cat.name}</span>
                              <span className="text-xs opacity-70">
                                ({countsByCategory[cat.id]})
                              </span>
                            </button>
                          </Tabs.Trigger>
                        );
                      })}
                    </Tabs.List>

                    {hasFilter && (
                      <>
                        <Separator className="my-4" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {filteredFAQs.length} résultat{filteredFAQs.length > 1 ? 's' : ''}
                            {searchQuery.trim() && ` pour "${searchQuery.trim()}"`}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSearchQuery('');
                              setSelectedCategory('all');
                              setOpenIds([]);
                            }}
                            className="gap-1 text-blue-700"
                          >
                            <X className="w-4 h-4" />
                            Réinitialiser
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </Tabs.Root>

              {/* FAQ list */}
              {filteredFAQs.length > 0 ? (
                <Accordion
                  type="multiple"
                  value={openIds}
                  onValueChange={setOpenIds}
                  className="space-y-2"
                >
                  {filteredFAQs.map(it => (
                    <AccordionItem
                      key={it.id}
                      value={it.id}
                      className="rounded-2xl border border-gray-200 bg-white shadow-sm px-2"
                    >
                      <AccordionTrigger className="px-3 py-4 text-left hover:no-underline">
                        <div className="flex items-start gap-3">
                          {/* ✅ icon unique (plus doublée) */}
                          <span className="mt-0.5">{itemCategoryIcon(it.category)}</span>

                          <div className="min-w-0">
                            <div className="font-semibold text-gray-900 leading-snug">
                              {it.question}
                            </div>
                            <div className="mt-1 text-xs text-gray-500">
                              {CATEGORY_CONFIG.find(c => c.id === it.category)?.name}
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-3 pb-4 text-sm text-gray-700 leading-relaxed">
                        {it.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <Card className="text-center py-10 shadow-sm">
                  <CardContent>
                    <div className="w-14 h-14 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                      <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">
                      Aucune réponse trouvée
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {searchQuery.trim()
                        ? `Aucun résultat pour "${searchQuery.trim()}".`
                        : 'Aucune question dans cette catégorie.'}
                    </p>
                    <div className="mt-5 flex justify-center">
                      <Button asChild size="sm">
                        <Link href="/faq">Voir toutes les questions</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* SIDEBAR */}
            <aside className="space-y-6">
              <Card className="border border-blue-100 bg-gradient-to-br from-blue-50/90 to-indigo-50/70 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-extrabold tracking-tight">
                    <span className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                      <FileText className="h-4 w-4" />
                    </span>
                    Une question spécifique ?
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-900/90">
                  Crée ta lettre personnalisée en quelques minutes, avec les bons articles.
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href="/eligibilite#start">Commencer</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <span className="h-8 w-8 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center">
                      <BookOpen className="h-4 w-4" />
                    </span>
                    Guides populaires
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link
                    href="/guides/garantie-legale-conformite-guide-complet"
                    className="block rounded-xl border border-gray-200 bg-white p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">Guide complet garantie légale</div>
                    <div className="text-xs text-gray-600">Tous vos droits expliqués</div>
                  </Link>

                  <Link
                    href="/guides/smartphone-telephone-panne-garantie-legale"
                    className="block rounded-xl border border-gray-200 bg-white p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">Smartphone en panne</div>
                    <div className="text-xs text-gray-600">Réparation ou remboursement</div>
                  </Link>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </Container>
    </div>
  );
}
