'use client';

import React from 'react';
import {
  CheckCircle,
  XCircle,
  ExternalLink,
  Phone,
  MapPin,
  Shield,
  Mail,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { EligibilityData } from '@/types/eligibility';

interface ResultsDisplayProps {
  data: EligibilityData;
  onRestart: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data, onRestart }) => {
  if (data.isEligible) {
    return <EligibleResults data={data} onRestart={onRestart} />;
  }

  return <NotEligibleResults data={data} onRestart={onRestart} />;
};

// Composant pour les résultats éligibles
const EligibleResults: React.FC<{ data: EligibilityData; onRestart: () => void }> = ({
  data,
  onRestart,
}) => {
  const handleChooseFormula = () => {
    // Redirection vers la page de formules
    window.location.href = '/formulaire';
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 min-h-screen">
      <div className="px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icône de succès */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce-in">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          {/* Titre principal */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-balance">
            Félicitations ! Vous êtes éligible
          </h1>

          {/* Sous-titre */}
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Votre situation correspond aux critères de la garantie légale de conformité. Vous pouvez
            demander la réparation, le remplacement ou le remboursement.
          </p>

          {/* Récapitulatif de l'éligibilité */}
          <div className="bg-white rounded-lg p-6 mb-8 text-left border border-green-200">
            <h2 className="font-semibold text-gray-900 mb-4 text-center">
              Résumé de votre situation
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span>Vendeur professionnel</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span>Usage personnel</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span>
                  {data.productType === 'physical' ? 'Bien matériel' : 'Service numérique'}
                </span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                <span>Dans les délais légaux</span>
              </div>
            </div>
          </div>

          {/* Options disponibles */}
          <div className="bg-white rounded-lg p-6 mb-8 text-left border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4 text-center">
              Choisissez votre formule
            </h2>
            <div className="space-y-4">
              <div className="flex items-start p-4 bg-blue-50 rounded-lg">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mr-4 flex-shrink-0">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Lettre gratuite</div>
                  <div className="text-sm text-gray-600">
                    Générez votre mise en demeure à imprimer et signer
                  </div>
                  <div className="text-xs text-green-600 font-medium mt-1">100% gratuit</div>
                </div>
              </div>

              <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full mr-4 flex-shrink-0">
                  <span className="text-sm font-bold">2</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">PDF professionnel</div>
                    <div className="text-sm font-semibold text-blue-600">2,99€</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Document avec logo, signature électronique et support mail
                  </div>
                  <div className="text-xs text-blue-600 font-medium mt-1">+ populaire</div>
                </div>
              </div>

              <div className="flex items-start p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full mr-4 flex-shrink-0">
                  <span className="text-sm font-bold">3</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">Envoi automatique</div>
                    <div className="text-sm font-semibold text-purple-600">12,99€</div>
                  </div>
                  <div className="text-sm text-gray-600">
                    PDF + envoi en recommandé avec suivi par Merci Facteur
                  </div>
                  <div className="text-xs text-purple-600 font-medium mt-1">Solution complète</div>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="space-y-3">
            <button
              onClick={handleChooseFormula}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-button hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Générer ma lettre
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </button>

            <button
              onClick={onRestart}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors touch-target"
            >
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              Recommencer le test
            </button>
          </div>

          {/* Garanties et réassurance */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-gray-600">
            <div className="text-center">
              <Shield className="w-5 h-5 mx-auto mb-1 text-blue-600" />
              <div>Conforme au Code de la consommation</div>
            </div>
            <div className="text-center">
              <Phone className="w-5 h-5 mx-auto mb-1 text-green-600" />
              <div>Support mail illimité</div>
            </div>
            <div className="text-center">
              <MapPin className="w-5 h-5 mx-auto mb-1 text-purple-600" />
              <div>Hébergement français</div>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 mt-6 max-w-md mx-auto">
            Ces informations sont basées sur le Code de la consommation et ne constituent pas un
            conseil juridique individualisé.
          </p>
        </div>
      </div>
    </div>
  );
};

// Composant pour les résultats non éligibles
const NotEligibleResults: React.FC<{ data: EligibilityData; onRestart: () => void }> = ({
  data,
  onRestart,
}) => {
  const alternatives = [
    {
      icon: ExternalLink,
      title: 'SignalConso',
      description: 'Signalez le problème aux autorités compétentes',
      action: 'Accéder à SignalConso',
      url: 'https://signal.conso.gouv.fr',
      color: 'text-blue-600',
    },
    {
      icon: Phone,
      title: 'Associations de consommateurs',
      description: 'UFC-Que Choisir, CLCV, Consommation Logement Cadre de Vie',
      action: 'Trouver une association',
      url: 'https://www.inc-conso.fr/content/les-associations-de-consommateurs-agreees',
      color: 'text-green-600',
    },
    {
      icon: MapPin,
      title: 'Conciliateur de justice',
      description: "Médiation gratuite pour résoudre le litige à l'amiable",
      action: 'Trouver un conciliateur',
      url: 'https://www.conciliateurs.fr',
      color: 'text-purple-600',
    },
    {
      icon: Shield,
      title: 'Protection juridique',
      description: 'Vérifiez si votre assurance couvre ce type de litige',
      action: 'En savoir plus',
      url: '/guide/protection-juridique',
      color: 'text-orange-600',
    },
    {
      icon: Mail,
      title: 'Permanences juridiques gratuites',
      description: "Conseils d'avocats dans votre mairie ou tribunal",
      action: 'Trouver une permanence',
      url: 'https://www.justice.gouv.fr/aide-juridictionnelle-10024/points-dacces-au-droit-10025/',
      color: 'text-indigo-600',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-red-50 to-orange-50 min-h-screen">
      <div className="px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icône d'information */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          {/* Titre principal */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 text-balance">
            Non éligible à la garantie légale
          </h1>

          {/* Explication */}
          <p className="text-lg text-gray-600 mb-6 max-w-xl mx-auto">
            Votre situation ne correspond pas aux critères de la garantie légale de conformité.
          </p>

          {/* Raison de non-éligibilité */}
          {data.ineligibilityReason && (
            <div className="bg-white rounded-lg p-4 mb-8 border border-red-200">
              <h3 className="font-medium text-gray-900 mb-2">Raison principale :</h3>
              <p className="text-sm text-gray-600">{data.ineligibilityReason}</p>
            </div>
          )}

          <p className="text-gray-600 mb-8">
            Mais d'autres solutions existent pour vous aider dans votre démarche.
          </p>

          {/* Solutions alternatives */}
          <div className="bg-white rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-gray-900 mb-6 text-center">
              Solutions alternatives recommandées
            </h2>
            <div className="space-y-4">
              {alternatives.map((alternative, index) => {
                const Icon = alternative.icon;
                return (
                  <div
                    key={index}
                    className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Icon className={`w-5 h-5 mt-0.5 mr-4 flex-shrink-0 ${alternative.color}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 mb-1">{alternative.title}</div>
                      <div className="text-sm text-gray-600 mb-2 leading-relaxed">
                        {alternative.description}
                      </div>
                      <a
                        href={alternative.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm font-medium ${alternative.color} hover:underline`}
                      >
                        {alternative.action} →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="space-y-3">
            <button
              onClick={onRestart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors touch-target"
            >
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              Recommencer le test
            </button>

            <a
              href="/guide/alternatives"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors text-center touch-target"
            >
              Voir toutes les alternatives
            </a>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-500 mt-6 max-w-md mx-auto">
            Ces informations sont basées sur le Code de la consommation et ne constituent pas un
            conseil juridique individualisé.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
