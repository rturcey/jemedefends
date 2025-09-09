import { FileText, Scale, MessageCircle, Home, Search } from 'lucide-react';
import type { Metadata } from 'next';

import { Container, Section } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Plan du site | Je me défends',
  description:
    'Plan du site Je me défends : toutes les pages pour défendre vos droits de consommateur, guides, FAQ et outils juridiques.',
  alternates: { canonical: '/plan-du-site' },
};

export default function PlanDuSitePage() {
  const sections = [
    {
      title: 'Pages principales',
      icon: <Home className="w-6 h-6 text-blue-600" />,
      links: [
        { href: '/', title: 'Accueil', description: "Page d'accueil du service" },
        {
          href: '/eligibilite',
          title: 'Éligibilité',
          description: 'Vérifiez vos droits',
        },
        { href: '/formulaire', title: 'Générateur', description: 'Créez votre lettre' },
        {
          href: '/a-propos',
          title: 'À propos',
          description: 'Notre mission et équipe',
        },
        { href: '/contact', title: 'Contact', description: 'Support et assistance' },
      ],
    },
    {
      title: 'Guides juridiques',
      icon: <Scale className="w-6 h-6 text-green-600" />,
      links: [
        {
          href: '/guides',
          title: 'Hub des guides',
          description: 'Tous nos guides pratiques',
        },
        {
          href: '/guides/garantie-legale-conformite-guide-complet',
          title: 'Garantie légale',
          description: 'Guide complet',
        },
        {
          href: '/guides/electromenager',
          title: 'Électroménager',
          description: 'Lave-linge, frigo, etc.',
        },
        {
          href: '/guides/smartphone',
          title: 'Smartphone & high-tech',
          description: 'Téléphones, tablettes',
        },
        {
          href: '/guide/apres-ma-lettre',
          title: 'Après ma lettre',
          description: 'Que faire selon la réponse',
        },
      ],
    },
    {
      title: 'Support',
      icon: <MessageCircle className="w-6 h-6 text-purple-600" />,
      links: [
        { href: '/faq', title: 'FAQ', description: 'Questions fréquentes' },
        {
          href: '/contact',
          title: 'Nous contacter',
          description: 'Support personnalisé',
        },
      ],
    },
    {
      title: 'Informations légales',
      icon: <FileText className="w-6 h-6 text-gray-600" />,
      links: [
        {
          href: '/mentions-legales',
          title: 'Mentions légales',
          description: 'Éditeur et hébergeur',
        },
        {
          href: '/politique-confidentialite',
          title: 'Confidentialité',
          description: 'Protection des données',
        },
        {
          href: '/conditions-generales',
          title: 'Conditions générales',
          description: "Règles d'utilisation",
        },
      ],
    },
  ];

  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Search className="w-12 h-12 mx-auto mb-4 text-blue-600" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Plan du site</h1>
          <p className="text-gray-600">
            Toutes les pages pour défendre efficacement vos droits de consommateur
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Section key={index}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  {section.icon}
                  <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.href}
                      className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                    >
                      <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                    </a>
                  ))}
                </div>
              </div>
            </Section>
          ))}
        </div>
      </div>
    </Container>
  );
}
