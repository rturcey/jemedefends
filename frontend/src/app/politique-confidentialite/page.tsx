'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Clock, Shield, Star, Mail, MapPin, ArrowRight, FileText, Scale, Building2, Globe, BookOpen, ChevronDown, Sparkles, Eye, Lock, Database, Users, Timer, AlertTriangle } from 'lucide-react'

export default function PolitiqueConfidentialite() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="bg-white text-gray-900">
            {/* NAVIGATION identique */}
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
                        <a href="/mentions-legales" className="hover:text-blue-700">Mentions légales</a>
                        <span className="text-blue-700 font-semibold">Confidentialité</span>
                        <a href="/#cta" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Commencer
                        </a>
                    </div>
                </div>
            </nav>

            {/* HERO adapté */}
            <section className="min-h-screen flex items-center relative overflow-hidden pt-20">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -left-16 w-[28rem] h-[28rem] bg-green-200/40 rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -right-24 w-[32rem] h-[32rem] bg-emerald-200/40 rounded-full blur-3xl" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white via-white/60 to-green-50" />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
                    <div className={`transition-all duration-700 text-center ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                        {/* Breadcrumb */}
                        <nav className="mb-8">
                            <ol className="flex items-center justify-center gap-2 text-sm text-gray-600">
                                <li><a href="/" className="hover:text-blue-600">Accueil</a></li>
                                <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                                <li className="text-green-600 font-semibold">Politique de confidentialité</li>
                            </ol>
                        </nav>

                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full font-bold mb-6">
                            <Shield className="w-4 h-4" /> Protection des données
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight">
                            Politique de confidentialité
                        </h1>

                        <p className="text-lg lg:text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                            Transparence totale sur la collecte, l'utilisation et la protection de vos données personnelles, <strong>conforme RGPD</strong>.
                        </p>

                        {/* Badges de confiance RGPD */}
                        <div className="flex flex-wrap justify-center gap-3 mb-8">
                <span className="inline-flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                  <Shield className="w-4 h-4" /> RGPD Conforme
                </span>
                            <span className="inline-flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                  <Lock className="w-4 h-4" /> Données sécurisées
                </span>
                            <span className="inline-flex items-center gap-2 text-sm text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
                  <Eye className="w-4 h-4" /> Transparence totale
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

                    {/* Résumé exécutif */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white">
                        <h2 className="text-2xl font-black mb-4 text-center">🛡️ L'essentiel à retenir</h2>
                        <div className="grid md:grid-cols-3 gap-6 text-center">
                            <div className="bg-white/10 rounded-xl p-4">
                                <Database className="w-8 h-8 mx-auto mb-2 text-green-200" />
                                <h3 className="font-bold mb-1">Collecte minimale</h3>
                                <p className="text-sm text-green-100">Seulement les données nécessaires au service</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4">
                                <Shield className="w-8 h-8 mx-auto mb-2 text-blue-200" />
                                <h3 className="font-bold mb-1">Sécurité maximale</h3>
                                <p className="text-sm text-blue-100">Hébergement France, chiffrement, accès restreint</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4">
                                <Users className="w-8 h-8 mx-auto mb-2 text-purple-200" />
                                <h3 className="font-bold mb-1">Vos droits respectés</h3>
                                <p className="text-sm text-purple-100">Accès, rectification, suppression garantis</p>
                            </div>
                        </div>
                    </div>

                    {/* Données collectées */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Database className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Quelles données collectons-nous ?</h2>
                                <p className="text-blue-600 text-sm font-semibold">Collecte strictement nécessaire au service</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-100">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Données collectées
                                    </h3>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                            <div><strong>Contact :</strong> nom, prénom, email, adresse postale</div>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                            <div><strong>Problème :</strong> produit défaillant, vendeur, date d'achat, prix</div>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                                            <div><strong>Technique :</strong> logs de connexion, IP (anonymisée après 6 mois)</div>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                                            <div><strong>Paiement :</strong> traité exclusivement par Stancer (pas de stockage)</div>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        Données NON collectées
                                    </h3>
                                    <ul className="space-y-2 text-sm text-red-800">
                                        <li>• Numéros de carte bancaire (Stancer uniquement)</li>
                                        <li>• Données de santé ou biométriques</li>
                                        <li>• Opinions politiques ou religieuses</li>
                                        <li>• Données de géolocalisation précise</li>
                                        <li>• Cookies publicitaires ou de tracking</li>
                                        <li>• Données de navigation non essentielles</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-sm text-amber-800">
                                    <strong>⚠️ Important :</strong> Nous ne collectons <strong>aucune donnée sensible</strong> au sens de l'article 9 du RGPD.
                                    Évitez de transmettre des informations sensibles dans les champs libres.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Finalités et bases légales */}
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                                <Scale className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Pourquoi utilisons-nous vos données ?</h2>
                                <p className="text-purple-600 text-sm font-semibold">Finalités et bases légales RGPD</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-purple-100">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-bold text-purple-900 mb-3">🎯 Finalités</h3>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-start gap-3">
                                            <FileText className="w-4 h-4 text-blue-600 mt-0.5" />
                                            <div>
                                                <strong>Fourniture du service</strong><br />
                                                <span className="text-gray-600">Tests, génération de lettres, stockage facultatif de projets</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Users className="w-4 h-4 text-green-600 mt-0.5" />
                                            <div>
                                                <strong>Gestion de la relation</strong><br />
                                                <span className="text-gray-600">Support client, suivi, facturation le cas échéant</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <Shield className="w-4 h-4 text-red-600 mt-0.5" />
                                            <div>
                                                <strong>Sécurité et intégrité</strong><br />
                                                <span className="text-gray-600">Prévention des abus, journalisation technique</span>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <BookOpen className="w-4 h-4 text-orange-600 mt-0.5" />
                                            <div>
                                                <strong>Obligations légales</strong><br />
                                                <span className="text-gray-600">Comptabilité, conservation des preuves</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-bold text-purple-900 mb-3">⚖️ Bases légales (Art. 6 RGPD)</h3>
                                    <div className="space-y-3">
                                        <div className="p-3 bg-blue-50 rounded-lg">
                                            <h4 className="font-semibold text-blue-900 text-sm">Exécution d'un contrat</h4>
                                            <p className="text-xs text-blue-700">Mise à disposition des fonctionnalités demandées</p>
                                        </div>
                                        <div className="p-3 bg-green-50 rounded-lg">
                                            <h4 className="font-semibold text-green-900 text-sm">Intérêt légitime</h4>
                                            <p className="text-xs text-green-700">Sécurité, amélioration du service (sans profilage, sans publicité)</p>
                                        </div>
                                        <div className="p-3 bg-orange-50 rounded-lg">
                                            <h4 className="font-semibold text-orange-900 text-sm">Obligation légale</h4>
                                            <p className="text-xs text-orange-700">Comptabilité, lutte contre la fraude</p>
                                        </div>
                                        <div className="p-3 bg-purple-50 rounded-lg">
                                            <h4 className="font-semibold text-purple-900 text-sm">Consentement</h4>
                                            <p className="text-xs text-purple-700">Uniquement si requis (ex. newsletter - non activée par défaut)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Destinataires et sous-traitants */}
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Qui a accès à vos données ?</h2>
                                <p className="text-orange-600 text-sm font-semibold">Destinataires et partenaires français</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-100">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Globe className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="font-bold text-blue-900 mb-2">Hébergement</h3>
                                    <p className="text-sm text-blue-700 mb-2"><strong>Scaleway SAS</strong></p>
                                    <p className="text-xs text-gray-600">Serveurs en France, certifié ISO 27001, conforme RGPD</p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Lock className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="font-bold text-green-900 mb-2">Paiement</h3>
                                    <p className="text-sm text-green-700 mb-2"><strong>Stancer</strong></p>
                                    <p className="text-xs text-gray-600">PSP français, nous ne recevons JAMAIS les numéros de carte</p>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="font-bold text-purple-900 mb-2">Support</h3>
                                    <p className="text-sm text-purple-700 mb-2"><strong>Email direct</strong></p>
                                    <p className="text-xs text-gray-600">Pas de plateforme externe, échanges directs sécurisés</p>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-800 text-center">
                                    <strong>🇫🇷 Engagement :</strong> Tous nos partenaires sont français ou européens.
                                    Pas de transfert vers des pays tiers sans garanties adéquates.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Durées de conservation */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <Timer className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Combien de temps conservons-nous vos données ?</h2>
                                <p className="text-indigo-600 text-sm font-semibold">Durées limitées et proportionnées</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-indigo-100">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Données de relation
                                        </h4>
                                        <p className="text-sm text-blue-800"><strong>3 ans</strong> après le dernier contact actif</p>
                                        <p className="text-xs text-blue-600">Compte, échanges, préférences utilisateur</p>
                                    </div>

                                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                                        <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                                            <FileText className="w-4 h-4" />
                                            Documents générés
                                        </h4>
                                        <p className="text-sm text-purple-800"><strong>5 ans</strong> (sauf suppression demandée)</p>
                                        <p className="text-xs text-purple-600">Lettres, historique des générations</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                                            <Scale className="w-4 h-4" />
                                            Données comptables
                                        </h4>
                                        <p className="text-sm text-green-800"><strong>10 ans</strong> (obligation légale)</p>
                                        <p className="text-xs text-green-600">Factures, paiements, obligations fiscales</p>
                                    </div>

                                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                        <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            Logs techniques
                                        </h4>
                                        <p className="text-sm text-orange-800"><strong>6 à 12 mois</strong> maximum</p>
                                        <p className="text-xs text-orange-600">Sécurité, diagnostic, IP anonymisées</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vos droits RGPD */}
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
                                <Scale className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Vos droits (RGPD)</h2>
                                <p className="text-emerald-600 text-sm font-semibold">Droits garantis et facilités</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-emerald-100">
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div className="text-center p-4 bg-blue-50 rounded-xl">
                                    <Eye className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <h4 className="font-semibold text-blue-900 text-sm">Droit d'accès</h4>
                                    <p className="text-xs text-blue-700">Connaître les données vous concernant</p>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-xl">
                                    <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
                                    <h4 className="font-semibold text-green-900 text-sm">Droit de rectification</h4>
                                    <p className="text-xs text-green-700">Corriger les données inexactes</p>
                                </div>
                                <div className="text-center p-4 bg-red-50 rounded-xl">
                                    <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                                    <h4 className="font-semibold text-red-900 text-sm">Droit d'effacement</h4>
                                    <p className="text-xs text-red-700">Supprimer vos données ("droit à l'oubli")</p>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-xl">
                                    <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                                    <h4 className="font-semibold text-purple-900 text-sm">Droit d'opposition</h4>
                                    <p className="text-xs text-purple-700">Vous opposer à certains traitements</p>
                                </div>
                            </div>

                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                                <h4 className="font-semibold text-emerald-900 mb-2">📧 Comment exercer vos droits ?</h4>
                                <p className="text-sm text-emerald-800 mb-3">
                                    Envoyez votre demande à : <a href="mailto:contact@jemedefends.fr" className="font-semibold underline">contact@jemedefends.fr</a>
                                </p>
                                <div className="grid md:grid-cols-2 gap-4 text-xs text-emerald-700">
                                    <div>
                                        <strong>⏱️ Délai de réponse :</strong> 1 mois (prolongeable en cas de complexité)
                                    </div>
                                    <div>
                                        <strong>🆔 Pièce d'identité :</strong> Requise pour sécuriser votre demande
                                    </div>
                                </div>
                                <p className="text-xs text-emerald-600 mt-2">
                                    Vous pouvez saisir la <a href="https://www.cnil.fr" className="underline" target="_blank" rel="noopener">CNIL</a> si notre réponse ne vous satisfait pas.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sécurité */}
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                                <Lock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Sécurité de vos données</h2>
                                <p className="text-red-600 text-sm font-semibold">Protection maximale</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-red-100">
                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        🔐
                                    </div>
                                    <h4 className="font-semibold text-blue-900 mb-2">Chiffrement</h4>
                                    <p className="text-sm text-blue-700">HTTPS/TLS pour tous les échanges</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        🏢
                                    </div>
                                    <h4 className="font-semibold text-green-900 mb-2">Hébergement</h4>
                                    <p className="text-sm text-green-700">Serveurs sécurisés en France (Scaleway)</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        👥
                                    </div>
                                    <h4 className="font-semibold text-purple-900 mb-2">Accès limité</h4>
                                    <p className="text-sm text-purple-700">Personnel autorisé uniquement</p>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <h4 className="font-semibold text-red-900 mb-2">🚨 En cas de violation de données</h4>
                                <p className="text-sm text-red-800">
                                    Notification à la CNIL sous 72h et aux personnes concernées si risque élevé, conformément au RGPD.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cookies */}
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-amber-600 rounded-lg flex items-center justify-center">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Cookies et stockage local</h2>
                                <p className="text-amber-600 text-sm font-semibold">Utilisation minimale et transparente</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Cookies techniques (nécessaires)
                                    </h4>
                                    <ul className="space-y-2 text-sm text-green-800">
                                        <li>• Session utilisateur (authentification)</li>
                                        <li>• Préférences d'interface (langue, thème)</li>
                                        <li>• Panier et état du formulaire</li>
                                        <li>• Protection anti-CSRF</li>
                                    </ul>
                                    <p className="text-xs text-green-600 mt-2">
                                        <strong>Pas de consentement requis</strong> (strictement nécessaires au fonctionnement)
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        Cookies NON utilisés
                                    </h4>
                                    <ul className="space-y-2 text-sm text-red-800">
                                        <li>• Cookies publicitaires</li>
                                        <li>• Cookies de tracking/analytics</li>
                                        <li>• Cookies de réseaux sociaux</li>
                                        <li>• Cookies de profilage</li>
                                    </ul>
                                    <p className="text-xs text-red-600 mt-2">
                                        <strong>Politique :</strong> Pas de tracking publicitaire, respect de la vie privée
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="font-semibold text-blue-900 mb-2">🍪 Configuration des cookies</h4>
                                <p className="text-sm text-blue-800">
                                    Vous pouvez configurer votre navigateur pour bloquer les cookies non essentiels.
                                    Le site reste utilisable, sous réserve des fonctionnalités qui en dépendent.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Transferts hors UE */}
                    <div className="bg-gradient-to-r from-cyan-50 to-sky-50 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center">
                                🌍
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Transferts hors Union européenne</h2>
                                <p className="text-cyan-600 text-sm font-semibold">Engagement européen</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-cyan-100">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        Notre engagement
                                    </h4>
                                    <ul className="space-y-2 text-sm text-green-800">
                                        <li>• Hébergement exclusif en France (Scaleway)</li>
                                        <li>• Paiements traités en France (Stancer)</li>
                                        <li>• Aucun service hors UE/EEE</li>
                                        <li>• Données stockées uniquement en Europe</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        Garanties si transfert nécessaire
                                    </h4>
                                    <ul className="space-y-2 text-sm text-blue-800">
                                        <li>• Clauses contractuelles types (CCT)</li>
                                        <li>• Décision d'adéquation de la Commission</li>
                                        <li>• Consentement explicite si requis</li>
                                        <li>• Information préalable transparente</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                                <p className="text-sm text-green-800">
                                    <strong>🇪🇺 Promesse :</strong> Vos données restent en Europe.
                                    Toute exception sera clairement communiquée et justifiée.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Modifications de la politique */}
                    <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-2xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">Modifications de cette politique</h2>
                                <p className="text-slate-600 text-sm font-semibold">Évolutions et transparence</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                            <p className="text-gray-700 mb-4">
                                Cette politique peut évoluer pour s'adapter aux évolutions légales, techniques ou de nos services.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h4 className="font-semibold text-blue-900 mb-2">📧 Modifications mineures</h4>
                                    <p className="text-sm text-blue-800">
                                        Clarifications, corrections typographiques : mise à jour directe avec indication de la date.
                                    </p>
                                </div>

                                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                    <h4 className="font-semibold text-orange-900 mb-2">⚡ Modifications importantes</h4>
                                    <p className="text-sm text-orange-800">
                                        Nouveaux traitements, changement de finalités : information par email 30 jours avant application.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                                <p className="text-sm text-gray-700">
                                    <strong>Version actuelle :</strong> 2.1 •
                                    <strong>Dernière mise à jour :</strong> 8 janvier 2025 •
                                    <strong>Prochaine revue :</strong> Janvier 2026
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact et réclamations */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-black mb-4">Des questions sur vos données ?</h2>
                            <p className="text-blue-100">Notre équipe est à votre disposition pour répondre à toutes vos questions</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white/10 rounded-xl p-6 text-center">
                                <Mail className="w-8 h-8 mx-auto mb-3 text-blue-200" />
                                <h4 className="font-semibold mb-2">Contact direct</h4>
                                <a href="mailto:contact@jemedefends.fr" className="text-blue-200 hover:text-white underline font-semibold">
                                    contact@jemedefends.fr
                                </a>
                                <p className="text-xs text-blue-200 mt-2">Réponse sous 48h en moyenne</p>
                            </div>

                            <div className="bg-white/10 rounded-xl p-6 text-center">
                                <Scale className="w-8 h-8 mx-auto mb-3 text-green-200" />
                                <h4 className="font-semibold mb-2">Autorité de contrôle</h4>
                                <a href="https://www.cnil.fr" target="_blank" rel="noopener" className="text-green-200 hover:text-white underline font-semibold">
                                    CNIL (cnil.fr)
                                </a>
                                <p className="text-xs text-green-200 mt-2">En cas de réclamation non résolue</p>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <a href="/mentions-legales" className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition mr-4">
                                <FileText className="w-5 h-5" />
                                Mentions légales
                            </a>
                            <a href="/#cta" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition">
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
                            <li><a href="/mentions-legales" className="hover:text-blue-600 transition-colors">Mentions légales</a></li>
                            <li><span className="text-green-700 font-semibold">Politique de confidentialité</span></li>
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
                        "name": "Politique de confidentialité - Je me défends",
                        "description": "Politique de confidentialité complète et transparente : données collectées, finalités RGPD, droits des utilisateurs, sécurité, cookies, transferts.",
                        "url": "https://jemedefends.fr/politique-confidentialite",
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
                        "about": [
                            {
                                "@type": "DataCatalog",
                                "name": "Données personnelles collectées",
                                "description": "Contact, informations sur le problème consommateur, données techniques"
                            },
                            {
                                "@type": "SecurityPolicy",
                                "name": "Politique de sécurité RGPD",
                                "description": "Chiffrement, hébergement France, accès restreint, conformité européenne"
                            }
                        ],
                        "datePublished": "2025-01-08",
                        "dateModified": "2025-01-08",
                        "inLanguage": "fr-FR"
                    })
                }}
            />
        </div>
    )
}