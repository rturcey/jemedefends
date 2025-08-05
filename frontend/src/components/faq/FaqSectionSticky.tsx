// src/components/faq/FaqSectionSticky.tsx
'use client';
import * as React from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { Section, Container, SectionHeader, Reveal, Button } from '@/components/ui';
import {
  ArrowRight,
  HelpCircle,
  Shield,
  FileText,
  FileWarning,
  Lock,
  Info,
  ChevronDown,
  CheckCircle2,
  Mail,
  FileCheck2,
  Sparkles,
} from 'lucide-react';

/** ----------------------------------------------------------------
 * Recommandations intégrées :
 * - FAQ courte par item + lien d’approfondissement vers les GUIDES (deeplink #ancre)
 * - Filtre client uniquement (SEO : tout reste dans le DOM)
 * - JSON-LD optionnel (emitSchema=true UNIQUEMENT sur /faq)
 * ---------------------------------------------------------------- */
type FaqItem = { q: string; a: string; href?: string };
type FaqCat = { id: string; label: string; icon: React.ReactNode; items: FaqItem[] };

const FAQ_CATEGORIES: FaqCat[] = [
  {
    id: 'service',
    label: 'Le service',
    icon: <HelpCircle className="w-4 h-4" />,
    items: [
      {
        q: 'Pourquoi ce service est-il gratuit ?',
        a: `Nous proposons un outil gratuit, clair et juridiquement exact pour enclencher vos droits sans barrière financière. Les options payantes ajoutent du confort (PDF mis en forme, signature, recommandé en ligne).`,
        href: '/guides/faire-jouer-garantie#etapes',
      },
      {
        q: 'Combien de temps cela prend-il concrètement ?',
        a: `Moins de 3 minutes. Vous répondez à quelques questions et la lettre est générée. Les options premium accélèrent et professionnalisent l’envoi.`,
        href: '/guides/faire-jouer-garantie#modele',
      },
      {
        q: 'Pourquoi proposer aussi des versions payantes ?',
        a: `Un PDF signé + recommandé en ligne apportent sérieux, traçabilité et gain de temps. Le contenu gratuit reste suffisant pour faire valoir vos droits.`,
        href: '/guides/faire-jouer-garantie',
      },
    ],
  },
  {
    id: 'droits',
    label: 'Vos droits',
    icon: <Shield className="w-4 h-4" />,
    items: [
      {
        q: 'Quels articles de loi sont utilisés ?',
        a: `Biens : L.217-3 s. (mise en conformité, réduction, résolution). Numérique : L.224-25-12 s. Transparence totale : pas de textes hors sujet.`,
        href: '/guides/garantie-legale-conformite#def',
      },
      {
        q: 'Puis-je demander un remboursement dès le départ ?',
        a: `La loi impose d’abord la mise en conformité. À défaut dans un délai raisonnable : réduction du prix ou résolution (remboursement).`,
        href: '/guides/garantie-legale-conformite#recours',
      },
      {
        q: 'Les produits d’occasion sont-ils couverts ?',
        a: `Oui s’ils sont achetés à un professionnel (appréciation selon l’état annoncé). Entre particuliers : pas de GLC (voie des vices cachés).`,
        href: '/guides/garantie-legale-conformite#confusions',
      },
    ],
  },
  {
    id: 'envoi',
    label: 'Envoi',
    icon: <FileText className="w-4 h-4" />,
    items: [
      {
        q: 'Dois-je envoyer ma lettre en recommandé ?',
        a: `Le recommandé AR est idéal pour la preuve (date/envoi/réception). Un simple e-mail/courrier peut suffire au départ, mais le recommandé tranche en cas de contestation.`,
        href: '/guides/faire-jouer-garantie#etapes',
      },
    ],
  },
  {
    id: 'apres',
    label: 'Après la lettre',
    icon: <FileWarning className="w-4 h-4" />,
    items: [
      {
        q: 'Que se passe-t-il si le vendeur ne répond pas ?',
        a: `Relance écrite → SignalConso → conciliateur (gratuit) → judiciaire si nécessaire. La lettre crée une preuve essentielle pour la suite.`,
        href: '/guides/refus-vendeur-que-faire',
      },
      {
        q: 'La lettre garantit-elle un résultat ?',
        a: `Non : elle formalise vos droits et votre demande. C’est une étape clé avant conciliation ou action. Pas de promesse de résultat.`,
        href: '/guides/refus-vendeur-que-faire#amiable',
      },
    ],
  },
  {
    id: 'donnees',
    label: 'Données & sécurité',
    icon: <Lock className="w-4 h-4" />,
    items: [
      {
        q: 'Quelles données personnelles sont nécessaires ?',
        a: `Uniquement l’essentiel : vos coordonnées, celles du vendeur, la date d’achat et le problème. Minimalisme = moindre risque.`,
      },
      {
        q: 'Mes données sont-elles protégées ?',
        a: `Hébergement en France (Scaleway 🇫🇷), aucune revente, usage strictement limité à la génération de la lettre.`,
      },
    ],
  },
];

