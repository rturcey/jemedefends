import type { Metadata } from 'next';
import ContactClientPage from './client-page';

export const metadata: Metadata = {
  title: 'Contact | Je me défends',
  description:
    'Contactez Je me défends pour toute question générale ou pour le support technique. Aucun conseil juridique personnalisé.',
  alternates: { canonical: 'https://jemedefends.fr/contact' },
  openGraph: {
    title: 'Contact - Je me défends',
    description: 'Questions générales et support technique. Aucun conseil juridique personnalisé.',
    url: 'https://jemedefends.fr/contact',
    siteName: 'Je me défends',
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactClientPage />;
}
