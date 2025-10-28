#!/usr/bin/env bash
set -euo pipefail

say(){ printf "\n\033[1;34m▸ %s\033[0m\n" "$*"; }
ok(){ printf "\033[1;32m✓ %s\033[0m\n" "$*"; }
warn(){ printf "\033[1;33m! %s\033[0m\n" "$*"; }
err(){ printf "\033[1;31m✗ %s\033[0m\n" "$*"; }

[ -d src/app ] || { err "Lance ce script à la racine (dossier contenant src/)."; exit 1; }

mkdir -p src/components/ui src/components/guides src/components/legal src/constants src/styles

# ---------- 0) util: ensure line in file ----------
ensure_line(){
  # ensure_line "file" "needle" "block_to_append_if_absent"
  local file="$1"; local needle="$2"; local block="$3"
  grep -qF "$needle" "$file" 2>/dev/null || printf "%s\n" "$block" >> "$file"
}

# ---------- 1) AutoBreadcrumbs (corrige items vides) ----------
say "Création AutoBreadcrumbs (breadcrumbs automatiques et lisibles)"
cat > src/components/ui/AutoBreadcrumbs.tsx <<'TSX'
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function titleFromSlug(slug: string) {
  try {
    const s = decodeURIComponent(slug.replace(/\?.*$/, ''));
    return s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  } catch { return slug; }
}

