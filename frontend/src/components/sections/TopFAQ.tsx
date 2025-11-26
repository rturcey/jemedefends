'use client';

import * as React from 'react';
import Link from 'next/link';
import { FileQuestion, ShieldCheck, Sparkles, Clock3 } from 'lucide-react';

import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { getContextualIcon } from '@/lib/icon-utils';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
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
      "La garantie légale de conformité dure <strong>2 ans</strong> pour les biens neufs, <strong>2 ans</strong> (la charge de la preuve n'est au vendeur que la première année) pour les biens d'occasion achetés auprès d'un professionnel.",
    iconType: 'temps',
  },
  {
    id: 'donnees',
    question: 'Où sont mes données ?',
    answer:
      'Collecte minimale, hébergement en France (Scaleway), paiements Stancer, envoi Merci Facteur. Transparence totale, aucune revente.',
    iconType: 'france',
  },
  {
    id: 'remboursement',
    question: "Puis-je d'abord demander un remboursement ?",
    answer:
      "La loi impose d'abord la <strong>mise en conformité</strong>. En cas d'échec dans un délai raisonnable : réduction du prix ou remboursement.",
    iconType: 'remboursement',
  },
  {
    id: 'envoi-recommande',
    question: 'Pouvez-vous envoyer la lettre en recommandé ?',
    answer:
      "Oui, avec la formule Premium. La version gratuite et la version PDF ne comprennent pas l'envoi : vous récupérez le document et l'envoyez vous-même.",
    iconType: 'courrier',
  },
];

export default function TopFAQ() {
  const { isMobile } = useMobileOptimization();
  const displayedItems = isMobile ? FAQ_ITEMS.slice(0, 4) : FAQ_ITEMS;

  return (
    <section className="relative py-8 md:py-12 lg:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/40"
      />

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <Badge className="mb-3">FAQ</Badge>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Questions fréquentes
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600">
            Les réponses claires aux questions que l'on nous pose le plus.
          </p>
        </div>

        {/* Content grid desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 lg:gap-8 items-start">
          {/* Accordion */}
          <Accordion type="single" collapsible className="space-y-2">
            {displayedItems.map(it => (
              <AccordionItem
                key={it.id}
                value={it.id}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm px-2"
              >
                <AccordionTrigger className="px-3 py-4 text-left hover:no-underline">
                  <div className="flex items-center gap-3">
                    {/* icône bleue */}
                    <span className="text-blue-600">
                      {getContextualIcon(it.iconType, 'md', 'w-4 h-4 sm:w-5 sm:h-5 text-blue-600')}
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

          {/* Right “trust/cta” desktop only */}
          {!isMobile && (
            <div className="space-y-3">
              <Card className="border border-blue-100 bg-blue-50/70 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    100% sourcé Code conso
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-blue-900/90">
                  Pas d’invention : seulement les articles pertinents, intégrés automatiquement.
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Clock3 className="w-4 h-4 text-blue-700" />3 minutes en moyenne
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  Diagnostic + génération immédiate de ta lettre.
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full gap-2">
                    <Link href="/faq">
                      Voir toute la FAQ
                      <FileQuestion className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>

        {/* CTA mobile */}
        {isMobile && (
          <div className="mt-6 flex justify-center">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/faq">
                Voir toutes les questions
                <FileQuestion className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
