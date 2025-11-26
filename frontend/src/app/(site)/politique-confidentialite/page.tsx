import type { Metadata } from 'next';
import Script from 'next/script';
import {
  Database,
  Target,
  Server,
  Timer,
  ShieldCheck,
  Cookie,
  Eye,
  Mail,
  Trash2,
  Edit3,
  PauseCircle,
  Lock,
  BadgeCheck,
} from 'lucide-react';

import LegalLayout from '@/components/legal/LegalLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = {
  title: 'Politique de confidentialité | Je me défends',
  description:
    'Politique de confidentialité de Je me défends : données collectées, finalités, hébergement, droits RGPD et prestataires.',
  alternates: { canonical: '/politique-confidentialite' },
};

const TOC_ITEMS = [
  { id: 'collecte', label: 'Collecte des données', icon: <Database className="w-4 h-4" /> },
  { id: 'finalites', label: 'Finalités & bases légales', icon: <Target className="w-4 h-4" /> },
  { id: 'hebergement', label: 'Hébergement', icon: <Server className="w-4 h-4" /> },
  { id: 'duree', label: 'Durée de conservation', icon: <Timer className="w-4 h-4" /> },
  { id: 'droits', label: 'Vos droits RGPD', icon: <ShieldCheck className="w-4 h-4" /> },
  { id: 'cookies', label: 'Cookies', icon: <Cookie className="w-4 h-4" /> },
  { id: 'transparence', label: 'Engagement transparence', icon: <Eye className="w-4 h-4" /> },
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

export default function PolitiqueConfidentialitePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Politique de confidentialité – Je me défends',
    url: 'https://jemedefends.fr/politique-confidentialite',
  };

  return (
    <>
      <Script
        id="privacy-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main>
        <LegalLayout
          title="Politique de confidentialité"
          subtitle="Comment nous collectons, utilisons et protégeons vos données personnelles."
          toc={TOC_ITEMS}
        >
          <div className="space-y-6 lg:space-y-8">
            <LegalCard
              id="collecte"
              title="Collecte des données"
              icon={<Database className="w-4 h-4" />}
            >
              <p>
                <strong>Principe de minimisation :</strong> nous collectons uniquement les
                informations strictement nécessaires à la génération de votre lettre.
              </p>

              <Alert className="mt-3 bg-blue-50 border-blue-200">
                <AlertTitle>Données collectées</AlertTitle>
                <AlertDescription className="text-blue-900">
                  Identité et coordonnées de l'expéditeur, coordonnées du destinataire, informations
                  sur le produit/service et description du litige.
                </AlertDescription>
              </Alert>

              <p className="mt-3">
                <strong>Aucune donnée superflue ni sensible</strong> n'est collectée.
              </p>
            </LegalCard>

            <LegalCard
              id="finalites"
              title="Finalités et bases légales"
              icon={<Target className="w-4 h-4" />}
            >
              <div className="grid grid-cols-1 gap-3">
                <Alert className="bg-green-50 border-green-200">
                  <AlertTitle>Génération de la lettre</AlertTitle>
                  <AlertDescription className="text-green-900">
                    Base légale : exécution d'une mesure précontractuelle à la demande de
                    l'utilisateur.
                  </AlertDescription>
                </Alert>

                <Alert className="bg-blue-50 border-blue-200">
                  <AlertTitle>Paiements (formules payantes)</AlertTitle>
                  <AlertDescription className="text-blue-900">
                    Base légale : exécution du contrat. Prestataire : Stancer (France).
                  </AlertDescription>
                </Alert>

                <Alert className="bg-orange-50 border-orange-200">
                  <AlertTitle>Envoi postal (option recommandé)</AlertTitle>
                  <AlertDescription className="text-orange-900">
                    Base légale : exécution du contrat. Prestataire : Merci Facteur.
                  </AlertDescription>
                </Alert>

                <Alert className="bg-purple-50 border-purple-200">
                  <AlertTitle>Amélioration du service</AlertTitle>
                  <AlertDescription className="text-purple-900">
                    Statistiques anonymisées uniquement.
                  </AlertDescription>
                </Alert>
              </div>
            </LegalCard>

            <LegalCard id="hebergement" title="Hébergement" icon={<Server className="w-4 h-4" />}>
              <Card className="rounded-2xl border border-green-200 bg-green-50/60 p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <BadgeCheck className="w-5 h-5 text-green-700 mt-0.5" />
                  <div className="space-y-1 text-sm text-green-900">
                    <div className="font-semibold">Scaleway SAS</div>
                    <div>8 rue de la Ville l'Évêque, 75008 Paris, France</div>
                    <a
                      href="https://www.scaleway.com"
                      target="_blank"
                      rel="noopener"
                      className="text-green-800 font-medium hover:text-green-900"
                    >
                      scaleway.com
                    </a>
                  </div>
                </div>
              </Card>

              <p className="mt-3 text-sm text-gray-600">
                Toutes vos données restent sur le territoire français.
              </p>
            </LegalCard>

            <LegalCard
              id="duree"
              title="Durée de conservation"
              icon={<Timer className="w-4 h-4" />}
            >
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertTitle>Suppression immédiate</AlertTitle>
                <AlertDescription className="text-yellow-900">
                  Les données sont supprimées ou anonymisées dès que la lettre est générée et
                  transmise.
                </AlertDescription>
              </Alert>

              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <strong>Paiements :</strong> conservés par Stancer selon les obligations légales.
                </p>
                <p>
                  <strong>Envois postaux :</strong> gérés par Merci Facteur selon leurs conditions.
                </p>
              </div>
            </LegalCard>

            <LegalCard
              id="droits"
              title="Vos droits RGPD"
              icon={<ShieldCheck className="w-4 h-4" />}
            >
              <p>Vous disposez des droits suivants sur vos données personnelles :</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {[
                  {
                    icon: <Eye className="w-4 h-4 text-blue-600" />,
                    title: 'Accès',
                    desc: 'Savoir quelles données nous avons.',
                  },
                  {
                    icon: <Edit3 className="w-4 h-4 text-blue-600" />,
                    title: 'Rectification',
                    desc: 'Corriger les informations inexactes.',
                  },
                  {
                    icon: <Trash2 className="w-4 h-4 text-blue-600" />,
                    title: 'Effacement',
                    desc: 'Demander la suppression.',
                  },
                  {
                    icon: <PauseCircle className="w-4 h-4 text-blue-600" />,
                    title: 'Limitation',
                    desc: 'Limiter le traitement.',
                  },
                ].map(d => (
                  <Card
                    key={d.title}
                    className="rounded-xl border border-gray-200 bg-white p-3 flex items-center gap-2"
                  >
                    {d.icon}
                    <div>
                      <div className="font-semibold text-gray-900">{d.title}</div>
                      <div className="text-sm text-gray-600">{d.desc}</div>
                    </div>
                  </Card>
                ))}
              </div>

              <Alert className="mt-4 bg-slate-50 border-slate-200">
                <AlertTitle className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-700" />
                  Exercer vos droits
                </AlertTitle>
                <AlertDescription>
                  Écrivez à{' '}
                  <span className="font-medium text-blue-800">contact@jemedefends.fr</span>. Si
                  nécessaire, vous pouvez saisir la CNIL.
                </AlertDescription>
              </Alert>
            </LegalCard>

            <LegalCard id="cookies" title="Cookies" icon={<Cookie className="w-4 h-4" />}>
              Cookies essentiels uniquement. Aucune publicité ciblée, aucun suivi commercial.
            </LegalCard>

            <LegalCard
              id="transparence"
              title="Engagement transparence"
              icon={<Eye className="w-4 h-4" />}
            >
              <p>Nous mettons un point d'honneur à :</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm">
                {[
                  {
                    icon: <Lock className="w-4 h-4 text-blue-600" />,
                    label: 'Limiter la collecte au minimum.',
                  },
                  {
                    icon: <Eye className="w-4 h-4 text-blue-600" />,
                    label: 'Rester transparents.',
                  },
                  {
                    icon: <Server className="w-4 h-4 text-blue-600" />,
                    label: 'Héberger en France.',
                  },
                  {
                    icon: <BadgeCheck className="w-4 h-4 text-blue-600" />,
                    label: 'Maintenir une version gratuite.',
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

              <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                <AlertTitle>Engagement</AlertTitle>
                <AlertDescription className="text-yellow-900">
                  Le service gratuit restera toujours accessible afin que chacun puisse défendre ses
                  droits sans barrière financière.
                </AlertDescription>
              </Alert>
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
