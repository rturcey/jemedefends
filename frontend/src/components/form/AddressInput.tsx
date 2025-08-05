// src/components/form/AddressInput.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { FormData, ValidationManager } from '@/types/form';

type AddressFeature = {
  properties?: {
    label?: string;
    context?: string;
    housenumber?: string;
    street?: string;
    postcode?: string;
    city?: string;
    country_code?: string; // ex: "fr"
  };
};

type AddressSearchResponse = {
  features?: AddressFeature[];
};

interface AddressInputProps {
  prefix: 'buyer' | 'seller';
  data: FormData;
  onChange: (field: string, value: string) => void;
  validation: ValidationManager | any; // tolérant
  defaultCountry?: string; // ex "FR"
}

const ADDRESS_DEBOUNCE_MS = 200;

const AddressInput: React.FC<AddressInputProps> = ({
  prefix,
  data,
  onChange,
  validation,
  defaultCountry = 'FR',
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<AddressFeature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [manualMode, setManualMode] = useState(false); // ← mobile-first: on commence en auto

  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // clés
  const line1Key = `${prefix}_address_line_1` as keyof FormData;
  const line2Key = `${prefix}_address_line_2` as keyof FormData;
  const postalKey = `${prefix}_postal_code` as keyof FormData;
  const cityKey = `${prefix}_city` as keyof FormData;
  const countryKey = `${prefix}_country` as keyof FormData;

  // Valeurs actuelles
  const line1 = (data[line1Key] as string) || '';
  const line2 = (data[line2Key] as string) || '';
  const postal = (data[postalKey] as string) || '';
  const city = (data[cityKey] as string) || '';
  const country = ((data[countryKey] as string) || defaultCountry).toUpperCase();

  // --- Auto-complétion
  const searchAddresses = async (query: string) => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=6`,
        { signal: controller.signal, mode: 'cors' }
      );
      clearTimeout(timeoutId);
      const json: AddressSearchResponse = await res.json();
      setSuggestions(json.features || []);
      setShowSuggestions(true);
      setActiveIndex(-1);
    } catch (e) {
      console.error('Adresse: échec auto-complétion', e);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const onSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setSearchValue(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchAddresses(v), ADDRESS_DEBOUNCE_MS);
  };

  const selectAddress = (f: AddressFeature) => {
    const p = f.properties || {};
    // Remplit les champs
    const l1 = `${p.housenumber || ''} ${p.street || ''}`.trim();
    onChange(line1Key as string, l1);
    onChange(postalKey as string, p.postcode || '');
    onChange(cityKey as string, p.city || '');
    onChange(countryKey as string, (p.country_code || country || defaultCountry).toUpperCase());

    // Marque l’interaction pour activer la coloration/validation
    validation?.markInteracted?.(line1Key as string);
    validation?.markInteracted?.(postalKey as string);
    validation?.markInteracted?.(cityKey as string);

    // UI
    setSearchValue(p.label || '');
    setShowSuggestions(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) selectAddress(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  // --- Met à jour le champ de recherche si l’utilisateur modifie les sous-champs (manuel)
  useEffect(() => {
    const parts = [line1, line2, `${postal} ${city}`.trim()].filter(Boolean);
    if (manualMode) setSearchValue(parts.join(', '));
  }, [line1, line2, postal, city, manualMode]);

  // --- Clique hors dropdown
  useEffect(() => {
    const onClickOutside = (ev: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(ev.target as Node) &&
        listRef.current &&
        !listRef.current.contains(ev.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // --- États de validité (bordures vertes/orange) : vérifie la présence de valeurs
  const hasAllRequired = line1.trim() && postal.trim() && city.trim();
  const inputStatusClasses = hasAllRequired
    ? 'border-green-500 focus:border-green-500 focus:ring-green-500/30'
    : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600/20';

  return (
    <div className="form-group">
      <label className="block text-sm font-semibold text-gray-900 mb-1">
        {prefix === 'buyer' ? 'Votre adresse' : 'Adresse du vendeur'}
        <span className="text-red-500 ml-1" aria-hidden="true">
          *
        </span>
      </label>

      {/* Champ de recherche (auto) */}
      <div className="relative">
        <input
          ref={searchRef}
          type="text"
          inputMode="text"
          autoComplete="off"
          placeholder="Tapez votre adresse…"
          value={searchValue}
          onChange={onSearchInput}
          onKeyDown={onKeyDown}
          className={[
            'w-full px-4 py-3 rounded-2xl border-2 bg-gray-50/60',
            'text-base md:text-sm transition-all focus:outline-none focus:ring-2',
            inputStatusClasses,
          ].join(' ')}
          aria-controls={`addr-list-${prefix}`}
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
          aria-haspopup="listbox"
        />

        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={listRef}
            id={`addr-list-${prefix}`}
            className="absolute z-50 mt-2 w-full max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-xl"
            role="listbox"
          >
            {suggestions.map((s, i) => {
              const p = s.properties || {};
              const active = i === activeIndex;
              return (
                <div
                  key={`${p.label}-${i}`}
                  role="option"
                  aria-selected={active}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => selectAddress(s)}
                  className={[
                    'px-3 py-2 border-b last:border-b-0 cursor-pointer',
                    active ? 'bg-blue-50' : 'hover:bg-gray-50',
                  ].join(' ')}
                >
                  <div className="text-sm font-medium text-gray-900">{p.label || ''}</div>
                  <div className="text-xs text-gray-500">{p.context || ''}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lien bascule manuel */}
      <div className="mt-2">
        <button
          type="button"
          onClick={() => setManualMode(m => !m)}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors underline-offset-2 hover:underline"
        >
          {manualMode ? 'Utiliser la saisie automatique' : "Entrer l'adresse manuellement"}
        </button>
      </div>

      {/* Champs détaillés - cachés par défaut (mobile-first) */}
      {manualMode && (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={line1}
              onChange={e => onChange(line1Key as string, e.target.value)}
              placeholder="Numéro et rue"
              className="w-full px-4 py-3 rounded-2xl border-2 bg-gray-50/60 text-base md:text-sm border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
            />
            <input
              type="text"
              value={line2}
              onChange={e => onChange(line2Key as string, e.target.value)}
              placeholder="Complément (optionnel)"
              className="w-full px-4 py-3 rounded-2xl border-2 bg-gray-50/60 text-base md:text-sm border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={postal}
              onChange={e => onChange(postalKey as string, e.target.value)}
              placeholder="Code postal"
              maxLength={10}
              className="w-full px-4 py-3 rounded-2xl border-2 bg-gray-50/60 text-base md:text-sm border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
            />
            <input
              type="text"
              value={city}
              onChange={e => onChange(cityKey as string, e.target.value)}
              placeholder="Ville"
              className="w-full px-4 py-3 rounded-2xl border-2 bg-gray-50/60 text-base md:text-sm border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
            />
            <select
              value={country}
              onChange={e => onChange(countryKey as string, e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border-2 bg-gray-50/60 text-base md:text-sm border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 focus:outline-none"
            >
              <option value="FR">France</option>
              <option value="BE">Belgique</option>
              <option value="DE">Allemagne</option>
              <option value="ES">Espagne</option>
              <option value="IT">Italie</option>
              <option value="NL">Pays-Bas</option>
              <option value="LU">Luxembourg</option>
              <option value="CH">Suisse</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        {manualMode
          ? "Vous pouvez passer à l'auto-complétion si vous préférez."
          : 'Sélectionnez votre adresse dans la liste, ou entrez-la manuellement si besoin.'}
      </p>
    </div>
  );
};

export default AddressInput;
