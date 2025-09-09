'use client';

import type { Metadata } from 'next';
import React from 'react';

import FormGenerator from '@/components/form/FormGenerator';

const metadata: Metadata = {
  title: 'Formulaire – Je me défends',
  description:
    'Complétez le formulaire pour générer votre lettre (mise en demeure, relance) avec les bons articles du Code de la consommation.',
};

export default function FormulairePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 md:py-12">
      {/* FormGenerator est un composant client ("use client") */}
      <FormGenerator formSlug="mise_en_demeure_v1" />
    </main>
  );
}
