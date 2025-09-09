'use client';

import { CheckCircle, XCircle, Clock } from 'lucide-react';
import React, { useState } from 'react';

import { Container, Section, Button } from '@/components/ui';

const GuidePostLettre: React.FC = () => {
  const [scenario, setScenario] = useState<'success' | 'no-response' | 'refusal' | null>(null);

  const scenarios = [
    {
      id: 'success',
      icon: CheckCircle,
      title: 'Le vendeur accepte',
      description: 'Réparation, remplacement ou remboursement proposé',
      color: 'green',
    },
    {
      id: 'no-response',
      icon: Clock,
      title: 'Pas de réponse (30 jours)',
      description: 'Le vendeur ne répond pas dans les délais',
      color: 'amber',
    },
    {
      id: 'refusal',
      icon: XCircle,
      title: 'Le vendeur refuse',
      description: 'Refus injustifié ou propositions insuffisantes',
      color: 'red',
    },
  ] as const;

  return (
    <Container className="py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Que faire après votre lettre ?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Votre mise en demeure a été envoyée. Découvrez les prochaines étapes selon la réponse du
            vendeur.
          </p>
        </div>

        {/* Sélection de scenario */}
        {!scenario && (
          <Section className="mb-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
              Quelle est la situation ?
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {scenarios.map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setScenario(item.id as any)}
                    className={`p-6 rounded-2xl border-2 transition-all hover:scale-105 hover:shadow-lg ${
                      item.color === 'green'
                        ? 'border-green-200 hover:border-green-400 bg-green-50'
                        : item.color === 'amber'
                          ? 'border-amber-200 hover:border-amber-400 bg-amber-50'
                          : 'border-red-200 hover:border-red-400 bg-red-50'
                    }`}
                  >
                    <Icon
                      className={`w-12 h-12 mx-auto mb-4 ${
                        item.color === 'green'
                          ? 'text-green-600'
                          : item.color === 'amber'
                            ? 'text-amber-600'
                            : 'text-red-600'
                      }`}
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </button>
                );
              })}
            </div>
          </Section>
        )}

        {/* Guide selon scenario */}
        {scenario && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {scenarios.find(s => s.id === scenario)?.title}
              </h2>
              <Button
                onClick={() => setScenario(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Changer de situation
              </Button>
            </div>

            {/* Contenu spécifique par scenario */}
            <Section>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <p className="text-gray-700">
                  Contenu du guide pour le scénario "{scenario}" à implémenter en détail.
                </p>
              </div>
            </Section>
          </div>
        )}
      </div>
    </Container>
  );
};

export default GuidePostLettre;
