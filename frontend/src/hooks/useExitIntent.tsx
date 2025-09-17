// src/hooks/useExitIntent.ts - Hook pour détecter l'intention de sortie
'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseExitIntentOptions {
  enabled?: boolean;
  delay?: number;
  threshold?: number;
  onExitIntent?: () => void;
}

interface UseExitIntentReturn {
  showExitIntent: boolean;
  triggerExitIntent: () => void;
  resetExitIntent: () => void;
}

/**
 * Hook pour détecter l'intention de quitter la page
 * Détecte les mouvements de souris vers le haut de l'écran
 */
export function useExitIntent(options: UseExitIntentOptions = {}): UseExitIntentReturn {
  const { enabled = true, delay = 1000, threshold = 50, onExitIntent } = options;

  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  const triggerExitIntent = useCallback(() => {
    if (!hasTriggered && enabled) {
      setShowExitIntent(true);
      setHasTriggered(true);
      onExitIntent?.();
    }
  }, [hasTriggered, enabled, onExitIntent]);

  const resetExitIntent = useCallback(() => {
    setShowExitIntent(false);
    setHasTriggered(false);
  }, []);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') {
      return;
    }

    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = (e: MouseEvent) => {
      // Détecter si la souris sort vers le haut
      if (e.clientY <= threshold && e.movementY < 0) {
        triggerExitIntent();
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      // Détecter si la souris quitte complètement la fenêtre vers le haut
      if (e.clientY <= 0) {
        triggerExitIntent();
      }
    };

    // Délai avant d'activer la détection (éviter les faux positifs)
    timeoutId = setTimeout(() => {
      document.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled, delay, threshold, triggerExitIntent]);

  return {
    showExitIntent,
    triggerExitIntent,
    resetExitIntent,
  };
}
