'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, FileText, Mail, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import * as React from 'react';
import Link from 'next/link';

import NoticeBanner from '@/components/ui/NoticeBanner';
import FeatureGrid from '@/components/ui/FeatureGrid';
import InlineHighLight from '@/components/ui/InlineHighLight';
import TrustFooter from '@/components/ui/TrustFooter';
import SectionBlock from '@/components/ui/SectionBlock';
import { cn } from '@/lib/utils';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

// shadcn
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HomeHeroLeft() {
  const { shouldUseSimpleAnimations } = useMobileOptimization();

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { duration: 0, delayChildren: 0 } },
  };

  const itemVariants = {
    hidden: { opacity: 1, y: 0 },
    visible: { opacity: 1, y: 0, transition: { duration: 0, ease: 'easeOut' } },
  };

  const scrollToProcess = () => {
    document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' });
  };

  const desktopBadges = [
    {
      label: 'Service Gratuit',
      icon: Sparkles,
      tone: 'green' as const,
      iconClass: 'text-green-600',
      badgeClass: 'bg-green-50 text-green-800 border border-green-200',
    },
    {
      label: 'Sans inscription',
      icon: Zap,
      tone: 'blue' as const,
      iconClass: 'text-blue-600',
      badgeClass: 'bg-blue-50 text-blue-800 border border-blue-200',
    },
    {
      label: 'Conforme à la loi',
      icon: Shield,
      tone: 'purple' as const,
      iconClass: 'text-purple-600',
      badgeClass: 'bg-purple-50 text-purple-800 border border-purple-200',
    },
  ];

  const features = [
    { label: 'Garantie légale', icon: <Shield className="w-6 h-6 text-blue-700" /> },
    { label: 'Lettre prête à envoyer', icon: <FileText className="w-6 h-6 text-blue-700" /> },
    { label: 'Option envoi postal', icon: <Mail className="w-6 h-6 text-blue-700" /> },
  ];

  return (
    <motion.div
      className="flex flex-col justify-center min-h-[calc(100vh-160px)] md:min-h-0 py-8 md:py-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* SECTION 1 : BANDEAU GRATUIT */}
      <SectionBlock variants={itemVariants} className="mb-8 md:mb-5">
        {/* Mobile */}
        <div className="md:hidden">
          <NoticeBanner
            variant="green"
            icon={<Sparkles className="w-6 h-6 text-green-600" />}
            title="Service 100% gratuit"
            subtitle="Options de confort disponibles"
          />
        </div>

        {/* Desktop */}
        <div className="hidden md:flex flex-wrap items-center gap-3">
          {desktopBadges.map((b, i) => {
            const Icon = b.icon;
            return (
              <Badge
                key={i}
                className={cn('inline-flex items-center gap-1.5 text-xs', b.badgeClass)}
              >
                <Icon className={cn('w-3.5 h-3.5', b.iconClass)} />
                {b.label}
              </Badge>
            );
          })}
        </div>
      </SectionBlock>

      {/* SECTION 2 : TITRE */}
      <SectionBlock variants={itemVariants} className="mb-5 md:mb-5">
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
      </SectionBlock>

      {/* SECTION 3 : DESCRIPTION */}
      <SectionBlock variants={itemVariants} className="mb-5 md:mb-5">
        <p className="text-[15px] sm:text-base md:text-lg text-gray-700 max-w-2xl leading-relaxed">
          <strong className="text-gray-900">
            Smartphone, électroménager, ordinateur défectueux ?
          </strong>{' '}
          Lettre de mise en demeure 100% légale.{' '}
          <InlineHighLight variant="green">Réparation, échange ou remboursement</InlineHighLight>{' '}
          garantis par la loi.
        </p>
      </SectionBlock>

      {/* SECTION 4 : AVANTAGES */}
      <SectionBlock variants={itemVariants} className="mb-6 md:mb-5">
        <FeatureGrid items={features} />
      </SectionBlock>

      {/* SECTION 5 : CTA PRINCIPAL */}
      <SectionBlock variants={itemVariants} className="mb-4 md:mb-4">
        <div className="flex justify-center md:justify-start">
          <Button
            asChild
            size="lg"
            data-umami-event="hero-cta-click"
            className={cn(
              'shadow-lg font-bold text-white',
              'bg-gradient-to-r from-blue-600 to-indigo-600',
              'hover:from-blue-700 hover:to-indigo-700',
            )}
          >
            <Link href="/eligibilite" className="inline-flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Récupérer mon argent
            </Link>
          </Button>
        </div>
      </SectionBlock>

      {/* SECTION 6 : CTA SECONDAIRE */}
      <SectionBlock variants={itemVariants} className="mb-6 md:mb-4">
        <div className="flex justify-center md:justify-start">
          <Button
            type="button"
            variant="outline"
            size="default"
            onClick={scrollToProcess}
            className="border-2 border-blue-300 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-400 shadow-sm"
          >
            <span className="inline-flex items-center gap-2">
              Comment ça marche
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
        </div>
      </SectionBlock>

      {/* SECTION 7 : FOOTER MOBILE */}
      <SectionBlock variants={itemVariants} className="md:hidden mt-2">
        <TrustFooter icon={<CheckCircle className="w-4 h-4 text-green-600" />}>
          Conforme au Code de la consommation
        </TrustFooter>
      </SectionBlock>
    </motion.div>
  );
}
