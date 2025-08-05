'use client';
import * as React from 'react';
import Script from 'next/script';
import { Section, Container, SectionHeader, Reveal, Button } from '@/components/ui/';
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

/* ────────────────────────────────────────────────────────────
   Données FAQ (longues, SEO + didactique)
   - On flatte le gratuit, on valorise les options payantes comme confort.
   - Ton factuel, aucune promesse de résultat.
   - Tout reste dans le DOM (SEO). Le filtre est purement UX.
   ──────────────────────────────────────────────────────────── */
const FAQ_CATEGORIES = [
  {
    id: 'service',
    label: 'Le service',
    icon: <HelpCircle className="w-4 h-4" />,
    items: [
      {
        q: 'Pourquoi ce service est-il gratuit ?',
        a: `Nous avons constaté qu’il manquait sur internet un outil simple, gratuit et fiable pour rédiger une lettre de mise en demeure fondée sur le Code de la consommation. Beaucoup de sites proposent des modèles trop génériques ou partiels. 
        Nous avons donc voulu soutenir les particuliers en offrant un contenu clair, complet et juridiquement exact, sans contrepartie. 
        La version gratuite suffit à enclencher vos droits. Les formules payantes sont optionnelles et n’ajoutent que du confort (PDF mis en forme, signature en ligne, envoi recommandé automatisé).`,
      },
      {
        q: 'Combien de temps cela prend-il concrètement ?',
        a: `Moins de 3 minutes. Vous répondez à quelques questions simples (date d’achat, produit concerné, type de défaut), et la lettre est générée automatiquement. 
        Vous pouvez ensuite la copier-coller et l’envoyer vous-même. 
        Avec une formule payante, vous gagnez en sérieux et en rapidité : PDF prêt à l’emploi avec logo, ou même envoi en recommandé directement en ligne.`,
      },
      {
        q: 'Pourquoi proposer aussi des versions payantes ?',
        a: `Parce que beaucoup d’utilisateurs souhaitent aller plus loin : un PDF mis en page et signé apporte une image plus professionnelle, et l’envoi recommandé en ligne permet d’éviter les démarches à la Poste. 
        Nous gardons l’accès gratuit car il est essentiel que chacun puisse faire valoir ses droits sans barrière financière, mais nous proposons ces options premium pour celles et ceux qui veulent un parcours encore plus fluide et impactant.`,
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
        a: `Uniquement le Code de la consommation. Pour les biens (produits matériels), nous citons les articles L.217-3 à L.217-14 : obligation de conformité, mise en conformité sans frais (réparation ou remplacement), réduction du prix ou résolution du contrat en cas d’échec. 
        Pour les contenus et services numériques, nous reprenons les articles L.224-25-12 et suivants. 
        Cette transparence est volontaire : nous voulons éviter les approximations ou modèles qui mélangent des textes hors sujet.`,
      },
      {
        q: 'Puis-je demander un remboursement dès le départ ?',
        a: `La loi prévoit d’abord la mise en conformité du bien ou du service. Si le vendeur ne s’exécute pas dans un délai raisonnable, vous pouvez exiger soit une réduction du prix, soit la résolution du contrat (remboursement). 
        La lettre explique ce cadre clairement, ce qui vous évite les maladresses fréquentes dans les réclamations “fait maison”.`,
      },
      {
        q: 'Les produits d’occasion sont-ils couverts ?',
        a: `Oui, lorsqu’ils sont achetés à un professionnel. La garantie légale de conformité s’applique, mais son appréciation tient compte de l’état annoncé et de l’usage attendu. 
        Par exemple, un smartphone reconditionné reste couvert s’il tombe en panne rapidement, alors qu’une usure normale était prévue. La lettre générée sera adaptée à ce cas.`,
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
        a: `L’idéal est le recommandé avec accusé de réception : cela prouve la date, l’envoi et la réception. C’est la meilleure arme juridique. 
        Vous pouvez commencer par un simple e-mail ou courrier, mais si le vendeur conteste ou ignore votre demande, le recommandé fera la différence. 
        Notre formule premium inclut cet envoi, pour ceux qui veulent tout gérer en ligne sans se déplacer.`,
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
        a: `Il arrive que des vendeurs tardent ou ignorent la première mise en demeure. Dans ce cas, vos options sont claires : 
        1) relancer avec un rappel du délai raisonnable (souvent 30 jours) ; 
        2) signaler le problème à la DGCCRF via SignalConso ; 
        3) saisir un conciliateur de justice, gratuit, pour une médiation amiable ; 
        4) envisager une action judiciaire si le montant en jeu est important. 
        Notre rôle s’arrête à la lettre : nous ne représentons pas les consommateurs, mais nous vous donnons les bons outils et les bons liens pour la suite.`,
      },
      {
        q: 'La lettre garantit-elle un résultat ?',
        a: `Non. Une lettre, aussi solide soit-elle, ne contraint pas physiquement le vendeur. 
        Elle formalise vos droits et crée une preuve essentielle en cas de suite (conciliation, justice). 
        C’est pourquoi nous insistons sur le fait que le service n’est pas un conseil juridique individualisé, mais un appui pratique pour enclencher la procédure dans les règles.`,
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
        a: `Nous vous demandons uniquement l’essentiel : vos coordonnées, celles du vendeur, la référence de votre produit ou service, la date d’achat et le problème rencontré. Rien de plus. 
        Ce minimalisme est volontaire : il évite tout risque inutile et respecte vos droits numériques.`,
      },
      {
        q: 'Mes données sont-elles protégées ?',
        a: `Oui. Vos données sont hébergées en France (Scaleway 🇫🇷), ne sont jamais revendues et ne servent qu’à générer votre lettre. 
        Nous avons fait ce choix pour être cohérents avec notre mission : aider les particuliers, pas les exposer.`,
      },
    ],
  },
];

