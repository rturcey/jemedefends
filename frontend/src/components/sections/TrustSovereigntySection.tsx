'use client';

import {Shield, Server, Mail, CreditCard, Lock} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import {Container, Reveal, Badge, Button} from '@/components/ui';
import SectionChevron from '@/components/ui/SectionChevron';

export default function TrustSovereigntySection() {
    return (
        <section
            id="fiabilite"
            className="bg-gray-50 py-10 md:py-16 lg:py-24 md:h-[calc(100vh-5rem)] md:flex md:items-center md:justify-center section-scroll-target relative"
        >
            <Container>
                <Reveal>
                    <div
                        className="max-w-3xl mx-auto text-center mb-8 md:mb-16 lg:mb-20">
                        <Badge tone="green" className="mb-3 md:mb-4">
                            Confiance & souveraineté
                        </Badge>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 md:mb-4">
                            Vos données, notre exigence 🇫🇷
                        </h2>
                        <p className="text-sm md:text-base lg:text-lg text-slate-600 text-center">
                            Hébergement, paiements, envois et IA : des partenaires
                            français, collecte minimale
                            et transparence, conformément au <strong>RGPD</strong>.
                        </p>
                    </div>
                </Reveal>

                <Reveal delay={0.05}>
                    <div
                        className="flex flex-wrap items-center justify-center gap-2 mb-6 md:mb-10 lg:mb-12">
            <span
                className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs md:text-sm text-gray-800 inline-flex items-center gap-2">
              <Lock className="w-3 h-3 md:w-4 md:h-4 text-emerald-600"/> Données minimales
            </span>
                        <span
                            className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs md:text-sm text-gray-800 inline-flex items-center gap-2">
              <Shield className="w-3 h-3 md:w-4 md:h-4 text-emerald-600"/> RGPD & transparence
            </span>
                        <span
                            className="px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs md:text-sm text-gray-800 inline-flex items-center gap-2">
              🇫🇷 Écosystème français
            </span>
                    </div>
                </Reveal>

                <div
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
                    <Reveal>
                        <article
                            className="h-full rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                                    <Server className="w-4 h-4 md:w-5 md:h-5"/>
                                </div>
                                <h3 className="font-semibold text-sm md:text-base text-gray-900">Hébergement
                                    🇫🇷</h3>
                            </div>
                            <p className="mt-2 md:mt-3 text-xs md:text-sm text-gray-700 leading-relaxed">
                                Données hébergées en France
                                chez <strong>Scaleway</strong>. Pas d'export hors UE.
                            </p>
                        </article>
                    </Reveal>

                    <Reveal delay={0.1}>
                        <article
                            className="h-full rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
                                    <CreditCard className="w-4 h-4 md:w-5 md:h-5"/>
                                </div>
                                <h3 className="font-semibold text-sm md:text-base text-gray-900">Paiements
                                    🇫🇷</h3>
                            </div>
                            <p className="mt-2 md:mt-3 text-xs md:text-sm text-gray-700 leading-relaxed">
                                Paiements sécurisés par <strong>Stancer</strong>, 100 %
                                français, conforme PCI-DSS.
                            </p>
                        </article>
                    </Reveal>

                    <Reveal delay={0.15}>
                        <article
                            className="h-full rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-4 h-4 md:w-5 md:h-5"/>
                                </div>
                                <h3 className="font-semibold text-sm md:text-base text-gray-900">Envoi
                                    recommandé 🇫🇷</h3>
                            </div>
                            <p className="mt-2 md:mt-3 text-xs md:text-sm text-gray-700 leading-relaxed">
                                Lettres recommandées via <strong>Merci Facteur</strong>.
                                Service fiable avec suivi.
                            </p>
                        </article>
                    </Reveal>

                    <Reveal delay={0.2}>
                        <article
                            className="h-full rounded-2xl border border-gray-200 bg-white p-4 md:p-6">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-4 h-4 md:w-5 md:h-5"/>
                                </div>
                                <h3 className="font-semibold text-sm md:text-base text-gray-900">Support
                                    illimité</h3>
                            </div>
                            <p className="mt-2 md:mt-3 text-xs md:text-sm text-gray-700 leading-relaxed">
                                Questions ? Notre équipe répond par
                                email. <strong>Contactez-nous</strong>.
                            </p>
                        </article>
                    </Reveal>
                </div>

                <Reveal delay={0.25}>
                    <div className="mt-8 md:mt-12 lg:mt-16 text-center">
                        <Button href="/eligibilite#start" size="lg"
                                icon={<Shield className="w-5 h-5"/>}>
                            Commencer en confiance
                        </Button>
                        <p className="mt-2 md:mt-3 text-xs text-gray-500 text-center">
                            Gratuit • 2 minutes • Références légales intégrées
                        </p>
                    </div>
                </Reveal>
            </Container>

            <SectionChevron targetId="faq"/>
        </section>
    );
}