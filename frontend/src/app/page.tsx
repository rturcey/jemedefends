'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, ArrowRight, Clock, Shield, Star, Mail, MapPin, Zap, TrendingUp, ChevronDown, FileText, Scale, Timer, PlayCircle, Sparkles, BookOpen } from 'lucide-react'

export default function HomePage() {
    const [isVisible, setIsVisible] = useState(false)
    const [currentTestimonial, setCurrentTestimonial] = useState(0)

    useEffect(() => {
        setIsVisible(true)
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % 3)
        }, 5500)
        return () => clearInterval(interval)
    }, [])

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="bg-white text-gray-900">
            {/* NAVIGATION claire et lisible */}
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur border-b border-gray-200 z-50 h-20">
                <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img
                            src="/images/logo_jemedefends.svg"
                            alt="Je me défends – Mes droits, simplement"
                            className="h-12 w-auto"
                            width="160"
                            height="48"
                        />
                    </div>
                    <div className="hidden md:flex gap-6 items-center font-medium">
                        <button onClick={() => scrollToSection('process')} className="hover:text-blue-700">Fonctionnement</button>
                        <button onClick={() => scrollToSection('benefits')} className="hover:text-blue-700">Avantages</button>
                        <button onClick={() => scrollToSection('references')} className="hover:text-blue-700">Références légales</button>
                        <button onClick={() => scrollToSection('testimonials')} className="hover:text-blue-700">Témoignages</button>
                        <button onClick={() => scrollToSection('faq')} className="hover:text-blue-700">FAQ</button>
                        <button onClick={() => scrollToSection('cta')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Commencer
                        </button>
                    </div>
                </div>
            </nav>

            {/* HERO clair + riche (UX/UI/Marketing) */}
            <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
                {/* fond décoratif doux */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -left-16 w-[28rem] h-[28rem] bg-blue-200/40 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -right-24 w-[32rem] h-[32rem] bg-indigo-200/40 rounded-full blur-3xl" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-white/60 to-blue-50" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-10 w-full">
                    {/* Colonne texte */}
                    <div className="lg:col-span-7 flex flex-col justify-center">
                        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            {/* badges confiance */}
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="inline-flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full"><CheckCircle className="w-4 h-4" /> Conforme au Code de la consommation</span>
                                <span className="inline-flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full"><Clock className="w-4 h-4" /> 3 minutes maximum</span>
                                <span className="inline-flex items-center gap-2 text-sm text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">Contenu gratuit</span>
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-4 tracking-tight">
                                Obtenez réparation
                                <span className="block bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">en 3 minutes chrono</span>
                            </h1>

                            <p className="text-lg lg:text-xl text-gray-700 mb-8 max-w-2xl">
                                <strong>Panne, défaut, produit non conforme ?</strong> Obtenez gratuitement le <em>contenu de votre lettre</em> de mise en demeure. Réparation, remplacement ou remboursement garantis par la loi.
                            </p>

                            {/* points clés pour conversion */}
                            <ul className="grid sm:grid-cols-3 gap-3 mb-8">
                                {[
                                    {label: 'Garantie légale obligatoire', icon: Shield},
                                    {label: 'Lettre prête à envoyer', icon: FileText},
                                    {label: 'Service gratuit', icon: Sparkles},
                                ].map((it, i) => (
                                    <li key={i} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3">
                                        <it.icon className="w-5 h-5 text-blue-700" />
                                        <span className="text-sm font-semibold text-gray-800">{it.label}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA – stack sûr sans chevauchement */}
                            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 items-stretch sm:items-center">
                                <button onClick={() => scrollToSection('cta')} className="w-full sm:w-auto bg-blue-600 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all hover:scale-105 shadow-lg">
                                    <Zap className="w-5 h-5" /> Tester gratuitement mes droits
                                </button>
                                <button onClick={() => scrollToSection('process')} className="w-full sm:w-auto border border-gray-300 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 flex items-center justify-center gap-2">
                                    <PlayCircle className="w-5 h-5" /> Comment ça marche
                                </button>
                            </div>

                            {/* preuve sociale condensée */}
                            <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-gray-600">
                                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Service vérifié</div>
                                <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-blue-700" /> Base juridique solide</div>
                            </div>
                        </div>
                    </div>

                    {/* Colonne illustration (remplissage visuel du hero) */}
                    <div className="lg:col-span-5 relative">
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 sticky top-24">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center"><FileText className="w-5 h-5 text-white" /></div>
                                <div>
                                    <div className="font-bold">Aperçu de la lettre</div>
                                    <div className="text-xs text-gray-500">PDF prêt à envoyer</div>
                                </div>
                            </div>
                            <div className="border border-dashed border-gray-300 rounded-xl p-4 text-left text-sm text-gray-700 bg-gray-50">
                                <p className="font-semibold">Objet : Mise en demeure – Garantie légale de conformité</p>
                                <p className="mt-3">Madame, Monsieur,</p>
                                <p className="mt-2">Conformément aux articles L217-3 et suivants du Code de la consommation, je vous mets en demeure de procéder à la réparation/remplacement de [PRODUIT]...</p>
                                <p className="mt-2 text-gray-500 text-xs">📝 <strong>Version gratuite :</strong> Contenu de lettre à copier-coller</p>
                                <p className="mt-1 text-blue-600 text-xs">💎 <strong>PDF professionnel :</strong> 2,99€ (mise en forme + signature)</p>
                                <p className="mt-1 text-purple-600 text-xs">📮 <strong>Envoi recommandé :</strong> 12,99€ (automatique + suivi)</p>
                            </div>
                            <div className="mt-4 flex gap-3">
                                <div className="text-xs text-gray-500">✅ Base juridique solide • 📤 Prêt à envoyer • 🎯 Personnalisé</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Indicateur scroll */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-gray-400"><ChevronDown className="w-6 h-6" /></div>
            </section>

            {/* PROCESS – pleine hauteur */}
            <section id="process" className="min-h-[calc(100vh-5rem)] flex items-center py-20 bg-white scroll-mt-20">
                <div className="max-w-7xl mx-auto px-6 w-full">
                    <div className="text-center mb-12">
                        <div className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold">Processus simplifié</div>
                        <h2 className="text-4xl lg:text-5xl font-black mt-6 mb-3">Comment ça marche</h2>
                        <p className="text-gray-600 text-lg">Un processus clair pour maximiser vos chances de succès.</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Décrivez votre situation', description: 'Répondez à quelques questions simples sur votre problème de consommation.', icon: <FileText className="w-10 h-10 text-blue-700" /> },
                            { step: '02', title: 'Lettre générée automatiquement', description: 'Le système crée votre lettre de mise en demeure avec les bonnes références légales.', icon: <Zap className="w-10 h-10 text-indigo-700" /> },
                            { step: '03', title: 'Téléchargez et envoyez', description: 'Recevez votre lettre au format PDF, prête à être envoyée au professionnel concerné.', icon: <Timer className="w-10 h-10 text-purple-700" /> },
                        ].map((item, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="text-sm font-extrabold text-gray-400">{item.step}</div>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BENEFITS – pleine hauteur */}
            <section id="benefits" className="min-h-[calc(100vh-5rem)] flex items-center py-20 bg-gradient-to-b from-white to-blue-50 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-6 w-full text-center">
                    <div className="inline-block bg-yellow-50 text-yellow-700 px-4 py-2 rounded-full font-bold">Avantages</div>
                    <h2 className="text-4xl lg:text-5xl font-black mt-6 mb-10">Vos avantages</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <Shield className="w-14 h-14 text-blue-700" />, title: 'Conformité juridique', desc: 'Références précises aux articles L217‑3 à L217‑14 du Code de la consommation.' },
                            { icon: <Clock className="w-14 h-14 text-green-600" />, title: 'Gain de temps', desc: 'Évitez les recherches juridiques fastidieuses. Votre lettre est prête en quelques minutes.' },
                            { icon: <TrendingUp className="w-14 h-14 text-indigo-700" />, title: 'Efficacité prouvée', desc: 'La mise en demeure est la première étape recommandée pour faire valoir vos droits.' },
                        ].map((b, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-10 shadow-sm hover:shadow-md transition text-left">
                                <div className="mb-6">{b.icon}</div>
                                <h3 className="text-2xl font-black mb-2">{b.title}</h3>
                                <p className="text-gray-600">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* RÉFÉRENCES LÉGALES – section enrichie et lisible */}
            <section id="references" className="min-h-[calc(100vh-5rem)] flex items-center py-20 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-6 w-full">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold mb-4">
                            <BookOpen className="w-4 h-4" /> Références légales
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black mb-6">La loi française vous protège</h2>
                        <p className="text-xl text-gray-700 max-w-3xl mx-auto">Découvrez les articles du Code de la consommation qui garantissent vos droits pendant <strong>2 ans minimum</strong>.</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        {/* Colonne gauche - Articles fondamentaux */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <Shield className="w-6 h-6 text-blue-600" /> Articles fondamentaux
                            </h3>

                            <div className="bg-white border border-blue-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">L3</div>
                                    <h4 className="font-bold text-lg">Article L217-3</h4>
                                </div>
                                <p className="text-gray-700 mb-2"><strong>Obligation de conformité</strong></p>
                                <p className="text-sm text-gray-600">Le vendeur est tenu de livrer un bien conforme au contrat. Il répond des défauts de conformité existant lors de la délivrance.</p>
                            </div>

                            <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-green-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">L4</div>
                                    <h4 className="font-bold text-lg">Article L217-4</h4>
                                </div>
                                <p className="text-gray-700 mb-2"><strong>Présomption légale</strong></p>
                                <p className="text-sm text-gray-600">Les défauts apparus dans les 24 mois (12 mois pour l'occasion) sont présumés exister dès la livraison. C'est au vendeur de prouver le contraire !</p>
                            </div>

                            <div className="bg-white border border-purple-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">L5</div>
                                    <h4 className="font-bold text-lg">Article L217-5</h4>
                                </div>
                                <p className="text-gray-700 mb-2"><strong>Critères de conformité</strong></p>
                                <p className="text-sm text-gray-600">Le bien doit présenter les qualités annoncées, être propre à l'usage habituel et correspondre à la description donnée.</p>
                            </div>
                        </div>

                        {/* Colonne droite - Vos recours */}
                        <div className="space-y-6">
                            <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                                <Scale className="w-6 h-6 text-indigo-600" /> Vos recours garantis
                            </h3>

                            <div className="bg-white border border-orange-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-orange-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">L7</div>
                                    <h4 className="font-bold text-lg">Article L217-7</h4>
                                </div>
                                <p className="text-gray-700 mb-2"><strong>Solutions au choix</strong></p>
                                <p className="text-sm text-gray-600">Réparation ou remplacement au choix du consommateur, sauf coût manifestement disproportionné. Si impossible : remboursement ou réduction du prix.</p>
                            </div>

                            <div className="bg-white border border-red-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-red-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">L8</div>
                                    <h4 className="font-bold text-lg">Article L217-8</h4>
                                </div>
                                <p className="text-gray-700 mb-2"><strong>Gratuité totale</strong></p>
                                <p className="text-sm text-gray-600">Tous les frais sont supportés par le vendeur : transport, main-d'œuvre, fournitures. Aucun frais ne peut vous être facturé.</p>
                            </div>

                            <div className="bg-white border border-teal-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-teal-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">L12</div>
                                    <h4 className="font-bold text-lg">Article L217-12</h4>
                                </div>
                                <p className="text-gray-700 mb-2"><strong>Garantie prolongée</strong></p>
                                <p className="text-sm text-gray-600">En cas de réparation, la garantie est prolongée de 6 mois. Si remplacement : nouvelle garantie de 2 ans complète.</p>
                            </div>
                        </div>
                    </div>

                    {/* Section récap */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
                        <h3 className="text-2xl font-bold mb-4">💡 En résumé : vos droits incontestables</h3>
                        <div className="grid md:grid-cols-3 gap-6 text-sm">
                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-bold mb-2">⏰ Durée</h4>
                                <p>2 ans pour le neuf<br />1 an pour l'occasion</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-bold mb-2">💰 Coût</h4>
                                <p>Gratuité totale<br />Tous frais à la charge du vendeur</p>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <h4 className="font-bold mb-2">🎯 Interlocuteur</h4>
                                <p>Vendeur uniquement<br />Pas de renvoi vers le fabricant</p>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-sm text-gray-500 mt-8">Sources officielles : <a href="https://www.legifrance.gouv.fr" className="underline hover:text-blue-600">Code de la consommation sur Légifrance</a> • Cette synthèse ne remplace pas les textes officiels</p>
                </div>
            </section>

            {/* TÉMOIGNAGES – pleine hauteur */}
            <section id="testimonials" className="min-h-[calc(100vh-5rem)] flex items-center py-20 bg-gradient-to-b from-white to-indigo-50 scroll-mt-20">
                <div className="max-w-7xl mx-auto px-6 w-full">
                    <div className="text-center mb-12">
                        <div className="inline-block bg-green-50 text-green-700 px-4 py-2 rounded-full font-bold">Retours d'expérience</div>
                        <h2 className="text-4xl lg:text-5xl font-black mt-6">Ce que disent nos utilisateurs</h2>
                    </div>

                    <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-10 shadow-sm">
                        <div className="flex justify-center mb-4">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 text-yellow-500 fill-yellow-500" />)}
                        </div>
                        {[
                            { name: 'Marie L.', location: 'Marseille', product: 'Lave-linge', timeframe: 'Problème résolu', story: "Le service m'a aidée à structurer ma demande. Le vendeur a finalement accepté la réparation.", result: 'Réparation obtenue' },
                            { name: 'Pierre D.', location: 'Lyon', product: 'Ordinateur portable', timeframe: 'Problème résolu', story: "Écran défaillant après quelques mois. La lettre générée était claire et professionnelle.", result: 'Échange accepté' },
                            { name: 'Sophie M.', location: 'Paris', product: 'Smartphone', timeframe: 'Problème résolu', story: 'Batterie qui se déchargeait très vite. Le commerçant a proposé un remplacement après ma mise en demeure.', result: 'Remplacement accordé' },
                        ].map((t, i) => (
                            <div key={i} className={`transition-all duration-300 ${i === currentTestimonial ? 'block' : 'hidden'}`}>
                                <blockquote className="text-xl text-gray-700 italic mb-6">"{t.story}"</blockquote>
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <div><strong className="text-gray-900">{t.name}</strong> — {t.location} • {t.product}</div>
                                    <div className="text-green-700 font-semibold">{t.result} • {t.timeframe}</div>
                                </div>
                            </div>
                        ))}
                        <div className="flex justify-center gap-2 mt-6">
                            {[0,1,2].map((i) => (
                                <button key={i} onClick={() => setCurrentTestimonial(i)} className={`h-2 rounded-full ${i===currentTestimonial?'bg-blue-600 w-8':'bg-gray-300 w-3'}`} aria-label={`Témoignage ${i+1}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ – pleine hauteur avec accordéon SEO */}
            <section id="faq" className="min-h-[calc(100vh-5rem)] flex items-center py-20 bg-white scroll-mt-20">
                <div className="max-w-4xl mx-auto px-6 w-full">
                    <div className="text-center mb-12">
                        <div className="inline-block bg-purple-50 text-purple-700 px-4 py-2 rounded-full font-bold">Questions fréquentes</div>
                        <h2 className="text-4xl lg:text-5xl font-black mt-6">Vos questions, nos réponses</h2>
                        <p className="text-lg text-gray-600 mt-4">Tout ce que vous devez savoir sur la garantie légale de conformité</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: 'Le contenu de la lettre de mise en demeure est-il vraiment gratuit ?',
                                a: "Oui, absolument ! Vous obtenez <strong>gratuitement le texte complet</strong> de votre lettre personnalisée que vous pouvez copier-coller et envoyer. Le PDF professionnel avec mise en forme (2,99€) et l'envoi recommandé automatique (12,99€) sont des options payantes pour plus de confort.",
                                schema: {
                                    "@type": "Question",
                                    "name": "Le contenu de la lettre de mise en demeure est-il vraiment gratuit ?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Oui, vous obtenez gratuitement le texte complet de votre lettre personnalisée. Le PDF professionnel (2,99€) et l'envoi recommandé (12,99€) sont des options payantes."
                                    }
                                }
                            },
                            {
                                q: 'Quels produits sont couverts par la garantie légale de conformité ?',
                                a: "Tous les biens vendus par un <strong>professionnel à un consommateur</strong> : électroménager (lave-linge, frigo, four), informatique (ordinateurs, smartphones, tablettes), meubles, vêtements, véhicules, etc. La garantie dure <strong>2 ans pour le neuf et 1 an pour l'occasion</strong>.",
                                schema: {
                                    "@type": "Question",
                                    "name": "Quels produits sont couverts par la garantie légale de conformité ?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Tous les biens vendus par un professionnel : électroménager, informatique, meubles, vêtements, véhicules. Garantie de 2 ans pour le neuf, 1 an pour l'occasion."
                                    }
                                }
                            },
                            {
                                q: 'Différence entre le contenu gratuit et le PDF professionnel payant ?',
                                a: "Le <strong>contenu gratuit</strong> vous donne le texte complet de la lettre à copier-coller dans votre traitement de texte. Le <strong>PDF professionnel (2,99€)</strong> inclut la mise en forme juridique, votre signature numérique, l'en-tête et l'optimisation pour l'impression. L'<strong>envoi recommandé (12,99€)</strong> automatise tout le processus d'envoi.",
                                schema: {
                                    "@type": "Question",
                                    "name": "Quelle est la différence entre le contenu gratuit et le PDF payant ?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Le contenu gratuit donne le texte à copier-coller. Le PDF professionnel (2,99€) inclut mise en forme et signature. L'envoi recommandé (12,99€) automatise l'envoi."
                                    }
                                }
                            },
                            {
                                q: 'Que faire si le vendeur ne répond pas à ma mise en demeure ?',
                                a: "Plusieurs recours progressifs s'offrent à vous :<br/><br/><strong>1. Médiation de la consommation</strong> (gratuite et obligatoire pour l'entreprise si elle a un médiateur)<br/><strong>2. Associations de consommateurs</strong> (UFC-Que Choisir, CLCV...) pour vous accompagner<br/><strong>3. Signalement à la DGCCRF</strong> (Direction de la concurrence) via SignalConso<br/><strong>4. Conciliateur de justice</strong> (gratuit et accessible sans avocat)<br/><strong>5. Tribunal judiciaire</strong> en dernier recours<br/><br/>💡 <strong>Dans la majorité des cas</strong>, la simple réception d'une mise en demeure bien rédigée suffit à obtenir une réponse positive du vendeur !",
                                schema: {
                                    "@type": "Question",
                                    "name": "Que faire si le vendeur ne répond pas à ma mise en demeure ?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Recours progressifs : médiation (gratuite), associations de consommateurs, DGCCRF, conciliateur de justice, puis tribunal. La mise en demeure suffit souvent à débloquer la situation."
                                    }
                                }
                            },
                            {
                                q: 'Le vendeur peut-il me renvoyer vers le fabricant ou le SAV ?',
                                a: "Non, c'est <strong>strictement interdit par la loi</strong> ! La garantie légale de conformité lie le consommateur au <strong>vendeur uniquement</strong>. Les phrases comme 'contactez le fabricant', 'voyez avec le SAV' ou 'ce n'est pas notre problème' sont illégales. Votre réponse : 'La garantie légale vous oblige à traiter ma réclamation directement selon l'article L217-3 du Code de la consommation.'",
                                schema: {
                                    "@type": "Question",
                                    "name": "Le vendeur peut-il me renvoyer vers le fabricant ?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Non, c'est illégal. La garantie légale lie le consommateur au vendeur uniquement. Il ne peut pas vous renvoyer vers le fabricant ou SAV."
                                    }
                                }
                            },
                            {
                                q: 'La lettre de mise en demeure a-t-elle une valeur juridique ?',
                                a: "Oui, la <strong>mise en demeure est un acte juridique reconnu</strong> par les tribunaux. Elle prouve votre bonne foi, marque le point de départ de certains délais légaux et constitue souvent un préalable obligatoire avant toute action judiciaire. C'est un document officiel qui engage le vendeur.",
                                schema: {
                                    "@type": "Question",
                                    "name": "La lettre de mise en demeure a-t-elle une valeur juridique ?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Oui, c'est un acte juridique reconnu qui prouve votre bonne foi et marque le départ des délais légaux. Document officiel qui engage le vendeur."
                                    }
                                }
                            },
                            {
                                q: 'Puis-je vraiment obtenir réparation, remplacement ou remboursement gratuit ?',
                                a: "Oui, c'est votre <strong>droit garanti par la loi française</strong> (articles L217-7 et L217-8 du Code de la consommation). Le vendeur doit proposer gratuitement la réparation ou le remplacement. Si impossible, vous avez droit au remboursement ou à une réduction de prix. <strong>Tous les frais sont à la charge du vendeur</strong> (transport, main-d'œuvre, pièces).",
                                schema: {
                                    "@type": "Question",
                                    "name": "Puis-je obtenir réparation, remplacement ou remboursement gratuit ?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Oui, c'est garanti par la loi (L217-7 et L217-8). Le vendeur doit proposer réparation ou remplacement gratuits, sinon remboursement. Tous frais à sa charge."
                                    }
                                }
                            },
                            {
                                q: 'Et si ma mise en demeure ne donne aucun résultat ? Dois-je abandonner ?',
                                a: "Absolument pas ! <strong>Je me défends évoluera pour vous accompagner jusqu'au bout</strong>. En cas d'échec de la mise en demeure, nous développons actuellement des outils pour :<br/><br/>• <strong>Saisine automatique du médiateur</strong> de l'entreprise<br/>• <strong>Signalement DGCCRF</strong> pré-rempli via SignalConso<br/>• <strong>Recours au conciliateur</strong> de justice (gratuit)<br/>• <strong>Préparation du dossier judiciaire</strong> avec toutes les pièces<br/><br/>🎯 <strong>Notre mission</strong> : vous donner tous les outils pour faire valoir vos droits de A à Z, sous supervision juridique.",
                                schema: {
                                    "@type": "Question",
                                    "name": "Et si ma mise en demeure ne donne aucun résultat ?",
                                    "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Ne pas abandonner ! Recours progressifs : médiation, DGCCRF, conciliateur de justice. Je me défends développe des outils pour vous accompagner jusqu'au bout."
                                    }
                                }
                            }
                        ].map((faq, i) => (
                            <details key={i} className="bg-white border border-gray-200 rounded-xl shadow-sm group">
                                <summary className="px-6 py-4 cursor-pointer font-semibold text-lg flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <h3 className="text-left text-gray-900">{faq.q}</h3>
                                    <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform shrink-0 ml-4" />
                                </summary>
                                <div className="px-6 pb-4 text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: faq.a }} />
                                <script
                                    type="application/ld+json"
                                    dangerouslySetInnerHTML={{
                                        __html: JSON.stringify(faq.schema)
                                    }}
                                />
                            </details>
                        ))}
                    </div>

                    {/* Schema.org FAQ structuré */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "FAQPage",
                                "mainEntity": [
                                    {
                                        "@type": "Question",
                                        "name": "Le contenu de la lettre de mise en demeure est-il vraiment gratuit ?",
                                        "acceptedAnswer": {
                                            "@type": "Answer",
                                            "text": "Oui, vous obtenez gratuitement le texte complet de votre lettre personnalisée. Le PDF professionnel (2,99€) et l'envoi recommandé (12,99€) sont des options payantes."
                                        }
                                    },
                                    {
                                        "@type": "Question",
                                        "name": "Quels produits sont couverts par la garantie légale de conformité ?",
                                        "acceptedAnswer": {
                                            "@type": "Answer",
                                            "text": "Tous les biens vendus par un professionnel : électroménager, informatique, meubles, vêtements, véhicules. Garantie de 2 ans pour le neuf, 1 an pour l'occasion."
                                        }
                                    },
                                    {
                                        "@type": "Question",
                                        "name": "Le vendeur peut-il me renvoyer vers le fabricant ?",
                                        "acceptedAnswer": {
                                            "@type": "Answer",
                                            "text": "Non, c'est illégal. La garantie légale lie le consommateur au vendeur uniquement. Il ne peut pas vous renvoyer vers le fabricant ou SAV."
                                        }
                                    },
                                    {
                                        "@type": "Question",
                                        "name": "Que faire si le vendeur ne répond pas à ma mise en demeure ?",
                                        "acceptedAnswer": {
                                            "@type": "Answer",
                                            "text": "Recours progressifs : médiation (gratuite), associations de consommateurs, DGCCRF, conciliateur de justice, puis tribunal. La mise en demeure suffit souvent à débloquer la situation."
                                        }
                                    },
                                    {
                                        "@type": "Question",
                                        "name": "Et si ma mise en demeure ne donne aucun résultat ?",
                                        "acceptedAnswer": {
                                            "@type": "Answer",
                                            "text": "Ne pas abandonner ! Recours progressifs : médiation, DGCCRF, conciliateur de justice. Je me défends développe des outils pour vous accompagner jusqu'au bout."
                                        }
                                    },
                                    {
                                        "@type": "Question",
                                        "name": "La lettre de mise en demeure a-t-elle une valeur juridique ?",
                                        "acceptedAnswer": {
                                            "@type": "Answer",
                                            "text": "Oui, c'est un acte juridique reconnu qui prouve votre bonne foi et marque le départ des délais légaux. Document officiel qui engage le vendeur."
                                        }
                                    },
                                    {
                                        "@type": "Question",
                                        "name": "Puis-je obtenir réparation, remplacement ou remboursement gratuit ?",
                                        "acceptedAnswer": {
                                            "@type": "Answer",
                                            "text": "Oui, c'est garanti par la loi (L217-7 et L217-8). Le vendeur doit proposer réparation ou remplacement gratuits, sinon remboursement. Tous frais à sa charge."
                                        }
                                    }
                                ]
                            })
                        }}
                    />
                </div>
            </section>

            {/* CTA FINAL – pleine hauteur */}
            <section id="cta" className="min-h-[calc(100vh-5rem)] flex items-center justify-center text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white scroll-mt-20">
                <div className="max-w-4xl px-6">
                    <h2 className="text-5xl lg:text-6xl font-black mb-6">Récupérez ce qui vous revient !</h2>
                    <p className="text-lg lg:text-xl mb-6 opacity-90">Panne, défaut, produit non conforme ? <strong>La loi vous protège</strong>. Testez gratuitement vos droits en 3 minutes.</p>

                    <div className="bg-white/10 rounded-2xl p-6 mb-8 backdrop-blur">
                        <h3 className="text-xl font-bold mb-3 flex items-center justify-center gap-2">
                            <Sparkles className="w-5 h-5" /> Notre engagement : vous accompagner jusqu'au bout
                        </h3>
                        <p className="text-white/90 text-sm">
                            Commencez par la mise en demeure gratuite. Si elle ne suffit pas, nous développons actuellement les outils pour la médiation, le signalement DGCCRF et le recours au conciliateur de justice.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="w-full sm:w-auto bg-white text-blue-700 font-black px-10 py-5 rounded-2xl text-lg shadow hover:scale-105 transition flex items-center justify-center gap-3">
                            <Zap className="w-6 h-6" /> Commencer maintenant (gratuit)
                        </button>
                        <button onClick={() => scrollToSection('references')} className="w-full sm:w-auto bg-white/10 border border-white/30 text-white font-semibold px-10 py-5 rounded-2xl text-lg hover:bg-white/20 transition flex items-center justify-center gap-3">
                            <BookOpen className="w-6 h-6" /> Voir mes droits légaux
                        </button>
                    </div>
                    <p className="mt-8 text-white/80">✅ Conforme au Code de la consommation • 💪 2 ans de protection légale • 🎯 Évolution continue du service</p>
                </div>
            </section>

            {/* FOOTER clair */}
            <footer className="bg-gray-100 text-gray-700 py-16">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 mb-3">Je me défends</h3>
                        <p className="text-sm mb-4">Service gratuit pour générer des lettres de mise en demeure conformes au Code de la consommation.</p>
                        {/* Marqueurs de confiance français */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs">
                                <div className="w-6 h-4 bg-blue-600 flex items-center justify-center">
                                    <div className="w-2 h-3 bg-white"></div>
                                    <div className="w-2 h-3 bg-red-600"></div>
                                </div>
                                <span className="font-semibold text-blue-700">100% Français</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <Shield className="w-4 h-4 text-green-600" />
                                <span className="font-semibold text-green-700">RGPD Conforme</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <CheckCircle className="w-4 h-4 text-blue-600" />
                                <span className="font-semibold text-blue-700">Hébergement France</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Services</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#process" className="hover:text-blue-600 transition-colors">Génération de lettres</a></li>
                            <li><a href="#benefits" className="hover:text-blue-600 transition-colors">Conseils juridiques</a></li>
                            <li><a href="#faq" className="hover:text-blue-600 transition-colors">Questions fréquentes</a></li>
                            <li><a href="#references" className="hover:text-blue-600 transition-colors">Références légales</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Légal & Confiance</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/mentions-legales" className="hover:text-blue-600 transition-colors">Mentions légales</a></li>
                            <li><a href="/politique-confidentialite" className="hover:text-blue-600 transition-colors">Politique de confidentialité</a></li>
                            <li><a href="#references" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                                <Scale className="w-3 h-3" />
                                Code de la consommation
                            </a></li>
                            <li className="flex items-center gap-1 text-green-700">
                                <CheckCircle className="w-3 h-3" />
                                <span className="font-semibold">Données sécurisées</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Contact</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> contact@jemedefends.fr</li>
                            <li className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 2 rue André Bouillar, 40220 Tarnos</li>
                            <li className="flex items-center gap-2"><Clock className="w-4 h-4" /> Support par email</li>
                        </ul>

                        {/* Confiance technique française */}
                        <div className="mt-4 pt-4 border-t border-gray-300">
                            <h5 className="font-semibold text-gray-800 mb-2 text-xs uppercase tracking-wide">Partenaires français</h5>
                            <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                    <span>Hébergement : Scaleway (Paris)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                                    <span>Paiement : Stancer (France)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section confiance étendue */}
                <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-300">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="bg-blue-50 rounded-xl p-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                🇫🇷
                            </div>
                            <h5 className="font-bold text-blue-900 mb-2">100% Français</h5>
                            <p className="text-xs text-blue-700">Société française, hébergement Scaleway Paris, paiements Stancer France</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-4">
                            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h5 className="font-bold text-green-900 mb-2">RGPD Conforme</h5>
                            <p className="text-xs text-green-700">Données protégées, durées limitées, droits respectés, politique transparente</p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4">
                            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Scale className="w-6 h-6 text-white" />
                            </div>
                            <h5 className="font-bold text-purple-900 mb-2">Légalement Solide</h5>
                            <p className="text-xs text-purple-700">Références Code de la consommation, supervision juridique, base légale</p>
                        </div>
                    </div>
                </div>

                <div className="text-center text-gray-500 text-xs mt-10">
                    © 2025 Je me défends. Service conforme au Code de la consommation français.
                    <br />
                    <span className="text-blue-600">Contenu rédigé sous supervision juridique • Références légales vérifiées</span>
                    <br />
                    <span className="inline-flex items-center gap-1 mt-2">
            </span>
                </div>
            </footer>
        </div>
    )
}