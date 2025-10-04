'use client';

import {HelpCircle, Shield, FileText, Zap, Sparkles} from 'lucide-react';
import * as React from 'react';

import {Section, Container, Reveal, Badge, Button} from '@/components/ui';
import GradientBlobs from '@/components/marketing/GradientBlobs';

const STEPS = [
    {
        icon: <HelpCircle className="w-6 h-6 md:w-8 md:h-8"/>,
        title: 'Test gratuit',
        desc: 'Répondez à quelques questions sur votre achat et le problème rencontré.',
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
        time: 'À vous de voir',
    },
];

const COLORS = [
    {
        ring: 'ring-blue-200',
        bgFrom: 'from-blue-50',
        bgTo: 'to-indigo-50',
        icon: 'text-blue-600',
        dot: 'bg-blue-600',
    },
    {
        ring: 'ring-purple-200',
        bgFrom: 'from-purple-50',
        bgTo: 'to-fuchsia-50',
        icon: 'text-purple-600',
        dot: 'bg-purple-600',
    },
    {
        ring: 'ring-emerald-200',
        bgFrom: 'from-emerald-50',
        bgTo: 'to-teal-50',
        icon: 'text-emerald-600',
        dot: 'bg-emerald-600',
    },
    {
        ring: 'ring-amber-200',
        bgFrom: 'from-amber-50',
        bgTo: 'to-yellow-50',
        icon: 'text-amber-600',
        dot: 'bg-amber-500',
    },
];

export default function ProcessSection() {
    return (
        <Section
            id="process"
            className="relative overflow-hidden py-10 md:py-14 lg:py-20 min-h-screen md:h-screen flex items-center section-scroll-target"
        >
            {/* Fond dégradé identique au Hero */}
            <GradientBlobs/>

            <Container className="relative z-10">
                {/* Header - rendu immédiat sans skeleton */}
                <Reveal delay={0}>
                    <div
                        className="max-w-3xl mx-auto text-center mb-8 md:mb-12 lg:mb-16">
                        <div className="mb-8 md:mb-10 lg:mb-12">
                            <Badge tone="purple">
                                Comment ça marche
                            </Badge>
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 md:mb-6">
                            4 étapes pour obtenir réparation
                        </h2>
                        <p className="text-base md:text-lg text-slate-600 text-center">
                            Un processus simple et rapide pour faire valoir vos droits
                            de consommateur.
                        </p>
                    </div>
                </Reveal>

                {/* Steps grid - 2 colonnes dès le mobile */}
                <div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
                    {STEPS.map((step, i) => {
                        const colors = COLORS[i];
                        return (
                            <Reveal key={step.title} delay={i * 0.05}>
                                <div
                                    className="relative text-center group h-full flex flex-col">
                                    {/* Ligne de connexion (masquée sur mobile et tablette) */}
                                    {i < STEPS.length - 1 && (
                                        <div
                                            className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-200">
                                            <div className={`h-full ${colors.dot}`}
                                                 style={{width: '100%'}}/>
                                        </div>
                                    )}

                                    {/* Icône */}
                                    <div
                                        className={`relative mx-auto w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br ${colors.bgFrom} ${colors.bgTo} flex items-center justify-center mb-3 md:mb-4 lg:mb-6 ring-2 md:ring-4 ${colors.ring} group-hover:ring-4 md:group-hover:ring-8 transition-all duration-300 flex-shrink-0`}
                                    >
                                        <div className={colors.icon}>{step.icon}</div>
                                        <div
                                            className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 bg-slate-900 text-white text-xs md:text-sm font-bold rounded-full flex items-center justify-center">
                                            {i + 1}
                                        </div>
                                    </div>

                                    {/* Contenu */}
                                    <div
                                        className="space-y-1 md:space-y-2 lg:space-y-3 flex-grow flex flex-col">
                                        <div
                                            className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-3 py-0.5 md:py-1 bg-gray-100 rounded-full text-[10px] md:text-xs font-semibold text-gray-600 mx-auto">
                                            <div
                                                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${colors.dot}`}/>
                                            {step.time}
                                        </div>
                                        <h3 className="font-bold text-sm md:text-lg lg:text-xl text-slate-900 px-1">
                                            {step.title}
                                        </h3>
                                        <p className="text-[11px] md:text-sm lg:text-base text-slate-600 leading-snug md:leading-relaxed px-1 md:px-2">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>

                {/* CTA masqué sur mobile UNIQUEMENT */}
                <Reveal delay={0.2}>
                    <div className="text-center mt-6 md:mt-12 lg:mt-16 hidden md:block">
                        <Button href="/eligibilite#start" size="lg" icon={<Sparkles/>}>
                            Tester gratuitement mes droits
                        </Button>
                        <p className="text-xs md:text-sm text-slate-500 mt-3 text-center">
                            Gratuit • 2 minutes • Résultat immédiat
                        </p>
                    </div>
                </Reveal>
            </Container>
        </Section>
    );
}