// frontend/src/components/results/SignaturePad.tsx
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { X, Pen } from 'lucide-react';

interface SignaturePadProps {
  onSignatureChange: (signature: string | null) => void;
  disabled?: boolean;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSignatureChange, disabled = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  // Initialiser le canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurer le contexte
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    setContext(ctx);

    // Adapter au DPR pour netteté sur écrans haute résolution
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }, []);

  // Obtenir les coordonnées (souris ou touch)
  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      // Touch event
      if (e.touches.length === 0) return null;
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      // Mouse event
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  // Commencer à dessiner
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (disabled || !context) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    context.beginPath();
    context.moveTo(coords.x, coords.y);

    // Empêcher le scroll sur mobile
    if ('touches' in e) {
      e.preventDefault();
    }
  };

  // Dessiner
  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled || !context) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    context.lineTo(coords.x, coords.y);
    context.stroke();

    if ('touches' in e) {
      e.preventDefault();
    }
  };

  // Arrêter de dessiner
  const stopDrawing = () => {
    if (!isDrawing) return;

    setIsDrawing(false);
    setHasSignature(true);

    // Convertir en base64 et notifier le parent
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      onSignatureChange(dataUrl);
    }
  };

  // Effacer la signature
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSignatureChange(null);
  };

  return (
    <div className="relative">
      {/* Canvas de signature */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className={`
          w-full h-40 border-2 border-dashed rounded-xl bg-white cursor-crosshair
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'border-gray-300 hover:border-blue-400'}
          ${hasSignature ? 'border-blue-500' : ''}
          transition-colors
        `}
        style={{ touchAction: 'none' }}
      />

      {/* Placeholder quand pas de signature */}
      {!hasSignature && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-400">
          <Pen className="w-8 h-8 mb-2" />
          <p className="text-sm font-medium">Signez ici avec votre souris ou votre doigt</p>
        </div>
      )}

      {/* Bouton effacer */}
      {hasSignature && !disabled && (
        <button
          onClick={clearSignature}
          className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-md hover:bg-red-50 transition-colors group"
          type="button"
          aria-label="Effacer la signature"
        >
          <X className="w-5 h-5 text-gray-600 group-hover:text-red-600" />
        </button>
      )}

      {/* Instructions mobile */}
      <p className="text-xs text-gray-500 mt-2 text-center">
        {hasSignature ? '✓ Signature enregistrée' : 'Utilisez votre doigt ou stylet sur mobile'}
      </p>
    </div>
  );
};

export default SignaturePad;
