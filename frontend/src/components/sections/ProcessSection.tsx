'use client';

import {HelpCircle, Shield, FileText, Zap} from 'lucide-react';
import * as React from 'react';

import {Container, Reveal, Badge, Button} from '@/components/ui';
import GradientBlobs from '@/components/marketing/GradientBlobs';

const STEPS = [
    {
        icon: <HelpCircle className="w-6 h-6 md:w-8 md:h-8"/>,
        title: 'Test gratuit',
        desc: 'Répondez à quelques questions sur votre achat et le problème rencontré, guidés par des examples et des bases légales.',
        time: '1 min',
    },
    {
        icon: <Shield className="w-6 h-6 md:w-8 md:h-8"/>,
        title: 'Vérification légale',
        desc: 'Notre algorithme vérifie votre éligibilité selon le Code de la consommation.',
        time: 'Instantané',
    },
    {
        icon: <FileText className="w-6 h-6 md:w-8 md:h-8"/>,
        title: 'Lettre personnalisée',
        desc: 'Obtenez votre lettre avec les articles de loi applicables à votre situation.',
        time: '30 sec',
    },
    {
        icon: <Zap className="w-6 h-6 md:w-8 md:h-8"/>,
        title: 'Action immédiate',
        desc: "Imprimez et envoyez votre lettre, ou choisissez notre service d'envoi.",
        time: 'Votre choix',
    },
];

export default function ProcessSection() {
    return (
        <section
            id="process"
            className="section-scroll-target section-mobile-centered relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
            aria-labelledby="process-title"
        >
            {/* Blobs décoratifs */}
            <GradientBlobs/>

            {/* Container avec contenu centré */}
            <Container className="relative z-10">
                <div className="max-w-5xl mx-auto">
                    {/* En-tête */}
                    <div className="text-center mb-8 md:mb-12">
                        <h2
                            id="process-title"
                            className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4"
                        >
                            Simple, rapide, efficace
                        </h2>

                        <p className="text-sm md:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto">
                            En 3 minutes, générez votre lettre de mise en demeure
                            conforme au Code de la
                            consommation.
                        </p>
                    </div>

                    {/* Timeline des étapes */}
                    <div className="relative">
                        {/* Ligne verticale mobile / horizontale desktop */}
                        <div
                            className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-purple-200 md:left-0 md:top-1/2 md:bottom-auto md:w-full md:h-0.5 md:bg-gradient-to-r"
                            aria-hidden="true"
                        />

                        {/* Grid des étapes */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-4">
                            {STEPS.map((step, idx) => (
                                <div key={idx}>
                                    <div className="relative pl-16 md:pl-0 md:pt-16">
                                        {/* Numéro/Icône */}
                                        <div
                                            className="absolute left-0 top-0 md:left-1/2 md:-translate-x-1/2 w-12 h-12 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center text-blue-600 shadow-sm z-10">
                                            {step.icon}
                                        </div>

                                        {/* Contenu */}
                                        <div
                                            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
                                            <div
                                                className="flex items-start justify-between mb-2">
                                                <h3 className="font-semibold text-slate-900 text-sm md:text-base">
                                                    {step.title}
                                                </h3>
                                                <span
                                                    className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                          {step.time}
                        </span>
                                            </div>

                                            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="hidden lg:block text-center mt-8 md:mt-12">
                        <Button
                            href="/eligibilite"
                            size="lg"
                            className="shadow-lg hover:shadow-xl transition-shadow"
                        >
                            Tester mon éligibilité
                        </Button>

                        <p className="text-xs text-slate-500 mt-3">Gratuit • Sans
                            engagement • 3 minutes</p>
                    </div>
                </div>
            </Container>
        </section>
    );
}
