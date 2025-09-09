import { Shield } from 'lucide-react';
import type { Metadata } from 'next';
import Script from 'next/script';

import { Container, Reveal } from '@/components/ui';

export const metadata: Metadata = {
  title: 'À propos | Je me défends',
  description:
    "Découvrez Je me défends : notre mission de démocratiser l'accès aux droits de consommateur, notre équipe et nos valeurs de transparence.",
  keywords: [
    'à propos',
    'équipe',
    'mission',
    'valeurs',
    'Richard Turcey',
    'droits consommateur',
    'garantie légale',
    'souveraineté numérique',
  ],
  alternates: { canonical: '/a-propos' },
  openGraph: {
    title: 'À propos - Je me défends',
    description:
      "Notre mission : rendre l'accès aux droits de consommateur simple et gratuit pour tous.",
    url: 'https://jemedefends.fr/a-propos',
    siteName: 'Je me défends',
    type: 'website',
  },
};

const AProposPage: React.FC = () => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'À propos - Je me défends',
    url: 'https://jemedefends.fr/a-propos',
    mainEntity: {
      '@type': 'Organization',
      name: 'Je me défends',
      founder: {
        '@type': 'Person',
        name: 'Richard Turcey',
        jobTitle: 'Entrepreneur, développeur',
      },
      foundingDate: '2024',
      description:
        'Service gratuit de génération de lettres de mise en demeure basées sur le Code de la consommation',
      url: 'https://jemedefends.fr',
      sameAs: ['https://www.linkedin.com/company/je-me-defends'],
    },
  };

  return (
    <>
      <Script
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 md:py-20">
          <Container>
            <Reveal>
              <div className="max-w-4xl mx-auto text-center">
                <Shield className="w-16 h-16 mx-auto mb-6 opacity-90" />
                <h1 className="text-3xl md:text-5xl font-bold mb-6">
                  Notre mission : défendre vos droits
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                  Rendre l'accès aux droits de consommateur <strong>simple</strong>,
                  <strong> gratuit</strong> et <strong>accessible à tous</strong>
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <span className="bg-white/20 px-4 py-2 rounded-full">🆓 Service gratuit</span>
                  <span className="bg-white/20 px-4 py-2 rounded-full">🇫🇷 100% français</span>
                  <span className="bg-white/20 px-4 py-2 rounded-full">⚖️ Juridiquement exact</span>
                </div>
              </div>
            </Reveal>
          </Container>
        </div>

        <Container className="py-12">
          {/* Contenu principal de la page À propos */}
          {/* Implémentation complète... */}
        </Container>
      </div>
    </>
  );
};

export default AProposPage;
