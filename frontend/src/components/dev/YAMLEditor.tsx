'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { X, Save, RotateCcw, AlertTriangle, CheckCircle, Eye, Edit3 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui';
import { validateGuideYAML, yamlToGuidePage } from '@/lib/yaml-guide-converter';
import type { GuidePage } from '@/types/guides';

// Import dynamique de Monaco Editor pour éviter les problèmes SSR
const MonacoEditor = dynamic(() => import('@monaco-editor/react').then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
      <div className="text-sm text-gray-500">Chargement de l'éditeur...</div>
    </div>
  ),
});

// Types
interface YAMLEditorProps {
  slug: string;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

interface EditorTab {
  id: 'editor' | 'preview';
  label: string;
  icon: React.ReactNode;
}

interface ValidationState {
  isValid: boolean;
  errors: string[];
  preview?: GuidePage;
}

// Configuration des onglets
const TABS: EditorTab[] = [
  { id: 'editor', label: 'Édition', icon: <Edit3 className="w-4 h-4" /> },
  { id: 'preview', label: 'Aperçu', icon: <Eye className="w-4 h-4" /> },
];

export default function YAMLEditor({ slug, isOpen, onClose, onSaved }: YAMLEditorProps) {
  // États
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [yamlContent, setYamlContent] = useState('');
  const [originalContent, setOriginalContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({
    isValid: true,
    errors: [],
  });

  // Charger le YAML initial
  useEffect(() => {
    if (!isOpen || !slug) return;

    const loadYAML = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/dev/guides/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setYamlContent(data.yaml);
          setOriginalContent(data.yaml);
        } else {
          console.error('Erreur chargement YAML:', response.statusText);
        }
      } catch (error) {
        console.error('Erreur chargement YAML:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadYAML();
  }, [slug, isOpen]);

  // Validation en temps réel du YAML
  const validateContent = useCallback((content: string) => {
    if (!content.trim()) {
      setValidation({ isValid: false, errors: ['Contenu YAML vide'] });
      return;
    }

    const result = validateGuideYAML(content);

    if (result.valid) {
      try {
        const preview = yamlToGuidePage(content);
        setValidation({ isValid: true, errors: [], preview });
      } catch (error) {
        setValidation({
          isValid: false,
          errors: [
            `Erreur conversion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          ],
        });
      }
    } else {
      setValidation({ isValid: false, errors: result.errors });
    }
  }, []);

  // Gérer les changements dans l'éditeur
  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      const newContent = value || '';
      setYamlContent(newContent);
      setHasChanges(newContent !== originalContent);

      // Validation avec debounce
      const timeoutId = setTimeout(() => validateContent(newContent), 300);
      return () => clearTimeout(timeoutId);
    },
    [originalContent, validateContent],
  );

  // Sauvegarder
  const handleSave = useCallback(async () => {
    if (!validation.isValid) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/dev/guides/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yaml: yamlContent }),
      });

      if (response.ok) {
        setOriginalContent(yamlContent);
        setHasChanges(false);
        onSaved?.();
      } else {
        const error = await response.json();
        console.error('Erreur sauvegarde:', error);
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  }, [slug, yamlContent, validation.isValid, onSaved]);

  // Restaurer l'original
  const handleRestore = useCallback(() => {
    if (window.confirm('Restaurer le contenu original ? Les modifications seront perdues.')) {
      setYamlContent(originalContent);
      setHasChanges(false);
    }
  }, [originalContent]);

  // Configuration Monaco Editor
  const editorOptions = useMemo(
    () => ({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on' as const,
      lineNumbers: 'on' as const,
      folding: true,
      bracketMatching: 'always' as const,
      autoIndent: 'advanced' as const,
      formatOnPaste: true,
      formatOnType: true,
    }),
    [],
  );

  const [shortcuts, setShortcuts] = useState({
    save: 'Ctrl+S',
    close: 'Esc',
    format: 'Shift+Alt+F',
  });

  // Gestionnaire raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S pour sauvegarder
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (validation.isValid && hasChanges) {
          handleSave();
        }
      }

      // Escape pour fermer
      if (e.key === 'Escape' && !hasChanges) {
        onClose();
      }

      // Shift+Alt+F pour formater (délégué à Monaco)
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, validation.isValid, hasChanges, handleSave, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Éditeur YAML - {slug}</h2>
            <div className="flex items-center gap-4 mt-1">
              {/* Statut validation */}
              <div className="flex items-center gap-1 text-sm">
                {validation.isValid ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">YAML valide</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="text-red-600">{validation.errors.length} erreur(s)</span>
                  </>
                )}
              </div>

              {/* Indicateur changements */}
              {hasChanges && (
                <div className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  Modifications non sauvegardées
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRestore}
              disabled={!hasChanges}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Restaurer
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges || !validation.isValid}
              loading={isSaving}
              icon={<Save className="w-4 h-4" />}
            >
              Sauvegarder
            </Button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
                ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu */}
        <div className="flex-1 overflow-hidden">
          {/* Onglet Éditeur */}
          {activeTab === 'editor' && (
            <div className="h-full flex">
              {/* Éditeur Monaco */}
              <div className="flex-1">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-sm text-gray-500">Chargement...</div>
                  </div>
                ) : (
                  <MonacoEditor
                    height="100%"
                    language="yaml"
                    theme="vs"
                    value={yamlContent}
                    onChange={handleEditorChange}
                    options={editorOptions}
                  />
                )}
              </div>

              {/* Sidebar erreurs si nécessaires */}
              {!validation.isValid && (
                <div className="w-80 border-l border-gray-200 bg-red-50 p-4 overflow-y-auto">
                  <h3 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Erreurs de validation
                  </h3>
                  <ul className="space-y-2">
                    {validation.errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-700 bg-red-100 p-2 rounded">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Onglet Preview */}
          {activeTab === 'preview' && (
            <div className="h-full overflow-y-auto bg-gray-50">
              {validation.isValid && validation.preview ? (
                <YAMLPreview guide={validation.preview} />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Corrigez les erreurs YAML pour voir l'aperçu</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="border-t border-gray-200 px-4 py-2 bg-gray-50">
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span>
                <kbd className="px-1 py-0.5 bg-gray-200 rounded">Ctrl+S</kbd> Sauvegarder
              </span>
              <span>
                <kbd className="px-1 py-0.5 bg-gray-200 rounded">Esc</kbd> Fermer
              </span>
              <span>
                <kbd className="px-1 py-0.5 bg-gray-200 rounded">Shift+Alt+F</kbd> Formater
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface YAMLPreviewProps {
  guide: GuidePage;
}

function YAMLPreview({ guide }: YAMLPreviewProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header du guide */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{guide.metadata.title}</h1>
        <p className="text-gray-600">{guide.metadata.seo?.description}</p>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {guide.sections.map(section => (
          <div key={section.id} className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>

            {/* Preview du contenu rendu */}
            <div className="prose max-w-none">
              {typeof section.content === 'string' ? (
                <div dangerouslySetInnerHTML={{ __html: section.content }} />
              ) : (
                <div>Contenu React (non prévisualisable ici)</div>
              )}
            </div>

            {/* Métadonnées de la section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-x-4">
                <span>ID: {section.id}</span>
                <span>Type: {section.type || 'content'}</span>
                {section.steps && <span>Steps: {section.steps.length}</span>}
                {section.faqItems && <span>FAQ: {section.faqItems.length}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
