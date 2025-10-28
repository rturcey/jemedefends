// src/app/guides/client-page.tsx - UTILISANT LES COMPOSANTS EXISTANTS
'use client';

import { Search, Filter, X, BookOpen, Scale, Library, LibraryBig } from 'lucide-react';
import React, { useState, useMemo, useEffect } from 'react';

// Import des composants EXISTANTS
import { GuideCard } from '@/components/guides';
import SearchBar from '@/components/guides/SearchBar';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui';
import Container from '@/components/ui/Container';
import { Reveal } from '@/components';

// Import du système qui fonctionne
import { getAllGuides } from '@/lib/guide-registry';
import type { EnrichedGuide } from '@/types/guides';

import { getCategoryColors } from '@/lib/guide-utils';
import { getIconFromCategoryId } from '@/lib/icon-utils';

// Plus besoin d'adaptation - utilisation directe

// Fonction de recherche simple
function searchGuides(guides: EnrichedGuide[], query: string): EnrichedGuide[] {
  if (!query.trim()) return guides;

  const searchTerm = query.toLowerCase();
  return guides.filter(
    guide =>
      guide.metadata.title.toLowerCase().includes(searchTerm) ||
      (guide.metadata.seo?.description || '').toLowerCase().includes(searchTerm) ||
      (guide.category?.name || '').toLowerCase().includes(searchTerm),
  );
}

// Extraction des catégories
function extractCategories(guides: EnrichedGuide[]) {
  const categoryMap = new Map();

  guides.forEach(guide => {
    const cat = guide.category;
    if (!cat?.name) return;

    const existing = categoryMap.get(cat.name);

    if (existing) {
      existing.count++;
    } else {
      categoryMap.set(cat.name, {
        id: cat.name.toLowerCase().replace(/\s+/g, '-'),
        name: cat.name,
        count: 1,
        color: cat.color,
        icon: getIconFromCategoryId(cat.id),
      });
    }
  });

  return Array.from(categoryMap.values());
}


