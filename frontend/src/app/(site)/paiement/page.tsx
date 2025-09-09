import { Metadata } from 'next';
import PaymentPage from '@/components/payment/PaymentPage';

export const metadata: Metadata = {
  title: 'Paiement sécurisé | Je me défends',
  description: 'Finalisez votre commande en toute sécurité avec notre partenaire français Stancer.',
  robots: 'noindex, nofollow',
};

export default function Page() {
  return <PaymentPage />;
}
