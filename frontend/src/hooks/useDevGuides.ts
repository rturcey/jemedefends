'use client';

import { useState, useEffect, useCallback } from 'react';

interface DevOverride {
  slug: string;
  lastModified: string;
  hasOriginalBackup: boolean;
}

interface UseDevGuidesReturn {
  overrides: DevOverride[];
  isLoading: boolean;
  refreshOverrides: () => Promise<void>;
  deleteOverride: (slug: string) => Promise<boolean>;
}

export function useDevGuides(): UseDevGuidesReturn {
  const [overrides, setOverrides] = useState<DevOverride[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // FIX: Fonction stable sans dépendances qui changent
  const fetchOverrides = useCallback(async () => {
    if (process.env.NODE_ENV !== 'development') {
      setOverrides([]);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/dev/guides');
      if (response.ok) {
        const data = await response.json();
        setOverrides(data.overrides || []);
      } else {
        setOverrides([]);
      }
    } catch (error) {
      console.error('Erreur chargement overrides:', error);
      setOverrides([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // FIX: Pas de dépendances

  // FIX: deleteOverride sans dépendance circulaire
  const deleteOverride = useCallback(async (slug: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/dev/guides/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // FIX: Mise à jour directe du state au lieu de refetch
        setOverrides(prev => prev.filter(override => override.slug !== slug));
        return true;
      }
    } catch (error) {
      console.error('Erreur suppression override:', error);
    }
    return false;
  }, []); // FIX: Pas de dépendance sur fetchOverrides

  // FIX: Effet une seule fois
  useEffect(() => {
    fetchOverrides();
  }, [fetchOverrides]);

  return {
    overrides,
    isLoading,
    refreshOverrides: fetchOverrides,
    deleteOverride,
  };
}
