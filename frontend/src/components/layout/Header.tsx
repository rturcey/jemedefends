'use client'

import Link from 'next/link'
import Image from 'next/image'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="bg-white/95 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            {/* Logo - VOTRE VRAI LOGO */}
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity focus-enhanced"
              aria-label="Je me défends – Retour à l'accueil"
            >
              <Image
                src="/images/logo_jemedefends.svg"
                alt="Je me défends"
                width={160}
                height={40}
                className="w-36 md:w-40 h-auto"
                priority
              />
            </Link>

            {/* Navigation Desktop - VOS VRAIES SECTIONS */}
            <div className="hidden md:flex items-center gap-6 text-slate-700 font-medium">
              <Link
                href="#hero"
                className="hover:text-blue-600 transition-colors focus-enhanced"
              >
                Accueil
              </Link>
              <Link
                href="#comment-ca-marche"
                className="hover:text-blue-600 transition-colors focus-enhanced"
              >
                Comment ça marche
              </Link>
              <Link
                href="#eligibilite"
                className="hover:text-blue-600 transition-colors focus-enhanced"
              >
                Éligibilité
              </Link>
              <Link
                href="#pourquoi-ca-marche"
                className="hover:text-blue-600 transition-colors focus-enhanced"
              >
                Efficacité
              </Link>
              <Link
                href="#faq"
                className="hover:text-blue-600 transition-colors focus-enhanced"
              >
                FAQ
              </Link>
            </div>

            {/* CTA Button */}
            <Link
              href="/eligibilite"
              className="hidden md:inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-semibold shadow-lg text-sm md:text-base focus-enhanced transition-all"
              aria-label="Tester mon éligibilité"
            >
              🚀 Tester mon éligibilité
            </Link>

            {/* Mobile CTA */}
            <Link
              href="/eligibilite"
              className="md:hidden bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              Tester
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}