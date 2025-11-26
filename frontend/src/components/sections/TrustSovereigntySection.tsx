'use client';

import { Shield, Server, Mail, Lock } from 'lucide-react';
import * as React from 'react';
import Link from 'next/link';

import { Container } from '@/components/ui';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { getContextualIcon } from '@/lib/icon-utils';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

const FAQ_ITEMS = [
  {
    id: 'service-gratuit',
    question: 'Pourquoi ce service est-il gratuit ?',
    answer:
      'Nous proposons un outil gratuit, clair et juridiquement sourcé pour enclencher vos droits sans barrière financière. Les options payantes ajoutent du confort (PDF mis en forme, recommandé en ligne).',
    iconType: 'gratuit',
  },
  {
    id: 'garantie-duree',
    question: 'Combien de temps dure la garantie légale ?',
    answer:
      "La garantie légale de conformité dure <strong>2 ans</strong> pour les biens neufs, <strong>1 an</strong> pour les biens d'occasion achetés auprès d'un professionnel.",
    iconType: 'temps',
  },
  {
    id: 'occasion',
    question: "Les produits d'occasion sont-ils couverts ?",
    answer:
      "Oui, s'ils sont achetés auprès d'un professionnel : garantie légale au moins 1 an. Entre particuliers : pas de garantie légale, mais recours possible pour vices cachés (Code civil).",
    iconType: 'occasion',
  },
];

const TRUST_CARDS = [
  {
    title: 'Hébergé en France',
    icon: <Server className="w-4 h-4 md:w-6 md:h-6 text-green-700" strokeWidth={1.5} />,
    descDesktop: (
      <>
        Infrastructure <strong>Scaleway</strong> (Île-de-France).
      </>
    ),
    wrapClass: 'bg-green-50',
  },
  {
    title: 'Paiement français',
    icon: <Shield className="w-4 h-4 md:w-6 md:h-6 text-blue-700" strokeWidth={1.5} />,
    descDesktop: (
      <>
        Processeur <strong>Stancer</strong>. Sécurité bancaire max.
      </>
    ),
    wrapClass: 'bg-blue-50',
  },
  {
    title: 'Données sécurisées',
    icon: <Lock className="w-4 h-4 md:w-6 md:h-6 text-purple-700" strokeWidth={1.5} />,
    descDesktop: (
      <>
        <strong>Collecte minimale</strong>. Conformité RGPD.
      </>
    ),
    wrapClass: 'bg-purple-50',
  },
  {
    title: 'Support illimité',
    icon: <Mail className="w-4 h-4 md:w-6 md:h-6 text-orange-700" strokeWidth={1.5} />,
    descDesktop: <>Réponse par email pour toute option payante.</>,
    wrapClass: 'bg-orange-50',
  },
];

export default function TrustSovereigntySection() {
  const { isMobile } = useMobileOptimization();

  return (
    <section
      id="fiabilite"
      className="section-scroll-target section-mobile-centered overflow-hidden py-6 md:py-12 lg:py-20 md:h-screen md:flex md:items-center md:justify-center"
    >
      <Container className="relative z-10">
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

        {/* Trust grid shadcn only */}
        <div
          className={`grid gap-3 md:gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'} mb-6 md:mb-12`}
        >
          {TRUST_CARDS.map(c => (
            <Card key={c.title} className="rounded-2xl border border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <div
                  className={`w-9 h-9 md:w-11 md:h-11 rounded-xl flex items-center justify-center ${c.wrapClass}`}
                >
                  {c.icon}
                </div>
                <CardTitle className="text-sm md:text-base font-bold text-gray-900">
                  {c.title}
                </CardTitle>
              </CardHeader>
              {!isMobile && (
                <CardContent className="text-sm text-gray-600">{c.descDesktop}</CardContent>
              )}
            </Card>
          ))}
        </div>

        {isMobile && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 px-2">Questions principales</h3>

            <Accordion type="single" collapsible className="space-y-2">
              {FAQ_ITEMS.map(it => (
                <AccordionItem
                  key={it.id}
                  value={it.id}
                  className="rounded-2xl border border-gray-200 bg-white shadow-sm px-2"
                >
                  <AccordionTrigger className="px-3 py-4 text-left hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="text-blue-600">
                        {getContextualIcon(it.iconType, 'md', 'w-5 h-5 text-blue-600')}
                      </span>
                      <span className="font-semibold text-gray-900">{it.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-3 pb-4 text-sm text-gray-700 leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: it.answer }} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="mt-4 text-center">
              <Button asChild variant="outline" size="sm" className="w-full gap-2">
                <Link href="/faq">Voir toutes les questions</Link>
              </Button>
            </div>
          </div>
        )}

        <div className="text-center hidden md:block">
          <Button asChild size="lg" className="gap-2 min-h-[56px]">
            <Link href="/eligibilite">
              <Shield className="w-5 h-5" strokeWidth={1.5} />
              Commencer en confiance
            </Link>
          </Button>
          <p className="mt-2 md:mt-3 text-xs text-gray-500 text-center">
            Gratuit • 2 minutes • Références légales intégrées
          </p>
        </div>
      </Container>
    </section>
  );
}
