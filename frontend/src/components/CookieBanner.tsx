'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, Settings, X, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
}

const CONSENT_VERSION = '1.0.0';
const CONSENT_KEY = 'cookie-consent';

/**
 * Cookie Banner RGPD-compliant
 * - Mobile-first design
 * - Lazy loaded après 3 secondes
 * - Stockage localStorage minimal
 * - Respect total du RGPD
 */
export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true, // Toujours true (cookies essentiels)
    analytics: false,
    marketing: false,
    timestamp: '',
    version: CONSENT_VERSION,
  });

  useEffect(() => {
    // Vérifier si le consentement existe déjà
    const checkExistingConsent = () => {
      try {
        const stored = localStorage.getItem(CONSENT_KEY);
        if (stored) {
          const parsedConsent = JSON.parse(stored);
          // Vérifier si la version est à jour
          if (parsedConsent.version === CONSENT_VERSION) {
            return true; // Consentement valide existe
          }
        }
      } catch (e) {
        console.error('Erreur lecture consentement:', e);
      }
      return false;
    };

    // Afficher le banner seulement si pas de consentement valide
    if (!checkExistingConsent()) {
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (newConsent: Partial<CookieConsent>) => {
    const finalConsent = {
      ...consent,
      ...newConsent,
      timestamp: new Date().toISOString(),
      version: CONSENT_VERSION,
    };

    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(finalConsent));

      // Déclencher un événement pour notifier les autres composants
      window.dispatchEvent(new CustomEvent('cookieConsentUpdate', { detail: finalConsent }));

      // Fermer le banner
      setIsVisible(false);
    } catch (e) {
      console.error('Erreur sauvegarde consentement:', e);
    }
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const acceptNecessary = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    });
  };

  const acceptSelected = () => {
    saveConsent(consent);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          'fixed bottom-0 left-0 right-0 z-[9999]',
          'bg-white shadow-2xl border-t border-gray-200',
          'safe-bottom', // Pour les iPhones avec encoche
        )}
      >
        {/* Version mobile compacte */}
        <div className="md:hidden">
          <div className="px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <Cookie className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 leading-tight">
                  Nous utilisons des cookies pour améliorer votre expérience.
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-blue-600 font-medium ml-1 inline-flex items-center"
                  >
                    Détails
                    <ChevronDown
                      className={cn(
                        'h-3 w-3 ml-0.5 transition-transform',
                        showDetails && 'rotate-180',
                      )}
                    />
                  </button>
                </p>
              </div>
            </div>

            {/* Détails extensibles */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 overflow-hidden"
                >
                  <div className="space-y-2 text-xs">
                    {/* Cookies nécessaires */}
                    <label className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={true}
                        disabled
                        className="mt-0.5 h-4 w-4 text-gray-400"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Essentiels</div>
                        <div className="text-gray-600 mt-0.5">
                          Requis pour le fonctionnement du site
                        </div>
                      </div>
                    </label>

                    {/* Analytics */}
                    <label className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={consent.analytics}
                        onChange={e => setConsent({ ...consent, analytics: e.target.checked })}
                        className="mt-0.5 h-4 w-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Statistiques</div>
                        <div className="text-gray-600 mt-0.5">Nous aident à améliorer le site</div>
                      </div>
                    </label>

                    {/* Marketing */}
                    <label className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={consent.marketing}
                        onChange={e => setConsent({ ...consent, marketing: e.target.checked })}
                        className="mt-0.5 h-4 w-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">Marketing</div>
                        <div className="text-gray-600 mt-0.5">Publicités personnalisées</div>
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Boutons d'action mobile */}
            <div className="mt-3 flex flex-col gap-2">
              <button
                onClick={acceptAll}
                className="w-full py-2.5 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Accepter tout
              </button>
              {showDetails ? (
                <button
                  onClick={acceptSelected}
                  className="w-full py-2.5 px-4 bg-gray-100 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Accepter la sélection
                </button>
              ) : (
                <button
                  onClick={acceptNecessary}
                  className="w-full py-2.5 px-4 bg-gray-100 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Essentiels uniquement
                </button>
              )}
            </div>

            {/* Lien politique de confidentialité */}
            <div className="mt-3 text-center">
              <a
                href="/politique-confidentialite"
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>

        {/* Version desktop */}
        <div className="hidden md:block">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Cookie className="h-6 w-6 text-blue-600" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nous respectons votre vie privée
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Je me défends utilise des cookies pour vous garantir la meilleure expérience.
                  Certains cookies sont essentiels au fonctionnement du site, d'autres nous aident à
                  l'améliorer et à mieux comprendre vos besoins.
                </p>

                {/* Options détaillées desktop */}
                {showDetails && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={true}
                          disabled
                          className="mt-1 h-4 w-4 text-gray-400"
                        />
                        <div>
                          <div className="font-medium text-sm text-gray-900">Essentiels</div>
                          <div className="text-xs text-gray-600 mt-1">
                            Session, préférences, sécurité
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={consent.analytics}
                          onChange={e => setConsent({ ...consent, analytics: e.target.checked })}
                          className="mt-1 h-4 w-4 text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-sm text-gray-900">Statistiques</div>
                          <div className="text-xs text-gray-600 mt-1">
                            Google Analytics, performance
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg">
                      <label className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={consent.marketing}
                          onChange={e => setConsent({ ...consent, marketing: e.target.checked })}
                          className="mt-1 h-4 w-4 text-blue-600"
                        />
                        <div>
                          <div className="font-medium text-sm text-gray-900">Marketing</div>
                          <div className="text-xs text-gray-600 mt-1">
                            Publicités ciblées, remarketing
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Boutons desktop */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={acceptAll}
                    className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Accepter tout
                  </button>

                  {showDetails ? (
                    <button
                      onClick={acceptSelected}
                      className="px-6 py-2.5 bg-gray-200 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Accepter la sélection
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={acceptNecessary}
                        className="px-6 py-2.5 bg-gray-200 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Essentiels uniquement
                      </button>
                      <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="px-6 py-2.5 text-gray-700 text-sm font-medium hover:text-gray-900 transition-colors"
                      >
                        Personnaliser
                      </button>
                    </>
                  )}

                  <a
                    href="/politique-confidentialite"
                    className="ml-auto text-sm text-gray-500 hover:text-gray-700"
                  >
                    Politique de confidentialité
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
