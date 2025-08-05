'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Shield, Star, Mail, MapPin, ArrowRight, FileText, Scale, Building2, Globe, BookOpen, ChevronDown, Sparkles } from 'lucide-react'

export default function MentionsLegales() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="bg-white text-gray-900">
            {/* NAVIGATION identique à la homepage */}
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
                        <a href="/" className="hover:text-blue-700">Accueil</a>
                        <a href="/eligibilite" className="hover:text-blue-700">Éligibilité</a>
                        <span className="text-blue-700 font-semibold">Mentions légales</span>
                        <a href="/politique-confidentialite" className="hover:text-blue-700">Confidentialité</a>
                        <a href="/#cta" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Commencer
                        </a>
                    </div>
                </div>
            </nav>

            {/* HERO adapté */}
            <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -left-16 w-[28rem] h-[28rem] bg-blue-200/40 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -right-24 w-[32rem] h-[32rem] bg-indigo-200/40 rounded-full blur-3xl" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-white/60 to-blue-50" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                    <div className={`transition-all duration-700 text-center ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                        {/* Breadcrumb */}
                        <nav className="mb-8">
                            <ol className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                <li><a href="/" className="hover:text-blue-600">Accueil</a></li>
                                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                                <li className="text-blue-600 font-semibold">Mentions légales</li>
                            </ol>
                        </nav>

                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-bold mb-6">
                            <Scale className="w-4 h-4" /> Informations légales
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight">
                            Mentions légales
                        </h1>

                        <p className="text-lg lg:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                            Toutes les informations légales relatives au site <strong>Je me défends</strong>, conformément à la législation française en vigueur.
                        </p>

                        {/* Badges de confiance */}
                        <div className="flex flex-wrap justify-center gap-3 mb-8">
                <span className="inline-flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                  <CheckCircle className="w-4 h-4" /> Conforme LCEN
                </span>
                            <span className="inline-flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  <Building2 className="w-4 h-4" /> Société française
                </span>
                            <span className="inline-flex items-center gap-2 text-sm text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
                  <Globe className="w-4 h-4" /> Hébergement France
                </span>
                        </div>

                        <p className="text-sm text-gray-500 mb-8">
                            Dernière mise à jour : <time dateTime="2025-01-08">8 janvier 2025</time>
                        </p>
                    </div>
                </div>
            </section>

            {/* CONTENU PRINCIPAL */}
            <section className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-6 space-y-16">

                    {/* Éditeur du site */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Éditeur du site</h2>
                                <p className="text-blue-600 text-sm font-semibold">Responsable de la publication</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-3">Identification</h3>
                                    <ul className="space-y-2 text-gray-700">
                                        <li><strong>Dénomination :</strong> Richard TURCEY</li>
                                        <li><strong>Forme juridique :</strong> Micro-entreprise</li>
                                        <li><strong>SIRET :</strong> 987 801 073 00022</li>
                                        <li><strong>Directeur de publication :</strong> Richard Turcey</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-3">Coordonnées</h3>
                                    <ul className="space-y-2 text-gray-700">
                                        <li className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-blue-600" />
                                            2 rue André Bouillar<br />40220 Tarnos, France
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-blue-600" />
                                            <a href="mailto:contact@jemedefends.fr" className="text-blue-600 hover:underline">
                                                contact@jemedefends.fr
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-4">
                            Conformément aux articles 6-III et 19 de la loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN)
                        </p>
                    </div>

                    {/* Hébergeur */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Hébergeur</h2>
                                <p className="text-green-600 text-sm font-semibold">Infrastructure française sécurisée</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                    🇫🇷
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Scaleway SAS</h3>
                                    <p className="text-green-600 text-sm">Hébergeur français de confiance</p>
                                </div>
                            </div>

                            <ul className="space-y-2 text-gray-700">
                                <li><strong>Siège social :</strong> 8 rue de la Ville-l'Évêque, 75008 Paris, France</li>
                                <li><strong>RCS :</strong> Paris B 433 115 904</li>
                                <li><strong>Téléphone :</strong> 01 84 13 00 00</li>
                                <li><strong>Site web :</strong> <a href="https://www.scaleway.com" target="_blank" rel="noopener" className="text-blue-600 hover:underline">www.scaleway.com</a></li>
                            </ul>

                            <div className="mt-4 p-3 bg-green-50 rounded-lg">
                                <p className="text-sm text-green-700">
                                    <strong>🛡️ Sécurité :</strong> Données hébergées en France, conformité RGPD garantie, infrastructure certifiée ISO 27001
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Objet du service */}
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Objet du service & responsabilité</h2>
                                <p className="text-purple-600 text-sm font-semibold">Mission et limites du service</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        <Scale className="w-4 h-4 text-purple-600" />
                                        Nature du service
                                    </h3>
                                    <p className="text-gray-700">
                                        Le site <strong>Je me défends</strong> fournit un service d'assistance juridique automatisée à destination des
                                        consommateurs (génération de lettres de mise en demeure, informations juridiques relatives au Code de la consommation).
                                    </p>
                                </div>

                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-amber-900 mb-2">⚠️ Limitations importantes</h4>
                                    <p className="text-amber-800 text-sm">
                                        Ce service ne constitue <strong>ni un conseil juridique individualisé, ni une représentation en justice</strong>
                                        au sens de la loi du 31 décembre 1971. Les documents générés sont des modèles basés sur des situations types.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Exactitude des informations</h4>
                                    <p className="text-gray-700 text-sm">
                                        L'éditeur s'efforce d'assurer l'exactitude et la mise à jour des informations publiées, sans toutefois pouvoir
                                        en garantir l'exhaustivité ni l'absence d'erreur. L'utilisateur demeure seul responsable de l'usage qu'il fait
                                        des contenus et documents générés.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Propriété intellectuelle */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Propriété intellectuelle</h2>
                                <p className="text-indigo-600 text-sm font-semibold">Droits d'auteur et marques</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-100">
                            <p className="text-gray-700 mb-4">
                                L'ensemble des éléments du site (textes, graphiques, logos, pictogrammes, mises en page, codes, etc.)
                                est protégé par le droit d'auteur et le droit des marques.
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <h4 className="font-semibold text-red-900 mb-2">❌ Interdit</h4>
                                    <p className="text-sm text-red-800">
                                        Reproduction, représentation, modification, adaptation ou exploitation totale ou partielle
                                        sans autorisation écrite préalable.
                                    </p>
                                </div>
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <h4 className="font-semibold text-green-900 mb-2">✅ Autorisé</h4>
                                    <p className="text-sm text-green-800">
                                        Consultation personnelle, citations courtes avec mention de la source,
                                        liens hypertextes vers le site (sauf opposition expresse).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Médiation de la consommation */}
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                                <Scale className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Médiation de la consommation</h2>
                                <p className="text-orange-600 text-sm font-semibold">Résolution amiable des litiges</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
                            <p className="text-gray-700 mb-4">
                                Conformément à l'article L611-1 du Code de la consommation, nous offrons un dispositif de médiation de la consommation.
                            </p>

                            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-2">📞 Contact en cas de litige</h4>
                                <p className="text-sm text-blue-800">
                                    En cas de litige, contactez d'abord notre service client :
                                    <a href="mailto:contact@jemedefends.fr" className="text-blue-600 hover:underline font-semibold"> contact@jemedefends.fr</a>
                                </p>
                                <p className="text-xs text-blue-700 mt-2">
                                    Si aucune solution amiable n'est trouvée, vous pouvez saisir le médiateur de la consommation compétent
                                    ou la plateforme européenne de règlement en ligne des litiges.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Informations supplémentaires */}
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Informations complémentaires</h2>
                                <p className="text-gray-600 text-sm font-semibold">Liens et signalement</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Liens hypertextes</h4>
                                    <p className="text-sm text-gray-700">
                                        La mise en place de liens vers le site est autorisée sous réserve de ne pas porter atteinte aux intérêts de l'éditeur.
                                        L'éditeur décline toute responsabilité quant aux contenus des sites tiers.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Signalement</h4>
                                    <p className="text-sm text-gray-700">
                                        Pour signaler un contenu illicite (art. 6-I-5 LCEN), contactez :
                                        <a href="mailto:contact@jemedefends.fr" className="text-blue-600 hover:underline font-semibold"> contact@jemedefends.fr</a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA vers les autres pages */}
                    <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">Besoin d'autres informations ?</h3>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="/politique-confidentialite" className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition flex items-center justify-center gap-2">
                                <Shield className="w-5 h-5" />
                                Politique de confidentialité
                            </a>
                            <a href="/#cta" className="bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition flex items-center justify-center gap-2">
                                <ArrowRight className="w-5 h-5" />
                                Retour à l'accueil
                            </a>
                        </div>
                    </div>

                </div>
            </section>

            {/* FOOTER identique */}
            <footer className="bg-gray-100 text-gray-700 py-16">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
                    <div>
                        <h3 className="text-xl font-black text-gray-900 mb-3">Je me défends</h3>
                        <p className="text-sm mb-4">Service gratuit pour générer des lettres de mise en demeure conformes au Code de la consommation.</p>
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
                            <li><a href="/" className="hover:text-blue-600 transition-colors">Génération de lettres</a></li>
                            <li><a href="/" className="hover:text-blue-600 transition-colors">Conseils juridiques</a></li>
                            <li><a href="/#faq" className="hover:text-blue-600 transition-colors">Questions fréquentes</a></li>
                            <li><a href="/#references" className="hover:text-blue-600 transition-colors">Références légales</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4">Légal & Confiance</h4>
                        <ul className="space-y-2 text-sm">
                            <li><span className="text-blue-700 font-semibold">Mentions légales</span></li>
                            <li><a href="/politique-confidentialite" className="hover:text-blue-600 transition-colors">Politique de confidentialité</a></li>
                            <li><a href="/#references" className="hover:text-blue-600 transition-colors flex items-center gap-1">
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
              <CheckCircle className="w-3 h-3 text-green-600" />
              Société française • Hébergement sécurisé France • RGPD conforme
            </span>
                </div>
            </footer>

            {/* JSON-LD Schema.org pour le SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebPage",
                        "name": "Mentions légales - Je me défends",
                        "description": "Mentions légales complètes du site Je me défends : éditeur, hébergeur, responsabilité, propriété intellectuelle, médiation consommateur.",
                        "url": "https://jemedefends.fr/mentions-legales",
                        "publisher": {
                            "@type": "Person",
                            "name": "Richard TURCEY",
                            "address": {
                                "@type": "PostalAddress",
                                "streetAddress": "2 rue André Bouillar",
                                "postalCode": "40220",
                                "addressLocality": "Tarnos",
                                "addressCountry": "FR"
                            },
                            "email": "contact@jemedefends.fr"
                        },
                        "about": {
                            "@type": "Service",
                            "name": "Je me défends",
                            "serviceType": "Assistance juridique consommateur",
                            "provider": {
                                "@type": "Person",
                                "name": "Richard TURCEY",
                                "identifier": "98780107300022"
                            }
                        },
                        "lastReviewed": "2025-01-08"
                    })
                }}
            />
        </div>
    )
}