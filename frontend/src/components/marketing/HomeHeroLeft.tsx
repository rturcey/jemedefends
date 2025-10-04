'use client';
import { motion } from 'framer-motion';
import { Shield, Zap, FileText, Mail, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import * as React from 'react';

import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

export default function HomeHeroLeft() {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const { shouldUseSimpleAnimations } = useMobileOptimization();

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: shouldUseSimpleAnimations ? 0.1 : 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: shouldUseSimpleAnimations ? 0 : 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldUseSimpleAnimations ? 0.2 : 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col justify-center min-h-[calc(100vh-160px)] md:min-h-0 py-8 md:py-0"
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? 'visible' : 'hidden'}
    >
      {/* ===============================================
          SECTION 1 : BANDEAU GRATUIT
          Espacement : +16px après
          =============================================== */}
      <motion.div variants={itemVariants} className="mb-8 md:mb-5">
        <Skeleton loading={!isLoaded} className="h-18 md:h-8 w-full">
          {/* Mobile : Bandeau premium harmonisé */}
          <div className="md:hidden">
            <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border border-green-200 rounded-2xl shadow-md">
              <div className="flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-sm">
                <Sparkles className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="text-green-900 font-bold text-[17px] leading-tight">
                  Service 100% gratuit
                </div>
                <div className="text-gray-700 text-xs font-medium mt-1">
                  Options de confort disponibles
                </div>
              </div>
            </div>
          </div>

          {/* Desktop : Badges originaux */}
          <div className="hidden md:flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-green-600" />
              <span className="text-sm font-semibold text-green-900">100% Gratuit</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
              <Zap className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">3 minutes max</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full">
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">Conforme à la loi</span>
            </div>
          </div>
        </Skeleton>
      </motion.div>

      {/* ===============================================
          SECTION 2 : TITRE PRINCIPAL
          Espacement : +12px entre lignes du titre
          =============================================== */}
      <motion.div variants={itemVariants} className="mb-5 md:mb-5">
        <Skeleton loading={!isLoaded} lines={3} className="h-6">
          <h1 className="text-[34px] sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
            <span className="block text-gray-900">Produit défaillant ?</span>
            <span className="block text-blue-700 mt-3">
              Obtenez{' '}
              <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                réparation
              </span>
            </span>
            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl text-gray-600 font-semibold mt-3">
              en moins de 3 minutes
            </span>
          </h1>
        </Skeleton>
      </motion.div>

      {/* ===============================================
          SECTION 3 : DESCRIPTION + PROMESSE
          Badge vert pastel cohérent avec la charte
          Espacement : +20px après
          =============================================== */}
      <motion.div variants={itemVariants} className="mb-5 md:mb-5">
        <Skeleton loading={!isLoaded} lines={2} className="h-5">
          <p className="text-[15px] sm:text-base md:text-lg text-gray-700 max-w-2xl leading-relaxed">
            <strong className="text-gray-900">
              Smartphone, électroménager, ordinateur défectueux ?
            </strong>{' '}
            Lettre de mise en demeure 100% légale.{' '}
            <span className="inline-flex items-center px-2.5 py-1 bg-green-50 rounded-lg font-bold text-green-900 text-sm">
              Réparation, échange ou remboursement
            </span>{' '}
            garantis par la loi.
          </p>
        </Skeleton>
      </motion.div>

      {/* ===============================================
          SECTION 4 : BLOC AVANTAGES
          Icônes plus grandes, plus d'air, ombres douces
          Espacement : +24px après
          =============================================== */}
      <motion.div variants={itemVariants} className="mb-6 md:mb-5">
        <Skeleton loading={!isLoaded} className="h-28 w-full">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl">
            {[
              {
                label: 'Garantie légale obligatoire',
                icon: <Shield className="w-6 h-6 text-blue-700" />,
              },
              {
                label: 'Lettre prête à envoyer',
                icon: <FileText className="w-6 h-6 text-blue-700" />,
              },
              {
                label: 'Option envoi postal',
                icon: <Mail className="w-6 h-6 text-blue-700" />,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 bg-gradient-to-b from-white to-gray-50/50 border border-gray-200 rounded-xl px-3 py-4 shadow-sm hover:shadow-md transition-all text-center"
              >
                <div className="flex items-center justify-center w-10 h-10 bg-blue-50 rounded-lg">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-gray-800 leading-tight">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Skeleton>
      </motion.div>

      {/* ===============================================
          SECTION 5 : CTA PRINCIPAL
          Espacement : +16px avant, +24px après
          =============================================== */}
      <motion.div variants={itemVariants} className="mb-4 md:mb-4">
        <Skeleton loading={!isLoaded} className="h-14 w-full">
          {/* Mobile & Desktop : CTA centré */}
          <div className="flex justify-center md:justify-start">
            <Button
              href="/eligibilite#start"
              className="text-base px-8 py-3.5 shadow-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              icon={<Zap className="w-4 h-4" />}
              data-umami-event="hero-cta-click"
            >
              Récupérer mon argent
            </Button>
          </div>
        </Skeleton>
      </motion.div>

      {/* ===============================================
          SECTION 6 : CTA SECONDAIRE GHOST
          Style vraiment secondaire et léger
          Espacement : +24px après
          =============================================== */}
      <motion.div variants={itemVariants} className="mb-6 md:mb-4">
        <Skeleton loading={!isLoaded} className="h-12 w-full">
          <div className="flex justify-center md:justify-start">
            <button
              onClick={() => {
                document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white border-2 border-blue-300 rounded-lg text-sm text-blue-700 hover:bg-blue-50 hover:border-blue-400 font-medium transition-all shadow-sm"
            >
              <span>Comment ça marche</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </Skeleton>
      </motion.div>

      {/* ===============================================
          SECTION 7 : FOOTER VISUEL LÉGER
          Mini-rappel de confiance + dégradé
          =============================================== */}
      <motion.div variants={itemVariants} className="md:hidden mt-2">
        <div className="relative">
          {/* Dégradé subtil de fermeture */}
          <div className="absolute inset-x-0 -bottom-8 h-20 bg-gradient-to-b from-transparent via-blue-50/30 to-blue-50/50 pointer-events-none" />

          {/* Mini-rappel confiance */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-600 pt-4 pb-6">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Conforme au Code de la consommation</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
