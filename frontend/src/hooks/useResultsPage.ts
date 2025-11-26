import { useState, useEffect } from 'react';

interface LetterData {
  id: string;
  content: string;
  status: 'draft' | 'ready' | 'paid';
}

interface UseResultsPageReturn {
  letterData: LetterData | null;
  loading: boolean;
  error: string | null;
  generateFreeVersion: () => Promise<string>;
  generatePaidVersion: (type: 'pdf' | 'postal', email: string, signature: string) => Promise<void>;
  previewLetter: (signature?: string) => Promise<void>;
  copyToClipboard: (text: string) => Promise<boolean>;
  clearError: () => void;
}

export function useResultsPage(): UseResultsPageReturn {
  const [letterData, setLetterData] = useState<LetterData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupération robuste de l'ID de lettre depuis sessionStorage
  const getLetterId = (): string | null => {
    if (typeof window === 'undefined') return null;

    // Essayer plusieurs sources
    let letterId = sessionStorage.getItem('currentLetterId');
    if (letterId) return letterId;

    const formData = sessionStorage.getItem('formData');
    if (formData) {
      try {
        const data = JSON.parse(formData);
        letterId = data.letter_id || data.letterId;
        if (letterId) {
          sessionStorage.setItem('currentLetterId', letterId);
          return letterId;
        }
      } catch (e) {
        console.warn('Erreur parsing formData:', e);
      }
    }

    const letterData = sessionStorage.getItem('letterData');
    if (letterData) {
      try {
        const data = JSON.parse(letterData);
        letterId = data.id || data.letter_id || data.letterId;
        if (letterId) {
          sessionStorage.setItem('currentLetterId', letterId);
          return letterId;
        }
      } catch (e) {
        console.warn('Erreur parsing letterData:', e);
      }
    }

    return null;
  };

  // Chargement initial des données de la lettre
  useEffect(() => {
    const letterId = getLetterId();
    if (letterId) {
      loadLetterData(letterId);
    }
  }, []);

  const loadLetterData = async (letterId: string) => {
    try {
      setLoading(true);
      setError(null);

      // Vraie route GET /api/v1/letters/{letter_id}
      const response = await fetch(`/api/v1/letters/${letterId}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Lettre non trouvée (${response.status})`);
      }

      const data = await response.json();
      setLetterData(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de chargement';
      setError(message);
      console.error('❌ Erreur chargement lettre:', message);
    } finally {
      setLoading(false);
    }
  };

  const generateFreeVersion = async (): Promise<string> => {
    const letterId = getLetterId();
    if (!letterId) throw new Error('Aucune lettre trouvée. Veuillez relancer le formulaire.');

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Génération version gratuite, ID:', letterId);

      const response = await fetch('/api/v1/letters/preview-basic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/html', // Garder HTML pour l'extraction
        },
        credentials: 'include',
        body: JSON.stringify({ letter_id: letterId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText || 'Génération impossible'}`);
      }

      const htmlContent = await response.text();

      if (!htmlContent.trim()) {
        throw new Error('Contenu vide reçu du serveur');
      }

      console.log('Version gratuite générée (HTML reçu), longueur:', htmlContent.length);

      // EXTRACTION PROPRE DU TEXTE
      const cleanText = extractTextForDisplay(htmlContent);

      console.log('Texte extrait proprement, longueur:', cleanText.length);

      // Stocker le texte propre (pas le HTML)
      setLetterData(prev => (prev ? { ...prev, content: cleanText } : null));

      return cleanText; // Retourner le texte propre
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de génération';
      setError(message);
      console.error('❌ Erreur génération gratuite:', message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generatePaidVersion = async (type: 'pdf' | 'postal', email: string, signature: string) => {
    const letterId = getLetterId();
    if (!letterId) throw new Error('Aucune lettre trouvée. Veuillez relancer le formulaire.');

    if (!email.includes('@') || !email.includes('.')) {
      throw new Error('Email invalide');
    }

    if (!signature) {
      throw new Error('Signature requise');
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Génération version payante, ID:', letterId, 'Type:', type);

      // Vraie route POST /api/v1/letters/generate-pdf
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
          add_watermark: true,
          pdf_type: 'final',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText || 'Génération impossible'}`);
      }

      // Vérifier que c'est bien un PDF
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/pdf')) {
        throw new Error(`Réponse non-PDF reçue: ${contentType}`);
      }

      const blob = await response.blob();
      console.log('PDF final généré, taille:', blob.size);

      // Pour l'instant, on télécharge directement
      // TODO: Intégrer avec votre système de paiement
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lettre-${type}-${letterId.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // TODO: Redirection vers paiement
      // if (data.payment_url) {
      //     window.location.href = data.payment_url;
      // }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de génération';
      setError(message);
      console.error('❌ Erreur génération payante:', message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const previewLetter = async (signature?: string): Promise<void> => {
    const letterId = getLetterId();
    if (!letterId) throw new Error('Aucune lettre trouvée. Veuillez relancer le formulaire.');

    try {
      setLoading(true);
      setError(null);

      console.log('🔍 Génération aperçu, ID:', letterId);

      // Vraie route POST /api/v1/letters/generate-pdf avec filigrane
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
          add_watermark: false,
          pdf_type: 'preview',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText || 'Aperçu impossible'}`);
      }

      // Vérifier que c'est bien un PDF
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/pdf')) {
        throw new Error(`Réponse non-PDF reçue: ${contentType}`);
      }

      const blob = await response.blob();
      console.log('Aperçu généré, taille:', blob.size);

      // Téléchargement automatique de l'aperçu
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `apercu-${letterId.substring(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur d'aperçu";
      setError(message);
      console.error('❌ Erreur aperçu:', message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Copie dans le presse-papier
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Texte copié dans le presse-papier');
      return true;
    } catch {
      console.warn('Clipboard API non disponible, fallback...');
      // Fallback pour navigateurs plus anciens
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const result = document.execCommand('copy');
        document.body.removeChild(textArea);
        if (result) {
          console.log('Texte copié via fallback');
          return true;
        }
      } catch (err) {
        document.body.removeChild(textArea);
        console.error('❌ Erreur copie fallback:', err);
      }

      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    letterData,
    loading,
    error,
    generateFreeVersion,
    generatePaidVersion,
    previewLetter,
    copyToClipboard,
    clearError,
  };
}
