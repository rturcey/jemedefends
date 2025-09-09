import type { Metadata } from 'next';

import GuidePostLettre from '@/components/guides/GuidePostLettre';

export const metadata: Metadata = {
  title: 'Que faire après votre lettre de mise en demeure ? | Je me défends',
  description:
    'Guide complet : que faire si le vendeur accepte, refuse ou ne répond pas à votre mise en demeure. Prochaines étapes juridiques.',
  keywords: [
    'après mise en demeure',
    'vendeur ne répond pas',
    'vendeur refuse',
    'médiation consommation',
    'tribunal',
    'prochaines étapes',
  ],
  alternates: { canonical: '/guide/apres-ma-lettre' },
};

export default function Page() {
  return <GuidePostLettre />;
}
