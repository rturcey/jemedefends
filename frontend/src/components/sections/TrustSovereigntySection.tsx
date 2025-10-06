'use client';

import { Shield, Server, Mail, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import * as React from 'react';

import { Container, Reveal, Button } from '@/components/ui';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { getContextualIcon } from '@/lib/icon-utils';

// FAQ Items (copiés de TopFAQ)
const FAQ_ITEMS = [
  {
    id: 'service-gratuit',
    question: 'Pourquoi ce service est-il gratuit ?',
    answer:
      'Nous proposons un outil gratuit, clair et juridiquement sourcé pour enclencher vos droits sans barrière financière. Les options payantes ajoutent du confort (PDF mis en forme, recommandé en ligne).',
    category: 'Service',
    iconType: 'gratuit',
  },
  {
    id: 'garantie-duree',
    question: 'Combien de temps dure la garantie légale ?',
    answer:
      "La garantie légale de conformité dure <strong>2 ans</strong> pour les biens neufs, <strong>1 an</strong> pour les biens d'occasion achetés auprès d'un professionnel.",
    category: 'Juridique',
    iconType: 'temps',
  },
  {
    id: 'occasion',
    question: "Les produits d'occasion sont-ils couverts ?",
    answer:
      "Oui, s'ils sont achetés auprès d'un professionnel : garantie légale au moins 1 an. Entre particuliers : pas de garantie légale, mais recours possible pour vices cachés (Code civil).",
    category: 'Juridique',
    iconType: 'occasion',
  },
];

export default function TrustSovereigntySection() {
  const { isMobile } = useMobileOptimization();
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  return (
    <section
      id="fiabilite"
      className="section-scroll-target section-mobile-centered  overflow-hidden py-6 md:py-12 lg:py-20 md:h-screen md:flex md:items-center md:justify-center"
    >
      <Container className="relative z-10">
        <Reveal immediate>
          <div className="max-w-3xl mx-auto text-center mb-6 md:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {isMobile ? 'Vos questions, nos garanties' : 'Vos données, notre exigence 🇫🇷'}
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto">
              {isMobile
                ? 'Sécurité des données, RGPD et réponses aux questions essentielles'
                : 'Hébergement, paiements, envois et IA : des partenaires français, collecte minimale et transparence, conformément au RGPD.'}
            </p>
          </div>
        </Reveal>

        {/* VERSION MOBILE : Sécurité compacte */}
        <div className="md:hidden mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 px-2">Sécurité & conformité</h3>
          <div className="grid grid-cols-2 gap-3">
            <Reveal delay={0.05}>
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                  <Server className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium text-gray-900 leading-tight">
                  Hébergé en France
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium text-gray-900 leading-tight">
                  Paiement français
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.11}>
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium text-gray-900 leading-tight">
                  Données sécurisées
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4" strokeWidth={1.5} />
                </div>
                <span className="text-xs font-medium text-gray-900 leading-tight">Support</span>
              </div>
            </Reveal>
          </div>
        </div>

        {/* VERSION DESKTOP : Cartes complètes avec texte détaillé */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          <Reveal delay={0.1}>
            <article className="h-full rounded-2xl border border-gray-200 bg-white p-4 md:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">
                  <Server className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-sm md:text-base text-gray-900">
                  Hébergement français
                </h3>
              </div>
              <p className="mt-2 md:mt-3 text-xs md:text-sm text-gray-700 leading-relaxed">
                Infrastructure <strong>Scaleway</strong> (Île-de-France). Souveraineté numérique,
                conformité RGPD totale.
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.15}>
            <article className="h-full rounded-2xl border border-gray-200 bg-white p-4 md:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-sm md:text-base text-gray-900">
                  Paiement français
                </h3>
              </div>
              <p className="mt-2 md:mt-3 text-xs md:text-sm text-gray-700 leading-relaxed">
                Processeur <strong>Stancer</strong> (français). Sécurité bancaire maximale, 0%
                commission étrangère.
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.2}>
            <article className="h-full rounded-2xl border border-gray-200 bg-white p-4 md:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-sm md:text-base text-gray-900">
                  Données sécurisées
                </h3>
              </div>
              <p className="mt-2 md:mt-3 text-xs md:text-sm text-gray-700 leading-relaxed">
                <strong>Collecte minimale</strong>. Nous ne conservons aucune donnée après
                génération. Transparence totale.
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.25}>
            <article className="h-full rounded-2xl border border-gray-200 bg-white p-4 md:p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                </div>
                <h3 className="font-semibold text-sm md:text-base text-gray-900">
                  Support illimité
                </h3>
              </div>
              <p className="mt-2 md:mt-3 text-xs md:text-sm text-gray-700 leading-relaxed">
                Notre équipe répond par email pour toute option payante.{' '}
                <strong>Contactez-nous</strong>.
              </p>
            </article>
          </Reveal>
        </div>

        {/* FAQ INTÉGRÉE - MOBILE UNIQUEMENT */}
        {isMobile && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 px-2">Questions principales</h3>

            {/* Grille FAQ avec icônes uniformisées */}
            <div className="space-y-2">
              {FAQ_ITEMS.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.03}>
                  <div className="rounded-xl border border-gray-200 p-3 hover:border-blue-300 hover:shadow-sm transition-all bg-white">
                    <button
                      onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                      className="w-full text-left"
                      aria-expanded={expandedId === item.id}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          {/* ✅ Icône uniformisée au format Problems */}
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
                            {React.cloneElement(getContextualIcon(item.iconType, 'default'), {
                              className: 'w-5 h-5',
                              strokeWidth: 1.5,
                            })}
                          </div>
                          <span className="text-sm font-semibold text-gray-900 leading-snug">
                            {item.question}
                          </span>
                        </div>
                        <div className="flex-shrink-0 mt-2">
                          {expandedId === item.id ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>
                    {expandedId === item.id && (
                      <div
                        className="mt-2 text-xs text-gray-600 leading-relaxed pl-12"
                        dangerouslySetInnerHTML={{ __html: item.answer }}
                      />
                    )}
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Bouton "Voir plus" */}
            <Reveal delay={0.3}>
              <div className="mt-4 text-center">
                <Button href="/faq" variant="outline" size="sm" className="w-full">
                  Voir toutes les questions
                </Button>
              </div>
            </Reveal>
          </div>
        )}

        {/* CTA masqué sur mobile UNIQUEMENT */}
        <Reveal delay={0.3}>
          <div className="text-center hidden md:block">
            <Button
              href="/eligibilite#start"
              size="lg"
              icon={<Shield className="w-5 h-5" strokeWidth={1.5} />}
              className="w-full sm:w-auto min-h-[56px]"
            >
              Commencer en confiance
            </Button>
            <p className="mt-2 md:mt-3 text-xs text-gray-500 text-center">
              Gratuit • 2 minutes • Références légales intégrées
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
