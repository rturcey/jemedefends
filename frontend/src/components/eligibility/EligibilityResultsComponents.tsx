import * as React from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { Button, Badge, LegalNote, Reveal } from '@/components/ui';
import type { EligibilityResult } from '@/components/eligibility/logic/types';

// Composant d'annonce éligible - Mobile First (header fusionné)
export function EligibleAnnouncement({
  result,
  onGenerateLetter,
  onModifyAnswers,
}: {
  result: EligibilityResult;
  onGenerateLetter: () => void;
  onModifyAnswers: () => void;
}) {
  return (
    <div className="min-h-screen">
      <Reveal>
        <main className="mx-auto w-full max-w-4xl px-4 py-6 md:py-10">
          <div className="w-full max-w-2xl mx-auto">
            {/* Header fusionné avec message */}
            <div className="bg-green-50 border-l-4 border-green-400 rounded-r-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-gray-900">Vous êtes éligible !</h1>
                  <p className="text-green-600 font-medium">Garantie légale de conformité</p>
                </div>
              </div>
              <p className="text-green-800 text-left">
                {result.reasons?.[0] ||
                  'Votre situation correspond aux critères de la garantie légale.'}
              </p>
            </div>

            {/* Actions mobiles-first */}
            <div className="space-y-4">
              <Button
                onClick={onGenerateLetter}
                variant="primary"
                icon={<ArrowRight className="h-5 w-5" />}
                className="w-full text-lg py-4"
              >
                Générer ma lettre maintenant
              </Button>

              <Button onClick={onModifyAnswers} variant="outline" className="w-full">
                Modifier mes réponses
              </Button>
            </div>

            {/* Prochaines étapes avec icônes */}
            <div className="mt-8 p-5 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-4 text-center">📋 Prochaines étapes</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-blue-800">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    📝
                  </div>
                  <span>Complétez le formulaire (2-3 minutes)</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-blue-800">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    📄
                  </div>
                  <span>Récupérez votre lettre avec les bons articles de loi</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-blue-800">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    📮
                  </div>
                  <span>Envoyez-la au vendeur (recommandé avec AR)</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </Reveal>
    </div>
  );
}

// Composant d'annonce non-éligible - Mobile First (header fusionné)
export function IneligibleAnnouncement({
  result,
  onBackToStart,
  answers,
}: {
  result: EligibilityResult;
  onBackToStart: () => void;
  answers: any;
}) {
  return (
    <div className="min-h-screen">
      <Reveal>
        <main className="mx-auto w-full max-w-4xl px-4 py-6 md:py-10">
          <div className="w-full max-w-2xl mx-auto">
            {/* Header fusionné avec message */}
            <div className="bg-orange-50 border-l-4 border-orange-400 rounded-r-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-gray-900">Situation non éligible</h1>
                  <p className="text-orange-600 font-medium">Garantie légale non applicable</p>
                </div>
              </div>
              <div className="text-left">
                <div className="text-orange-800 text-sm space-y-1">
                  {result.reasons?.map((reason, i) => (
                    <p key={i}>{reason}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Alternatives avec espacement amélioré */}
            <div className="space-y-6">
              <h3 className="font-semibold text-gray-900 text-center text-lg mb-6">
                🛠️ Alternatives possibles
              </h3>

              <div className="space-y-4">
                {/* UFC-Que Choisir en premier avec meilleur espacement */}
                <a
                  href="https://www.quechoisir.org/action-ufc-que-choisir-les-associations-locales-n1771/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full p-5 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🛡️</span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-blue-900 text-lg">UFC-Que Choisir</div>
                      <div className="text-sm text-blue-700">
                        Trouvez une association locale près de chez vous
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  </div>
                </a>

                <a
                  href="https://signal.conso.gouv.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full p-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🏛️</span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">SignalConso</div>
                      <div className="text-sm text-gray-600">Signaler le problème à la DGCCRF</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </a>

                <a
                  href="https://www.conciliateurs.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full p-5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">⚖️</span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">Conciliateur</div>
                      <div className="text-sm text-gray-600">
                        Médiation gratuite et confidentielle
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                </a>
              </div>
            </div>

            {/* Action de retour */}
            <div className="mt-8">
              <Button onClick={onBackToStart} variant="outline" className="w-full">
                Refaire le test
              </Button>
            </div>
          </div>

          {/* Disclaimer légal réduit */}
          <LegalNote
            title="À savoir"
            items={[
              'Ce test se base sur les critères généraux de la garantie légale',
              "N'hésitez pas à consulter un professionnel si vous avez un doute",
            ]}
          />
        </main>
      </Reveal>
    </div>
  );
}

// Composant d'annonce incertaine - Mobile First (header fusionné)
export function UncertainAnnouncement({
  result,
  onCompleteInfo,
}: {
  result: EligibilityResult;
  onCompleteInfo: () => void;
}) {
  return (
    <div className="min-h-screen">
      <Reveal>
        <main className="mx-auto w-full max-w-4xl px-4 py-6 md:py-10">
          <div className="w-full max-w-2xl mx-auto">
            {/* Header fusionné avec message */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg p-6 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-7 h-7 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-gray-900">Information incomplète</h1>
                  <p className="text-yellow-600 font-medium">Quelques questions en plus</p>
                </div>
              </div>
              <p className="text-yellow-800 text-center">
                {result.reasons?.[0] ||
                  "Nous avons besoin d'informations supplémentaires pour évaluer votre éligibilité."}
              </p>
            </div>

            {/* Action mobile */}
            <Button onClick={onCompleteInfo} variant="primary" className="w-full">
              Compléter les informations
            </Button>
          </div>
        </main>
      </Reveal>
    </div>
  );
}
