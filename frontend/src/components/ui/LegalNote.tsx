// frontend/src/components/ui/LegalNote.tsx - VERSION V2
// Adapté au nouveau système legal avec legalAPI et hooks
// Mobile-first, performance optimisée, TypeScript strict

'use client';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldAlert, ChevronDown, Info, AlertTriangle } from 'lucide-react';
import * as React from 'react';
import { useState, useMemo } from 'react';

import { useLegalArticle } from '@/legal/hooks';
import { type LegalArticleId } from '@/legal/registry';

import DisclaimerBox from './DisclaimerBox';
import LegalReference from './LegalReference';

// Types pour la configuration d'un article
interface ArticleConfig {
  /** ID de l'article légal */
  id: LegalArticleId;

  /** Affiche le texte complet de l'article */
  showFull?: boolean;

  /** Limite le texte à X caractères */
  clampChars?: number;

  /** Texte d'explication personnalisé pour cet article */
  customExplanation?: string;
}

// Types pour les exemples
interface ExampleConfig {
  /** Texte de l'exemple à afficher */
  text: string;

  /** Articles légaux liés à cet exemple */
  relatedArticles?: LegalArticleId[];
}

interface LegalNoteProps {
  /** Titre de la note légale */
  title?: string;

  /** Articles à inclure dans la note */
  articles?: ArticleConfig[];

  /** Explication générale sur le contexte légal */
  explanation?: React.ReactNode;

  /** Exemples concrets d'application */
  examples?: ExampleConfig[];

  /** Disclaimer spécifique (optionnel) */
  disclaimer?: React.ReactNode;

  /** État initial (ouvert/fermé) */
  defaultOpen?: boolean;

  /** Classes CSS additionnelles */
  className?: string;

  /** ID pour l'accessibilité */
  idPrefix?: string;

  /** Cache le contenu textuel et ne montre que les références */
  hideText?: boolean;

  /** Variante d'affichage */
  variant?: 'default' | 'compact' | 'expanded';

  /** Taille du composant */
  size?: 'sm' | 'md' | 'lg';
}

// Hook pour charger les articles de manière optimisée
function useLegalArticles(articleConfigs: ArticleConfig[]) {
  const articleResults = articleConfigs.map(config =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useLegalArticle(config.id, { immediate: false }),
  );

  return useMemo(() => {
    return articleConfigs.map((config, index) => ({
      config,
      ...articleResults[index],
    }));
  }, [articleConfigs, articleResults]);
}

