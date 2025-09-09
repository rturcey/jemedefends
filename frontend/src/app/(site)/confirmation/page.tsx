import type { Metadata } from 'next';

import ConfirmationPage from '@/components/payment/ConfirmationPage';

export const metadata: Metadata = {
  title: 'Commande confirmée | Je me défends',
  description: 'Votre lettre de mise en demeure est prête ! Téléchargement et prochaines étapes.',
  robots: 'noindex, nofollow',
};

export default function Page() {
  return <ConfirmationPage />;
}
