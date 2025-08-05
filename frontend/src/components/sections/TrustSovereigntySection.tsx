// src/components/sections/TrustSovereigntySection.tsx
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Section, Container, Reveal, Badge, Button } from '@/components/ui';
import { Shield, Server, Mail, CreditCard, Sparkles, Lock, FileText } from 'lucide-react';

export default function TrustSovereigntySection() {
  return (
    <Section
      id="fiabilite"
      className="scroll-mt-24 bg-gray-50 py-14 sm:py-16 lg:py-20 lg:min-h-screen flex items-center"
    >
      <Container>
        <Reveal>
          <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
            <Badge tone="green" className="mb-5 sm:mb-6">
              Confiance & souveraineté
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Vos données, notre exigence 🇫🇷
            </h2>
            <p className="text-lg text-slate-600">
              Hébergement, paiements, envois et IA : des partenaires français, collecte minimale et
              transparence, conformément au <strong>RGPD</strong>.
            </p>
          </div>
        </Reveal>

        {/* Points clés (chips) */}
        <Reveal delay={0.05}>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
            <span className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-800 inline-flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" /> Données minimales
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-800 inline-flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" /> RGPD & transparence
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-800 inline-flex items-center gap-2">
              🇫🇷 Écosystème français
            </span>
          </div>
        </Reveal>

        {/* Cartes partenaires */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <Reveal>
            <article className="h-full rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Server className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">Hébergement 🇫🇷</h3>
              </div>
              <p className="mt-3 text-sm text-gray-700">
                Données hébergées en France chez <strong>Scaleway</strong>. Pas d’export hors UE
                pour nos traitements applicatifs.
              </p>
              <div className="mt-3">
                <Badge tone="blue">Scaleway</Badge>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.05}>
            <article className="h-full rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">Paiements 🇫🇷</h3>
              </div>
              <p className="mt-3 text-sm text-gray-700">
                Encaissement via <strong>Stancer</strong> (France). Aucun stockage local des données
                de carte.
              </p>
              <div className="mt-3">
                <Badge tone="emerald">Stancer</Badge>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.1}>
            <article className="h-full rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">Courriers 🇫🇷</h3>
              </div>
              <p className="mt-3 text-sm text-gray-700">
                Recommandés avec suivi opérés par <strong>Merci Facteur</strong> dans nos formules
                payantes.
              </p>
              <div className="mt-3">
                <Badge tone="amber">Merci Facteur</Badge>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.15}>
            <article className="h-full rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">IA 🇫🇷</h3>
              </div>
              <p className="mt-3 text-sm text-gray-700">
                Assistance par <strong>Mistral&nbsp;AI</strong> intégrée à notre logique métier. Les
                références juridiques restent strictement <em>cadrées</em> et vérifiées.
              </p>
              <div className="mt-3">
                <Badge tone="purple">Mistral AI</Badge>
              </div>
            </article>
          </Reveal>
        </div>

        {/* Bloc conformité / liens légaux */}
        <Reveal delay={0.2}>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" /> RGPD : minimal et transparent
              </h4>
              <p className="mt-2 text-sm text-gray-700">
                Nous collectons uniquement les données indispensables pour générer votre courrier.
                Pas de revente, pas de profilage marketing.
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" /> Documentation claire
              </h4>
              <p className="mt-2 text-sm text-gray-700">
                Retrouvez nos engagements dans la <strong>politique de confidentialité</strong> et
                les
                <strong> mentions légales</strong>.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/politique-de-confidentialite"
                  className="text-sm text-blue-700 hover:underline"
                >
                  Politique de confidentialité
                </Link>
                <span className="text-gray-300">•</span>
                <Link href="/mentions-legales" className="text-sm text-blue-700 hover:underline">
                  Mentions légales
                </Link>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-600" /> Contrôlez vos données
              </h4>
              <p className="mt-2 text-sm text-gray-700">
                Droit d’accès, de rectification et d’effacement. Contactez-nous à tout moment.
              </p>
              <div className="mt-3">
                <Link href="/contact" className="text-sm text-blue-700 hover:underline">
                  Nous contacter
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        {/* CTA discret */}
        <Reveal delay={0.25}>
          <div className="mt-8 text-center">
            <Button href="/eligibilite#start" size="lg">
              Commencer en confiance
            </Button>
            <p className="mt-3 text-xs text-gray-500">
              Gratuit • 2 minutes • Références légales intégrées
            </p>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
