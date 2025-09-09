'use client';

import { Search, X, TrendingUp } from 'lucide-react';
import React, { useState, useCallback, useRef, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
  suggestions?: string[];
  popularSearches?: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Rechercher dans les guides...',
  className = '',
  isLoading = false,
  suggestions = [],
  popularSearches = [
    'garantie légale conformité',
    'remboursement',
    'réparation',
    'délai de rétractation',
  ],
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchHistoryRef = useRef<string[]>([]);

  // Debounce search avec useCallback pour performance
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchQuery: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onSearch(searchQuery);

          // Ajouter à l'historique si pas vide
          if (searchQuery.trim() && !searchHistoryRef.current.includes(searchQuery)) {
            searchHistoryRef.current = [searchQuery, ...searchHistoryRef.current.slice(0, 4)];
          }
        }, 300);
      };
    })(),
    [onSearch],
  );

  // Effet de recherche
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Délai pour permettre le clic sur suggestions
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
    }, 150);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Barre de recherche principale */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search
            className={`w-5 h-5 ${isFocused ? 'text-blue-500' : 'text-gray-400'} transition-colors`}
          />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-12 py-3 sm:py-3.5
            bg-white border-2 rounded-xl
            text-base placeholder-gray-500
            min-h-[44px] touch-manipulation
            transition-all duration-200
            ${
              isFocused
                ? 'border-blue-500 shadow-lg shadow-blue-500/10'
                : 'border-gray-200 hover:border-gray-300'
            }
            ${isLoading ? 'opacity-75' : ''}
          `}
          disabled={isLoading}
        />

        {/* Bouton clear */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {query && (
            <button
              onClick={clearSearch}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
              aria-label="Effacer la recherche"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
          {/* Recherches populaires */}
          <div className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Recherches populaires
              </span>
            </div>
            {popularSearches.map((popular, index) => (
              <button
                key={`popular-${index}`}
                onClick={() => handleSuggestionClick(popular)}
                className="block w-full text-left px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {popular}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600">Recherche...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