export default function AutoBreadcrumbs({ currentLabel }: { currentLabel?: string }) {
  const pathname = usePathname() || '/';
  const parts = pathname.split('/').filter(Boolean);
  const items = [
    { href: '/', label: 'Accueil' },
    ...parts.map((seg, idx) => {
      const href = '/' + parts.slice(0, idx + 1).join('/');
      const isLast = idx === parts.length - 1;
      const label = isLast && currentLabel
        ? currentLabel
        : (seg.toLowerCase() === 'guides' ? 'Guides' : titleFromSlug(seg));
      return { href, label };
    }),
  ];
  return (
    <nav aria-label="Fil d’Ariane" className="mt-3 text-sm">
      <ol className="flex flex-wrap items-center gap-2 text-slate-600">
        {items.map((it, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={it.href} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true" className="text-slate-400">/</span>}
              {isLast ? (
                <span aria-current="page" className="font-medium text-slate-900">{it.label}</span>
              ) : (
                <Link className="hover:underline underline-offset-2" href={it.href}>{it.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
TSX
ok "AutoBreadcrumbs créé"

# ---------- 2) TOC sticky + auto-détection des titres ----------
say "Création TOC sticky (scrollspy) et auto-headings"
cat > src/components/guides/GuideStickyTOC.tsx <<'TSX'
'use client';
import { useEffect, useState } from 'react';

export type TOCItem = { id: string; title: string; level: number };

export default function GuideStickyTOC({ items }: { items: TOCItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0.1 }
    );
    items.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  if (!items?.length) return null;

  return (
    <nav aria-label="Sommaire" className="text-sm">
      <ul className="space-y-2">
        {items.map(h => (
          <li key={h.id} className={h.level > 2 ? 'ms-3' : ''}>
            <a
              href={`#${h.id}`}
              className={`block rounded px-2 py-1 transition ${active === h.id ? 'bg-blue-50 text-blue-800' : 'hover:bg-slate-50'}`}
            >
              {h.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
TSX

cat > src/components/guides/GuideTOC.tsx <<'TSX'
'use client';
import { useEffect, useMemo, useState } from 'react';
import GuideStickyTOC, { TOCItem } from './GuideStickyTOC';

function slugify(str: string){
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').slice(0,80);
}

export default function GuideTOC(){
  const [items, setItems] = useState<TOCItem[]>([]);
  useEffect(() => {
    const root = document.querySelector('article.prose-guide') || document.body;
    const nodes = root.querySelectorAll('h2, h3');
    const list: TOCItem[] = [];
    nodes.forEach((n: Element) => {
      let id = n.getAttribute('id') || '';
      const level = n.tagName === 'H3' ? 3 : 2;
      if (!id) {
        const text = (n.textContent || '').trim();
        id = slugify(text || 'section');
        // éviter collisions
        let unique = id, i = 2;
        while (document.getElementById(unique)) unique = `${id}-${i++}`;
        n.setAttribute('id', unique);
        id = unique;
      }
      list.push({ id, title: (n.textContent || '').trim(), level });
    });
    setItems(list);
  }, []);
  const memo = useMemo(()=>items, [items]);
  return <GuideStickyTOC items={memo} />;
}
TSX
ok "TOC sticky + auto-headings créés"

# ---------- 3) Styles lisibilité + print + reduced motion ----------
say "Styles globaux (lisibilité, cards soft, print, reduced motion)"
ensure_line "src/styles/globals.css" "/* JMD-GUIDES-REFRESH */" "/* JMD-GUIDES-REFRESH */
:root{ --radius-xl: 1rem; }
html{ font-size:16px; }
body{ line-height:1.6; text-rendering:optimizeLegibility; -webkit-font-smoothing:antialiased; }
.prose-guide h1{font-size:clamp(1.8rem,2vw+1rem,2.4rem);line-height:1.2;}
.prose-guide h2{font-size:clamp(1.4rem,1.2vw+0.9rem,1.8rem);margin-top:2rem;}
.prose-guide h3{font-size:clamp(1.1rem,0.8vw+0.8rem,1.2rem);margin-top:1.25rem;}
.prose-guide p,.prose-guide li{font-size:1rem;}
.prose-guide a{ text-decoration: underline; text-underline-offset: 3px; }
.card-soft{ border:1px solid hsl(220 14% 90%); background:hsl(0 0% 100% / .75); backdrop-filter:blur(2px); border-radius:var(--radius-xl); }
.list-check li{ padding-left:1.6rem; position:relative; }
.list-check li::before{ content:''; position:absolute; left:0; top:.35rem; width:1rem; height:1rem; border-radius:.25rem; background:currentColor; opacity:.1; }
@media (prefers-reduced-motion: reduce){ *{ animation:none !important; transition:none !important; scroll-behavior:auto !important; } }"

cat > src/styles/print.css <<'CSS'
@media print {
  header, nav, footer, .no-print { display:none !important; }
  main { max-width: none !important; }
  a[href]:after { content: " (" attr(href) ")"; font-size: 90%; }
  .prose-guide { color: #000; }
}
CSS
ensure_line "src/styles/globals.css" "@import './print.css';" "@import './print.css';"
ok "Styles appliqués"

# ---------- 4) Tailwind tokens (brand/surface) ----------
if [ -f tailwind.config.js ]; then
  say "Ajout tokens Tailwind brand/surface (si manquants)"
  if ! grep -q "brand: { 600: '#2563EB', 700: '#1D4ED8' }" tailwind.config.js; then
    awk '
      /extend:\s*\{/ && !done { print; print "      colors: { brand: { 600: '#2563EB', 700: '#1D4ED8' }, surface: { soft: '#F8FAFC' } },"; done=1; next }
      { print }
    ' tailwind.config.js > tailwind.config.js.tmp && mv tailwind.config.js.tmp tailwind.config.js
  fi
  ok "Tokens prêts"
else
  warn "tailwind.config.js introuvable, ignoré."
fi

# ---------- 5) Alléger visuel FinalCTASection (si présent) ----------
FINAL="src/components/sections/FinalCTASection.tsx"
if [ -f "$FINAL" ]; then
  say "Allègement décor FinalCTASection"
  # remplace la classe racine par gradient simple
  perl -0777 -pe "s/className=\"relative[^\"]*\"/className=\"relative bg-gradient-to-br from-surface-soft to-white\"/g" -i "$FINAL"
  ok "FinalCTASection allégé"
fi

# ---------- 6) Layout: scroll-smooth + focus-visible ----------
LAYOUT="src/app/layout.tsx"
if [ -f "$LAYOUT" ]; then
  say "Patch layout (scroll-smooth + focus ring)"
  perl -0777 -pe "s/<html(?![^>]*class=)/<html className=\"scroll-smooth\"/;" -i "$LAYOUT"
  perl -0777 -pe "s/<body(?![^>]*class=)/<body className=\"focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600\/50\"/;" -i "$LAYOUT"
  ok "layout patché"
fi

# ---------- 7) Page guides: brancher Breadcrumbs auto + TOC + landmarks ----------
PAGE="src/app/guides/[slug]/page.tsx"
[ -f "$PAGE" ] || { err "Fichier $PAGE introuvable. Vérifie l’arborescence."; exit 1; }

say "Injection imports AutoBreadcrumbs & GuideTOC"
# imports
grep -q 'AutoBreadcrumbs' "$PAGE" || sed -i "1i import AutoBreadcrumbs from '@/components/ui/AutoBreadcrumbs';" "$PAGE"
grep -q 'GuideTOC' "$PAGE" || sed -i "1i import GuideTOC from '@/components/guides/GuideTOC';" "$PAGE"

# remplacer Breadcrumbs existants par AutoBreadcrumbs avec label {guide?.title || title}
perl -0777 -pe "s/<Breadcrumbs[^>]*>.*?<\/Breadcrumbs>/<AutoBreadcrumbs currentLabel={guide?.title || title} \/>/gs" -i "$PAGE"
# si pas de Breadcrumbs dans le fichier, injecter AutoBreadcrumbs après <GuideHero ... />
perl -0777 -pe "s/(<GuideHero[\s\S]*?<\/GuideHero>)/\1\n<AutoBreadcrumbs currentLabel={guide?.title || title} \/>/s" -i "$PAGE" || true
perl -0777 -pe "s/(<GuideHero[^>]*\/>)/\1\n<AutoBreadcrumbs currentLabel={guide?.title || title} \/>/s" -i "$PAGE" || true

# skip-link + main landmarks (id="main")
if ! grep -q 'id="main"' "$PAGE"; then
  # injecter skip link au début du return
  perl -0777 -pe "s/return\s*\(\s*</return (\n  <a href=\"#main\" className=\"sr-only focus:not-sr-only focus:absolute focus:p-2 bg-white shadow\">Aller au contenu<\/a>\n</s" -i "$PAGE"
  # ouvrir <main id="main">
  perl -0777 -pe "s/(<AutoBreadcrumbs[\s\S]*?\/>)/\1\n\n      <main id=\"main\" role=\"main\">/s" -i "$PAGE"
  # fermer </main> juste avant la parenthèse fermante la plus à droite
  perl -0777 -pe "s/\)\s*;\s*$/\n      <\/main>\n);/s" -i "$PAGE"
fi

# injecter grille avec aside TOC si pas présent
if ! grep -q 'GuideTOC' "$PAGE"; then
  perl -0777 -pe "s/<main id=\"main\" role=\"main\">[ \t\r\n]*/<main id=\"main\" role=\"main\">\n  <div className=\"mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-\[260px_1fr\] gap-6\">\n    <aside className=\"sticky top-20 self-start hidden lg:block\" aria-label=\"Sommaire\">\n      <GuideTOC \/>\n    <\/aside>\n    <article className=\"prose-guide\">/s" -i "$PAGE"
  # tenter de localiser la fin du contenu article: on ferme juste avant </main>
  perl -0777 -pe "s/<\/main>/<\/article>\n  <\/div>\n<\/main>/s" -i "$PAGE"
fi
ok "Page guides branchée (breadcrumbs + TOC + landmarks)"

# ---------- 8) JSON-LD (léger) si head présent ----------
HEAD="src/app/guides/[slug]/head.tsx"
if [ -f "$HEAD" ] && ! grep -q 'Article' "$HEAD"; then
  say "Ajout JSON-LD Article minimal"
  cat > "$HEAD" <<'TSX'
export default function Head({ params }: { params: { slug: string } }) {
  const title = 'Guide – Je me défends';
  const desc = 'Guide juridique clair et pratico-pratique.';
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "about": "Droit de la consommation",
    "inLanguage": "fr-FR",
    "author": { "@type":"Organization","name":"Je me défends" },
    "mainEntityOfPage": { "@type":"WebPage","@id": `https://jemedefends.fr/guides/${params.slug}` }
  };
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
TSX
  ok "JSON-LD ajouté"
fi

say "Terminé — build recommandé (npm run build / pnpm build)"
