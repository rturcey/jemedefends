'use client';

import { Lock, Loader2, ArrowLeft } from 'lucide-react';
import React, { useState, useEffect } from 'react';

// Réutilisation des composants existants
import { Container, Section } from '@/components/ui';

// Types
interface PaymentData {
  type: 'pdf' | 'postal';
  email: string;
  letterId: string;
  amount: number;
}

const PaymentPage: React.FC = () => {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupération des données de paiement
  useEffect(() => {
    const pending = sessionStorage.getItem('pendingPayment');
    if (!pending) {
      window.location.href = '/formulaire';
      return;
    }

    try {
      const data = JSON.parse(pending);
      setPaymentData(data);
    } catch (err) {
      console.error('Erreur parsing paymentData:', err);
      window.location.href = '/formulaire';
    }
  }, []);

  if (!paymentData) {
    return (
      <Container className="py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4 md:py-8">
      {/* Header mobile-first */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => window.history.back()}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="Retour"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Finaliser votre commande</h1>
          <p className="text-sm text-gray-600">Paiement sécurisé avec Stancer 🇫🇷</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Implémentation du formulaire de paiement */}
        <Section className="mb-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="text-center">
              <Lock className="w-12 h-12 mx-auto mb-4 text-green-600" />
              <h2 className="text-lg font-bold text-gray-900 mb-2">Paiement sécurisé</h2>
              <p className="text-gray-600 text-sm">
                Formulaire de paiement à implémenter avec l'intégration Stancer
              </p>
            </div>
          </div>
        </Section>
      </div>
    </Container>
  );
};

export default PaymentPage;
