'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  Download,
  Mail,
  Shield,
  Lock,
  MessageCircle,
  X,
  Eye,
  CreditCard,
  FileText,
  Sparkles,
  Clock,
  AlertTriangle,
  Zap,
  Calendar,
  Check,
} from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

import { LegalReference } from '@/components';
import HomepageSchema from '@/components/seo/HomePageSchema';
import { Modal } from '@/components/ui';
import { extractCleanText, extractTextForClipboard } from '@/utils/textExtractor';

// ===============================
// NEW — Pricing constants & utils
// ===============================
const PRICES = {
  pdf: 4.99,
  postal: 12.99,
  relance: 1.99,
  relancePromo: 0.99,
  relancePostal: 9.99,
  relancePostalPromo: 8.99,
} as const;

const formatEuro = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

// Types
interface SignaturePadProps {
  onSignatureChange: (signature: string | null) => void;
  disabled?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

interface FreeModalProps extends Omit<ModalProps, 'children' | 'title'> {
  generateFreeVersion: () => Promise<void>;
  copyToClipboard: (text: string) => Promise<boolean>;
  loading: boolean;
  onUpgrade: () => void;
}

interface PaidModalProps extends Omit<ModalProps, 'children' | 'title'> {
  generatePaidVersion: (type: 'pdf' | 'postal', email: string, signature: string) => Promise<void>;
  previewLetter: (signature?: string) => Promise<void>;
  loading: boolean;
  defaultOption?: 'pdf' | 'postal'; // NEW — allow preselect
}

// Hook personnalisé pour la gestion des données
const useResultsPage = () => {
  const [letterData, setLetterData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupération de l'ID de lettre depuis sessionStorage
  const getLetterId = (): string | null => {
    let letterId = sessionStorage.getItem('currentLetterId');
    if (letterId) {
      return letterId;
    }
    const iframe =
      document.querySelector('iframe[title="Aperçu de votre lettre"]') ||
      document.querySelector('.pdf-preview iframe');

    if (iframe && (iframe as HTMLIFrameElement).src) {
      const match = (iframe as HTMLIFrameElement).src.match(
        /\/letters\/([0-9a-fA-F-]{36})\/preview/,
      );
      if (match) {
        letterId = match[1];
        sessionStorage.setItem('currentLetterId', letterId);
        return letterId;
      }
    }
    return null;
  };

  return {
    letterData,
    loading,
    error,
    generateFreeVersion: async () => {
      const letterId = getLetterId();
      if (!letterId) throw new Error('Aucune lettre trouvée. Veuillez relancer le formulaire.');

      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/v1/letters/preview-basic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ letter_id: letterId }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur ${response.status}: ${errorText || 'Génération impossible'}`);
        }

        const htmlContent = await response.text();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        const textContent = tempDiv.innerText;
        setLetterData(textContent);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur de génération';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    generatePaidVersion: async (type: 'pdf' | 'postal', email: string, signature: string) => {
      const letterId = getLetterId();
      if (!letterId) throw new Error('Aucune lettre trouvée. Veuillez relancer le formulaire.');
      if (!email.includes('@') || !email.includes('.')) throw new Error('Email invalide');
      if (!signature) throw new Error('Signature requise');

      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/v1/letters/generate-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
          },
          credentials: 'include',
          body: JSON.stringify({
            letter_id: letterId,
            signature_data_url: signature,
            add_watermark: false,
            pdf_type: 'final',
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur ${response.status}: ${errorText || 'Génération impossible'}`);
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/pdf')) {
          throw new Error(`Réponse non-PDF reçue: ${contentType}`);
        }

        const amount = type === 'postal' ? PRICES.postal : PRICES.pdf;

        // Stockage avant redirection paiement
        sessionStorage.setItem(
          'pendingPayment',
          JSON.stringify({
            type,
            email,
            letterId,
            amount,
          }),
        );

        // Redirection vers paiement (montant dynamique)
        window.location.href = `/paiement?type=${type}&amount=${amount}&email=${encodeURIComponent(
          email,
        )}`;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur de génération';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    previewLetter: async (signature?: string) => {
      const letterId = getLetterId();
      if (!letterId) throw new Error('Aucune lettre trouvée. Veuillez relancer le formulaire.');

      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/v1/letters/generate-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
          },
          credentials: 'include',
          body: JSON.stringify({
            letter_id: letterId,
            signature_data_url: signature || null,
            add_watermark: true,
            pdf_type: 'preview',
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur ${response.status}: ${errorText || 'Aperçu impossible'}`);
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/pdf')) {
          throw new Error(`Réponse non-PDF reçue: ${contentType}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erreur de génération';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    copyToClipboard: async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
      }
    },
    clearError: () => setError(null),
  };
};

