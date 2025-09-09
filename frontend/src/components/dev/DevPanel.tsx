'use client';

import React from 'react';
import { X, Trash2, RefreshCw, Code2 } from 'lucide-react';
import { useDevGuides } from '@/hooks/useDevGuides';
import { Button } from '@/components/ui';

interface DevPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DevPanel({ isOpen, onClose }: DevPanelProps) {
  const { overrides, isLoading, refreshOverrides, deleteOverride } = useDevGuides();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  if (!isOpen) return null;

  const handleDeleteOverride = async (slug: string) => {
    if (window.confirm(`Supprimer l'override pour "${slug}" ?`)) {
      const success = await deleteOverride(slug);
      if (success) {
        // Optionnel : message de succès
        console.log(`Override ${slug} supprimé`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-purple-600" />
              Panneau Développeur
            </h2>
            <p className="text-sm text-gray-600 mt-1">Gérer les overrides YAML</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshOverrides}
              disabled={isLoading}
              icon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
            >
              Actualiser
            </Button>
            <NewGuideCreator />

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-gray-500">Chargement...</div>
            </div>
          ) : overrides.length === 0 ? (
            <div className="text-center py-8">
              <Code2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun override actif</h3>
              <p className="text-gray-600">Les guides modifiés apparaîtront ici</p>
            </div>
          ) : (
            <div className="space-y-3">
              {overrides.map(override => (
                <div
                  key={override.slug}
                  className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{override.slug}</h4>
                    <p className="text-sm text-gray-600">
                      Modifié le {new Date(override.lastModified).toLocaleString('fr-FR')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/guides/${override.slug}`, '_blank')}
                    >
                      Voir
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteOverride(override.slug)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      icon={<Trash2 className="w-4 h-4" />}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
