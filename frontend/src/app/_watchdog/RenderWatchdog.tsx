'use client';

import React from 'react';

type Props = {
  children?: React.ReactNode;
  maxRendersPerSecond?: number; // seuil anti-boucle
  maxHeapMB?: number; // seuil mémoire (Chrome only)
};

export default function RenderWatchdog({
  children,
  maxRendersPerSecond = 60, // > 60/s = suspect
  maxHeapMB = 1024, // 1 Go
}: Props) {
  const renders = React.useRef<number[]>([]);
  const [tripped, setTripped] = React.useState(false);

  // Compte le nombre de rendus (pour détecter une boucle)
  renders.current.push(performance.now());
  // Ne garde que la dernière seconde de timestamps
  renders.current = renders.current.filter(t => t > performance.now() - 1000);

  React.useEffect(() => {
    // 1) Fréquence de rendu anormale
    if (renders.current.length > maxRendersPerSecond) {
      console.warn('[Watchdog] Renders/s excessifs:', renders.current.length);
      setTripped(true);
      // On jette une erreur pour basculer sur error boundary
      throw new Error('Watchdog: render storm detected');
    }

    // 2) Mémoire utilisée (Chrome)
    const mem = (performance as any).memory;
    if (mem && typeof mem.usedJSHeapSize === 'number') {
      const usedMB = mem.usedJSHeapSize / (1024 * 1024);
      if (usedMB > maxHeapMB) {
        console.warn('[Watchdog] RAM excessive ~', Math.round(usedMB), 'MB');
        setTripped(true);
        throw new Error('Watchdog: heap limit exceeded');
      }
    }
  });

  // Fallback ultra léger si on préfère ne pas throw
  if (tripped) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-semibold">Rendu suspendu pour préserver la machine</h2>
        <p className="text-sm opacity-70">
          Un comportement anormal a été détecté (boucle ou surconsommation).
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
