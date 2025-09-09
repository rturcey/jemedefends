// src/lib/cache.ts - Système de cache intelligent
'use client';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T, ttlMs: number = 300000): void {
    // 5 minutes par défaut
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

export const cache = new SimpleCache();

// SessionStorage avec fallback
export const sessionStorage = {
  set: (key: string, value: any): void => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      } else {
        // Fallback vers le cache en mémoire
        cache.set(key, value, 1800000); // 30 minutes
      }
    } catch {
      console.warn('SessionStorage not available, using memory cache');
      cache.set(key, value, 1800000);
    }
  },

  get: (key: string): any => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const item = window.sessionStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } else {
        return cache.get(key);
      }
    } catch {
      return cache.get(key);
    }
  },

  remove: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(key);
      }
      cache.cache.delete(key);
    } catch {
      cache.cache.delete(key);
    }
  },
};
