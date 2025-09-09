// ============================================================================
// COMPOSANT CRÉATEUR DE NOUVEAU GUIDE
// ============================================================================

// *** src/components/dev/NewGuideCreator.tsx ***
'use client';

import React, { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui';
import { YAML_GUIDE_TEMPLATE } from '@/lib/yaml-templates';
import YAMLEditor from './YAMLEditor';

export default function NewGuideCreator() {
  const [isCreating, setIsCreating] = useState(false);
  const [newSlug, setNewSlug] = useState('');

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleCreateGuide = () => {
    const slug = prompt('Slug du nouveau guide (ex: mon-nouveau-guide):');
    if (slug && /^[a-z0-9-]+$/.test(slug)) {
      setNewSlug(slug);
      setIsCreating(true);
    } else if (slug) {
      alert('Slug invalide. Utilisez uniquement des lettres minuscules, chiffres et tirets.');
    }
  };

  const handleGuideCreated = () => {
    setIsCreating(false);
    setNewSlug('');
    // Redirection vers le nouveau guide
    window.location.href = `/guides/${newSlug}`;
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCreateGuide}
        icon={<Plus className="w-4 h-4" />}
        className="text-green-600 hover:text-green-700 hover:bg-green-50"
      >
        Nouveau guide
      </Button>

      {/* Éditeur pour nouveau guide */}
      {isCreating && (
        <YAMLEditor
          slug={newSlug}
          isOpen={isCreating}
          initialYAML={YAML_GUIDE_TEMPLATE}
          onClose={() => setIsCreating(false)}
          onSaved={handleGuideCreated}
        />
      )}
    </>
  );
}