// Composant Signature
const SignaturePad: React.FC<SignaturePadProps> = ({ onSignatureChange, disabled = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled) return;
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || disabled || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1f2937';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
    setHasSignature(true);
    onSignatureChange(canvas.toDataURL());
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    canvasRef.current?.getContext('2d')?.beginPath();
  };

  const clearSignature = () => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setHasSignature(false);
    onSignatureChange(null);
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }, []);

  return (
    <div className="space-y-3">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={150}
          className={`w-full h-32 border-2 rounded-xl transition-colors touch-none ${
            hasSignature ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-crosshair'}`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasSignature && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-gray-400 text-sm">Signez ici avec votre doigt</span>
          </div>
        )}
      </div>
      {hasSignature && (
        <button
          onClick={clearSignature}
          className="text-sm text-red-600 hover:text-red-700 underline"
        >
          Effacer la signature
        </button>
      )}
    </div>
  );
};

// Modal Version Gratuite
const FreeModal: React.FC<FreeModalProps> = ({
  isOpen,
  onClose,
  generateFreeVersion,
  copyToClipboard,
  loading,
  onUpgrade,
}) => {
  const [letterGenerated, setLetterGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [letterContent, setLetterContent] = useState<string>('');

  const handleGenerateFree = async () => {
    try {
      await generateFreeVersion();
      setLetterGenerated(true);

      const letterId = sessionStorage.getItem('currentLetterId');
      if (letterId) {
        const response = await fetch('/api/v1/letters/preview-basic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ letter_id: letterId }),
        });
        if (response.ok) {
          const htmlContent = await response.text();

          // ✅ UTILISER LA NOUVELLE FONCTION D'EXTRACTION
          const cleanText = extractCleanText(htmlContent);
          setLetterContent(cleanText);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la génération gratuite:', error);
    }
  };

  const handleCopy = async () => {
    // Récupérer le HTML original pour une extraction optimisée pour le presse-papier
    const letterId = sessionStorage.getItem('currentLetterId');
    let textToCopy = letterContent;

    if (letterId) {
      try {
        const response = await fetch('/api/v1/letters/preview-basic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ letter_id: letterId }),
        });
        if (response.ok) {
          const htmlContent = await response.text();
          // ✅ VERSION SPÉCIALE POUR PRESSE-PAPIER
          textToCopy = extractTextForClipboard(htmlContent);
        }
      } catch (error) {
        console.warn('Erreur récupération pour copie, utilisation du texte affiché');
      }
    }

    const success = await copyToClipboard(textToCopy || 'Erreur lors de la génération');
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setLetterGenerated(false);
      setLetterContent('');
      setCopied(false);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Votre texte de base">
      <div className="p-6 space-y-6">
        {!letterGenerated ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Texte juridiquement fondé
              </h4>
              <p className="text-gray-600 text-sm">
                Articles du Code de la consommation adaptés à votre situation
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left">
              <div className="font-medium text-green-900 mb-2">✅ Inclus dans le texte :</div>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Articles de loi personnalisés</li>
                <li>• Vos données et problème</li>
                <li>• Délais et recours légaux</li>
                <li>• Ton ferme mais courtois</li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
              <div className="font-medium text-amber-900 mb-2">⚠️ À prévoir :</div>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Impression sur papier à en-tête</li>
                <li>• Signature manuscrite</li>
                <li>• Envoi recommandé (5–8 €)</li>
                <li>• Suivi manuel de la réponse</li>
              </ul>
            </div>

            <button
              onClick={handleGenerateFree}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 disabled:opacity-50 font-medium transition-colors"
            >
              {loading ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Download className="w-5 h-5" />
              )}
              {loading ? 'Génération...' : 'Générer le texte'}
            </button>

            <div className="text-xs text-gray-500 text-center pt-2">
              Version professionnelle disponible ci-après
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Texte généré avec succès</span>
              </div>
              <p className="text-sm text-green-800">
                Votre mise en demeure est basée sur les articles <LegalReference code="L217_3" /> et
                suivants du Code de la consommation
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 max-h-64 overflow-y-auto">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                {letterContent || 'Chargement du contenu...'}
              </pre>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="font-medium text-blue-900 mb-2">💡 Conseils d'envoi :</div>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Imprimez sur papier de qualité</li>
                <li>• Envoyez en recommandé avec AR</li>
                <li>• Conservez l'accusé de réception</li>
                <li>• Relancez après 30 jours sans réponse</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 font-medium transition-colors"
              >
                <Mail className="w-4 h-4" />
                {copied ? 'Copié !' : 'Copier le texte'}
              </button>

              <button
                onClick={onUpgrade}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-blue-700 font-medium transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Version pro
              </button>
            </div>

            <div className="text-xs text-gray-500 text-center space-y-1">
              <div>
                Lettre générée à partir de vos informations • Conforme au Code de la consommation
              </div>
              <div>
                <a href="/politique-confidentialite" className="underline hover:text-gray-700">
                  Protection des données RGPD
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

// Modal Version Payante
const PaidModal: React.FC<PaidModalProps> = ({
  isOpen,
  onClose,
  generatePaidVersion,
  previewLetter,
  loading,
  defaultOption = 'postal', // NEW — default to high-CVR option
}) => {
  const [email, setEmail] = useState('');
  const [signature, setSignature] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<'pdf' | 'postal'>(defaultOption);
  const [withRelanceOffer, setWithRelanceOffer] = useState(false); // NEW — simpler toggle

  // Keep defaultOption in sync when modal reopens
  useEffect(() => {
    if (isOpen) setSelectedOption(defaultOption);
  }, [isOpen, defaultOption]);

  const canProceed = email && signature && email.includes('@');

  const basePrice = selectedOption === 'pdf' ? PRICES.pdf : PRICES.postal;

  // By default we display promo pricing in the UI (offer of the moment)
  const relancePrice = selectedOption === 'pdf' ? PRICES.relancePromo : PRICES.relancePostalPromo;
  const relanceFull = selectedOption === 'pdf' ? PRICES.relance : PRICES.relancePostal;
  const total = basePrice + (withRelanceOffer ? relancePrice : 0);

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setSignature(null);
      setWithRelanceOffer(false);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Service professionnel">
      <div className="p-6 space-y-6">
        {/* Aperçu gratuit */}
        <div className="border border-blue-200 rounded-xl p-4 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-blue-900">Aperçu gratuit disponible</div>
              <div className="text-sm text-blue-700">Prévisualisez votre lettre avec filigrane</div>
            </div>
            <button
              onClick={() => previewLetter()}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
            >
              <Eye className="w-4 h-4" />
              Voir l'aperçu
            </button>
          </div>
        </div>

        {/* Sélection de formule */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Choisissez votre formule :</h4>

          <div className="grid grid-cols-1 gap-3">
            {/* Option PDF */}
            <div
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                selectedOption === 'pdf'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedOption('pdf')}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === 'pdf' ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                    }`}
                  >
                    {selectedOption === 'pdf' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <h5 className="font-bold text-gray-900">PDF professionnel</h5>
                </div>
                <span className="text-lg font-bold text-blue-600">{formatEuro(PRICES.pdf)}</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 ml-7">
                <li>✓ Mise en page soignée avec logo</li>
                <li>✓ Signature intégrée</li>
                <li>✓ Support email 60 jours</li>
                <li>✓ Livraison immédiate</li>
              </ul>
            </div>

            {/* Option Postal */}
            <div
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all relative ${
                selectedOption === 'postal'
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedOption('postal')}
            >
              <div className="absolute -top-2 -right-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg">
                POPULAIRE
              </div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === 'postal'
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedOption === 'postal' && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <h5 className="font-bold text-gray-900">PDF + Envoi automatique</h5>
                </div>
                <span className="text-lg font-bold text-blue-600">{formatEuro(PRICES.postal)}</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 ml-7">
                <li>✓ Tous les avantages du PDF</li>
                <li>✓ Impression et envoi recommandé AR</li>
                <li>✓ Suivi postal en ligne</li>
                <li>✓ Preuve de réception légale</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Offre de relance (toggle simple) */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={withRelanceOffer}
              onChange={() => setWithRelanceOffer(v => !v)}
              className="mt-1 accent-amber-600 w-4 h-4"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-amber-900 text-sm">
                  Ajouter la relance à J+30
                </span>
                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  -50%
                </span>
              </div>
              <p className="text-sm text-amber-800">
                Relance automatique après 30 jours :{' '}
                <span className="line-through">{formatEuro(relanceFull)}</span>{' '}
                <span className="font-bold text-green-700">→ {formatEuro(relancePrice)}</span>
              </p>
              {selectedOption === 'postal' && (
                <p className="text-xs text-amber-700">Inclut l’envoi recommandé automatique</p>
              )}
            </div>
          </label>
        </div>

        {/* Résumé */}
        <div className="bg-gray-50 rounded-xl p-4">
          <h5 className="font-semibold text-gray-900 mb-3">Récapitulatif :</h5>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{selectedOption === 'pdf' ? 'PDF professionnel' : 'PDF + Envoi postal'}</span>
              <span>{formatEuro(basePrice)}</span>
            </div>
            {withRelanceOffer && (
              <div className="flex justify-between text-amber-700">
                <span>Relance J+30 (promo)</span>
                <span>+{formatEuro(relancePrice)}</span>
              </div>
            )}
            <div className="border-t border-gray-300 pt-2 font-bold flex justify-between">
              <span>Total</span>
              <span>{formatEuro(total)}</span>
            </div>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email de livraison *
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="votre@email.com"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required
          />
        </div>

        {/* Signature */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Votre signature *</label>
          <SignaturePad onSignatureChange={setSignature} disabled={loading} />
        </div>

        {/* Actions */}
        <div className="border-t border-gray-100 pt-6">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="p-3 border-2 border-gray-300 rounded-xl hover:border-gray-400 disabled:opacity-50 font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={() => generatePaidVersion(selectedOption, email, signature!)}
              disabled={!canProceed || loading}
              className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 font-medium transition-all"
            >
              {loading ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              {loading ? 'Traitement...' : `Commander ${formatEuro(total)}`}
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Paiement sécurisé
            </div>
            <div className="flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Données protégées
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Livraison immédiate
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

// COMPOSANT PRINCIPAL OPTIMISÉ MOBILE-FIRST
export default function ResultsPage() {
  const [freeModalOpen, setFreeModalOpen] = useState(false);
  const [paidModalOpen, setPaidModalOpen] = useState(false);
  const [paidDefaultOption, setPaidDefaultOption] = useState<'pdf' | 'postal'>('postal'); // NEW

  const {
    loading,
    error,
    generateFreeVersion,
    generatePaidVersion,
    previewLetter,
    copyToClipboard,
    clearError,
  } = useResultsPage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* JSON-LD SEO (évite "HomepageSchema is not defined" et variable non utilisée) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HomepageSchema) }}
      />

      {/* Header */}
      <div className="pt-6 sm:pt-8 pb-4 sm:pb-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold mb-4 sm:mb-6"
          >
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            Lettre générée avec succès
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg"
          >
            Téléchargez votre lettre gratuitement ou choisissez notre service professionnel
          </motion.p>
        </div>
      </div>

      {/* Cards principales */}
      <div className="max-w-4xl mx-auto px-4 space-y-4 sm:space-y-6 mb-8 sm:mb-12">
        {/* Card Gratuite */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-50 rounded-xl border border-gray-200 p-4 sm:p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Texte de base</h3>
                  <span className="inline-block bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                    GRATUIT
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3">
                Articles de loi personnalisés, à imprimer et signer vous-même
              </p>

              <div className="text-xs text-gray-500">
                ⚠️ Nécessite : impression, signature manuscrite, envoi recommandé (5–8 €), suivi
                manuel
              </div>
            </div>

            <button
              onClick={() => setFreeModalOpen(true)}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 font-medium flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              Télécharger
            </button>
          </div>
        </motion.div>

        {/* Carte Service pro + Grille 2 colonnes égales (PDF / Postal) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border-2 border-blue-200 p-6 sm:p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-xs sm:text-sm font-medium rounded-bl-xl">
            RECOMMANDÉ
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Service professionnel
                </h3>
                <span className="text-blue-600 font-medium">
                  À partir de {formatEuro(PRICES.pdf)}
                </span>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-green-900 mb-1">
                    📄 Aperçu PDF gratuit disponible
                  </div>
                  <div className="text-sm text-green-700">
                    Voyez le rendu professionnel avant de commander
                  </div>
                </div>
                <button
                  onClick={() => previewLetter()}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
                >
                  <Eye className="w-4 h-4" />
                  Voir
                </button>
              </div>
            </div>
          </div>

          {/* Grille synchronisée (hauteurs =) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-fr">
            {/* PDF seul */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col">
              <div className="flex-1">
                <div className="font-bold text-blue-900 text-center mb-2">PDF seul</div>
                <div className="text-2xl font-bold text-blue-600 text-center mb-3">
                  {formatEuro(PRICES.pdf)}
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ PDF professionnel avec logo</li>
                  <li>✓ Signature électronique intégrée</li>
                  <li>✓ Support email 60 jours</li>
                </ul>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => {
                    setPaidDefaultOption('pdf');
                    setPaidModalOpen(true);
                  }}
                  className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                >
                  Commander {formatEuro(PRICES.pdf)}
                </button>
              </div>
            </div>

            {/* PDF + Envoi postal */}
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-blue-300 rounded-xl p-4 flex flex-col relative">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow">
                POPULAIRE
              </div>
              <div className="flex-1 pt-2">
                <div className="font-bold text-blue-900 text-center mb-2">PDF + Envoi postal</div>
                <div className="text-2xl font-bold text-blue-600 text-center mb-3">
                  {formatEuro(PRICES.postal)}
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ Tous les avantages du PDF</li>
                  <li>✓ Envoi recommandé AR automatique</li>
                  <li>✓ Suivi postal en ligne</li>
                  <li>✓ Preuve de réception légale</li>
                </ul>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => {
                    setPaidDefaultOption('postal');
                    setPaidModalOpen(true);
                  }}
                  className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                  Commander {formatEuro(PRICES.postal)}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Section Relance */}
      <div className="max-w-4xl mx-auto px-4 mb-8 sm:mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 sm:p-8"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Et si votre vendeur ne répond pas ?
            </h2>
            <p className="text-gray-700 text-base sm:text-lg">
              30 jours après votre première lettre, nous vous proposons automatiquement une{' '}
              <strong>lettre de relance renforcée</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-amber-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Relance PDF seule</h3>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-400 line-through">
                    {formatEuro(PRICES.relance)}
                  </div>
                  <div className="text-xl font-bold text-amber-600">
                    {formatEuro(PRICES.relancePromo)}
                  </div>
                </div>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Lettre de relance durcie
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Rappel des délais légaux
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Mention des recours possibles
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-4 sm:p-6 border border-amber-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Relance + Envoi auto</h3>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-400 line-through">
                    {formatEuro(PRICES.relancePostal)}
                  </div>
                  <div className="text-xl font-bold text-amber-600">
                    {formatEuro(PRICES.relancePostalPromo)}
                  </div>
                </div>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  PDF de relance professionnel
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Envoi recommandé automatique
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  Suivi postal complet
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
              <div className="text-sm text-blue-800">
                <Zap className="w-4 h-4 inline mr-2" />
                <strong>Offre de lancement :</strong> -50% sur la lettre de relance si vous la
                commandez maintenant.
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Trust indicators */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-white/80 backdrop-blur rounded-2xl p-4 sm:p-6 shadow-lg border border-white/20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
            <div className="space-y-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="font-semibold text-gray-900 text-sm sm:text-base">
                Juridiquement fondé
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Code de la consommation</div>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="font-semibold text-gray-900 text-sm sm:text-base">
                Données protégées
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Hébergement français sécurisé</div>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="font-semibold text-gray-900 text-sm sm:text-base">Support inclus</div>
              <div className="text-xs sm:text-sm text-gray-600">Aide par email</div>
            </div>
          </div>
        </div>
      </div>

      {/* Error handling */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-red-100 border border-red-200 rounded-xl p-4 shadow-lg z-40"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-semibold text-red-800">Erreur</div>
                <div className="text-sm text-red-700">{error}</div>
              </div>
              <button onClick={clearError} className="text-red-600 hover:text-red-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disclaimer juridique */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-sm font-bold">!</span>
            </div>
            <div className="text-sm text-amber-800">
              <div className="font-semibold mb-1">Information importante</div>
              <p>
                Ce service génère des modèles de lettres basés sur le Code de la consommation
                (articles <LegalReference code="L217_3" /> et suivants). Il ne constitue pas un
                conseil juridique personnalisé. Pour des situations complexes, consultez un
                professionnel du droit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        <FreeModal
          key="free-modal"
          isOpen={freeModalOpen}
          onClose={() => setFreeModalOpen(false)}
          generateFreeVersion={generateFreeVersion}
          copyToClipboard={copyToClipboard}
          loading={loading}
          onUpgrade={() => {
            setFreeModalOpen(false);
            setPaidDefaultOption('postal');
            setPaidModalOpen(true);
          }}
        />
        <PaidModal
          key="paid-modal"
          isOpen={paidModalOpen}
          onClose={() => setPaidModalOpen(false)}
          generatePaidVersion={generatePaidVersion}
          previewLetter={previewLetter}
          loading={loading}
          defaultOption={paidDefaultOption} // NEW — preselect
        />
      </AnimatePresence>
    </div>
  );
}
