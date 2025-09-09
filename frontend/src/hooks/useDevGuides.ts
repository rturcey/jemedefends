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
      }
    } catch (error) {
      console.error('Erreur chargement overrides:', error);
      setOverrides([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteOverride = useCallback(
    async (slug: string): Promise<boolean> => {
      try {
        const response = await fetch(`/api/dev/guides/${slug}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchOverrides(); // Refresh la liste
          return true;
        }
      } catch (error) {
        console.error('Erreur suppression override:', error);
      }
      return false;
    },
    [fetchOverrides],
  );

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