type CatId = (typeof FAQ_CATEGORIES)[number]['id'];

function buildJsonLd() {
  const all = FAQ_CATEGORIES.flatMap(c => c.items);
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: all.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

function QA({ q, a, href }: FaqItem) {
  return (
    <details className="group rounded-xl border border-gray-200 bg-white p-3 hover:shadow-sm transition-shadow open:ring-1 open:ring-blue-500/15">
      <summary className="flex items-center justify-between gap-4 cursor-pointer select-none">
        <span className="font-semibold">{q}</span>
        <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-2 text-sm leading-6 text-gray-700">
        {a}
        {href && (
          <div className="mt-2">
            <Link href={href} className="text-blue-600 hover:underline">
              👉 Approfondir dans le guide
            </Link>
          </div>
        )}
      </div>
    </details>
  );
}

function CategoryBar({
  current,
  onChange,
}: {
  current: CatId | 'all';
  onChange: (id: CatId | 'all') => void;
}) {
  const cats = [{ id: 'all', label: 'Tout', icon: <Info className="w-4 h-4" /> } as const].concat(
    FAQ_CATEGORIES.map(({ id, label, icon }) => ({ id, label, icon }))
  );
  return (
    <div className="flex flex-wrap items-center gap-2">
      {cats.map(({ id, label, icon }) => {
        const active = current === (id as any);
        return (
          <button
            key={String(id)}
            onClick={() => onChange(id as any)}
            className={[
              'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm',
              active
                ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50',
            ].join(' ')}
          >
            {icon}
            {label}
          </button>
        );
      })}
    </div>
  );
}

function StickyAside() {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-extrabold">Et ensuite&nbsp;?</h3>
        <p className="mt-2 text-sm text-gray-700">
          Nous fournissons un <strong>outil</strong> pour enclencher vos droits et créer une{' '}
          <strong>preuve</strong>. Nous ne représentons pas les consommateurs, mais on vous aide à
          garder un dossier <strong>propre</strong>.
        </p>

        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <FileCheck2 className="h-4 w-4 text-blue-700 mt-0.5" />
            <span>Lettre fondée sur le Code de la conso</span>
          </li>
          <li className="flex items-start gap-2">
            <Mail className="h-4 w-4 text-blue-700 mt-0.5" />
            <span>Recommandé conseillé (AR)</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-700 mt-0.5" />
            <span>Gratuit : contenu complet</span>
          </li>
        </ul>

        <div className="mt-4 grid gap-2">
          <Button href="/eligibilite" icon={<ArrowRight className="w-4 h-4" />}>
            Générer ma lettre gratuitement
          </Button>
          <Button href="/eligibilite" variant="secondary" icon={<Sparkles className="w-4 h-4" />}>
            Voir les options premium
          </Button>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Transparence&nbsp;: pas de promesse de résultat. Si le litige persiste, pensez à
          SignalConso, au conciliateur de justice ou à une association.
        </p>
      </div>
    </aside>
  );
}

export default function FaqSectionSticky({
  compact = false,
  emitSchema = false, // IMPORTANT : true UNIQUEMENT sur /faq (rich results)
}: {
  compact?: boolean;
  emitSchema?: boolean;
}) {
  const [cat, setCat] = React.useState<CatId | 'all'>('all');
  const jsonLd = React.useMemo(buildJsonLd, []);

  const visible = React.useMemo(() => {
    if (cat === 'all') return FAQ_CATEGORIES;
    return FAQ_CATEGORIES.filter(c => c.id === cat);
  }, [cat]);

  return (
    <Section id="faq" tone="tinted" className={compact ? 'py-8 md:py-10' : undefined}>
      {emitSchema && (
        <Script
          id="faq-jsonld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Container>
        <div className={compact ? 'mb-4' : 'mb-8'}>
          <SectionHeader
            eyebrow="FAQ"
            title="Questions fréquentes (claires et utiles)"
            description="Comprenez vos droits, l’envoi de la lettre et les suites possibles. Service gratuit par défaut, options premium pour gagner du temps et sécuriser vos preuves."
          />
        </div>

        <div className={['grid lg:grid-cols-3', compact ? 'gap-4' : 'gap-6'].join(' ')}>
          <div className="lg:col-span-2">
            <div className={compact ? 'mb-4' : 'mb-6'}>
              <CategoryBar current={cat} onChange={setCat} />
            </div>

            <Reveal>
              <div
                className={[
                  'grid grid-cols-1 md:grid-cols-2',
                  compact ? 'gap-3 lg:gap-4' : 'gap-4 lg:gap-5',
                ].join(' ')}
              >
                {visible.map(category => (
                  <div key={category.id} className="space-y-3">
                    {cat !== 'all' && (
                      <h3 className="text-sm font-bold uppercase tracking-wide text-gray-600">
                        {category.label}
                      </h3>
                    )}
                    {category.items.map(({ q, a, href }) => (
                      <QA key={q} q={q} a={a} href={href} />
                    ))}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-1">
            <div className={compact ? 'lg:sticky lg:top-20' : 'lg:sticky lg:top-24'}>
              <StickyAside />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
