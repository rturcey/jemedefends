// app/resultats/page.tsx
import { Metadata } from 'next';
import ResultsPage from '@/components/results/ResultsPage';

export const metadata: Metadata = {
  title: 'Votre lettre de mise en demeure est prête - Je me défends',
  description:
    'Choisissez comment recevoir votre mise en demeure : version gratuite, PDF professionnel (2,99€) ou envoi automatique (12,99€). Service juridiquement exact basé sur le Code de la consommation.',
  keywords:
    'mise en demeure, lettre gratuite, PDF professionnel, envoi recommandé, garantie légale conformité, Code consommation',
  robots: 'noindex, nofollow', // Page de résultat, pas d'indexation
  openGraph: {
    title: 'Votre lettre de mise en demeure est prête',
    description: 'Choisissez votre formule : gratuite, PDF professionnel ou envoi automatique',
    type: 'website',
    url: 'https://jemedefends.fr/resultats',
    siteName: 'Je me défends',
  },
  twitter: {
    card: 'summary',
    title: 'Votre lettre de mise en demeure est prête',
    description: 'Choisissez votre formule : gratuite, PDF professionnel ou envoi automatique',
  },
};

export default function Page() {
  return (
    <main>
      <ResultsPage />
    </main>
  );
}
