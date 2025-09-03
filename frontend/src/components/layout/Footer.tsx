import Link from 'next/link';
import Container from '@/components/ui/Container';
import { Shield } from 'lucide-react';

function Footer() {
  return (
    <footer className="site-footer hidden md:block border-t border-gray-200 py-10 text-sm bg-white">
      <Container className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-gray-600">
          <Shield className="w-4 h-4" aria-hidden="true" />
          Base juridique solide • Hébergement 🇫🇷
        </div>

        <nav className="flex items-center gap-4">
          <Link className="hover:text-blue-700" href="/mentions-legales">
            Mentions légales
          </Link>
          <Link className="hover:text-blue-700" href="/politique-confidentialite">
            Confidentialité
          </Link>
          <Link className="hover:text-blue-700" href="/faq">
            FAQ
          </Link>
        </nav>
      </Container>
    </footer>
  );
}

export default Footer;
