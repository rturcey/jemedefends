import { Shield } from 'lucide-react';
import Link from 'next/link';

import Container from '@/components/ui/Container';
import { NAV_ITEMS } from '@/components/layout/nav.config';

export default function Footer() {
  const footerNav = NAV_ITEMS.filter(it => !it.mobileOnly);

  return (
    <footer className="hidden md:block border-t border-gray-200 py-10 text-sm bg-white">
      <Container className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-gray-600">
          <Shield className="w-4 h-4" aria-hidden="true" />
          Base juridique solide • Hébergement 🇫🇷
        </div>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {footerNav.map(item => (
            <Link
              key={item.href}
              className="text-gray-700 hover:text-blue-700 transition-colors"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}

          <Link
            className="text-gray-700 hover:text-blue-700 transition-colors"
            href="/mentions-legales"
          >
            Mentions légales
          </Link>
          <Link
            className="text-gray-700 hover:text-blue-700 transition-colors"
            href="/politique-confidentialite"
          >
            Confidentialité
          </Link>
          <Link
            className="text-gray-700 hover:text-blue-700 transition-colors"
            href="/conditions-generales"
          >
            CGU
          </Link>
          <Link className="text-gray-700 hover:text-blue-700 transition-colors" href="/contact">
            Contact
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
