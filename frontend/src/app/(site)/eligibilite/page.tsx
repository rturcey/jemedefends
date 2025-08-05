import EligibilityWizard from '@/components/eligibility/EligibilityWizard';
import { ShieldCheck } from 'lucide-react';

export const metadata = {
  title: "Test d'éligibilité - Je me défends",
  description:
    'Découvrez en quelques questions si vous pouvez bénéficier de la garantie légale de conformité.',
};

export default function EligibilitePage() {
  return (
    <>
      {/* Contenu */}
      <main className="bg-white">
        <EligibilityWizard />
      </main>
    </>
  );
}
