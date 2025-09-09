'use client';

import React, { useState } from 'react';
import { Edit3, Code2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui';
import YAMLEditor from './YAMLEditor';

interface DevEditButtonProps {
  slug: string;
  className?: string;
  onGuideUpdated?: () => void;
}

export default function DevEditButton({
  slug,
  className = '',
  onGuideUpdated,
}: DevEditButtonProps) {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // N'afficher qu'en développement
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleGuideUpdated = () => {
    // Forcer le rechargement de la page pour voir les changements
    // Alternative plus douce : invalidation du cache + re-render
    window.location.reload();
  };

  return (
    <>
      {/* Bouton flottant fixe */}
      <div className={`fixed bottom-4 right-4 z-40 flex flex-col gap-2 ${className}`}>
        {/* Bouton principal */}
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsEditorOpen(true)}
          className="shadow-lg hover:shadow-xl bg-purple-600 hover:bg-purple-700 border-purple-600"
          icon={<Edit3 className="w-4 h-4" />}
        >
          <span className="hidden sm:inline">Éditer YAML</span>
        </Button>

        {/* Infos dev */}
        <div className="bg-black/75 text-white text-xs px-2 py-1 rounded text-center">DEV</div>
      </div>

      {/* Éditeur modal */}
      <YAMLEditor
        slug={slug}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSaved={handleGuideUpdated}
      />
    </>
  );
}
