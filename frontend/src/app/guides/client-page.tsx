// app/guides/client-page.tsx - Mise à jour avec recherche unifiée
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FileText, ArrowRight, Clock, Star, Filter, X, BookOpen, TrendingUp } from 'lucide-react';

import Container from '@/components/ui/Container';
import Skeleton from '@/components/ui/Skeleton';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import SearchBar from '@/components/guides/SearchBar';
import { Reveal } from '@/components';
import { getAllGuides, getCategories, type Guide, type Category } from '@/lib/guide-utils';
import { createAdvancedUnifiedSearchFilter, GUIDE_SEARCH_CONFIG } from '@/lib/search-utils';

// Composant GuideCard optimisé
const GuideCard: React.FC<{ guide: Guide; index: number }> = ({ guide, index }) => (
  <Reveal delay={index * 0.05}>
    <Link href={`/guides/${guide.slug}`} className="block">
      <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 h-full touch-manipulation">
        {/* Header avec catégorie et popularité */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">{guide.category.emoji}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColors(guide.category.color)}`}
            >
              {guide.category.name}
            </span>
          </div>
          {guide.isPopular && (
            <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
              <TrendingUp className="w-3 h-3" />
              Populaire
            </div>
          )}
        </div>

        {/* Titre */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {guide.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {guide.description}
        </p>

        {/* Footer avec métadonnées */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{guide.readingTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{guide.rating.toFixed(1)}</span>
            </div>
          </div>
          <div
            className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColors(guide.difficulty)}`}
          >
            {guide.difficulty}
          </div>
        </div>
      </div>
    </Link>
  </Reveal>
);

// Composant TopCTA
const TopCTA: React.FC = () => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
    <div className="flex items-start">
      <div className="bg-blue-600 text-white rounded-lg p-3 mr-4 flex-shrink-0">
        <span className="text-2xl">🚀</span>
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-blue-900 mb-2">Défendez vos droits maintenant</h3>
        <p className="text-blue-800 mb-4">
          Générez votre lettre de mise en demeure en 3 minutes. Conforme au Code de la consommation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/eligibilite"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors min-h-[44px] touch-manipulation"
          >
            <FileText className="w-5 h-5 mr-2" />
            Créer ma lettre gratuite
          </Link>
          <Link
            href="/faq"
            className="inline-flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors min-h-[44px] touch-manipulation"
          >
            Voir la FAQ
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  </div>
);

// Helper functions
const getCategoryColors = (color: string, isSelected?: boolean) => {
  const colors = {
    blue: isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700',
    green: isSelected ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700',
    red: isSelected ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700',
    gray: isSelected ? 'bg-gray-600 text-white' : 'bg-gray-50 text-gray-700',
  };
  return colors[color as keyof typeof colors] || colors.gray;
};

const getDifficultyColors = (difficulty: string) => {
  const colors = {
    facile: 'bg-green-50 text-green-700',
    moyen: 'bg-yellow-50 text-yellow-700',
    difficile: 'bg-red-50 text-red-700',
  };
  return colors[difficulty as keyof typeof colors] || colors.facile;
};

// Composant principal
export default function GuidesClientPage() {
  // États
  const [isLoaded, setIsLoaded] = useState(false);
  const [allGuides, setAllGuides] = useState<Guide[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Chargement initial
  useEffect(() => {
    try {
      const guides = getAllGuides();
      const cats = getCategories();
      setAllGuides(guides);
      setCategories(cats);
    } catch (error) {
      console.error('Erreur lors du chargement des guides:', error);
      setAllGuides([]);
      setCategories([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Filtrage avec recherche unifiée
  const filteredGuides = useMemo(() => {
    let filtered = allGuides;

    // Filtrage par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(guide => guide.category.id === selectedCategory);
    }

    // Recherche unifiée avec scoring
    if (searchQuery.trim()) {
      const unifiedFilter = createAdvancedUnifiedSearchFilter(searchQuery, GUIDE_SEARCH_CONFIG);
      filtered = unifiedFilter(filtered);
    } else {
      // Tri normal sans recherche
      filtered = filtered.sort((a, b) => {
        if (a.isPopular && !b.isPopular) return -1;
        if (!a.isPopular && b.isPopular) return 1;
        return (b.rating || 0) - (a.rating || 0);
      });
    }

    return filtered;
  }, [allGuides, selectedCategory, searchQuery]);

  // Handler de recherche
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const breadcrumbItems = [{ label: 'Guides', isCurrentPage: true }];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="px-4 py-6 sm:py-8">
            <Skeleton loading={!isLoaded} className="h-8 w-32 mb-4">
              <Breadcrumbs items={breadcrumbItems} />
            </Skeleton>

            <Skeleton loading={!isLoaded} className="h-16 w-3/4 mb-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                📚 Guides pratiques
              </h1>
            </Skeleton>

            <Skeleton loading={!isLoaded} className="h-12 w-full mb-6">
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                Défendez vos droits de consommateur dans chaque situation.
                <span className="hidden sm:inline">
                  {' '}
                  Guides détaillés, procédures étape par étape et conseils d'experts.
                </span>
              </p>
            </Skeleton>

            {/* Barre de recherche */}
            <Skeleton loading={!isLoaded} className="h-12 w-full">
              <SearchBar
                onSearch={handleSearch}
                placeholder="Rechercher un guide..."
                isLoading={false}
                popularSearches={[
                  'garantie légale conformité',
                  'smartphone défectueux',
                  'électroménager panne',
                  'voiture problème',
                ]}
              />
            </Skeleton>
          </div>
        </Container>
      </div>

      {/* Stats rapides */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="px-4 py-4">
            <Skeleton loading={!isLoaded} className="h-6 w-full">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {allGuides.length} guides disponibles
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  {filteredGuides.length} résultat{filteredGuides.length > 1 ? 's' : ''}
                  {searchQuery && ` pour "${searchQuery}"`}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  100% gratuit
                </div>
              </div>
            </Skeleton>
          </div>
        </Container>
      </div>

      {/* Filtres par catégorie */}
      <div className="bg-white border-b border-gray-200">
        <Container>
          <div className="px-4 py-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900">Filtrer par catégorie</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              <Skeleton loading={!isLoaded} className="h-10 w-36 rounded-xl">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 min-h-[44px] touch-manipulation ${
                    selectedCategory === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📋 Tous les guides ({allGuides.length})
                </button>
              </Skeleton>

              {categories.map(category => (
                <Skeleton key={category.id} loading={!isLoaded} className="h-10 w-36 rounded-xl">
                  <button
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 min-h-[44px] touch-manipulation ${getCategoryColors(
                      category.color,
                      selectedCategory === category.id
                    )}`}
                  >
                    {category.emoji} {category.name} ({category.count})
                  </button>
                </Skeleton>
              ))}
            </div>

            {/* Reset des filtres */}
            {(searchQuery.trim() || selectedCategory !== 'all') && isLoaded && (
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

      {/* Contenu principal */}
      <Container>
        <div className="px-4 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
            {/* CTA principal */}
            <TopCTA />

            {/* Section guides */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <Skeleton loading={!isLoaded} className="h-8 w-48 mb-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {searchQuery.trim()
                        ? 'Résultats de recherche'
                        : selectedCategory !== 'all'
                          ? categories.find(c => c.id === selectedCategory)?.name
                          : 'Tous les guides'}
                    </h2>
                  </Skeleton>
                  <Skeleton loading={!isLoaded} className="h-5 w-64">
                    <p className="text-gray-600">
                      Guides détaillés pour faire valoir vos droits efficacement
                    </p>
                  </Skeleton>
                </div>
              </div>

              {/* Grille des guides */}
              {isLoaded ? (
                filteredGuides.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGuides.map((guide, index) => (
                      <GuideCard key={guide.slug} guide={guide} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun guide trouvé</h3>
                    <p className="text-gray-600 mb-6">
                      Essayez avec d'autres mots-clés ou catégories.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Voir tous les guides
                    </button>
                  </div>
                )
              ) : (
                // Skeletons pour le loading
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-64 rounded-xl" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
