'use client';

import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { Container } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { getIconFromName } from '@/lib/icon-utils';

const PROBLEMS = [
  {
    title: 'Smartphone & High-Tech',
    desc: 'Écran fissuré, batterie défaillante, surchauffe... Tous les défauts tech couverts.',
    icon: 'Smartphone',
    href: '/guides/smartphone-ecran-batterie-defaut-garantie-legale',
    legalHint: '2 ans neuf, 1 an occasion',
  },
  {
    title: 'Électroménager',
    desc: 'Panne de lave-linge, four qui ne chauffe plus, frigo défectueux...',
    icon: 'Home',
    href: '/guides/electromenager-garantie-legale',
    legalHint: 'Garantie légale 2 ans',
  },
  {
    title: 'Voiture & Auto',
    desc: 'Problème moteur, défaut électronique, véhicule non conforme...',
    icon: 'Car',
    href: '/guides/voiture-electrique-defaut-garantie-legale',
    legalHint: 'Garantie 2 ans',
  },
  {
    categoryName: 'Textile',
    title: 'Vêtements défaillants',
    desc: 'Décoloration, coutures qui lâchent, matière inadéquate...',
    icon: 'Shirt',
    href: '/guides/vetements-defaillants',
    legalHint: 'Garantie légale 2 ans',
  },
  {
    categoryName: 'Audio/Vidéo',
    title: 'Matériel audio/vidéo',
    desc: 'Son de mauvaise qualité, pannes, dysfonctionnements...',
    icon: 'Headphones',
    href: '/guides/audio-video-defectueux',
    legalHint: 'Garantie légale 2 ans',
  },
  {
    categoryName: 'Informatique',
    title: 'Laptop',
    desc: 'Lenteurs, surchauffe, problèmes logiciels, pannes matérielles récurrentes...',
    icon: 'Informatique',
    href: '/guides/ordinateurs-defectueux',
    legalHint: 'Garantie légale 2 ans',
  },
] as const;

export default function ProblemsSection() {
  return (
    <section
      className="section-scroll-target section-mobile-centered relative overflow-hidden"
      id="problemes"
    >
      <Container>
        <div className="text-center mb-4 md:mb-8 lg:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Votre produit vous pose problème ?
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto">
            Découvrez nos guides spécialisés pour chaque type de produit
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {PROBLEMS.map(p => (
            <Card
              key={p.href}
              className="group rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-start gap-3">
                <div className="mt-0.5 flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-700">
                  {getIconFromName(p.icon, 'lg', 'w-5 h-5')}
                </div>

                <div className="min-w-0">
                  <CardTitle className="text-base font-bold text-gray-900">{p.title}</CardTitle>
                  {p.legalHint && (
                    <div className="mt-1 text-xs text-blue-700 font-medium">{p.legalHint}</div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="text-sm text-gray-600">{p.desc}</CardContent>

              <CardFooter className="pt-0">
                <Link
                  href={p.href}
                  className="w-full inline-flex items-center justify-between text-sm font-medium text-blue-700 hover:text-blue-800"
                >
                  Voir le guide
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="hidden md:flex justify-center mt-8">
          <Button asChild variant="outline">
            <Link href="/guides" className="inline-flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Voir tous les guides
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