// Composant pour afficher un article individuel
function ArticleDisplay({
  config,
  article,
  loading,
  error,
  variant = 'default',
}: {
  config: ArticleConfig;
  article: any;
  loading: boolean;
  error: Error | null;
  variant?: 'default' | 'compact';
}) {
  // Gestion du texte avec troncature
  const displayText = useMemo(() => {
    if (!article?.text) return null;

    if (config.clampChars && article.text.length > config.clampChars) {
      const truncated = article.text.slice(0, config.clampChars).replace(/\s+\S*$/, '');
      return {
        text: truncated + '…',
        isTruncated: true,
        fullText: article.text,
      };
    }

    return {
      text: article.text,
      isTruncated: false,
      fullText: article.text,
    };
  }, [article?.text, config.clampChars]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span>Erreur de chargement de l'article {config.id}</span>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <Info className="w-4 h-4 flex-shrink-0" />
        <span>Article {config.id} non disponible</span>
      </div>
    );
  }

  return (
    <div className={clsx('space-y-3', variant === 'compact' && 'space-y-2')}>
      {/* Header avec référence */}
      <div className="flex items-center gap-2">
        <LegalReference code={config.id} variant="badge" size="sm" showStatus showExternalLink />
      </div>

      {/* Explication personnalisée */}
      {config.customExplanation && (
        <p
          className={clsx(
            'text-gray-700 leading-relaxed',
            variant === 'compact' ? 'text-sm' : 'text-base',
          )}
        >
          {config.customExplanation}
        </p>
      )}

      {/* Texte de l'article si demandé */}
      {config.showFull && displayText && (
        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-200">
          <p
            className={clsx(
              'text-gray-800 leading-relaxed font-mono',
              variant === 'compact' ? 'text-xs' : 'text-sm',
            )}
          >
            {displayText.text}
          </p>

          {displayText.isTruncated && (
            <button
              className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              onClick={() => {
                // Logique pour afficher le texte complet (modal, expansion, etc.)
                console.log('Expand full text:', displayText.fullText);
              }}
            >
              Voir le texte complet →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Composant pour afficher les exemples
function ExamplesSection({
  examples,
  variant = 'default',
}: {
  examples: ExampleConfig[];
  variant?: 'default' | 'compact';
}) {
  if (!examples.length) return null;

  return (
    <div className="space-y-3">
      <h4
        className={clsx(
          'font-medium text-gray-900',
          variant === 'compact' ? 'text-sm' : 'text-base',
        )}
      >
        Exemples d'application
      </h4>

      <ul className="space-y-2">
        {examples.map((example, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>

            <div className="flex-1">
              <p
                className={clsx(
                  'text-gray-700 leading-relaxed',
                  variant === 'compact' ? 'text-sm' : 'text-base',
                )}
              >
                {example.text}
              </p>

              {example.relatedArticles && example.relatedArticles.length > 0 && (
                <div className="mt-1 flex gap-1 flex-wrap">
                  {example.relatedArticles.map(articleId => (
                    <LegalReference key={articleId} code={articleId} variant="inline" size="sm" />
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Composant principal LegalNote V2
export default function LegalNote({
  title = 'Références légales',
  articles = [],
  explanation,
  examples = [],
  disclaimer,
  defaultOpen = false,
  className,
  idPrefix = 'legalnote',
  hideText = false,
  variant = 'default',
  size = 'md',
}: LegalNoteProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = `${idPrefix}-content`;
  const buttonId = `${idPrefix}-button`;

  // Chargement optimisé des articles
  const articlesData = useLegalArticles(articles);

  // Classes CSS dynamiques
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const variantClasses = {
    default: 'bg-blue-50 border-blue-200',
    compact: 'bg-gray-50 border-gray-200',
    expanded: 'bg-white border-gray-300 shadow-lg',
  };

  // Gestion du comptage d'articles chargés
  const loadedCount = articlesData.filter(item => item.article && !item.error).length;
  const totalCount = articles.length;

  return (
    <div
      className={clsx(
        'rounded-xl border transition-all duration-200',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {/* Header avec bouton d'expansion */}
      <button
        id={buttonId}
        className={clsx(
          'w-full flex items-center justify-between gap-3 p-4 text-left',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 rounded-xl',
          'hover:bg-white/50 transition-colors',
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            {totalCount > 0 && (
              <p className="text-sm text-gray-600 mt-0.5">
                {loadedCount > 0
                  ? `${loadedCount}/${totalCount} article(s) chargé(s)`
                  : `${totalCount} articles disponible(s)`}
              </p>
            )}
          </div>
        </div>

        <ChevronDown
          className={clsx(
            'w-5 h-5 text-gray-500 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {/* Contenu expandable */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-6">
              {/* Explication générale */}
              {explanation && !hideText && (
                <div className="text-gray-700 leading-relaxed">{explanation}</div>
              )}

              {/* Articles légaux */}
              {articles.length > 0 && (
                <div className="space-y-4">
                  {variant !== 'compact' && (
                    <h4 className="font-medium text-gray-900 text-base">Articles applicables</h4>
                  )}

                  <div className="space-y-4">
                    {articlesData.map((item, index) => (
                      <ArticleDisplay
                        key={item.config.id}
                        config={item.config}
                        article={item.article}
                        loading={item.loading}
                        error={item.error}
                        variant={variant === 'expanded' ? 'default' : 'compact'}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Exemples */}
              {examples.length > 0 && (
                <ExamplesSection
                  examples={examples}
                  variant={variant === 'expanded' ? 'default' : 'compact'}
                />
              )}

              {/* Disclaimer */}
              {disclaimer && <DisclaimerBox variant="legal">{disclaimer}</DisclaimerBox>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
