'use client';
import * as React from 'react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { FileText, Shield, Sparkles, Zap, ArrowRight, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

export default function HomeHeroLeft() {
  const { shouldUseSimpleAnimations } = useMobileOptimization();
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const loadTimer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(loadTimer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldUseSimpleAnimations ? 0.1 : 0.2,
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
      className="space-y-5"
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? 'visible' : 'hidden'}
    >
      {/* Badges */}
      <motion.div variants={itemVariants}>
        <Skeleton loading={!isLoaded} className="h-8 w-full">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="green" className="font-semibold">
              <Shield className="w-3 h-3 mr-1" />
              Conforme à la loi
            </Badge>
            <Badge tone="blue" className="font-semibold">
              <Zap className="w-3 h-3 mr-1" />3 minutes max
            </Badge>
            <Badge tone="purple" className="font-semibold">
              <Sparkles className="w-3 h-3 mr-1" />
              Lettre gratuite
            </Badge>
          </div>
        </Skeleton>
      </motion.div>

      {/* Titre optimisé (conservé) */}
      <motion.div variants={itemVariants}>
        <Skeleton loading={!isLoaded} lines={4} className="h-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
            <span className="block">Produit défaillant ?</span>
            <span className="block bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
              Récupérez votre argent
            </span>
            <span className="block text-2xl sm:text-3xl lg:text-4xl text-gray-600 font-semibold mt-2">
              en moins de 3 minutes
            </span>
          </h1>
        </Skeleton>
      </motion.div>

      {/* Description (conservée) */}
      <motion.div variants={itemVariants}>
        <Skeleton loading={!isLoaded} lines={3} className="h-5">
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 max-w-2xl leading-relaxed">
            <strong className="text-gray-900">
              Smartphone cassé, électroménager en panne, ordinateur défectueux ?
            </strong>{' '}
            Obtenez gratuitement votre lettre de mise en demeure 100% légale.{' '}
            <span className="bg-yellow-100 px-1 rounded font-semibold text-gray-900">
              Réparation, remplacement ou remboursement
            </span>{' '}
            garantis par le Code de la consommation.
          </p>
        </Skeleton>
      </motion.div>

      {/* Features cards RAPETISSÉES */}
      <motion.div variants={itemVariants}>
        <Skeleton loading={!isLoaded} className="h-20 w-full">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-2xl">
            {[
              {
                label: 'Garantie légale obligatoire',
                icon: <Shield className="w-4 h-4 text-blue-700" />,
              },
              {
                label: 'Lettre prête à envoyer',
                icon: <FileText className="w-4 h-4 text-blue-700" />,
              },
              {
                label: 'Option envoi postal',
                icon: <Mail className="w-4 h-4 text-blue-700" />,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-3 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="flex-shrink-0">{item.icon}</div>
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

      {/* CTA Section ALIGNÉE HORIZONTALEMENT */}
      <motion.div variants={itemVariants}>
        <div className="space-y-4">
          <Skeleton loading={!isLoaded} className="h-12 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* CTA Principal */}
              <Button
                href="/eligibilite#start"
                className="text-base px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 font-bold"
                icon={<Zap className="w-5 h-5" />}
                data-umami-event="hero-cta-click"
              >
                Récupérer mon argent !
              </Button>

              {/* Comment ça marche - ALIGNÉ */}
              <Button
                href="/#process"
                variant="outline"
                className="text-base px-6 py-3"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Comment ça marche
              </Button>
            </div>
          </Skeleton>
        </div>
      </motion.div>
    </motion.div>
  );
}
