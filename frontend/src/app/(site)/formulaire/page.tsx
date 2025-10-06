// src/app/(site)/formulaire/page.tsx - Version harmonisée
'use client';

import { motion } from 'framer-motion';
import type { Metadata } from 'next';
import React from 'react';

import FormGenerator from '@/components/form/FormGenerator';

const metadata: Metadata = {
  title: 'Créer ma lettre de mise en demeure – Je me défends',
  description:
    'Générez votre lettre personnalisée avec les bons articles du Code de la consommation. Formule gratuite ou premium avec envoi recommandé.',
  keywords: [
    'lettre mise en demeure',
    'générer lettre réclamation',
    'code de la consommation',
    'lettre recommandée',
    'défense consommateur',
  ],
  openGraph: {
    title: 'Créez votre lettre de mise en demeure en 4 étapes',
    description:
      'Formulaire intelligent pour générer une lettre juridiquement fondée avec les bons articles de loi.',
    type: 'website',
    url: 'https://jemedefends.fr/formulaire',
    siteName: 'Je me défends',
    images: [
      {
        url: '/images/og-formulaire.jpg',
        width: 1200,
        height: 630,
        alt: 'Générateur de lettre de mise en demeure',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Générateur de lettre de mise en demeure',
    description: 'Créez votre lettre juridique en 4 étapes simples',
    images: ['/images/twitter-formulaire.jpg'],
  },
  alternates: {
    canonical: 'https://jemedefends.fr/formulaire',
  },
  robots: 'index, follow',
  authors: [{ name: 'Je me défends' }],
};

export default function FormulairePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Formulaire principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <FormGenerator formSlug="mise_en_demeure_v1" />
      </motion.div>
    </div>
  );
}
