// src/lib/address.ts
// Helper d'auto-complétion d'adresse basé sur api-adresse.data.gouv.fr

export type AddressSuggestion = {
  label: string;      // "10 Rue ... 75000 Paris"
  line1: string;      // "10 Rue ..."
  postalCode: string; // "75000"
  city: string;       // "Paris"
  countryCode: string; // "FR"
};

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

const ADDRESS_API_URL = 'https://api-adresse.data.gouv.fr/search/';

/**
 * Appelle l'API adresse.gouv et renvoie une liste standardisée
 * pour les composants de formulaire (AddressCombobox, etc.).
 */
export async function SearchAddressApi(query: string): Promise<AddressSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) return [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const url = `${ADDRESS_API_URL}?q=${encodeURIComponent(trimmed)}&limit=6`;

    const res = await fetch(url, {
      signal: controller.signal,
      mode: 'cors',
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.error('Adresse: HTTP error', res.status, res.statusText);
      return [];
    }

    const json = (await res.json()) as AddressSearchResponse;
    const features = json.features ?? [];

    return features.map((f): AddressSuggestion => {
      const p = f.properties ?? {};
      const line1 = `${p.housenumber || ''} ${p.street || ''}`.trim();
      return {
        label: p.label ?? '',
        line1,
        postalCode: p.postcode ?? '',
        city: p.city ?? '',
        countryCode: (p.country_code || 'FR').toUpperCase(),
      };
    });
  } catch (e) {
    console.error('Adresse: échec auto-complétion', e);
    return [];
  }
}

