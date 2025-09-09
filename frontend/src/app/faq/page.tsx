import type { Metadata } from 'next';

import FAQClientPage from './client-page';

// Métadonnées SEO (côté serveur)
export const metadata: Metadata = {
  title: 'FAQ - Foire aux questions - Je me défends',
  description:
    'Toutes les réponses à vos questions sur la garantie légale de conformité, vos droits de consommateur et notre service de lettres de mise en demeure.',
  keywords: [
    'FAQ',
    'questions fréquentes',
    'garantie légale conformité',
    'droits consommateur',
    'mise en demeure',
    'aide',
  ],
  alternates: {
    canonical: 'https://jemedefends.fr/faq',
  },
  openGraph: {
    title: 'FAQ - Toutes vos questions sur vos droits de consommateur',
    description: 'Réponses complètes sur la garantie légale, vos droits et notre service.',
    url: 'https://jemedefends.fr/faq',
    siteName: 'Je me défends',
    type: 'website',
  },
};

// Composant serveur qui wrap le composant client
export default function FAQPage() {
  return <FAQClientPage />;
}
