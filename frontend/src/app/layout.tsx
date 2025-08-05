import './globals.css';
import type { Metadata } from 'next';
import { SiteLayout } from '@/components/layout';

export const metadata: Metadata = {
  title: 'Je me défends – Garantie légale de conformité',
  description: 'Générez votre lettre de mise en demeure en 3 minutes.',
  metadataBase: new URL('https://jemedefends.fr'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
