'use client';

import clsx from 'clsx';
import { RefreshCcw, ExternalLink, ShieldCheck, AlertTriangle, Search } from 'lucide-react';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

type StatusItem = {
  id: string;
  label: string;
  url: string | null;
  lastVerified: string | null;
  textLength: number;
  hasText: boolean;
};

type StatusPayload = {
  total: number;
  hydrated: number;
  coverage: number;
  items: StatusItem[];
};

export default function LegalAdminPage() {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [status, setStatus] = useState<StatusPayload | null>(null);
  const [baseline, setBaseline] = useState<Record<string, number> | null>(null);
  const [q, setQ] = useState('');

  const loadStatus = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/legal/status', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = (await res.json()) as StatusPayload;
      setStatus(data);
    } catch (error) {
      console.error('Erreur chargement status:', error);
      // Optionnel: afficher une notification d'erreur à l'utilisateur
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const onRefresh = useCallback(async () => {
    if (!status) return;

    // Sauvegarde baseline pour comparaison
    const before: Record<string, number> = {};
    status.items.forEach(it => {
      before[it.id] = it.textLength;
    });
    setBaseline(before);

    setRefreshing(true);
    try {
      const res = await fetch('/api/legal/refresh', { method: 'POST' });
      if (!res.ok) {
        throw new Error(`Erreur rafraîchissement: HTTP ${res.status}`);
      }
      await loadStatus();
    } catch (error) {
      console.error('Erreur rafraîchissement:', error);
      // Optionnel: notification d'erreur
    } finally {
      setRefreshing(false);
    }
  }, [status, loadStatus]);

  const filtered = useMemo(() => {
    if (!status) return [];
    const s = q.trim().toLowerCase();
    if (!s) return status.items;
    return status.items.filter(
      it => it.id.toLowerCase().includes(s) || it.label.toLowerCase().includes(s),
    );
  }, [status, q]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Administration — Corpus légal</h1>
          <p className="text-sm text-neutral-600">
            Hydrate les textes depuis Légifrance, vérifie la couverture, et compare avant/après.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={refreshing || !status}
            className={clsx(
              'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed',
            )}
            aria-busy={refreshing}
          >
            <RefreshCcw className={clsx('h-4 w-4', refreshing && 'animate-spin')} />
            {refreshing ? 'Rafraîchissement...' : 'Rafraîchir depuis Légifrance'}
          </button>
          <button
            type="button"
            onClick={() => loadStatus()}
            disabled={loading}
            className={clsx(
              'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 disabled:opacity-60 disabled:cursor-not-allowed',
            )}
          >
            {loading ? 'Chargement...' : 'Recharger le statut'}
          </button>
        </div>
      </header>

      <section className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard title="Articles totaux" value={status?.total ?? 0} />
        <StatCard
          title="Articles hydratés"
          value={status?.hydrated ?? 0}
          subtitle={status ? `sur ${status.total}` : undefined}
        />
        <StatCard
          title="Couverture"
          value={`${status?.coverage ?? 0}%`}
          variant={
            status && status.coverage >= 80
              ? 'success'
              : status && status.coverage >= 50
                ? 'warning'
                : 'error'
          }
        />
      </section>

      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Rechercher un article… (ex: L.217-5, CC_1641, médiation…)"
            className="w-full rounded-lg border border-neutral-200 bg-white px-9 py-2 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
          />
          <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        </div>
        <small className="text-neutral-500 whitespace-nowrap">
          {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
        </small>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="hidden grid-cols-12 gap-2 border-b border-neutral-200 bg-neutral-50 px-3 py-2 text-xs font-medium text-neutral-700 sm:grid">
          <div className="col-span-2">Article</div>
          <div className="col-span-5">Libellé</div>
          <div className="col-span-2">Vérifié le</div>
          <div className="col-span-1 text-center">Texte</div>
          <div className="col-span-2 text-right pr-2">Δ Longueur</div>
        </div>

        <ul className="divide-y divide-neutral-200">
          {loading ? (
            <li className="p-4 text-sm text-neutral-500 flex items-center gap-2">
              <RefreshCcw className="h-4 w-4 animate-spin" />
              Chargement du statut...
            </li>
          ) : !status ? (
            <li className="p-4 text-sm text-neutral-500">Aucune donnée disponible</li>
          ) : filtered.length === 0 ? (
            <li className="p-4 text-sm text-neutral-500 text-center">
              {q.trim() ? `Aucun résultat pour "${q.trim()}"` : 'Aucun article trouvé'}
            </li>
          ) : (
            filtered.map(it => {
              const before = baseline?.[it.id] ?? null;
              const after = it.textLength;
              const delta = before !== null ? after - before : null;

              return (
                <li
                  key={it.id}
                  className="px-3 py-3 sm:grid sm:grid-cols-12 sm:items-center sm:gap-2 hover:bg-neutral-50 transition-colors"
                >
                  {/* Article + Status */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center gap-2">
                      {it.hasText ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-md bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-900">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Manquant
                        </span>
                      )}
                      <span className="text-sm font-medium font-mono">{it.id}</span>
                    </div>
                  </div>

                  {/* Label + URL */}
                  <div className="mt-1 text-sm sm:col-span-5 sm:mt-0">
                    <div className="flex items-center gap-2">
                      <span className="truncate">{it.label}</span>
                      {it.url && (
                        <a
                          href={it.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 hover:underline transition-colors"
                          title="Voir sur Légifrance"
                        >
                          Légifrance <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    {/* Mobile info */}
                    <div className="mt-0.5 text-xs text-neutral-500 sm:hidden">
                      {it.lastVerified
                        ? `Vérifié le ${new Date(it.lastVerified).toLocaleDateString('fr-FR')}`
                        : '—'}{' '}
                      •{' '}
                      {it.textLength
                        ? `${it.textLength.toLocaleString('fr-FR')} caractères`
                        : 'Aucun texte'}
                    </div>
                  </div>

                  {/* Last verified (desktop) */}
                  <div className="hidden text-sm text-neutral-700 sm:col-span-2 sm:block">
                    {it.lastVerified
                      ? new Date(it.lastVerified).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                      : '—'}
                  </div>

                  {/* Text length (desktop) */}
                  <div className="hidden text-center text-sm text-neutral-700 sm:col-span-1 sm:block">
                    {it.textLength ? it.textLength.toLocaleString('fr-FR') : '—'}
                  </div>

                  {/* Delta (desktop) */}
                  <div className="hidden text-right text-sm sm:col-span-2 sm:block sm:pr-2">
                    {delta === null ? (
                      <span className="text-neutral-400">—</span>
                    ) : (
                      <Delta value={delta} />
                    )}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </div>

      {/* Footer info */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-neutral-500">
        <p>
          Rappel : seuls les <strong>textes intégraux officiels</strong> doivent être stockés.
          Vérifiez les mises à jour régulièrement.
        </p>
        {status && (
          <p className="text-right">Dernière mise à jour : {new Date().toLocaleString('fr-FR')}</p>
        )}
      </div>
    </main>
  );
}

// Composant StatCard amélioré
function StatCard({
  title,
  value,
  subtitle,
  variant = 'default',
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
}) {
  const variantClasses = {
    default: 'border-neutral-200 bg-white',
    success: 'border-emerald-200 bg-emerald-50',
    warning: 'border-yellow-200 bg-yellow-50',
    error: 'border-red-200 bg-red-50',
  };

  return (
    <div className={clsx('rounded-xl border px-4 py-3 transition-colors', variantClasses[variant])}>
      <div className="text-xs text-neutral-500">{title}</div>
      <div className="text-lg font-semibold flex items-baseline gap-1">
        {value}
        {subtitle && <span className="text-sm font-normal text-neutral-600">{subtitle}</span>}
      </div>
    </div>
  );
}

// Composant Delta amélioré
function Delta({ value }: { value: number }) {
  const positive = value > 0;
  const zero = value === 0;
  const negative = value < 0;

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-end gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
        positive && 'bg-emerald-50 text-emerald-700',
        zero && 'bg-neutral-100 text-neutral-600',
        negative && 'bg-amber-50 text-amber-700',
      )}
      title={positive ? 'Texte enrichi' : zero ? 'Sans changement' : 'Texte réduit'}
    >
      {positive ? '+' : ''}
      {value.toLocaleString('fr-FR')}
    </span>
  );
}
