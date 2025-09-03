'use client';

import * as React from 'react';
import Link from 'next/link';
import { Section, Container, Reveal, Badge, Button } from '@/components/ui';
import { Shield, Server, Mail, CreditCard, Sparkles, Lock, FileText } from 'lucide-react';

export default function TrustSovereigntySection() {
  return (
    <section
      id="fiabilite"
      className="bg-gray-50 py-16 sm:py-20 lg:py-24 md:h-[calc(100vh-5rem)] md:flex md:items-center md:justify-center section-scroll-target"
    >
      <Container>
        <Reveal>
          <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
            <Badge tone="green">Confiance & souveraineté</Badge>
            {/* AJOUT : Espace supplémentaire entre Badge et Titre */}
            <div className="h-3"></div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Vos données, notre exigence 🇫🇷
            </h2>
            <p className="text-lg text-slate-600">
              Hébergement, paiements, envois et IA : des partenaires français, collecte minimale et
              transparence, conformément au <strong>RGPD</strong>.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 sm:mb-12">
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
                Données hébergées en France chez <strong>Scaleway</strong>. Pas d'export hors UE
                pour nos traitements applicatifs.
              </p>
              <div className="mt-3">
                <span className="text-sm text-blue-700 font-medium">Souverain & sécurisé</span>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.1}>
            <article className="h-full rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">Paiements 🇫🇷</h3>
              </div>
              <p className="mt-3 text-sm text-gray-700">
                Solution française <strong>Stancer</strong>. Transactions sécurisées et conformes
                RGPD.
              </p>
              <div className="mt-3">
                <span className="text-sm text-green-700 font-medium">100% français</span>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.2}>
            <article className="h-full rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">Envois 🇫🇷</h3>
              </div>
              <p className="mt-3 text-sm text-gray-700">
                Service postal <strong>Merci Facteur</strong>. Suivi et preuve de réception
                garantis.
              </p>
              <div className="mt-3">
                <span className="text-sm text-purple-700 font-medium">Traçable & fiable</span>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.3}>
            <article className="h-full rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900">Support illimité</h3>
              </div>
              <p className="mt-3 text-sm text-gray-700">
                Équipe française dédiée. Contactez-nous à tout moment.
              </p>
              <div className="mt-3">
                <Link
                  href="/contact"
                  className="text-sm text-orange-700 hover:underline font-medium"
                >
                  Nous contacter
                </Link>
              </div>
            </article>
          </Reveal>
        </div>

        <Reveal delay={0.25}>
          <div className="mt-12 sm:mt-16 text-center">
            <Button href="/eligibilite#start" size="lg">
              Commencer en confiance
            </Button>
            <p className="mt-3 text-xs text-gray-500">
              Gratuit • 2 minutes • Références légales intégrées
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