// CTA principal avec composants existants
function CTA() {
  return (
    <div
      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
      <div className="flex items-start">
        <div
          className="bg-blue-600 text-white rounded-lg p-3 mr-4 flex-shrink-0">
          <Scale />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-blue-900 mb-2">Défendez vos
            droits maintenant</h3>
          <p className="text-blue-800 mb-4">
            Générez votre lettre de mise en demeure en 3 minutes. Conforme
            au Code de la
            consommation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button href="/eligibilite" variant="primary"
                    className="min-h-[44px]">
              Créer ma lettre gratuite
            </Button>
            <Button href="/faq" variant="secondary"
                    className="min-h-[44px]">
              Voir la FAQ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant principal
export default function GuidesClientPage() {
  const [allGuides, setAllGuides] = useState<EnrichedGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Chargement des guides
  useEffect(() => {
    try {
      console.log('[Guides] Chargement des guides...');
      const guidesObj = getAllGuides();
      const guidesArray = Object.values(guidesObj);

      console.log('[Guides] Guides chargés:', guidesArray.length);
      console.log('[Guides] Catégorie premier guide:', guidesArray[0]?.category);

      setAllGuides(guidesArray);
      setError(null);
    } catch (error) {
      console.error('[Guides] Erreur chargement:', error);
      setError(error instanceof Error ? error.message : 'Erreur de chargement');
      setAllGuides([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filtrage et recherche
  const { filteredGuides, categories } = useMemo(() => {
    let filtered = allGuides;

    // Filtrage par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(guide => guide.category?.name === selectedCategory);
    }

    // Recherche textuelle
    filtered = searchGuides(filtered, searchQuery);

    // Tri par importance
    filtered = filtered.sort((a, b) => {
      if (a.slug.includes('garantie-legale-conformite-guide-complet')) return -1;
      if (b.slug.includes('garantie-legale-conformite-guide-complet')) return 1;
      return b.legal.mainArticles.length - a.legal.mainArticles.length;
    });

    const categories = extractCategories(allGuides);

    return { filteredGuides: filtered, categories };
  }, [allGuides, selectedCategory, searchQuery]);

  // Gestion du loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des guides...</p>
        </div>
      </div>
    );
  }

  // Gestion des erreurs
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erreur de
            chargement</h1>
          <p className="text-gray-600 mb-6">Impossible de charger les guides
            : {error}</p>
          <Button onClick={() => window.location.reload()} variant="primary">
            Recharger la page
          </Button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Accueil', href: '/' },
    { label: 'Guides', isCurrentPage: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="px-4 py-6 sm:py-8">
            <Breadcrumbs items={breadcrumbItems} />

            <h1
              className="mt-4 mb-3 font-bold text-gray-900 leading-tight
             text-2xl sm:text-3xl lg:text-4xl
             flex items-baseline gap-2"
            >
              {/* Icône = hauteur du texte, en bleu */}
              <LibraryBig
                className="text-blue-600 flex-none"
                aria-hidden="true"
              />
              {/* Texte qui peut wrap */}
              <span className="min-w-0 whitespace-normal break-words">
    Guides pratiques
  </span>
            </h1>


            <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-6">
              Défendez vos droits de consommateur dans chaque situation.
              <span className="hidden sm:inline">
                {' '}
                Guides détaillés, procédures étape par étape et conseils d'experts.
              </span>
            </p>

            {/* Barre de recherche avec composant existant */}
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Rechercher un guide..."
              isLoading={false}
              popularSearches={[
                'garantie légale conformité',
                'smartphone défectueux',
                'électroménager panne',
                'voiture problème',
              ]}
            />
          </div>
        </Container>
      </div>

      {/* Stats rapides */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="px-4 py-4">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                                <span
                                  className="w-2 h-2 bg-green-500 rounded-full"></span>
                {allGuides.length} guides disponibles
              </div>
              <div className="flex items-center gap-2">
                                <span
                                  className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {filteredGuides.length} résultat{filteredGuides.length > 1 ? 's' : ''}
                {searchQuery && ` pour "${searchQuery}"`}
              </div>
              <div className="flex items-center gap-2">
                                <span
                                  className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                100% gratuit
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Filtres par catégorie */}
      {categories.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <Container>
            <div className="px-4 py-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <h3 className="font-semibold text-gray-900">Filtrer par
                  catégorie</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 min-h-[44px] touch-manipulation ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <BookOpen /> Tous les guides ({allGuides.length})
                </button>

                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 min-h-[44px] touch-manipulation ${getCategoryColors(
                      category.color,
                      selectedCategory === category.name,
                    )}`}
                  >
                    {category.icon} {category.name} ({category.count})
                  </button>
                ))}
              </div>

              {/* Reset des filtres */}
              {(searchQuery.trim() || selectedCategory !== 'all') && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {filteredGuides.length} résultat{filteredGuides.length > 1 ? 's' : ''}{' '}
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
                      Tout effacer
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Container>
        </div>
      )}

      {/* Contenu principal */}
      <Container>
        <div className="px-4 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
            {/* Section guides */}
            <div className="space-y-6">
              <div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {searchQuery.trim()
                      ? 'Résultats de recherche'
                      : selectedCategory !== 'all'
                        ? categories.find(c => c.name === selectedCategory)?.name
                        : 'Tous les guides'}
                  </h2>
                  <p className="text-gray-600">
                    Guides détaillés pour faire valoir vos droits
                    efficacement
                  </p>
                </div>
              </div>

              {/* Grille des guides - AVEC LE VRAI COMPOSANT GuideCard */}
              {filteredGuides.length > 0 ? (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGuides.map((guide, index) => (
                    <div key={guide.slug}>
                      <GuideCard
                        slug={guide.slug}
                        title={guide.metadata.title}
                        description={
                          guide.metadata.seo?.description ||
                          'Guide pratique pour défendre vos droits de consommateur.'
                        }
                        category={
                          guide.category || {
                            name: 'Guide',
                            color: 'gray',
                          }
                        }
                        readingTime={guide.readingTime}
                        lastUpdated={new Date(guide.legal.lastUpdated)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen
                    className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun
                    guide trouvé</h3>
                  <p className="text-gray-600 mb-6">
                    Essayez avec d'autres mots-clés ou catégories.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    variant="primary"
                  >
                    Voir tous les guides
                  </Button>
                </div>
              )}

              <CTA />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
