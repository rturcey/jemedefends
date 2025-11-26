'use client';

import { CheckCircle, Download } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Container, Section } from '@/components/ui';
import { Button } from '@/components/ui/button';

const ConfirmationPage: React.FC = () => {
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const success = sessionStorage.getItem('paymentSuccess');
    if (!success) {
      window.location.href = '/formulaire';
      return;
    }

    try {
      const data = JSON.parse(success);
      setPaymentData(data);
    } catch {
      window.location.href = '/formulaire';
    }
  }, []);

  if (!paymentData) {
    return (
      <Container className="py-8">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      <div className="max-w-2xl mx-auto text-center">
        <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Paiement confirmé !</h1>
        <p className="text-lg text-gray-600 mb-8">Votre lettre de mise en demeure est prête</p>

        {/* Actions de téléchargement */}
        <Section>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="font-bold text-gray-900 mb-4">📄 Télécharger votre lettre</h2>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl">
              <Download className="w-4 h-4 mr-2" />
              Télécharger le PDF
            </Button>
          </div>
        </Section>
      </div>
    </Container>
  );
};

export default ConfirmationPage;
