import type { Metadata } from 'next';
import Script from 'next/script';
import {
  Building2,
  Server,
  Lock,
  Copyright,
  AlertTriangle,
  HeartHandshake,
  Mail,
  BadgeCheck,
} from 'lucide-react';

import LegalLayout from '@/components/legal/LegalLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export const metadata: Metadata = {
  title: 'Mentions légales | Je me défends',
  description:
    'Mentions légales du site Je me défends : éditeur, hébergeur, contact, propriété intellectuelle, données personnelles et responsabilités.',
  alternates: { canonical: '/mentions-legales' },
};

const TOC_ITEMS = [
  { id: 'editeur', label: 'Éditeur du site', icon: <Building2 className="w-4 h-4" /> },
  { id: 'hebergeur', label: 'Hébergeur', icon: <Server className="w-4 h-4" /> },
  { id: 'donnees', label: 'Données personnelles', icon: <Lock className="w-4 h-4" /> },
  { id: 'propriete', label: 'Propriété intellectuelle', icon: <Copyright className="w-4 h-4" /> },
  { id: 'responsabilite', label: 'Responsabilité', icon: <AlertTriangle className="w-4 h-4" /> },
  { id: 'credits', label: 'Crédits', icon: <HeartHandshake className="w-4 h-4" /> },
];

function LegalCard({
  id,
  title,
  icon,
  children,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card id={id} className="rounded-2xl border border-gray-200 shadow-sm scroll-mt-24">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <div className="text-blue-600">{icon}</div>
        <CardTitle className="text-base sm:text-lg font-bold text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none text-gray-700">{children}</CardContent>
    </Card>
  );
}

function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 py-1">
      <div className="text-sm font-medium text-gray-600">{label}</div>
      <div className="text-sm text-gray-900 sm:text-right">{value}</div>
    </div>
  );
}

export default function MentionsLegalesPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Je me défends',
    url: 'https://jemedefends.fr',
    legalName: 'Richard Turcey',
    identifier: {
      '@type': 'PropertyValue',
      name: 'SIREN',
      value: '987801073',
    },
  };

  return (
    <>
      <Script
        id="org-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        <LegalLayout
          title="Mentions légales"
          subtitle="Informations relatives à l'éditeur, l'hébergeur et aux conditions d'utilisation du site."
          toc={TOC_ITEMS}
        >
          <div className="space-y-6 lg:space-y-8">
            <LegalCard
              id="editeur"
              title="Éditeur du site"
              icon={<Building2 className="w-4 h-4" />}
            >
              <Card className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                <div className="space-y-0">
                  <KV label="Dénomination" value="Richard Turcey – Entrepreneur individuel" />
                  <KV label="Nom commercial" value="Je me défends" />
                  <KV label="SIREN" value="987 801 073" />
                  <KV label="SIRET" value="98780107300022" />
                  <KV label="Code APE" value="62.01Z – Programmation informatique" />
                  <KV label="Adresse" value="2 Rue André Bouillar, 40220 Tarnos, France" />
                  <KV
                    label="Contact"
                    value={
                      <span className="inline-flex items-center gap-2 text-blue-700 font-medium">
                        <Mail className="w-4 h-4" />
                        contact@jemedefends.fr
                      </span>
                    }
                  />
                  <KV label="Responsable de publication" value="Richard Turcey" />
                </div>
              </Card>

              <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                <AlertTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-800" />
                  Information importante
                </AlertTitle>
                <AlertDescription className="text-yellow-900">
                  Ce site fournit des informations et des outils fondés sur le Code de la
                  consommation. Il ne constitue pas un conseil juridique individualisé.
                </AlertDescription>
              </Alert>
            </LegalCard>

            <LegalCard id="hebergeur" title="Hébergeur" icon={<Server className="w-4 h-4" />}>
              <Card className="rounded-2xl border border-green-200 bg-green-50/60 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <BadgeCheck className="w-5 h-5 text-green-700 mt-0.5" />
                  <div className="space-y-1 text-sm text-green-900">
                    <div className="font-semibold">Scaleway SAS</div>
                    <div>8 rue de la Ville l'Évêque, 75008 Paris, France</div>
                    <a
                      href="https://www.scaleway.com/fr/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-800 hover:text-green-900 font-medium"
                    >
                      scaleway.com/fr
                    </a>
                  </div>
                </div>
              </Card>
            </LegalCard>

            <LegalCard
              id="donnees"
              title="Données personnelles"
              icon={<Lock className="w-4 h-4" />}
            >
              <p>
                Nous collectons uniquement les informations nécessaires à la génération de votre
                lettre. Hébergement en France (Scaleway), paiements via Stancer, envois postaux par
                Merci Facteur.
              </p>
              <p className="mt-2">
                Pour plus de détails, consultez notre{' '}
                <a
                  href="/politique-confidentialite"
                  className="text-blue-700 hover:text-blue-800 font-medium"
                >
                  politique de confidentialité
                </a>
                .
              </p>
            </LegalCard>

            <LegalCard
              id="propriete"
              title="Propriété intellectuelle"
              icon={<Copyright className="w-4 h-4" />}
            >
              <p>
                Les contenus du site (textes, interfaces, design, logo) sont protégés par le droit
                d'auteur. Toute reproduction sans autorisation est interdite.
              </p>
              <p className="mt-2">
                Les extraits d'articles de loi appartiennent au domaine public, mais leur sélection
                et présentation constituent une œuvre originale.
              </p>
            </LegalCard>

            <LegalCard
              id="responsabilite"
              title="Responsabilité"
              icon={<AlertTriangle className="w-4 h-4" />}
            >
              <p>
                Nous mettons à disposition des informations fiables et à jour, mais ne garantissons
                pas l'issue d'un litige. L'utilisateur reste responsable de ses démarches.
              </p>
              <p className="mt-2 text-sm text-gray-700">
                Les liens externes sont fournis à titre informatif, sans garantie de contenu.
              </p>
            </LegalCard>

            <LegalCard id="credits" title="Crédits" icon={<HeartHandshake className="w-4 h-4" />}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {[
                  {
                    icon: <Building2 className="w-4 h-4 text-blue-600" />,
                    label: 'Éditeur : Richard Turcey',
                  },
                  {
                    icon: <Server className="w-4 h-4 text-green-600" />,
                    label: 'Hébergement : Scaleway (France)',
                  },
                  {
                    icon: <BadgeCheck className="w-4 h-4 text-purple-600" />,
                    label: 'Paiements : Stancer (France)',
                  },
                  {
                    icon: <Mail className="w-4 h-4 text-orange-600" />,
                    label: 'Envois postaux : Merci Facteur',
                  },
                ].map(it => (
                  <Card
                    key={it.label}
                    className="rounded-xl border border-gray-200 bg-white p-3 flex items-center gap-2"
                  >
                    {it.icon}
                    <span>{it.label}</span>
                  </Card>
                ))}
              </div>
            </LegalCard>

            <div className="text-center pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </LegalLayout>
      </main>
    </>
  );
}
