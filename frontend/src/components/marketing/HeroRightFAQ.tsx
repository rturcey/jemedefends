'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, HelpCircle, CheckCircle, Shield } from 'lucide-react';

import LegalReference from '@/components/ui/LegalReference';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

type FAQItem = { id: string; q: string; a: React.ReactNode };

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'gratuit',
    q: 'Est-ce gratuit ?',
    a: (
      <>
        Oui, vous obtenez <strong>gratuitement</strong> le contenu complet de la lettre avec les{' '}
        <strong>articles pertinents</strong> du Code de la consommation.
      </>
    ),
  },
  {
    id: 'temps',
    q: 'Combien de temps ?',
    a: (
      <>
        Moins de <strong>3 minutes</strong> : diagnostic d'éligibilité puis génération immédiate de
        la lettre.
      </>
    ),
  },
  {
    id: 'base',
    q: 'Base juridique ?',
    a: (
      <>
        Uniquement les <strong>articles pertinents</strong> du Code de la consommation :
        <br />
        <LegalReference code="L.217-3" />
        <br />
        <LegalReference code="L.217-8" />
        <br />
        <LegalReference code="L.217-10" />
        <br />
        Aucune invention, que du droit applicable.
      </>
    ),
  },
];

export default function HeroRightFAQ() {
  const DesktopFAQ = () => (
    <div className="hidden lg:block w-[22rem] max-w-full lg:ml-8 xl:ml-12">
      <Card className="bg-white/70 backdrop-blur-md border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-extrabold tracking-tight">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <HelpCircle className="h-4 w-4" />
            </span>
            FAQ express
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map(it => (
              <AccordionItem key={it.id} value={it.id} className="border-b last:border-b-0">
                <AccordionTrigger className="text-left text-sm font-semibold">
                  {it.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-gray-700">{it.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>

        <CardFooter>
          <Button
            asChild
            variant="ghost"
            size="md"
            className="gap-2"
            data-umami-event="hero-faq-cta"
          >
            <Link href="/eligibilite#start">
              Vérifier mon éligibilité
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-5 space-y-1.5 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span>
            Basé sur le <strong>Code de la consommation</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-600" />
          <span>
            Données minimales & <strong>hébergement 🇫🇷</strong>
          </span>
        </div>
      </div>
    </div>
  );

  const MobileFAQ = () => (
    <div className="lg:hidden w-full mt-8">
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-center flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Questions fréquentes
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map(it => (
              <AccordionItem key={it.id} value={it.id} className="border-b last:border-b-0">
                <AccordionTrigger className="text-left">{it.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-gray-700">{it.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>

        <CardFooter>
          <Button asChild className="w-full gap-2" data-umami-event="hero-mobile-faq-cta">
            <Link href="/eligibilite#start">
              Tester gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <>
      <DesktopFAQ />
      <MobileFAQ />
    </>
  );
}