type CatId = (typeof FAQ_CATEGORIES)[number]['id'];

/* JSON-LD global (FAQPage) - agrège toutes les Q/R pour les rich results */
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

/* Accordéon compact premium */
function QA({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl border border-gray-200 bg-white p-3 hover:shadow-sm transition-shadow open:ring-1 open:ring-blue-500/15">
      <summary className="flex items-center justify-between gap-4 cursor-pointer select-none">
        <span className="font-semibold">{q}</span>
        <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-2 text-sm leading-6 text-gray-700 whitespace-pre-line">{a}</div>
    </details>
  );
}

/* Pills catégories - filtre UX seulement (SEO intact) */
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

/* Sidebar sticky (desktop) */
function StickyAside() {
  return (
    <aside className="lg:sticky lg:top-24 lg:self-start">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-extrabold">Et ensuite&nbsp;?</h3>
        <p className="mt-2 text-sm text-gray-700">
          Nous fournissons un **outil** pour enclencher vos droits et créer une **preuve**. Nous ne
          représentons pas les consommateurs, mais on vous aide à garder un dossier **propre**.
        </p>

        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <FileCheck2 className="h-4 w-4 text-blue-700 mt-0.5" />
            <span>Lettre fondée sur le Code de la conso</span>
          </li>
          <li className="flex items-start gap-2">
            <Mail className="h-4 w-4 text-blue-700 mt-0.5" />
            <span>Recommandé conseillé pour la preuve (AR)</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-700 mt-0.5" />
            <span>Gratuit : contenu complet de la lettre</span>
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
          SignalConso, au conciliateur de justice ou à une association de consommateurs.
        </p>
      </div>
    </aside>
  );
}

function FaqSectionSticky({ compact = false }: { compact?: boolean }) {
  const [cat, setCat] = React.useState<CatId | 'all'>('all');
  const jsonLd = React.useMemo(buildJsonLd, []);
  const visible = React.useMemo(() => {
    if (cat === 'all') return FAQ_CATEGORIES;
    return FAQ_CATEGORIES.filter(c => c.id === cat);
  }, [cat]);

  return (
    <Section
      id="faq"
      tone="tinted"
      className={compact ? 'py-8 md:py-10' : undefined} // ↓ padding vertical
    >
      <Container>
        <div className={compact ? 'mb-4' : 'mb-8'}>
          {' '}
          {/* ↓ espace sous header */}
          <SectionHeader
            eyebrow="FAQ"
            title="Questions fréquentes (claires et utiles)"
            description="Comprenez vos droits, l’envoi de la lettre et les suites possibles. Service gratuit par défaut, options premium pour gagner du temps et sécuriser vos preuves."
          />
        </div>

        <div className={['grid lg:grid-cols-3', compact ? 'gap-4' : 'gap-6'].join(' ')}>
          {/* colonne principale */}
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
                    {category.items.map(({ q, a }) => (
                      <QA key={q} q={q} a={a} />
                    ))}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* sidebar */}
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

export default FaqSectionSticky;
